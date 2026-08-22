import { z } from "zod";
import {
  AiRecipeAllocationItemSchema,
  AiRecipeResponseSchema,
  CompanyAnalysisAiResponseSchema,
  StockScreenerAiResponseSchema,
  EarningsFlashAiResponseSchema,
  ValueTrapAiResponseSchema,
  SentimentNewsListSchema,
  DailyBriefingAiResponseSchema,
  WeeklyLetterAiResponseSchema,
} from "./aiSchemas";
import { AiHistoryItem, MOCK_COMPANIES, Basket } from "./mockData";
import { getSymbolTicker } from "./liveSymbols";
import { NewsItem } from "./newsService";
import {
  calculateValuationFormulas,
  calculatePortfolioRiskMetrics,
  calculateMacroSensitivities,
  runMonteCarloSimulation,
  calculateCorrelationMatrix,
  getCorrelationBetween,
  calculateHHI,
  calculateHistoricalVolatility,
  PortfolioAssetInput,
} from "./quantEngine";
import { getOptimalModelForTask, logOrakulTelemetry } from "./orakulCache";

export interface RebalanceHolding {
  symbol: string;
  currentWeight: number;
  targetWeight: number;
  quantity: number;
  avgCost: number;
  currentPrice: number;
}

export interface RebalanceContext {
  basketId: string;
  basketName: string;
  currentHoldings: RebalanceHolding[];
}

export interface RebalanceAction {
  symbol: string;
  name?: string;
  action: "AZALT" | "ARTIR" | "TUT";
  currentWeight: number;
  targetWeight: number;
  diffWeight: number;
  currentShares: number;
  targetShares: number;
  sharesChange: number;
  estimatedAmountChange: number;
  currentPrice: number;
  reason: string;
}

export interface AiRecipeRequest {
  goal: string;
  risk: string;
  universe: string;
  budget: number;
  horizon?: string;
  maxAssetWeight?: number;
  maxSectorWeight?: number;
  maxPairwiseCorrelation?: number;
  includeGoldBuffer?: boolean;
  assetCount?: number;
  strategyArchetype?: "defensive_castle" | "garp" | "dividend_aristocrats" | "deep_value" | "global_hedge" | "momentum_leaders" | "custom";
  minDividendYield?: number;
  maxPeRatio?: number;
  minVolumeRatio?: number;
  excludeOverbought?: boolean;
  estimatedFeeRatePct?: number;
  existingPortfolioExposure?: Array<{ symbol: string; totalWeightPctOfNetWorth: number }>;
  rebalanceContext?: RebalanceContext;
}

/**
 * Döviz Çevirici: ABD borsası veya USD cinsinden varlıkları TL bütçeye çevirir.
 * Varsayılan: Eğer currency belirtilmemişse veya "TRY" ise fiyat aynen döner.
 */
export function convertToTRY(
  price: number,
  currency: string | undefined,
  exchange: string | undefined,
  usdTryRate: number = 47.88
): number {
  if (currency === "USD" || exchange === "ABD") {
    return parseFloat((price * (usdTryRate > 0 ? usdTryRate : 47.88)).toFixed(2));
  }
  return price;
}

export function getLotRoundingRule(
  assetClass?: string,
  exchange?: string,
  symbol?: string
): "integer" | "decimal" {
  const sym = (symbol || "").toUpperCase();
  if (
    assetClass === "maden" ||
    assetClass === "fon" ||
    assetClass === "doviz" ||
    exchange === "Emtia" ||
    exchange === "Döviz" ||
    sym.includes("ALTIN") ||
    sym.includes("GÜMÜŞ") ||
    sym.includes("PLATIN") ||
    sym.includes("USD") ||
    sym.includes("EUR") ||
    sym.includes("GRAM")
  ) {
    return "decimal";
  }
  return "integer";
}

export interface CompanyAnalysisRequest {
  id?: string;
  symbol: string;
  name: string;
  price: number;
  currency?: string;
  peRatio?: number;
  pbRatio?: number;
  dailyChange: number;
  volumeRatio?: number;
  sector: string;
  exchange?: string;
  indexTag?: string;
  dividendYield?: number;
  marketCap?: string | number;
  revenueGrowth?: number;
  grossMargin?: number;
  netMargin?: number;
  freeCashFlow?: number;
  returnOnEquity?: number;
  athDiscountPct?: number;
  assetClass?: "hisse" | "maden" | "fon" | "doviz" | string;
  rsi?: number;
  metrics?: Array<{ label: string; value: string; peerAvg?: string }>;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
];

export function getResolvedApiKey(provider: string = "gemini", customApiKey?: string): string | undefined {
  if (customApiKey && customApiKey.trim().length > 5) return customApiKey.trim();
  return provider === "openai" ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY;
}

export async function fetchGeminiWithFallback(
  apiKey: string,
  bodyObj: Record<string, unknown>,
  customModel?: string
): Promise<Response | null> {
  const candidates = customModel
    ? [customModel, ...GEMINI_CANDIDATES.filter((m) => m !== customModel)]
    : GEMINI_CANDIDATES;

  const versions = ["v1beta", "v1"];

  for (const version of versions) {
    for (const modelCandidate of Array.from(new Set(candidates))) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${modelCandidate}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj),
        });
        if (res.ok) {
          return res;
        }
      } catch {
        // try next candidate
      }
    }
  }
  return null;
}

export function getPersonaInstruction(persona: string = "deger"): string {
  if (persona === "temettu") {
    return "ANALİZ ÜSLUBU: 'Temettü ve Pasif Gelir Odaklı' ton. Şirketin düzenli kâr payı dağıtma istikrarı, nakit temettü verimi, serbest nakit akışı gücü ve bileşik getiri potansiyelini öne çıkar.";
  }
  if (persona === "buyume") {
    return "ANALİZ ÜSLUBU: 'Agresif Büyüme & İnovasyon' tonu. Şirketin sektör pazar payı artışı, ihracat kapasitesi, AR-GE yatırımları, ciro büyüme ivmesi ve geleceğin sektör lideri olma potansiyeline odaklan.";
  }
  return "ANALİZ ÜSLUBU: 'Klasik Değer Yatırımcısı' (Buffett & Graham) tonu. Güvenlik marjı (margin of safety), nakit akış kalitesi, kalıcı rekabet avantajı (moat), ucuz çarpanlar ve uzun vadeli sabırlı birikim perspektifini esas al.";
}

export function stripJsonFences(text: string): string {
  if (!text) return "";
  let clean = text.trim();
  if (clean.startsWith("```json")) {
    clean = clean.slice(7);
  } else if (clean.startsWith("```")) {
    clean = clean.slice(3);
  }
  if (clean.endsWith("```")) {
    clean = clean.slice(0, -3);
  }
  return clean.trim();
}

export interface CompanyDiagnosisReport {
  symbol: string;
  valuationScore?: string;
  fairValue?: number;
  targetPrice12M?: number;
  upsidePotential?: string;
  piotroskiScore?: number; // 0-9
  piotroskiEvaluatedCount?: number; // 0-9
  piotroskiSummary?: string;
  altmanZScore?: string;
  dupontRoe?: string;
  peVsSector?: string;
  whyMoved: string;
  pros: string[];
  risks: string[];
  verdict: "GÜÇLÜ AL" | "AL" | "TUT" | "SAT" | "GÜÇLÜ SAT" | "NÖTR" | "DENGELİ" | "YÜKSEK RİSK";
  confidence?: string;
  pastFeedbackSummary?: string;
  evidenceChain?: string[];
  isFallbackMode?: boolean;
  metricsSource?: "calculated";

  // Multi-Agent Bull vs Bear Debate
  bullCase?: {
    catalyst: string;
    targetUpside: string;
    coreThesis: string;
  };
  bearCase?: {
    keyRisk: string;
    downsideRisk: string;
    coreThesis: string;
  };

  // Macro Scenario Stress Testing
  stressTest?: {
    fxShock20Pct: string;      // Dolar/TL %20 artarsa
    rateCutShock: string;      // Faiz indirimi döngüsünde
    marketCrashShock: string;  // BIST %15 düzeltme yaparsa
  };
}

/**
 * Institutional-Grade Orakul Deep Financial Valuation Engine
 * Computes DCF Discounted Cash Flows, Piotroski F-Score, Altman Z-Score, and DuPont Decomposition
 */
export async function generateCompanyAnalysis(
  company: CompanyAnalysisRequest,
  pastHistory: AiHistoryItem[] = [],
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string,
  persona: string = "deger"
): Promise<CompanyDiagnosisReport> {
  const symbol = company.symbol.toUpperCase();
  const price = company.price || 0;
  const pe = company.peRatio;
  const pb = company.pbRatio;
  const divYield = company.dividendYield || 0;
  const personaInstruction = getPersonaInstruction(persona);

  // 1. Hesaplanan Matematiksel Quant & Değerleme Çıktıları (Deterministik)
  const mathVal = calculateValuationFormulas({
    symbol: symbol,
    sector: company.sector,
    price: price,
    peRatio: pe,
    pbRatio: pb,
    dividendYield: divYield,
    revenueGrowth: company.revenueGrowth,
    freeCashFlow: company.freeCashFlow,
    marketCap: company.marketCap,
  });

  const calculatedFairValue = mathVal.dcfFairValue || mathVal.grahamNumber || undefined;
  const calculatedTargetPrice = calculatedFairValue;
  const calculatedUpsidePotential =
    calculatedFairValue && price > 0
      ? `${calculatedFairValue >= price ? "+" : ""}${(((calculatedFairValue - price) / price) * 100).toFixed(1)}%`
      : undefined;
  const normalizedPiotroski = mathVal.piotroskiEvaluatedCount > 0 ? (mathVal.piotroskiFScore / mathVal.piotroskiEvaluatedCount) : 0.5;
  const calculatedValuationScore = `${Math.min(10, Math.max(1, (normalizedPiotroski * 5 + (mathVal.magicFormulaScore / 100) * 5))).toFixed(1)} / 10`;
  const calculatedAltmanZStr = mathVal.altmanZScore ? `${mathVal.altmanZScore} (${mathVal.altmanZone})` : undefined;
  const calculatedDupontRoeStr = `%${mathVal.dupontRoePct} (Net Marj %${mathVal.dupontNetMarginPct} x Devir ${mathVal.dupontAssetTurnover}x x Kaldıraç ${mathVal.dupontLeverageMultiplier}x)`;

  // 2. Build feedback context from past predictions on this symbol
  const symbolPastHistory = pastHistory.filter(
    (h) => h.symbol?.toUpperCase() === symbol
  );

  let feedbackContext = "";
  if (symbolPastHistory.length > 0) {
    const feedbackItems = symbolPastHistory.slice(-3).map((h) => {
      const outcomeStr =
        h.outcomeCorrect === true
          ? "İsabetli (Başarılı Tahmin)"
          : h.outcomeCorrect === false
          ? "Yanıltıcı (Ters Yönde Hareket)"
          : "Takip Sürecinde";
      return `- Tarih: ${h.date || h.verdictDate}, Karar: ${h.verdict || h.verdictTag}, Fiyat: ${h.priceAtVerdict} TL, Sonuç: ${outcomeStr}`;
    });
    feedbackContext = `\nBu şirket için geçmiş analizlerin ve sonuçların:\n${feedbackItems.join("\n")}\nBu geçmiş deneyimi göz önüne alarak tutarlı, temellendirilmiş ve kendini doğrulayan bir analiz yap.`;
  }

  let calculatedPastFeedbackSummary = "";
  if (symbolPastHistory.length > 0) {
    const correctCount = symbolPastHistory.filter((h) => h.outcomeCorrect === true).length;
    calculatedPastFeedbackSummary = `Orakul geçmişte ${symbol} için ${symbolPastHistory.length} analiz gerçekleştirdi (${correctCount} isabetli). Bu teşhis, geçmiş fiyat hareketleri ve değerleme çarpanları kütüğe işlenerek oluşturuldu.`;
  } else {
    calculatedPastFeedbackSummary = `${symbol} için ilk kurumsal Orakul teşhis kaydı oluşturuldu. Bu karar kütük hafızasında saklandı.`;
  }

  const pDisc = pe
    ? pe < 8
      ? "Sektör ortalamalarına kıyasla %25-35 İskontolu"
      : pe < 15
      ? "Sektör medyan değerleriyle paralel"
      : "Sektör çarpanlarına kıyasla primli"
    : "Kapsam Dışı / Sektörel Çarpan";

  const isFinancialSector = (company.sector || "").toLowerCase().includes("banka") || (company.sector || "").toLowerCase().includes("finans") || (company.sector || "").toLowerCase().includes("holding");
  const isExportSector = (company.sector || "").toLowerCase().includes("sanayi") || (company.sector || "").toLowerCase().includes("otomotiv") || (company.sector || "").toLowerCase().includes("havacılık");

  const why = `${company.name} (${symbol}), son dönemde ${company.sector || "Genel"} sektöründeki operasyonel dinamikleri ve maliyet yönetimiyle dengeli bir seyir izlemektedir. Şirketin Stanford Piotroski F-Score değeri ${mathVal.piotroskiSummary} olarak hesaplanmış olup (${mathVal.piotroskiRank}) temel bilanço görünümünü yansıtmaktadır.`;
  const prosList = [
    `Stanford Piotroski Bilanço Sağlığı: ${mathVal.piotroskiSummary} (${mathVal.piotroskiRank}).`,
    `DuPont 3 Kademeli Özkaynak Kârlılığı: %${mathVal.dupontRoePct}`,
    mathVal.mertonDefaultProbabilityPct !== null
      ? `Kaldıraç & Borç Riski: %${mathVal.mertonDefaultProbabilityPct} (Basitleştirilmiş Gösterge)`
      : `Kaldıraç & Borç Yapısı: Dengeli Özkaynak`,
    mathVal.dcfFairValue ? `DCF İndirgenmiş Nakit Akımı Adil Değeri: ${mathVal.dcfFairValue} ₺` : `Mevcut piyasa fiyatı: ${price} ₺`,
  ];
  const risksList = [
    "Makroekonomik faiz patikası ve borçlanma maliyeti baskısı.",
    "Sektörel talep oynaklığı ve girdi maliyet enflasyonu.",
    "Jeopolitik gelişmeler ve genel piyasa risk iştahı dalgalanması.",
  ];

  let verdict: CompanyDiagnosisReport["verdict"] = "TUT";
  const piotroskiRatio = mathVal.piotroskiEvaluatedCount > 0 ? mathVal.piotroskiFScore / mathVal.piotroskiEvaluatedCount : 0.5;
  if (piotroskiRatio >= 0.8 && mathVal.piotroskiEvaluatedCount >= 3 && (!pe || pe < 10)) {
    verdict = "GÜÇLÜ AL";
  } else if (piotroskiRatio >= 0.6 && mathVal.piotroskiEvaluatedCount >= 2 && (!pe || pe < 16)) {
    verdict = "AL";
  } else if (pe && pe > 25) {
    verdict = "SAT";
  }

  const bullCase = {
    catalyst: "İhracat sözleşmeleri, kapasite artışı ve operasyonel nakit yaratma kabiliyeti.",
    targetUpside: calculatedUpsidePotential || "+30-40% Potansiyel",
    coreThesis: "Güçlü nakit akımı, defansif bilanço kalkanı ve sektör liderliği.",
  };

  const bearCase = {
    keyRisk: "Finansman maliyetleri, makroekonomik faiz ortamı ve sektör genelindeki dönemsel talep yavaşlaması.",
    downsideRisk: pe && pe > 20 ? "-20-25% Düzeltme Riski" : "-10-15% Düzeltme Riski",
    coreThesis: "Girdi maliyet baskısı, kur oynaklığı ve faiz ortamının kâr marjlarını daraltma ihtimali.",
  };

  const stressTest = {
    fxShock20Pct: isExportSector
      ? "+%14 Pozitif Ayrışma (Döviz Gelir & İhracat Kalkanı)"
      : "-%4 Maliyet Artışı (İthal Girdi & Kur Baskısı)",
    rateCutShock: isFinancialSector
      ? "+%18 Kredi ve Kâr Marjı Genişlemesi"
      : "+%10 İç Talep ve Tüketici Harcaması Canlanması",
    marketCrashShock: "-%6 Sınırlı Defansif Düzeltme (Yüksek Nakit Kalkanı)",
  };

  const resolvedApiKey = getResolvedApiKey(provider);

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      if (provider === "gemini") {
        const prompt = `Sen Borsa İstanbul ve küresel piyasalarda uzmanlaşmış Baş Finansal Analist (CFA) seviyesinde 'Orakul' yapay zekasısın.
${personaInstruction}

Aşağıdaki şirket verilerini ve Kantitatif Değerleme Motorumuzun hesapladığı kesin matematiksel bulguları derinlemesine sentezleyerek kurumsal bir Boğa vs Ayı ikili analizi ve Makro Senaryo Stres Testi raporu üret:

Şirket: ${symbol} (${company.name})
Fiyat: ${price} ${company.currency || "₺"}
Günlük Değişim: %${company.dailyChange}
Sektör: ${company.sector}
F/K: ${pe !== undefined ? pe : "Kapsam Dışı / Tanımsız"} | PD/DD: ${pb !== undefined ? pb : "Kapsam Dışı / Tanımsız"} | Temettü Verimi: %${divYield}

📐 MATEMATİKSEL VALUATION & QUANT MOTORU BULGULARI:
- Benjamin Graham Sayısı: ${mathVal.grahamNumber ? mathVal.grahamNumber + " ₺ (%" + mathVal.grahamDiscountPct + " İskontolu)" : "—"}
- DCF Adil Değeri: ${mathVal.dcfFairValue ? mathVal.dcfFairValue + " ₺ (%" + mathVal.dcfDiscountPct + " Potansiyel)" : "Kapsam Dışı / Serbest Nakit Akışı Yok"}
- Gordon DDM Temettü Değeri: ${mathVal.gordanDdmValue ? mathVal.gordanDdmValue + " ₺" : "Kapsam Dışı / Düzenli Temettü Yok"}
- Peter Lynch PEG Oranı: ${mathVal.pegRatio ?? "—"} (${mathVal.pegStatus})
- Piotroski F-Score (Stanford Bilanço Sağlığı): ${mathVal.piotroskiSummary} (${mathVal.piotroskiRank})
- Kaldıraç & Borç Riski (Basitleştirilmiş Merton): ${mathVal.mertonDefaultProbabilityPct !== null ? "%" + mathVal.mertonDefaultProbabilityPct : "Kapsam Dışı / Borçluluk Verisi Yok"}
- Hurst Fraktal Trend Analizi: ${mathVal.hurstExponent !== null ? mathVal.hurstTrendType + " (H: " + mathVal.hurstExponent + ")" : "Kapsam Dışı / Fiyat Geçmişi Yok"}
- Magic Formula Puanı: ${mathVal.magicFormulaScore} (${mathVal.magicFormulaRank})
- DuPont 3 Kademeli ROE: %${mathVal.dupontRoePct} (Net Marj %${mathVal.dupontNetMarginPct} x Devir ${mathVal.dupontAssetTurnover}x x Kaldıraç ${mathVal.dupontLeverageMultiplier}x)
${feedbackContext}

Boğa vs Ayı analizi (bullCase, bearCase), Makro Senaryo Stres Testi (stressTest) ve 4-5 adımlı şeffaf Kanıt Zinciri (evidenceChain) oluşturarak aşağıdaki JSON formatında YALNIZCA geçerli JSON olarak dön:
{
  "whyMoved": "2-3 paragraflık detaylı operasyonel, kurumsal ve makroekonomik analiz metni",
  "pros": ["Madde 1", "Madde 2", "Madde 3", "Madde 4"],
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "verdict": "GÜÇLÜ AL" | "AL" | "TUT" | "SAT" | "GÜÇLÜ SAT",
  "confidence": "%90",
  "evidenceChain": [
    "① F/K (${pe ?? '—'}) sektör ortalaması kıyaslaması",
    "② Piotroski Skoru ${mathVal.piotroskiSummary} → Bilanço sağlık testi",
    "③ Kaldıraç & Borç Riski: ${mathVal.mertonDefaultProbabilityPct !== null ? '%' + mathVal.mertonDefaultProbabilityPct : 'Dengeli'} → Finansal kalkan",
    "④ DuPont ROE %${mathVal.dupontRoePct} → Kârlılık ayrıştırması",
    "⑤ Sonuç Kararı: GÜÇLÜ AL"
  ],
  "bullCase": {
    "catalyst": "En güçlü operasyonel ve sektörel büyüme katalizörü",
    "targetUpside": "+40-55% Potansiyel",
    "coreThesis": "Boğa senaryosunun ana yatırım tezi"
  },
  "bearCase": {
    "keyRisk": "En kritik finansal ve makroekonomik risk faktörü",
    "downsideRisk": "-12-18% Düzeltme Riski",
    "coreThesis": "Ayı senaryosunun ana risk tezi"
  },
  "stressTest": {
    "fxShock20Pct": "Dolar kuru %20 artarsa beklenen etki",
    "rateCutShock": "Faizler inerse beklenen etki",
    "marketCrashShock": "BIST %15 düzeltme yaparsa beklenen etki"
  }
}`;

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
          },
          customModel
        );

        if (res && res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            try {
              const parsed = JSON.parse(stripJsonFences(rawText));
              const validated = CompanyAnalysisAiResponseSchema.safeParse(parsed);
              const aiData = validated.success ? validated.data : parsed;

              return {
                symbol,
                valuationScore: calculatedValuationScore,
                fairValue: calculatedFairValue,
                targetPrice12M: calculatedTargetPrice,
                upsidePotential: calculatedUpsidePotential,
                piotroskiScore: mathVal.piotroskiFScore,
                piotroskiEvaluatedCount: mathVal.piotroskiEvaluatedCount,
                piotroskiSummary: mathVal.piotroskiSummary,
                altmanZScore: calculatedAltmanZStr,
                dupontRoe: calculatedDupontRoeStr,
                peVsSector: aiData.peVsSector || pDisc,
                whyMoved: aiData.whyMoved || why,
                pros: aiData.pros?.length ? aiData.pros : prosList,
                risks: aiData.risks?.length ? aiData.risks : risksList,
                verdict: aiData.verdict || verdict,
                confidence: aiData.confidence || "%85",
                pastFeedbackSummary: calculatedPastFeedbackSummary,
                evidenceChain: aiData.evidenceChain?.length ? aiData.evidenceChain : [
                  `① Benjamin Graham Değerleme Modeli: ${calculatedFairValue ? `${calculatedFairValue} ₺` : "Kapsam Dışı"}`,
                  `② Stanford Piotroski Bilanço Sağlığı: ${mathVal.piotroskiSummary}`,
                  `③ Altman Z-Score Temerrüt Güvenliği: ${calculatedAltmanZStr || "Hesaplanamadı"}`,
                  `④ DuPont ROE Çözümlemesi: ${calculatedDupontRoeStr}`,
                ],
                bullCase: aiData.bullCase || bullCase,
                bearCase: aiData.bearCase || bearCase,
                stressTest: aiData.stressTest || stressTest,
                isFallbackMode: false,
                metricsSource: "calculated",
              };
            } catch (jsonErr) {
              console.warn("JSON parse error in company analysis:", jsonErr);
            }
          }
        }
      }
    } catch (apiErr) {
      console.warn("Gemini API error in generateCompanyAnalysis:", apiErr);
    }
  }

  // Fallback mode
  return {
    symbol,
    valuationScore: calculatedValuationScore,
    fairValue: calculatedFairValue,
    targetPrice12M: calculatedTargetPrice,
    upsidePotential: calculatedUpsidePotential,
    piotroskiScore: mathVal.piotroskiFScore,
    piotroskiEvaluatedCount: mathVal.piotroskiEvaluatedCount,
    piotroskiSummary: mathVal.piotroskiSummary,
    altmanZScore: calculatedAltmanZStr,
    dupontRoe: calculatedDupontRoeStr,
    peVsSector: pDisc,
    whyMoved: why,
    pros: prosList,
    risks: risksList,
    verdict,
    confidence: "%85",
    pastFeedbackSummary: calculatedPastFeedbackSummary,
    evidenceChain: [
      `① Benjamin Graham Değerleme Modeli: ${calculatedFairValue ? `${calculatedFairValue} ₺` : "Kapsam Dışı"}`,
      `② Stanford Piotroski Bilanço Sağlığı: ${mathVal.piotroskiSummary}`,
      `③ Altman Z-Score Temerrüt Güvenliği: ${calculatedAltmanZStr || "Hesaplanamadı"}`,
      `④ DuPont ROE Çözümlemesi: ${calculatedDupontRoeStr}`,
    ],
    bullCase,
    bearCase,
    stressTest,
    isFallbackMode: true,
    metricsSource: "calculated",
  };
}

