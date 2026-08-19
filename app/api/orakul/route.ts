import { NextResponse } from "next/server";
import {
  generateOrakulRecipe,
  generateCompanyAnalysis,
  askOrakulChat,
  generateEarningsFlash,
  detectValueTraps,
  runBacktestSimulation,
  screenStocksWithAI,
  generateDailyBriefing,
  generateSentimentAnalysis,
  generateWeeklyLetter,
  GEMINI_MODEL,
} from "@/lib/aiService";
import { fetchCompanyNews } from "@/lib/newsService";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
  formatApiError,
} from "@/lib/rateLimit";

export async function POST(req: Request) {
  // 1. Rate Limiting (10 requests per minute per IP)
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`orakul:${clientIp}`, 10, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await req.json();
    const { type, payload, messages, context, history, provider, model, persona, apiKey } = body;
    const selectedProvider = provider || "gemini";
    const selectedPersona = persona || "deger";
    const reqModel = (model && typeof model === "string" && model.trim().length > 0) ? model.trim() : GEMINI_MODEL;

    const cookieHeader = req.headers.get("cookie") || "";
    const cookieMatch = cookieHeader.match(/(?:^|; )\s*defter_ai_key\s*=\s*([^;]+)/);
    const cookieKey = cookieMatch ? decodeURIComponent(cookieMatch[1]).trim() : undefined;
    const headerKey = req.headers.get("x-gemini-key")?.trim();

    const providedKey = (typeof apiKey === "string" && apiKey.trim().length > 5)
      ? apiKey.trim()
      : (headerKey || (cookieKey && cookieKey.length > 5 ? cookieKey : undefined));

    const effectiveKey =
      providedKey ||
      (selectedProvider === "openai"
        ? process.env.OPENAI_API_KEY?.trim()
        : process.env.GEMINI_API_KEY?.trim());

    // 2. Connection Test endpoint with live API ping
    if (type === "test_connection") {
      if (!effectiveKey || effectiveKey.length <= 10) {
        return NextResponse.json({
          success: true,
          provider: selectedProvider,
          isConfigured: false,
          message: `${selectedProvider.toUpperCase()} API anahtarı bulunamadı. Lütfen yukarıdaki kutuya anahtarınızı yapıştırın veya sunucu ortamına (.env) ekleyin.`,
        });
      }

      // Live Ping Test with Dynamic ListModels Discovery & Fallback
      try {
        if (selectedProvider === "gemini") {
          let discoveredModels: string[] = [];
          let rawGoogleError = "";

          // 1. Query official ListModels endpoint (GET /v1beta/models?key=...)
          try {
            const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${effectiveKey}`);
            if (listRes.ok) {
              const listData = await listRes.json();
              if (Array.isArray(listData.models)) {
                discoveredModels = listData.models
                  .filter((m: { supportedGenerationMethods?: string[] }) =>
                    m.supportedGenerationMethods?.includes("generateContent")
                  )
                  .map((m: { name: string }) => m.name.replace(/^models\//, ""));
              }
            } else {
              const errData = await listRes.json().catch(() => ({}));
              rawGoogleError = errData.error?.message || listRes.statusText || "";
            }
          } catch (listErr) {
            console.warn("[Orakul Route] ListModels fetch warning:", listErr);
          }

          const defaultCandidates = [
            reqModel,
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro-latest",
            "gemini-1.5-pro",
            "gemini-2.0-flash-exp",
            "gemini-1.0-pro",
          ];

          const modelsToTry = Array.from(new Set([...(discoveredModels.length > 0 ? discoveredModels : []), ...defaultCandidates]));
          let successModel = "";
          let successVersion = "";

          const apiVersions = ["v1beta", "v1"];

          for (const version of apiVersions) {
            for (const modelCandidate of modelsToTry) {
              const testEndpoint = `https://generativelanguage.googleapis.com/${version}/models/${modelCandidate}:generateContent?key=${effectiveKey}`;
              const testRes = await fetch(testEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: "ping" }] }],
                }),
              });

              if (testRes.ok) {
                successModel = modelCandidate;
                successVersion = version;
                break;
              }
            }
            if (successModel) break;
          }

          if (successModel) {
            return NextResponse.json({
              success: true,
              provider: "gemini",
              isConfigured: true,
              testedModel: successModel,
              apiVersion: successVersion,
              availableModelsCount: discoveredModels.length,
              message: `Google Gemini bağlantısı başarılı. (${successModel} @ ${successVersion})`,
            });
          } else {
            return NextResponse.json({
              success: true,
              provider: "gemini",
              isConfigured: false,
              message: `Gemini API anahtarı doğrulanamadı (${rawGoogleError || "Model erişim hatası"}). Güvenli yerel şablon devrede.`,
            });
          }
        } else if (selectedProvider === "openai") {
          const testRes = await fetch("https://api.openai.com/v1/models", {
            headers: { Authorization: `Bearer ${effectiveKey}` },
          });
          if (testRes.ok) {
            return NextResponse.json({
              success: true,
              provider: "openai",
              isConfigured: true,
              message: "OpenAI GPT-4o-mini bağlantısı başarılı.",
            });
          } else {
            return NextResponse.json({
              success: true,
              provider: "openai",
              isConfigured: false,
              message: "OpenAI API anahtarı geçersiz veya yetkisiz.",
            });
          }
        }
      } catch (err) {
        return NextResponse.json({
          success: true,
          provider: selectedProvider,
          isConfigured: false,
          message: `Canlı test sırasında ağ hatası oluştu: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }

    // 3. AI Service calls (Secured with server-side environment variables)
    if (type === "recipe") {
      const recipe = await generateOrakulRecipe(
        payload,
        payload?.allCompanies || body.companies || [],
        effectiveKey,
        selectedProvider,
        reqModel,
        selectedPersona
      );
      return NextResponse.json({ success: true, data: recipe });
    }

    if (type === "company_analysis") {
      const analysis = await generateCompanyAnalysis(
        payload,
        history || [],
        effectiveKey,
        selectedProvider,
        reqModel,
        selectedPersona
      );
      return NextResponse.json({
        success: true,
        data: analysis,
      });
    }

    if (type === "earnings_flash") {
      const flash = await generateEarningsFlash(
        payload,
        effectiveKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, data: flash });
    }

    if (type === "value_trap") {
      const trap = await detectValueTraps(
        payload,
        effectiveKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, data: trap });
    }

    if (type === "backtest") {
      const simulation = await runBacktestSimulation(
        payload,
        effectiveKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, data: simulation });
    }

    if (type === "screener") {
      const screenerResult = await screenStocksWithAI(
        payload.query,
        payload.companies || [],
        effectiveKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, data: screenerResult });
    }

    if (type === "daily_brief") {
      const briefing = await generateDailyBriefing(
        payload || {},
        effectiveKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, data: briefing });
    }

    if (type === "weekly_letter") {
      const letter = await generateWeeklyLetter(
        payload || {},
        effectiveKey,
        selectedProvider,
        reqModel,
        selectedPersona
      );
      return NextResponse.json({ success: true, data: letter });
    }

    if (type === "sentiment") {
      const targetCompanies = payload?.companies || payload?.allCompanies || [];
      const baskets = payload?.baskets || [];

      // 1. Identify companies genuinely owned in user's baskets
      type AnyRecord = Record<string, unknown>;
      const ownedSymbols = new Set(
        (baskets as AnyRecord[]).flatMap((b) =>
          ((b["holdings"] || []) as AnyRecord[]).map((h) => String(h["companySymbol"] ?? "").toUpperCase())
        )
      );
      const ownedCompanies = (targetCompanies as AnyRecord[]).filter((c) =>
        ownedSymbols.has(String(c["symbol"] ?? "").toUpperCase())
      );

      // 2. Select target companies (owned first, then top active movers or first 6)
      const companiesToAnalyze: AnyRecord[] =
        ownedCompanies.length > 0
          ? ownedCompanies.slice(0, 6)
          : (targetCompanies as AnyRecord[]).slice(0, 6);

      const newsPerCompany = await Promise.all(
        companiesToAnalyze.map(async (c) => ({
          symbol: String(c["symbol"] ?? ""),
          name: String(c["name"] || c["symbol"] || ""),
          dailyChange: Number(c["dailyChange"]) || 0,
          news: await fetchCompanyNews(String(c["symbol"] ?? ""), String(c["name"] || c["symbol"] || ""), 3),
        }))
      );

      const sentiment = await generateSentimentAnalysis(
        newsPerCompany,
        effectiveKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, data: sentiment });
    }

    if (type === "chat") {
      const reply = await askOrakulChat(
        messages || [],
        context || {},
        effectiveKey,
        selectedProvider,
        reqModel
      );
      return NextResponse.json({ success: true, reply });
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
