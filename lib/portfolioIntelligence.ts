import { Basket, Company } from "@/lib/mockData";

export interface PortfolioAssetHolding {
  symbol: string;
  name: string;
  category: string;
  exchange?: string;
  sector?: string;
  totalQuantity: number;
  totalCost: number;
  currentPrice: number;
  totalCurrentValue: number;
  unrealizedProfitLoss: number;
  unrealizedProfitLossPct: number;
  weightPct: number;
  currency: string;
  dividendYield?: number;
  change24h?: number;
}

export interface PortfolioXRayData {
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPct: number;
  assetCount: number;
  hhiScore: number; // Herfindahl-Hirschman Index (0-10000)
  diversificationLevel: "Düşük" | "Orta" | "Mükemmel";
  byCategory: Array<{ name: string; value: number; percentage: number; color: string }>;
  bySector: Array<{ name: string; value: number; percentage: number }>;
  byCurrency: Array<{ name: string; value: number; percentage: number }>;
  holdings: PortfolioAssetHolding[];
}

export const CATEGORY_COLORS: Record<string, string> = {
  hisse: "#10b981", // zümrüt yeşili
  global: "#3b82f6", // mavi
  maden: "#f59e0b", // kehribar
  fon: "#8b5cf6", // mor
  doviz: "#06b6d4", // camgöbeği
  kripto: "#ec4899", // pembe
  diger: "#6b7280",
};

/**
 * Kullanıcının tüm sepetlerini birleştirerek tek bir konsolide portföy kütüğü oluşturur.
 */
export function calculateConsolidatedPortfolio(
  baskets: Basket[],
  companies: Company[]
): PortfolioXRayData {
  const holdingsMap = new Map<string, { quantity: number; cost: number }>();

  // Tüm sepetlerdeki varlıkları konsolide et
  baskets.forEach((b) => {
    b.holdings?.forEach((h) => {
      const sym = (h.companySymbol || "").toUpperCase();
      if (!sym) return;
      const existing = holdingsMap.get(sym) || { quantity: 0, cost: 0 };
      const currentQty = h.quantity || 0;
      const currentCost = (h.avgCost || 0) * currentQty;
      holdingsMap.set(sym, {
        quantity: existing.quantity + currentQty,
        cost: existing.cost + currentCost,
      });
    });
  });

  const companyMap = new Map<string, Company>(
    companies.map((c) => [c.symbol.toUpperCase(), c])
  );

  let totalValue = 0;
  let totalCost = 0;
  const rawHoldings: Array<Omit<PortfolioAssetHolding, "weightPct">> = [];

  holdingsMap.forEach((data, sym) => {
    if (data.quantity <= 0) return;
    const company = companyMap.get(sym);
    const currentPrice = company?.price || (data.cost / (data.quantity || 1));
    const currentValue = data.quantity * currentPrice;
    const pl = currentValue - data.cost;
    const plPct = data.cost > 0 ? (pl / data.cost) * 100 : 0;

    totalValue += currentValue;
    totalCost += data.cost;

    rawHoldings.push({
      symbol: sym,
      name: company?.name || sym,
      category: company?.assetClass || "hisse",
      exchange: company?.exchange || (company?.assetClass === "maden" ? "Emtia" : company?.assetClass === "doviz" ? "Döviz" : "BIST"),
      sector: company?.sector || "Genel / Tanımsız",
      totalQuantity: data.quantity,
      totalCost: data.cost,
      currentPrice,
      totalCurrentValue: currentValue,
      unrealizedProfitLoss: pl,
      unrealizedProfitLossPct: plPct,
      currency: company?.currency || "₺",
      dividendYield: company?.dividendYield,
      change24h: company?.dailyChange || 0,
    });
  });

  // Ağırlıkları ve HHI skorunu hesapla
  let hhi = 0;
  const holdings: PortfolioAssetHolding[] = rawHoldings.map((h) => {
    const weightPct = totalValue > 0 ? (h.totalCurrentValue / totalValue) * 100 : 0;
    hhi += Math.pow(weightPct, 2);
    return { ...h, weightPct };
  });

  // Sırala (en yüksek ağırlıktan en düşüğe)
  holdings.sort((a, b) => b.totalCurrentValue - a.totalCurrentValue);

  // Kategori Bazlı Dağılım
  const catMap = new Map<string, number>();
  const sectorMap = new Map<string, number>();
  const curMap = new Map<string, number>();

  holdings.forEach((h) => {
    catMap.set(h.category, (catMap.get(h.category) || 0) + h.totalCurrentValue);
    const sec = h.sector || "Genel";
    sectorMap.set(sec, (sectorMap.get(sec) || 0) + h.totalCurrentValue);
    const cur = h.currency || "₺";
    curMap.set(cur, (curMap.get(cur) || 0) + h.totalCurrentValue);
  });

  const byCategory = Array.from(catMap.entries()).map(([name, val]) => ({
    name: name.toUpperCase(),
    value: val,
    percentage: totalValue > 0 ? (val / totalValue) * 100 : 0,
    color: CATEGORY_COLORS[name.toLowerCase()] || CATEGORY_COLORS.diger,
  })).sort((a, b) => b.value - a.value);

  const bySector = Array.from(sectorMap.entries()).map(([name, val]) => ({
    name,
    value: val,
    percentage: totalValue > 0 ? (val / totalValue) * 100 : 0,
  })).sort((a, b) => b.value - a.value);

  const byCurrency = Array.from(curMap.entries()).map(([name, val]) => ({
    name,
    value: val,
    percentage: totalValue > 0 ? (val / totalValue) * 100 : 0,
  })).sort((a, b) => b.value - a.value);

  // Çeşitlendirme Seviyesi (HHI: < 1500 Mükemmel, 1500-2500 Orta, > 2500 Yüksek Yoğunlaşma/Düşük Çeşitlilik)
  let diversificationLevel: "Düşük" | "Orta" | "Mükemmel" = "Mükemmel";
  if (hhi > 2500) diversificationLevel = "Düşük";
  else if (hhi > 1500) diversificationLevel = "Orta";

  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPct = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalProfitLoss,
    totalProfitLossPct,
    assetCount: holdings.length,
    hhiScore: Math.round(hhi),
    diversificationLevel,
    byCategory,
    bySector,
    byCurrency,
    holdings,
  };
}

