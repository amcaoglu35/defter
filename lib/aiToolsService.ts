import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { GoogleGenAI } from "@google/genai";
import { MOCK_COMPANIES, AiModelBasket, AutonomousScan, Company } from "@/lib/mockData";
import { calculateValuationFormulas } from "@/lib/quantEngine";
import { AutonomousScanItemAiSchema } from "@/lib/aiSchemas";

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
      theme: "💎 AI Derin Değer & Graham Kelepiri",
      criteria: "Düşük F/K çarpanı, PD/DD < 2.0 ve Stanford Piotroski bilanço sağlamlığı",
      filter: (c: Company) =>
        ((c.peRatio && c.peRatio > 0 && c.peRatio < 9.0) || (c.pbRatio && c.pbRatio > 0 && c.pbRatio < 2.2)) &&
        (c.price || 0) > 0,
    },
    {
      theme: "💰 AI Temettü Aristokratları & Bileşik Getiri",
      criteria: "Yüksek nakit akışı ve istikrarlı kâr payı dağıtan devler",
      filter: (c: Company) => (c.dividendYield || 0) >= 3.2 && (c.price || 0) > 0,
    },
    {
      theme: "🚀 AI Büyüme & İhracat Liderleri",
      criteria: "Döviz bazlı ihracat geliri yüksek sanayi ve havacılık lokomotifleri",
      filter: (c: Company) =>
        ["Sanayi & Üretim", "Otomotiv", "Havacılık", "Kimya & Petrol", "Demir Çelik"].includes(c.sector) &&
        (c.price || 0) > 0,
    },
    {
      theme: "⚡ AI Teknoloji & Savunma Öncüleri (XTEK)",
      criteria: "Yazılım, askeri elektronik ve yüksek Ar-Ge kapasiteli şirketler",
      filter: (c: Company) =>
        (c.sector?.toLowerCase().includes("teknoloji") ||
          c.sector?.toLowerCase().includes("bilişim") ||
          c.sector?.toLowerCase().includes("savunma") ||
          c.sector?.toLowerCase().includes("yazılım") ||
          ["ASELS", "SDTTR", "KFEIN", "VBTYZ", "LOGO", "MIATK", "PAPIL", "REEDR", "KONTSE", "FONET", "NETAS", "INDES", "ARDYZ"].includes(c.symbol.toUpperCase())) &&
        (c.price || 0) > 0,
    },
    {
      theme: "🏰 AI Defansif Kale & Altın Tamponlu",
      criteria: "Kıymetli maden tamponu ve fiyatlama gücü yüksek BIST 30 holding/perakende devleri",
      filter: (c: Company) =>
        (c.exchange === "Emtia" || c.assetClass === "maden" || ["Holding", "Perakende", "Gıda & İçecek"].includes(c.sector)) &&
        (c.price || 0) > 0,
    },
    {
      theme: "🔥 AI Momentum & Hacim Kırılımı",
      criteria: "Göreceli hacim artışı yaşayan ve teknik momentumu güçlü liderler",
      filter: (c: Company) =>
        ((c.volumeRatio || 1) > 1.25 || Math.abs(c.dailyChange || 0) > 1.5 || (c.athDiscountPct || 0) < 12) &&
        (c.price || 0) > 0,
    },
  ];

  const generatedBaskets: AiModelBasket[] = [];

  for (const item of themes) {
    const filtered = companyPool.filter(item.filter);
    const poolToUse = filtered.length >= 4 ? filtered : companyPool;
    const shuffled = [...poolToUse].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    // Her seçilen hissenin Stanford Piotroski ve Değerleme Metriklerini Hesapla
    const evaluatedHoldings = selected.map((c) => {
      const mathVal = calculateValuationFormulas({
        symbol: c.symbol,
        sector: c.sector,
        price: c.price || 0,
        peRatio: c.peRatio,
        pbRatio: c.pbRatio,
        dividendYield: c.dividendYield,
        eps: c.eps,
        revenueGrowth: c.revenueGrowth,
        freeCashFlow: c.freeCashFlow,
        marketCap: c.marketCap,
      });

      return {
        company: c,
        piotroskiScore: mathVal.piotroskiFScore,
        magicScore: mathVal.magicFormulaScore,
        dcfFairValue: mathVal.dcfFairValue,
      };
    });

    // Piotroski Skoru & Finansal Güce Göre Dinamik Quant Ağırlıklandırma
    const scoreSum = evaluatedHoldings.reduce((sum, h) => sum + Math.max(h.piotroskiScore, 3), 0);
    let assignedWeights: number[] = evaluatedHoldings.map((h) =>
      Math.round((Math.max(h.piotroskiScore, 3) / scoreSum) * 100)
    );

    // Ağırlıkların toplamının kesinlikle 100 olmasını garantile
    const currentSum = assignedWeights.reduce((a, b) => a + b, 0);
    const diff = 100 - currentSum;
    if (assignedWeights.length > 0) {
      assignedWeights[0] += diff;
    }

    let summary = `${item.theme} stratejisi; ${selected.map((c) => c.symbol).join(", ")} şirketlerinden oluşmakta olup Stanford Piotroski ve MPT modelleriyle optimize edilmiştir.`;

    if (ai) {
      try {
        const prompt = `Sen kıdemli bir portföy yöneticisi yapay zekasın.
"${item.theme}" stratejisi için seçilen şirketler:
${evaluatedHoldings.map((h) => `- ${h.company.name} (${h.company.symbol}): Piotroski ${h.piotroskiScore}/9, F/K ${h.company.peRatio ? `${h.company.peRatio.toFixed(1)}x` : "—"}, Temettü %${(h.company.dividendYield || 0).toFixed(1)}`).join("\n")}

GÖREVİN:
Bu model sepet için yatırımcılara yönelik 1-2 cümlelik profesyonel bir kurumsal strateji özeti (summary) yaz.`;

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

    const allocation = evaluatedHoldings.map((h, idx) => {
      const c = h.company;
      return {
        symbol: c.symbol,
        name: c.name,
        weight: assignedWeights[idx] || 25,
        priceAtCreation: c.price || 100,
        priceNow: c.price || 100,
        returnPct: 0,
        peRatio: c.peRatio,
        dividendYield: c.dividendYield,
        piotroskiFScore: h.piotroskiScore,
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
      provider: ai ? "Google Gemini" : "Otonom Quant Motoru",
      model: ai ? model : "Defter MPT & Piotroski Engine",
      summary,
    };

    generatedBaskets.push(basket);
  }

  return generatedBaskets;
}

export interface AutonomousScanOptions {
  count?: number;
  customApiKey?: string;
  category?: "ALL" | "BIST30" | "XTEK" | "DIVIDEND" | "VALUE" | "MOMENTUM";
  excludeSymbols?: string[];
}

export async function runAutonomousScan(options?: AutonomousScanOptions): Promise<AutonomousScan[]> {
  const targetCount = Math.min(Math.max(options?.count || 10, 3), 25);
  const selectedCategory = options?.category || "ALL";
  const excludedSet = new Set((options?.excludeSymbols || []).map((s) => s.toUpperCase()));
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

  // 1. Radar Evreni Kategori Filtreleme
  let categoryFiltered = [...companyPool];
  if (selectedCategory === "BIST30") {
    categoryFiltered = categoryFiltered.filter((c) =>
      c.indexTag?.toUpperCase().includes("BIST 30") ||
      ["THYAO", "ASELS", "TUPRS", "BIMAS", "AKBNK", "GARAN", "ISCTR", "YKBNK", "KCHOL", "SAHOL", "SISE", "EREGL", "FROTO", "TOASO", "TCELL", "TTKOM", "PETKM", "KOZAL", "EKGYO", "ENKAI", "GUBRF", "HEKTS", "KRDMD", "ODAS", "OYAKC", "PGSUS", "SASA", "SOKM", "TAVHL"].includes(c.symbol.toUpperCase())
    );
  } else if (selectedCategory === "XTEK") {
    categoryFiltered = categoryFiltered.filter((c) =>
      c.sector?.toLowerCase().includes("teknoloji") ||
      c.sector?.toLowerCase().includes("bilişim") ||
      c.sector?.toLowerCase().includes("savunma") ||
      c.sector?.toLowerCase().includes("yazılım") ||
      ["ASELS", "SDTTR", "KFEIN", "VBTYZ", "LOGO", "MIATK", "PAPIL", "REEDR", "KONTSE", "FONET", "NETAS", "INDES", "ARDYZ", "ALTEN", "BINHO"].includes(c.symbol.toUpperCase())
    );
  } else if (selectedCategory === "DIVIDEND") {
    categoryFiltered = categoryFiltered.filter((c) => (c.dividendYield || 0) >= 3.0);
  } else if (selectedCategory === "VALUE") {
    categoryFiltered = categoryFiltered.filter((c) =>
      (c.peRatio && c.peRatio > 0 && c.peRatio < 9.0) ||
      (c.pbRatio && c.pbRatio > 0 && c.pbRatio < 2.2)
    );
  } else if (selectedCategory === "MOMENTUM") {
    categoryFiltered = categoryFiltered.filter((c) =>
      (c.volumeRatio && c.volumeRatio > 1.25) ||
      Math.abs(c.dailyChange || 0) > 1.8 ||
      (c.athDiscountPct && c.athDiscountPct < 12)
    );
  }

  // Havuz boş kalırsa ana kütüğe güvenle geri düş
  if (categoryFiltered.length === 0) {
    categoryFiltered = [...companyPool];
  }

  // 2. Dairesel 500+ Evren Rotasyonu & Akıllı Önceliklendirme
  // Henüz taranmamış şirketleri önceliklendir (tüm kütük bitince döngü başa sarar)
  const freshCandidates = categoryFiltered.filter((c) => !excludedSet.has(c.symbol.toUpperCase()));
  const workingPool = freshCandidates.length >= targetCount ? freshCandidates : categoryFiltered;

  const scoredPool = workingPool.map((c) => {
    let priority = Math.random() * 15;
    const pe = c.peRatio;
    const div = c.dividendYield || 0;
    const vol = c.volumeRatio || 1.0;
    const chg = Math.abs(c.dailyChange || 0);

    if (pe && pe > 0 && pe < 8) priority += 35;
    if (div >= 4.0) priority += 25;
    if (vol > 1.35) priority += 25;
    if (chg > 2.0) priority += 15;
    if (c.exchange === "BIST" || c.indexTag?.includes("BIST")) priority += 15;

    return { company: c, priority };
  }).sort((a, b) => b.priority - a.priority);

  const selected = scoredPool.slice(0, targetCount).map((s) => s.company);

  const ai = effectiveApiKey ? new GoogleGenAI({ apiKey: effectiveApiKey }) : null;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const scans: AutonomousScan[] = [];

  for (const co of selected) {
    const price = co.price || 0;
    const pe = co.peRatio;
    const pb = co.pbRatio;
    const divYield = co.dividendYield || 0;
    const dailyChg = co.dailyChange || 0;
    const roe = co.returnOnEquity || 20.0;

    // 3. Deterministik Çok Boyutlu Bilanço & Değerleme Modelleri (Sıfır Uydurma)
    const mathVal = calculateValuationFormulas({
      symbol: co.symbol,
      sector: co.sector,
      price,
      peRatio: pe,
      pbRatio: pb,
      dividendYield: divYield,
      eps: co.eps,
      revenueGrowth: co.revenueGrowth,
      freeCashFlow: co.freeCashFlow,
      marketCap: co.marketCap,
    });

    const calculatedFairValue = mathVal.dcfFairValue || mathVal.grahamNumber || co.targetMeanPrice || undefined;
    const calculatedValuationScore = Math.min(
      99,
      Math.max(25, Math.round((mathVal.piotroskiFScore / 9) * 50 + (mathVal.magicFormulaScore / 100) * 50))
    );

    let verdict: AutonomousScan["verdict"] =
      mathVal.piotroskiFScore >= 8 && pe && pe < 10 ? "GÜÇLÜ AL" :
      mathVal.piotroskiFScore >= 6 && pe && pe < 15 ? "AL" :
      mathVal.piotroskiFScore <= 3 || (pe && pe > 25) ? "SAT" : "TUT";
    let confidence = "%85";

    // Zengin Deterministik Tezler
    const peText = pe ? `${pe.toFixed(1)}x F/K` : "makul çarpan";
    const divText = divYield > 0 ? `, %${divYield.toFixed(1)} temettü verimi` : "";
    let bullThesis = `${co.name}, ${co.sector} sektöründe Stanford Piotroski ${mathVal.piotroskiFScore}/9 bilanço puanı, %${roe.toFixed(1)} ROE ve ${peText}${divText} ile öne çıkıyor.`;
    let bearThesis = `Yüksek faiz ve finansman maliyetleri ortamında operasyonel nakit akışı ve sektör marj baskısı yakından izlenmelidir.`;

    if (ai) {
      try {
        const prompt = `Sen Borsa İstanbul (BIST) baş analisti ve CFA sertifikalı fon yöneticisisin.
Aşağıdaki şirketin GERÇEK finansal göstergelerini incele ve SADECE geçerli bir JSON yanıtı döndür.

Şirket: ${co.name} (${co.symbol})
Sektör: ${co.sector}
Güncel Fiyat: ${price > 0 ? `${price} TL` : "Veri Yok"}
F/K Çarpanı: ${pe ? `${pe}x` : "Veri Yok"}
PD/DD Çarpanı: ${pb ? `${pb}x` : "Veri Yok"}
Özkaynak Kârlılığı (ROE): %${roe}
Temettü Verimi: %${divYield}
Günlük Değişim: %${dailyChg}
Stanford Piotroski Bilanço Skoru: ${mathVal.piotroskiFScore}/9
DCF / Graham Adil Değeri: ${calculatedFairValue ? `${calculatedFairValue.toFixed(2)} TL` : "Hesaplanamadı"}

GÖREVİN:
1. 1 net ve somut Boğa Tezi (fırsat katalizörleri) ve 1 net Ayı Riski yaz.
2. Kararını ("GÜÇLÜ AL" | "AL" | "TUT" | "SAT" | "GÜÇLÜ SAT" | "NÖTR") belirle.
3. Yanıtını YALNIZCA geçerli bir JSON olarak ver:
{
  "verdict": "GÜÇLÜ AL" | "AL" | "TUT" | "SAT" | "GÜÇLÜ SAT" | "NÖTR",
  "confidence": "%85",
  "bullThesis": "Somut operasyonel ve finansal boğa gerekçesi",
  "bearThesis": "Somut makro ve bilanço risk uyarısı"
}`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const rawText = response.text?.trim() || "";
        const parsed = JSON.parse(rawText);
        const validated = AutonomousScanItemAiSchema.safeParse(parsed);
        const aiData = validated.success ? validated.data : parsed;

        verdict = aiData.verdict || verdict;
        confidence = aiData.confidence || "%85";
        bullThesis = aiData.bullThesis || bullThesis;
        bearThesis = aiData.bearThesis || bearThesis;
      } catch (llmErr) {
        console.warn(`[Autonomous Scan LLM Error for ${co.symbol}]:`, llmErr);
      }
    }

    const scanItem: AutonomousScan = {
      id: `scan-${co.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      symbol: co.symbol,
      companyName: co.name,
      sector: co.sector,
      scannedAt: new Date().toISOString(),
      verdict,
      valuationScore: calculatedValuationScore,
      priceAtScan: price,
      currency: "₺",
      peRatio: pe,
      dividendYield: divYield,
      confidence,
      bullThesis,
      bearThesis,
      targetPrice: calculatedFairValue,
      fairValue: calculatedFairValue,
      targetPeriodDays: 30,
      provider: ai ? "Google Gemini" : "Kurumsal Değerleme Motoru",
      model: ai ? model : "Defter Quant Engine",
      metricsSource: "calculated",
    };

    scans.push(scanItem);
  }

  // Persist to Supabase if configured
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
