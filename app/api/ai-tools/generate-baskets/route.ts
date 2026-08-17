import { NextResponse } from "next/server";
import { generateAiModelBaskets } from "@/lib/aiToolsService";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`ai-tools:baskets:${clientIp}`, 10, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  // Safe retrieval of custom API key from HTTP header, request body, or httpOnly cookie
  const headerKey = req.headers.get("x-gemini-key")?.trim();
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieMatch = cookieHeader.match(/(?:^|; )\s*defter_ai_key\s*=\s*([^;]+)/);
  const cookieKey = cookieMatch ? decodeURIComponent(cookieMatch[1]).trim() : undefined;
  let bodyKey: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    if (body && typeof body.apiKey === "string") {
      bodyKey = body.apiKey.trim();
    }
  } catch {}

  const effectiveApiKey = headerKey || bodyKey || (cookieKey && cookieKey.length > 5 ? cookieKey : undefined);

  try {
    const baskets = await generateAiModelBaskets({ customApiKey: effectiveApiKey });
    return NextResponse.json({
      success: true,
      baskets,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[AI Tools Generate Baskets Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Model sepetler oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