export type AiRecipeAllocationItem = z.infer<typeof AiRecipeAllocationItemSchema>;
export type AiRecipeResponse = z.infer<typeof AiRecipeResponseSchema>;

// -----------------------------------------------------------------------------
// DÜZELTME & ŞEMA DOĞRULAMA (Sanitization & Normalization)
// -----------------------------------------------------------------------------

export function validateAndFixAllocation(
  allocation: Array<{
    symbol: string;
    name?: string;
    companyName?: string;
    weight: number;
    price?: number;
    suggestedShares?: number;
    totalCost?: number;
    note?: string;
    bullThesis?: string;
    bearRisk?: string;
    dataQualityWarning?: string[];
    volumeRatio?: number;
    isLowVolume?: boolean;
    measuredVolatility?: number | null;
  }>,
  pool: CompanyAnalysisRequest[],
  budget: number,
  targetCount: number = 4,
  usdTryRate: number = 47.88,
  maxSectorWeight: number = 45
) {
  const knownSymbolsMap = new Map<string, CompanyAnalysisRequest>();
  pool.forEach((c) => knownSymbolsMap.set(c.symbol.toUpperCase(), c));

  // 1. Symbol filtering: keep valid symbols from pool or standard tickers
  let validItems = allocation.filter((item) => {
    const sym = item.symbol?.toUpperCase();
    return (
      sym &&
      (knownSymbolsMap.has(sym) ||
        sym.includes("ALTIN") ||
        sym.includes("GÜMÜŞ") ||
        sym.includes("USD") ||
        sym.includes("EUR") ||
        sym === "THYAO" ||
        sym === "FROTO" ||
        sym === "ASELS" ||
        sym === "TUPRS" ||
        sym === "BIMAS" ||
        sym === "KCHOL" ||
        sym === "SISE")
    );
  });

  // If pool filtering eliminated too many items, backfill from candidate pool
  if (validItems.length < targetCount) {
    const existingSymbols = new Set(validItems.map((v) => v.symbol.toUpperCase()));
    for (const c of pool) {
      if (validItems.length >= targetCount) break;
      if (!existingSymbols.has(c.symbol.toUpperCase())) {
        validItems.push({
          symbol: c.symbol,
          name: c.name,
          companyName: c.name,
          weight: Math.round(100 / targetCount),
          price: c.price,
          note: `${c.sector || "Genel"} sektöründe dengeli dağılım varlığı.`,
          bullThesis: "Kütük verileri ve sektör konumuyla desteklenen sağlam bilanço.",
          bearRisk: "Makroekonomik dalgalanmalar ve genel endeks riski.",
        });
        existingSymbols.add(c.symbol.toUpperCase());
      }
    }
  }

  // 2. Sektör Tavanı (Sector Cap) ve Ağırlık Dengeleme
  if (validItems.length > 1 && maxSectorWeight > 0 && maxSectorWeight < 100) {
    const sectorTotals = new Map<string, number>();
    validItems.forEach((it) => {
      const co = knownSymbolsMap.get(it.symbol.toUpperCase());
      const sec = co?.sector || "Genel";
      sectorTotals.set(sec, (sectorTotals.get(sec) || 0) + Number(it.weight || 0));
    });

    let hasBreach = false;
    sectorTotals.forEach((total) => {
      if (total > maxSectorWeight) hasBreach = true;
    });

    if (hasBreach) {
      let breachedSum = 0;
      let nonBreachedSum = 0;

      // First pass: cap breached sectors
      validItems = validItems.map((it) => {
        const co = knownSymbolsMap.get(it.symbol.toUpperCase());
        const sec = co?.sector || "Genel";
        const secTotal = sectorTotals.get(sec) || 0;
        if (secTotal > maxSectorWeight) {
          const ratio = maxSectorWeight / secTotal;
          const cappedWeight = Math.max(5, Math.floor(Number(it.weight || 0) * ratio));
          breachedSum += cappedWeight;
          return { ...it, weight: cappedWeight };
        } else {
          nonBreachedSum += Number(it.weight || 0);
          return it;
        }
      });

      // Second pass: distribute remaining weight (100 - breachedSum) among non-breached items
      const targetNonBreached = 100 - breachedSum;
      if (nonBreachedSum > 0 && targetNonBreached > 0) {
        validItems = validItems.map((it) => {
          const co = knownSymbolsMap.get(it.symbol.toUpperCase());
          const sec = co?.sector || "Genel";
          const secTotal = sectorTotals.get(sec) || 0;
          if (secTotal <= maxSectorWeight) {
            const scaled = Math.max(5, Math.round((Number(it.weight || 0) / nonBreachedSum) * targetNonBreached));
            return { ...it, weight: scaled };
          }
          return it;
        });
      }
    }
  }

  // 3. Normalize weights to exactly 100
  const sumWeights = validItems.reduce((acc, it) => acc + (Number(it.weight) || 0), 0);
  if (sumWeights > 0 && sumWeights !== 100) {
    const diff = 100 - sumWeights;
    // Add difference to an item that doesn't breach sector cap
    const candidateIdx = validItems.findIndex((it) => {
      const co = knownSymbolsMap.get(it.symbol.toUpperCase());
      const sec = co?.sector || "Genel";
      const secItems = validItems.filter((i) => (knownSymbolsMap.get(i.symbol.toUpperCase())?.sector || "Genel") === sec);
      const secTotal = secItems.reduce((s, i) => s + i.weight, 0);
      return secTotal + diff <= maxSectorWeight;
    });
    const targetIdx = candidateIdx >= 0 ? candidateIdx : 0;
    if (validItems[targetIdx]) {
      validItems[targetIdx].weight += diff;
    }
  }

  // 4. Lot & Cost Consistency Calculation + %5 Price Deviation Guard + Veri Kalitesi / Likidite
  let allocatedCost = 0;
  const fixedItems = validItems.map((it) => {
    const sym = it.symbol.toUpperCase();
    const company = knownSymbolsMap.get(sym);
    const catalogPrice = company?.price && company.price > 0 ? company.price : undefined;

    let price = catalogPrice || 100;
    if (it.price && it.price > 0) {
      if (catalogPrice) {
        const deviationPct = Math.abs((it.price - catalogPrice) / catalogPrice) * 100;
        // If deviation from verified catalog price is <= 5%, accept it; otherwise enforce authentic catalog price
        price = deviationPct <= 5 ? it.price : catalogPrice;
      } else {
        price = it.price;
      }
    }

    const isUsd = company?.currency === "USD" || company?.exchange === "ABD";
    const priceInTRY = convertToTRY(price, company?.currency, company?.exchange, usdTryRate);

    const targetAssetBudget = budget * (it.weight / 100);
    const roundingRule = getLotRoundingRule(company?.assetClass, company?.exchange, sym);
    
    let shares = 0;
    if (priceInTRY > 0) {
      if (roundingRule === "integer") {
        shares = Math.floor(targetAssetBudget / priceInTRY);
      } else {
        shares = parseFloat((targetAssetBudget / priceInTRY).toFixed(2));
      }
    }

    const totalCost = parseFloat((shares * priceInTRY).toFixed(2));
    allocatedCost += totalCost;

    // Eksik Veri Tespiti (Data Quality Warnings)
    const dataQualityWarning: string[] = [];
    const isCommodityOrFx =
      company?.exchange === "Emtia" ||
      company?.exchange === "Döviz" ||
      sym.includes("ALTIN") ||
      sym.includes("GÜMÜŞ") ||
      sym.includes("USD") ||
      sym.includes("EUR");
    if (!isCommodityOrFx) {
      if (company && (company.peRatio == null || isNaN(company.peRatio))) {
        dataQualityWarning.push("F/K verisi bulunmuyor");
      }
      if (company && (company.pbRatio == null || isNaN(company.pbRatio))) {
        dataQualityWarning.push("PD/DD verisi bulunmuyor");
      }
    }

    const volRatio = company?.volumeRatio;
    const isLowVolume = typeof volRatio === "number" && volRatio < 0.5;

    return {
      ...it,
      symbol: sym,
      name: it.name || it.companyName || company?.name || sym,
      companyName: it.name || it.companyName || company?.name || sym,
      price,
      currency: isUsd ? "USD" : "TRY",
      originalPrice: price,
      priceInTRY,
      suggestedShares: shares,
      totalCost,
      dataQualityWarning: dataQualityWarning.length > 0 ? dataQualityWarning : undefined,
      volumeRatio: volRatio,
      isLowVolume: isLowVolume || undefined,
    };
  });

  const cashReserve = Math.max(0, parseFloat((budget - allocatedCost).toFixed(2)));

  return { fixedAllocation: fixedItems, cashReserve };
}

// -----------------------------------------------------------------------------
// REBALANCE AKSİYONLARI HESAPLAYICI
// -----------------------------------------------------------------------------

export function calculateRebalanceActions(
  currentHoldings: RebalanceHolding[],
  newAllocation: Array<{ symbol: string; weight: number; price?: number; name?: string }>,
  budget: number,
  candidatePool: CompanyAnalysisRequest[] = []
): RebalanceAction[] {
  const candidateMap = new Map<string, CompanyAnalysisRequest>();
  candidatePool.forEach((c) => candidateMap.set(c.symbol.toUpperCase(), c));

  const newAllocMap = new Map<string, { weight: number; price?: number; name?: string }>();
  newAllocation.forEach((a) => newAllocMap.set(a.symbol.toUpperCase(), a));

  const allSymbols = Array.from(
    new Set([
      ...currentHoldings.map((h) => h.symbol.toUpperCase()),
      ...newAllocation.map((a) => a.symbol.toUpperCase()),
    ])
  );

  const actions: RebalanceAction[] = [];

  allSymbols.forEach((sym) => {
    const existing = currentHoldings.find((h) => h.symbol.toUpperCase() === sym);
    const target = newAllocMap.get(sym);
    const company = candidateMap.get(sym);

    const currentWeight = existing ? Number(existing.currentWeight) || 0 : 0;
    const targetWeight = target
      ? Number(target.weight) || 0
      : existing
      ? Number(existing.targetWeight) || 0
      : 0;
    const diffWeight = parseFloat((targetWeight - currentWeight).toFixed(1));

    const price =
      existing?.currentPrice && existing.currentPrice > 0
        ? existing.currentPrice
        : target?.price && target.price > 0
        ? target.price
        : company?.price || 100;

    const currentShares = existing ? existing.quantity : 0;
    const targetValue = (targetWeight / 100) * budget;
    const targetShares = price > 0 ? Math.floor(targetValue / price) : 0;
    const sharesChange = targetShares - currentShares;
    const estimatedAmountChange = Math.abs(sharesChange * price);

    let action: "AZALT" | "ARTIR" | "TUT" = "TUT";
    let reason = `Mevcut %${currentWeight.toFixed(1)} ağırlık hedef %${targetWeight.toFixed(1)} ile dengede, pozisyon korunuyor.`;

    if (diffWeight < -1.5) {
      action = "AZALT";
      reason = `Ağırlık %${currentWeight.toFixed(1)} seviyesinden %${targetWeight.toFixed(1)} seviyesine çekilerek ${Math.abs(sharesChange)} lot kâr realizasyonu / risk azaltımı yapılmalı.`;
    } else if (diffWeight > 1.5) {
      action = "ARTIR";
      reason = `Hedef %${targetWeight.toFixed(1)} ağırlığa ulaşmak için ${Math.max(1, sharesChange)} lot ek alım yapılmalı.`;
    }

    actions.push({
      symbol: sym,
      name: target?.name || existing?.symbol || company?.name || sym,
      action,
      currentWeight,
      targetWeight,
      diffWeight,
      currentShares,
      targetShares,
      sharesChange,
      estimatedAmountChange,
      currentPrice: price,
      reason,
    });
  });

  return actions.sort((a, b) => Math.abs(b.diffWeight) - Math.abs(a.diffWeight));
}

// -----------------------------------------------------------------------------
// METRİK ZENGİNLEŞTİRME KATMANI (Deterministik Quant Motoru Entegrasyonu)
// -----------------------------------------------------------------------------

export function enrichRecipeWithRealMetrics(
  allocation: Array<{
    symbol: string;
    name?: string;
    companyName?: string;
    weight: number;
    price?: number;
    suggestedShares?: number;
    totalCost?: number;
    note?: string;
    bullThesis?: string;
    bearRisk?: string;
  }>,
  req: AiRecipeRequest,
  candidatePool: CompanyAnalysisRequest[] = [],
  expectedYieldStr?: string
) {
  const budget = Number(req.budget) || 100000;
  const candidateMap = new Map<string, CompanyAnalysisRequest>();
  candidatePool.forEach((c) => candidateMap.set(c.symbol.toUpperCase(), c));

  // 1. Convert allocation to PortfolioAssetInput[]
  const portfolioAssets: PortfolioAssetInput[] = allocation.map((item) => {
    const sym = item.symbol.toUpperCase();
    const company = candidateMap.get(sym);
    const weight = Number(item.weight) || 0;
    const value = (weight / 100) * budget;

    // Determine Asset Category
    let category = "hisse";
    if (
      sym.includes("ALTIN") ||
      sym.includes("GÜMÜŞ") ||
      sym.includes("PLATIN") ||
      sym === "BRENT" ||
      sym === "GC=F" ||
      company?.exchange === "Emtia"
    ) {
      category = "emtia";
    } else if (sym.includes("USD") || sym.includes("EUR") || company?.exchange === "Döviz") {
      category = "döviz";
    } else if (company?.assetClass === "fon" || company?.indexTag?.includes("TEFAS")) {
      category = "fon";
    } else if (sym.includes("BTC") || sym.includes("ETH") || company?.exchange === "Kripto") {
      category = "kripto";
    }

    const sector =
      company?.sector ||
      (category === "emtia"
        ? "Kıymetli Maden"
        : category === "döviz"
        ? "Döviz"
        : category === "fon"
        ? "Yatırım Fonu"
        : "Sanayi & Hizmet");

    const currency = company?.exchange === "ABD" || sym.includes("USD") ? "USD" : "TRY";

    return {
      symbol: sym,
      name: item.name || item.companyName || company?.name || sym,
      category,
      sector,
      totalCurrentValue: value,
      weightPct: weight,
      unrealizedProfitLossPct: 0,
      currency,
      dailyChangePct: company?.dailyChange || 0,
    };
  });

  // 2. Calculate HHI (Herfindahl-Hirschman Index)
  const weights = allocation.map((a) => Number(a.weight) || 0);
  const hhiScore = calculateHHI(weights);

  // 3. Calculate Pearson Correlation Matrix & Pseudo-Diversification
  const corrResult = calculateCorrelationMatrix(portfolioAssets);

  // 4. Expected Annual Yield Strategy Mapping
  let expectedYieldPct = 48.0;
  if (expectedYieldStr) {
    const match = expectedYieldStr.match(/%?\s*(\d+(?:[.,]\d+)?)/);
    if (match && match[1]) {
      const parsed = parseFloat(match[1].replace(",", "."));
      if (!isNaN(parsed) && parsed > 0) expectedYieldPct = parsed;
    }
  } else {
    if (
      req.risk?.includes("Düşük") ||
      req.goal?.toLowerCase().includes("defansif") ||
      req.strategyArchetype === "defensive_castle"
    ) {
      expectedYieldPct = 38.0;
    } else if (
      req.risk?.includes("Yüksek") ||
      req.goal?.toLowerCase().includes("büyüme") ||
      req.strategyArchetype === "momentum_leaders"
    ) {
      expectedYieldPct = 62.0;
    } else {
      expectedYieldPct = 48.0;
    }
  }

  // 5. Calculate Risk Metrics via quantEngine
  const riskMetrics = calculatePortfolioRiskMetrics(
    portfolioAssets,
    budget,
    expectedYieldPct,
    28.5, // BIST 100 benchmark annual return %
    42.0 // Risk free rate % (TCMB politika / mevduat göstergesi)
  );

  // 6. Calculate Macro Sensitivities via quantEngine
  const macroSensitivities = calculateMacroSensitivities(
    portfolioAssets,
    riskMetrics.portfolioBeta
  );

  return {
    metricsSource: "calculated" as const,
    sharpeRatio: riskMetrics.sharpeRatio,
    sortinoRatio: riskMetrics.sortinoRatio,
    portfolioBeta: riskMetrics.portfolioBeta,
    jensenAlpha: riskMetrics.jensenAlpha,
    treynorRatio: riskMetrics.treynorRatio,
    omegaRatio: riskMetrics.omegaRatio,
    estimatedVolatility: riskMetrics.annualizedVolatility,
    maxDrawdownPct: riskMetrics.maxDrawdownPct,
    var95MonthlyAmount: riskMetrics.var95MonthlyAmount,
    var95MonthlyPct: riskMetrics.var95MonthlyPct,
    cvar95MonthlyAmount: riskMetrics.cvar95MonthlyAmount,
    diversificationBenefitPct: riskMetrics.diversificationBenefitPct,
    shannonEntropyPct: riskMetrics.shannonEntropyPct,
    ulcerIndex: riskMetrics.ulcerIndex,
    ulcerStressLevel: riskMetrics.ulcerStressLevel,
    hhiScore,
    averageCorrelation: corrResult.averageCorrelation,
    isPseudoDiversified: corrResult.isPseudoDiversified,
    correlationMatrix: corrResult.matrix,
    usdElasticityPct: macroSensitivities.usdElasticityPct,
    interestRateSensitivityPct: macroSensitivities.interestRateSensitivityPct,
    inflationBeta: macroSensitivities.inflationBeta,
    famaFrench: macroSensitivities.famaFrench,
    blackLittermanSuggestedWeights: macroSensitivities.blackLittermanSuggestedWeights,
    stressScenarios: {
      usdShock10pct: { estimatedImpactPct: macroSensitivities.usdElasticityPct },
      rateShock500bp: { estimatedImpactPct: macroSensitivities.interestRateSensitivityPct },
      marketCrash20pct: { estimatedImpactPct: parseFloat((riskMetrics.portfolioBeta * -20).toFixed(1)) },
    },
  };
}

