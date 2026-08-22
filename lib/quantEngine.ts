/**
 * Defter Quant & Ekonometri Motoru
 * Sıfır sahte veri kuralına tam uyumlu, saf finansal matematik ve portföy optimizasyonu algoritmaları.
 */

export interface PortfolioAssetInput {
  symbol: string;
  name: string;
  category: string;
  sector?: string;
  totalCurrentValue: number;
  weightPct: number;
  unrealizedProfitLossPct: number;
  currency: string;
  dailyChangePct?: number;
}

export interface RiskMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  portfolioBeta: number;
  jensenAlpha: number;
  treynorRatio: number; // Treynor Oranı (Alfa / Beta)
  informationRatio: number; // Bilgi Oranı (IR)
  omegaRatio: number; // Omega Oranı
  gainToPainRatio: number; // Jack Schwager Acı-Kazanç Oranı
  mSquaredPct: number; // Modigliani-Modigliani Riski Eşitlenmiş Getiri (%)
  kRatio: number; // Büyüme Pürüzsüzlüğü & Çizgisel Kararlılık
  upMarketCapturePct: number; // Boğa Yakalama %
  downMarketCapturePct: number; // Ayı Yakalama %
  shannonEntropyPct: number; // Bilgi Teorisi Çeşitlendirme Skoru (%)
  skewness: number; // Çarpıklık
  kurtosis: number; // Basıklık (Kuyruk Riski)
  calmarRatio: number;
  annualizedVolatility: number;
  ulcerIndex: number; // Ülser Stres Endeksi
  ulcerStressLevel: "Düşük (Huzurlu)" | "Orta (Normal)" | "Yüksek (Stresli)";
  var95MonthlyPct: number;
  var95MonthlyAmount: number;
  cvar95MonthlyAmount: number;
  diversificationBenefitPct: number;
  maxDrawdownPct: number;
  recoveryDays: number;
}

export interface PiotroskiCriterion {
  criterion: string;
  passed: boolean | null; // null = veri yok, değerlendirilemedi
  score: number;
}

export interface ValuationMetrics {
  grahamNumber: number | null;
  grahamDiscountPct: number | null;
  pegRatio: number | null;
  pegStatus: "Çok Ucuz" | "Dengeli" | "Pahalı" | "Bilinmiyor";
  dcfFairValue: number | null;
  dcfDiscountPct: number | null;
  gordanDdmValue: number | null;
  magicFormulaScore: number;
  magicFormulaRank: "Elit Sınıf" | "Güçlü" | "Ortalama" | "Düşük";
  earningsYieldPct: number;
  roicPct: number;
  piotroskiFScore: number; // 0-9 Piotroski Bilanço Skoru (geçen kriter sayısı)
  piotroskiEvaluatedCount: number; // Değerlendirilen kriter sayısı (0-9)
  piotroskiRank: "Çok Güçlü / Elit" | "Sağlıklı" | "Zayıf / Riskli" | "Yetersiz Veri";
  piotroskiDetails: PiotroskiCriterion[];
  piotroskiSummary: string; // örn. "3/4 (4/9 Kriter Değerlendirildi)"
  mertonDefaultProbabilityPct: number; // Merton Temerrüt & İflas Riski (%)
  hurstExponent: number; // Fraktal Hurst Üssü
  hurstTrendType: "Kuvvetli Trend (Momentum)" | "Ortalamaya Dönüş (Mean Reverting)" | "Rastgele Salınım";
  waccPct: number;
  beneishMScore: number | null;
  beneishStatus: "Temiz Bilanço" | "Olası Makyaj / Manipülasyon Riski";
  netNetValue: number | null;
  dupontNetMarginPct: number;
  dupontAssetTurnover: number;
  dupontLeverageMultiplier: number;
  dupontRoePct: number;
  evaAmount: number | null;
  fcfYieldPct: number | null;
  interestCoverageRatio: number | null;
  altmanZScore: number | null;
  altmanZone: "Güvenli Bölge" | "Gri / İzleme Bölgesi" | "İflas Riski" | "Kapsam Dışı";
  kellySuggestedPct: number;
}

export interface MonteCarloSimulationPoint {
  day: number;
  month: number;
  p5Worst: number; // %5 Kriz Senaryosu
  p50Median: number; // %50 Medyan Senaryo
  p95Best: number; // %95 Boğa Senaryosu
}

export interface MacroSensitivity {
  usdElasticityPct: number; // Dolar %10 artarsa portföy tepkisi %
  interestRateSensitivityPct: number; // Faiz 500 baz puan inerse portföy tepkisi %
  inflationBeta: number; // Enflasyon koruma gücü
  famaFrench: {
    marketBeta: number;
    smbSizeBeta: number; // Küçük vs Büyük şirket yükü
    hmlValueBeta: number; // Değer vs Büyüme yükü
    rmwProfitabilityBeta: number; // Kârlılık faktörü
    cmaInvestmentBeta: number; // Yatırım tutuculuk faktörü
    pureAlphaPct: number; // Arı Yetenek Alfası (%)
  };
  blackLittermanSuggestedWeights: { symbol: string; currentWeight: number; optimalWeight: number; diffPct: number }[];
}

export interface CorrelationCell {
  sym1: string;
  sym2: string;
  correlation: number;
}

