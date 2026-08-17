import { NextResponse } from "next/server";
import { runAutonomousScan } from "@/lib/aiToolsService";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`ai-tools:scanner:${clientIp}`, 15, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  // Safe retrieval of custom API key from HTTP header, request body, or httpOnly cookie
  const headerKey = req.headers.get("x-gemini-key")?.trim();
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieMatch = cookieHeader.match(/(?:^|; )\s*defter_ai_key\s*=\s*([^;]+)/);
  const cookieKey = cookieMatch ? decodeURIComponent(cookieMatch[1]).trim() : undefined;
  let bodyKey: string | undefined;
  let count: number | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    if (body) {
      if (typeof body.apiKey === "string") {
        bodyKey = body.apiKey.trim();
      }
      if (typeof body.count === "number") {
        count = body.count;
      }
    }
  } catch {}

  const effectiveApiKey = headerKey || bodyKey || (cookieKey && cookieKey.length > 5 ? cookieKey : undefined);

  try {
    const scans = await runAutonomousScan({ count, customApiKey: effectiveApiKey });
    return NextResponse.json({
      success: true,
      scannedCount: scans.length,
      scans,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[AI Tools Autonomous Scan Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Otonom tarama sırasında hata oluştu." },
      { status: 500 }
    );
  }
}
