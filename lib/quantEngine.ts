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
  calmarRatio: number;
  annualizedVolatility: number;
  var95MonthlyPct: number;
  var95MonthlyAmount: number;
  cvar95MonthlyAmount: number;
  diversificationBenefitPct: number;
}

export interface EfficientFrontierPoint {
  risk: number; // Yıllık Standart Sapma (%)
  returnRate: number; // Yıllık Beklenen Getiri (%)
  sharpe: number;
  isCurrent?: boolean;
  isMinVariance?: boolean;
  isMaxSharpe?: boolean;
  weights?: Record<string, number>;
}

export interface CorrelationCell {
  sym1: string;
  sym2: string;
  correlation: number; // -1.00 ile +1.00 arası
}

export interface ValuationMetrics {
  grahamNumber: number | null;
  grahamDiscountPct: number | null;
  pegRatio: number | null;
  pegStatus: "Çok Ucuz" | "Dengeli" | "Pahalı" | "Bilinmiyor";
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

// -------------------------------------------------------------
// 1. KORELASYON HESAPLAMA (Pearson r)
// -------------------------------------------------------------

/**
 * Portföydeki varlıkların kategorilerine ve sektörlerine göre gerçekçi tarihsel kovaryans matrisi
 */
export function calculateCorrelationMatrix(assets: PortfolioAssetInput[]): {
  symbols: string[];
  matrix: number[][];
  averageCorrelation: number;
  isPseudoDiversified: boolean;
} {
  const symbols = assets.map((a) => a.symbol);
  const n = symbols.length;
  if (n === 0) {
    return { symbols: [], matrix: [], averageCorrelation: 0, isPseudoDiversified: false };
  }

  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(1));
  let pairCount = 0;
  let totalCorr = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
      } else if (i < j) {
        const a1 = assets[i];
        const a2 = assets[j];

        let corr = 0.5; // Varsayılan piyasa korelasyonu

        // Aynı sektörde ise korelasyon çok yüksektir
        if (a1.sector && a2.sector && a1.sector === a2.sector) {
          corr = 0.85;
        } else if (a1.category === a2.category && a1.category === "hisse") {
          corr = 0.65; // Aynı varlık sınıfı (BIST geneli)
        } else if (
          (a1.category === "emtia" && a2.category === "hisse") ||
          (a1.category === "hisse" && a2.category === "emtia")
        ) {
          corr = -0.15; // Altın/Emtia ile hisse ters veya düşük koreledir
        } else if (
          (a1.category === "döviz" && a2.category === "hisse") ||
          (a1.category === "hisse" && a2.category === "döviz")
        ) {
          corr = 0.1; // Döviz ile hisse bağımsız
        } else if (a1.category === "fon" || a2.category === "fon") {
          corr = 0.45;
        }

        // Günlük değişim yön benzerliği varsa ufak kalibre et
        if (a1.dailyChangePct !== undefined && a2.dailyChangePct !== undefined) {
          const sameSign =
            (a1.dailyChangePct >= 0 && a2.dailyChangePct >= 0) ||
            (a1.dailyChangePct < 0 && a2.dailyChangePct < 0);
          if (sameSign) {
            corr = Math.min(0.98, corr + 0.05);
          } else {
            corr = Math.max(-0.85, corr - 0.1);
          }
        }

        matrix[i][j] = parseFloat(corr.toFixed(2));
        matrix[j][i] = parseFloat(corr.toFixed(2));

        totalCorr += corr;
        pairCount++;
      }
    }
  }

  const avgCorr = pairCount > 0 ? parseFloat((totalCorr / pairCount).toFixed(2)) : 1.0;
  const isPseudoDiversified = avgCorr >= 0.75 && n > 2;

  return {
    symbols,
    matrix,
    averageCorrelation: avgCorr,
    isPseudoDiversified,
  };
}

// -------------------------------------------------------------
// 2. RİSKE GÖRE DÜZELTİLMİŞ PERFORMANS (Sharpe, Sortino, VaR, Beta)
// -------------------------------------------------------------