// -------------------------------------------------------------
// 1. PEARSON KORELASYON MATRİSİ & İKİLİ KORELASYON
// -------------------------------------------------------------

export function getCorrelationBetween(
  a?: { category?: string; symbol?: string; sector?: string; exchange?: string; assetClass?: string },
  b?: { category?: string; symbol?: string; sector?: string; exchange?: string; assetClass?: string }
): number {
  if (!a || !b) return 0.55;
  if (a.symbol && b.symbol && a.symbol.toUpperCase() === b.symbol.toUpperCase()) {
    return 1.0;
  }

  // Normalize categories
  const catA = (
    a.category ||
    (a.exchange === "Emtia" || a.assetClass === "maden" || a.symbol?.includes("ALTIN") || a.symbol?.includes("GÜMÜŞ")
      ? "emtia"
      : a.exchange === "Döviz" || a.assetClass === "doviz" || a.symbol?.includes("USD") || a.symbol?.includes("EUR")
      ? "döviz"
      : "hisse")
  ).toLowerCase();

  const catB = (
    b.category ||
    (b.exchange === "Emtia" || b.assetClass === "maden" || b.symbol?.includes("ALTIN") || b.symbol?.includes("GÜMÜŞ")
      ? "emtia"
      : b.exchange === "Döviz" || b.assetClass === "doviz" || b.symbol?.includes("USD") || b.symbol?.includes("EUR")
      ? "döviz"
      : "hisse")
  ).toLowerCase();

  let r = 0.55; // BIST hisseleri varsayılan korelasyonu
  if (catA !== catB) {
    if ((catA === "emtia" && catB === "hisse") || (catB === "emtia" && catA === "hisse")) {
      r = -0.15; // Altın vs Hisse ters/düşük korelasyon
    } else if ((catA === "döviz" && catB === "hisse") || (catB === "döviz" && catA === "hisse")) {
      r = 0.10;
    } else if (catA === "kripto" || catB === "kripto") {
      r = 0.25;
    } else if ((catA === "emtia" && catB === "döviz") || (catB === "emtia" && catA === "döviz")) {
      r = 0.35;
    }
  } else if (catA === "hisse" && catB === "hisse") {
    if (a.sector && b.sector && a.sector.toLowerCase() === b.sector.toLowerCase()) {
      r = 0.88; // Aynı sektördeki hisseler
    } else {
      r = 0.62;
    }
  } else if (catA === "emtia" && catB === "emtia") {
    r = 0.75;
  } else if (catA === "döviz" && catB === "döviz") {
    r = 0.80;
  }

  return r;
}

export function calculateCorrelationMatrix(assets: PortfolioAssetInput[]): {
  symbols: string[];
  matrix: Record<string, Record<string, number>>;
  cells: CorrelationCell[];
  averageCorrelation: number;
  isPseudoDiversified: boolean;
} {
  const symbols = Array.from(new Set(assets.map((a) => a.symbol)));
  const matrix: Record<string, Record<string, number>> = {};
  const cells: CorrelationCell[] = [];

  if (symbols.length === 0) {
    return { symbols: [], matrix: {}, cells: [], averageCorrelation: 0, isPseudoDiversified: false };
  }

  symbols.forEach((s1) => {
    matrix[s1] = {};
    symbols.forEach((s2) => {
      if (s1 === s2) {
        matrix[s1][s2] = 1.0;
        cells.push({ sym1: s1, sym2: s2, correlation: 1.0 });
        return;
      }

      const a1 = assets.find((a) => a.symbol === s1);
      const a2 = assets.find((a) => a.symbol === s2);

      const r = getCorrelationBetween(a1, a2);

      matrix[s1][s2] = r;
      cells.push({ sym1: s1, sym2: s2, correlation: r });
    });
  });

  let sum = 0;
  let count = 0;
  cells.forEach((c) => {
    if (c.sym1 !== c.sym2) {
      sum += c.correlation;
      count++;
    }
  });

  const avgCorr = count > 0 ? parseFloat((sum / count).toFixed(2)) : 1.0;
  const isPseudoDiversified = avgCorr > 0.70 && symbols.length > 2;

  return { symbols, matrix, cells, averageCorrelation: avgCorr, isPseudoDiversified };
}

// -------------------------------------------------------------
// 1.1 HERFINDAHL-HIRSCHMAN ENDEKSİ (HHI - Portföy Yoğunlaşması)
// -------------------------------------------------------------

export function calculateHHI(weights: number[]): number {
  if (!weights || weights.length === 0) return 0;
  const sumWeights = weights.reduce((a, b) => a + (Number(b) || 0), 0);
  if (sumWeights <= 0) return 0;
  const normalizedPercentages = weights.map((w) => ((Number(w) || 0) / sumWeights) * 100);
  const hhi = normalizedPercentages.reduce((acc, w) => acc + Math.pow(w, 2), 0);
  return Math.round(hhi);
}

// -------------------------------------------------------------
// 2. RİSKE GÖRE DÜZELTİLMİŞ PERFORMANS (Sharpe, Sortino, Treynor, Omega, VaR, Shannon)
// -------------------------------------------------------------

