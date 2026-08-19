/**
 * Defter — Versiyonlanmış Türkiye Vergi ve Mevzuat Motoru (Tax Engine)
 *
 * GVK (Gelir Vergisi Kanunu) Geçici 67. Madde ve İlgili Mevzuat Kuralları:
 *
 * 1. BIST Hisse Senedi Kazançları:
 *    - Tam mükellef gerçek kişiler için borsa kazançlarında kaynakta stopaj oranı: %0.
 *
 * 2. TEFAS Yatırım Fonları (Cumhurbaşkanı Kararları Versiyonlaması):
 *    - Hisse Senedi Yoğun Fonlar (%80+ BIST hisse): %0 Stopaj.
 *    - Diğer Fonlar (Para Piyasası, Borçlanma, Değişken): %7.5 - %10 - %15 (Dönemsel stopaj).
 *
 * 3. Yabancı Hisse Senedi & Eurobond (GVK Madde 80 & 81):
 *    - Alış ve Satış tutarları işlem günündeki TCMB Döviz Alış Kuru ile TL'ye çevrilir.
 *    - Yİ-ÜFE Endekslemesi (GVK Mülga 81/Son Paragraf): Satış ayından önceki ayın Yİ-ÜFE'si
 *      ile Alış ayından önceki ayın Yİ-ÜFE'si arasındaki artış ≥ %10 ise TL maliyet endekslenerek yükseltilir.
 *    - Gelir Vergisi Tarifesi (%15 - %40 artan oranlı dilimler).
 *
 * 4. BIST Nakit Temettü Geliri (GVK Madde 22 & 86):
 *    - Kaynakta kesilen stopaj: %10 (Şirket dağıtırken keser, net = brüt * 0.90).
 *    - Beyanname Sınırı: Brüt temettünün yarısı (%50) istisnadır. Kalan yarısı yıllık
 *      beyanname sınırını (2025 için 230.000 TL) aşarsa beyan edilir, ödenen %10 stopaj mahsup edilir.
 */

export interface TaxConfig {
  /** Beyanname sınırı (2025/2026 yılı varsayılanı: 230,000 TL) */
  dividendDeclarationThresholdTl?: number;
  /** BIST temettü stopaj oranı (%) (varsayılan: 10.0) */
  bistDividendTaxRatePct?: number;
  /** ÜFE endeksleme şartı minimum artış oranı (%) (GVK 81 uyarınca %10.0) */
  producerPriceIndexMinThresholdPct?: number;
}

export interface ForeignStockTaxInput {
  symbol: string;
  buyDate: string;
  sellDate: string;
  quantity: number;
  buyPriceUsd: number;
  sellPriceUsd: number;
  buyTcmbUsdRate: number;  // Alış tarihindeki TCMB USD/TRY kuru
  sellTcmbUsdRate: number; // Satış tarihindeki TCMB USD/TRY kuru
  buyUfeIndex?: number;    // Alış dönemi Yİ-ÜFE endeksi
  sellUfeIndex?: number;   // Satış dönemi Yİ-ÜFE endeksi
}

export interface ForeignStockTaxResult {
  symbol: string;
  quantity: number;
  buyCostUsd: number;
  sellProceedsUsd: number;
  gainUsd: number;
  buyCostOriginalTl: number;
  sellProceedsTl: number;
  nominalGainTl: number;
  ufeInflationPct: number;
  isUfeApplied: boolean;
  indexedCostTl: number;
  taxableGainTl: number; // ÜFE endekslenmiş vergiye tabi net TL kâr
  estimatedIncomeTaxTl: number; // Artan oranlı gelir vergisi tahmini (%15-%40)
}

export interface DividendTaxInput {
  symbol: string;
  grossDividendTl: number;
  paymentDate: string;
}

export interface DividendTaxResult {
  symbol: string;
  grossDividendTl: number;
  withholdingTaxTl: number; // Kaynakta kesilen %10 stopaj
  netDividendReceivedTl: number; // Ele geçen net nakit (%90)
  exemptDividendTl: number; // GVK 22 uyarınca %50 istisna tutarı
  taxableDividendTl: number; // Yıllık beyanname hesabına giren tutar (%50)
  requiresDeclaration: boolean; // Yıllık beyannameye dahil edilmeli mi?
}

