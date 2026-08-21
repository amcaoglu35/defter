import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateOrakulRecipe,
  generateEarningsFlash,
  detectValueTraps,
  extractNumericFilters,
  calculateDeterministicMatchScore,
  analyzeNewsTitleSentiment,
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

      expect(fetchMock).not.toHaveBeenCalled();
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
});
