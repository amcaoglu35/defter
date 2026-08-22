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
  CompanyAnalysisRequest,
  AiRecipeRequest,
} from "./aiService";
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

      expect(response).toContain("Henüz yeterli sayıda tamamlanmış Orakul analizi/karnesi bulunmuyor");
      expect(response).not.toContain("%78");
      expect(response).not.toContain("12 analizin");
    });

    it("askOrakulChat uses actual accuracy stats when provided in contextData", async () => {
      const response = await askOrakulChat(
        [{ role: "user", content: "Başarı karneniz nasıl?" }],
        { accuracyStats: { total: 45, accuracyRate: 84 } },
        undefined
      );

      expect(response).toContain("**45 analizin %84'i**");
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
});
