/**
 * Defter — Kurumsal Portföy Yeniden Dengelenme ve İşlem Sürtünmesi Motoru (Rebalance Engine)
 *
 * Gerçekçi İşlem Maliyetleri & Sürtünme Takibi (Trading Friction):
 * 1. Aracı Kurum Komisyonu (BIST varsayılanı %0.15 veya kullanıcı ayarı)
 * 2. BSMV Vergisi (Komisyon tutarı üzerinden %5 BSMV kesintisi)
 * 3. Kayma / Slippage Maliyeti (Likidite ve emir büyüklüğüne göre %0.05 - %0.20 piyasa etki fiyatı)
 * 4. Asgari İşlem Eşiği (Küçük sürüklenmelerde boş yere komisyon yakmamak için minimum 250 ₺ veya %0.5 eşik)
 */

export interface RebalanceItemInput {
  symbol: string;
  currentQuantity: number;
  currentPrice: number;
  targetWeightPct: number; // 0..100 arası hedef ağırlık
}

export interface RebalanceConfig {
  /** Aracı kurum komisyon oranı (%) (varsayılan: 0.15) */
  commissionRatePct?: number;
  /** Komisyon üzerinden BSMV oranı (%) (varsayılan: 5.0) */
  bsmvRatePct?: number;
  /** Tahmini ortalama kayma / slippage oranı (%) (varsayılan: 0.10) */
  slippagePct?: number;
  /** Minimum işlem eşiği (TL) - Bu tutarın altındaki alış/satış emirleri pas geçilir (varsayılan: 250 TL) */
  minTradeAmountTl?: number;
  /** Minimum ağırlık sapması eşiği (%) - örn: %0.5'ten az kaymalar göz ardı edilir */
  minDriftPct?: number;
}

export interface RebalanceOrder {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  currentQuantity: number;
  targetQuantity: number;
  tradeQuantity: number;
  price: number;
  grossAmountTl: number;
  commissionTl: number;
  bsmvTl: number;
  slippageCostTl: number;
  totalFrictionCostTl: number;
  netAmountTl: number;
  currentWeightPct: number;
  targetWeightPct: number;
  postRebalanceWeightPct: number;
  isIgnoredDueToThreshold: boolean;
}

export interface RebalanceSummaryResult {
  orders: RebalanceOrder[];
  totalPortfolioValueBeforeTl: number;
  totalPortfolioValueAfterTl: number;
  totalTurnoverAmountTl: number;
  totalTurnoverPct: number;
  totalCommissionTl: number;
  totalBsmvTl: number;
  totalSlippageCostTl: number;
  totalFrictionCostsTl: number;
  frictionCostPctOfPortfolio: number;
  ignoredOrdersCount: number;
  executedOrdersCount: number;
}

const DEFAULT_REBALANCE_CONFIG: Required<RebalanceConfig> = {
  commissionRatePct: 0.15,
  bsmvRatePct: 5.0,
  slippagePct: 0.10,
  minTradeAmountTl: 250.0,
  minDriftPct: 0.5,
};

/**
 * Portföy Yeniden Dengeleme ve Komisyon/Sürtünme Hesaplar
 *
 * @param items Mevcut pozisyonlar ve hedef ağırlıklar
 * @param cashBalanceTl Portföydeki serbest nakit (TL)
 * @param config Komisyon, BSMV ve kayma parametreleri
 */