export interface AssetTaxSummary {
  symbol: string;
  assetClass: "hisse" | "maden" | "fon" | "doviz";
  capitalGainTl: number;
  withholdingTaxTl: number; // Kaynakta ödenen stopaj
  declarationTaxTl: number; // Beyanname ile ödenecek vergi
  netAfterTaxGainTl: number;
  taxRateEffectivePct: number;
  note: string;
}

const DEFAULT_TAX_CONFIG: Required<TaxConfig> = {
  dividendDeclarationThresholdTl: 230000.0,
  bistDividendTaxRatePct: 10.0,
  producerPriceIndexMinThresholdPct: 10.0,
};

/**
 * Türkiye 2025/2026 Gelir Vergisi Dilimleri tarifesine göre vergi hesaplar
 */
export function calculateTurkishIncomeTaxBracket(taxableIncomeTl: number): number {
  if (taxableIncomeTl <= 0) return 0;

  // 2025 Vergi Dilimleri:
  // 158.000 TL'ye kadar %15
  // 330.000 TL'nin 158.000 TL'si için 23.700 TL, fazlası %20
  // 800.000 TL'nin 330.000 TL'si için 58.100 TL, fazlası %27
  // 4.300.000 TL'nin 800.000 TL'si için 185.000 TL, fazlası %35
  // 4.300.000 TL üzeri fazlası %40
  let tax = 0;
  let rem = taxableIncomeTl;

  if (rem > 4300000) {
    tax += (rem - 4300000) * 0.40;
    rem = 4300000;
  }
  if (rem > 800000) {
    tax += (rem - 800000) * 0.35;
    rem = 800000;
  }
  if (rem > 330000) {
    tax += (rem - 330000) * 0.27;
    rem = 330000;
  }
  if (rem > 158000) {
    tax += (rem - 158000) * 0.20;
    rem = 158000;
  }
  tax += rem * 0.15;

  return Number(tax.toFixed(2));
}

/**
 * Yabancı Hisse Senedi ve Eurobond Alım-Satım Kazanç Vergisini Hesaplar (GVK Mülga 81 ÜFE Endekslemesi Dahil)
 */
export function calculateForeignStockTax(
  input: ForeignStockTaxInput,
  config: TaxConfig = {}
): ForeignStockTaxResult {
  const cfg = { ...DEFAULT_TAX_CONFIG, ...config };

  const buyCostUsd = input.quantity * input.buyPriceUsd;
  const sellProceedsUsd = input.quantity * input.sellPriceUsd;
  const gainUsd = sellProceedsUsd - buyCostUsd;

  const buyCostOriginalTl = buyCostUsd * input.buyTcmbUsdRate;
  const sellProceedsTl = sellProceedsUsd * input.sellTcmbUsdRate;
  const nominalGainTl = sellProceedsTl - buyCostOriginalTl;

  // ÜFE Endekslemesi: Satış ayından önceki ÜFE / Alış ayından önceki ÜFE
  let ufeInflationPct = 0;
  let isUfeApplied = false;
  let indexedCostTl = buyCostOriginalTl;

  if (input.buyUfeIndex && input.sellUfeIndex && input.buyUfeIndex > 0) {
    ufeInflationPct = ((input.sellUfeIndex - input.buyUfeIndex) / input.buyUfeIndex) * 100;
    if (ufeInflationPct >= cfg.producerPriceIndexMinThresholdPct) {
      isUfeApplied = true;
      indexedCostTl = buyCostOriginalTl * (1 + ufeInflationPct / 100);
    }
  }

  const taxableGainTl = Math.max(0, sellProceedsTl - indexedCostTl);
  const estimatedIncomeTaxTl = calculateTurkishIncomeTaxBracket(taxableGainTl);

  return {
    symbol: input.symbol.toUpperCase(),
    quantity: input.quantity,
    buyCostUsd: Number(buyCostUsd.toFixed(2)),
    sellProceedsUsd: Number(sellProceedsUsd.toFixed(2)),
    gainUsd: Number(gainUsd.toFixed(2)),
    buyCostOriginalTl: Number(buyCostOriginalTl.toFixed(2)),
    sellProceedsTl: Number(sellProceedsTl.toFixed(2)),
    nominalGainTl: Number(nominalGainTl.toFixed(2)),
    ufeInflationPct: Number(ufeInflationPct.toFixed(2)),
    isUfeApplied,
    indexedCostTl: Number(indexedCostTl.toFixed(2)),
    taxableGainTl: Number(taxableGainTl.toFixed(2)),
    estimatedIncomeTaxTl,
  };
}

