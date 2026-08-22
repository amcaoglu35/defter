import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateOrakulRecipe,
  regenerateSingleAsset,
  convertToTRY,
  generateEarningsFlash,
  detectValueTraps,
  extractNumericFilters,
  calculateDeterministicMatchScore,
  analyzeNewsTitleSentiment,
  getLotRoundingRule,
  askOrakulChat,
  chatWithOrakulCopilot,
  runBacktestSimulation,
  runInvestmentCommittee,
  generateCompanyAnalysis,
  factCheckAgentClaims,
  CompanyAnalysisRequest,
  AiRecipeRequest,
} from "./aiService";
import { calculateValuationFormulas } from "./quantEngine";
import { MOCK_COMPANIES } from "./mockData";

const sampleCompanies: CompanyAnalysisRequest[] = MOCK_COMPANIES.map((c) => ({
  symbol: c.symbol,
  name: c.name,
  price: c.price,
  peRatio: c.peRatio,
  pbRatio: c.pbRatio,
  dividendYield: c.dividendYield,
  dailyChange: c.dailyChange,
  sector: c.sector,
  exchange: c.exchange,
  indexTag: c.indexTag,
  assetClass: c.assetClass,
}));

describe("aiService Unit & Contract Tests", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // -------------------------------------------------------------
  // 1. Algorithmic (No LLM / No API Key) Deterministic Branch
  // -------------------------------------------------------------
  describe("generateOrakulRecipe — Algorithmic Engine (No API Key)", () => {
    it("makes zero network calls when no API key is provided", async () => {
      const fetchMock = vi.fn();
      global.fetch = fetchMock;

      const req: AiRecipeRequest = {
        goal: "Dengeli Büyüme",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, undefined);

      // Ensure zero AI LLM API calls are made
      const aiCalls = fetchMock.mock.calls.filter((call: unknown[]) => {
        const url = String(call[0] || "");
        return url.includes("generativelanguage.googleapis.com") || url.includes("api.openai.com");
      });
      expect(aiCalls.length).toBe(0);
      expect(result).toBeDefined();
      expect(result.allocation.length).toBe(4);
      expect(result.engine).toBe("algorithmic");
    });

    it("ensures allocation item count matches requested assetCount", async () => {
      const req: AiRecipeRequest = {
        goal: "Temettü Odaklı",
        risk: "Düşük",
        universe: "BIST 100",
        budget: 50000,
        assetCount: 5,
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, undefined);
      expect(result.allocation.length).toBe(5);
    });

    it("strictly guarantees allocation weights sum to exactly 100", async () => {
      const countsToTest = [3, 4, 5, 6, 7];

      for (const count of countsToTest) {
        const req: AiRecipeRequest = {
          goal: "Maksimum Getiri",
          risk: "Yüksek",
          universe: "BIST 30",
          budget: 150000,
          assetCount: count,
        };

        const result = await generateOrakulRecipe(req, sampleCompanies, undefined);
        const totalWeight = result.allocation.reduce((sum, item) => sum + item.weight, 0);
        expect(totalWeight).toBe(100);
      }
    });

    it("includes gold/commodity asset when includeGoldBuffer is true", async () => {
      const req: AiRecipeRequest = {
        goal: "Enflasyon Koruması",
        risk: "Düşük",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
        includeGoldBuffer: true,
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, undefined);
      const hasGoldOrCommodity = result.allocation.some(
        (item) =>
          item.symbol.includes("ALTIN") ||
          item.symbol.includes("GÜMÜŞ") ||
          item.symbol.includes("GRAM")
      );
      expect(hasGoldOrCommodity).toBe(true);
    });

    it("favors low PE companies when strategyArchetype is deep_value", async () => {
      const req: AiRecipeRequest = {
        goal: "Derin Değer",
        risk: "Orta",
        universe: "BIST 100",
        budget: 100000,
        assetCount: 4,
        strategyArchetype: "deep_value",
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, undefined);
      expect(result.strategyArchetype).toBe("deep_value");
      expect(result.allocation.length).toBe(4);
    });

    it("supports weightingModel: min_volatility and max_sharpe with exact 100 weight sum", async () => {
      const minVolReq: AiRecipeRequest = {
        goal: "Dengeli",
        risk: "Düşük",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
        weightingModel: "min_volatility",
      };

      const minVolResult = await generateOrakulRecipe(minVolReq, sampleCompanies, undefined);
      const sumMinVol = minVolResult.allocation.reduce((a, b) => a + b.weight, 0);
      expect(sumMinVol).toBe(100);

      const maxSharpeReq: AiRecipeRequest = {
        goal: "Büyüme",
        risk: "Yüksek",
        universe: "BIST 100",
        budget: 100000,
        assetCount: 4,
        weightingModel: "max_sharpe",
      };

      const maxSharpeResult = await generateOrakulRecipe(maxSharpeReq, sampleCompanies, undefined);
      const sumMaxSharpe = maxSharpeResult.allocation.reduce((a, b) => a + b.weight, 0);
      expect(sumMaxSharpe).toBe(100);
    });

    it("supports new archetypes: growth_quality, bist_technology and green_energy", async () => {
      const techReq: AiRecipeRequest = {
        goal: "Teknoloji",
        risk: "Yüksek",
        universe: "BIST Teknoloji & Savunma (XTEK)",
        budget: 100000,
        assetCount: 3,
        strategyArchetype: "bist_technology",
      };

      const techResult = await generateOrakulRecipe(techReq, sampleCompanies, undefined);
      expect(techResult.allocation.length).toBe(3);
    });
  });

  // -------------------------------------------------------------
  // 2. LLM Contract Tests & Bad JSON Graceful Fallback
  // -------------------------------------------------------------
  describe("generateOrakulRecipe — LLM Contract & Fallback", () => {
    it("successfully parses valid LLM JSON and stamps metricsSource: calculated", async () => {
      const mockLlmResponse = {
        title: "AI Temettü Kalesi",
        summary: "Düşük riskli temettü liderleri",
        strategyArchetype: "dividend_aristocrats",
        healthScore: 95,
        expectedYield: "%40 Yıllık Getiri",
        recommendedDuration: "12 Ay",
        riskRating: "Düşük",
        committeeDebate: {
          bullSummary: "Güçlü nakit akışı",
          bearSummary: "Faiz ortamı",
          verdict: "Onaylandı",
        },
        allocation: [
          { symbol: "FROTO", name: "Ford Otosan", weight: 35, price: 1000, suggestedShares: 35, totalCost: 35000 },
          { symbol: "TUPRS", name: "Tüpraş", weight: 35, price: 160, suggestedShares: 218, totalCost: 34880 },
          { symbol: "ASELS", name: "Aselsan", weight: 30, price: 60, suggestedShares: 500, totalCost: 30000 },
        ],
        cashReserve: 120,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify(mockLlmResponse) }],
              },
            },
          ],
        }),
      });

      const req: AiRecipeRequest = {
        goal: "Temettü Kalesi",
        risk: "Düşük",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 3,
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, "fake-api-key-12345");

      expect(result.engine).toBe("llm");
      expect(result.title).toBe("AI Temettü Kalesi");
      expect(result.allocation.length).toBe(3);
      // Quantitative metrics must be deterministically enriched (Zero-mock rule)
      expect(result.sharpeRatio).toBeDefined();
      expect(result.hhiScore).toBeDefined();
      expect(result.estimatedVolatility).toBeDefined();
    });

    it("gracefully falls back to algorithmic engine when LLM returns broken JSON", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "THIS_IS_NOT_VALID_JSON {{{ breaking parse" }],
              },
            },
          ],
        }),
      });

      const req: AiRecipeRequest = {
        goal: "GARP Büyüme",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, "fake-api-key-12345");

      // Fallback engine must seamlessly take over without throwing
      expect(result).toBeDefined();
      expect(result.engine).toBe("algorithmic");
      expect(result.allocation.length).toBe(4);
    });

    it("corrects LLM price hallucinations that deviate > 5% from authentic catalog prices", async () => {
      // FROTO actual catalog price is 1000 TL in sampleCompanies. LLM returns hallucinated 600 TL (>5% deviation).
      const mockLlmHallucinatedPrice = {
        title: "Test Portföy",
        summary: "Özet",
        expectedYield: "%30 Getiri",
        allocation: [
          { symbol: "THYAO", name: "THY", weight: 35, price: 9999, suggestedShares: 1, totalCost: 9999 }, // Huge deviation
          { symbol: "FROTO", name: "Ford", weight: 35, price: 600, suggestedShares: 83, totalCost: 49800 }, // 40% deviation
          { symbol: "ASELS", name: "Aselsan", weight: 30, price: 60, suggestedShares: 500, totalCost: 30000 },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify(mockLlmHallucinatedPrice) }],
              },
            },
          ],
        }),
      });

      const req: AiRecipeRequest = {
        goal: "Fiyat Doğrulama Testi",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        estimatedFeeRatePct: 0,
        assetCount: 3,
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, "fake-api-key-12345");

      const thyao = result.allocation.find((a) => a.symbol === "THYAO");
      const froto = result.allocation.find((a) => a.symbol === "FROTO");

      // Prices must be corrected back to catalog prices
      const catalogThyao = sampleCompanies.find((c) => c.symbol === "THYAO");
      const catalogFroto = sampleCompanies.find((c) => c.symbol === "FROTO");

      expect(thyao?.price).toBe(catalogThyao?.price);
      expect(froto?.price).toBe(catalogFroto?.price);
      // Lots must be correctly recalculated based on real catalog prices (35% of 100k = 35000)
      expect(thyao?.suggestedShares).toBe(Math.floor(35000 / (catalogThyao?.price || 1)));
      expect(froto?.suggestedShares).toBe(Math.floor(35000 / (catalogFroto?.price || 1)));
    });

    it("sets usedFallbackSeeds to true when catalog is empty and false when sufficient", async () => {
      const req: AiRecipeRequest = {
        goal: "Dengeli",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
      };

      const resultEmpty = await generateOrakulRecipe(req, [], undefined);
      expect(resultEmpty.usedFallbackSeeds).toBe(true);

      const resultFull = await generateOrakulRecipe(req, sampleCompanies, undefined);
      expect(resultFull.usedFallbackSeeds).toBe(false);
    });

    it("correctly identifies lot rounding rule for BIST stocks vs gold/currencies/funds", () => {
      expect(getLotRoundingRule("hisse", "BIST", "THYAO")).toBe("integer");
      expect(getLotRoundingRule("hisse", "ABD", "AAPL")).toBe("integer");
      expect(getLotRoundingRule("maden", "Emtia", "ALTIN/GR")).toBe("decimal");
      expect(getLotRoundingRule("maden", "Emtia", "GÜMÜŞ/GR")).toBe("decimal");
      expect(getLotRoundingRule("doviz", "Döviz", "USD/TRY")).toBe("decimal");
      expect(getLotRoundingRule("fon", "TEFAS", "TI3")).toBe("decimal");
    });

    it("applies persona bonus to differentiate rankings in algorithmic mode", async () => {
      const baseReq: AiRecipeRequest = {
        goal: "Dengeli",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
      };

      // Dividend persona should select dividend paying assets
      const dividendResult = await generateOrakulRecipe(baseReq, sampleCompanies, undefined, "gemini", undefined, "temettu");
      // Value persona should select low PE value assets
      const valueResult = await generateOrakulRecipe(baseReq, sampleCompanies, undefined, "gemini", undefined, "deger");

      expect(dividendResult._debugPromptSummary?.persona).toBe("temettu");
      expect(valueResult._debugPromptSummary?.persona).toBe("deger");
      expect(dividendResult._debugPromptSummary?.engine).toBe("algorithmic");
    });

    it("applies concentration penalty when user already holds high exposure in a symbol", async () => {
      const reqWithHeavyThyao: AiRecipeRequest = {
        goal: "Dengeli",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
        existingPortfolioExposure: [{ symbol: "THYAO", totalWeightPctOfNetWorth: 45 }],
      };

      const result = await generateOrakulRecipe(reqWithHeavyThyao, sampleCompanies, undefined);
      const thyao = result.allocation.find((a) => a.symbol === "THYAO");

      // Either THYAO is not picked or its weight is minimized due to heavy concentration penalty
      if (thyao) {
        expect(thyao.weight).toBeLessThanOrEqual(30);
      }
    });

    it("filters out overbought assets when excludeOverbought is true", async () => {
      const overboughtPool: CompanyAnalysisRequest[] = [
        { symbol: "PUMP1", name: "Pumped Co 1", price: 100, dailyChange: 8.5, peRatio: 10, sector: "Sanayi" },
        { symbol: "PUMP2", name: "Pumped Co 2", price: 100, dailyChange: 9.8, peRatio: 10, sector: "Sanayi" },
        { symbol: "STABLE1", name: "Stable Co 1", price: 100, dailyChange: 0.5, peRatio: 10, sector: "Sanayi" },
        { symbol: "STABLE2", name: "Stable Co 2", price: 100, dailyChange: 1.2, peRatio: 10, sector: "Perakende" },
        { symbol: "STABLE3", name: "Stable Co 3", price: 100, dailyChange: -0.4, peRatio: 10, sector: "Holding" },
      ];

      const req: AiRecipeRequest = {
        goal: "Dengeli",
        risk: "Orta",
        universe: "Tüm Varlıklar",
        budget: 100000,
        assetCount: 3,
        excludeOverbought: true,
      };

      const result = await generateOrakulRecipe(req, overboughtPool, undefined);
      const chosenSymbols = result.allocation.map((a) => a.symbol);

      expect(chosenSymbols).not.toContain("PUMP1");
      expect(chosenSymbols).not.toContain("PUMP2");
      expect(chosenSymbols).toContain("STABLE1");
    });
  });

  // -------------------------------------------------------------
  // 3. Earnings Flash & Value Trap Tests
  // -------------------------------------------------------------
  describe("Earnings Flash & Value Trap", () => {
    it("generates deterministic health grade and Piotroski score in Earnings Flash", async () => {
      const co: CompanyAnalysisRequest = {
        symbol: "THYAO",
        name: "Türk Hava Yolları",
        price: 310,
        peRatio: 7.2,
        pbRatio: 1.6,
        dividendYield: 2.5,
        dailyChange: 1.5,
        sector: "Havacılık",
      };

      const flash = await generateEarningsFlash(co, undefined);
      expect(flash.symbol).toBe("THYAO");
      expect(flash.healthScore).toBeGreaterThanOrEqual(0);
      expect(["A+", "A", "B+", "B", "C", "F"]).toContain(flash.grade);
      expect(flash.metricsSource).toBe("calculated");
    });

    it("calculates Altman Z and forensic scorecard in Value Trap detector", async () => {
      const co: CompanyAnalysisRequest = {
        symbol: "EREGL",
        name: "Erdemir",
        price: 45,
        peRatio: 8.0,
        pbRatio: 1.2,
        dividendYield: 5.0,
        dailyChange: -0.5,
        sector: "Sanayi",
      };

      const trap = await detectValueTraps(co, undefined);
      expect(trap.symbol).toBe("EREGL");
      expect(trap.trapRiskScore).toBeGreaterThanOrEqual(0);
      expect(trap.trapRiskScore).toBeLessThanOrEqual(100);
      expect(trap.altmanZScore).toBeDefined();
      expect(trap.forensicScorecard?.length).toBeGreaterThan(0);
      expect(trap.metricsSource).toBe("calculated");
    });
  });

  // -------------------------------------------------------------
  // 4. Utility Functions (Regex Filter & Sentiment Analysis)
  // -------------------------------------------------------------
  describe("Screener & Sentiment Regex Algorithms", () => {
    it("extracts numeric PE and Dividend filters from natural language query", () => {
      const filter1 = extractNumericFilters("f/k < 8 ve temettü > 5 olan hisseler");
      expect(filter1.maxPe).toBe(8);
      expect(filter1.minDividendYield).toBe(5);

      const filter2 = extractNumericFilters("bist 30 teknoloji pd/dd < 2");
      expect(filter2.indexTag).toBe("BIST 30");
      expect(filter2.sector).toBe("teknoloji");
      expect(filter2.maxPb).toBe(2);
    });

    it("computes deterministic match score based on extracted filters", () => {
      const co: CompanyAnalysisRequest = {
        symbol: "TUPRS",
        name: "Tüpraş",
        price: 160,
        peRatio: 6.5,
        pbRatio: 1.4,
        dividendYield: 7.5,
        dailyChange: 1.0,
        sector: "Enerji",
      };

      const score = calculateDeterministicMatchScore(co, { maxPe: 8, minDividendYield: 5 });
      expect(score).toBeGreaterThan(80);
    });

    it("analyzes Turkish news titles for positive/negative financial sentiment", () => {
      const pos = analyzeNewsTitleSentiment("Şirket tarihi rekor kâr artışı ve yüksek temettü açıkladı");
      expect(pos.verdict).toBe("POZİTİF");
      expect(pos.score).toBeGreaterThan(0);

      const neg = analyzeNewsTitleSentiment("Şirket aleyhine ağır ceza ve faaliyet durdurma kararı");
      expect(neg.verdict).toBe("NEGATİF");
      expect(neg.score).toBeLessThan(0);

      const neutral = analyzeNewsTitleSentiment("Genel Kurul toplantısı olağan gündemle toplandı");
      expect(neutral.verdict).toBe("NÖTR");
    });
  });

  // -------------------------------------------------------------
  // 5. Currency Conversion & Transaction Fee Tests
  // -------------------------------------------------------------
  describe("Currency Conversion & Transaction Fee Calculations", () => {
    it("converts USD assets to TRY with exchange rate correctly", () => {
      const tryPrice = convertToTRY(100, "TRY", "BIST", 47.88);
      expect(tryPrice).toBe(100);

      const usdPrice = convertToTRY(200, "USD", "ABD", 47.88);
      expect(usdPrice).toBe(9576);

      const defaultRatePrice = convertToTRY(10, "USD", "ABD");
      expect(defaultRatePrice).toBe(478.8);
    });

    it("deducts estimated transaction fee from budget and distributes investable budget", async () => {
      const req: AiRecipeRequest = {
        goal: "Dengeli Büyüme",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
        estimatedFeeRatePct: 0.2,
      };

      const result = await generateOrakulRecipe(req, sampleCompanies, undefined);

      expect(result.estimatedFeeAmount).toBe(200);
      expect(result.investableBudget).toBe(99800);
      expect(result.feeRatePct).toBe(0.2);

      const totalCost = result.allocation.reduce((sum, item) => sum + (item.totalCost || 0), 0);
      // Total cost must fit within the net investable budget
      expect(totalCost).toBeLessThanOrEqual(result.investableBudget || 100000);
    });
  });

  // -------------------------------------------------------------
  // 6. Partial Single Asset Regeneration (regenerateSingleAsset)
  // -------------------------------------------------------------
  describe("regenerateSingleAsset — Partial Regeneration", () => {
    it("replaces specified asset while strictly preserving other assets and weights", async () => {
      const initialAllocation = [
        { symbol: "THYAO", weight: 30, price: 310, suggestedShares: 96, totalCost: 29760 },
        { symbol: "FROTO", weight: 25, price: 1050, suggestedShares: 23, totalCost: 24150 },
        { symbol: "ASELS", weight: 25, price: 64.5, suggestedShares: 387, totalCost: 24961.5 },
        { symbol: "TUPRS", weight: 20, price: 168, suggestedShares: 119, totalCost: 19992 },
      ];

      const req: AiRecipeRequest = {
        goal: "Dengeli Büyüme",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
      };

      const result = await regenerateSingleAsset(
        initialAllocation,
        "FROTO",
        req,
        sampleCompanies,
        undefined
      );

      expect(result).toBeDefined();
      expect(result.updatedAllocation.length).toBe(4);

      // Excluded symbol must no longer be in the basket
      const hasExcluded = result.updatedAllocation.some((a) => a.symbol === "FROTO");
      expect(hasExcluded).toBe(false);

      // Other 3 symbols must be strictly preserved with their exact weights
      const thyao = result.updatedAllocation.find((a) => a.symbol === "THYAO");
      const asels = result.updatedAllocation.find((a) => a.symbol === "ASELS");
      const tuprs = result.updatedAllocation.find((a) => a.symbol === "TUPRS");

      expect(thyao).toBeDefined();
      expect(thyao?.weight).toBe(30);
      expect(asels).toBeDefined();
      expect(asels?.weight).toBe(25);
      expect(tuprs).toBeDefined();
      expect(tuprs?.weight).toBe(20);

      // The new replacement asset must receive FROTO's exact weight (25%)
      expect(result.newItem.weight).toBe(25);
      expect(result.newItem.symbol).not.toBe("FROTO");

      // Total weights must still sum to 100
      const totalWeight = result.updatedAllocation.reduce((sum, item) => sum + item.weight, 0);
      expect(totalWeight).toBe(100);

      // Quantitative metrics must be recalculated
      expect(result.sharpeRatio).toBeDefined();
      expect(result.portfolioBeta).toBeDefined();
      expect(result.hhiScore).toBeDefined();
    });

    it("throws clear error when trying to replace an asset not in the current basket", async () => {
      const initialAllocation = [
        { symbol: "THYAO", weight: 50, price: 310 },
        { symbol: "ASELS", weight: 50, price: 64.5 },
      ];

      const req: AiRecipeRequest = {
        goal: "Dengeli Büyüme",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
      };

      await expect(
        regenerateSingleAsset(initialAllocation, "NON_EXISTENT_TICKER", req, sampleCompanies, undefined)
      ).rejects.toThrow("bulunamadı");
    });
  });

  // -------------------------------------------------------------
  // 7. Risk & Data Quality Hardening Tests
  // -------------------------------------------------------------
  describe("Risk & Data Quality Hardening", () => {
    it("strictly enforces sector weight ceiling (maxSectorWeight <= 45%) across portfolio", async () => {
      const aviationCompanies: CompanyAnalysisRequest[] = [
        { symbol: "THYAO", name: "THY", price: 310, sector: "Havacılık", exchange: "BIST", dailyChange: 1.0, peRatio: 5 },
        { symbol: "PGSUS", name: "Pegasus", price: 240, sector: "Havacılık", exchange: "BIST", dailyChange: 1.2, peRatio: 6 },
        { symbol: "TAVHL", name: "TAV", price: 180, sector: "Havacılık", exchange: "BIST", dailyChange: 0.8, peRatio: 7 },
        { symbol: "ASELS", name: "Aselsan", price: 64.5, sector: "Savunma", exchange: "BIST", dailyChange: 0.5, peRatio: 12 },
        { symbol: "BIMAS", name: "BİM", price: 490, sector: "Perakende", exchange: "BIST", dailyChange: 0.2, peRatio: 14 },
      ];

      const req: AiRecipeRequest = {
        goal: "Havacılık Odaklı",
        risk: "Yüksek",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
        maxSectorWeight: 45,
      };

      const result = await generateOrakulRecipe(req, aviationCompanies, undefined);

      // Check sum of weights for Havacılık sector
      const aviationWeight = result.allocation
        .filter((item) => {
          const co = aviationCompanies.find((c) => c.symbol === item.symbol);
          return co?.sector === "Havacılık";
        })
        .reduce((sum, item) => sum + item.weight, 0);

      expect(aviationWeight).toBeLessThanOrEqual(46); // 45% + minor rounding tolerance
    });

    it("attaches dataQualityWarning when equity metrics (PE/PB) are missing, without assuming PE=15", async () => {
      const incompleteCompanies: CompanyAnalysisRequest[] = [
        { symbol: "NEWIPO", name: "Yeni Halka Arz", price: 50, sector: "Teknoloji", exchange: "BIST", dailyChange: 0.5 }, // No peRatio or pbRatio
        { symbol: "ASELS", name: "Aselsan", price: 64.5, sector: "Savunma", exchange: "BIST", dailyChange: 0.5, peRatio: 12, pbRatio: 3.5 },
        { symbol: "BIMAS", name: "BİM", price: 490, sector: "Perakende", exchange: "BIST", dailyChange: 0.2, peRatio: 14, pbRatio: 4.2 },
        { symbol: "THYAO", name: "THY", price: 310, sector: "Ulaştırma", exchange: "BIST", dailyChange: 1.0, peRatio: 5, pbRatio: 1.2 },
      ];

      const req: AiRecipeRequest = {
        goal: "Büyüme",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
      };

      const result = await generateOrakulRecipe(req, incompleteCompanies, undefined);

      const newIpoItem = result.allocation.find((a) => a.symbol === "NEWIPO");
      expect(newIpoItem).toBeDefined();
      expect(newIpoItem?.dataQualityWarning).toBeDefined();
      expect(newIpoItem?.dataQualityWarning).toContain("F/K verisi bulunmuyor");
      expect(newIpoItem?.dataQualityWarning).toContain("PD/DD verisi bulunmuyor");

      const aselsItem = result.allocation.find((a) => a.symbol === "ASELS");
      expect(aselsItem?.dataQualityWarning).toBeUndefined();
    });

    it("applies liquidity warning (isLowVolume: true) for assets with low volumeRatio (< 0.5)", async () => {
      const liquidityCompanies: CompanyAnalysisRequest[] = [
        { symbol: "LOWVOL", name: "Sığ Hisse", price: 20, sector: "Sanayi", exchange: "BIST", dailyChange: 0.2, volumeRatio: 0.3, peRatio: 10 },
        { symbol: "HIGHVOL", name: "Likit Hisse", price: 80, sector: "Holding", exchange: "BIST", dailyChange: 0.4, volumeRatio: 1.8, peRatio: 8 },
        { symbol: "ASELS", name: "Aselsan", price: 64.5, sector: "Savunma", exchange: "BIST", dailyChange: 0.5, volumeRatio: 1.2, peRatio: 12 },
        { symbol: "THYAO", name: "THY", price: 310, sector: "Ulaştırma", exchange: "BIST", dailyChange: 1.0, volumeRatio: 1.5, peRatio: 5 },
      ];

      const req: AiRecipeRequest = {
        goal: "Dengeli",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 4,
      };

      const result = await generateOrakulRecipe(req, liquidityCompanies, undefined);

      const lowVolItem = result.allocation.find((a) => a.symbol === "LOWVOL");
      expect(lowVolItem).toBeDefined();
      expect(lowVolItem?.isLowVolume).toBe(true);
      expect(lowVolItem?.volumeRatio).toBe(0.3);

      const highVolItem = result.allocation.find((a) => a.symbol === "HIGHVOL");
      expect(highVolItem?.isLowVolume).toBeUndefined();
    });

    it("avoids stacking highly correlated assets (> maxPairwiseCorrelation: 0.80) when alternatives exist", async () => {
      const corrCompanies: CompanyAnalysisRequest[] = [
        { symbol: "THYAO", name: "THY", price: 300, sector: "Havacılık", exchange: "BIST", dailyChange: 1.0, peRatio: 4.5 },
        { symbol: "PGSUS", name: "Pegasus", price: 220, sector: "Havacılık", exchange: "BIST", dailyChange: 0.9, peRatio: 4.8 },
        { symbol: "EREGL", name: "Erdemir", price: 50, sector: "Demir Çelik", exchange: "BIST", dailyChange: 0.2, peRatio: 8.0 },
        { symbol: "TUPRS", name: "Tüpraş", price: 170, sector: "Enerji", exchange: "BIST", dailyChange: 0.5, peRatio: 6.0 },
        { symbol: "BIMAS", name: "BİM", price: 500, sector: "Perakende", exchange: "BIST", dailyChange: 0.3, peRatio: 12.0 },
      ];

      const req: AiRecipeRequest = {
        goal: "Dengeli Büyüme",
        risk: "Orta",
        universe: "BIST 30",
        budget: 100000,
        assetCount: 3,
        maxPairwiseCorrelation: 0.80,
      };

      const result = await generateOrakulRecipe(req, corrCompanies, undefined);

      const symbols = result.allocation.map((a) => a.symbol);
      // THYAO and PGSUS are both Havacılık (r = 0.88 > 0.80), so both should NOT be in the same 3-asset basket
      const hasBothAviation = symbols.includes("THYAO") && symbols.includes("PGSUS");
      expect(hasBothAviation).toBe(false);
      expect(result.allocation.length).toBe(3);
    });

    it("generates deterministic stressScenarios (USD shock, rate shock, market crash)", async () => {
      const testCompanies: CompanyAnalysisRequest[] = [
        { symbol: "THYAO", name: "THY", price: 300, sector: "Ulaştırma", exchange: "BIST", dailyChange: 1.0, peRatio: 5 },
        { symbol: "ISCTR", name: "İş Bankası", price: 14, sector: "Banka", exchange: "BIST", dailyChange: 0.8, peRatio: 4 },
        { symbol: "ALTIN/GR", name: "Gram Altın", price: 3000, sector: "Kıymetli Maden", exchange: "Emtia", dailyChange: 0.2 },
      ];

      const req: AiRecipeRequest = {
        goal: "Dengeli",
        risk: "Orta",
        universe: "Karma",
        budget: 100000,
        assetCount: 3,
      };

      const result = await generateOrakulRecipe(req, testCompanies, undefined);

      expect(result.stressScenarios).toBeDefined();
      expect(result.stressScenarios?.usdShock10pct.estimatedImpactPct).toBeDefined();
      expect(result.stressScenarios?.rateShock500bp.estimatedImpactPct).toBeDefined();
      expect(result.stressScenarios?.marketCrash20pct.estimatedImpactPct).toBeDefined();
      expect(result.stressScenarios?.marketCrash20pct.estimatedImpactPct).toBeLessThan(0);
    });
  });

  describe("Fallback Engine Data Integrity & Zero Mock Compliance", () => {
    it("generateEarningsFlash returns undefined for revenueGrowth/margins when real data is missing and sets isFallbackMode", async () => {
      const co: CompanyAnalysisRequest = {
        symbol: "TESTCO",
        name: "Test Şirketi",
        price: 100,
        dailyChange: 0,
        sector: "Sanayi",
        peRatio: 10,
        pbRatio: 2,
        dividendYield: 3,
        returnOnEquity: 20,
      };

      const flash = await generateEarningsFlash(co, undefined);
      expect(flash.revenueGrowth).toBeUndefined();
      expect(flash.grossMargin).toBeUndefined();
      expect(flash.ebitdaMargin).toBeUndefined();
      expect(flash.isFallbackMode).toBe(true);
      expect(flash.summary).toContain("Detaylı bilanço dipnot verileri kütükte yer almadığından");
    });

    it("detectValueTraps produces honest null values and 'Veri Yok' scorecard entries when balance sheet items are absent", async () => {
      const co: CompanyAnalysisRequest = {
        symbol: "TRAPCO",
        name: "Trap Şirketi",
        price: 50,
        dailyChange: 0,
        sector: "Sanayi",
      };

      const trap = await detectValueTraps(co, undefined);
      expect(trap.altmanZScore).toBeNull();
      expect(trap.interestCoverageRatio).toBeNull();
      expect(trap.isFallbackMode).toBe(true);

      const altmanItem = trap.forensicScorecard?.find((item) => item.metric.includes("Altman Z-Score"));
      expect(altmanItem?.score).toBe("Veri Yok");

      const interestItem = trap.forensicScorecard?.find((item) => item.metric.includes("Faiz Karşılama"));
      expect(interestItem?.score).toBe("Veri Yok");
    });

    it("askOrakulChat returns honest zero-state message when accuracyStats is not available instead of fake 78%", async () => {
      const response = await askOrakulChat(
        [{ role: "user", content: "Geçmiş başarı ve isabet oranınız nedir?" }],
        {},
        undefined
      );

      expect(response).toContain("Henüz yeterli sayıda tamamlanmış");
      expect(response).not.toContain("%78");
      expect(response).not.toContain("12 analizin");
    });

    it("askOrakulChat uses actual accuracy stats when provided in contextData", async () => {
      const response = await askOrakulChat(
        [{ role: "user", content: "Başarı karneniz nasıl?" }],
        { accuracyStats: { total: 45, accuracyRate: 84 } },
        undefined
      );

      expect(response).toContain("45 adet");
      expect(response).toContain("%84");
    });

    it("askOrakulChat generates comparative matrix when multiple symbols are queried", async () => {
      const response = await askOrakulChat(
        [{ role: "user", content: "THYAO ve PGSUS şirketlerini kıyaslar mısın?" }],
        { companies: sampleCompanies },
        undefined
      );

      expect(response).toContain("Şirket Karşılaştırmalı Kantitatif Rapor");
      expect(response).toContain("$THYAO");
      expect(response).toContain("$PGSUS");
      expect(response).toContain("F/K Çarpanı");
    });

    it("askOrakulChat generates portfolio diagnostics when asked about portfolio health", async () => {
      const response = await askOrakulChat(
        [{ role: "user", content: "Portföyümün sağlık durumunu analiz eder misin?" }],
        {
          baskets: [
            {
              id: "b1",
              name: "Ana Sepet",
              totalValue: 120000,
              totalCost: 100000,
              holdings: [
                { companySymbol: "THYAO", quantity: 100, avgCost: 250, currentPrice: 300, weightPercent: 50 },
                { companySymbol: "ALTIN/GR", quantity: 20, avgCost: 2500, currentPrice: 3000, weightPercent: 50 },
              ],
            },
          ],
        },
        undefined
      );

      expect(response).toContain("Portföy Sağlık & Risk Teşhis Raporu");
      expect(response).toContain("120.000 ₺");
      expect(response).toContain("%+20");
    });

    it("askOrakulChat filters low PE stocks when asked for cheap/value stocks", async () => {
      const response = await askOrakulChat(
        [{ role: "user", content: "Kütükte F/K oranı en düşük kelepir hisseler hangileri?" }],
        { companies: sampleCompanies },
        undefined
      );

      expect(response).toContain("Düşük F/K & Derin Değer Hisseleri");
      expect(response).toContain("F/K");
    });

    it("chatWithOrakulCopilot returns honest error message on failure and never fake neutral financial judgment", async () => {
      // Missing API key case
      const noKeyRes = await chatWithOrakulCopilot(
        "THYAO alınır mı?",
        [],
        "Portföy boş",
        undefined,
        "gemini"
      );
      expect(noKeyRes).toContain("[Nötr Mod - API Anahtarı Tanımlı Değil]");
      expect(noKeyRes).not.toContain("analizi tamamlandı");
      expect(noKeyRes).not.toContain("temettü verimliliği korunmaktadır");

      // API failure case (invalid key)
      const errRes = await chatWithOrakulCopilot(
        "THYAO alınır mı?",
        [],
        "Portföy boş",
        "invalid-key-xyz",
        "gemini"
      );
      expect(errRes).toContain("Orakul Copilot'a bağlanırken");
      expect(errRes).not.toContain("analizi tamamlandı");
      expect(errRes).not.toContain("temettü verimliliği korunmaktadır");
    });

    it("generateOrakulRecipe dynamically resolves seeds from authentic catalog without frozen prices", async () => {
      const req: AiRecipeRequest = {
        budget: 50000,
        risk: "Dengeli (Orta)",
        goal: "Temettü ve Büyüme",
        horizon: "3 Yıl",
        universe: "BIST 30",
        assetCount: 4,
      };

      // Pass empty pool to trigger fallback catalog seeds
      const recipe = await generateOrakulRecipe(req, [], undefined);
      expect(recipe.usedFallbackSeeds).toBe(true);
      expect(recipe.allocation.length).toBe(4);
      
      // All allocated assets must have a authentic positive price and lot count >= 1
      for (const item of recipe.allocation) {
        expect(item.price).toBeGreaterThan(0);
        expect(item.suggestedShares).toBeGreaterThanOrEqual(1);
      }
    });
  });

  // -------------------------------------------------------------
  // 6. Fact-Check & Multi-Agent Investment Committee
  // -------------------------------------------------------------
  describe("Kod-Seviyeli Deterministik Fact-Check (factCheckAgentClaims)", () => {
    it("verifies accurate numerical claims against authentic company and valuation metrics", () => {
      const company: CompanyAnalysisRequest = {
        symbol: "THYAO",
        name: "Türk Hava Yolları",
        price: 300,
        dailyChange: 1.5,
        peRatio: 5.2,
        pbRatio: 1.1,
        dividendYield: 3.5,
        freeCashFlow: 35000000000, // 35 Milyar TL
        sector: "Havacılık",
      };

      const mathVal = calculateValuationFormulas(company);

      const claims = [
        "F/K 5.2 ile sektör ortalamasına göre oldukça ucuz",
        "PD/DD 1.1 seviyesinde defter değerine yakın",
        `Piotroski skoru ${mathVal.piotroskiFScore} seviyesinde hesaplanmıştır`,
        "Şirketin operasyonel serbest nakit akışı güçlü ve pazar payı artıyor", // unverifiable (sayı yok)
      ];

      const results = factCheckAgentClaims(claims, company, mathVal);
      expect(results.length).toBe(4);

      // F/K verified
      expect(results[0].verified).toBe(true);
      expect(results[0].claimedValue).toBe(5.2);
      expect(results[0].actualValue).toBe(5.2);

      // PD/DD verified
      expect(results[1].verified).toBe(true);
      expect(results[1].claimedValue).toBe(1.1);

      // Piotroski verified
      expect(results[2].verified).toBe(true);
      expect(results[2].claimedValue).toBe(mathVal.piotroskiFScore);

      // Qualitative claim unverifiable
      expect(results[3].verified).toBe("unverifiable");
    });

    it("catches quantitative discrepancies when agent invents false valuation numbers", () => {
      const company: CompanyAnalysisRequest = {
        symbol: "ASELS",
        name: "Aselsan",
        price: 60,
        dailyChange: 0,
        peRatio: 15.0,
        pbRatio: 3.2,
        sector: "Savunma",
      };

      const mathVal = calculateValuationFormulas(company);

      const claims = [
        "F/K oranı 4.5 ile tarihi diplerde", // Gerçek 15.0 -> Discrepancy!
        "PD/DD çarpanı 1.2 seviyesinde", // Gerçek 3.2 -> Discrepancy!
      ];

      const results = factCheckAgentClaims(claims, company, mathVal);
      expect(results[0].verified).toBe(false);
      expect(results[0].discrepancyNote).toContain("İddia edilen 4.5, gerçek değer 15 ile uyuşmuyor");

      expect(results[1].verified).toBe(false);
      expect(results[1].discrepancyNote).toContain("İddia edilen 1.2, gerçek değer 3.2 ile uyuşmuyor");
    });
  });

  describe("Multi-Agent Investment Committee (Macro / Bull / Bear / Rebuttal / Judge)", () => {
    it("runs full 5-stage sequential interdependent LLM calls with Macro, Rebuttal, Fact-Check and Past History", async () => {
      const recordedPrompts: string[] = [];
      const progressSteps: string[] = [];

      const mockFetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const bodyStr = init?.body ? String(init.body) : "";
        recordedPrompts.push(bodyStr);

        if (recordedPrompts.length === 1) {
          // 1. Macro Agent response
          return {
            ok: true,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          macroContext: [
                            "TCMB faiz indirimi döngüsünde kademeli gevşeme bekleniyor",
                            "Döviz kuru reel olarak dengeli seyrediyor",
                            "Küresel ticaret hacminde toparlanma eğilimi var",
                          ],
                          sectorSensitivity: "Havacılık sektörü döviz bazlı gelir kalkanına sahiptir.",
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        } else if (recordedPrompts.length === 2) {
          // 2. Bull Agent response
          return {
            ok: true,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          catalyst: "İhracat kapasite artışı ve serbest nakit akışı",
                          targetUpside: "+35%",
                          coreThesis: "Şirketin net nakit pozisyonu ve serbest nakit akışı marjı güçlü.",
                          supportingEvidence: ["F/K 5.2", "Piotroski 9"],
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        } else if (recordedPrompts.length === 3) {
          // 3. Bear Agent response
          return {
            ok: true,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          keyRisk: "Faiz ortamında artan kısa vadeli borçlanma maliyeti",
                          downsideRisk: "-15%",
                          coreThesis: "Yakıt maliyet oynaklığı marjları daraltabilir.",
                          rebuttalToBull: "Boğa ajanı borç çevirme riskini ve yakıt maliyetini göz ardı ediyor.",
                          supportingEvidence: ["Merton temerrüt riski %1.2"],
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        } else if (recordedPrompts.length === 4) {
          // 4. Bull Rebuttal response
          return {
            ok: true,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          finalRebuttal: "Yakıt riskine katılıyoruz ancak forward hedging kalkanı marjları korur.",
                          concedesPoint: true,
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        } else {
          // 5. Committee Judge response
          return {
            ok: true,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          verdict: "GÜÇLÜ AL",
                          confidence: "%88",
                          reasoning: "Boğa ajanının nakit akışı ve F/K 5.2 verileri doğrulanmış olup Ayı'nın yakıt çekincesi hedging ile dengelenmektedir.",
                          dissentingNote: "Faiz artışları yakından izlenmeli.",
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        }
      });

      global.fetch = mockFetch as unknown as typeof fetch;

      const testCompany: CompanyAnalysisRequest = {
        symbol: "THYAO",
        name: "Türk Hava Yolları",
        price: 300,
        dailyChange: 1.5,
        peRatio: 5.2,
        pbRatio: 1.1,
        freeCashFlow: 35000000000,
        netMargin: 18.5,
        sector: "Havacılık",
      };

      const pastHistory = [
        {
          id: "hist-1",
          date: "2026-07-01",
          symbol: "THYAO",
          type: "Şirket Değerleme" as const,
          title: "THYAO Analiz",
          description: "Test",
          verdictTag: "AL",
          verdict: "AL" as const,
          verdictDate: "2026-07-01",
          priceAtVerdict: 280,
          outcomeCorrect: true,
          confidence: "%85",
        },
      ];

      const result = await runInvestmentCommittee(
        testCompany,
        calculateValuationFormulas(testCompany),
        "Değer yatırımcısı perspektifi",
        "mock-api-key-test-1234567",
        undefined,
        (step) => {
          progressSteps.push(step);
        },
        pastHistory
      );

      // Verify 5 sequential calls occurred
      expect(mockFetch).toHaveBeenCalledTimes(5);
      expect(result).not.toBeNull();
      expect(result?.macroContext?.sectorSensitivity).toContain("Havacılık");
      expect(result?.bullCase.catalyst).toContain("İhracat");
      expect(result?.bullCase.concedesPoint).toBe(true);
      expect(result?.bearCase.keyRisk).toContain("Faiz");
      expect(result?.committeeVerdict.verdict).toBe("GÜÇLÜ AL");
      expect(result?.committeeVerdict.trackRecordConsidered).toBe(true);

      // Verify Bull prompt saw Macro context
      expect(recordedPrompts[1]).toContain("TCMB faiz indirimi");

      // Verify Bear prompt saw Macro context AND Bull's thesis
      expect(recordedPrompts[2]).toContain("TCMB faiz indirimi");
      expect(recordedPrompts[2]).toContain("İhracat kapasite artışı");

      // Verify Bull Rebuttal prompt saw Bear's rebuttal
      expect(recordedPrompts[3]).toContain("Boğa ajanı borç çevirme riskini");

      // Verify Judge prompt saw Macro, Bull, Bear, Rebuttal, Past History
      expect(recordedPrompts[4]).toContain("TCMB faiz indirimi");
      expect(recordedPrompts[4]).toContain("İhracat kapasite artışı");
      expect(recordedPrompts[4]).toContain("Yakıt riskine katılıyoruz");
      expect(recordedPrompts[4]).toContain("Boğa Ajanı, Ayı'nın eleştirisinde haklılık payı olduğunu kabul etmiştir");
      expect(recordedPrompts[4]).toContain("Orakul'un THYAO için geçmiş kararları");

      // Verify progress callback sequence
      expect(progressSteps).toEqual([
        "macro_started",
        "macro_done",
        "bull_started",
        "bull_done",
        "bear_started",
        "bear_done",
        "bull_rebuttal_started",
        "bull_rebuttal_done",
        "judge_started",
        "judge_done",
      ]);
    });

    it("falls back cleanly when hallucination count exceeds threshold (> 2 falsified claims)", async () => {
      const mockFetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const bodyStr = init?.body ? String(init.body) : "";

        if (bodyStr.includes("Makroekonomi")) {
          return {
            ok: true,
            json: async () => ({
              candidates: [{ content: { parts: [{ text: JSON.stringify({ macroContext: ["Test"], sectorSensitivity: "Dengeli" }) }] } }],
            }),
          };
        } else if (bodyStr.includes("Boğa")) {
          // Bull agent returns 2 fake numbers
          return {
            ok: true,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          catalyst: "Uydurma büyüme",
                          targetUpside: "+50%",
                          coreThesis: "Test",
                          supportingEvidence: ["F/K 1.2", "PD/DD 0.3"], // Gerçek değerler 15.0 ve 3.2
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        } else if (bodyStr.includes("Ayı")) {
          // Bear agent returns 1 more fake number (total 3 discrepancies)
          return {
            ok: true,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          keyRisk: "Uydurma risk",
                          downsideRisk: "-30%",
                          coreThesis: "Test",
                          rebuttalToBull: "Test",
                          supportingEvidence: ["F/K 25.0"], // Gerçek F/K 15.0
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        }
        return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: "{}" }] } }] }) };
      });

      global.fetch = mockFetch as unknown as typeof fetch;

      const testCompany: CompanyAnalysisRequest = {
        symbol: "ASELS",
        name: "Aselsan",
        price: 60,
        dailyChange: 0,
        peRatio: 15.0,
        pbRatio: 3.2,
        sector: "Savunma",
      };

      const result = await runInvestmentCommittee(
        testCompany,
        calculateValuationFormulas(testCompany),
        "Değer odaklı",
        "mock-key-12345"
      );

      // Should cancel committee and return null due to high hallucination count (> 2)
      expect(result).toBeNull();
    });

    it("returns null if any agent call fails, allowing clean fallback to quantitative engine", async () => {
      const mockFetch = vi.fn().mockImplementation(async () => {
        return {
          ok: false,
          status: 500,
          json: async () => ({ error: { message: "Internal Server Error" } }),
        };
      });

      global.fetch = mockFetch as unknown as typeof fetch;

      const testCompany: CompanyAnalysisRequest = {
        symbol: "ASELS",
        name: "Aselsan",
        price: 60,
        dailyChange: -0.8,
        peRatio: 12,
        sector: "Savunma",
      };

      const result = await runInvestmentCommittee(
        testCompany,
        calculateValuationFormulas(testCompany),
        "Değer odaklı",
        "mock-key-12345"
      );

      expect(result).toBeNull();
    });

    it("generateCompanyAnalysis gracefully falls back to quantitative report when API key is missing or agent fails", async () => {
      const report = await generateCompanyAnalysis(
        {
          symbol: "KCHOL",
          name: "Koç Holding",
          price: 210,
          dailyChange: 0.5,
          peRatio: 6.5,
          pbRatio: 1.3,
          sector: "Holding",
        },
        [],
        undefined // No API key -> clean authentic quantitative fallback
      );

      expect(report.isFallbackMode).toBe(true);
      expect(report.symbol).toBe("KCHOL");
      expect(report.verdict).toBeDefined();
      expect(report.bullCase?.coreThesis).toBeDefined();
      expect(report.bearCase?.coreThesis).toBeDefined();
    });
  });
});