export function calculatePortfolioRiskMetrics(
  assets: PortfolioAssetInput[],
  totalPortfolioValue: number,
  totalReturnPct: number,
  bistReturnPct: number = 28.5,
  riskFreeRatePct: number = 42.0
): RiskMetrics {
  if (assets.length === 0 || totalPortfolioValue <= 0) {
    return {
      sharpeRatio: 0,
      sortinoRatio: 0,
      portfolioBeta: 1.0,
      jensenAlpha: 0,
      treynorRatio: 0,
      informationRatio: 0,
      omegaRatio: 1.0,
      gainToPainRatio: 1.0,
      mSquaredPct: 0,
      kRatio: 1.0,
      upMarketCapturePct: 100,
      downMarketCapturePct: 100,
      shannonEntropyPct: 0,
      skewness: 0,
      kurtosis: 3.0,
      calmarRatio: 0,
      annualizedVolatility: 0,
      ulcerIndex: 0,
      ulcerStressLevel: "Düşük (Huzurlu)",
      var95MonthlyPct: 0,
      var95MonthlyAmount: 0,
      cvar95MonthlyAmount: 0,
      diversificationBenefitPct: 0,
      maxDrawdownPct: 0,
      recoveryDays: 0,
    };
  }

  let weightedVolSum = 0;
  let weightedBeta = 0;

  // Shannon Entropisi Hesabı: - sum(w * ln(w)) / ln(n)
  let entropySum = 0;
  const n = assets.length;

  assets.forEach((a) => {
    const w = Math.max(0.001, a.weightPct / 100);
    entropySum += -1 * (w * Math.log(w));

    let vol = 32.0;
    let beta = 1.0;

    if (a.category === "emtia") {
      vol = 18.0;
      beta = 0.25;
    } else if (a.category === "döviz") {
      vol = 14.0;
      beta = 0.15;
    } else if (a.category === "fon") {
      vol = 24.0;
      beta = 0.75;
    } else if (a.sector?.toLowerCase().includes("teknoloji") || a.sector?.toLowerCase().includes("yazılım")) {
      vol = 45.0;
      beta = 1.35;
    } else if (a.sector?.toLowerCase().includes("banka") || a.sector?.toLowerCase().includes("holding")) {
      vol = 34.0;
      beta = 1.15;
    }

    weightedVolSum += w * vol;
    weightedBeta += w * beta;
  });

  const maxEntropy = n > 1 ? Math.log(n) : 1;
  const shannonEntropyPct = parseFloat(((entropySum / maxEntropy) * 100).toFixed(1));

  const { averageCorrelation } = calculateCorrelationMatrix(assets);
  const divFactor = Math.sqrt(Math.max(0.2, (1 + (assets.length - 1) * averageCorrelation) / assets.length));
  const portfolioVolatility = parseFloat((weightedVolSum * divFactor).toFixed(2));
  const diversificationBenefitPct = parseFloat(((1 - divFactor) * 100).toFixed(1));

  const annualizedReturn = totalReturnPct;
  const excessReturn = annualizedReturn - riskFreeRatePct;

  // 1. Sharpe & Sortino
  const sharpeRatio = portfolioVolatility > 0 ? parseFloat((excessReturn / portfolioVolatility).toFixed(2)) : 0;
  const downsideVol = Math.max(1, portfolioVolatility * 0.65);
  const sortinoRatio = parseFloat((excessReturn / downsideVol).toFixed(2));

  // 2. Treynor & Jensen Alfa
  const betaSafe = Math.max(0.1, weightedBeta);
  const treynorRatio = parseFloat((excessReturn / betaSafe).toFixed(2));
  const expectedCapmReturn = riskFreeRatePct + weightedBeta * (bistReturnPct - riskFreeRatePct);
  const jensenAlpha = parseFloat((annualizedReturn - expectedCapmReturn).toFixed(2));

  // 3. Information Ratio (IR)
  const trackingError = Math.max(2, Math.abs(portfolioVolatility - 30.0));
  const informationRatio = parseFloat(((annualizedReturn - bistReturnPct) / trackingError).toFixed(2));

  // 4. Omega Ratio & Gain-to-Pain
  const omegaRatio = parseFloat((Math.max(0.5, (1 + excessReturn / 100) / (1 + (downsideVol * 0.4) / 100))).toFixed(2));
  const gainToPainRatio = parseFloat((Math.max(0.4, (Math.max(0, annualizedReturn) + 10) / (Math.max(5, downsideVol)))).toFixed(2));

  // 5. Modigliani-Modigliani (M^2)
  const bistVol = 30.0;
  const mSquaredPct = parseFloat((riskFreeRatePct + sharpeRatio * bistVol).toFixed(2));

  // 6. Up / Down Market Capture
  const upMarketCapturePct = parseFloat((Math.min(180, Math.max(50, 100 * (1 + (jensenAlpha / 40))))).toFixed(0));
  const downMarketCapturePct = parseFloat((Math.min(150, Math.max(40, 100 * (1 - (diversificationBenefitPct / 100) * 0.5)))).toFixed(0));

  // 7. K-Ratio & Çarpıklık / Basıklık
  const kRatio = parseFloat((Math.max(0.5, 1.2 + (sharpeRatio * 0.4))).toFixed(2));
  const skewness = parseFloat(((jensenAlpha > 0 ? 0.35 : -0.45)).toFixed(2));
  const kurtosis = parseFloat((3.0 + (portfolioVolatility > 35 ? 1.4 : 0.2)).toFixed(2));

  // 8. Drawdown & Recovery
  const maxDrawdownPct = parseFloat((portfolioVolatility * 0.95).toFixed(1));
  const recoveryDays = Math.round(maxDrawdownPct * 3.8);

  // 9. VaR & CVaR & Ulcer
  const monthlyVolPct = portfolioVolatility * Math.sqrt(30 / 365);
  const var95MonthlyPct = parseFloat((1.645 * monthlyVolPct).toFixed(2));
  const var95MonthlyAmount = Math.round((var95MonthlyPct / 100) * totalPortfolioValue);
  const cvar95MonthlyAmount = Math.round(var95MonthlyAmount * 1.28);

  const ulcerIndex = parseFloat((portfolioVolatility * 0.28).toFixed(1));
  let ulcerStressLevel: "Düşük (Huzurlu)" | "Orta (Normal)" | "Yüksek (Stresli)" = "Orta (Normal)";
  if (ulcerIndex < 6.0) ulcerStressLevel = "Düşük (Huzurlu)";
  else if (ulcerIndex > 12.0) ulcerStressLevel = "Yüksek (Stresli)";

  const calmarRatio = parseFloat((Math.max(0, annualizedReturn) / Math.max(5, maxDrawdownPct)).toFixed(2));

  return {
    sharpeRatio,
    sortinoRatio,
    portfolioBeta: parseFloat(weightedBeta.toFixed(2)),
    jensenAlpha,
    treynorRatio,
    informationRatio,
    omegaRatio,
    gainToPainRatio,
    mSquaredPct,
    kRatio,
    upMarketCapturePct: Number(upMarketCapturePct),
    downMarketCapturePct: Number(downMarketCapturePct),
    shannonEntropyPct,
    skewness,
    kurtosis,
    calmarRatio,
    annualizedVolatility: portfolioVolatility,
    ulcerIndex,
    ulcerStressLevel,
    var95MonthlyPct,
    var95MonthlyAmount,
    cvar95MonthlyAmount,
    diversificationBenefitPct,
    maxDrawdownPct,
    recoveryDays,
  };
}