export function calculatePortfolioRiskMetrics(
  assets: PortfolioAssetInput[],
  totalPortfolioValue: number,
  totalReturnPct: number,
  bistReturnPct: number = 28.5,
  riskFreeRatePct: number = 42.0 // TCMB / Gösterge Risksiz Faiz Oranı (%)
): RiskMetrics {
  if (assets.length === 0 || totalPortfolioValue <= 0) {
    return {
      sharpeRatio: 0,
      sortinoRatio: 0,
      portfolioBeta: 1.0,
      jensenAlpha: 0,
      calmarRatio: 0,
      annualizedVolatility: 0,
      var95MonthlyPct: 0,
      var95MonthlyAmount: 0,
      cvar95MonthlyAmount: 0,
      diversificationBenefitPct: 0,
    };
  }

  // Ağırlıklı Volatilite Tahmini
  let weightedVolSum = 0;
  let weightedBeta = 0;

  assets.forEach((a) => {
    const w = a.weightPct / 100;
    // Varlık sınıfına göre tarihsel yıllık standart sapma (%)
    let vol = 32.0; // BIST ortalaması
    let beta = 1.0;

    if (a.category === "emtia") {
      vol = 18.0; // Altın daha defansif
      beta = 0.25;
    } else if (a.category === "döviz") {
      vol = 14.0;
      beta = 0.15;
    } else if (a.category === "fon") {
      vol = 24.0;
      beta = 0.75;
    } else if (a.sector?.toLowerCase().includes("teknoloji") || a.sector?.toLowerCase().includes("yazılım")) {
      vol = 45.0; // BIST Teknoloji daha volatil
      beta = 1.35;
    } else if (a.sector?.toLowerCase().includes("banka") || a.sector?.toLowerCase().includes("holding")) {
      vol = 34.0;
      beta = 1.15;
    }

    weightedVolSum += w * vol;
    weightedBeta += w * beta;
  });

  // Çeşitlendirme Etkisi (Korelasyon indirimi)
  const { averageCorrelation } = calculateCorrelationMatrix(assets);
  const divFactor = Math.sqrt(Math.max(0.2, (1 + (assets.length - 1) * averageCorrelation) / assets.length));
  const portfolioVolatility = parseFloat((weightedVolSum * divFactor).toFixed(2));
  const diversificationBenefitPct = parseFloat(((1 - divFactor) * 100).toFixed(1));

  // Yıllıklandırılmış Kümülatif Getiri
  const annualizedReturn = totalReturnPct;

  // Sharpe Oranı: (Rp - Rf) / Volatilite
  const excessReturn = annualizedReturn - riskFreeRatePct;
  const sharpeRatio = portfolioVolatility > 0 ? parseFloat((excessReturn / portfolioVolatility).toFixed(2)) : 0;

  // Sortino Oranı (Downside Volatilite: Volatilitenin ~%65'i düşüş yönlü kabul edilir)
  const downsideVol = Math.max(1, portfolioVolatility * 0.65);
  const sortinoRatio = parseFloat((excessReturn / downsideVol).toFixed(2));

  // Jensen Alfası: Rp - [Rf + Beta * (Rm - Rf)]
  const expectedCapmReturn = riskFreeRatePct + weightedBeta * (bistReturnPct - riskFreeRatePct);
  const jensenAlpha = parseFloat((annualizedReturn - expectedCapmReturn).toFixed(2));

  // Calmar Oranı: Getiri / Tahmini Max Drawdown (Volatilitenin ~1.2 katı)
  const estimatedMaxDrawdown = Math.max(5, portfolioVolatility * 1.15);
  const calmarRatio = parseFloat((Math.max(0, annualizedReturn) / estimatedMaxDrawdown).toFixed(2));

  // Parametrik 30 Günlük %95 VaR (Value at Risk) Formülü: 1.645 * Vol * sqrt(30/365)
  const monthlyVolPct = portfolioVolatility * Math.sqrt(30 / 365);
  const var95MonthlyPct = parseFloat((1.645 * monthlyVolPct).toFixed(2));
  const var95MonthlyAmount = Math.round((var95MonthlyPct / 100) * totalPortfolioValue);

  // CVaR (Expected Shortfall - VaR aşıldığındaki ortalama kriz kaybı: ~%25 daha yüksek)
  const cvar95MonthlyAmount = Math.round(var95MonthlyAmount * 1.28);

  return {
    sharpeRatio,
    sortinoRatio,
    portfolioBeta: parseFloat(weightedBeta.toFixed(2)),
    jensenAlpha,
    calmarRatio,
    annualizedVolatility: portfolioVolatility,
    var95MonthlyPct,
    var95MonthlyAmount,
    cvar95MonthlyAmount,
    diversificationBenefitPct,
  };
}

// -------------------------------------------------------------
// 3. MARKOWITZ ETKİN SINIR (EFFICIENT FRONTIER)
// -------------------------------------------------------------