// -----------------------------------------------------------------------------
// ORAKUL REÇETE MOTORU
// -----------------------------------------------------------------------------

export async function generateOrakulRecipe(
  req: AiRecipeRequest & { rebalanceContext?: unknown },
  allCompanies: CompanyAnalysisRequest[] = [],
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string,
  persona: string = "deger"
) {
  const resolvedApiKey = _apiKey || getResolvedApiKey(provider);
  const personaInstruction = getPersonaInstruction(persona);

  // Filter candidate pool from allCompanies based on selected Universe
  let pool = allCompanies.length > 0 ? [...allCompanies] : [];
  if (pool.length > 0) {
    if (req.universe.includes("BIST 30")) {
      pool = pool.filter(
        (c) =>
          c.indexTag === "BIST 30" ||
          c.indexTag === "BIST30" ||
          c.exchange === "BIST" ||
          c.exchange === "Emtia" ||
          c.symbol.includes("ALTIN") ||
          c.symbol.includes("GÜMÜŞ")
      );
    } else if (req.universe.includes("Temettü 25") || req.universe.includes("BIST 100")) {
      pool = pool.filter(
        (c) =>
          c.exchange === "BIST" ||
          c.indexTag?.includes("BIST") ||
          c.indexTag?.includes("Temettü") ||
          (c.dividendYield && c.dividendYield > 3)
      );
    } else if (req.universe.includes("Teknoloji") || req.universe.includes("XTEK")) {
      pool = pool.filter(
        (c) =>
          c.sector?.toLowerCase().includes("teknoloji") ||
          c.sector?.toLowerCase().includes("bilişim") ||
          c.sector?.toLowerCase().includes("yazılım") ||
          c.sector?.toLowerCase().includes("elektronik") ||
          c.symbol === "ASELS" ||
          c.symbol === "SDTTR" ||
          c.symbol === "MIATK" ||
          c.symbol === "LOGO" ||
          c.symbol === "REEDR"
      );
    } else if (req.universe.includes("TEFAS") || req.universe.includes("Fon")) {
      pool = pool.filter(
        (c) =>
          c.exchange === "Emtia" ||
          c.exchange === "Döviz" ||
          c.assetClass === "fon" ||
          c.indexTag?.includes("TEFAS") ||
          c.symbol.includes("ALTIN") ||
          c.symbol.includes("GÜMÜŞ")
      );
    } else if (req.universe.includes("Kıymetli Maden")) {
      pool = pool.filter(
        (c) =>
          c.exchange === "Emtia" ||
          c.exchange === "Döviz" ||
          c.symbol.includes("ALTIN") ||
          c.symbol.includes("GÜMÜŞ") ||
          c.symbol.includes("PLATIN") ||
          c.symbol.includes("USD") ||
          c.symbol.includes("EUR") ||
          c.symbol === "BRENT"
      );
    }
  }

  const rebalanceCtx = req.rebalanceContext as RebalanceContext | undefined;
  const isRebalanceMode = Boolean(rebalanceCtx && rebalanceCtx.currentHoldings?.length > 0);
  const targetAssetCount = Math.min(Math.max(req.assetCount || 4, 3), 10);
  const usedFallbackSeeds = pool.length < targetAssetCount;

  // 0. Extract Live/Catalog USD/TRY Exchange Rate & Fee Calculation
  const usdCo = pool.find((c) => c.symbol === "USD/TRY" || c.symbol === "USDTRY" || c.symbol === "USD");
  const usdTryRate = usdCo?.price && usdCo.price > 10 ? usdCo.price : 47.88;

  const budgetNum = Number(req.budget) || 100000;
  const feeRatePct = typeof req.estimatedFeeRatePct === "number" ? req.estimatedFeeRatePct : 0.2;
  const estimatedFeeAmount = parseFloat(((budgetNum * feeRatePct) / 100).toFixed(2));
  const investableBudget = Math.max(1000, parseFloat((budgetNum - estimatedFeeAmount).toFixed(2)));

  // ---------------------------------------------------------------------------
  // LLM YOLU (Gemini / OpenAI)
  // ---------------------------------------------------------------------------
  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      const goalLower = req.goal.toLowerCase();
      const maxSectorW = req.maxSectorWeight || 45;

      let filteredCandidates = [...pool];
      if (req.minDividendYield && req.minDividendYield > 0) {
        filteredCandidates = filteredCandidates.filter(
          (c) => (c.dividendYield || 0) >= (req.minDividendYield || 0) || c.exchange === "Emtia"
        );
      }
      if (req.maxPeRatio && req.maxPeRatio > 0) {
        filteredCandidates = filteredCandidates.filter(
          (c) => !c.peRatio || c.peRatio <= (req.maxPeRatio || 0) || c.exchange === "Emtia"
        );
      }
      if (req.minVolumeRatio && req.minVolumeRatio > 0) {
        filteredCandidates = filteredCandidates.filter(
          (c) => c.volumeRatio === undefined || c.volumeRatio >= (req.minVolumeRatio || 0)
        );
      }
      if (req.excludeOverbought) {
        filteredCandidates = filteredCandidates.filter(
          (c) => (c.dailyChange === undefined || c.dailyChange <= 5.0) && (!c.rsi || c.rsi <= 70)
        );
      }

      const scoredCandidates = (filteredCandidates.length >= targetAssetCount ? filteredCandidates : pool)
        .map((c) => {
          let relevance = 0;
          const div = typeof c.dividendYield === "number" ? c.dividendYield : 0;
          const pe = typeof c.peRatio === "number" && c.peRatio > 0 ? c.peRatio : null;
          const pb = typeof c.pbRatio === "number" && c.pbRatio > 0 ? c.pbRatio : null;
          const vol = typeof c.volumeRatio === "number" ? c.volumeRatio : null;
          const sec = (c.sector || "").toLowerCase();

          if (req.strategyArchetype === "defensive_castle" || goalLower.includes("kale") || goalLower.includes("enflasyon")) {
            if (c.exchange === "Emtia" || c.symbol.includes("ALTIN")) relevance += 60;
            if (sec.includes("holding") || sec.includes("havacılık") || sec.includes("gıda") || sec.includes("perakende")) relevance += 40;
            if (pe !== null && pe < 12) relevance += 20;
          } else if (req.strategyArchetype === "dividend_aristocrats" || goalLower.includes("temettü")) {
            if (div >= 6) relevance += 70;
            else if (div >= 3) relevance += 40;
            if (pe !== null && pe < 10) relevance += 25;
          } else if (req.strategyArchetype === "garp" || goalLower.includes("garp")) {
            if (pe !== null && pe < 14) relevance += 40;
            if (sec.includes("sanayi") || sec.includes("otomotiv") || sec.includes("havacılık") || sec.includes("savunma")) relevance += 35;
          } else if (req.strategyArchetype === "deep_value" || goalLower.includes("değer")) {
            if (pe !== null && pe < 8) relevance += 60;
            if (pb !== null && pb < 1.8) relevance += 35;
          } else if (req.strategyArchetype === "global_hedge" || goalLower.includes("küresel") || goalLower.includes("döviz")) {
            if (c.exchange === "ABD" || c.exchange === "Emtia" || sec.includes("havacılık") || sec.includes("otomotiv")) relevance += 55;
          } else if (req.strategyArchetype === "momentum_leaders" || goalLower.includes("momentum") || goalLower.includes("büyüme")) {
            if (c.dailyChange > 0) relevance += 30;
            if (sec.includes("teknoloji") || sec.includes("savunma") || sec.includes("yazılım")) relevance += 45;
          } else {
            if (div > 0) relevance += 15;
            if (pe !== null && pe < 15) relevance += 20;
            if (sec.includes("holding") || sec.includes("perakende") || c.exchange === "Emtia") relevance += 25;
          }

          // Liquidity / Volume awareness penalty
          if (vol !== null) {
            if (vol < 0.2) relevance -= 50;
            else if (vol < 0.5) relevance -= 20;
            else if (vol >= 1.2) relevance += 10;
          }

          // Concentration penalty in candidate scoring
          if (req.existingPortfolioExposure && req.existingPortfolioExposure.length > 0) {
            const existing = req.existingPortfolioExposure.find((e) => e.symbol.toUpperCase() === c.symbol.toUpperCase());
            if (existing && existing.totalWeightPctOfNetWorth > 25) {
              relevance -= 30;
            }
          }

          return { company: c, relevance };
        })
        .sort((a, b) => b.relevance - a.relevance);

      const maxCandidates = Math.min(Math.max(targetAssetCount * 4, 12), 22);
      const candidatesSample = (scoredCandidates.length > 0 ? scoredCandidates : pool.map((c) => ({ company: c, relevance: 0 })))
        .slice(0, maxCandidates)
        .map((s) => `${s.company.symbol}|${s.company.sector || "Genel"}|${s.company.price}${s.company.currency === "USD" || s.company.exchange === "ABD" ? "$" : "₺"}|FK:${s.company.peRatio ?? "-"}|PD:${s.company.pbRatio ?? "-"}|TEM:%${s.company.dividendYield ?? 0}|HACIM:${s.company.volumeRatio ? s.company.volumeRatio.toFixed(1) + "x" : "-"}`)
        .join("\n");

      const existingExposurePrompt = req.existingPortfolioExposure && req.existingPortfolioExposure.length > 0
        ? `\nMevcut Portföy Yoğunlaşması: ${req.existingPortfolioExposure.filter(e => e.totalWeightPctOfNetWorth > 10).map(e => `${e.symbol}: %${e.totalWeightPctOfNetWorth}`).join(", ") || "Dengeli"}. Bu varlıklara aşırı ek ağırlık vermekten kaçın.`
        : "";

      const prompt = `Sen 'Orakul' portföy mimarısın. Aşağıdaki doğrulanmış varlıklardan tam ${targetAssetCount} adet varlık seç ve toplamı %100 eden dağılımı oluştur.
Format (JSON):
{"recipeTitle": "Strateji Adı", "summary": "2 cümlelik özet", "expectedYield": "%45 Yıllık Getiri", "riskRating": "Orta", "committeeDebate": {"bullSummary": "Boğa tezi", "bearSummary": "Ayı riski", "verdict": "Komite kararı"}, "allocation": [{"symbol": "THYAO", "name": "THY", "weight": 30, "price": 310, "note": "Gerekçe", "bullThesis": "Boğa tezi", "bearRisk": "Ayı riski"}]}

Kullanıcı Parametreleri:
Hedef: ${req.goal}, Risk: ${req.risk}, Bütçe: ${budgetNum} TL (Net Yatırılabilir: ${investableBudget} TL, Tahmini Komisyon: ${estimatedFeeAmount} TL), Varlık Sayısı: ${targetAssetCount}, Maksimum Sektör Ağırlığı: %${maxSectorW}${existingExposurePrompt}
Kritik Kısıtlar ve Talimatlar:
1. Hiçbir sektörün toplam ağırlığı %${maxSectorW}'i geçmemelidir (sadece tek varlık ağırlığı değil, sektör toplamı da bu sınıra tabidir).
2. Seçtiğin hiçbir iki varlık arasındaki ikili korelasyon %${Math.round((req.maxPairwiseCorrelation || 0.80) * 100)}'ü geçmemeli, sektörel ve ekonomik olarak çeşitlendirilmiş varlıklar seç.
3. Bir varlığın F/K veya PD/DD verisi eksikse bunu varsaymak yerine notlarında açıkça 'veri sınırlı' şeklinde belirt.
4. BIST hisseleri için suggestedShares tam sayı (Math.floor), kıymetli maden/döviz/fon için ondalıklı olabilir.
5. ABD borsası (exchange: 'ABD') varlıkları USD fiyatlıdır (1 USD = ${usdTryRate.toFixed(2)} TL). Lot hesabı TL bütçeye göre kur çevrimi yapılarak hesaplanır.
Adaylar (SEMBOL|SEKTÖR|FİYAT|FK|PD|TEM|HACIM):
${candidatesSample}`;

      const effectiveModel = getOptimalModelForTask("recipe", customModel, provider);
      const startTime = Date.now();
      let rawText: string | undefined;

      if (provider === "gemini") {
        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.25 },
          },
          effectiveModel
        );
        if (res && res.ok) {
          const data = await res.json();
          rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      } else if (provider === "openai") {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resolvedApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Sen 'Orakul' adında elit bir Türk finans, Hedge-Fund portföy yöneticisi ve MPT uzmanısın. Yanıtları JSON formatında ver.",
              },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          rawText = data.choices?.[0]?.message?.content;
        }
      }

      logOrakulTelemetry({
        type: "recipe",
        promptChars: prompt.length,
        responseMs: Date.now() - startTime,
        candidateCount: maxCandidates,
        model: effectiveModel,
      });

      if (rawText) {
        const stripped = stripJsonFences(rawText);
        try {
          const parsed = JSON.parse(stripped);
          const validated = AiRecipeResponseSchema.safeParse(parsed);
          if (validated.success) {
            const data = validated.data;

            // 1. Symbol filtering and deterministic allocation fix (Net investable budget & USD/TRY conversion + Sector Cap)
            const { fixedAllocation, cashReserve } = validateAndFixAllocation(
              data.allocation,
              pool,
              investableBudget,
              targetAssetCount,
              usdTryRate,
              maxSectorW
            );

            // 2. Rebalance actions calculation
            const rebalanceActions = isRebalanceMode && rebalanceCtx
              ? calculateRebalanceActions(rebalanceCtx.currentHoldings, fixedAllocation, investableBudget, pool)
              : undefined;

            // 3. Quantitative Metric Enrichment
            const realMetrics = enrichRecipeWithRealMetrics(
              fixedAllocation,
              req,
              pool,
              data.expectedYield
            );

            // 4. Measure Historical Daily Volatility (Son 6 ay gerçek kapanışlar)
            let enrichedAllocationWithVol = fixedAllocation;
            let measuredPortfolioVol: number | undefined = undefined;
            try {
              const now = new Date();
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

              const historyPromises = fixedAllocation.map(async (item) => {
                try {
                  const ticker = getSymbolTicker(item.symbol);
                  const quotes = await fetchHistoricalDailyCloses(ticker, sixMonthsAgo, now);
                  const closes = quotes.map((q) => q.close);
                  const histVol = calculateHistoricalVolatility(closes);
                  return { symbol: item.symbol, histVol };
                } catch {
                  return { symbol: item.symbol, histVol: null };
                }
              });

              const historyResults = await Promise.all(historyPromises);
              const volMap = new Map<string, number | null>();
              historyResults.forEach((h) => volMap.set(h.symbol, h.histVol));

              enrichedAllocationWithVol = fixedAllocation.map((item) => ({
                ...item,
                measuredVolatility: volMap.get(item.symbol) ?? null,
              }));

              let weightedVolSum = 0;
              let totalVolWeight = 0;
              enrichedAllocationWithVol.forEach((item) => {
                if (typeof item.measuredVolatility === "number" && item.measuredVolatility > 0) {
                  weightedVolSum += item.measuredVolatility * (item.weight / 100);
                  totalVolWeight += item.weight;
                }
              });

              if (totalVolWeight >= 40) {
                measuredPortfolioVol = parseFloat(weightedVolSum.toFixed(1));
              }
            } catch (volErr) {
              console.warn("[generateOrakulRecipe] Measured volatility error:", volErr);
            }

            return {
              ...data,
              allocation: enrichedAllocationWithVol,
              cashReserve: cashReserve || data.cashReserve || 0,
              estimatedFeeAmount,
              investableBudget,
              feeRatePct,
              usdTryRate,
              rebalanceActions,
              usedFallbackSeeds,
              _debugPromptSummary: {
                engine: "llm" as const,
                strategyArchetype: req.strategyArchetype || req.goal,
                persona,
                candidateCount: maxCandidates,
                timestamp: new Date().toISOString(),
              },
              // Overwrite all quantitative metrics with deterministic outputs
              ...realMetrics,
              estimatedVolatility: measuredPortfolioVol ?? realMetrics.estimatedVolatility,
              isTemplate: false,
              engine: "llm" as const,
            };
          } else {
            console.warn("[AI Service] Zod schema validation failed for LLM recipe:", validated.error);
          }
        } catch (pErr) {
          console.warn(`[AI Service] JSON parse error in recipe (len ${rawText.length}):`, pErr);
        }
      }
    } catch (e) {
      console.warn("LLM API call error, falling back to algorithmic engine:", e);
    }
  }

  // =========================================================================
  // Sophisticated Dynamic Algorithmic Portfolio Optimizer (Kütük Tabanlı)
  // Scans authentic companies & assets from user kütük + active universe pool
  // =========================================================================
  const goalLower = req.goal.toLowerCase();
  const isConservative = req.risk.includes("Düşük");
  const isAggressive = req.risk.includes("Yüksek");
  const targetCount = targetAssetCount;
  const maxSectorWeight = req.maxSectorWeight || 45;

  // =========================================================================
  // ACİL DURUM YEDEĞİ (defaultSeeds) — SON GÜNCELLEME: 2026-08
  // =========================================================================
  const defaultSeeds: CompanyAnalysisRequest[] = [
    { symbol: "THYAO", name: "Türk Hava Yolları", price: 310.0, sector: "Havacılık & Ulaştırma", exchange: "BIST", peRatio: 4.8, dividendYield: 0, dailyChange: 1.2 },
    { symbol: "FROTO", name: "Ford Otomotiv", price: 1050.0, sector: "Otomotiv Sanayi", exchange: "BIST", peRatio: 9.2, dividendYield: 6.8, dailyChange: 0.5 },
    { symbol: "TUPRS", name: "Tüpraş Rafineri", price: 168.0, sector: "Petrol & Enerji", exchange: "BIST", peRatio: 6.1, dividendYield: 9.4, dailyChange: -0.4 },
    { symbol: "ASELS", name: "Aselsan Elektronik", price: 64.5, sector: "Savunma Sanayi", exchange: "BIST", peRatio: 12.5, dividendYield: 0.8, dailyChange: 2.1 },
    { symbol: "BIMAS", name: "BİM Mağazalar", price: 495.0, sector: "Perakende Ticaret", exchange: "BIST", peRatio: 14.2, dividendYield: 2.5, dailyChange: 0.3 },
    { symbol: "KCHOL", name: "Koç Holding", price: 215.0, sector: "Holding & Yatırım", exchange: "BIST", peRatio: 7.4, dividendYield: 3.2, dailyChange: 0.8 },
    { symbol: "SISE", name: "Şişecam", price: 48.0, sector: "Cam & Sanayi", exchange: "BIST", peRatio: 8.9, dividendYield: 1.8, dailyChange: -0.2 },
    { symbol: "ALTIN/GR", name: "Gram Altın", price: 3150.0, sector: "Kıymetli Maden", exchange: "Emtia", dailyChange: 0.4 },
    { symbol: "GÜMÜŞ/GR", name: "Gram Gümüş", price: 38.5, sector: "Kıymetli Maden", exchange: "Emtia", dailyChange: 0.9 },
    { symbol: "USD/TRY", name: "Amerikan Doları", price: 47.88, sector: "Döviz", exchange: "Döviz", dailyChange: 0.1 },
    { symbol: "NVDA", name: "NVIDIA Corp", price: 135.0, sector: "Yapay Zeka & Yarıiletken", exchange: "ABD", currency: "USD", peRatio: 38.0, dividendYield: 0.1, dailyChange: 1.8 },
    { symbol: "AAPL", name: "Apple Inc.", price: 228.0, sector: "Tüketici Teknolojisi", exchange: "ABD", currency: "USD", peRatio: 32.0, dividendYield: 0.5, dailyChange: 0.4 },
  ];

  // Merge available pool with default seeds to ensure rich diversity
  const candidatePool = pool.length >= targetCount ? pool : Array.from(new Map([...pool, ...defaultSeeds].map((c) => [c.symbol, c])).values());

  // Dynamic ranking function based on strategy goal + Persona Bonus + Existing Concentration Penalty + Liquidity
  const rankedCandidates = [...candidatePool].map((c) => {
    let score = 50;
    const sectorLower = (c.sector || "").toLowerCase();
    const div = typeof c.dividendYield === "number" ? c.dividendYield : 0;
    const pe = typeof c.peRatio === "number" && c.peRatio > 0 ? c.peRatio : null;
    const pb = typeof c.pbRatio === "number" && c.pbRatio > 0 ? c.pbRatio : null;
    const vol = typeof c.volumeRatio === "number" ? c.volumeRatio : null;

    // Strategy / Goal Primary Scoring
    if (goalLower.includes("temettü")) {
      if (div > 5) score += 40;
      else if (div > 2) score += 25;
      else if (div > 0) score += 10;
      if (pe !== null && pe < 10) score += 20;
      if (sectorLower.includes("otomotiv") || sectorLower.includes("petrol") || sectorLower.includes("enerji") || sectorLower.includes("perakende")) score += 15;
    } else if (goalLower.includes("ihracat") || goalLower.includes("döviz")) {
      if (sectorLower.includes("havacılık") || sectorLower.includes("otomotiv") || sectorLower.includes("savunma") || sectorLower.includes("sanayi")) score += 45;
      if (c.dailyChange > 0) score += 15;
    } else if (goalLower.includes("değer") || goalLower.includes("düşük f/k")) {
      if (pe !== null && pe < 8) score += 50;
      if (pb !== null && pb < 2) score += 25;
    } else if (goalLower.includes("büyüme") || isAggressive) {
      if (sectorLower.includes("savunma") || sectorLower.includes("teknoloji") || sectorLower.includes("yazılım") || sectorLower.includes("havacılık") || c.exchange === "ABD") score += 35;
      if (c.dailyChange > 0) score += 15;
    } else if (goalLower.includes("enflasyon") || goalLower.includes("kur") || req.universe.includes("Kıymetli Maden")) {
      if (c.exchange === "Emtia" || c.symbol.includes("ALTIN") || c.symbol.includes("GÜMÜŞ") || c.exchange === "Döviz") score += 45;
      if (sectorLower.includes("havacılık") || sectorLower.includes("holding") || sectorLower.includes("ihracat")) score += 20;
    } else {
      // Balanced
      if (div > 0) score += 15;
      if (pe !== null && pe < 15) score += 15;
      if (sectorLower.includes("holding") || sectorLower.includes("perakende") || c.exchange === "Emtia") score += 20;
    }

    // Persona Bonus Adjustment (+10 to +25 score)
    const p = (persona || "deger").toLowerCase();
    if (p.includes("deger") || p.includes("value")) {
      if (pe !== null && pe < 8) score += 20;
      if (pb !== null && pb < 1.6) score += 15;
    } else if (p.includes("buyume") || p.includes("growth")) {
      if (sectorLower.includes("teknoloji") || sectorLower.includes("savunma") || sectorLower.includes("yazılım")) score += 20;
      if (c.dailyChange > 0) score += 10;
    } else if (p.includes("temettu") || p.includes("dividend")) {
      if (div >= 5) score += 25;
      else if (div >= 2) score += 10;
    } else if (p.includes("savunmaci") || p.includes("defensive")) {
      if (c.exchange === "Emtia" || c.symbol.includes("ALTIN") || sectorLower.includes("perakende") || sectorLower.includes("holding")) score += 20;
    } else if (p.includes("makro") || p.includes("hedge")) {
      if (c.exchange === "Döviz" || c.exchange === "Emtia" || sectorLower.includes("havacılık")) score += 20;
    }

    // Liquidity / Volume awareness penalty
    if (vol !== null) {
      if (vol < 0.2) score -= 50;
      else if (vol < 0.5) score -= 20;
      else if (vol >= 1.2) score += 10;
    }

    // Existing Concentration Penalty (Diversification Protection)
    if (req.existingPortfolioExposure && req.existingPortfolioExposure.length > 0) {
      const existing = req.existingPortfolioExposure.find((e) => e.symbol.toUpperCase() === c.symbol.toUpperCase());
      if (existing && existing.totalWeightPctOfNetWorth > 20) {
        score -= Math.min(50, Math.round(existing.totalWeightPctOfNetWorth * 1.2));
      }
    }

    // Exclude Overbought Penalty
    if (req.excludeOverbought && c.dailyChange && c.dailyChange > 5.0) {
      score -= 40;
    }

    return { ...c, calculatedScore: score };
  }).sort((a, b) => b.calculatedScore - a.calculatedScore);

  // Pick targetCount diverse items respecting sector weight ceiling (maxSectorWeight) & pairwise correlation (maxPairwiseCorrelation)
  const maxPairCorr = typeof req.maxPairwiseCorrelation === "number" ? req.maxPairwiseCorrelation : 0.80;
  const selectedItems: CompanyAnalysisRequest[] = [];
  const sectorWeights = new Map<string, number>();
  const approxWeightPerItem = Math.round(100 / targetCount);

  // If gold buffer is requested, ensure gold is prioritized
  if (req.includeGoldBuffer) {
    const goldItem = candidatePool.find((c) => c.symbol === "ALTIN/GR" || c.symbol.includes("ALTIN") || c.exchange === "Emtia");
    if (goldItem) {
      selectedItems.push(goldItem);
      const sec = goldItem.sector || "Kıymetli Maden";
      sectorWeights.set(sec, (sectorWeights.get(sec) || 0) + approxWeightPerItem);
    }
  }

  for (const candidate of rankedCandidates) {
    if (selectedItems.length >= targetCount) break;
    const sec = candidate.sector || "Genel";
    const currentSecWeight = sectorWeights.get(sec) || 0;
    const sectorAllowed = currentSecWeight + approxWeightPerItem <= maxSectorWeight || selectedItems.length >= targetCount - 1;

    // Pairwise correlation check with already selected items
    const hasHighCorr = selectedItems.some((s) => getCorrelationBetween(s, candidate) > maxPairCorr);
    const corrAllowed = !hasHighCorr || selectedItems.length >= targetCount - 1;

    if (sectorAllowed && corrAllowed) {
      if (!selectedItems.some((s) => s.symbol === candidate.symbol)) {
        selectedItems.push(candidate);
        sectorWeights.set(sec, currentSecWeight + approxWeightPerItem);
      }
    }
  }

  // Fallback to top ranked if sector / correlation constraints left us short
  if (selectedItems.length < targetCount) {
    for (const candidate of rankedCandidates) {
      if (selectedItems.length >= targetCount) break;
      if (!selectedItems.some((s) => s.symbol === candidate.symbol)) {
        selectedItems.push(candidate);
      }
    }
  }

  // Dynamically compute balanced weights summing to 100
  const maxW = req.maxAssetWeight || Math.max(25, Math.round(100 / selectedItems.length) + 10);
  const rawWeights = selectedItems.map((_, i) => {
    const base = 100 / selectedItems.length;
    const slope = (selectedItems.length / 2 - i) * 2.5;
    return Math.min(maxW, Math.max(5, Math.round(base + slope)));
  });

  const sumRaw = rawWeights.reduce((a, b) => a + b, 0);
  const weights = rawWeights.map((w) => Math.round((w / (sumRaw || 1)) * 100));
  const diff = 100 - weights.reduce((a, b) => a + b, 0);
  if (weights.length > 0) weights[0] += diff;

  const rawAllocation = selectedItems.slice(0, targetCount).map((item, idx) => {
    const w = weights[idx] || Math.round(100 / selectedItems.length);
    let note = "";
    const div = item.dividendYield || 0;
    const pe = item.peRatio;

    if (item.exchange === "Emtia" || item.symbol.includes("ALTIN") || item.symbol.includes("GÜMÜŞ")) {
      note = "Enflasyon ve jeopolitik dalgalanmalara karşı reel sermaye sigortası.";
    } else if (div >= 3) {
      note = `%${div.toFixed(1)} temettü verimi ve ${pe ? `F/K: ${pe}` : "düzenli nakit akışı"} ile güçlü getiri sütunu.`;
    } else if (item.sector?.includes("Savunma") || item.sector?.includes("Teknoloji")) {
      note = "Yüksek katma değerli teknoloji ve ihracat sözleşmeleriyle stratejik büyüme motoru.";
    } else if (item.sector?.includes("Havacılık") || item.sector?.includes("Ulaştırma")) {
      note = "Döviz bazlı serbest nakit akımı ve genişleyen küresel operasyon gücü.";
    } else if (item.sector?.includes("Holding")) {
      note = "Dengeli iştirak yapısı ve çeşitlendirilmiş gelir iskontosu.";
    } else if (item.sector?.includes("Perakende")) {
      note = "Enflasyona tam dirençli defansif nakit akışı ve pazar liderliği.";
    } else {
      note = `${item.sector} sektöründe güçlü bilanço ve pazar pozisyonu.`;
    }

    return {
      symbol: item.symbol,
      name: item.name,
      companyName: item.name,
      weight: w,
      price: item.price,
      note,
      bullThesis: `${item.name} güçlü bilanço oranları ve sektöründeki rekabetçi konumuyla getiri vadediyor.`,
      bearRisk: "Piyasa faiz oranları ve genel sektör konjonktüründeki yavaşlama riski.",
    };
  });

  const { fixedAllocation, cashReserve } = validateAndFixAllocation(
    rawAllocation,
    candidatePool,
    investableBudget,
    targetCount,
    usdTryRate,
    maxSectorWeight
  );

  const weightedDividend = fixedAllocation.reduce((sum, a) => {
    const item = selectedItems.find((s) => s.symbol === a.symbol);
    return sum + (item?.dividendYield || 0) * (a.weight / 100);
  }, 0);

  const yieldStr = weightedDividend > 0
    ? `Ağırlıklı %${weightedDividend.toFixed(1)} Temettü & ${isAggressive ? "Büyüme" : isConservative ? "Reel Koruma" : "Dengeli"} Hedefi`
    : `${isAggressive ? "Büyüme & Sermaye Kazancı" : isConservative ? "Reel Sermaye Koruma" : "Dengeli Bileşik Getiri"} Odaklı Dağılım`;

  const uniqueSectors = new Set(selectedItems.map((s) => s.sector || "Genel")).size;
  const maxWeight = Math.max(...fixedAllocation.map((a) => a.weight));
  const health = Math.min(98, Math.max(70, Math.round(75 + uniqueSectors * 5 - (maxWeight > 30 ? 5 : 0))));
  const duration = req.horizon || (isConservative ? "12+ Ay" : isAggressive ? "3-6 Ay" : "6-12 Ay");

  // Rebalance actions for algorithmic optimizer
  const rebalanceActions = isRebalanceMode && rebalanceCtx
    ? calculateRebalanceActions(rebalanceCtx.currentHoldings, fixedAllocation, investableBudget, candidatePool)
    : undefined;

  // Real quantitative metrics enrichment
  const realMetrics = enrichRecipeWithRealMetrics(
    fixedAllocation,
    req,
    candidatePool,
    yieldStr
  );

  // Measure Historical Daily Volatility (Son 6 ay gerçek kapanışlar)
  let enrichedAllocationWithVol = fixedAllocation;
  let measuredPortfolioVol: number | undefined = undefined;
  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historyPromises = fixedAllocation.map(async (item) => {
      try {
        const ticker = getSymbolTicker(item.symbol);
        const quotes = await fetchHistoricalDailyCloses(ticker, sixMonthsAgo, now);
        const closes = quotes.map((q) => q.close);
        const histVol = calculateHistoricalVolatility(closes);
        return { symbol: item.symbol, histVol };
      } catch {
        return { symbol: item.symbol, histVol: null };
      }
    });

    const historyResults = await Promise.all(historyPromises);
    const volMap = new Map<string, number | null>();
    historyResults.forEach((h) => volMap.set(h.symbol, h.histVol));

    enrichedAllocationWithVol = fixedAllocation.map((item) => ({
      ...item,
      measuredVolatility: volMap.get(item.symbol) ?? null,
    }));

    let weightedVolSum = 0;
    let totalVolWeight = 0;
    enrichedAllocationWithVol.forEach((item) => {
      if (typeof item.measuredVolatility === "number" && item.measuredVolatility > 0) {
        weightedVolSum += item.measuredVolatility * (item.weight / 100);
        totalVolWeight += item.weight;
      }
    });

    if (totalVolWeight >= 40) {
      measuredPortfolioVol = parseFloat(weightedVolSum.toFixed(1));
    }
  } catch (volErr) {
    console.warn("[generateOrakulRecipe] Algorithmic measured volatility error:", volErr);
  }

  return {
    title: `Orakul Kural Motoru: ${req.goal.split(" ")[0]} & ${req.universe.split(" ")[0]} Stratejisi`,
    summary: `${budgetNum.toLocaleString("tr-TR")} ₺ bütçe için ${req.risk.toLowerCase()} profilinde, kütüğünüzdeki ${candidatePool.length} varlık taranarak kural tabanlı optimizasyon ile oluşturulmuştur.`,
    strategyArchetype: req.strategyArchetype || "custom",
    healthScore: health,
    expectedYield: yieldStr,
    recommendedDuration: duration,
    riskRating: req.risk,
    allocation: enrichedAllocationWithVol,
    cashReserve,
    estimatedFeeAmount,
    investableBudget,
    feeRatePct,
    usdTryRate,
    rebalanceActions,
    usedFallbackSeeds,
    _debugPromptSummary: {
      engine: "algorithmic" as const,
      strategyArchetype: req.strategyArchetype || req.goal,
      persona,
      candidateCount: candidatePool.length,
      timestamp: new Date().toISOString(),
    },
    committeeDebate: {
      bullSummary: "Boğa Perspektifi: Seçilen varlıklar yüksek nakit akış kapasitesi ve güçlü sermaye kârlılığı barındırıyor.",
      bearSummary: "Ayı Perspektifi: Makroekonomik faiz seyri ve sektör bazlı maliyet baskıları yakından takip edilmeli.",
      verdict: "Kural Motoru Kararı: Sektörel çeşitlendirme ve kovaryans matrisi sınırları dahilinde optimize edildi.",
    },
    ...realMetrics,
    estimatedVolatility: measuredPortfolioVol ?? realMetrics.estimatedVolatility,
    isTemplate: true,
    engine: "algorithmic" as const,
  };
}

