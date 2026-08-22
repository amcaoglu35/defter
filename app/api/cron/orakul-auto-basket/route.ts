import { NextResponse } from "next/server";
import { generateAiModelBaskets } from "@/lib/aiToolsService";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function GET(req: Request) {
  return handleAutoBasket(req);
}

export async function POST(req: Request) {
  return handleAutoBasket(req);
}

async function handleAutoBasket(req: Request) {
  // 1. Mandatory CRON_SECRET verification (Fail-Closed Protection)
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[Cron: orakul-auto-basket] CRON_SECRET env değişkeni tanımlı değil — fail-closed koruması devrede.");
    return NextResponse.json(
      { error: "Sunucu yapılandırma hatası: CRON_SECRET eksik." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim (Geçersiz CRON_SECRET)" }, { status: 401 });
  }

  // 2. IP-based Rate Limiting (Defense in Depth: max 2 requests per minute)
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`cron:orakul-auto-basket:${clientIp}`, 2, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
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
  } catch (error: unknown) {
    console.error("[Autonomous Auto-Basket Cron Error]:", error);
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || "Otonom sepet oluşturma hatası" },
      { status: 500 }
    );
  }
}