/**
 * FIRE (Finansal Özgürlük) Hesaplama Motoru
 */
export function calculateFireMetrics({
  currentPortfolioValue,
  monthlyExpenses,
  monthlySavings,
  expectedRealReturnRate = 6, // Enflasyon üstü %6 yıllık reel getiri varsayımı
  safeWithdrawalRate = 4, // 4% Kuralı
}: {
  currentPortfolioValue: number;
  monthlyExpenses: number;
  monthlySavings: number;
  expectedRealReturnRate?: number;
  safeWithdrawalRate?: number;
}) {
  const annualExpenses = monthlyExpenses * 12;
  const targetFireNumber = safeWithdrawalRate > 0 ? annualExpenses / (safeWithdrawalRate / 100) : 0;
  const progressPct = targetFireNumber > 0 ? Math.min(100, (currentPortfolioValue / targetFireNumber) * 100) : 0;

  // Emekliliğe Kalan Ay Sayısı (Bileşik Faiz Gelecek Değer Formülü)
  const monthlyRate = (expectedRealReturnRate / 100) / 12;
  let monthsToFire = 0;
  let simulatedValue = currentPortfolioValue;

  if (simulatedValue >= targetFireNumber) {
    monthsToFire = 0;
  } else if (monthlySavings <= 0 && monthlyRate <= 0) {
    monthsToFire = 999;
  } else {
    while (simulatedValue < targetFireNumber && monthsToFire < 600) {
      simulatedValue = simulatedValue * (1 + monthlyRate) + monthlySavings;
      monthsToFire++;
    }
  }

  const yearsToFire = parseFloat((monthsToFire / 12).toFixed(1));

  return {
    targetFireNumber,
    progressPct,
    yearsToFire,
    monthsToFire,
    annualExpenses,
    currentAnnualSafeIncome: currentPortfolioValue * (safeWithdrawalRate / 100),
    monthlySafeIncome: (currentPortfolioValue * (safeWithdrawalRate / 100)) / 12,
  };
}

/**
 * DRIP (Temettü Yeniden Yatırım) Kartopu Simülatörü
 */
export function calculateDripProjection({
  initialInvestment,
  annualDividendYield = 5.5,
  annualCapitalGrowth = 8,
  annualDividendGrowth = 7,
  years = 15,
}: {
  initialInvestment: number;
  annualDividendYield?: number;
  annualCapitalGrowth?: number;
  annualDividendGrowth?: number;
  years?: number;
}) {
  const data = [];
  let withDripValue = initialInvestment;
  let withoutDripValue = initialInvestment;
  let currentYield = annualDividendYield / 100;
  let totalDripDividends = 0;
  let totalNoDripDividends = 0;

  for (let year = 1; year <= years; year++) {
    // DRIP Olmadan
    const noDripDiv = withoutDripValue * currentYield;
    totalNoDripDividends += noDripDiv;
    withoutDripValue = withoutDripValue * (1 + annualCapitalGrowth / 100);

    // DRIP İle (Temettü ana paraya eklenir)
    const dripDiv = withDripValue * currentYield;
    totalDripDividends += dripDiv;
    withDripValue = (withDripValue + dripDiv) * (1 + annualCapitalGrowth / 100);

    // Temettü büyümesi
    currentYield = currentYield * (1 + annualDividendGrowth / 100);

    data.push({
      year: `Yıl ${year}`,
      withDrip: Math.round(withDripValue),
      withoutDrip: Math.round(withoutDripValue),
      totalDividendsReinvested: Math.round(totalDripDividends),
      yearlyDripDividend: Math.round(dripDiv),
    });
  }

  return {
    projection: data,
    finalWithDrip: Math.round(withDripValue),
    finalWithoutDrip: Math.round(withoutDripValue),
    multiplier: parseFloat((withDripValue / (withoutDripValue || 1)).toFixed(2)),
  };
}
