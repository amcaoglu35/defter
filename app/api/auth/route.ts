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
  SESSION_COOKIE_NAME,
} from "@/lib/session";

/**
 * GET /api/auth
 * Checks if current user has a valid httpOnly session cookie.
 */
export async function GET(req: Request) {
  const masterPassword = getMasterPassword();
  if (!masterPassword) {
    return NextResponse.json(
      { success: false, authenticated: false, error: "Sunucu yapılandırma hatası: DEFTER_ACCESS_PASSWORD ortam değişkeni tanımlı değil." },
      { status: 500 }
    );
  }

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
}

/**
 * POST /api/auth
 * Handles login and logout actions. Sets httpOnly session cookie on successful login.
 */
export async function POST(req: Request) {
  // Rate limiting (10 auth attempts per minute per IP)
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`auth:${clientIp}`, 10, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const masterPassword = getMasterPassword();
  if (!masterPassword) {
    return NextResponse.json(
      { success: false, error: "Sunucu yapılandırma hatası: DEFTER_ACCESS_PASSWORD ortam değişkeni tanımlı değil." },
      { status: 500 }
    );
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

      if (currentPassword !== masterPassword) {
        return NextResponse.json(
          { success: false, error: "Mevcut şifre hatalı. Lütfen tekrar deneyin." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Mevcut şifreniz doğrulandı. Sunucu seviyesinde kalıcı değişim için Vercel panelinizden DEFTER_ACCESS_PASSWORD ortam değişkenini güncelleyin.",
      });
    }

    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Lütfen bir şifre girin." },
        { status: 400 }
      );
    }

    if (password === masterPassword) {
      const sessionToken = await createSessionToken(masterPassword);
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
      { success: false, error: "Hatalı şifre. Lütfen tekrar deneyin." },
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
