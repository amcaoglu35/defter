import { NextResponse } from "next/server";
import {
  generateOrakulRecipe,
  generateCompanyAnalysis,
  askOrakulChat,
} from "@/lib/aiService";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
  formatApiError,
} from "@/lib/rateLimit";

export async function POST(req: Request) {
  // 1. Rate Limiting (10 requests per minute per IP)
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`orakul:${clientIp}`, 10, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await req.json();
    const { type, payload, messages, context, history, provider } = body;

    // 2. Server-side Connection Test endpoint
    if (type === "test_connection") {
      const selectedProvider = provider || "gemini";
      const envKey =
        selectedProvider === "openai"
          ? process.env.OPENAI_API_KEY
          : process.env.GEMINI_API_KEY;

      const isConfigured = Boolean(envKey && envKey.trim().length > 10);
      return NextResponse.json({
        success: true,
        provider: selectedProvider,
        isConfigured,
        message: isConfigured
          ? `${selectedProvider.toUpperCase()} API anahtarı sunucu ortam değişkenlerinde tanımlı ve aktif.`
          : `${selectedProvider.toUpperCase()} API anahtarı sunucu ortam değişkenlerinde bulunamadı. Yerel kural motoru aktif.`,
      });
    }

    // 3. AI Service calls without client apiKey
    if (type === "recipe") {
      const recipe = await generateOrakulRecipe(payload, undefined, provider);
      return NextResponse.json({ success: true, data: recipe });
    }

    if (type === "chat") {
      const reply = await askOrakulChat(
        messages || [],
        context || {},
        undefined,
        provider
      );
      return NextResponse.json({ success: true, reply });
    }

    if (type === "company_analysis") {
      const analysis = await generateCompanyAnalysis(
        payload,
        history || [],
        undefined,
        provider
      );
      return NextResponse.json({
        success: true,
        data: analysis,
      });
    }

    return NextResponse.json(
      { success: false, error: "Geçersiz işlem türü" },
      { status: 400 }
    );
  } catch (error: unknown) {
    return formatApiError(error, "Orakul AI analizi sırasında bir hata oluştu.");
  }
}

export async function GET() {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 10);

  return NextResponse.json({
    success: true,
    geminiConfigured: hasGemini,
    openaiConfigured: hasOpenAI,
    isRealAiActive: hasGemini || hasOpenAI,
    activeProvider: hasGemini ? "gemini" : hasOpenAI ? "openai" : "fallback",
    modeText: (hasGemini || hasOpenAI) ? "GERÇEK AI AKTİF" : "ŞABLON MODU / YEDEK",
  });
}