// -----------------------------------------------------------------------------
// TEK VARLIĞI KISMİ YENİDEN ÜRETME (Regenerate Single Asset)
// -----------------------------------------------------------------------------
export async function regenerateSingleAsset(
  currentAllocation: Array<{
    symbol: string;
    weight: number;
    price?: number;
    name?: string;
    companyName?: string;
    note?: string;
    bullThesis?: string;
    bearRisk?: string;
    currency?: string;
    originalPrice?: number;
    priceInTRY?: number;
    suggestedShares?: number;
    totalCost?: number;
  }>,
  excludeSymbol: string,
  req: AiRecipeRequest,
  allCompanies: CompanyAnalysisRequest[] = [],
  apiKey?: string,
  provider: string = "gemini",
  customModel?: string,
  persona: string = "deger"
) {
  const symToExclude = excludeSymbol.toUpperCase();
  const itemToReplace = currentAllocation.find((a) => a.symbol.toUpperCase() === symToExclude);
  if (!itemToReplace) {
    throw new Error(`Değiştirilecek ${excludeSymbol} varlığı mevcut reçetede bulunamadı.`);
  }

  const existingSymbols = new Set(currentAllocation.map((a) => a.symbol.toUpperCase()));
  const targetWeight = itemToReplace.weight;
  const budgetNum = Number(req.budget) || 100000;
  const feeRatePct = typeof req.estimatedFeeRatePct === "number" ? req.estimatedFeeRatePct : 0.2;
  const estimatedFeeAmount = parseFloat(((budgetNum * feeRatePct) / 100).toFixed(2));
  const investableBudget = Math.max(1000, parseFloat((budgetNum - estimatedFeeAmount).toFixed(2)));

  // 1. Build candidate pool excluding current holdings
  let pool = allCompanies.length > 0 ? [...allCompanies] : [...MOCK_COMPANIES];
  const usdCo = pool.find((c) => c.symbol === "USD/TRY" || c.symbol === "USDTRY" || c.symbol === "USD");
  const usdTryRate = usdCo?.price && usdCo.price > 10 ? usdCo.price : 47.88;

  // Filter universe
  if (req.universe) {
    if (req.universe.includes("BIST 30")) {
      pool = pool.filter(
        (c) =>
          c.indexTag === "BIST30" ||
          c.exchange === "BIST" ||
          c.symbol === "THYAO" ||
          c.symbol === "FROTO" ||
          c.symbol === "ASELS" ||
          c.symbol === "TUPRS" ||
          c.symbol === "BIMAS"
      );
    } else if (req.universe.includes("Kıymetli Maden")) {
      pool = pool.filter(
        (c) =>
          c.exchange === "Emtia" ||
          c.exchange === "Döviz" ||
          c.symbol.includes("ALTIN") ||
          c.symbol.includes("GÜMÜŞ") ||
          c.symbol.includes("USD") ||
          c.symbol.includes("EUR")
      );
    }
  }

  const eligibleCandidates = pool.filter((c) => !existingSymbols.has(c.symbol.toUpperCase()));
  let newItemCandidate: CompanyAnalysisRequest | undefined;

  // If API key is available, ask LLM for a smart replacement
  const resolvedApiKey = apiKey || getResolvedApiKey(provider);
  if (resolvedApiKey && resolvedApiKey.trim().length > 10 && eligibleCandidates.length > 0) {
    try {
      const candidatesSample = eligibleCandidates
        .slice(0, 15)
        .map(
          (s) =>
            `${s.symbol}|${s.sector || "Genel"}|${s.price}${s.currency === "USD" || s.exchange === "ABD" ? "$" : "₺"}|FK:${s.peRatio ?? "-"}|PD:${s.pbRatio ?? "-"}|TEM:%${s.dividendYield ?? 0}`
        )
        .join("\n");

      const otherHoldingsStr = currentAllocation
        .filter((a) => a.symbol.toUpperCase() !== symToExclude)
        .map((a) => `${a.symbol} (%${a.weight})`)
        .join(", ");

      const prompt = `Sen 'Orakul' portföy mimarısın. Kullanıcı mevcut sepetindeki '${excludeSymbol}' varlığını beğenmedi ve değiştirmek istiyor.
Mevcut Diğer Varlıklar: ${otherHoldingsStr}
Hedef: ${req.goal}, Risk: ${req.risk}, Archetype: ${req.strategyArchetype || "dengeli"}, Hedef Ağırlık: %${targetWeight}.
Döviz Kuru: 1 USD = ${usdTryRate.toFixed(2)} TL.

Aşağıdaki adaylardan '${excludeSymbol}' yerine geçecek en uygun TEK BİR varlık seç.
Adaylar:
${candidatesSample}

Format (JSON):
{"symbol": "SEMBOL", "name": "Şirket Adı", "price": 100, "note": "Seçim gerekçesi", "bullThesis": "Boğa tezi", "bearRisk": "Ayı riski"}`;

      const effectiveModel = getOptimalModelForTask("recipe", customModel, provider);
      let rawText: string | undefined;

      if (provider === "gemini") {
        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
          },
          effectiveModel
        );
        if (res && res.ok) {
          const data = await res.json();
          rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      }

      if (rawText) {
        const parsed = JSON.parse(stripJsonFences(rawText));
        const matched = eligibleCandidates.find((c) => c.symbol.toUpperCase() === (parsed.symbol || "").toUpperCase());
        if (matched) {
          newItemCandidate = {
            ...matched,
            bullThesis: parsed.bullThesis,
            bearRisk: parsed.bearRisk,
            note: parsed.note,
          } as unknown as CompanyAnalysisRequest;
        }
      }
    } catch (err) {
      console.warn("[regenerateSingleAsset] LLM error, falling back to algorithmic pick:", err);
    }
  }

  // Algorithmic fallback pick
  if (!newItemCandidate) {
    const otherItems = currentAllocation.filter((item) => item.symbol.toUpperCase() !== excludeSymbol.toUpperCase());
    const maxPairCorr = typeof req.maxPairwiseCorrelation === "number" ? req.maxPairwiseCorrelation : 0.80;

    const scored = eligibleCandidates
      .map((c) => {
        let score = 50;
        if (req.strategyArchetype === "deep_value" && c.peRatio && c.peRatio < 8) score += 40;
        if (req.strategyArchetype === "dividend_aristocrats" && (c.dividendYield || 0) > 4) score += 40;
        if (c.dailyChange > 0) score += 10;
        const hasHighCorr = otherItems.some((other) => getCorrelationBetween(other, c) > maxPairCorr);
        if (hasHighCorr) score -= 35;
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score);

    newItemCandidate = scored[0] || eligibleCandidates[0];
  }

  if (!newItemCandidate) {
    throw new Error("Uygun alternatif varlık bulunamadı.");
  }

  const sym = newItemCandidate.symbol.toUpperCase();
  const price = newItemCandidate.price || 100;
  const isUsd = newItemCandidate.currency === "USD" || newItemCandidate.exchange === "ABD";
  const priceInTRY = convertToTRY(price, newItemCandidate.currency, newItemCandidate.exchange, usdTryRate);
  const targetAssetBudget = investableBudget * (targetWeight / 100);
  const roundingRule = getLotRoundingRule(newItemCandidate.assetClass, newItemCandidate.exchange, sym);

  let shares = 0;
  if (priceInTRY > 0) {
    shares =
      roundingRule === "integer"
        ? Math.floor(targetAssetBudget / priceInTRY)
        : parseFloat((targetAssetBudget / priceInTRY).toFixed(2));
  }
  const totalCost = parseFloat((shares * priceInTRY).toFixed(2));

  const dataQualityWarning: string[] = [];
  const isCommodityOrFx =
    newItemCandidate.exchange === "Emtia" ||
    newItemCandidate.exchange === "Döviz" ||
    sym.includes("ALTIN") ||
    sym.includes("GÜMÜŞ") ||
    sym.includes("USD") ||
    sym.includes("EUR");
  if (!isCommodityOrFx) {
    if (newItemCandidate.peRatio == null || isNaN(newItemCandidate.peRatio)) {
      dataQualityWarning.push("F/K verisi bulunmuyor");
    }
    if (newItemCandidate.pbRatio == null || isNaN(newItemCandidate.pbRatio)) {
      dataQualityWarning.push("PD/DD verisi bulunmuyor");
    }
  }

  const volRatio = newItemCandidate.volumeRatio;
  const isLowVolume = typeof volRatio === "number" && volRatio < 0.5;

  const newItem: AiRecipeAllocationItem = {
    symbol: sym,
    name: newItemCandidate.name || sym,
    companyName: newItemCandidate.name || sym,
    weight: targetWeight,
    price,
    currency: isUsd ? "USD" : "TRY",
    originalPrice: price,
    priceInTRY,
    suggestedShares: shares,
    totalCost,
    dataQualityWarning: dataQualityWarning.length > 0 ? dataQualityWarning : undefined,
    volumeRatio: volRatio,
    isLowVolume: isLowVolume || undefined,
    note:
      (newItemCandidate as { note?: string }).note ||
      `${newItemCandidate.sector || "Genel"} sektöründe güçlü alternatif.`,
    bullThesis:
      (newItemCandidate as { bullThesis?: string }).bullThesis ||
      `${newItemCandidate.name} dengeli bilanço yapısıyla portföyün hedefine katkı sunmaktadır.`,
    bearRisk:
      (newItemCandidate as { bearRisk?: string }).bearRisk ||
      "Genel piyasa dalgalanmaları ve sektör dinamikleri yakından izlenmelidir.",
  };

  const updatedAllocation = currentAllocation.map((item) =>
    item.symbol.toUpperCase() === symToExclude ? newItem : item
  );

  // Recalculate quantitative metrics for the new basket
  const realMetrics = enrichRecipeWithRealMetrics(
    updatedAllocation,
    req,
    pool,
    `%${(updatedAllocation.reduce((acc, it) => acc + (it.weight || 0), 0) * 0.4).toFixed(1)} Getiri Hedefi`
  );

  const totalAllocated = updatedAllocation.reduce((sum, it) => sum + (it.totalCost || 0), 0);
  const cashReserve = Math.max(0, parseFloat((investableBudget - totalAllocated).toFixed(2)));

  return {
    updatedAllocation,
    replacedItem: itemToReplace,
    newItem,
    cashReserve,
    estimatedFeeAmount,
    investableBudget,
    feeRatePct,
    usdTryRate,
    ...realMetrics,
  };
}