export function calculateRebalanceOrders(
  items: RebalanceItemInput[],
  cashBalanceTl: number = 0,
  config: RebalanceConfig = {}
): RebalanceSummaryResult {
  const cfg = { ...DEFAULT_REBALANCE_CONFIG, ...config };

  // 1. Toplam Portföy Değeri (Varlıklar + Nakit)
  const holdingsValue = items.reduce(
    (sum, item) => sum + Math.max(0, item.currentQuantity) * Math.max(0, item.currentPrice),
    0
  );
  const totalPortfolioValueBeforeTl = holdingsValue + Math.max(0, cashBalanceTl);

  if (totalPortfolioValueBeforeTl <= 0 || items.length === 0) {
    return {
      orders: [],
      totalPortfolioValueBeforeTl: 0,
      totalPortfolioValueAfterTl: 0,
      totalTurnoverAmountTl: 0,
      totalTurnoverPct: 0,
      totalCommissionTl: 0,
      totalBsmvTl: 0,
      totalSlippageCostTl: 0,
      totalFrictionCostsTl: 0,
      frictionCostPctOfPortfolio: 0,
      ignoredOrdersCount: 0,
      executedOrdersCount: 0,
    };
  }

  // 2. Hedef Ağırlıkları Normalize Et (Toplam = %100)
  const targetSum = items.reduce((sum, item) => sum + Math.max(0, item.targetWeightPct), 0) || 100;

  const orders: RebalanceOrder[] = [];
  let totalTurnoverAmountTl = 0;
  let totalCommissionTl = 0;
  let totalBsmvTl = 0;
  let totalSlippageCostTl = 0;
  let totalFrictionCostsTl = 0;

  let ignoredOrdersCount = 0;
  let executedOrdersCount = 0;

  for (const item of items) {
    const symbol = item.symbol.toUpperCase();
    const price = Math.max(0, item.currentPrice);
    const currQty = Math.max(0, item.currentQuantity);
    const currVal = currQty * price;
    const currWeightPct = (currVal / totalPortfolioValueBeforeTl) * 100;

    const normTargetWeightPct = (Math.max(0, item.targetWeightPct) / targetSum) * 100;
    const targetVal = (normTargetWeightPct / 100) * totalPortfolioValueBeforeTl;

    const rawTargetQty = price > 0 ? targetVal / price : 0;
    const targetQuantity = Math.round(rawTargetQty);

    const qtyDiff = targetQuantity - currQty;
    const absQtyDiff = Math.abs(qtyDiff);
    const grossTradeVal = absQtyDiff * price;
    const driftPct = Math.abs(normTargetWeightPct - currWeightPct);

    // Eşik Kontrolü: İşlem tutarı < minTradeAmountTl VEYA ağırlık sapması < minDriftPct
    const isIgnored =
      absQtyDiff === 0 ||
      grossTradeVal < cfg.minTradeAmountTl ||
      driftPct < cfg.minDriftPct;

    let action: "BUY" | "SELL" | "HOLD" = "HOLD";
    if (!isIgnored) {
      action = qtyDiff > 0 ? "BUY" : "SELL";
    }

    // Komisyon & BSMV & Slippage Hesabı
    let commission = 0;
    let bsmv = 0;
    let slippage = 0;
    let totalFriction = 0;
    let netAmount = 0;

    if (action !== "HOLD") {
      commission = grossTradeVal * (cfg.commissionRatePct / 100);
      bsmv = commission * (cfg.bsmvRatePct / 100);
      slippage = grossTradeVal * (cfg.slippagePct / 100);
      totalFriction = commission + bsmv + slippage;

      // Alımda toplam harcama = Hasılat + Komisyon + BSMV + Slippage
      // Satışta ele geçen net = Hasılat - Komisyon - BSMV - Slippage
      netAmount = action === "BUY" ? grossTradeVal + totalFriction : grossTradeVal - totalFriction;

      totalTurnoverAmountTl += grossTradeVal;
      totalCommissionTl += commission;
      totalBsmvTl += bsmv;
      totalSlippageCostTl += slippage;
      totalFrictionCostsTl += totalFriction;
      executedOrdersCount++;
    } else if (isIgnored && absQtyDiff > 0) {
      ignoredOrdersCount++;
    }

    const postQty = action !== "HOLD" ? targetQuantity : currQty;
    const postVal = postQty * price;
    const postRebalanceWeightPct = (postVal / totalPortfolioValueBeforeTl) * 100;

    orders.push({
      symbol,
      action,
      currentQuantity: currQty,
      targetQuantity,
      tradeQuantity: absQtyDiff,
      price,
      grossAmountTl: Number(grossTradeVal.toFixed(2)),
      commissionTl: Number(commission.toFixed(2)),
      bsmvTl: Number(bsmv.toFixed(2)),
      slippageCostTl: Number(slippage.toFixed(2)),
      totalFrictionCostTl: Number(totalFriction.toFixed(2)),
      netAmountTl: Number(netAmount.toFixed(2)),
      currentWeightPct: Number(currWeightPct.toFixed(2)),
      targetWeightPct: Number(normTargetWeightPct.toFixed(2)),
      postRebalanceWeightPct: Number(postRebalanceWeightPct.toFixed(2)),
      isIgnoredDueToThreshold: isIgnored,
    });
  }

  const totalPortfolioValueAfterTl = totalPortfolioValueBeforeTl - totalFrictionCostsTl;
  const totalTurnoverPct = (totalTurnoverAmountTl / totalPortfolioValueBeforeTl) * 100;
  const frictionCostPctOfPortfolio = (totalFrictionCostsTl / totalPortfolioValueBeforeTl) * 100;

  return {
    orders,
    totalPortfolioValueBeforeTl: Number(totalPortfolioValueBeforeTl.toFixed(2)),
    totalPortfolioValueAfterTl: Number(totalPortfolioValueAfterTl.toFixed(2)),
    totalTurnoverAmountTl: Number(totalTurnoverAmountTl.toFixed(2)),
    totalTurnoverPct: Number(totalTurnoverPct.toFixed(2)),
    totalCommissionTl: Number(totalCommissionTl.toFixed(2)),
    totalBsmvTl: Number(totalBsmvTl.toFixed(2)),
    totalSlippageCostTl: Number(totalSlippageCostTl.toFixed(2)),
    totalFrictionCostsTl: Number(totalFrictionCostsTl.toFixed(2)),
    frictionCostPctOfPortfolio: Number(frictionCostPctOfPortfolio.toFixed(2)),
    ignoredOrdersCount,
    executedOrdersCount,
  };
}

