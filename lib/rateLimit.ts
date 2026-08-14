import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (fallback when Supabase is not configured or offline)
const ipRequestMap = new Map<string, RateLimitStore>();

/**
 * Get client IP address from request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

function checkInMemoryRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const record = ipRequestMap.get(identifier);

  // Clean up expired entries periodically
  if (ipRequestMap.size > 1000) {
    for (const [key, entry] of ipRequestMap.entries()) {
      if (now > entry.resetTime) {
        ipRequestMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    ipRequestMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    const resetInSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: resetInSeconds > 0 ? resetInSeconds : 1,
    };
  }

  // Increment request count
  record.count += 1;
  const remaining = maxRequests - record.count;
  const resetInSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    allowed: true,
    remaining,
    resetInSeconds: resetInSeconds > 0 ? resetInSeconds : 1,
  };
}

/**
 * Distributed rate limiter with Supabase persistence (table: rate_limits: id, count, reset_time)
 * with in-memory Map fallback.
 * @param identifier Unique identifier (e.g. IP address + route name)
 * @param maxRequests Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default 60000ms = 1 minute)
 * @returns Promise<{ allowed: boolean, remaining: number, resetInSeconds: number }>
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return checkInMemoryRateLimit(identifier, maxRequests, windowMs);
  }

  try {
    const now = Date.now();

    // 1. Fetch current record from Supabase
    const { data: record, error: fetchErr } = await supabaseAdmin
      .from("rate_limits")
      .select("id, count, reset_time")
      .eq("id", identifier)
      .maybeSingle();

    if (fetchErr) {
      console.warn("[RateLimit] Supabase query failed, falling back to memory:", fetchErr.message);
      return checkInMemoryRateLimit(identifier, maxRequests, windowMs);
    }

    const resetTimeNum = record?.reset_time ? Number(record.reset_time) : 0;

    // 2. New or expired window
    if (!record || now > resetTimeNum) {
      const newResetTime = now + windowMs;
      await supabaseAdmin.from("rate_limits").upsert(
        {
          id: identifier,
          count: 1,
          reset_time: newResetTime,
        },
        { onConflict: "id" }
      );

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetInSeconds: Math.ceil(windowMs / 1000),
      };
    }

    // 3. Limit exceeded
    if (record.count >= maxRequests) {
      const resetInSeconds = Math.max(1, Math.ceil((resetTimeNum - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds,
      };
    }

    // 4. Increment count
    const nextCount = (record.count || 0) + 1;
    await supabaseAdmin
      .from("rate_limits")
      .update({ count: nextCount })
      .eq("id", identifier);

    const remaining = Math.max(0, maxRequests - nextCount);
    const resetInSeconds = Math.max(1, Math.ceil((resetTimeNum - now) / 1000));

    return {
      allowed: true,
      remaining,
      resetInSeconds,
    };
  } catch (err) {
    console.warn("[RateLimit] Unexpected error, falling back to memory:", err);
    return checkInMemoryRateLimit(identifier, maxRequests, windowMs);
  }
}

/**
 * Returns a standardized 429 Too Many Requests response
 */
export function createRateLimitResponse(resetInSeconds: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: `Çok fazla istek gönderildi. Lütfen ${resetInSeconds} saniye sonra tekrar deneyin.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetInSeconds),
      },
    }
  );
}

/**
 * Standardized error formatting helper for API routes.
 * Logs full error details to server console, and returns sanitized error message in production.
 */
export function formatApiError(
  error: unknown,
  defaultMessage: string = "İşlem sırasında bir hata oluştu, lütfen tekrar deneyin.",
  status: number = 500
): NextResponse {
  console.error("[API Error]", error);

  const isDev = process.env.NODE_ENV === "development";
  const errorMessage = isDev
    ? (error as Error)?.message || String(error)
    : defaultMessage;

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status }
  );
}
