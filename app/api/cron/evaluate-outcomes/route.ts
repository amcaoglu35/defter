import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { evaluatePendingOutcomesServerSide, computeConfidenceCalibration } from "@/lib/aiAccuracy";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function GET(req: Request) {
  return handleEvaluateCron(req);
}

export async function POST(req: Request) {
  return handleEvaluateCron(req);
}

async function handleEvaluateCron(req: Request) {
  // 1. Mandatory CRON_SECRET verification (Fail-Closed Protection)
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[Cron: evaluate-outcomes] CRON_SECRET env değişkeni tanımlı değil — fail-closed koruması devrede, istek reddedildi.");
    return NextResponse.json(
      { error: "Sunucu yapılandırma hatası: CRON_SECRET eksik." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim (Invalid CRON_SECRET)" }, { status: 401 });
  }

  // 2. IP-based Rate Limiting (Defense in Depth: max 5 requests per minute)
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`cron:evaluate-outcomes:${clientIp}`, 5, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase Admin yapılandırılmamış." },
      { status: 503 }
    );
  }

  try {
    const outcomeResult = await evaluatePendingOutcomesServerSide(supabaseAdmin);
    const calibrationResult = await computeConfidenceCalibration(supabaseAdmin);

    return NextResponse.json({
      success: true,
      evaluated: outcomeResult.evaluated,
      updatedIds: outcomeResult.updatedIds,
      calibration: calibrationResult,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Cron: evaluate-outcomes] Değerlendirme hatası:", err);
    return NextResponse.json(
      { error: "AI kararları değerlendirilirken hata oluştu." },
      { status: 500 }
    );
  }
}