export interface RebalanceRecommendation {
  symbol: string;
  name: string;
  currentWeightPct: number;
  targetWeightPct: number;
  driftPct: number;
  action: "AL" | "SAT" | "DENGEDE";
  suggestedLots: number;
  differenceValue: number;
}

export interface PortfolioRebalancingData {
  recommendations: RebalanceRecommendation[];
  totalCurrentValue: number;
  isRebalanceNeeded: boolean;
}

/**
 * Basket ve Company[] verilerini RebalanceModal arayüzü için dönüştürür.
 */
export function computePortfolioRebalancing(
  basket?: { holdings: Array<{ companySymbol: string; weightPercent?: number; quantity?: number; amountBought?: number }> } | null,
  companies: Array<{ symbol: string; name: string; price: number }> = []
): PortfolioRebalancingData {
  if (!basket || !basket.holdings || basket.holdings.length === 0) {
    return { recommendations: [], totalCurrentValue: 0, isRebalanceNeeded: false };
  }

  const inputs: RebalanceItemInput[] = basket.holdings.map((h) => {
    const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
    const price = co?.price || (h as { currentPrice?: number }).currentPrice || (h as { avgCost?: number }).avgCost || 0;
    const qty = h.quantity || (h.amountBought && price > 0 ? h.amountBought / price : 0);
    return {
      symbol: h.companySymbol.toUpperCase(),
      currentQuantity: qty,
      currentPrice: price,
      targetWeightPct: h.weightPercent || (100 / basket.holdings.length),
    };
  });

  const summary = calculateRebalanceOrders(inputs);
  let isRebalanceNeeded = false;

  const recommendations: RebalanceRecommendation[] = summary.orders.map((o) => {
    const co = companies.find((c) => c.symbol.toUpperCase() === o.symbol);
    const driftPct = Number((o.currentWeightPct - o.targetWeightPct).toFixed(1));
    if (Math.abs(driftPct) >= 2.0 && o.action !== "HOLD") {
      isRebalanceNeeded = true;
    }

    const actionText: "AL" | "SAT" | "DENGEDE" =
      o.action === "BUY" ? "AL" : o.action === "SELL" ? "SAT" : "DENGEDE";

    const diffValue = (o.targetQuantity - o.currentQuantity) * o.price;

    return {
      symbol: o.symbol,
      name: co?.name || o.symbol,
      currentWeightPct: o.currentWeightPct,
      targetWeightPct: o.targetWeightPct,
      driftPct,
      action: actionText,
      suggestedLots: o.tradeQuantity,
      differenceValue: Number(diffValue.toFixed(2)),
    };
  });

  return {
    recommendations,
    totalCurrentValue: summary.totalPortfolioValueBeforeTl,
    isRebalanceNeeded,
  };
}

