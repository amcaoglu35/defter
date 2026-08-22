import { NextResponse } from "next/server";
import { runAutonomousScan } from "@/lib/aiToolsService";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function GET(req: Request) {
  return handleAutonomousScan(req);
}

export async function POST(req: Request) {
  return handleAutonomousScan(req);
}

async function handleAutonomousScan(req: Request) {
  // 1. Mandatory CRON_SECRET verification (Fail-Closed Protection)
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[Cron: orakul-scanner] CRON_SECRET env değişkeni tanımlı değil — fail-closed koruması devrede.");
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
  const rateLimit = await checkRateLimit(`cron:orakul-scanner:${clientIp}`, 2, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const url = new URL(req.url);
  const countParam = parseInt(url.searchParams.get("count") || "10", 10);
  const targetCount = Math.min(Math.max(countParam, 3), 20);

  // Header-based API key (if passed via worker/service)
  const headerKey = req.headers.get("x-gemini-key")?.trim();

  try {
    const scans = await runAutonomousScan({ count: targetCount, customApiKey: headerKey });
    return NextResponse.json({
      success: true,
      scannedCount: scans.length,
      scans,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("[Autonomous Scanner Cron Error]:", error);
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || "Otonom tarama sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
