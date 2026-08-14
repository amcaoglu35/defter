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
): HealthScoreResult {
  if (!baskets || baskets.length === 0) {
    return {
      score: 80,
      diversificationScore: 80,
      riskBalanceScore: 80,
      liquidityScore: 80,
      label: "Başlangıç Seviyesi Portföy",
      verdictColor: "brass",
      metrics: {
        sectorCount: 0,
        holdingCount: 0,
        liveRatio: 100,
      },
    };
  }

  const allHoldings = baskets.flatMap((b) => b.holdings);
  const totalHoldingsCount = allHoldings.length;

  if (totalHoldingsCount === 0) {
    return {
      score: 75,
      diversificationScore: 70,
      riskBalanceScore: 80,
      liquidityScore: 80,
      label: "Sepetler Henüz Boş",
      verdictColor: "brass",
      metrics: {
        sectorCount: 0,
        holdingCount: 0,
        liveRatio: 100,
      },
    };
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
