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
    const { type, payload, messages, context, history, provider, apiKey } = body;
    const selectedProvider = provider || "gemini";

    // 2. Connection Test endpoint with live API ping
    if (type === "test_connection") {
      const envKey =
        selectedProvider === "openai"
          ? process.env.OPENAI_API_KEY
          : process.env.GEMINI_API_KEY;

      const effectiveKey = (apiKey && typeof apiKey === "string" && apiKey.trim().length > 10)
        ? apiKey.trim()
        : envKey;

      if (!effectiveKey || effectiveKey.length <= 10) {
        return NextResponse.json({
          success: true,
          provider: selectedProvider,
          isConfigured: false,
          message: `${selectedProvider.toUpperCase()} API anahtarı girilmedi veya sunucu ortamında bulunamadı. Yerel çevrimdışı motor aktif.`,
        });
      }

      // Live Ping Test
      try {
        if (selectedProvider === "gemini") {
          const testEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`;
          const testRes = await fetch(testEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: "ping" }] }],
            }),
          });
          if (testRes.ok) {
            return NextResponse.json({
              success: true,
              provider: selectedProvider,
              isConfigured: true,
              message: "Google Gemini API anahtarı ve bağlantısı başarıyla doğrulandı ✓ (Gerçek AI Aktif)",
            });
          } else {
            const errData = await testRes.json().catch(() => ({}));
            return NextResponse.json({
              success: true,
              provider: selectedProvider,
              isConfigured: false,
              message: `Gemini API bağlantısı başarısız: ${errData.error?.message || testRes.statusText || "Geçersiz API Anahtarı"}`,
            });
          }
        } else if (selectedProvider === "openai") {
          const testRes = await fetch("https://api.openai.com/v1/models", {
            headers: { Authorization: `Bearer ${effectiveKey}` },
          });
          if (testRes.ok) {
            return NextResponse.json({
              success: true,
              provider: selectedProvider,
              isConfigured: true,
              message: "OpenAI API anahtarı ve bağlantısı başarıyla doğrulandı ✓ (Gerçek AI Aktif)",
            });
          } else {
            return NextResponse.json({
              success: true,
              provider: selectedProvider,
              isConfigured: false,
              message: "OpenAI API anahtarı geçersiz veya yetkisiz.",
            });
          }
        }
      } catch (err: unknown) {
        return NextResponse.json({
          success: true,
          provider: selectedProvider,
          isConfigured: false,
          message: `API sunucu bağlantı hatası: ${String(err)}`,
        });
      }

      return NextResponse.json({
        success: true,
        provider: selectedProvider,
        isConfigured: true,
        message: `${selectedProvider.toUpperCase()} API anahtarı aktif.`,
      });
    }

    // 3. AI Service calls with optional custom user apiKey
    if (type === "recipe") {
      const recipe = await generateOrakulRecipe(payload, apiKey, selectedProvider);
      return NextResponse.json({ success: true, data: recipe });
    }

    if (type === "chat") {
      const reply = await askOrakulChat(
        messages || [],
        context || {},
        apiKey,
        selectedProvider
      );
      return NextResponse.json({ success: true, reply });
    }

    if (type === "company_analysis") {
      const analysis = await generateCompanyAnalysis(
        payload,
        history || [],
        apiKey,
        selectedProvider
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
