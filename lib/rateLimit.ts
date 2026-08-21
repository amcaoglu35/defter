import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (fallback when Supabase is not configured or offline)
const ipRequestMap = new Map<string, RateLimitStore>();

/**
 * Get client IP address from request headers.
 * Prioritizes trusted platform headers that cannot be forged by clients (Vercel, Cloudflare, Edge Proxy)
 * and falls back to the rightmost (closest trusted edge) IP in x-forwarded-for.
 */
export function getClientIp(req: Request): string {
  // 1. Vercel trusted platform header (injected by Vercel infrastructure, client cannot override)
  const vercelForwardedFor = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    const ips = vercelForwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
    if (ips.length > 0) return ips[0];
  }

  // 2. Cloudflare trusted header
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  // 3. x-real-ip header (set by trusted reverse proxy like Nginx or Vercel edge)
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // 4. Fallback: x-forwarded-for
  // CRITICAL: Take the RIGHTMOST IP (appended by the closest proxy/edge), NOT the leftmost IP (which can be forged by client)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
    if (ips.length > 0) {
      return ips[ips.length - 1];
    }
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
 * Distributed rate limiter with Supabase atomic RPC persistence
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

    // Try atomic RPC increment in Supabase first (eliminates race conditions)
    const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc("increment_rate_limit", {
      p_id: identifier,
      p_window_ms: windowMs,
      p_now: now,
    });

    if (!rpcErr && rpcData && rpcData.length > 0) {
      const currentCount = Number(rpcData[0].count);
      const resetTime = Number(rpcData[0].reset_time);
      const resetInSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

      if (currentCount > maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetInSeconds,
        };
      }

      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - currentCount),
        resetInSeconds,
      };
    }

    // Fallback: standard select & upsert if RPC function has not yet been migrated in Supabase
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

    // New or expired window
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

    // Limit exceeded
    if (record.count >= maxRequests) {
      const resetInSeconds = Math.max(1, Math.ceil((resetTimeNum - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds,
      };
    }

    // Increment count
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
 * Sanitizes URLs, error messages, and logs to prevent accidental exposure of API keys.
 */
export function sanitizeLogMessage(input: unknown): string {
  if (!input) return "";
  let str = typeof input === "string" ? input : (input as Error)?.stack || (input as Error)?.message || JSON.stringify(input);
  // Redact ?key=... or &key=... from Google / OpenAI API endpoints
  str = str.replace(/(?:key|apiKey|api_key|token)=([a-zA-Z0-9_\-\.]{8,})/gi, "key=***REDACTED***");
  // Redact Authorization: Bearer ...
  str = str.replace(/Bearer\s+([a-zA-Z0-9_\-\.]{8,})/gi, "Bearer ***REDACTED***");
  return str;
}

/**
 * Standardized error formatting helper for API routes.
 * Logs full error details to server console with credentials redacted, and returns sanitized error message in production.
 */
export function formatApiError(
  error: unknown,
  defaultMessage: string = "İşlem sırasında bir hata oluştu, lütfen tekrar deneyin.",
  status: number = 500
): NextResponse {
  const sanitized = sanitizeLogMessage(error);
  console.error("[API Error]", sanitized);

  const isDev = process.env.NODE_ENV === "development";
  const errorMessage = isDev
    ? (error as Error)?.message ? sanitizeLogMessage((error as Error).message) : defaultMessage
    : defaultMessage;

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status }
  );
}

/**
 * Granular rate limit tier determination by Orakul action type.
 * Prevents cheap actions (ping/test) from depleting expensive LLM quotas.
 */
export function getOrakulRateLimitTier(type: string): { keyPrefix: string; maxRequests: number; windowMs: number } {
  switch (type) {
    case "test_connection":
      return { keyPrefix: "orakul:ping", maxRequests: 30, windowMs: 60000 };
    case "recipe":
    case "company_analysis":
    case "earnings_flash":
    case "value_trap":
    case "backtest":
    case "chat":
    case "weekly_letter":
      return { keyPrefix: "orakul:heavy", maxRequests: 10, windowMs: 60000 };
    case "screener":
    case "daily_brief":
    case "sentiment":
    default:
      return { keyPrefix: "orakul:standard", maxRequests: 20, windowMs: 60000 };
  }
}

/**
 * Verifies that the incoming request originates from the same site (CSRF & Proxy Embedding Protection)
 */
export function isAllowedOrigin(req: Request): boolean {
  // Allow CLI or server-side calls without origin in development
  const origin = req.headers.get("origin") || req.headers.get("referer");
  const host = req.headers.get("host");

  if (!origin || !host) {
    // Non-browser or direct server-to-server request
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const hostName = host.split(":")[0];
    const originHostName = originUrl.hostname;

    return originHostName === hostName || originHostName === "localhost" || originHostName === "127.0.0.1";
  } catch {
    return false;
  }
}
