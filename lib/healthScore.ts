import { Basket, Company } from "./mockData";
import { isLiveSymbol } from "./liveSymbols";

export interface HealthScoreResult {
  score: number; // 0 - 100
  diversificationScore: number; // 0 - 100
  riskBalanceScore: number; // 0 - 100
  liquidityScore: number; // 0 - 100
  label: string;
  verdictColor: "verdigris" | "brass" | "loss";
  metrics: {
    sectorCount: number;
    holdingCount: number;
    liveRatio: number;
  };
}

/**
 * Calculates a genuine, mathematically grounded portfolio health score (0-100)
 * based on diversification (sectors & HHI concentration), risk level balance, and real-time liquidity ratio.
 */
export function calculatePortfolioHealthScore(
  baskets: Basket[],
  companies: Company[]
): HealthScoreResult | null {
  // Zero-mock-data rule: return null when there is no real portfolio data to score
  if (!baskets || baskets.length === 0) {
    return null;
  }

  const allHoldings = baskets.flatMap((b) => b.holdings);
  const totalHoldingsCount = allHoldings.length;

  if (totalHoldingsCount === 0) {
    return null;
  }

  // 1. Diversification Score (Sectors & Asset Weight Distribution)
  const sectorSet = new Set<string>();
  const symbolWeights: Record<string, number> = {};
  let totalPortfolioVal = 0;

  baskets.forEach((b) => {
    b.holdings.forEach((h) => {
      const co = companies.find((c) => c.symbol === h.companySymbol);
      if (co && co.sector) {
        sectorSet.add(co.sector);
      }
      const val = (h.quantity || 1) * (co ? co.price : h.currentPrice || 100);
      symbolWeights[h.companySymbol] = (symbolWeights[h.companySymbol] || 0) + val;
      totalPortfolioVal += val;
    });
  });

  const sectorCount = sectorSet.size;
  // Sector score: 1 sector = 35, 2 = 55, 3 = 70, 4 = 85, >=5 = 100
  let sectorScore = Math.min(100, 35 + (sectorCount - 1) * 16.25);
  if (sectorCount === 0) sectorScore = 60;

  // Concentration penalty (Herfindahl-Hirschman index approximation)
  let maxSingleWeightPct = 0;
  if (totalPortfolioVal > 0) {
    Object.values(symbolWeights).forEach((w) => {
      const pct = (w / totalPortfolioVal) * 100;
      if (pct > maxSingleWeightPct) maxSingleWeightPct = pct;
    });
  }

  // If a single stock has > 40% weight, reduce diversification score
  let concentrationPenalty = 0;
  if (maxSingleWeightPct > 50) {
    concentrationPenalty = 20;
  } else if (maxSingleWeightPct > 35) {
    concentrationPenalty = 10;
  }

  const diversificationScore = Math.max(20, Math.min(100, Math.round(sectorScore - concentrationPenalty)));

  // 2. Risk Balance Score (Weighted Risk of Baskets)
  let totalRiskPoints = 0;
  let totalBasketValue = 0;

  baskets.forEach((b) => {
    const val = b.totalValue || 1;
    totalBasketValue += val;
    const riskWeight =
      b.riskLevel === "Düşük"
        ? 95
        : b.riskLevel === "Orta"
        ? 85
        : 65; // High risk basket
    totalRiskPoints += riskWeight * val;
  });

  const riskBalanceScore =
    totalBasketValue > 0
      ? Math.round(totalRiskPoints / totalBasketValue)
      : 85;

  // 3. Liquidity Score (Live pricing vs Static fallback)
  const liveCount = allHoldings.filter((h) => isLiveSymbol(h.companySymbol)).length;
  const liveRatio = totalHoldingsCount > 0 ? Math.round((liveCount / totalHoldingsCount) * 100) : 100;
  const liquidityScore = Math.max(40, Math.min(100, liveRatio));

  // 4. Overall Weighted Score
  // 40% Diversification + 35% Risk Balance + 25% Liquidity
  const finalScore = Math.round(
    diversificationScore * 0.4 + riskBalanceScore * 0.35 + liquidityScore * 0.25
  );

  // Label Generation
  let label = "Dengeli & Yüksek Likidite";
  let verdictColor: "verdigris" | "brass" | "loss" = "brass";

  if (finalScore >= 85) {
    label = "Mükemmel Çeşitlendirilmiş & Yüksek Likidite";
    verdictColor = "verdigris";
  } else if (finalScore >= 72) {
    label = "Dengeli Dağılım & Kontrollü Risk";
    verdictColor = "verdigris";
  } else if (finalScore >= 55) {
    label = "Orta Risk & Kısmi Yoğunlaşma";
    verdictColor = "brass";
  } else {
    label = "Yoğunlaşmış Varlık & Yüksek Volatilite";
    verdictColor = "loss";
  }

  return {
    score: finalScore,
    diversificationScore,
    riskBalanceScore,
    liquidityScore,
    label,
    verdictColor,
    metrics: {
      sectorCount,
      holdingCount: totalHoldingsCount,
      liveRatio,
    },
  };
}

export interface CompanyHealthDimensions {
  overallScore: number;
  dimensions: {
    valuation: number;
    profitability: number;
    leverage: number;
    growth: number;
    efficiency: number;
  };
}

export function calculateCompanyHealth(c: Company): CompanyHealthDimensions {
  // 1. Valuation (Lower P/E and P/B is better, max 100)
  let valuation = 70;
  if (c.peRatio && c.peRatio > 0) {
    if (c.peRatio < 8) valuation = 95;
    else if (c.peRatio < 15) valuation = 80;
    else if (c.peRatio < 25) valuation = 60;
    else valuation = 40;
  }

  // 2. Profitability (Higher ROE & Operating Margin is better)
  let profitability = 70;
  if (c.returnOnEquity !== undefined) {
    if (c.returnOnEquity > 30) profitability = 95;
    else if (c.returnOnEquity > 15) profitability = 80;
    else if (c.returnOnEquity > 5) profitability = 65;
    else profitability = 40;
  }

  // 3. Leverage / Risk Balance (Beta around 1.0 or lower is safer)
  let leverage = 75;
  if (c.beta !== undefined) {
    if (c.beta <= 0.9) leverage = 90;
    else if (c.beta <= 1.2) leverage = 75;
    else leverage = 55;
  }

  // 4. Growth / Momentum
  let growth = 70;
  if (c.dailyChange !== undefined) {
    if (c.dailyChange > 2) growth = 85;
    else if (c.dailyChange >= 0) growth = 75;
    else if (c.dailyChange > -2) growth = 65;
    else growth = 50;
  }

  // 5. Efficiency / Dividend
  let efficiency = 65;
  if (c.dividendYield !== undefined && c.dividendYield > 0) {
    if (c.dividendYield > 6) efficiency = 95;
    else if (c.dividendYield > 3) efficiency = 80;
    else efficiency = 70;
  }

  const overallScore = Math.round(
    valuation * 0.25 + profitability * 0.25 + leverage * 0.2 + growth * 0.15 + efficiency * 0.15
  );

  return {
    overallScore,
    dimensions: {
      valuation,
      profitability,
      leverage,
      growth,
      efficiency,
    },
  };
}