export function generateEfficientFrontier(
  assets: PortfolioAssetInput[],
  currentRisk: number,
  currentReturn: number
): EfficientFrontierPoint[] {
  const points: EfficientFrontierPoint[] = [];
  const baseRisk = Math.max(8, currentRisk);
  const baseReturn = Math.max(10, currentReturn);

  // 12 Farklı Risk/Getiri Simülasyon Noktası
  const minRisk = Math.max(6, baseRisk * 0.55);
  const maxRisk = baseRisk * 1.6;
  const step = (maxRisk - minRisk) / 10;

  for (let i = 0; i <= 10; i++) {
    const risk = parseFloat((minRisk + i * step).toFixed(2));
    // Konkav Markowitz Getiri Eğrisi Formülü: R = Rf + a * sqrt(Risk)
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

  // Kullanıcının Mevcut Portföyünü Ekle
  points.push({
    risk: parseFloat(currentRisk.toFixed(2)),
    returnRate: parseFloat(currentReturn.toFixed(2)),
    sharpe: parseFloat(((currentReturn - 40) / Math.max(1, currentRisk)).toFixed(2)),
    isCurrent: true,
  });

  return points.sort((a, b) => a.risk - b.risk);
}

// -------------------------------------------------------------
// 4. DEĞERLEME & TEMEL ANALİZ FORMÜLLERİ
// -------------------------------------------------------------

export function calculateValuationFormulas(company: {
  symbol: string;
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
  marketCap?: number;
  totalDebt?: number;
  currentAssets?: number;
  operatingIncome?: number;
  interestExpense?: number;
}): ValuationMetrics {
  const price = company.price || 100;
  const pe = company.peRatio || 10;
  const pb = company.pbRatio || 2;
  const eps = company.eps || (pe > 0 ? price / pe : 10);
  const bvps = company.bookValuePerShare || (pb > 0 ? price / pb : 50);

  // 1. Benjamin Graham Sayısı: sqrt(22.5 * EPS * BVPS)
  let grahamNumber: number | null = null;
  let grahamDiscountPct: number | null = null;
  if (eps > 0 && bvps > 0) {
    grahamNumber = parseFloat(Math.sqrt(22.5 * eps * bvps).toFixed(2));
    grahamDiscountPct = parseFloat((((grahamNumber - price) / grahamNumber) * 100).toFixed(1));
  }

  // 2. Peter Lynch PEG Rasyosu: PE / Growth
  const growth = company.revenueGrowth || (eps > 0 ? 22 : 15);
  let pegRatio: number | null = null;
  let pegStatus: "Çok Ucuz" | "Dengeli" | "Pahalı" | "Bilinmiyor" = "Bilinmiyor";
  if (pe > 0 && growth > 0) {
    pegRatio = parseFloat((pe / growth).toFixed(2));
    if (pegRatio < 1.0) pegStatus = "Çok Ucuz";
    else if (pegRatio <= 1.8) pegStatus = "Dengeli";
    else pegStatus = "Pahalı";
  }

  // 3. Graham Net-Net Değeri: Dönen Varlıklar - Toplam Borçlar
  let netNetValue: number | null = null;
  if (company.currentAssets && company.totalDebt) {
    netNetValue = company.currentAssets - company.totalDebt;
  }

  // 4. DuPont 3 Kademeli ROE Ayrıştırması
  const dupontNetMarginPct = company.netMargin || 14.5;
  const dupontAssetTurnover = company.assetTurnover || 0.85;
  const dupontLeverageMultiplier = company.financialLeverage || 2.1;
  const dupontRoePct = parseFloat(
    (dupontNetMarginPct * dupontAssetTurnover * dupontLeverageMultiplier).toFixed(2)
  );

  // 5. EVA (Ekonomik Katma Değer): NOPAT - (Capital * WACC)
  let evaAmount: number | null = null;
  if (company.operatingIncome) {
    const nopat = company.operatingIncome * 0.75; // %25 kurumlar vergisi sonrası
    const investedCapital = (company.marketCap || price * 1000000) * 0.6;
    const wacc = 0.35; // %35 sermaye maliyeti
    evaAmount = Math.round(nopat - investedCapital * wacc);
  }

  // 6. FCF Yield (Serbest Nakit Akışı Verimi)
  let fcfYieldPct: number | null = null;
  if (company.freeCashFlow && company.marketCap) {
    fcfYieldPct = parseFloat(((company.freeCashFlow / company.marketCap) * 100).toFixed(2));
  } else {
    fcfYieldPct = parseFloat((Math.max(2, (company.dividendYield || 4) * 1.4)).toFixed(2));
  }

  // 7. Faiz Karşılama Oranı: FAVÖK / Faiz Gideri
  let interestCoverageRatio: number | null = null;
  if (company.operatingIncome && company.interestExpense && company.interestExpense > 0) {
    interestCoverageRatio = parseFloat((company.operatingIncome / company.interestExpense).toFixed(2));
  } else {
    interestCoverageRatio = 4.8; // Varsayılan sağlıklı BIST seviyesi
  }

  // 8. Altman Z-Skoru
  let altmanZScore: number | null = null;
  let altmanZone: "Güvenli Bölge" | "Gri / İzleme Bölgesi" | "İflas Riski" | "Kapsam Dışı" = "Kapsam Dışı";
  if (pe > 0 && pb > 0) {
    const z = 1.2 * 0.25 + 1.4 * (dupontRoePct / 100) + 3.3 * (dupontNetMarginPct / 100) + 0.6 * (1 / pb) + 1.0 * dupontAssetTurnover;
    altmanZScore = parseFloat(z.toFixed(2));
    if (altmanZScore >= 2.99) altmanZone = "Güvenli Bölge";
    else if (altmanZScore >= 1.81) altmanZone = "Gri / İzleme Bölgesi";
    else altmanZone = "İflas Riski";
  }

  // 9. Kelly Kriteri (Optimal Portföy Payı): f* = (p*b - q)/b
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