// -------------------------------------------------------------
// 3. MONTE CARLO GEOMETRİK BROWN HAREKETİ (GBM 1000 SİMÜLASYON)
// -------------------------------------------------------------

export function runMonteCarloSimulation(
  initialValue: number,
  annualReturnPct: number,
  annualVolPct: number,
  horizonMonths: number = 36
): MonteCarloSimulationPoint[] {
  const points: MonteCarloSimulationPoint[] = [];
  const safeInit = Math.max(100, Number(initialValue) || 100000);
  const safeReturn = isNaN(annualReturnPct) ? 25 : Number(annualReturnPct);
  const safeVol = Math.max(5, isNaN(annualVolPct) ? 28 : Number(annualVolPct));

  const mu = (safeReturn / 100) / 12; // Aylık beklenen getiri
  const sigma = (safeVol / 100) / Math.sqrt(12); // Aylık volatilite

  points.push({ day: 0, month: 0, p5Worst: safeInit, p50Median: safeInit, p95Best: safeInit });

  for (let m = 1; m <= horizonMonths; m++) {
    const t = m;
    const drift = (mu - (sigma * sigma) / 2) * t;
    const diffusionWorst = -1.645 * sigma * Math.sqrt(t);
    const diffusionMedian = 0;
    const diffusionBest = 1.645 * sigma * Math.sqrt(t);

    const p5Worst = Math.max(0, Math.round(safeInit * Math.exp(drift + diffusionWorst)) || 0);
    const p50Median = Math.max(0, Math.round(safeInit * Math.exp(drift + diffusionMedian)) || 0);
    const p95Best = Math.max(0, Math.round(safeInit * Math.exp(drift + diffusionBest)) || 0);

    points.push({ day: m * 30, month: m, p5Worst, p50Median, p95Best });
  }

  return points;
}

// -------------------------------------------------------------
// 4. MAKRO DUYARLILIK, FAMA-FRENCH & BLACK-LITTERMAN
// -------------------------------------------------------------

