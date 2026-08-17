export interface TaxCalculationParams {
  assetType: "BIST_HISSE" | "ABD_HISSE" | "TEFAS_HISSE_FON" | "TEFAS_BORCLANMA_FON" | "DOVIZ_EMTIA";
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  commissionRatePercent?: number; // e.g., 0.1 for on binde 10 (%0.1)
  exchangeRateUsdTry?: number;
}

export interface TaxCalculationResult {
  totalInvestment: number;
  grossProceeds: number;
  grossProfit: number;
  grossReturnPct: number;
  buyCommission: number;
  sellCommission: number;
  totalCommission: number;
  bsmv: number; // 5% of commission
  withholdingTax: number; // Stopaj
  withholdingTaxRatePct: number;
  totalCosts: number;
  netProfit: number;
  netReturnPct: number;
  summaryText: string;
}

/**
 * Calculates net return after brokerage commission, BSMV (Banka ve Sigorta Muameleleri Vergisi),
 * and asset-specific withholding taxes (Stopaj).
 */
export function calculateNetReturn(params: TaxCalculationParams): TaxCalculationResult {
  const {
    assetType,
    buyPrice,
    sellPrice,
    quantity,
    commissionRatePercent = 0.1, // default 0.1% (on binde 10)
  } = params;

  const totalInvestment = buyPrice * quantity;
  const grossProceeds = sellPrice * quantity;
  const grossProfit = grossProceeds - totalInvestment;
  const grossReturnPct = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;

  // Brokerage Commission
  const rateFraction = commissionRatePercent / 100;
  const buyCommission = totalInvestment * rateFraction;
  const sellCommission = grossProceeds * rateFraction;
  const totalCommission = buyCommission + sellCommission;

  // BSMV is 5% levied exclusively on the financial service / brokerage commission
  const bsmv = totalCommission * 0.05;

  // Withholding Tax (Stopaj)
  let withholdingTaxRatePct = 0;
  if (assetType === "BIST_HISSE" || assetType === "TEFAS_HISSE_FON") {
    // BIST Equities & Turkish Equity Umbrella Funds enjoy 0% Stopaj
    withholdingTaxRatePct = 0;
  } else if (assetType === "TEFAS_BORCLANMA_FON") {
    // Fixed income / money market funds have temporary stopaj (e.g. 7.5% - 10%)
    withholdingTaxRatePct = 10.0;
  } else if (assetType === "ABD_HISSE") {
    // US Capital gains are subject to annual declaration rather than automated local withholding
    withholdingTaxRatePct = 0; // Beyana tabi
  } else if (assetType === "DOVIZ_EMTIA") {
    withholdingTaxRatePct = 0;
  }

  const taxableProfit = Math.max(0, grossProfit);
  const withholdingTax = (taxableProfit * withholdingTaxRatePct) / 100;

  const totalCosts = totalCommission + bsmv + withholdingTax;
  const netProfit = grossProfit - totalCosts;
  const netReturnPct = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  let summaryText = "";
  if (assetType === "BIST_HISSE") {
    summaryText = "BIST hisse senedi alım-satım kazançlarında stopaj %0'dır. Yalnızca aracı kurum komisyonu ve komisyon üzerinden %5 BSMV kesilir.";
  } else if (assetType === "TEFAS_HISSE_FON") {
    summaryText = "Portföyünün en az %80'i hisse senedi olan yerli TEFAS fonlarında stopaj %0 olarak uygulanır.";
  } else if (assetType === "TEFAS_BORCLANMA_FON") {
    summaryText = "Borçlanma araçları ve para piyasası fonlarında kâr üzerinden %10 stopaj kaynağında kesilir.";
  } else if (assetType === "ABD_HISSE") {
    summaryText = "Yabancı hisse senedi alım-satım kazançları yıllık gelir vergisi beyannamesine tabidir.";
  }

  return {
    totalInvestment: Number(totalInvestment.toFixed(2)),
    grossProceeds: Number(grossProceeds.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    grossReturnPct: Number(grossReturnPct.toFixed(2)),
    buyCommission: Number(buyCommission.toFixed(2)),
    sellCommission: Number(sellCommission.toFixed(2)),
    totalCommission: Number(totalCommission.toFixed(2)),
    bsmv: Number(bsmv.toFixed(2)),
    withholdingTax: Number(withholdingTax.toFixed(2)),
    withholdingTaxRatePct,
    totalCosts: Number(totalCosts.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    netReturnPct: Number(netReturnPct.toFixed(2)),
    summaryText,
  };
}
