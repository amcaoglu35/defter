import { NextResponse } from "next/server";
import { runAutonomousScan } from "@/lib/aiToolsService";

export async function GET(req: Request) {
  return handleAutonomousScan(req);
}

export async function POST(req: Request) {
  return handleAutonomousScan(req);
}

async function handleAutonomousScan(req: Request) {
  const url = new URL(req.url);
  const countParam = parseInt(url.searchParams.get("count") || "10", 10);
  const targetCount = Math.min(Math.max(countParam, 3), 20);

  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Defense in depth: Check CRON_SECRET if configured (without authHeader && bug)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim (Geçersiz CRON_SECRET)" }, { status: 401 });
  }

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
