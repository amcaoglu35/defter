import { describe, it, expect } from "vitest";
import {
  calculateCorrelationMatrix,
  getCorrelationBetween,
  getWaccForSector,
  SECTOR_WACC_MAP,
  calculatePortfolioRiskMetrics,
  runMonteCarloSimulation,
  calculateMacroSensitivities,
  generateEfficientFrontier,
  calculateHHI,
  calculateValuationFormulas,
  calculateHistoricalVolatility,
  calculateHurstExponent,
  PortfolioAssetInput,
} from "./quantEngine";

describe("quantEngine Unit Tests", () => {
  // -------------------------------------------------------------
  // 1. calculateCorrelationMatrix
  // -------------------------------------------------------------
  describe("calculateCorrelationMatrix", () => {
    it("returns empty structure when assets array is empty", () => {
      const result = calculateCorrelationMatrix([]);
      expect(result.symbols).toEqual([]);
      expect(result.averageCorrelation).toBe(0);
      expect(result.isPseudoDiversified).toBe(false);
      expect(result.matrix).toEqual({});
    });

    it("assigns 0.88 correlation for two stocks in the same sector", () => {
      const assets: PortfolioAssetInput[] = [
        {
          symbol: "THYAO",
          name: "Türk Hava Yolları",
          category: "hisse",
          sector: "Havacılık",
          totalCurrentValue: 50000,
          weightPct: 50,
          unrealizedProfitLossPct: 10,
          currency: "₺",
        },
        {
          symbol: "PGSUS",
          name: "Pegasus",
          category: "hisse",
          sector: "Havacılık",
          totalCurrentValue: 50000,
          weightPct: 50,
          unrealizedProfitLossPct: 15,
          currency: "₺",
        },
      ];

      const result = calculateCorrelationMatrix(assets);
      expect(result.matrix["THYAO"]["PGSUS"]).toBe(0.88);
      expect(result.matrix["PGSUS"]["THYAO"]).toBe(0.88);
      expect(result.matrix["THYAO"]["THYAO"]).toBe(1.0);
    });

    it("assigns -0.15 correlation between Gold (emtia) and Equity (hisse)", () => {
      const assets: PortfolioAssetInput[] = [
        {
          symbol: "THYAO",
          name: "Türk Hava Yolları",
          category: "hisse",
          sector: "Havacılık",
          totalCurrentValue: 70000,
          weightPct: 70,
          unrealizedProfitLossPct: 5,
          currency: "₺",
        },
        {
          symbol: "ALTIN.S1",
          name: "Darphane Altın Sertifikası",
          category: "emtia",
          sector: "Kıymetli Maden",
          totalCurrentValue: 30000,
          weightPct: 30,
          unrealizedProfitLossPct: 20,
          currency: "₺",
        },
      ];

      const result = calculateCorrelationMatrix(assets);
      expect(result.matrix["THYAO"]["ALTIN.S1"]).toBe(-0.15);
      expect(result.matrix["ALTIN.S1"]["THYAO"]).toBe(-0.15);
    });

    it("flags pseudo-diversification only when average correlation > 0.70 and asset count > 2", () => {
      // 3 stocks from the same sector (average correlation = 0.88 > 0.70)
      const sameSectorAssets: PortfolioAssetInput[] = [
        { symbol: "THYAO", name: "THY", category: "hisse", sector: "Havacılık", totalCurrentValue: 33000, weightPct: 33, unrealizedProfitLossPct: 0, currency: "₺" },
        { symbol: "PGSUS", name: "Pegasus", category: "hisse", sector: "Havacılık", totalCurrentValue: 33000, weightPct: 33, unrealizedProfitLossPct: 0, currency: "₺" },
        { symbol: "TAVHL", name: "TAV", category: "hisse", sector: "Havacılık", totalCurrentValue: 34000, weightPct: 34, unrealizedProfitLossPct: 0, currency: "₺" },
      ];

      const resultSame = calculateCorrelationMatrix(sameSectorAssets);
      expect(resultSame.averageCorrelation).toBe(0.88);
      expect(resultSame.isPseudoDiversified).toBe(true);

      // 2 stocks from the same sector (even if 0.88 > 0.70, asset count is not > 2)
      const twoAssets = sameSectorAssets.slice(0, 2);
      const resultTwo = calculateCorrelationMatrix(twoAssets);
      expect(resultTwo.isPseudoDiversified).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 2. calculatePortfolioRiskMetrics
  // -------------------------------------------------------------
  describe("calculatePortfolioRiskMetrics", () => {
    it("returns neutral zero defaults when portfolio is empty or total value is zero", () => {
      const emptyResult = calculatePortfolioRiskMetrics([], 0, 0);
      expect(emptyResult.sharpeRatio).toBe(0);
      expect(emptyResult.sortinoRatio).toBe(0);
      expect(emptyResult.portfolioBeta).toBe(1.0);
      expect(emptyResult.maxDrawdownPct).toBe(0);
      expect(emptyResult.shannonEntropyPct).toBe(0);
    });

    it("deterministically computes Sharpe ratio matching theoretical formula", () => {
      const singleAsset: PortfolioAssetInput[] = [
        {
          symbol: "KCHOL",
          name: "Koç Holding",
          category: "hisse",
          sector: "Holding",
          totalCurrentValue: 100000,
          weightPct: 100,
          unrealizedProfitLossPct: 12,
          currency: "₺",
        },
      ];

      const totalReturnPct = 60.0;
      const riskFreeRatePct = 40.0;
      const bistReturnPct = 30.0;

      const result = calculatePortfolioRiskMetrics(
        singleAsset,
        100000,
        totalReturnPct,
        bistReturnPct,
        riskFreeRatePct
      );

      // Expected: Sharpe = (totalReturnPct - riskFreeRatePct) / annualizedVolatility
      const expectedSharpe = parseFloat(((60.0 - 40.0) / result.annualizedVolatility).toFixed(2));
      expect(result.sharpeRatio).toBe(expectedSharpe);
      expect(result.annualizedVolatility).toBeGreaterThan(0);
      expect(result.portfolioBeta).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------
  // 3. runMonteCarloSimulation
  // -------------------------------------------------------------
  describe("runMonteCarloSimulation", () => {
    it("generates exactly horizonMonths + 1 timeline points", () => {
      const horizonMonths = 12;
      const initialValue = 100000;
      const result = runMonteCarloSimulation(initialValue, 25.0, 35.0, horizonMonths);

      expect(result.length).toBe(horizonMonths + 1);
      expect(result[0].month).toBe(0);
      expect(result[0].p50Median).toBe(initialValue);
      expect(result[horizonMonths].month).toBe(horizonMonths);
    });

    it("strictly preserves p5Worst <= p50Median <= p95Best ordering across all months", () => {
      const result = runMonteCarloSimulation(50000, 20.0, 40.0, 6);

      result.forEach((point) => {
        expect(point.p5Worst).toBeLessThanOrEqual(point.p50Median);
        expect(point.p50Median).toBeLessThanOrEqual(point.p95Best);
      });
    });

    it("gracefully falls back to safe positive value when initialValue <= 0", () => {
      const result = runMonteCarloSimulation(0, 20.0, 30.0, 3);
      expect(result[0].p50Median).toBe(100000);
      expect(result.length).toBe(4);
    });
  });

  // -------------------------------------------------------------
  // 4. calculateMacroSensitivities
  // -------------------------------------------------------------
  describe("calculateMacroSensitivities", () => {
    it("yields significantly higher usdElasticity for FX/Commodity portfolio compared to 100% domestic equity", () => {
      const equityPortfolio: PortfolioAssetInput[] = [
        { symbol: "BIMAS", name: "BİM", category: "hisse", sector: "Perakende", totalCurrentValue: 100000, weightPct: 100, unrealizedProfitLossPct: 0, currency: "₺" },
      ];

      const fxCommodityPortfolio: PortfolioAssetInput[] = [
        { symbol: "ALTIN.S1", name: "Altın", category: "emtia", sector: "Maden", totalCurrentValue: 60000, weightPct: 60, unrealizedProfitLossPct: 0, currency: "₺" },
        { symbol: "USDTRY", name: "Dolar", category: "döviz", sector: "Döviz", totalCurrentValue: 40000, weightPct: 40, unrealizedProfitLossPct: 0, currency: "₺" },
      ];

      const equitySens = calculateMacroSensitivities(equityPortfolio, 1.0);
      const fxSens = calculateMacroSensitivities(fxCommodityPortfolio, 0.4);

      expect(fxSens.usdElasticityPct).toBeGreaterThan(equitySens.usdElasticityPct);
    });

    it("Black-Litterman trims positions > 35% and boosts sub-15% commodities to 15%", () => {
      const assets: PortfolioAssetInput[] = [
        { symbol: "THYAO", name: "THY", category: "hisse", sector: "Havacılık", totalCurrentValue: 80000, weightPct: 80, unrealizedProfitLossPct: 0, currency: "₺" },
        { symbol: "ALTIN", name: "Altın", category: "emtia", sector: "Maden", totalCurrentValue: 5000, weightPct: 5, unrealizedProfitLossPct: 0, currency: "₺" },
        { symbol: "EREGL", name: "Erdemir", category: "hisse", sector: "Sanayi", totalCurrentValue: 15000, weightPct: 15, unrealizedProfitLossPct: 0, currency: "₺" },
      ];

      const result = calculateMacroSensitivities(assets, 1.1);
      const thyaoRec = result.blackLittermanSuggestedWeights.find((w) => w.symbol === "THYAO");
      const altinRec = result.blackLittermanSuggestedWeights.find((w) => w.symbol === "ALTIN");

      expect(thyaoRec?.optimalWeight).toBeLessThan(80); // Trimmed from 80%
      expect(altinRec?.optimalWeight).toBe(15); // Boosted from 5% to 15%
    });
  });

  // -------------------------------------------------------------
  // 5. generateEfficientFrontier
  // -------------------------------------------------------------
  describe("generateEfficientFrontier", () => {
    it("returns array strictly sorted by ascending risk", () => {
      const assets: PortfolioAssetInput[] = [
        { symbol: "SISE", name: "Şişecam", category: "hisse", totalCurrentValue: 10000, weightPct: 100, unrealizedProfitLossPct: 0, currency: "₺" },
      ];

      const points = generateEfficientFrontier(assets, 24.5, 38.0);
      expect(points.length).toBeGreaterThan(5);

      for (let i = 0; i < points.length - 1; i++) {
        expect(points[i].risk).toBeLessThanOrEqual(points[i + 1].risk);
      }
    });

    it("contains exactly one point marked with isCurrent: true", () => {
      const assets: PortfolioAssetInput[] = [
        { symbol: "ASELS", name: "Aselsan", category: "hisse", totalCurrentValue: 10000, weightPct: 100, unrealizedProfitLossPct: 0, currency: "₺" },
      ];

      const points = generateEfficientFrontier(assets, 22.0, 35.0);
      const currentPoints = points.filter((p) => p.isCurrent === true);
      expect(currentPoints.length).toBe(1);
    });
  });

  // -------------------------------------------------------------
  // 6. calculateHHI (Herfindahl-Hirschman Index)
  // -------------------------------------------------------------
  describe("calculateHHI", () => {
    it("returns 10000 for a single asset (100% concentration)", () => {
      expect(calculateHHI([100])).toBe(10000);
      expect(calculateHHI([50])).toBe(10000); // Normalized to 100%
    });

    it("returns 2500 for 4 equal-weighted assets (25% each)", () => {
      expect(calculateHHI([25, 25, 25, 25])).toBe(2500);
    });

    it("returns 5000 for 2 equal-weighted assets (50% each)", () => {
      expect(calculateHHI([50, 50])).toBe(5000);
    });

    it("returns 0 for empty or zero weights", () => {
      expect(calculateHHI([])).toBe(0);
      expect(calculateHHI([0, 0])).toBe(0);
    });
  });

  // -------------------------------------------------------------
  // 7. calculateValuationFormulas
  // -------------------------------------------------------------
  describe("calculateValuationFormulas", () => {
    it("correctly computes Graham Number, DuPont ROE, and Piotroski score", () => {
      const val = calculateValuationFormulas({
        symbol: "FROTO",
        price: 1000,
        peRatio: 10,
        pbRatio: 4,
        eps: 100,
        bookValuePerShare: 250,
        netMargin: 15,
        assetTurnover: 1.2,
        financialLeverage: 2.0,
        dividendYield: 4.5,
      });

      // Graham Number = sqrt(22.5 * 100 * 250) = sqrt(562500) = 750
      expect(val.grahamNumber).toBe(750);
      // DuPont ROE = 15 * 1.2 * 2.0 = 36%
      expect(val.dupontRoePct).toBe(36.0);
      // Piotroski F-Score (0 to 9)
      expect(val.piotroskiFScore).toBeGreaterThanOrEqual(0);
      expect(val.piotroskiFScore).toBeLessThanOrEqual(9);
      expect(val.piotroskiEvaluatedCount).toBeGreaterThan(0);
      expect(val.piotroskiSummary).toBeDefined();
    });

    it("evaluates Piotroski with null (not hardcoded true) when comparative metrics are missing", () => {
      const partial = calculateValuationFormulas({
        symbol: "MINIMAL",
        price: 50,
        eps: 5,
      });

      // Criteria without data (e.g. priorRoa, currentRatio, sharesOutstanding) must be null
      const nullCriteria = partial.piotroskiDetails.filter((d) => d.passed === null);
      expect(nullCriteria.length).toBeGreaterThanOrEqual(4);
      expect(partial.piotroskiEvaluatedCount).toBeLessThan(9);
      expect(partial.piotroskiSummary).toContain(`${partial.piotroskiEvaluatedCount}/9 Kriter Değerlendirildi`);
    });

    it("evaluates a perfect 9/9 Piotroski score when complete positive historical data is provided", () => {
      const fullHealthy = calculateValuationFormulas({
        symbol: "HEALTHY",
        price: 100,
        peRatio: 10,
        pbRatio: 2,
        eps: 10,
        roa: 12,
        priorRoa: 8,
        operatingCashFlow: 5000000,
        netIncome: 3000000,
        longTermDebtToAssets: 0.2,
        priorLongTermDebtToAssets: 0.35,
        currentRatio: 2.2,
        priorCurrentRatio: 1.8,
        sharesOutstanding: 1000000,
        priorSharesOutstanding: 1000000,
        grossMargin: 28,
        priorGrossMargin: 24,
        assetTurnover: 0.9,
      });

      expect(fullHealthy.piotroskiEvaluatedCount).toBe(9);
      expect(fullHealthy.piotroskiFScore).toBe(9);
      expect(fullHealthy.piotroskiRank).toBe("Çok Güçlü / Elit");
      expect(fullHealthy.piotroskiSummary).toBe("9/9 (Tam Değerlendirme)");
    });

    it("evaluates a 0/9 Piotroski score and flags 'Zayıf / Riskli' when all metrics fail", () => {
      const distressed = calculateValuationFormulas({
        symbol: "DISTRESSED",
        price: 10,
        eps: -5,
        roa: -8,
        priorRoa: -2,
        operatingCashFlow: -1000000,
        netIncome: -500000,
        longTermDebtToAssets: 0.7,
        priorLongTermDebtToAssets: 0.4,
        currentRatio: 0.8,
        priorCurrentRatio: 1.2,
        sharesOutstanding: 2000000,
        priorSharesOutstanding: 1000000,
        grossMargin: 8,
        priorGrossMargin: 15,
        assetTurnover: 0.3,
      });

      expect(distressed.piotroskiEvaluatedCount).toBe(9);
      expect(distressed.piotroskiFScore).toBe(0);
      expect(distressed.piotroskiRank).toBe("Zayıf / Riskli");
      expect(distressed.piotroskiSummary).toBe("0/9 (Tam Değerlendirme)");
    });

    it("returns dcfFairValue: null when freeCashFlow or marketCap is missing (no fake eps*0.9 proxy)", () => {
      const noFcf = calculateValuationFormulas({
        symbol: "NOFCF",
        price: 150,
        eps: 15,
        peRatio: 10,
        sector: "Teknoloji",
      });

      expect(noFcf.dcfFairValue).toBeNull();
      expect(noFcf.dcfDiscountPct).toBeNull();
    });

    it("accurately computes dcfFairValue with sector-specific WACC and revenueGrowth when real FCF is present", () => {
      // Bank sector: WACC = 0.24
      const bankVal = calculateValuationFormulas({
        symbol: "ISCTR",
        sector: "Bankacılık",
        price: 14.0,
        freeCashFlow: 50_000_000_000,
        marketCap: 250_000_000_000, // FCF per share = 50B / (250B / 14) = 2.8 TL
        revenueGrowth: 15, // g = 0.15 (capped below wacc 0.24)
      });

      expect(bankVal.dcfFairValue).toBeDefined();
      expect(bankVal.dcfFairValue).not.toBeNull();
      expect(bankVal.dcfDiscountPct).toBeDefined();
      expect(bankVal.waccPct).toBe(24.0);
    });

    it("safely handles divergent growth (revenueGrowth >= wacc) without crashing or blowing up", () => {
      const hyperGrowth = calculateValuationFormulas({
        symbol: "HYPER",
        sector: "Teknoloji",
        price: 100,
        freeCashFlow: 10_000_000,
        marketCap: 100_000_000,
        revenueGrowth: 95, // 95% growth is above WACC 30%
      });

      expect(hyperGrowth.dcfFairValue).toBeDefined();
      expect(hyperGrowth.dcfFairValue).not.toBeNull();
      expect(hyperGrowth.dcfFairValue).toBeGreaterThan(0);
      expect(hyperGrowth.waccPct).toBe(30.0);
    });

    it("computes Gordon DDM value when dividendYield is positive with sector discount rate", () => {
      const dividendStock = calculateValuationFormulas({
        symbol: "TUPRS",
        sector: "Petrol & Enerji",
        price: 160,
        dividendYield: 8.5,
        revenueGrowth: 12,
      });

      expect(dividendStock.gordanDdmValue).toBeDefined();
      expect(dividendStock.gordanDdmValue).not.toBeNull();
      expect(dividendStock.gordanDdmValue).toBeGreaterThan(0);
    });

    it("handles Hurst and Kelly gracefully with null when price history is missing", () => {
      const val = calculateValuationFormulas({
        symbol: "NOPRICES",
        financialLeverage: 1.5,
        eps: 5,
      });

      expect(val.mertonDefaultProbabilityPct).toBeDefined();
      expect(val.mertonDefaultProbabilityPct).toBeGreaterThan(0);
      expect(val.hurstExponent).toBeNull();
      expect(val.hurstTrendType).toBe("Kapsam Dışı / Yetersiz Veri");
      expect(val.beneishStatus).toBe("Kapsam Dışı / Yetersiz Dipnot Verisi");
      expect(val.kellySuggestedPct).toBeNull();
    });

    it("calculates real Hurst exponent and Kelly fraction when 20+ historical prices are provided", () => {
      // 25 daily prices with an upward trend
      const trendingPrices = [
        100, 101, 102, 101.5, 103, 104, 103.5, 105, 106, 107,
        106.5, 108, 109, 110, 109.5, 111, 112, 113, 112.5, 114,
        115, 116, 117, 118, 120,
      ];

      const val = calculateValuationFormulas({
        symbol: "TRENDY",
        prices: trendingPrices,
        financialLeverage: 1.8,
        eps: 10,
      });

      expect(val.hurstExponent).toBeDefined();
      expect(val.hurstExponent).not.toBeNull();
      expect(val.hurstExponent).toBeGreaterThan(0.45);
      expect(val.hurstTrendType).toBeDefined();

      expect(val.kellySuggestedPct).toBeDefined();
      expect(val.kellySuggestedPct).not.toBeNull();
      expect(val.kellySuggestedPct).toBeGreaterThan(0);
    });

    it("gracefully handles zero/undefined values without throwing", () => {
      const val = calculateValuationFormulas({
        symbol: "TEST",
      });

      expect(val.dupontRoePct).toBeDefined();
      expect(val.piotroskiFScore).toBeGreaterThanOrEqual(0);
    });
  });

  // -------------------------------------------------------------
  // 7.1 calculateHurstExponent
  // -------------------------------------------------------------
  describe("calculateHurstExponent", () => {
    it("returns null when prices array is undefined or has less than 20 points", () => {
      expect(calculateHurstExponent(undefined).hurstExponent).toBeNull();
      expect(calculateHurstExponent([100, 105, 102]).hurstExponent).toBeNull();
    });

    it("computes authentic Hurst exponent for a trending time series", () => {
      const upwardSeries = Array.from({ length: 30 }, (_, i) => 100 + i * 2 + (i % 2 === 0 ? 0.5 : -0.5));
      const res = calculateHurstExponent(upwardSeries);
      expect(res.hurstExponent).toBeDefined();
      expect(res.hurstExponent).not.toBeNull();
      expect(res.hurstExponent!).toBeGreaterThan(0.5);
    });
  });

  // -------------------------------------------------------------
  // 7.1 getWaccForSector
  // -------------------------------------------------------------
  describe("getWaccForSector", () => {
    it("returns 0.24 for banking and financial sectors", () => {
      expect(getWaccForSector("Bankacılık")).toBe(0.24);
      expect(getWaccForSector("Finans")).toBe(0.24);
      expect(getWaccForSector("Sigortacılık")).toBe(0.24);
    });

    it("returns 0.30 for technology and software sectors", () => {
      expect(getWaccForSector("Teknoloji")).toBe(0.30);
      expect(getWaccForSector("Bilişim & Yazılım")).toBe(0.30);
    });

    it("returns 0.26 for holdings", () => {
      expect(getWaccForSector("Holding")).toBe(0.26);
    });

    it("returns default 0.28 for unspecified or unknown sectors", () => {
      expect(getWaccForSector(undefined)).toBe(0.28);
      expect(getWaccForSector("Bilinmeyen")).toBe(0.28);
    });
  });

  // -------------------------------------------------------------
  // 8. calculateHistoricalVolatility
  // -------------------------------------------------------------
  describe("calculateHistoricalVolatility", () => {
    it("returns null for empty array or insufficient data points (< 5)", () => {
      expect(calculateHistoricalVolatility([])).toBeNull();
      expect(calculateHistoricalVolatility([100, 102, 101])).toBeNull();
    });

    it("returns 0 for identical flat prices", () => {
      expect(calculateHistoricalVolatility([100, 100, 100, 100, 100, 100])).toBe(0);
    });

    it("accurately computes annualized standard deviation for a realistic series", () => {
      const prices = [100, 102, 101, 103, 102, 105, 104, 106, 105, 107];
      const vol = calculateHistoricalVolatility(prices);
      expect(vol).toBeDefined();
      expect(vol).toBeGreaterThan(10);
      expect(vol).toBeLessThan(50);
    });
  });

  // -------------------------------------------------------------
  // 9. getCorrelationBetween
  // -------------------------------------------------------------
  describe("getCorrelationBetween", () => {
    it("returns 1.0 for the exact same symbol", () => {
      expect(getCorrelationBetween({ symbol: "THYAO" }, { symbol: "THYAO" })).toBe(1.0);
    });

    it("returns 0.88 for two equities in the exact same sector", () => {
      const a = { symbol: "THYAO", category: "hisse", sector: "Havacılık" };
      const b = { symbol: "PGSUS", category: "hisse", sector: "Havacılık" };
      expect(getCorrelationBetween(a, b)).toBe(0.88);
    });

    it("returns 0.62 for two equities in different sectors", () => {
      const a = { symbol: "THYAO", category: "hisse", sector: "Havacılık" };
      const b = { symbol: "EREGL", category: "hisse", sector: "Demir Çelik" };
      expect(getCorrelationBetween(a, b)).toBe(0.62);
    });

    it("returns -0.15 for Gold (commodity) vs Equity", () => {
      const gold = { symbol: "ALTIN/GR", exchange: "Emtia" };
      const stock = { symbol: "THYAO", category: "hisse" };
      expect(getCorrelationBetween(gold, stock)).toBe(-0.15);
    });

    it("returns 0.10 for USD (currency) vs Equity", () => {
      const usd = { symbol: "USD/TRY", exchange: "Döviz" };
      const stock = { symbol: "ASELS", category: "hisse" };
      expect(getCorrelationBetween(usd, stock)).toBe(0.10);
    });
  });
});
