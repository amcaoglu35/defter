import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    // Server-side password check without client-side exposure
    const masterPassword = process.env.DEFTER_ACCESS_PASSWORD || "defter2026";

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Lütfen bir şifre girin." },
        { status: 400 }
      );
    }

    if (password === masterPassword) {
      return NextResponse.json({
        success: true,
        message: "Kasa kilidi başarıyla açıldı.",
        token: "authenticated_user",
      });
    }

    return NextResponse.json(
      { success: false, error: "Hatalı şifre. Lütfen tekrar deneyin." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Kimlik doğrulama hatası" },
      { status: 500 }
    );
  }
}
