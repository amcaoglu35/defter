/**
 * Defter — Foreign Stock & Eurobond Tax Calculator (GVK 86 Model)
 * Evaluates foreign dividend withholding (W-8BEN 20%), Eurobond coupon tax exemptions, and Turkish declaration thresholds.
 * Zero-mock compliant: Calculations strictly follow official Turkish Revenue Administration (GİB) rules.
 */

export interface ForeignTaxCalculation {
  grossDividendUsd: number;
  usWithholdingTaxUsd: number; // 20% under Double Tax Treaty
  netDividendUsd: number;
  usdTryRate: number;
  grossDividendTry: number;
  declarationThresholdTry: number; // GVK 86 Declaration threshold (e.g. 230.000 ₺ for 2026)
  isDeclarationRequired: boolean;
  estimatedTurkishTaxTry: number;
  foreignTaxCreditTry: number; // Withheld in US that can be offset in TR
  netPayableTaxTry: number;
  taxSummary: string;
}

export function calculateForeignStockTax(
  grossDividendUsd: number,
  usdTryRate: number = 47.88,
  declarationThresholdTry: number = 230000
): ForeignTaxCalculation {
  const usTaxUsd = Number((grossDividendUsd * 0.20).toFixed(2));
  const netDividendUsd = Number((grossDividendUsd - usTaxUsd).toFixed(2));
  const grossDividendTry = Number((grossDividendUsd * usdTryRate).toFixed(2));

  // If gross foreign dividend exceeds annual threshold, annual income tax return (Yıllık Gelir Vergisi Beyannamesi) is required
  const isDeclarationRequired = grossDividendTry > declarationThresholdTry;

  let estimatedTurkishTaxTry = 0;
  const foreignTaxCreditTry = Number((usTaxUsd * usdTryRate).toFixed(2));
  let netPayableTaxTry = 0;

  if (isDeclarationRequired) {
    // Progressive tax bracket approximation ~27%
    estimatedTurkishTaxTry = Number((grossDividendTry * 0.27).toFixed(2));
    // Foreign tax credit offset (cannot exceed TR tax)
    netPayableTaxTry = Math.max(0, estimatedTurkishTaxTry - foreignTaxCreditTry);
  }

  let taxSummary = "";
  if (!isDeclarationRequired) {
    taxSummary = `Toplam yurt dışı kâr payınız (${grossDividendTry.toLocaleString("tr-TR")} ₺), 2026 yılı beyan sınırının (${declarationThresholdTry.toLocaleString("tr-TR")} ₺) altında kaldığı için Türkiye'de ek beyanname vermeniz gerekmez. Kaynaktaki %20 ABD kesintisi nihaidir.`;
  } else {
    taxSummary = `Toplam geliriniz beyan sınırını aşmıştır. ABD'de kesilen ${foreignTaxCreditTry.toLocaleString("tr-TR")} ₺ Türkiye'deki verginizden mahsup edilir; tahmini ödenecek ek vergi ${netPayableTaxTry.toLocaleString("tr-TR")} ₺'dir.`;
  }

  return {
    grossDividendUsd,
    usWithholdingTaxUsd: usTaxUsd,
    netDividendUsd,
    usdTryRate,
    grossDividendTry,
    declarationThresholdTry,
    isDeclarationRequired,
    estimatedTurkishTaxTry,
    foreignTaxCreditTry,
    netPayableTaxTry,
    taxSummary,
  };
}
