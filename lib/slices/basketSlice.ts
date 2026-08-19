/**
 * Defter — Domain Slice: Basket & Holding Operations
 */

import { Basket, BasketHolding, Company } from "../mockData";

export function recalculateBasketTotals(
  basket: Basket,
  companies: Company[]
): Basket {
  let totalVal = 0;
  let totalCost = 0;

  const holdings = basket.holdings.map((h) => {
    const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
    const price = co?.price ?? h.currentPrice ?? h.avgCost;
    const qty = Math.max(0, h.quantity);
    const val = qty * price;
    const cost = qty * h.avgCost;

    totalVal += val;
    totalCost += cost;

    return {
      ...h,
      currentPrice: price,
      quantity: qty,
    };
  });

  const totalProfit = totalVal - totalCost;
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  return {
    ...basket,
    totalValue: Number(totalVal.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    totalProfitPercent: Number(totalProfitPercent.toFixed(2)),
    holdings,
  };
}

export function addHoldingToBasket(
  basket: Basket,
  newHolding: BasketHolding
): Basket {
  const existingIdx = basket.holdings.findIndex(
    (h) => h.companySymbol.toUpperCase() === newHolding.companySymbol.toUpperCase()
  );

  let updatedHoldings: BasketHolding[];
  if (existingIdx >= 0) {
    const existing = basket.holdings[existingIdx];
    const combinedQty = (existing.quantity ?? 0) + (newHolding.quantity ?? 0);
    const combinedCost = (existing.quantity * existing.avgCost) + (newHolding.quantity * newHolding.avgCost);
    const avgCost = combinedQty > 0 ? combinedCost / combinedQty : existing.avgCost;

    updatedHoldings = [...basket.holdings];
    updatedHoldings[existingIdx] = {
      ...existing,
      quantity: combinedQty,
      avgCost: Number(avgCost.toFixed(4)),
      currentPrice: newHolding.currentPrice || existing.currentPrice,
      weightPercent: existing.weightPercent + newHolding.weightPercent,
    };
  } else {
    updatedHoldings = [...basket.holdings, newHolding];
  }

  return {
    ...basket,
    holdings: updatedHoldings,
  };
}

export function removeHoldingFromBasket(
  basket: Basket,
  symbol: string
): Basket {
  return {
    ...basket,
    holdings: basket.holdings.filter(
      (h) => h.companySymbol.toUpperCase() !== symbol.toUpperCase()
    ),
  };
}