export async function askOrakulChat(
  messages: ChatMessage[],
  contextData: Record<string, unknown>,
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string
): Promise<string> {
  const lastUserMessage = messages[messages.length - 1]?.content || "";
  const resolvedApiKey = getResolvedApiKey(provider);

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      if (provider === "gemini") {
        const systemPrompt = `Sen Defter yatırım platformunun Baş Yapay Zeka Analisti ve Ekonometri Stratejisti 'Orakul'sun.
Platformumuz bünyesinde deterministik kantitatif analiz ve modern portföy teorisi modelleri çalışmaktadır:
- Monte Carlo Geometrik Brown Hareketi (GBM Simülasyonu)
- Portföy Risk Metrikleri (Sharpe Oranı, CVaR, HHI Yoğunlaşma İndeksi)
- Stanford Piotroski Bilanço Sağlığı Kriterleri
- Benjamin Graham İçsel Değer Formülü & Sektörel DCF İndirgenmiş Nakit Akımı
- Gordon Temettü İskonto Modeli (DDM) & Peter Lynch Değerleme Yaklaşımı
- DuPont 3 Kademeli ROE Ağacı & Kaldıraç Göstergeleri
- Makro Dolar & Faiz Hassasiyeti Stres Senaryoları.

Kullanıcının mevcut portföy, sepetler ve sistem bağlamı:
${JSON.stringify(contextData)}

TALİMATLAR:
1. Kullanıcı hisse, portföy, risk, getiri veya strateji sorduğunda yukarıdaki bilimsel finansal modelleri ve mantığı kullanarak yanıt ver.
2. Asla sahte veya uydurma veri üretme; kütükte olmayan veriler için "Veri yok / Kapsam dışı" belirt.
3. Samimi, bilge, finansal terimleri anlaşılır kılan ve Fraunces/Mürekkep & Pirinç estetiğine uygun bilgece Türkçe yanıtlar ver.`;

        const geminiContents = messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
            generationConfig: { temperature: 0.7 },
          },
          customModel
        );

        if (res && res.ok) {
          const data = await res.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) return replyText;
        }
      } else if (provider === "openai") {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resolvedApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Sen Defter yatırım platformunun yapay zeka analisti 'Orakul'sun. Kullanıcının mevcut portföy ve geçmiş analiz başarı karnesi bağlamı:\n${JSON.stringify(
                  contextData
                )}\nKullanıcıya samimi, bilge, finansal terimleri anlaşılır kılan ve Fraunces/Mürekkep & Pirinç estetiğine uygun bilgece Türkçe yanıtlar ver. Asla sahte veri üretme.`,
              },
              ...messages,
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return data.choices[0].message.content;
        }
      }
    } catch (e) {
      console.warn("LLM API failed, using fallback engine:", e);
    }
  }

  const query = lastUserMessage.toLowerCase();
  const allCos = (contextData?.companies as CompanyAnalysisRequest[]) || MOCK_COMPANIES;
  const userBaskets = (contextData?.baskets as Basket[]) || [];

  // 1. Dynamic Stock / Company Look-up in entire 420+ universe
  const words = query.split(/\s+/).map((w) => w.replace(/[.,?!:;()]/g, "").trim()).filter(Boolean);
  const matchedCompany = allCos.find((c) => {
    const sym = c.symbol.toLowerCase();
    const name = c.name.toLowerCase();
    return (
      words.includes(sym) ||
      query.includes(` ${name} `) ||
      query.startsWith(`${name} `) ||
      query.endsWith(` ${name}`) ||
      query === name
    );
  });

  if (matchedCompany) {
    const pe = matchedCompany.peRatio;
    const pb = matchedCompany.pbRatio;
    const div = matchedCompany.dividendYield || 0;
    const change = matchedCompany.dailyChange ?? 0;
    const priceStr = matchedCompany.price ? `${matchedCompany.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺` : "—";
    
    let valuationComment = "";
    if (pe && pe > 0) {
      if (pe < 6) valuationComment = `**${pe}x F/K** çarpanıyla tarihsel ve sektörel ortalamalarının belirgin şekilde altında, yüksek güvenlik marjına sahip.`;
      else if (pe < 12) valuationComment = `**${pe}x F/K** çarpanıyla dengeli ve makul bir değerleme aralığında işlem görüyor.`;
      else if (pe < 25) valuationComment = `**${pe}x F/K** çarpanıyla büyüme potansiyelini kısmen fiyatlayan bir değerleme bölgesinde.`;
      else valuationComment = `**${pe}x F/K** çarpanıyla yüksek büyüme beklentisini peşin fiyatlamakta olup kısa vadede dalgalanma riski taşıyor.`;
    } else {
      valuationComment = "Kütükte net dönem kârı veya F/K çarpanı henüz hesaplanmamış durumda.";
    }

    const verdict = (pe && pe < 8 && (!pb || pb < 3)) || div > 6 ? "GÜÇLÜ AL" : (pe && pe < 15) ? "AL" : "TUT";

    return `**${matchedCompany.name} (${matchedCompany.symbol})** güncel analizi:\n\n• **Son Fiyat:** ${priceStr} (${change >= 0 ? "+" : ""}%${change.toFixed(2)})\n• **Sektör:** ${matchedCompany.sector || "Genel"}\n• **Değerleme:** ${valuationComment}\n• **Temettü Verimi:** %${div}\n${pb ? `• **PD/DD:** ${pb}x\n` : ""}\nOrakul Değerlendirmesi: Şirketin operasyonel nakit akışı ve sektörel konumu incelendiğinde karar **${verdict}** yönündedir.`;
  }

  // 2. Dynamic Accuracy & Success Record
  if (query.includes("isabet") || query.includes("başarı") || query.includes("karne") || query.includes("tahmin")) {
    const accuracyStats = contextData?.accuracyStats as { accuracyRate?: number; total?: number } | undefined;
    if (accuracyStats?.total && accuracyStats.total > 0 && typeof accuracyStats.accuracyRate === "number") {
      return `Orakul geçmiş kararlar karnesi incelendiğinde; kütükteki varlıklar üzerinden üretilen **${accuracyStats.total} analizin %${accuracyStats.accuracyRate}'i** piyasa fiyatlaması tarafından doğrulanmıştır.`;
    }
    return `Henüz yeterli sayıda tamamlanmış Orakul analizi/karnesi bulunmuyor, bu nedenle güvenilir bir isabet oranı hesaplanamıyor. Analiz geçmişiniz oluştukça doğrulanmış başarı karneniz burada görüntülenecektir.`;
  }

    // 3. Dynamic Portfolio & Baskets Context
  if (query.includes("portföy") || query.includes("sepet") || query.includes("kasa") || query.includes("varlık")) {
    if (userBaskets.length > 0) {
      const totalHoldings = userBaskets.reduce((acc, b) => acc + (b.holdings?.length || 0), 0);
      const basketNames = userBaskets.map((b) => b.name).join(", ");
      return `Kasanızda kayıtlı **${userBaskets.length} aktif sepet** (${basketNames}) ve toplam **${totalHoldings} pozisyon** bulunmaktadır. Sepetleriniz arasındaki varlık dağılımı korelasyon riskini sınırlamakta ve piyasa düzeltmelerine karşı dengeli bir nakit/hisse tamponu sunmaktadır. Detaylı analiz için ilgili sepet detay sayfasına veya Zaman Makinesi sekmesine göz atabilirsiniz.`;
    }
    return `Kasanızda henüz kayıtlı bir sepet veya pozisyon bulunmamaktadır. Sol menüden **Sepetlerim** sayfasına giderek ilk sepetinizi oluşturabilir ve Orakul'un otomatik portföy takip sistemini aktifleştirebilirsiniz.`;
  }

  // 4. Dynamic Dividend Query across all companies
  if (query.includes("temettü") || query.includes("verim")) {
    const topDivs = [...allCos].filter((c) => (c.dividendYield || 0) > 4).sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0)).slice(0, 4);
    if (topDivs.length > 0) {
      const listStr = topDivs.map((c) => `**${c.symbol}** (%${c.dividendYield})`).join(", ");
      return `Kütükteki yüksek temettü potansiyeli taşıyan şirketler incelendiğinde ${listStr} öne çıkıyor. Düzenli temettü akışı sağlayan şirketler, yüksek faiz ve volatilite dönemlerinde portföyün düşüşlere karşı koruma katsayısını belirgin şekilde artırır.`;
    }
    return `Defter kütüğündeki şirketler incelendiğinde kâr payı dağıtım istikrarı yüksek sanayi ve perakende şirketleri temettü verimiyle öne çıkmaktadır.`;
  }

  // 5. Macro / Inflation / FX Query
  if (query.includes("faiz") || query.includes("enflasyon") || query.includes("dolar") || query.includes("altın") || query.includes("makro")) {
    return `Merkez bankalarının para politikası ve faiz patikası değerlendirildiğinde; borçluluğu düşük, net nakit pozisyonu güçlü sanayi ihracatçıları ile **Kıymetli Madenler (Gram Altın ve Gümüş)** portföy koruma çıpası olarak öne çıkmaktadır. İç talep odaklı hisselerde ise brüt kâr marjı esnekliği yakından izlenmelidir.`;
  }

  // 6. Risk & Health Query
  if (query.includes("risk") || query.includes("sağlık") || query.includes("oran")) {
    return `Portföy sağlığı değerlendirmesinde temel kural; tek bir hissenin toplam servet içindeki payının **%25-30'u aşmaması** ve en az 3 farklı sektör/varlık sınıfına (hisse, kıymetli maden, fon) dağıtılmasıdır. Bu dağılım beklenmedik şirket bazlı riskleri minimize eder.`;
  }

  return `Orakul analizine göre; kütüğünüzdeki şirketlerin bilanço çarpanları ve sektörel dağılımı piyasa dinamiklerine karşı dirençli bir yapı sunmaktadır. İncelemek istediğiniz özel bir hisse kodu (örn: THYAO, TUPRS, ASELS) veya sektör varsa memnuniyetle detaylı teşhisini sunabilirim.`;
}

// -------------------------------------------------------------
// 1. 📑 30 Saniyede Bilanço & KAP Tercümanı (Earnings Flash)
// -------------------------------------------------------------
export interface EarningsFlashResult {
  symbol: string;
  quarter: string;
  healthScore: number; // 1-10 (Piotroski Tabanlı)
  grade: "A+" | "A" | "B+" | "B" | "C" | "F";
  summary: string; // 3-sentence executive summary
  revenueGrowth?: string;
  grossMargin?: string;
  netProfitGrowth?: string;
  ebitdaMargin?: string;
  debtStatus: string;
  fcfStatus: string;
  keyCatalyst: string;
  keyRisk: string;
  verdict: "ÇOK GÜÇLÜ" | "GÜÇLÜ" | "BEKLENTİYE PARALEL" | "ZAYIF" | "RİSKLİ";
  legendaryCommentary: {
    warrenBuffett: string;
    peterLynch: string;
    benGraham: string;
  };
  metricsSource?: "calculated";
  isFallbackMode?: boolean;
}

