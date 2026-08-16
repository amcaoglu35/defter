import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { GoogleGenAI } from "@google/genai";
import { MOCK_COMPANIES, AutonomousScan } from "@/lib/mockData";

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

  const queryKey = url.searchParams.get("apiKey")?.trim();
  const headerKey = req.headers.get("x-gemini-key")?.trim();
  const envKey = process.env.GEMINI_API_KEY?.trim();
  const effectiveApiKey = queryKey || headerKey || envKey;

  // Optional CRON_SECRET verification if provided
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    let companyPool = MOCK_COMPANIES;

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data: dbCompanies } = await supabaseAdmin.from("companies").select("*");
      if (dbCompanies && dbCompanies.length > 0) {
        companyPool = dbCompanies as any;
      }
    }

    // Pick targetCount distinct companies (prioritize active/diverse sectors)
    const shuffled = [...companyPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, targetCount);

    const apiKey = effectiveApiKey;
    const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const scans: AutonomousScan[] = [];

    for (const co of selected) {
      const price = co.price || 50;
      const pe = co.peRatio || 8.5;
      const divYield = co.dividendYield || 0;
      const dailyChg = co.dailyChange || 0;

      let verdict: AutonomousScan["verdict"] = "TUT";
      let valuationScore = 65;
      let confidence = "%75";
      let bullThesis = `${co.name}, ${co.sector} sektöründeki operasyonel gücüyle istikrarlı nakit akışı üretiyor.`;
      let bearThesis = `Makro faiz ortamı ve sektör marj baskıları orta vadeli değerlemeyi sınırlayabilir.`;
      let targetPrice = parseFloat((price * 1.15).toFixed(2));

      if (ai) {
        try {
          const prompt = `Sen Borsa İstanbul (BIST) baş analistisin. Aşağıdaki şirket verilerini derinlemesine analiz et ve SADECE geçerli bir JSON yanıtı döndür.

Şirket: ${co.name} (${co.symbol})
Sektör: ${co.sector}
Güncel Fiyat: ${price} TL
F/K: ${pe}
Temettü Verimi: %${divYield}
Günlük Değişim: %${dailyChg}

JSON Formatı:
{
  "verdict": "GÜÇLÜ AL" | "AL" | "TUT" | "SAT" | "GÜÇLÜ SAT" | "NÖTR",
  "valuationScore": 0-100 arası sayı,
  "confidence": "%80",
  "bullThesis": "Boğa senaryosu - tam 1 net ve profesyonel cümle",
  "bearThesis": "Ayı senaryosu - tam 1 net ve profesyonel risk cümlesi",
  "targetPrice": sayı (12 aylık makul hedef fiyat TL)
}`;

          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          });

          const rawText = response.text?.trim() || "";
          const parsed = JSON.parse(rawText);

          verdict = parsed.verdict || "TUT";
          valuationScore = typeof parsed.valuationScore === "number" ? parsed.valuationScore : 70;
          confidence = parsed.confidence || "%80";
          bullThesis = parsed.bullThesis || bullThesis;
          bearThesis = parsed.bearThesis || bearThesis;
          targetPrice = typeof parsed.targetPrice === "number" ? parsed.targetPrice : targetPrice;
        } catch (llmErr) {
          console.warn(`[Autonomous Scan LLM Error for ${co.symbol}]:`, llmErr);
          // Algorithmic rule-based valuation fallback
          if (pe < 7 && divYield > 4) {
            verdict = "GÜÇLÜ AL";
            valuationScore = 88;
            confidence = "%85";
            targetPrice = parseFloat((price * 1.25).toFixed(2));
          } else if (pe < 11) {
            verdict = "AL";
            valuationScore = 78;
            confidence = "%78";
            targetPrice = parseFloat((price * 1.18).toFixed(2));
          } else if (pe > 25) {
            verdict = "SAT";
            valuationScore = 42;
            confidence = "%72";
            targetPrice = parseFloat((price * 0.90).toFixed(2));
          }
        }
      } else {
        // Algorithmic deterministic rules
        if (pe < 7 && divYield > 4) {
          verdict = "GÜÇLÜ AL";
          valuationScore = 88;
          confidence = "%85";
          targetPrice = parseFloat((price * 1.25).toFixed(2));
        } else if (pe < 11) {
          verdict = "AL";
          valuationScore = 78;
          confidence = "%78";
          targetPrice = parseFloat((price * 1.18).toFixed(2));
        } else if (pe > 25) {
          verdict = "SAT";
          valuationScore = 42;
          confidence = "%72";
          targetPrice = parseFloat((price * 0.90).toFixed(2));
        }
      }

      const scanItem: AutonomousScan = {
        id: `scan-${co.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        symbol: co.symbol,
        companyName: co.name,
        sector: co.sector,
        scannedAt: new Date().toISOString(),
        verdict,
        valuationScore,
        priceAtScan: price,
        currency: "₺",
        peRatio: pe,
        dividendYield: divYield,
        confidence,
        bullThesis,
        bearThesis,
        targetPrice,
        targetPeriodDays: 30,
        provider: ai ? "Google Gemini" : "Algoritmik Analiz",
        model: ai ? model : "Defter Rule Engine",
      };

      scans.push(scanItem);
    }

    // Optionally save to Supabase if configured
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const historyRows = scans.map((s) => ({
          type: "Otonom Tarama",
          title: `Otonom Teşhis: ${s.symbol}`,
          description: `${s.bullThesis} | Risk: ${s.bearThesis}`,
          verdict_tag: s.verdict,
          symbol: s.symbol,
          verdict: s.verdict,
          price_at_verdict: s.priceAtScan,
          verdict_date: s.scannedAt.split("T")[0],
          target_period_days: s.targetPeriodDays,
        }));

        await supabaseAdmin.from("ai_history").insert(historyRows);
      } catch (dbErr) {
        console.warn("[Autonomous Scan DB Insert Error]:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      scannedCount: scans.length,
      scans,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Autonomous Scanner Cron Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Otonom tarama sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