/**
 * BIST Nakit Temettü Gelir Vergisini Hesaplar (GVK Madde 22/2 & 86/1-c)
 */
export function calculateBistDividendTax(
  input: DividendTaxInput,
  config: TaxConfig = {}
): DividendTaxResult {
  const cfg = { ...DEFAULT_TAX_CONFIG, ...config };
  const gross = Math.max(0, input.grossDividendTl);

  const withholdingTaxTl = gross * (cfg.bistDividendTaxRatePct / 100);
  const netDividendReceivedTl = gross - withholdingTaxTl;

  const exemptDividendTl = gross * 0.50; // Yarısı istisna
  const taxableDividendTl = gross * 0.50; // Kalan yarısı beyana tabi

  const requiresDeclaration = taxableDividendTl > cfg.dividendDeclarationThresholdTl;

  return {
    symbol: input.symbol.toUpperCase(),
    grossDividendTl: Number(gross.toFixed(2)),
    withholdingTaxTl: Number(withholdingTaxTl.toFixed(2)),
    netDividendReceivedTl: Number(netDividendReceivedTl.toFixed(2)),
    exemptDividendTl: Number(exemptDividendTl.toFixed(2)),
    taxableDividendTl: Number(taxableDividendTl.toFixed(2)),
    requiresDeclaration,
  };
}

/**
 * Yerli BIST Hisse veya TEFAS Fon Alım-Satım Kazanç Vergisini Hesaplar
 */
export function calculateDomesticAssetTax(
  symbol: string,
  assetClass: "hisse" | "fon" | "maden" | "doviz",
  capitalGainTl: number,
  isEquityFund: boolean = true
): AssetTaxSummary {
  let withholdingTaxRatePct = 0;
  let note = "";

  if (assetClass === "hisse") {
    // BIST Hisseleri %0 stopaj (GVK Geçici 67)
    withholdingTaxRatePct = 0;
    note = "BIST hisse senedi alım-satım kârı GVK Geçici 67 uyarınca %0 stopaja tabidir. Beyanname verilmez.";
  } else if (assetClass === "fon") {
    if (isEquityFund) {
      withholdingTaxRatePct = 0;
      note = "Hisse Senedi Yoğun Yatırım Fonu alım-satım kârı %0 stopaja tabidir. Beyanname verilmez.";
    } else {
      withholdingTaxRatePct = 7.5; // Dönemsel TEFAS fon stopajı
      note = "Diğer yatırım fonları (borçlanma/para piyasası) %7.5 stopaja tabidir. Kaynakta kesilir.";
    }
  } else {
    withholdingTaxRatePct = 0;
    note = "Kıymetli maden ve döviz işlemleri banka/kasa bazında kambiyo gider vergisine tabidir.";
  }

  const withholdingTaxTl = Math.max(0, capitalGainTl) * (withholdingTaxRatePct / 100);
  const netGain = capitalGainTl - withholdingTaxTl;

  return {
    symbol: symbol.toUpperCase(),
    assetClass,
    capitalGainTl: Number(capitalGainTl.toFixed(2)),
    withholdingTaxTl: Number(withholdingTaxTl.toFixed(2)),
    declarationTaxTl: 0,
    netAfterTaxGainTl: Number(netGain.toFixed(2)),
    taxRateEffectivePct: withholdingTaxRatePct,
    note,
  };
}