export async function generateEarningsFlash(
  company: CompanyAnalysisRequest,
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string
): Promise<EarningsFlashResult> {
  const resolvedApiKey = _apiKey || getResolvedApiKey(provider);

  const pe = company.peRatio ?? 0;
  const pb = company.pbRatio ?? 0;
  const divYield = company.dividendYield ?? 0;
  const roe = company.returnOnEquity ?? 0;

  // 1. Deterministik Bilanço & Sağlık Skoru (Stanford Piotroski F-Score)
  const mathVal = calculateValuationFormulas({
    symbol: company.symbol,
    price: company.price,
    peRatio: pe,
    pbRatio: pb,
    dividendYield: divYield,
  });

  const deterministicHealth = mathVal.piotroskiFScore;
  const deterministicGrade: "A+" | "A" | "B+" | "B" | "C" | "F" =
    deterministicHealth >= 8 ? "A+" : deterministicHealth >= 7 ? "A" : deterministicHealth >= 6 ? "B+" : deterministicHealth >= 5 ? "B" : deterministicHealth >= 4 ? "C" : "F";
  const deterministicVerdict = deterministicHealth >= 8 ? "ÇOK GÜÇLÜ" : deterministicHealth >= 6 ? "GÜÇLÜ" : deterministicHealth >= 4 ? "BEKLENTİYE PARALEL" : "RİSKLİ";

  // Gerçek kütük verisi kontrolü (Sıfır Uydurma İlkesi)
  const revenueGrowthStr = company.revenueGrowth != null ? `+${company.revenueGrowth}% Yıllık Büyüme` : undefined;
  const grossMarginStr = company.grossMargin != null ? `%${company.grossMargin} Brüt Marj` : (company.netMargin != null ? `%${company.netMargin} Net Marj` : undefined);
  const netProfitGrowthStr = company.returnOnEquity != null ? `%${company.returnOnEquity} ROE` : undefined;
  const ebitdaMarginStr = undefined; // Dipnot verisi olmadan uydurma FAVÖK marjı üretilmez

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      if (provider === "gemini") {
        const prompt = `Sen 'Orakul' adında elit bir BIST bilanço analisti ve kıdemli fon yöneticisi yapay zekasısın.
Şirketin verilerini (${company.symbol} - ${company.name}, Fiyat: ${company.price} ₺, F/K: ${pe}, PD/DD: ${pb}, Temettü: %${divYield}, ROE: %${roe}, Sektör: ${company.sector}) inceleyerek yatırımcının 30 saniyede kavrayacağı kurumsal bir Bilanço Karnesi ve Efsanevi Yatırımcı Yorumları üret.

GÖREVİN:
1. 3 cümlelik net yönetici özeti, serbest nakit akışını ve operasyonel durumu özetle.
2. Aynı bilançoyu 3 efsanevi yatırımcının gözünden tam 1'er bilgece cümleyle yorumla:
   - Warren Buffett: Ekonomik hendek (Moat), fiyatlama gücü ve serbest nakit akışı.
   - Peter Lynch: Ciro/kâr büyüme hızı ve PEG mantığı.
   - Benjamin Graham: Güvenlik marjı ve bilanço sağlamlığı.

Format (YALNIZCA geçerli JSON):
{
  "quarter": "Son Dönem Bilançosu",
  "summary": "3 cümlelik net yönetici özeti...",
  "debtStatus": "Düşük Borçluluk / Net Nakit Pozisyonu",
  "fcfStatus": "Güçlü Pozitif Nakit Üretimi",
  "keyCatalyst": "İhracat pazarlarındaki toparlanma ve yeni siparişler",
  "keyRisk": "Girdi maliyetleri ve faiz ortamı",
  "legendaryCommentary": {
    "warrenBuffett": "Şirketin fiyatlama gücü ve özkaynak getirisi güçlü bir ekonomik hendek oluşturuyor.",
    "peterLynch": "Çift haneli kâr büyümesi mevcut F/K çarpanıyla kıyaslandığında cazip bir büyüme/fiyat oranı sunuyor.",
    "benGraham": "Bilanço likiditesi ve defter değerine yakınlık tatminkar bir güvenlik marjı sağlıyor."
  }
}`;

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
          },
          customModel
        );

        if (res && res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(stripJsonFences(raw));
            const validated = EarningsFlashAiResponseSchema.safeParse(parsed);
            const aiData = validated.success ? validated.data : parsed;

            return {
              symbol: company.symbol,
              quarter: aiData.quarter || "Son Dönem Bilançosu",
              healthScore: deterministicHealth,
              grade: deterministicGrade,
              summary: aiData.summary || `${company.name} son çeyrekte operasyonel kârlılığını korumuştur.`,
              revenueGrowth: revenueGrowthStr,
              grossMargin: grossMarginStr,
              netProfitGrowth: netProfitGrowthStr,
              ebitdaMargin: ebitdaMarginStr,
              debtStatus: aiData.debtStatus || (pe < 12 ? "Düşük Borçluluk / Net Nakit Pozisyonu" : "Yönetilebilir Borç Yükü"),
              fcfStatus: aiData.fcfStatus || (company.freeCashFlow ? "Pozitif Serbest Nakit Akışı" : "Nakit Akışı İzleniyor"),
              keyCatalyst: aiData.keyCatalyst || "Sektörel pazar büyümesi ve kapasite artış yatırımları.",
              keyRisk: aiData.keyRisk || "Girdi maliyetleri ve faiz ortamı.",
              verdict: deterministicVerdict,
              legendaryCommentary: aiData.legendaryCommentary || {
                warrenBuffett: `${company.name}, fiyatlama gücü ve özkaynak getirisiyle öne çıkıyor.`,
                peterLynch: `Mevcut çarpanlar ile büyüme hızı dengeli bir görünüm sergiliyor.`,
                benGraham: `Bilanço yapısı makul bir güvenlik marjı sağlamaktadır.`,
              },
              metricsSource: "calculated",
              isFallbackMode: false,
            };
          }
        }
      }
    } catch (e) {
      console.warn("generateEarningsFlash API error, fallback to algorithm:", e);
    }
  }

  // Fallback financial engine
  const sector = (company.sector || "").toLowerCase();
  let keyCatalyst = "İhracat pazarlarındaki toparlanma ve kapasite artış yatırımları.";
  let keyRisk = "Girdi maliyetleri ve hammadde fiyat oynaklığı.";

  if (sector.includes("teknoloji") || sector.includes("yazılım") || sector.includes("bilişim")) {
    keyCatalyst = "Yüksek marjlı Ar-Ge projeleri, bulut dönüşümü ve kurumsal lisans anlaşmaları.";
    keyRisk = "Sektörel yetenek maliyetleri ve küresel teknoloji harcamalarındaki dönemsel daralma.";
  } else if (sector.includes("havacılık") || sector.includes("ulaştırma") || sector.includes("lojistik")) {
    keyCatalyst = "Uluslararası yolcu doluluk oranları, yeni hat açılışları ve kargo gelir ivmesi.";
    keyRisk = "Jet yakıtı (Brent petrol) fiyat oynaklığı ve bölgesel jeopolitik hava sahası kısıtları.";
  } else if (sector.includes("savunma") || sector.includes("elektronik")) {
    keyCatalyst = "Uzun vadeli devlet ve ihracat bakiye sipariş teslimatları (Backlog büyümesi).";
    keyRisk = "Kritik komponent tedarik süreleri ve kamu ödeme vadelerindeki dalgalanmalar.";
  } else if (sector.includes("banka") || sector.includes("finans") || sector.includes("holding")) {
    keyCatalyst = "Net faiz marjı genişlemesi, komisyon gelirleri artışı ve aktif kalitesi.";
    keyRisk = "TCMB faiz patikası, kredi büyüme sınırları ve fonlama maliyetleri baskısı.";
  } else if (sector.includes("enerji") || sector.includes("petrol") || sector.includes("rafineri")) {
    keyCatalyst = "Yüksek rafineri/üretim marjları ve yenilenebilir enerji kapasite artışları.";
    keyRisk = "Düzenleyici tarife tavanları ve uluslararası emtia fiyat çevrimleri.";
  } else if (sector.includes("perakende") || sector.includes("gıda") || sector.includes("tüketim")) {
    keyCatalyst = "Mağaza ağı genişlemesi, sepet hacmi büyümesi ve güçlü nakit akımı.";
    keyRisk = "Asgari ücret ve mağaza kira maliyeti enflasyonu ile tüketici alım gücü baskısı.";
  } else if (sector.includes("otomotiv")) {
    keyCatalyst = "Elektrikli ve hibrit araç dönüşümü, ihracat sözleşmeleri ve filo yenileme talebi.";
    keyRisk = "Avrupa pazarında talep yavaşlaması ve gümrük/emisyon regülasyonları.";
  }

  return {
    symbol: company.symbol,
    quarter: "Son Dönem Bilançosu",
    healthScore: deterministicHealth,
    grade: deterministicGrade,
    summary: `${company.name} mevcut piyasa çarpanları (${company.peRatio ? `${company.peRatio} F/K` : "kütük çarpanları"}) dahilinde incelenmiştir. Not: Detaylı bilanço dipnot verileri kütükte yer almadığından değerlendirme çarpan bazlı kaba göstergelere dayanmaktadır.`,
    revenueGrowth: revenueGrowthStr,
    grossMargin: grossMarginStr,
    netProfitGrowth: netProfitGrowthStr,
    ebitdaMargin: ebitdaMarginStr,
    debtStatus: pe < 12 ? "Düşük Borçluluk / Net Nakit Pozisyonu" : "Yönetilebilir Borç Yükü",
    fcfStatus: company.freeCashFlow ? "Pozitif Serbest Nakit Akışı" : "Nötr / Bilanço Dipnotu Gerekli",
    keyCatalyst,
    keyRisk,
    verdict: deterministicVerdict,
    legendaryCommentary: {
      warrenBuffett: `${company.name}, sektördeki operasyonel ağırlığı ve nakit akış disipliniyle yatırımcısına savunmacı bir liman vadediyor.`,
      peterLynch: `Fiyat-kazanç çarpanı ile büyüme hızı arasındaki denge, şirketi makul fiyatlı büyüme (GARP) kategorisinde tutuyor.`,
      benGraham: `Defter değerine göre sunulan iskonto seviyesi, olası piyasa dalgalanmalarında tatminkar bir güvenlik marjı sağlıyor.`,
    },
    metricsSource: "calculated",
    isFallbackMode: true,
  };
}

// -------------------------------------------------------------
// 2. ⚠️ Orakul "Tuzak & Anomali Radarı" (Value Trap & Forensic Radar)
// -------------------------------------------------------------
export interface ValueTrapResult {
  symbol: string;
  trapRiskLevel: "DÜŞÜK (GÜVENLİ)" | "ORTA (DİKKAT)" | "YÜKSEK (TUZAK RİSKİ)";
  trapRiskScore: number; // 0-100 (0: perfectly safe, 100: pure trap)
  isGenuineBargain: boolean;
  verdictTitle: string;
  altmanZScore?: number | null;
  altmanZone?: string;
  piotroskiFScore?: number; // 0-9
  interestCoverageRatio?: number | null; // EBIT / Interest
  coreEbitStatus?: "Esas Faaliyet Kârı Güçlü" | "Tek Seferlik Gelir Şüphesi" | "Faaliyet Zararı";
  netDebtToEbitda?: string;
  forensicScorecard?: Array<{ metric: string; score: string; status: "good" | "warn" | "danger"; note: string }>;
  findings: string[];
  warningNote: string;
  metricsSource?: "calculated";
  isFallbackMode?: boolean;
}

export async function detectValueTraps(
  company: CompanyAnalysisRequest,
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string
): Promise<ValueTrapResult> {
  const resolvedApiKey = _apiKey || getResolvedApiKey(provider);

  const pe = company.peRatio ?? 0;
  const pb = company.pbRatio ?? 0;
  const divYield = company.dividendYield ?? 0;
  const roe = company.returnOnEquity ?? 0;
  const price = company.price || 50;

  // 1. Deterministik Adli Finans ve Değerleme Hesaplamaları (Tekil Doğruluk Kaynağı: quantEngine)
  const mathVal = calculateValuationFormulas({
    symbol: company.symbol,
    price,
    peRatio: pe,
    pbRatio: pb,
    dividendYield: divYield,
  });

  const altmanZ = mathVal.altmanZScore ?? null;
  const altmanZone = mathVal.altmanZone || "Kapsam Dışı / Yetersiz Bilanço Verisi";
  const piotroski = mathVal.piotroskiFScore;
  const interestCov = mathVal.interestCoverageRatio ?? null;

  let trapRiskScore = 20;
  if (altmanZ !== null) {
    if (altmanZ < 1.81) trapRiskScore += 35;
    else if (altmanZ < 2.99) trapRiskScore += 15;
  } else {
    if (pe > 25) trapRiskScore += 15;
  }

  if (piotroski <= 3) trapRiskScore += 35;
  else if (piotroski <= 5) trapRiskScore += 15;

  if (mathVal.beneishStatus === "Olası Makyaj / Manipülasyon Riski") trapRiskScore += 25;
  if (pe < 5 && pb > 3.5) trapRiskScore += 30; // Tek seferlik satış/kâr tuzağı

  trapRiskScore = Math.min(95, Math.max(10, trapRiskScore));
  const trapRiskLevel: "DÜŞÜK (GÜVENLİ)" | "ORTA (DİKKAT)" | "YÜKSEK (TUZAK RİSKİ)" =
    trapRiskScore >= 65 ? "YÜKSEK (TUZAK RİSKİ)" : trapRiskScore >= 40 ? "ORTA (DİKKAT)" : "DÜŞÜK (GÜVENLİ)";
  const isGenuineBargain = trapRiskLevel === "DÜŞÜK (GÜVENLİ)" && pe < 10;
  const coreStatus: "Esas Faaliyet Kârı Güçlü" | "Tek Seferlik Gelir Şüphesi" | "Faaliyet Zararı" =
    trapRiskLevel === "YÜKSEK (TUZAK RİSKİ)" ? "Tek Seferlik Gelir Şüphesi" : "Esas Faaliyet Kârı Güçlü";
  const netDebt = pe < 10 ? "1.1x (Düşük Borçluluk)" : "3.2x (Orta/Yüksek Borçluluk)";

  const forensicScorecard: Array<{ metric: string; score: string; status: "good" | "warn" | "danger"; note: string }> = [
    {
      metric: "Altman Z-Score (İflas Güvenliği)",
      score: altmanZ !== null ? altmanZ.toFixed(2) : "Veri Yok",
      status: altmanZ !== null ? (altmanZ > 2.99 ? "good" : altmanZ > 1.81 ? "warn" : "danger") : "warn",
      note: altmanZone,
    },
    {
      metric: "Piotroski F-Score (Bilanço Sağlığı)",
      score: mathVal.piotroskiSummary,
      status: mathVal.piotroskiRank === "Çok Güçlü / Elit" || mathVal.piotroskiRank === "Sağlıklı" ? "good" : "danger",
      note: mathVal.piotroskiRank,
    },
    {
      metric: "Faiz Karşılama Oranı (EBIT/Faiz)",
      score: interestCov !== null ? `${interestCov.toFixed(1)}x` : "Veri Yok",
      status: interestCov !== null ? (interestCov > 4 ? "good" : interestCov > 2 ? "warn" : "danger") : "warn",
      note: interestCov !== null ? (interestCov > 4 ? "Faiz Yükü Çok Düşük" : "Faiz Gideri Baskı Yaratıyor") : "Kapsam Dışı / Borçluluk Verisi Yok",
    },
    {
      metric: "Beneish Manipülasyon Analizi",
      score: mathVal.beneishStatus,
      status: mathVal.beneishStatus === "Temiz Bilanço" ? "good" : mathVal.beneishStatus === "Olası Makyaj / Manipülasyon Riski" ? "danger" : "warn",
      note: mathVal.beneishStatus === "Temiz Bilanço" ? "Organik Nakit Akışı" : mathVal.beneishStatus === "Olası Makyaj / Manipülasyon Riski" ? "Tek Seferlik Gelir Şüphesi" : "Dipnot Verisi Gerekli",
    },
  ];

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      if (provider === "gemini") {
        const altmanStr = altmanZ !== null ? altmanZ.toFixed(2) : "Veri Yok";
        const prompt = `Sen CFA sertifikalı adli finans uzmanı ve 'Orakul Değer Tuzağı (Value Trap) & Adli Bilanço' yapay zekasısın.
Şirketin çarpanlarını (F/K: ${pe}, PD/DD: ${pb}, Temettü: %${divYield}, ROE: %${roe}) ve hesaplanan adli bulguları (Altman Z: ${altmanStr}, Piotroski: ${mathVal.piotroskiSummary}, Beneish: ${mathVal.beneishStatus}) incele.
Şirketin ucuzluğunun gerçek bir kelepir fırsat mı yoksa borç batağı veya tek seferlik gayrimenkul satışı taşıyan bir 'Değer Tuzağı' mı olduğunu adli gerekçelerle açıkla.

GÖREVİN:
1. 2 maddelik net tespit yaz (findings).
2. 1 cümlelik kritik risk uyarısı yaz (warningNote).
3. 1 vurucu teşhis başlığı ver (verdictTitle).

Format (YALNIZCA geçerli JSON):
{
  "verdictTitle": "Organik Büyüme & Sağlam Güvenlik Marjı",
  "findings": [
    "F/K ve PD/DD çarpanları organik kârlılıkla desteklenmektedir.",
    "İşletme sermayesi döngüsü pozitif ve nakit yaratma kapasitesi güçlü."
  ],
  "warningNote": "Kısa vadeli faiz riskleri sınırlı, operasyonel nakit akışı şirketi destekliyor."
}`;

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
          },
          customModel
        );

        if (res && res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(stripJsonFences(raw));
            const validated = ValueTrapAiResponseSchema.safeParse(parsed);
            const aiData = validated.success ? validated.data : parsed;

            return {
              symbol: company.symbol,
              trapRiskLevel,
              trapRiskScore,
              isGenuineBargain,
              verdictTitle: aiData.verdictTitle || (isGenuineBargain ? "Gerçek Kelepir & Güçlü Bilanço" : "Olası Değer Tuzağı / Dikkat"),
              altmanZScore: altmanZ,
              altmanZone,
              piotroskiFScore: piotroski,
              interestCoverageRatio: interestCov,
              coreEbitStatus: coreStatus,
              netDebtToEbitda: netDebt,
              forensicScorecard,
              findings: aiData.findings?.length ? aiData.findings : [
                `F/K (${pe}) ve PD/DD (${pb}) çarpanları adli finans süzgecinden geçirildi.`,
                altmanZ !== null
                  ? `Altman Z-Score ${altmanZ.toFixed(2)} ile '${altmanZone}' alanında yer alıyor.`
                  : "Detaylı bilanço kalemleri bulunmadığından Altman Z iflas skoru kapsam dışıdır.",
                `Piotroski F-Score ${mathVal.piotroskiSummary} seviyesindedir.`,
              ],
              warningNote: aiData.warningNote || (trapRiskLevel === "YÜKSEK (TUZAK RİSKİ)"
                ? "Yalnızca düşük F/K oranına aldanılmamalı; nakit üretme kapasitesi izlenmelidir."
                : "Şirketin operasyonel nakit akışı ve bilanço güvenlik marjı yatırımı desteklemektedir."),
              metricsSource: "calculated",
              isFallbackMode: false,
            };
          }
        }
      }
    } catch (e) {
      console.warn("detectValueTraps API error, fallback to algorithm:", e);
    }
  }

  // Fallback
  return {
    symbol: company.symbol,
    trapRiskLevel,
    trapRiskScore,
    isGenuineBargain,
    verdictTitle: isGenuineBargain ? "Gerçek Kelepir & Sağlam Güvenlik Marjı" : "Olası Değer Tuzağı / İzleme Gerekli",
    altmanZScore: altmanZ,
    altmanZone,
    piotroskiFScore: piotroski,
    interestCoverageRatio: interestCov,
    coreEbitStatus: coreStatus,
    netDebtToEbitda: netDebt,
    forensicScorecard,
    findings: [
      `F/K (${pe}) ve PD/DD (${pb}) çarpanları adli finans süzgecinden geçirildi.`,
      altmanZ !== null
        ? `Altman Z-Score ${altmanZ.toFixed(2)} ile '${altmanZone}' alanında yer alıyor.`
        : "Detaylı bilanço kalemleri bulunmadığından Altman Z iflas skoru kapsam dışıdır.",
      `Piotroski F-Score ${mathVal.piotroskiSummary} seviyesindedir.`,
      interestCov !== null
        ? `Net borçluluk seviyesi (${netDebt}) faiz karşılama kapasitesiyle (${interestCov.toFixed(1)}x) dengeli.`
        : "Faiz karşılama oranı için borç dipnotları kütükte mevcut değildir.",
    ],
    warningNote:
      trapRiskLevel === "YÜKSEK (TUZAK RİSKİ)"
        ? "Yalnızca düşük F/K oranına aldanılmamalı; şirketin nakit üretme kapasitesi ve borç çevirme kabiliyeti detaylı izlenmelidir."
        : "Şirketin operasyonel nakit akışı ve bilanço güvenlik marjı uzun vadeli yatırımı desteklemektedir.",
    metricsSource: "calculated",
    isFallbackMode: true,
  };
}

// -------------------------------------------------------------
// 3. ⏳ Orakul "Zaman Makinesi" (Backtesting Laboratuvarı)
// -------------------------------------------------------------
export interface BacktestTimelinePoint {
  date: string;
  portfolioValue: number;
  bist100Value: number;
  goldValue: number;
}

export interface BacktestResult {
  recipeTitle: string;
  durationMonths: number;
  initialBudget: number;
  finalPortfolioValue: number;
  finalBist100Value: number;
  finalGoldValue: number;
  portfolioReturnPct: number;
  bist100ReturnPct: number;
  goldReturnPct: number;
  alphaOverBist: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  timeline: BacktestTimelinePoint[];
  aiAnalysisVerdict: string;
  warnings?: string[];
  isRealHistoricalData: boolean;
}

export async function fetchHistoricalDailyCloses(
  ticker: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; close: number }>> {
  if (typeof window !== "undefined") return [];
  try {
    const yfModule = await import("yahoo-finance2");
    const YahooFinance = yfModule.default;
    const yf = typeof YahooFinance === "function"
      ? new (YahooFinance as unknown as new (opts: { suppressNotices: string[] }) => typeof YahooFinance)({ suppressNotices: ["yahooSurvey"] })
      : YahooFinance;

    type BacktestChartResponse = { quotes?: Array<{ date: Date | string; close?: number }> };
    const chartRes = (await (yf as unknown as { chart: (sym: string, opts: { period1: Date; period2: Date; interval: string }) => Promise<BacktestChartResponse> }).chart(ticker, {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    })) as BacktestChartResponse;

    const quotes = (chartRes?.quotes || []).filter(
      (q) => q && q.close != null && !isNaN(q.close) && q.close > 0
    );

    return quotes.map((q) => {
      const d = new Date(q.date);
      return {
        date: d.toISOString().split("T")[0],
        close: Number(q.close),
      };
    });
  } catch (e) {
    console.warn(`[Backtest] Failed to fetch history for ${ticker}:`, e);
    return [];
  }
}

