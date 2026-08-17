import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, getMasterPassword, SESSION_COOKIE_NAME } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Cron routes (/api/cron/*) - Authenticated via Bearer CRON_SECRET (Vercel Cron / Cloud Schedulers)
  if (pathname.startsWith("/api/cron/")) {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || cronSecret.trim().length === 0) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            success: false,
            error: "CRON_SECRET yapılandırılmamış, cron endpoint'leri devre dışı.",
          },
          { status: 503 }
        );
      }
    } else {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          {
            success: false,
            error: "Yetkisiz erişim (Geçersiz CRON_SECRET).",
          },
          { status: 401 }
        );
      }
    }
    return NextResponse.next();
  }

  // 2. Protect all other /api routes except /api/auth
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    let masterPassword: string;
    try {
      masterPassword = getMasterPassword();
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Sistem yapılandırma hatası: DEFTER_ACCESS_PASSWORD ortam değişkeni ayarlanmamış.",
        },
        { status: 500 }
      );
    }
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        {
          success: false,
          error: "Yetkisiz erişim. Lütfen kasa şifrenizle giriş yapın.",
        },
        { status: 401 }
      );
    }

    const isValid = await verifySessionToken(sessionCookie, masterPassword);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Oturum süresi dolmuş veya geçersiz. Lütfen tekrar giriş yapın.",
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
