import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { GoogleGenAI } from "@google/genai";
import { MOCK_COMPANIES, AiModelBasket, AutonomousScan, Company } from "@/lib/mockData";

export interface GenerateBasketsOptions {
  customApiKey?: string;
}

export async function generateAiModelBaskets(options?: GenerateBasketsOptions): Promise<AiModelBasket[]> {
  const envKey = process.env.GEMINI_API_KEY?.trim();
  const effectiveApiKey = options?.customApiKey?.trim() || envKey;

  let companyPool: Company[] = MOCK_COMPANIES;
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data: dbCompanies } = await supabaseAdmin.from("companies").select("*");
      if (dbCompanies && dbCompanies.length > 0) {
        companyPool = dbCompanies as unknown as Company[];
      }
    } catch (e) {
      console.warn("[aiToolsService] Supabase companies fetch warning:", e);
    }
  }

  const ai = effectiveApiKey ? new GoogleGenAI({ apiKey: effectiveApiKey }) : null;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const themes = [
    {
      theme: "🤖 AI Değer Avcısı (Düşük F/K & Güçlü Bilanço)",
      criteria: "Düşük F/K çarpanı ve nakit akışı güçlü şirketler",
      filter: (c: Company) => (c.peRatio || 15) < 10 && (c.price || 0) > 0,
    },
    {
      theme: "🚀 AI Büyüme & İhracat Liderleri",
      criteria: "İhracat gücü ve sanayi üretimi yüksek dinamik hisseler",
      filter: (c: Company) => ["Sanayi & Üretim", "Otomotiv", "Havacılık", "Teknoloji"].includes(c.sector),
    },
    {
      theme: "🛡️ AI Temettü Kalesi & Nakit Akışı",
      criteria: "Yüksek ve istikrarlı temettü verimi sunan defansif varlıklar",
      filter: (c: Company) => (c.dividendYield || 0) > 3.0,
    },
  ];

  const generatedBaskets: AiModelBasket[] = [];

  for (const item of themes) {
    const filtered = companyPool.filter(item.filter);
    const poolToUse = filtered.length >= 4 ? filtered : companyPool;
    const shuffled = [...poolToUse].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    let summary = `${item.theme} stratejisi, mevcut piyasa çarpanlarına göre optimize edilmiş 4 şirketten oluşmaktadır.`;

    if (ai) {
      try {
        const prompt = `Sen portföy yöneticisi yapay zekasın. "${item.theme}" başlığı altında seçilen hisseler: ${selected.map((c) => `${c.name} (${c.symbol})`).join(", ")}.
Bu sepet için yatırımcılara 1-2 cümlelik profesyonel stratejik gerekçe (summary) yaz. Türkçe olsun.`;
        const resp = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        if (resp.text?.trim()) {
          summary = resp.text.trim();
        }
      } catch (e) {
        console.warn("[aiToolsService AutoBasket LLM Error]:", e);
      }
    }

    const equalWeight = Math.round(100 / selected.length);
    const allocation = selected.map((c, idx) => {
      const weight = idx === 0 ? 100 - equalWeight * (selected.length - 1) : equalWeight;
      return {
        symbol: c.symbol,
        name: c.name,
        weight,
        priceAtCreation: c.price || 100,
        priceNow: c.price || 100,
        returnPct: 0,
      };
    });

    const basket: AiModelBasket = {
      id: `aimodel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      theme: item.theme,
      createdAt: new Date().toISOString(),
      horizon: 30,
      allocation,
      totalReturnPct: 0,
      benchmarkReturnPct: 0,
      alpha: 0,
      status: "active",
      provider: ai ? "Google Gemini" : "Otonom Algoritma",
      model: ai ? model : "Defter Portfolio Engine",
      summary,
    };

    generatedBaskets.push(basket);
  }

  return generatedBaskets;
}

export interface AutonomousScanOptions {
  count?: number;
  customApiKey?: string;
}

export async function runAutonomousScan(options?: AutonomousScanOptions): Promise<AutonomousScan[]> {
  const targetCount = Math.min(Math.max(options?.count || 10, 3), 20);
  const envKey = process.env.GEMINI_API_KEY?.trim();
  const effectiveApiKey = options?.customApiKey?.trim() || envKey;

  let companyPool: Company[] = MOCK_COMPANIES;
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data: dbCompanies } = await supabaseAdmin.from("companies").select("*");
      if (dbCompanies && dbCompanies.length > 0) {
        companyPool = dbCompanies as unknown as Company[];
      }
    } catch (e) {
      console.warn("[aiToolsService] Supabase companies fetch warning:", e);
    }
  }

  const shuffled = [...companyPool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, targetCount);

  const ai = effectiveApiKey ? new GoogleGenAI({ apiKey: effectiveApiKey }) : null;
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
        // Deterministic valuation fallback
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

  // Optionally persist to Supabase
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

  return scans;
}
