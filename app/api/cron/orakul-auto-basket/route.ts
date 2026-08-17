import { NextResponse } from "next/server";
import { generateAiModelBaskets } from "@/lib/aiToolsService";

export async function GET(req: Request) {
  return handleAutoBasket(req);
}

export async function POST(req: Request) {
  return handleAutoBasket(req);
}

async function handleAutoBasket(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Defense in depth: Check CRON_SECRET if configured (without authHeader && bug)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim (Geçersiz CRON_SECRET)" }, { status: 401 });
  }

  // Header-based API key (if passed via worker/service)
  const headerKey = req.headers.get("x-gemini-key")?.trim();

  try {
    const baskets = await generateAiModelBaskets({ customApiKey: headerKey });
    return NextResponse.json({
      success: true,
      baskets,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Autonomous Auto-Basket Cron Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Otonom sepet oluşturma hatası" },
      { status: 500 }
    );
  }
}