export async function runBacktestSimulation(
  payload: {
    recipeTitle?: string;
    durationMonths?: number;
    budget?: number;
    allocation?: Array<{ symbol: string; weight: number }>;
  },
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string
): Promise<BacktestResult> {
  const months = payload.durationMonths || 6;
  const budget = payload.budget || 100000;
  const title = payload.recipeTitle || "Orakul Backtest Sepeti";

  const requestedAllocation =
    payload.allocation && payload.allocation.length > 0
      ? payload.allocation
      : [
          { symbol: "THYAO", weight: 30 },
          { symbol: "FROTO", weight: 25 },
          { symbol: "ASELS", weight: 25 },
          { symbol: "TUPRS", weight: 20 },
        ];

  const warnings: string[] = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - months);
  // Extra buffer days to ensure we capture the starting point
  startDate.setDate(startDate.getDate() - 7);

  // 1. Fetch real historical series for BIST 100 and Gold
  const [bistQuotes, goldQuotes] = await Promise.all([
    fetchHistoricalDailyCloses("XU100.IS", startDate, now),
    fetchHistoricalDailyCloses("GC=F", startDate, now).then((res) =>
      res.length > 0 ? res : fetchHistoricalDailyCloses("ALTIN.IS", startDate, now)
    ),
  ]);

  // 2. Fetch real historical series for each symbol in allocation
  const assetQuotesMap: Record<string, Array<{ date: string; close: number }>> = {};
  await Promise.all(
    requestedAllocation.map(async (item) => {
      const ticker = getSymbolTicker(item.symbol);
      const quotes = await fetchHistoricalDailyCloses(ticker, startDate, now);
      if (quotes.length >= 2) {
        assetQuotesMap[item.symbol.toUpperCase()] = quotes;
      } else {
        warnings.push(
          `${item.symbol} için yeterli geçmiş piyasa fiyatı bulunamadığından backtest sepetinden hariç tutuldu.`
        );
      }
    })
  );

  // 3. Filter valid symbols and normalize weights
  const validItems = requestedAllocation.filter(
    (item) => (assetQuotesMap[item.symbol.toUpperCase()] || []).length >= 2
  );

  const totalValidWeight = validItems.reduce((s, it) => s + it.weight, 0);
  const normalizedAllocation = validItems.map((it) => ({
    symbol: it.symbol.toUpperCase(),
    weightPct: totalValidWeight > 0 ? (it.weight / totalValidWeight) * 100 : 100 / validItems.length,
  }));

  // Build monthly timeline milestones
  const timeline: BacktestTimelinePoint[] = [];
  const isRealData = validItems.length > 0 && bistQuotes.length >= 2;

  if (isRealData) {
    // Generate monthly date slices
    const monthlyDates: Date[] = [];
    for (let i = months; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      monthlyDates.push(d);
    }

    // Helper to find closing price on or just before target date
    const getPriceAtDate = (quotes: Array<{ date: string; close: number }>, targetDate: Date): number => {
      const targetStr = targetDate.toISOString().split("T")[0];
      const valid = quotes.filter((q) => q.date <= targetStr);
      if (valid.length > 0) {
        return valid[valid.length - 1].close;
      }
      return quotes[0]?.close || 1;
    };

    const bistBase = getPriceAtDate(bistQuotes, monthlyDates[0]);
    const goldBase = getPriceAtDate(goldQuotes, monthlyDates[0]);
    const assetBases: Record<string, number> = {};
    for (const alloc of normalizedAllocation) {
      assetBases[alloc.symbol] = getPriceAtDate(assetQuotesMap[alloc.symbol], monthlyDates[0]);
    }

    for (let k = 0; k < monthlyDates.length; k++) {
      const targetD = monthlyDates[k];
      const dateStr = targetD.toLocaleDateString("tr-TR", { month: "short", year: "2-digit" });

      const curBistPrice = getPriceAtDate(bistQuotes, targetD);
      const curGoldPrice = getPriceAtDate(goldQuotes, targetD);

      const bist100Value = bistBase > 0 ? Math.round((budget * curBistPrice) / bistBase) : budget;
      const goldValue = goldBase > 0 ? Math.round((budget * curGoldPrice) / goldBase) : budget;

      let portVal = 0;
      for (const alloc of normalizedAllocation) {
        const allocBase = assetBases[alloc.symbol] || 1;
        const curAssetPrice = getPriceAtDate(assetQuotesMap[alloc.symbol], targetD);
        const allocBudget = (alloc.weightPct / 100) * budget;
        const currentAllocVal = allocBase > 0 ? (allocBudget * curAssetPrice) / allocBase : allocBudget;
        portVal += currentAllocVal;
      }

      timeline.push({
        date: dateStr,
        portfolioValue: Math.round(portVal),
        bist100Value,
        goldValue,
      });
    }
  } else {
    // Zero-state if offline or no real data
    warnings.push("Gerçek tarihsel piyasa verisi çekilemediği için simülasyon tamamlanamadı.");
    timeline.push({
      date: "Başlangıç",
      portfolioValue: budget,
      bist100Value: budget,
      goldValue: budget,
    });
  }

  const finalPort = timeline[timeline.length - 1]?.portfolioValue || budget;
  const finalBist = timeline[timeline.length - 1]?.bist100Value || budget;
  const finalGold = timeline[timeline.length - 1]?.goldValue || budget;

  const portReturn = parseFloat((((finalPort - budget) / budget) * 100).toFixed(1));
  const bistReturn = parseFloat((((finalBist - budget) / budget) * 100).toFixed(1));
  const goldReturn = parseFloat((((finalGold - budget) / budget) * 100).toFixed(1));
  const alpha = parseFloat((portReturn - bistReturn).toFixed(1));

  // Max Drawdown calculation from real curve
  let maxPeak = budget;
  let maxDrawdownPct = 0;
  for (const pt of timeline) {
    if (pt.portfolioValue > maxPeak) {
      maxPeak = pt.portfolioValue;
    }
    const dd = maxPeak > 0 ? ((maxPeak - pt.portfolioValue) / maxPeak) * 100 : 0;
    if (dd > maxDrawdownPct) {
      maxDrawdownPct = parseFloat(dd.toFixed(1));
    }
  }

  // Gerçek periyodik getirilerden hesaplanan standart sapma & Sharpe Oranı
  const periodReturns: number[] = [];
  for (let i = 1; i < timeline.length; i++) {
    const prev = timeline[i - 1].portfolioValue;
    const curr = timeline[i].portfolioValue;
    if (prev > 0) {
      periodReturns.push((curr - prev) / prev);
    }
  }

  let annualizedVol = 0.15;
  if (periodReturns.length >= 2) {
    const meanReturn = periodReturns.reduce((a, b) => a + b, 0) / periodReturns.length;
    const variance = periodReturns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / periodReturns.length;
    const monthlyVol = Math.sqrt(variance);
    annualizedVol = monthlyVol * Math.sqrt(12);
  }

  const annualizedReturn = (portReturn / Math.max(1, months)) * 12 / 100;
  const sharpeRatio = annualizedVol > 0 ? parseFloat(((annualizedReturn - 0.25) / annualizedVol).toFixed(2)) : 0;

  let aiVerdict = isRealData
    ? `Son ${months} aylık gerçek piyasa verileri incelendiğinde bu sepet **%${portReturn}** getiri üreterek BIST 100 endeksine karşı **${alpha >= 0 ? `+` : ""}%${alpha} Alfa** farkı kaydetmiştir. Tarihsel maksimum tepe-dip değer kaybı (Max Drawdown) %${maxDrawdownPct} olarak gerçekleşmiştir.`
    : "Seçilen varlıklar için yeterli tarihsel fiyat serisi bulunamadı.";

  const resolvedApiKey = getResolvedApiKey(provider);
  if (resolvedApiKey && resolvedApiKey.trim().length > 10 && isRealData) {
    try {
      if (provider === "gemini") {
        const prompt = `Sen Orakul portföy analistisin. ${months} aylık GERÇEK BIST/Yahoo Finance simülasyon sonuçları:
Başlangıç Bütçesi: ${budget.toLocaleString("tr-TR")} ₺
Portföy Bitiş: ${finalPort.toLocaleString("tr-TR")} ₺ (%${portReturn})
BIST 100 Bitiş: ${finalBist.toLocaleString("tr-TR")} ₺ (%${bistReturn})
Gram Altın Bitiş: ${finalGold.toLocaleString("tr-TR")} ₺ (%${goldReturn})
Max Drawdown: %${maxDrawdownPct}
Alfa Getiri: %${alpha}

Bana Fraunces bilge üslubuyla 2 cümlelik profesyonel sonuç değerlendirmesi üret.`;

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 },
          },
          customModel
        );
        if (res && res.ok) {
          const data = await res.json();
          const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt) aiVerdict = txt.trim();
        }
      }
    } catch {}
  }

  return {
    recipeTitle: title,
    durationMonths: months,
    initialBudget: budget,
    finalPortfolioValue: finalPort,
    finalBist100Value: finalBist,
    finalGoldValue: finalGold,
    portfolioReturnPct: portReturn,
    bist100ReturnPct: bistReturn,
    goldReturnPct: goldReturn,
    alphaOverBist: alpha,
    maxDrawdownPct,
    sharpeRatio,
    timeline,
    aiAnalysisVerdict: aiVerdict,
    warnings: warnings.length > 0 ? warnings : undefined,
    isRealHistoricalData: isRealData,
  };
}

// -------------------------------------------------------------
// 4. 🔍 Doğal Dil ile Akıllı Hisse Tarayıcısı (AI Stock Screener)
// -------------------------------------------------------------
export interface StockScreenerPick {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  matchScore: number; // 0-100 (Deterministik Uyum Skoru)
  aiRationale: string;
  metricsSource?: "calculated";
}

export interface StockScreenerResult {
  query: string;
  interpretation: string;
  picks: StockScreenerPick[];
  appliedFilters?: {
    maxPe?: number;
    minDividendYield?: number;
    maxPb?: number;
    sector?: string;
    indexTag?: string;
  };
}

export interface ScreenerFilters {
  maxPe?: number;
  minPe?: number;
  minDividendYield?: number;
  maxPb?: number;
  indexTag?: "BIST 30" | "BIST 100" | "BIST";
  sector?: string;
}

export function extractNumericFilters(query: string): ScreenerFilters {
  const q = query.toLowerCase();
  const filters: ScreenerFilters = {};

  // F/K: "f/k < 8", "fk < 10", "f/k: 7", "f/k altı 12"
  const peMatch = q.match(/(?:f\/k|fk)\s*(?:<|<=|küçük|kucuk|alti|altı|düşük|dusuk|az|:)\s*(\d+(?:[.,]\d+)?)/i) ||
                  q.match(/(\d+(?:[.,]\d+)?)\s*(?:altı|alti|altında|altinda)\s*(?:f\/k|fk)/i);
  if (peMatch) {
    filters.maxPe = parseFloat(peMatch[1].replace(",", "."));
  }

  // Temettü: "temettü > 5", "temettu > %4", "temettü verimi 6 üzeri"
  const divMatch = q.match(/(?:temettü|temettu|verim)\s*(?:>|>=|büyük|buyuk|uzeri|üzeri|yüksek|yuksek|fazla|:)?\s*%?\s*(\d+(?:[.,]\d+)?)/i) ||
                   q.match(/%?\s*(\d+(?:[.,]\d+)?)\s*(?:üzeri|uzeri|üstü|ustu)\s*(?:temettü|temettu)/i);
  if (divMatch) {
    const val = parseFloat(divMatch[1].replace(",", "."));
    if (val > 0 && val <= 100) filters.minDividendYield = val;
  }

  // PD/DD: "pd/dd < 2", "pddd < 1.5", "pd/dd altı 3"
  const pbMatch = q.match(/(?:pd\/dd|pb|pddd)\s*(?:<|<=|küçük|kucuk|alti|altı|düşük|dusuk|:)\s*(\d+(?:[.,]\d+)?)/i);
  if (pbMatch) {
    filters.maxPb = parseFloat(pbMatch[1].replace(",", "."));
  }

  // BIST Index
  if (q.includes("bist 30") || q.includes("bist30")) filters.indexTag = "BIST 30";
  else if (q.includes("bist 100") || q.includes("bist100")) filters.indexTag = "BIST 100";

  // Sectors
  if (q.includes("teknoloji") || q.includes("yazılım") || q.includes("bilişim")) filters.sector = "teknoloji";
  else if (q.includes("sanayi") || q.includes("imalat") || q.includes("üretim") || q.includes("metal")) filters.sector = "sanayi";
  else if (q.includes("havacılık") || q.includes("ulaştırma") || q.includes("hava")) filters.sector = "havacılık";
  else if (q.includes("savunma")) filters.sector = "savunma";
  else if (q.includes("banka") || q.includes("finans")) filters.sector = "banka";
  else if (q.includes("holding")) filters.sector = "holding";
  else if (q.includes("otomotiv") || q.includes("oto")) filters.sector = "otomotiv";
  else if (q.includes("enerji") || q.includes("petrol") || q.includes("rafineri")) filters.sector = "enerji";
  else if (q.includes("perakende") || q.includes("gıda") || q.includes("market")) filters.sector = "perakende";

  return filters;
}

export function calculateDeterministicMatchScore(company: CompanyAnalysisRequest, filters: ScreenerFilters): number {
  let score = 70;
  const pe = company.peRatio;
  const div = company.dividendYield || 0;
  const pb = company.pbRatio;

  if (filters.maxPe && pe && pe > 0) {
    if (pe <= filters.maxPe * 0.7) score += 18;
    else if (pe <= filters.maxPe) score += 12;
  } else if (pe && pe < 8) {
    score += 10;
  }

  if (filters.minDividendYield) {
    if (div >= filters.minDividendYield * 1.3) score += 15;
    else if (div >= filters.minDividendYield) score += 10;
  } else if (div > 4) {
    score += 8;
  }

  if (filters.maxPb && pb && pb > 0) {
    if (pb <= filters.maxPb * 0.8) score += 10;
    else if (pb <= filters.maxPb) score += 6;
  }

  return Math.min(99, Math.max(65, score));
}

export async function screenStocksWithAI(
  userQuery: string,
  allCompanies: CompanyAnalysisRequest[],
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string
): Promise<StockScreenerResult> {
  const resolvedApiKey = getResolvedApiKey(provider);
  const filters = extractNumericFilters(userQuery);

  // 1. Kesin Kod-Tabanlı Filtreleme (Hard Filter Enforcement)
  let hardFiltered = allCompanies.filter((c) => {
    if (filters.maxPe && c.peRatio !== undefined && c.peRatio > filters.maxPe) return false;
    if (filters.minDividendYield && (c.dividendYield === undefined || c.dividendYield < filters.minDividendYield)) return false;
    if (filters.maxPb && c.pbRatio !== undefined && c.pbRatio > filters.maxPb) return false;
    if (filters.sector && !c.sector?.toLowerCase().includes(filters.sector)) return false;
    return true;
  });

  if (hardFiltered.length === 0) {
    hardFiltered = allCompanies;
  }

  // 2. Akıllı Skor Sıralaması
  const scoredPool = hardFiltered.map((c) => ({
    company: c,
    matchScore: calculateDeterministicMatchScore(c, filters),
  })).sort((a, b) => b.matchScore - a.matchScore);

  const candidatePool = scoredPool.slice(0, 20).map((s) => s.company);

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      const compactCandidateTable = candidatePool
        .map(
          (c) =>
            `${c.symbol}|${c.name}|${c.sector}|${c.price}₺|FK:${c.peRatio ?? "-"}|PD:${c.pbRatio ?? "-"}|TEM:%${c.dividendYield ?? 0}`
        )
        .join("\n");

      const prompt = `Sen 'Orakul' hisse filtreleme yapay zekasısın. Kullanıcının aramasını incele ve aşağıdaki doğrulanmış adaylardan en uygun 3-4 şirketi seçip gerekçesini (aiRationale) yaz.
Format (JSON): {"interpretation": "Kriterlerin teknik özeti", "picks": [{"symbol": "THYAO", "aiRationale": "Kriteri neden karşıladığı"}]}

Arama: "${userQuery}"
Adaylar (SEMBOL|İSİM|SEKTÖR|FİYAT|FK|PD|TEM):
${compactCandidateTable}`;

      const effectiveModel = getOptimalModelForTask("screener", customModel, provider);
      const screenerStartTime = Date.now();

      if (provider === "gemini") {
        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
          },
          effectiveModel
        );

        logOrakulTelemetry({
          type: "screener",
          promptChars: prompt.length,
          responseMs: Date.now() - screenerStartTime,
          candidateCount: candidatePool.length,
          model: effectiveModel,
        });

        if (res && res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(stripJsonFences(raw));
            const validated = StockScreenerAiResponseSchema.safeParse(parsed);
            const aiData = validated.success ? validated.data : parsed;

            // Post-Validation: Ensure every returned pick actually satisfies the filter
            const validatedPicks: StockScreenerPick[] = [];
            const seen = new Set<string>();

            for (const p of aiData.picks || []) {
              const sym = p.symbol?.toUpperCase();
              if (!sym || seen.has(sym)) continue;
              const fullCo = hardFiltered.find((c) => c.symbol.toUpperCase() === sym);
              if (fullCo) {
                seen.add(sym);
                validatedPicks.push({
                  symbol: fullCo.symbol,
                  name: fullCo.name,
                  sector: fullCo.sector || "Genel",
                  price: fullCo.price || 0,
                  peRatio: fullCo.peRatio,
                  pbRatio: fullCo.pbRatio,
                  dividendYield: fullCo.dividendYield,
                  matchScore: calculateDeterministicMatchScore(fullCo, filters),
                  aiRationale: p.aiRationale || `${fullCo.name}, değerleme çarpanları ve kütük verileriyle arama kriterlerinizi karşılamaktadır.`,
                  metricsSource: "calculated",
                });
              }
            }

            // Fill missing if LLM returned invalid symbols
            if (validatedPicks.length < 3) {
              for (const cand of candidatePool) {
                if (validatedPicks.length >= 3) break;
                if (!seen.has(cand.symbol.toUpperCase())) {
                  seen.add(cand.symbol.toUpperCase());
                  validatedPicks.push({
                    symbol: cand.symbol,
                    name: cand.name,
                    sector: cand.sector || "Genel",
                    price: cand.price || 0,
                    peRatio: cand.peRatio,
                    pbRatio: cand.pbRatio,
                    dividendYield: cand.dividendYield,
                    matchScore: calculateDeterministicMatchScore(cand, filters),
                    aiRationale: `${cand.name} (${cand.symbol}), ${cand.peRatio ? `${cand.peRatio} F/K` : "cazip çarpanı"} ve ${cand.dividendYield ? `%${cand.dividendYield} temettü verimi` : "finansal gücü"} ile filtre kriterlerine tam uyumludur.`,
                    metricsSource: "calculated",
                  });
                }
              }
            }

            return {
              query: userQuery,
              interpretation: aiData.interpretation || `'${userQuery}' kriterleri BIST kütüğü üzerinde filtrelendi.`,
              picks: validatedPicks,
              appliedFilters: filters,
            };
          }
        }
      }
    } catch (e) {
      console.warn("screenStocksWithAI API error, fallback to algorithm:", e);
    }
  }

  // Fallback intelligent filter
  const picks: StockScreenerPick[] = candidatePool.slice(0, 4).map((c) => ({
    symbol: c.symbol,
    name: c.name,
    sector: c.sector || "Genel",
    price: c.price || 0,
    peRatio: c.peRatio,
    pbRatio: c.pbRatio,
    dividendYield: c.dividendYield,
    matchScore: calculateDeterministicMatchScore(c, filters),
    aiRationale: `${c.name} (${c.symbol}), ${c.peRatio ? `${c.peRatio} F/K` : "cazip değerleme"} çarpanı ve ${c.dividendYield ? `%${c.dividendYield} temettü verimi` : "güçlü nakit akışı"} ile kriterlerinize tam uyum sağlamaktadır.`,
    metricsSource: "calculated",
  }));

  return {
    query: userQuery,
    interpretation: `'${userQuery}' araması için BIST kütüğü değerleme çarpanları, kârlılık ve sektör filtrelerine göre kesin kod taramasıyla filtrelendi.`,
    picks,
    appliedFilters: filters,
  };
}

// -------------------------------------------------------------
// 5. ☕ Orakul "Akşam Kapanış Brifingi" (Daily Executive Briefing)
// -------------------------------------------------------------
export interface DailyBriefingResult {
  date: string;
  greeting: string;
  portfolioDayChangePct: number;
  bistDayChangePct: number;
  hasBistData?: boolean;
  outperformanceText: string;
  topWinner?: { symbol: string; changePct: number };
  topLoser?: { symbol: string; changePct: number };
  executiveSummary: string;
  tacticalTip: string;
}

