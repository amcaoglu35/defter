import { NextResponse } from "next/server";
import {
  generateOrakulRecipe,
  generateCompanyAnalysis,
  askOrakulChat,
  GEMINI_MODEL,
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
    const { type, payload, messages, context, history, provider, apiKey, model } = body;
    const selectedProvider = provider || "gemini";
    const reqModel = (model && typeof model === "string" && model.trim().length > 0) ? model.trim() : GEMINI_MODEL;

    // 2. Connection Test endpoint with live API ping
    if (type === "test_connection") {
      const envKey =
        selectedProvider === "openai"
          ? process.env.OPENAI_API_KEY
          : process.env.GEMINI_API_KEY;

      const rawKey = (apiKey && typeof apiKey === "string") ? apiKey.trim().replace(/^["']|["']$/g, "") : "";
      const effectiveKey = rawKey.length > 10 ? rawKey : (envKey ? envKey.trim().replace(/^["']|["']$/g, "") : "");

      if (!effectiveKey || effectiveKey.length <= 10) {
        return NextResponse.json({
          success: true,
          provider: selectedProvider,
          isConfigured: false,
          message: `${selectedProvider.toUpperCase()} API anahtarı girilmedi veya sunucu ortamında bulunamadı. Yerel çevrimdışı motor aktif.`,
        });
      }

      // Live Ping Test with Detailed Error Diagnostics
      try {
        if (selectedProvider === "gemini") {
          const modelsToTry = [reqModel, "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];
          let rawGoogleError = "";
          let successModel = "";

          for (const modelCandidate of Array.from(new Set(modelsToTry))) {
            const testEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${effectiveKey}`;
            const testRes = await fetch(testEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "ping" }] }],
              }),
            });

            if (testRes.ok) {
              successModel = modelCandidate;
              break;
            } else {
              const errData = await testRes.json().catch(() => ({}));
              const msg = errData.error?.message || testRes.statusText || "Geçersiz API Anahtarı";
              if (!rawGoogleError) rawGoogleError = msg;

              if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
                rawGoogleError = `Google API Anahtarı Geçersiz (API_KEY_INVALID). Anahtarın başındaki 'AIzaSy...' ifadesinin tam yazıldığından emin olun.`;
                break;
              }
              if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("Quota")) {
                rawGoogleError = `Kota Aşımı (RESOURCE_EXHAUSTED): Anahtarın ücretsiz kullanım limiti veya dakikalık çağrı sınırı dolmuş.`;
                break;
              }
              if (msg.includes("PERMISSION_DENIED") || msg.includes("API has not been used")) {
                rawGoogleError = `Erişim Engellendi (PERMISSION_DENIED): Google Cloud konsolunuzda 'Generative Language API' servisi aktif değil.`;
                break;
              }
              if (msg.includes("USER_LOCATION_NOT_SUPPORTED")) {
                rawGoogleError = `Bölge Desteklenmiyor (USER_LOCATION_NOT_SUPPORTED): Gemini API bulunduğunuz IP/ülke bölgesinde doğrudan desteklenmiyor olabilir.`;
                break;
              }
            }
          }

          if (successModel) {
            return NextResponse.json({
              success: true,
              provider: selectedProvider,
              isConfigured: true,
              message: `Google Gemini API anahtarı ve ${successModel} bağlantısı başarıyla doğrulandı ✓ (Gerçek AI Aktif)`,
            });
          } else {
            return NextResponse.json({
              success: true,
              provider: selectedProvider,
              isConfigured: false,
              message: `Gemini API reddetti: ${rawGoogleError}`,
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

    // 3. AI Service calls with optional custom user apiKey & model
    if (type === "recipe") {
      const recipe = await generateOrakulRecipe(payload, apiKey, selectedProvider, reqModel);
      return NextResponse.json({ success: true, data: recipe });
    }

    if (type === "chat") {
      const reply = await askOrakulChat(
        messages || [],
        context || {},
        apiKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, reply });
    }

    if (type === "company_analysis") {
      const analysis = await generateCompanyAnalysis(
        payload,
        history || [],
        apiKey,
        selectedProvider,
        reqModel
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
