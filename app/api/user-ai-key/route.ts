import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  getMasterPassword,
  SESSION_COOKIE_NAME,
} from "@/lib/session";

export const AI_KEY_COOKIE_NAME = "defter_ai_key";

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return false;

  let masterPassword = "";
  try {
    masterPassword = getMasterPassword();
  } catch {
    return false;
  }

  return verifySessionToken(sessionCookie, masterPassword);
}

export async function GET(req: NextRequest) {
  const auth = await isAuthenticated(req);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Yetkisiz erişim" }, { status: 401 });
  }

  const aiKey = req.cookies.get(AI_KEY_COOKIE_NAME)?.value;
  const isConfigured = Boolean(aiKey && aiKey.trim().length > 5);

  return NextResponse.json({
    ok: true,
    isConfigured,
    hasKey: isConfigured,
  });
}

export async function POST(req: NextRequest) {
  const auth = await isAuthenticated(req);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";

    const res = NextResponse.json({
      ok: true,
      isConfigured: Boolean(apiKey),
      message: apiKey ? "AI API anahtarı güvenli httpOnly cookie'de saklandı." : "AI API anahtarı kaldırıldı.",
    });

    res.cookies.set(AI_KEY_COOKIE_NAME, apiKey || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: apiKey ? 60 * 60 * 24 * 30 : 0, // 30 days or delete
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "İşlem sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await isAuthenticated(req);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Yetkisiz erişim" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, message: "AI API anahtarı temizlendi." });
  res.cookies.set(AI_KEY_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return res;
}