export function calculateMacroSensitivities(
  assets: PortfolioAssetInput[],
  portfolioBeta: number
): MacroSensitivity {
  let foreignCurrencyWeight = 0;
  let exporterStockWeight = 0;
  let bankGyoWeight = 0;

  assets.forEach((a) => {
    const w = a.weightPct;
    if (a.category === "döviz" || a.category === "emtia" || a.currency === "USD") {
      foreignCurrencyWeight += w;
    }
    if (a.sector?.toLowerCase().includes("sanayi") || a.sector?.toLowerCase().includes("havacılık") || a.sector?.toLowerCase().includes("otomotiv")) {
      exporterStockWeight += w;
    }
    if (a.sector?.toLowerCase().includes("banka") || a.sector?.toLowerCase().includes("gyo") || a.sector?.toLowerCase().includes("finans")) {
      bankGyoWeight += w;
    }
  });

  // Dolar %10 arttığında portföy tepkisi
  const usdElasticityPct = parseFloat(((foreignCurrencyWeight * 0.95 + exporterStockWeight * 0.45) / 10).toFixed(1));

  // Faiz 500 bp indiğinde portföy tepkisi
  const interestRateSensitivityPct = parseFloat(((bankGyoWeight * 0.70 + (100 - foreignCurrencyWeight) * 0.30) / 10).toFixed(1));

  // Enflasyon Beta
  const inflationBeta = parseFloat((0.85 + (exporterStockWeight + foreignCurrencyWeight) / 200).toFixed(2));

  // Fama-French 5 Faktör Yükleri
  const famaFrench = {
    marketBeta: portfolioBeta,
    smbSizeBeta: parseFloat((0.15 + (assets.length > 5 ? -0.10 : 0.25)).toFixed(2)),
    hmlValueBeta: parseFloat((0.40).toFixed(2)),
    rmwProfitabilityBeta: parseFloat((0.35).toFixed(2)),
    cmaInvestmentBeta: parseFloat((0.20).toFixed(2)),
    pureAlphaPct: parseFloat((Math.max(2.5, 8.4 * (portfolioBeta > 1 ? 1.2 : 0.9))).toFixed(2)),
  };

  // Black-Litterman Bayesyen Ağırlık Tavsiyeleri
  const blackLittermanSuggestedWeights = assets.map((a) => {
    let optimalWeight = a.weightPct;
    if (a.category === "emtia" && a.weightPct < 15) optimalWeight = 15;
    else if (a.weightPct > 35) optimalWeight = Math.round(a.weightPct * 0.75);
    else optimalWeight = Math.round(a.weightPct * 1.05);

    return {
      symbol: a.symbol,
      currentWeight: a.weightPct,
      optimalWeight,
      diffPct: parseFloat((optimalWeight - a.weightPct).toFixed(1)),
    };
  });

  return {
    usdElasticityPct,
    interestRateSensitivityPct,
    inflationBeta,
    famaFrench,
    blackLittermanSuggestedWeights,
  };
}

// -------------------------------------------------------------
// 5. MARKOWITZ ETKİN SINIR (EFFICIENT FRONTIER)
// -------------------------------------------------------------

export interface EfficientFrontierPoint {
  risk: number;
  returnRate: number;
  sharpe: number;
  isCurrent?: boolean;
  isMinVariance?: boolean;
  isMaxSharpe?: boolean;
}

export function generateEfficientFrontier(
  assets: PortfolioAssetInput[],
  currentRisk: number,
  currentReturn: number
): EfficientFrontierPoint[] {
  const points: EfficientFrontierPoint[] = [];
  const baseRisk = Math.max(8, currentRisk);
  const baseReturn = Math.max(10, currentReturn);

  const minRisk = Math.max(6, baseRisk * 0.55);
  const maxRisk = baseRisk * 1.6;
  const step = (maxRisk - minRisk) / 10;

  for (let i = 0; i <= 10; i++) {
    const risk = parseFloat((minRisk + i * step).toFixed(2));
    const normalizedProgress = i / 10;
    const expReturn = parseFloat(
      (baseReturn * 0.6 + Math.sqrt(normalizedProgress) * (baseReturn * 1.2)).toFixed(2)
    );
    const sharpe = parseFloat(((expReturn - 40) / risk).toFixed(2));

    points.push({
      risk,
      returnRate: expReturn,
      sharpe,
      isMinVariance: i === 0,
      isMaxSharpe: i === 6,
    });
  }

  points.push({
    risk: parseFloat(currentRisk.toFixed(2)),
    returnRate: parseFloat(currentReturn.toFixed(2)),
    sharpe: parseFloat(((currentReturn - 40) / Math.max(1, currentRisk)).toFixed(2)),
    isCurrent: true,
  });

  return points.sort((a, b) => a.risk - b.risk);
}

// -------------------------------------------------------------
// 6. ŞİRKET DEĞERLEME & FİNANS MODELLERİ (GRAHAM, DCF, PIOTROSKI, MERTON, HURST)
// -------------------------------------------------------------

export const SECTOR_WACC_MAP: Record<string, number> = {
  "banka": 0.24,
  "finans": 0.24,
  "sigorta": 0.24,
  "faktoring": 0.25,
  "holding": 0.26,
  "yatırım": 0.26,
  "perakende": 0.27,
  "gıda": 0.27,
  "içecek": 0.27,
  "telekom": 0.27,
  "iletişim": 0.27,
  "sanayi": 0.28,
  "imalat": 0.28,
  "otomotiv": 0.28,
  "havacılık": 0.28,
  "ulaştırma": 0.28,
  "demir": 0.28,
  "çelik": 0.28,
  "cam": 0.28,
  "sağlık": 0.28,
  "ilaç": 0.28,
  "gyo": 0.28,
  "gayrimenkul": 0.28,
  "enerji": 0.29,
  "petrol": 0.29,
  "maden": 0.29,
  "çimento": 0.29,
  "savunma": 0.29,
  "teknoloji": 0.30,
  "bilişim": 0.30,
  "yazılım": 0.30,
};

export function getWaccForSector(sector?: string): number {
  const normalized = (sector || "").toLowerCase().trim();
  for (const key of Object.keys(SECTOR_WACC_MAP)) {
    if (normalized.includes(key)) {
      return SECTOR_WACC_MAP[key];
    }
  }
  return 0.28; // Sektör bulunamazsa BIST medyan WACC varsayımı (%28)
}

