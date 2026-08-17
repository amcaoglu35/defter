/**
 * Defter — Portfolio Rebalancing & Order Recommendation Engine
 * Computes divergence between actual market weights and target asset weights.
 * Generates deterministic buy/sell order suggestions to minimize drift.
 */

import { Basket, Company } from "./mockData";

export interface RebalanceRecommendation {
  symbol: string;
  name: string;
  currentWeightPct: number;
  targetWeightPct: number;
  driftPct: number;
  currentValue: number;
  targetValue: number;
  differenceValue: number;
  action: "AL" | "SAT" | "DENGEDE";
  suggestedLots: number;
  price: number;
}

export function computePortfolioRebalancing(
  basket: Basket,
  companies: Company[]
): {
  recommendations: RebalanceRecommendation[];
  totalCurrentValue: number;
  isRebalanceNeeded: boolean;
} {
  const totalValue = basket.totalValue || basket.holdings.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0);
  if (totalValue <= 0 || basket.holdings.length === 0) {
    return { recommendations: [], totalCurrentValue: 0, isRebalanceNeeded: false };
  }

  const targetWeightPerAsset = 100 / basket.holdings.length; // Equal weight default or user defined
  let maxDrift = 0;

  const recommendations: RebalanceRecommendation[] = basket.holdings.map((h) => {
    const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
    const price = co?.price || h.currentPrice || 100;
    const holdingValue = h.quantity * price;
    const currentWeightPct = Number(((holdingValue / totalValue) * 100).toFixed(1));
    const targetWeightPct = h.weightPercent || targetWeightPerAsset;
    const driftPct = Number((currentWeightPct - targetWeightPct).toFixed(1));

    if (Math.abs(driftPct) > maxDrift) maxDrift = Math.abs(driftPct);

    const targetValue = (targetWeightPct / 100) * totalValue;
    const diffValue = targetValue - holdingValue; // positive = need to buy, negative = need to sell
    const suggestedLots = price > 0 ? Math.round(Math.abs(diffValue) / price) : 0;

    let action: RebalanceRecommendation["action"] = "DENGEDE";
    if (driftPct < -2.0 && suggestedLots > 0) action = "AL";
    else if (driftPct > 2.0 && suggestedLots > 0) action = "SAT";

    return {
      symbol: h.companySymbol,
      name: co?.name || h.companySymbol,
      currentWeightPct,
      targetWeightPct,
      driftPct,
      currentValue: Math.round(holdingValue),
      targetValue: Math.round(targetValue),
      differenceValue: Math.round(diffValue),
      action,
      suggestedLots,
      price,
    };
  });

  return {
    recommendations,
    totalCurrentValue: totalValue,
    isRebalanceNeeded: maxDrift >= 3.0,
  };
}