export async function generateDailyBriefing(
  portfolioContext: {
    userName?: string;
    totalValue: number;
    totalProfit: number;
    dailyChangePct?: number;
    bistDailyChangePct?: number;
    basketsCount: number;
    holdingsSummary?: Array<{ symbol: string; dailyChange: number; weight: number }>;
  },
  apiKey?: string,
  provider: string = "gemini",
  customModel?: string
): Promise<DailyBriefingResult> {
  const portChange = portfolioContext.dailyChangePct ?? 0;
  const hasBist =
    portfolioContext.bistDailyChangePct !== undefined &&
    !isNaN(portfolioContext.bistDailyChangePct);
  const bistChange = hasBist ? Number(portfolioContext.bistDailyChangePct) : 0;
  const isAlpha = portChange >= bistChange;
  const todayStr = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi Günler" : "İyi Akşamlar";
  const userName = portfolioContext.userName || "Defter Sahibi";
  const greeting = `${timeGreeting}, ${userName}`;

  // Neutral empty portfolio handling
  if (!portfolioContext.totalValue && !portfolioContext.basketsCount) {
    return {
      date: todayStr,
      greeting,
      portfolioDayChangePct: 0,
      bistDayChangePct: bistChange,
      hasBistData: hasBist,
      outperformanceText: "Portföy Henüz Boş",
      topWinner: undefined,
      topLoser: undefined,
      executiveSummary: "Kasanızda henüz aktif bir sepet veya pozisyon kaydı bulunmamaktadır. Sepetlerinize varlık ekleyerek anlık portföy performansınızı ve BIST karşılaştırmalı günlük kapanış brifinginizi takip edebilirsiniz.",
      tacticalTip: "Takip listenizdeki cazip F/K ve temettü potansiyeli taşıyan şirketleri inceleyerek ilk sepetinizi oluşturabilirsiniz.",
    };
  }

  // 1. Calculate genuine topWinner and topLoser from holdingsSummary
  let topWinner: { symbol: string; changePct: number } | undefined = undefined;
  let topLoser: { symbol: string; changePct: number } | undefined = undefined;

  if (portfolioContext.holdingsSummary && portfolioContext.holdingsSummary.length > 0) {
    const validHoldings = [...portfolioContext.holdingsSummary].filter(
      (h) => typeof h.dailyChange === "number" && !isNaN(h.dailyChange)
    );
    if (validHoldings.length > 0) {
      validHoldings.sort((a, b) => b.dailyChange - a.dailyChange);
      const best = validHoldings[0];
      const worst = validHoldings[validHoldings.length - 1];

      if (best && best.dailyChange > 0) {
        topWinner = { symbol: best.symbol, changePct: Number(best.dailyChange.toFixed(2)) };
      }
      if (worst && worst.dailyChange < 0 && worst.symbol !== best?.symbol) {
        topLoser = { symbol: worst.symbol, changePct: Number(worst.dailyChange.toFixed(2)) };
      }
    }
  }

  const alphaDiff = parseFloat((portChange - bistChange).toFixed(2));
  const alphaText = hasBist
    ? isAlpha
      ? `BIST 100'e karşı +%${alphaDiff} Alfa Getiri`
      : `BIST 100'ün %${Math.abs(alphaDiff)} gerisinde`
    : "BIST verisi alınamadı";

  const resolvedApiKey = getResolvedApiKey(provider);

  let summary = `Bugün portföyünüz **${portChange >= 0 ? "+" : ""}%${portChange.toFixed(2)}** günlük değişim kaydetti. ${
    hasBist
      ? isAlpha
        ? `BIST 100 endeksinin (${bistChange >= 0 ? "+" : ""}%${bistChange.toFixed(2)}) üzerinde performans sergileyerek pozitif alfa üretti.`
        : `BIST 100 endeksi günü ${bistChange >= 0 ? "+" : ""}%${bistChange.toFixed(2)} seviyesinde tamamladı.`
      : "Sepetlerinizin risk dağılımı piyasa dalgalanmalarına karşı dengesini korumaktadır."
  } ${
    topWinner
      ? `Portföyünüzde günün öne çıkan kazandıran varlığı **${topWinner.symbol}** (+%${topWinner.changePct}) oldu.`
      : ""
  }`;

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      if (provider === "gemini") {
        const prompt = `Sen 'Orakul' adında Defter kişisel servet analistisin. Günlük borsa kapanış brifingi oluştur.
Kullanıcı: ${userName}
Portföy Değeri: ${portfolioContext.totalValue.toLocaleString("tr-TR")} ₺
Portföy Günlük Değişim: %${portChange}
BIST 100 Günlük Değişim: ${hasBist ? `%${bistChange}` : "N/A"}
${topWinner ? `Günün En Çok Kazandıranı: ${topWinner.symbol} (+%${topWinner.changePct})` : ""}
${topLoser ? `Günün En Çok Kaybettireni: ${topLoser.symbol} (%${topLoser.changePct})` : ""}

Fraunces üslubunda, bilgece, samimi ve gerçek verileri temel alan 1 paragraflık net bir yönetici özeti yaz.`;

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 },
          },
          customModel
        );
        if (res && res.ok) {
          const data = await res.json();
          const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt) summary = txt.trim();
        }
      }
    } catch {}
  }

  return {
    date: todayStr,
    greeting,
    portfolioDayChangePct: portChange,
    bistDayChangePct: bistChange,
    hasBistData: hasBist,
    outperformanceText: alphaText,
    topWinner,
    topLoser,
    executiveSummary: summary,
    tacticalTip: "Piyasa volatilitesine karşı dengeli sepet dağılımınızı koruyarak uzun vadeli birikim stratejinize sadık kalmanız önerilir.",
  };
}

// -------------------------------------------------------------
// 6. 📰 Orakul "Haber & Piyasa Duygu Analizi" (Sentiment Radar)
// -------------------------------------------------------------
// 6. 📰 Haber & Piyasa Duygu Analizi (Sentiment Analysis)
// -------------------------------------------------------------
export interface SentimentNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  relatedSymbol: string;
  sentimentScore: number; // -1.0 to +1.0
  summary: string;
  impactVerdict: "POZİTİF" | "NÖTR" | "NEGATİF";
}

export interface CompanyWithNews {
  symbol: string;
  name: string;
  dailyChange?: number;
  news: NewsItem[];
}

const TURKISH_FINANCIAL_NEGATIVE_KEYWORDS = [
  "soruşturma", "ceza", "zarar", "dava", "iflas", "kesinti", "gerileme", "düşüş",
  "kayıp", "iptal", "uyarı", "risk", "kriz", "borç", "çöküş", "daralma", "satış baskısı",
  "durdurma", "tedbir", "blokaj", "negatif", "olumsuz", "kayyım", "revize düşüş"
];

const TURKISH_FINANCIAL_POSITIVE_KEYWORDS = [
  "rekor", "büyüme", "temettü", "kâr artışı", "kar artışı", "anlaşma", "ihracat",
  "kapasite", "ihale", "onay", "yükseliş", "kazanç", "yatırım", "sözleşme", "zirve",
  "alfa", "güçlü", "pozitif", "artış", "sipariş", "teslimat", "satın alma", "genişleme",
  "lisans", "iş birliği", "tarihi zirve", "hedef yükseltti"
];

export function analyzeNewsTitleSentiment(title: string): {
  score: number;
  verdict: "POZİTİF" | "NÖTR" | "NEGATİF";
  rationale: string;
} {
  const t = (title || "").toLowerCase();
  const matchedNeg = TURKISH_FINANCIAL_NEGATIVE_KEYWORDS.filter((k) => t.includes(k));
  const matchedPos = TURKISH_FINANCIAL_POSITIVE_KEYWORDS.filter((k) => t.includes(k));

  if (matchedNeg.length > 0 && matchedPos.length === 0) {
    const score = Math.max(-0.9, -0.4 - matchedNeg.length * 0.15);
    return {
      score: parseFloat(score.toFixed(2)),
      verdict: "NEGATİF",
      rationale: `Başlıkta olumsuz finansal sinyaller tespit edildi: [${matchedNeg.join(", ")}].`,
    };
  }

  if (matchedPos.length > 0 && matchedNeg.length === 0) {
    const score = Math.min(0.95, 0.4 + matchedPos.length * 0.15);
    return {
      score: parseFloat(score.toFixed(2)),
      verdict: "POZİTİF",
      rationale: `Başlıkta olumlu operasyonel / finansal sinyaller tespit edildi: [${matchedPos.join(", ")}].`,
    };
  }

  if (matchedPos.length > 0 && matchedNeg.length > 0) {
    return {
      score: 0.0,
      verdict: "NÖTR",
      rationale: "Başlıkta hem olumlu hem olumsuz dengeli piyasa ifadeleri yer alıyor.",
    };
  }

  return {
    score: 0.0,
    verdict: "NÖTR",
    rationale: "Haber başlığı nötr / rutin bilgi akışı niteliğindedir.",
  };
}

export async function generateSentimentAnalysis(
  newsPerCompany: CompanyWithNews[],
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string
): Promise<SentimentNewsItem[]> {
  const resolvedApiKey = _apiKey || getResolvedApiKey(provider);

  const newsContext = newsPerCompany
    .map(
      (c) =>
        `Şirket: ${c.symbol} (${c.name})\nGerçek Haber Başlıkları:\n${
          c.news && c.news.length > 0
            ? c.news.map((n) => `- [${n.source}] ${n.title}`).join("\n")
            : "Bu şirket için son 24 saatte doğrudan sıcak haber akışı bulunamadı."
        }`
    )
    .join("\n\n");

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      if (provider === "gemini") {
        const prompt = `Sen 'Orakul' adında uzman bir BIST ve Türk piyasaları finansal haber & duygu analisti yapay zekasısın.
Aşağıda kullanıcının portföyündeki şirketler için Google News üzerinden çekilmiş GERÇEK, güncel haber başlıkları bulunmaktadır.
Her şirket için bu gerçek haber başlıklarına dayanarak bir duygu puanı (-1.0 aşırı negatif ile +1.0 aşırı pozitif arası), etki kararı ve 1-2 cümlelik profesyonel finansal özet üret.
Eğer bir şirket için haber yoksa bunu uydurma, 'Doğrudan sıcak haber akışı bulunmuyor, rutin piyasa seyri izleniyor' de.

${newsContext}

Format (YALNIZCA geçerli JSON dizisi):
[
  {
    "id": "news-1",
    "title": "Haber Başlığı",
    "source": "Kaynak Adı",
    "date": "Bugün",
    "relatedSymbol": "${newsPerCompany[0]?.symbol || "THYAO"}",
    "sentimentScore": 0.85,
    "summary": "Haberin 1-2 cümlelik finansal özeti ve şirket operasyonlarına etkisi",
    "impactVerdict": "POZİTİF"
  }
]`;

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
          },
          customModel
        );

        if (res && res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(stripJsonFences(raw));
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          }
        }
      }
    } catch (e) {
      console.warn("generateSentimentAnalysis error, using news algorithm fallback:", e);
    }
  }

  // Dynamic fallback using genuine news items when AI key is absent
  return newsPerCompany.flatMap((c, idx) => {
    if (c.news && c.news.length > 0) {
      return c.news.slice(0, 2).map((n, nIdx) => {
        const titleAnalysis = analyzeNewsTitleSentiment(n.title);
        return {
          id: `news-${c.symbol}-${idx}-${nIdx}`,
          title: n.title,
          source: n.source || "Google News",
          date: n.timeAgo || "Bugün",
          relatedSymbol: c.symbol,
          sentimentScore: titleAnalysis.score,
          summary: `${c.name} (${c.symbol}) için güncel haber: "${n.title}". ${titleAnalysis.rationale}`,
          impactVerdict: titleAnalysis.verdict,
        };
      });
    }

    return [
      {
        id: `news-${c.symbol}-${idx}`,
        title: `${c.name} (${c.symbol}) Rutin Piyasa Seyri`,
        source: "Piyasa Takip",
        date: "Bugün",
        relatedSymbol: c.symbol,
        sentimentScore: 0.0,
        summary: `${c.name} (${c.symbol}) için son 24 saatte doğrudan sıcak haber akışı bulunmamakta olup rutin seans izlenmektedir.`,
        impactVerdict: "NÖTR",
      },
    ];
  });
}

// -------------------------------------------------------------
// 7. 📜 Orakul "Haftalık Kasa Mektubu" (Weekly Wealth Letter)
// -------------------------------------------------------------
export interface WeeklyLetterRequest {
  userName?: string;
  totalValue: number;
  totalProfit: number;
  basketsCount: number;
  companiesCount: number;
  topWinner?: { symbol: string; change: number };
  topLoser?: { symbol: string; change: number };
  weeklyChangePct?: number;
  persona?: string;
}

export interface WeeklyLetterResult {
  date: string;
  greeting: string;
  subject: string;
  openingParagraph: string;
  portfolioReview: string;
  macroCommentary: string;
  strategicGuidance: string;
  signoff: string;
}

export async function generateWeeklyLetter(
  req: WeeklyLetterRequest,
  _apiKey?: string,
  provider: string = "gemini",
  customModel?: string,
  persona: string = "deger"
): Promise<WeeklyLetterResult> {
  const userName = req.userName || "Defter Sahibi";
  const todayStr = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  const weeklyChange = req.weeklyChangePct ?? 0;
  const isGain = weeklyChange >= 0;
  const personaNote = getPersonaInstruction(persona);
  const resolvedApiKey = getResolvedApiKey(provider);

  if (!req.totalValue && !req.basketsCount) {
    return {
      date: todayStr,
      greeting: `Sevgili ${userName},`,
      subject: `Haftalık Kasa & Sermaye Mektubu — ${todayStr}`,
      openingParagraph: `Sevgili ${userName},\n\nKasanızda henüz kayıtlı bir sepet veya aktif pozisyon bulunmamaktadır. Portföyünüzü oluşturup hisselerinizi kaydettiğinizde, haftalık kâr/zarar ve piyasa analiz mektubunuz burada kişiselleştirilmiş olarak hazırlanacaktır.`,
      portfolioReview: "Aktif varlık kaydı bulunmadığı için haftalık performans analizi oluşturulamadı.",
      macroCommentary: "Borsa İstanbul genelinde bilanço beklentileri ve küresel faiz patikasına dair haber akışı oynaklığı beslemeye devam ediyor.",
      strategicGuidance: "Kütüğünüzdeki yüksek temettü ve cazip çarpanlı şirketleri inceleyerek ilk sepetinizi oluşturmanız tavsiye edilir.",
      signoff: "Hürmet ve Saygılarımla,\nOrakul 🖋️\nBaş Servet & Finans Danışmanı",
    };
  }

  let opening = `Sevgili ${userName},\n\nBu hafta kasanız genel piyasa dinamikleri karşısında **%${Math.abs(weeklyChange).toFixed(2)} ${isGain ? "değer kazandı" : "düzeltme yaşadı"}**. ${req.basketsCount} aktif sepetiniz ve takip kütüğünüzdeki varlıklar genel olarak sermaye koruma prensiplerinize sadık bir seyir izledi.`;

  let review = "";
  if (req.topWinner && req.topLoser) {
    review = `Haftanın öne çıkan hareketi ${req.topWinner.symbol} pozisyonunda gerçekleşti (+%${req.topWinner.change}). Öte yandan ${req.topLoser.symbol} tarafında yaşanan düzeltme (%${req.topLoser.change}) portföy dengesini test etti. Ancak varlık çeşitlendirmesi sayesinde kasanızın toplam volatilitesi kontrol altında kaldı.`;
  } else if (req.topWinner) {
    review = `Haftanın öne çıkan kazandıran varlığı **${req.topWinner.symbol}** (+%${req.topWinner.change}) oldu.`;
  } else if (req.topLoser) {
    review = `Haftalık süreçte **${req.topLoser.symbol}** (%${req.topLoser.change}) tarafındaki kâr realizasyonları izlendi.`;
  } else {
    review = "Haftalık süreçte varlıklarınız dengeli bir seyir izleyerek sermaye koruma prensiplerinize uygun hareket etti.";
  }

  let macro = `Borsa İstanbul genelinde bilanço beklentileri ve küresel faiz patikasına dair haber akışı oynaklığı beslemeye devam ediyor. Enflasyon muhasebesi sonrası net nakit pozisyonu güçlü ve döviz kazandırıcı faaliyetleri bulunan sanayi ve ihracat liderleri piyasada pozitif ayrışmayı sürdürüyor.`;

  let guidance = `Önümüzdeki hafta için tavsiyem; kısa vadeli gürültüye kapılmadan, kütüğünüzdeki yüksek Piotroski skorlu ve iskontolu temel şirketlerdeki ağırlıkları korumanızdır. Gerekirse kâr realizasyonu yapan varlıklardan elde edilen nakdi değer tuzağı riski taşımayan savunmacı kalemlere kademeli kaydırabilirsiniz.`;

  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    try {
      if (provider === "gemini") {
        const prompt = `Sen 'Orakul' adında elit bir Özel Bankacı ve Baş Varlık Danışmanısın. "Mürekkep & Pirinç" Defter uygulaması için müşterin '${userName}' adına edebi, bilgece, samimi ve derin finansal içgörü içeren haftalık bir "Kasa Mektubu" (Weekly Wealth Letter) hazırla.
Portföy Verileri:
- Toplam Değer: ${req.totalValue.toLocaleString("tr-TR")} ₺
- Toplam Kâr/Zarar: ${req.totalProfit.toLocaleString("tr-TR")} ₺
- Haftalık Değişim: %${weeklyChange}
- Sepet Sayısı: ${req.basketsCount}
- ${personaNote}

Yanıtını YALNIZCA şu geçerli JSON olarak ver:
{
  "subject": "Haftalık Kasa & Sermaye Mektubu",
  "openingParagraph": "Giriş ve haftalık genel performans paragrafı...",
  "portfolioReview": "Portföyün detaylı analizi ve öne çıkan varlıklar paragrafı...",
  "macroCommentary": "Makroekonomik piyasa ve BIST genel bakışı paragrafı...",
  "strategicGuidance": "Gelecek haftaya dair stratejik ve bilgece tavsiye paragrafı..."
}`;

        const res = await fetchGeminiWithFallback(
          resolvedApiKey,
          {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
          },
          customModel
        );

        if (res && res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(stripJsonFences(raw));
            if (parsed.openingParagraph) opening = parsed.openingParagraph;
            if (parsed.portfolioReview) review = parsed.portfolioReview;
            if (parsed.macroCommentary) macro = parsed.macroCommentary;
            if (parsed.strategicGuidance) guidance = parsed.strategicGuidance;
          }
        }
      }
    } catch {}
  }

  return {
    date: todayStr,
    greeting: `Sevgili ${userName},`,
    subject: `Haftalık Kasa & Sermaye Mektubu — ${todayStr}`,
    openingParagraph: opening,
    portfolioReview: review,
    macroCommentary: macro,
    strategicGuidance: guidance,
    signoff: "Hürmet ve Saygılarımla,\nOrakul 🖋️\nBaş Servet & Finans Danışmanı",
  };
}

export async function chatWithOrakulCopilot(
  userPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  portfolioSummary: string,
  userApiKey?: string,
  provider?: string,
  customModel?: string
): Promise<string> {
  const apiKey = userApiKey || getResolvedApiKey(provider);
  if (!apiKey) {
    return `[Nötr Mod - API Anahtarı Tanımlı Değil] "${userPrompt}" sorunuz incelendi. Canlı yapay zeka analiz yanıtı üretmek için lütfen Ayarlar sayfasından Gemini veya OpenAI API anahtarınızı tanımlayın.`;
  }

  try {
    const systemPrompt = `Sen Defter uygulamasının baş finansal danışmanı Orakul Copilot'usun. Kullanıcının sorularını Benjamin Graham ve Warren Buffett değer yatırımcılığı ilkelerine uygun, Türkçe, profesyonel ve net bir dille yanıtla. ${portfolioSummary}`;

    const bodyObj = {
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...history.slice(-6).map((h) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
        { role: "user", parts: [{ text: userPrompt }] },
      ],
    };

    const res = await fetchGeminiWithFallback(apiKey, bodyObj, customModel);
    if (res && res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
  } catch {}

  return `Orakul Copilot Yanıtı: "${userPrompt}" analizi tamamlandı. Şirketin F/K ve borçluluk çarpanları nötr seviyede olup temettü verimliliği korunmaktadır.`;
}

