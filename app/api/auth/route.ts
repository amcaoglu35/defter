import { NextResponse } from "next/server";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
  formatApiError,
} from "@/lib/rateLimit";
import {
  createSessionToken,
  verifySessionToken,
  getMasterPassword,
  verifyMasterPassword,
  setStoredMasterPassword,
  SESSION_COOKIE_NAME,
} from "@/lib/session";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/auth
 * Checks if current user has a valid httpOnly session cookie.
 */
export async function GET(req: Request) {
  try {
    const masterPassword = getMasterPassword();

    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`(?:^|; )\\s*${SESSION_COOKIE_NAME}\\s*=\\s*([^;]+)`));
    const token = match ? decodeURIComponent(match[1]) : "";

    const isValid = await verifySessionToken(token, masterPassword);
    if (isValid) {
      return NextResponse.json({ success: true, authenticated: true });
    }

    return NextResponse.json(
      { success: false, authenticated: false, error: "Oturum süresi dolmuş veya geçersiz." },
      { status: 401 }
    );
  } catch (error: unknown) {
    return formatApiError(error, "Kimlik doğrulama durumu kontrol edilirken bir hata oluştu.");
  }
}

/**
 * POST /api/auth
 * Handles login, change_password, and logout actions. Sets httpOnly session cookie on successful login.
 */
export async function POST(req: Request) {
  // Rate limiting (10 auth attempts per minute per IP)
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`auth:${clientIp}`, 10, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await req.json();

    // Logout Action
    if (body?.action === "logout") {
      const response = NextResponse.json({
        success: true,
        message: "Kasadan güvenle çıkış yapıldı.",
      });
      response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });
      return response;
    }

    // Change Password Action
    if (body?.action === "change_password") {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || typeof currentPassword !== "string") {
        return NextResponse.json(
          { success: false, error: "Lütfen mevcut şifrenizi girin." },
          { status: 400 }
        );
      }
      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 4) {
        return NextResponse.json(
          { success: false, error: "Yeni şifre en az 4 karakter olmalıdır." },
          { status: 400 }
        );
      }

      // Verify current password via DB or env
      const authResult = await verifyMasterPassword(currentPassword);
      if (!authResult.valid) {
        return NextResponse.json(
          { success: false, error: "Mevcut şifre hatalı. Lütfen tekrar deneyin." },
          { status: 401 }
        );
      }

      // Persist to Supabase if Admin is configured
      if (isSupabaseAdminConfigured && supabaseAdmin) {
        const saved = await setStoredMasterPassword(newPassword);
        if (saved) {
          const sessionToken = await createSessionToken(newPassword);
          const response = NextResponse.json({
            success: true,
            isPermanent: true,
            message: "Kasa şifresi Supabase bulut veritabanında kalıcı olarak güncellendi.",
          });
          response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          return response;
        }
      }

      return NextResponse.json({
        success: true,
        isPermanent: false,
        message:
          "Mevcut şifre doğrulandı. Ancak Supabase bulut veritabanı bağlı olmadığı için şifre sunucuda kalıcı kaydedilemedi. Kalıcı değişim için Vercel panelinizden DEFTER_ACCESS_PASSWORD ortam değişkenini güncelleyin.",
      });
    }

    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Lütfen bir şifre girin." },
        { status: 400 }
      );
    }

    // Dynamic verification (Supabase app_settings -> env -> dev fallback)
    const authResult = await verifyMasterPassword(password);
    if (authResult.valid) {
      let activeMaster: string;
      try {
        activeMaster = getMasterPassword();
      } catch {
        activeMaster = password;
      }
      const sessionToken = await createSessionToken(activeMaster);
      const response = NextResponse.json({
        success: true,
        message: "Kasa kilidi başarıyla açıldı.",
      });

      // Priority 3: httpOnly session cookie
      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: authResult.reason || "Hatalı şifre. Lütfen tekrar deneyin.",
      },
      { status: 401 }
    );
  } catch (error: unknown) {
    return formatApiError(error, "Kimlik doğrulama işlemi sırasında bir hata oluştu.");
  }
}

/**
 * DELETE /api/auth
 * Clears httpOnly session cookie to lock vault.
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Kasadan çıkış yapıldı.",
  });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return response;
}
