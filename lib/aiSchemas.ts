/**
 * Centralized Zod Schemas for all Orakul AI Modules
 * Ensures strict runtime validation and zero hallucinated schema types across LLM responses.
 */

import { z } from "zod";

// -------------------------------------------------------------
// 1. Orakul Recipe Schemas (Sepet Sihirbazı)
// -------------------------------------------------------------
export const AiRecipeAllocationItemSchema = z.object({
  symbol: z.string(),
  name: z.string().optional(),
  companyName: z.string().optional(),
  weight: z.number().min(1).max(100),
  suggestedShares: z.number().optional(),
  totalCost: z.number().optional(),
  price: z.number().optional(),
  bullThesis: z.string().optional(),
  bearRisk: z.string().optional(),
  note: z.string().optional(),
});

export const AiRecipeResponseSchema = z.object({
  recipeTitle: z.string().optional(),
  title: z.string().optional(),
  summary: z.string(),
  strategyArchetype: z.string().optional(),
  horizon: z.string().optional(),
  riskLevel: z.string().optional(),
  expectedYield: z.string().optional(),
  recommendedDuration: z.string().optional(),
  riskRating: z.string().optional(),
  sharpeRatio: z.number().optional(),
  sortinoRatio: z.number().optional(),
  portfolioBeta: z.number().optional(),
  jensenAlpha: z.number().optional(),
  treynorRatio: z.number().optional(),
  omegaRatio: z.number().optional(),
  estimatedVolatility: z.number().optional(),
  hhiScore: z.number().optional(),
  backtest1yReturn: z.number().optional(),
  backtestBistAlpha: z.number().optional(),
  healthScore: z.number().optional(),
  allocation: z.array(AiRecipeAllocationItemSchema),
  cashReserve: z.number().optional(),
  usedFallbackSeeds: z.boolean().optional(),
  metricsSource: z.string().optional(),
  committeeDebate: z
    .object({
      bullSummary: z.string().optional(),
      bearSummary: z.string().optional(),
      verdict: z.string().optional(),
    })
    .optional(),
  rebalanceActions: z.array(z.any()).optional(),
}).passthrough();

// -------------------------------------------------------------
// 2. Company Analysis Schemas (Şirket Teşhisi & Sağlık Skoru)
// -------------------------------------------------------------
export const CompanyAnalysisAiResponseSchema = z.object({
  valuationScore: z.string().optional(),
  fairValue: z.number().optional(),
  targetPrice12M: z.number().optional(),
  upsidePotential: z.string().optional(),
  piotroskiScore: z.number().optional(),
  altmanZScore: z.union([z.string(), z.number()]).optional(),
  dupontRoe: z.string().optional(),
  peVsSector: z.string().optional(),
  whyMoved: z.string().optional(),
  pros: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  verdict: z.enum(["GÜÇLÜ AL", "AL", "TUT", "SAT", "GÜÇLÜ SAT"]).default("TUT"),
  confidence: z.string().optional(),
  pastFeedbackSummary: z.string().optional(),
  evidenceChain: z.array(z.string()).optional(),
  bullCase: z
    .object({
      catalyst: z.string().optional(),
      targetUpside: z.string().optional(),
      coreThesis: z.string().optional(),
    })
    .optional(),
  bearCase: z
    .object({
      keyRisk: z.string().optional(),
      downsideRisk: z.string().optional(),
      coreThesis: z.string().optional(),
    })
    .optional(),
  stressTest: z
    .object({
      fxShock20Pct: z.string().optional(),
      rateCutShock: z.string().optional(),
      marketCrashShock: z.string().optional(),
    })
    .optional(),
});

// -------------------------------------------------------------
// 3. Stock Screener Schemas (Akıllı Hisse Tarayıcısı)
// -------------------------------------------------------------
export const StockScreenerPickAiSchema = z.object({
  symbol: z.string(),
  matchScore: z.number().optional(),
  aiRationale: z.string(),
});

export const StockScreenerAiResponseSchema = z.object({
  interpretation: z.string(),
  picks: z.array(StockScreenerPickAiSchema),
});

// -------------------------------------------------------------
// 4. Earnings Flash Schemas (Bilanço Karnesi)
// -------------------------------------------------------------
export const EarningsFlashAiResponseSchema = z.object({
  quarter: z.string().optional(),
  healthScore: z.number().optional(),
  grade: z.enum(["A+", "A", "B+", "B", "C", "F"]).optional(),
  summary: z.string(),
  revenueGrowth: z.string().optional(),
  grossMargin: z.string().optional(),
  netProfitGrowth: z.string().optional(),
  ebitdaMargin: z.string().optional(),
  debtStatus: z.string().optional(),
  fcfStatus: z.string().optional(),
  keyCatalyst: z.string().optional(),
  keyRisk: z.string().optional(),
  verdict: z.enum(["ÇOK GÜÇLÜ", "GÜÇLÜ", "BEKLENTİYE PARALEL", "ZAYIF", "RİSKLİ"]).default("GÜÇLÜ"),
  legendaryCommentary: z
    .object({
      warrenBuffett: z.string().optional(),
      peterLynch: z.string().optional(),
      benGraham: z.string().optional(),
    })
    .optional(),
});

