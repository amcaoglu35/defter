import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /api routes except /api/auth
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    const masterPassword = process.env.DEFTER_ACCESS_PASSWORD;

    // Fail-Closed: If server password environment variable is missing, deny access
    if (!masterPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Sunucu yapılandırma hatası: erişim şifresi tanımlı değil.",
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