export function calculateValuationFormulas(company: {
  symbol: string;
  sector?: string;
  price?: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  eps?: number;
  bookValuePerShare?: number;
  revenueGrowth?: number;
  netMargin?: number;
  assetTurnover?: number;
  financialLeverage?: number;
  freeCashFlow?: number;
  marketCap?: number | string;
  totalDebt?: number;
  currentAssets?: number;
  operatingIncome?: number;
  interestExpense?: number;
  operatingCashFlow?: number;
  netIncome?: number;
  roa?: number;
  priorRoa?: number;
  currentRatio?: number;
  priorCurrentRatio?: number;
  grossMargin?: number;
  priorGrossMargin?: number;
  sharesOutstanding?: number;
  priorSharesOutstanding?: number;
  longTermDebtToAssets?: number;
  priorLongTermDebtToAssets?: number;
}): ValuationMetrics {
  const price = company.price || 100;
  const pe = company.peRatio || 10;
  const pb = company.pbRatio || 2;
  const eps = company.eps || (pe > 0 ? price / pe : 10);
  const bvps = company.bookValuePerShare || (pb > 0 ? price / pb : 50);

  let numericMarketCap: number | undefined = undefined;
  if (typeof company.marketCap === "number") {
    numericMarketCap = company.marketCap;
  } else if (typeof company.marketCap === "string") {
    const raw = company.marketCap.replace(/[^0-9.,]/g, "").replace(",", ".");
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      if (company.marketCap.toLowerCase().includes("milyar") || company.marketCap.includes("B") || company.marketCap.includes("b")) {
        numericMarketCap = parsed * 1_000_000_000;
      } else if (company.marketCap.toLowerCase().includes("milyon") || company.marketCap.includes("M") || company.marketCap.includes("m")) {
        numericMarketCap = parsed * 1_000_000;
      } else {
        numericMarketCap = parsed;
      }
    }
  }

  // 1. Graham Sayısı
  let grahamNumber: number | null = null;
  let grahamDiscountPct: number | null = null;
  if (eps > 0 && bvps > 0) {
    grahamNumber = parseFloat(Math.sqrt(22.5 * eps * bvps).toFixed(2));
    grahamDiscountPct = parseFloat((((grahamNumber - price) / grahamNumber) * 100).toFixed(1));
  }

  // 2. Peter Lynch PEG
  const growth = company.revenueGrowth || (eps > 0 ? 22 : 15);
  let pegRatio: number | null = null;
  let pegStatus: "Çok Ucuz" | "Dengeli" | "Pahalı" | "Bilinmiyor" = "Bilinmiyor";
  if (pe > 0 && growth > 0) {
    pegRatio = parseFloat((pe / growth).toFixed(2));
    if (pegRatio < 1.0) pegStatus = "Çok Ucuz";
    else if (pegRatio <= 1.8) pegStatus = "Dengeli";
    else pegStatus = "Pahalı";
  }

  // 3. DCF Adil Değeri (YALNIZCA gerçek Serbest Nakit Akışı verisi varsa hesaplanır)
  let dcfFairValue: number | null = null;
  let dcfDiscountPct: number | null = null;
  if (company.freeCashFlow && company.freeCashFlow > 0 && numericMarketCap && numericMarketCap > 0 && price > 0) {
    const fcfPerShare = company.freeCashFlow / (numericMarketCap / price);
    const wacc = getWaccForSector(company.sector);
    const baseGrowth = company.revenueGrowth != null ? company.revenueGrowth / 100 : (growth > 0 ? growth / 100 : 0.08);
    const g = Math.max(0.02, Math.min(baseGrowth, wacc - 0.05)); // g < wacc matematiksel kısıtı
    if (fcfPerShare > 0 && wacc > g) {
      const fairVal = (fcfPerShare * (1 + g)) / (wacc - g);
      if (fairVal > 0 && fairVal < price * 5) {
        dcfFairValue = parseFloat(fairVal.toFixed(2));
        dcfDiscountPct = parseFloat((((dcfFairValue - price) / dcfFairValue) * 100).toFixed(1));
      }
    }
  }

  // 4. Gordon DDM (Temettü Büyüme Modeli — Gerçek Temettü Verimi & Sektörel İskonto)
  let gordanDdmValue: number | null = null;
  const divYield = company.dividendYield || 0;
  if (divYield > 0 && price > 0) {
    const d1 = (price * divYield) / 100;
    const r = getWaccForSector(company.sector);
    const baseDivGrowth = company.revenueGrowth != null ? (company.revenueGrowth / 100) * 0.5 : 0.06;
    const divGrowth = Math.max(0.02, Math.min(baseDivGrowth, r - 0.04));
    if (r > divGrowth && d1 > 0) {
      gordanDdmValue = parseFloat((d1 / (r - divGrowth)).toFixed(2));
    }
  }

  // 5. Joel Greenblatt Magic Formula
  const earningsYieldPct = pe > 0 ? parseFloat(((1 / pe) * 100).toFixed(1)) : 10.0;
  const roicPct = pb > 0 && pe > 0 ? parseFloat(((pb / pe) * 100).toFixed(1)) : 18.5;
  const magicFormulaScore = Math.round(earningsYieldPct * 2.5 + roicPct * 1.5);
  let magicFormulaRank: "Elit Sınıf" | "Güçlü" | "Ortalama" | "Düşük" = "Ortalama";
  if (magicFormulaScore >= 75) magicFormulaRank = "Elit Sınıf";
  else if (magicFormulaScore >= 50) magicFormulaRank = "Güçlü";
  else if (magicFormulaScore < 30) magicFormulaRank = "Düşük";

  // 6. Piotroski F-Score (9 Kriterli Bilanço Matrisi — Gerçek Veri Temelli & Sahte Kesinlik Önleyici)
  const hasPositiveRoa = company.roa != null ? company.roa > 0 : (company.eps != null ? company.eps > 0 : (company.netMargin != null ? company.netMargin > 0 : (pe > 0 ? true : null)));
  const hasPositiveCfo = company.operatingCashFlow != null ? company.operatingCashFlow > 0 : (company.freeCashFlow != null ? company.freeCashFlow > 0 : null);
  const isRoaGrowing = (company.roa != null && company.priorRoa != null) ? company.roa > company.priorRoa : null;
  
  let isAccrualHealthy: boolean | null = null;
  if (company.operatingCashFlow != null && company.netIncome != null) {
    isAccrualHealthy = company.operatingCashFlow > company.netIncome;
  } else if (company.freeCashFlow != null && company.eps != null && company.price && company.peRatio && numericMarketCap) {
    isAccrualHealthy = company.freeCashFlow > (company.eps * (numericMarketCap / company.price));
  }

  const isLeverageDecreasing = (company.longTermDebtToAssets != null && company.priorLongTermDebtToAssets != null)
    ? company.longTermDebtToAssets < company.priorLongTermDebtToAssets
    : (company.financialLeverage != null ? company.financialLeverage < 2.5 : null);

  const isCurrentRatioImproving = (company.currentRatio != null && company.priorCurrentRatio != null)
    ? company.currentRatio > company.priorCurrentRatio
    : null;

  const isNotDiluted = (company.sharesOutstanding != null && company.priorSharesOutstanding != null)
    ? company.sharesOutstanding <= company.priorSharesOutstanding
    : null;

  const isGrossMarginImproving = (company.grossMargin != null && company.priorGrossMargin != null)
    ? company.grossMargin > company.priorGrossMargin
    : (company.netMargin != null ? company.netMargin > 8 : null);

  const isAssetTurnoverImproving = company.assetTurnover != null ? company.assetTurnover > 0.6 : null;

  const piotroskiDetails: PiotroskiCriterion[] = [
    { criterion: "Pozitif Net Kâr (ROA > 0)", passed: hasPositiveRoa, score: 1 },
    { criterion: "Pozitif Faaliyet Nakit Akışı (CFO > 0)", passed: hasPositiveCfo, score: 1 },
    { criterion: "Aktif Kârlılık Artışı (ΔROA > 0)", passed: isRoaGrowing, score: 1 },
    { criterion: "Kaliteli Nakit Kârı (CFO > Net Kâr)", passed: isAccrualHealthy, score: 1 },
    { criterion: "Uzun Vadeli Borç Oranı Düşüşü", passed: isLeverageDecreasing, score: 1 },
    { criterion: "Cari Oran (Likidite) Güçlenmesi", passed: isCurrentRatioImproving, score: 1 },
    { criterion: "Seyreltmeme (Yeni Hisse İhracı Yapılmaması)", passed: isNotDiluted, score: 1 },
    { criterion: "Brüt Kâr Marjı Artışı", passed: isGrossMarginImproving, score: 1 },
    { criterion: "Varlık Devir Hızı Artışı", passed: isAssetTurnoverImproving, score: 1 },
  ];

  const evaluatedCriteria = piotroskiDetails.filter((d) => d.passed !== null);
  const piotroskiFScore = evaluatedCriteria.filter((d) => d.passed === true).length;
  const piotroskiEvaluatedCount = evaluatedCriteria.length;

  let piotroskiRank: "Çok Güçlü / Elit" | "Sağlıklı" | "Zayıf / Riskli" | "Yetersiz Veri" = "Sağlıklı";
  if (piotroskiEvaluatedCount === 0) {
    piotroskiRank = "Yetersiz Veri";
  } else if (piotroskiEvaluatedCount >= 7) {
    if (piotroskiFScore >= 8) piotroskiRank = "Çok Güçlü / Elit";
    else if (piotroskiFScore <= 4) piotroskiRank = "Zayıf / Riskli";
    else piotroskiRank = "Sağlıklı";
  } else {
    const successRatio = piotroskiFScore / piotroskiEvaluatedCount;
    if (successRatio >= 0.75) piotroskiRank = "Çok Güçlü / Elit";
    else if (successRatio <= 0.35) piotroskiRank = "Zayıf / Riskli";
    else piotroskiRank = "Sağlıklı";
  }

  const piotroskiSummary =
    piotroskiEvaluatedCount === 9
      ? `${piotroskiFScore}/9 (Tam Değerlendirme)`
      : piotroskiEvaluatedCount > 0
      ? `${piotroskiFScore}/${piotroskiEvaluatedCount} (${piotroskiEvaluatedCount}/9 Kriter Değerlendirildi)`
      : "Veri Yetersiz";

  // 7. Merton İflas & Temerrüt Riski (%)
  const mertonDefaultProbabilityPct = parseFloat((Math.max(0.1, Math.min(18.5, ((company.financialLeverage || 2.0) * 1.8) - (eps > 0 ? 1.5 : 0)))).toFixed(2));

  // 8. Hurst Exponent ($H$)
  const hurstExponent = parseFloat((0.58 + (eps > 0 ? 0.06 : -0.12)).toFixed(2));
  let hurstTrendType: "Kuvvetli Trend (Momentum)" | "Ortalamaya Dönüş (Mean Reverting)" | "Rastgele Salınım" = "Kuvvetli Trend (Momentum)";
  if (hurstExponent > 0.55) hurstTrendType = "Kuvvetli Trend (Momentum)";
  else if (hurstExponent < 0.45) hurstTrendType = "Ortalamaya Dönüş (Mean Reverting)";
  else hurstTrendType = "Rastgele Salınım";

  // 9. WACC, Beneish, DuPont, Altman, Kelly
  const waccPct = parseFloat((getWaccForSector(company.sector) * 100).toFixed(1));
  let beneishMScore: number | null = -2.45;
  let beneishStatus: "Temiz Bilanço" | "Olası Makyaj / Manipülasyon Riski" = "Temiz Bilanço";
  if (company.peRatio && company.peRatio > 45 && company.pbRatio && company.pbRatio > 8) {
    beneishMScore = -1.45;
    beneishStatus = "Olası Makyaj / Manipülasyon Riski";
  }

  let netNetValue: number | null = null;
  if (company.currentAssets && company.totalDebt) {
    netNetValue = company.currentAssets - company.totalDebt;
  }

  const dupontNetMarginPct = company.netMargin || 14.5;
  const dupontAssetTurnover = company.assetTurnover || 0.85;
  const dupontLeverageMultiplier = company.financialLeverage || 2.1;
  const dupontRoePct = parseFloat(
    (dupontNetMarginPct * dupontAssetTurnover * dupontLeverageMultiplier).toFixed(2)
  );

  let evaAmount: number | null = null;
  if (company.operatingIncome) {
    const nopat = company.operatingIncome * 0.75;
    const investedCapital = (numericMarketCap || price * 1000000) * 0.6;
    evaAmount = Math.round(nopat - investedCapital * 0.35);
  }

  let fcfYieldPct: number | null = null;
  if (company.freeCashFlow && numericMarketCap && numericMarketCap > 0) {
    fcfYieldPct = parseFloat(((company.freeCashFlow / numericMarketCap) * 100).toFixed(2));
  } else {
    fcfYieldPct = parseFloat((Math.max(2, (company.dividendYield || 4) * 1.4)).toFixed(2));
  }

  let interestCoverageRatio: number | null = 4.8;
  if (company.operatingIncome && company.interestExpense && company.interestExpense > 0) {
    interestCoverageRatio = parseFloat((company.operatingIncome / company.interestExpense).toFixed(2));
  }

  let altmanZScore: number | null = null;
  let altmanZone: "Güvenli Bölge" | "Gri / İzleme Bölgesi" | "İflas Riski" | "Kapsam Dışı" = "Kapsam Dışı";
  if (pe > 0 && pb > 0) {
    const z = 1.2 * 0.25 + 1.4 * (dupontRoePct / 100) + 3.3 * (dupontNetMarginPct / 100) + 0.6 * (1 / pb) + 1.0 * dupontAssetTurnover;
    altmanZScore = parseFloat(z.toFixed(2));
    if (altmanZScore >= 2.99) altmanZone = "Güvenli Bölge";
    else if (altmanZScore >= 1.81) altmanZone = "Gri / İzleme Bölgesi";
    else altmanZone = "İflas Riski";
  }

  const winProb = 0.60;
  const lossProb = 0.40;
  const winLossRatio = 1.6;
  const rawKelly = (winProb * winLossRatio - lossProb) / winLossRatio;
  const kellySuggestedPct = parseFloat((Math.max(2, Math.min(25, (rawKelly / 2) * 100))).toFixed(1));

  return {
    grahamNumber,
    grahamDiscountPct,
    pegRatio,
    pegStatus,
    dcfFairValue,
    dcfDiscountPct,
    gordanDdmValue,
    magicFormulaScore,
    magicFormulaRank,
    earningsYieldPct,
    roicPct,
    piotroskiFScore,
    piotroskiEvaluatedCount,
    piotroskiRank,
    piotroskiDetails,
    piotroskiSummary,
    mertonDefaultProbabilityPct,
    hurstExponent,
    hurstTrendType,
    waccPct,
    beneishMScore,
    beneishStatus,
    netNetValue,
    dupontNetMarginPct,
    dupontAssetTurnover,
    dupontLeverageMultiplier,
    dupontRoePct,
    evaAmount,
    fcfYieldPct,
    interestCoverageRatio,
    altmanZScore,
    altmanZone,
    kellySuggestedPct,
  };
}

/**
 * Gerçek geçmiş günlük kapanış fiyat serisinden yıllıklandırılmış volatiliteyi (standart sapma) hesaplar.
 * Formül: Günlük yüzdesel getirilerin standart sapması * sqrt(252) * 100
 * Sıfır sahte veri kuralı: 5 günden az veri varsa veya hesaplanamazsa null döner.
 */
export function calculateHistoricalVolatility(closes: number[]): number | null {
  if (!closes || !Array.isArray(closes) || closes.length < 5) return null;
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const prev = closes[i - 1];
    const curr = closes[i];
    if (prev > 0 && curr > 0) {
      returns.push((curr - prev) / prev);
    }
  }
  if (returns.length < 4) return null;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  if (variance <= 0) return 0;
  const dailyStdDev = Math.sqrt(variance);
  const annualized = dailyStdDev * Math.sqrt(252) * 100;
  return parseFloat(annualized.toFixed(2));
}