// -------------------------------------------------------------
// 5. Value Trap Schemas (Tuzak Dedektörü)
// -------------------------------------------------------------
export const ValueTrapAiResponseSchema = z.object({
  trapRiskLevel: z.enum(["DÜŞÜK (GÜVENLİ)", "ORTA (DİKKAT)", "YÜKSEK (TUZAK RİSKİ)"]).optional(),
  trapRiskScore: z.number().optional(),
  isGenuineBargain: z.boolean().optional(),
  verdictTitle: z.string().optional(),
  altmanZScore: z.number().optional(),
  altmanZone: z.enum(["GÜVENLİ BÖLGE", "GRİ BÖLGE (DİKKAT)", "İFLAS / STRES RİSKİ"]).optional(),
  piotroskiFScore: z.number().optional(),
  interestCoverageRatio: z.number().optional(),
  coreEbitStatus: z.enum(["Esas Faaliyet Kârı Güçlü", "Tek Seferlik Gelir Şüphesi", "Faaliyet Zararı"]).optional(),
  netDebtToEbitda: z.string().optional(),
  forensicScorecard: z
    .array(
      z.object({
        metric: z.string(),
        score: z.string(),
        status: z.enum(["good", "warn", "danger"]),
        note: z.string(),
      })
    )
    .optional(),
  findings: z.array(z.string()).default([]),
  warningNote: z.string().optional(),
});

// -------------------------------------------------------------
// 6. Sentiment News Schemas (Haber & Duygu Analizi)
// -------------------------------------------------------------
export const SentimentNewsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string().optional(),
  date: z.string().optional(),
  relatedSymbol: z.string(),
  sentimentScore: z.number().min(-1).max(1),
  summary: z.string(),
  impactVerdict: z.enum(["POZİTİF", "NÖTR", "NEGATİF"]).default("NÖTR"),
});

export const SentimentNewsListSchema = z.array(SentimentNewsItemSchema);

// -------------------------------------------------------------
// 7. Daily Briefing & Weekly Letter Schemas
// -------------------------------------------------------------
export const DailyBriefingAiResponseSchema = z.object({
  executiveSummary: z.string(),
  tacticalTip: z.string(),
});

export const WeeklyLetterAiResponseSchema = z.object({
  letterSubject: z.string().optional(),
  executiveSummary: z.string(),
  strategicVerdict: z.string().optional(),
  rebalanceTip: z.string().optional(),
});

// -------------------------------------------------------------
// 8. Autonomous Scan Schemas (Otonom AI Tarayıcı)
// -------------------------------------------------------------
export const AutonomousScanItemAiSchema = z.object({
  verdict: z.enum(["GÜÇLÜ AL", "AL", "TUT", "SAT", "GÜÇLÜ SAT", "NÖTR"]).default("TUT"),
  valuationScore: z.number().optional(),
  confidence: z.string().optional(),
  bullThesis: z.string().optional(),
  bearThesis: z.string().optional(),
  targetPrice: z.number().optional(),
});

// -------------------------------------------------------------
// 9. Strict Inbound API Request Validation Schemas (/api/orakul)
// -------------------------------------------------------------
export const OrakulRecipePayloadSchema = z.object({
  strategyArchetype: z.string().max(100).optional(),
  goal: z.string().max(200).optional(),
  risk: z.string().max(100).optional(),
  universe: z.string().max(100).optional(),
  budget: z.number().positive().max(100_000_000_000).optional(),
  horizon: z.string().max(50).optional(),
  maxAssetWeight: z.number().min(5).max(100).optional(),
  includeGoldBuffer: z.boolean().optional(),
  excludeOverbought: z.boolean().optional(),
  minDividendYield: z.number().min(0).max(100).optional(),
  maxPeRatio: z.number().min(0).max(500).optional(),
  assetCount: z.number().int().min(1).max(20).optional(),
  allCompanies: z.array(z.any()).max(500).optional(),
  existingPortfolioExposure: z.array(z.object({ symbol: z.string(), totalWeightPctOfNetWorth: z.number() })).optional(),
  rebalanceContext: z.any().optional(),
}).passthrough();

export const OrakulCompanyPayloadSchema = z.object({
  symbol: z.string().min(1).max(20),
  name: z.string().max(150).optional(),
  price: z.number().nonnegative().optional(),
  peRatio: z.number().optional(),
  pbRatio: z.number().optional(),
  dividendYield: z.number().min(0).max(100).optional(),
  sector: z.string().max(100).optional(),
  dailyChange: z.number().optional(),
  currency: z.string().max(10).optional(),
}).passthrough();

export const OrakulScreenerPayloadSchema = z.object({
  query: z.string().min(1).max(500),
  companies: z.array(z.any()).max(500).optional(),
}).passthrough();

export const OrakulApiRequestSchema = z.object({
  type: z.enum([
    "test_connection",
    "recipe",
    "company_analysis",
    "earnings_flash",
    "value_trap",
    "backtest",
    "screener",
    "daily_brief",
    "sentiment",
    "weekly_letter",
    "chat",
  ]),
  payload: z.any().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(4000),
      })
    )
    .max(50)
    .optional(),
  context: z.any().optional(),
  history: z.array(z.any()).max(100).optional(),
  provider: z.enum(["gemini", "openai"]).default("gemini").optional(),
  model: z.string().max(100).optional(),
  persona: z.enum(["deger", "temettu", "buyume", "garp", "hisse", "fon", "makro"]).optional(),
  apiKey: z.string().max(256).optional(),
  companies: z.array(z.any()).max(500).optional(),
});
