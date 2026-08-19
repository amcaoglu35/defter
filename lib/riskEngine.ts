/**
 * Defter — Kurumsal Kantitatif Risk ve Benchmark Motoru (Quant Risk Engine)
 *
 * Sıfır sahte veri kuralına uygun olarak tüm metrikler GERÇEK günlük log-getiri
 * serileri üzerinden hesaplanır.
 *
 * Metrikler:
 * 1. Yıllıklandırılmış Volatilite (252 işlem günü)
 * 2. Sharpe Oranı (Risk-free oran ayarlanabilir)
 * 3. Downside Deviation & Sortino Oranı (Aşağı yönlü riske göre düzeltilmiş getiri)
 * 4. Max Drawdown (Maksimum Tepe-Dip Düşüşü & Süresi)
 * 5. Parametrik & Tarihsel VaR (Value at Risk - %95 ve %99 Güven Düzeyleri)
 * 6. CVaR / Expected Shortfall (Koşullu Riske Maruz Değer)
 * 7. Benchmark Karşılaştırma: Beta (β), Jensen's Alpha (α), Tracking Error, Information Ratio
 */

export type RiskDataQuality = "live" | "insufficient" | "unavailable";

export interface HistoricalPricePoint {
  date: string;
  close: number;
}

export interface RiskEngineConfig {
  /** Yıllık risksiz faiz oranı (%35.0 TRY varsayılanı veya %0.0) */
  riskFreeRatePct?: number;
  /** Yıllık işlem günü sayısı (BIST & Küresel standart: 252) */
  tradingDaysPerYear?: number;
  /** Minimum gerekli veri noktası (gün) */
  minDataPoints?: number;
}

export interface VarCvarMetrics {
  confidence95Pct: {
    parametricVaRPct: number;
    historicalVaRPct: number;
    expectedShortfallPct: number; // CVaR
  };
  confidence99Pct: {
    parametricVaRPct: number;
    historicalVaRPct: number;
    expectedShortfallPct: number; // CVaR
  };
}

export interface BenchmarkMetrics {
  benchmarkSymbol: string;
  beta: number | null;
  jensenAlphaPct: number | null;
  trackingErrorPct: number | null;
  informationRatio: number | null;
  correlationWithBenchmark: number | null;
  rSquared: number | null;
}

export interface ComprehensiveRiskProfile {
  status: RiskDataQuality;
  dataPoints: number;
  startDate?: string;
  endDate?: string;

  // Temel Risk Metrikleri
  volatilityAnnualizedPct: number | null;
  sharpeRatio: number | null;
  sortinoRatio: number | null;
  maxDrawdownPct: number | null;
  maxDrawdownDurationDays: number | null;

  // VaR & CVaR
  varCvar: VarCvarMetrics | null;

  // Benchmark Analizi
  benchmark?: BenchmarkMetrics;

  // Nitel Karnesi & Notlandırma
  riskGrade: "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "NR";
  riskSummary: string;
}

const DEFAULT_CONFIG: Required<RiskEngineConfig> = {
  riskFreeRatePct: 0.0, // Risk-free rate default 0 for excess return calculation unless specified
  tradingDaysPerYear: 252,
  minDataPoints: 20,
};

/**
 * Fiyat serisinden günlük log-getiri serisi türetir: r_t = ln(P_t / P_{t-1})
 */
export function calculateLogReturns(prices: HistoricalPricePoint[]): {
  dates: string[];
  returns: number[];
} {
  if (!prices || prices.length < 2) return { dates: [], returns: [] };

  const sorted = [...prices].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dates: string[] = [];
  const returns: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].close;
    const curr = sorted[i].close;
    if (prev > 0 && curr > 0) {
      dates.push(sorted[i].date);
      returns.push(Math.log(curr / prev));
    }
  }

  return { dates, returns };
}

/**
 * Z-Skoru tablosu (Normal Dağılım)
 */
function getZScore(confidenceLevel: number): number {
  if (confidenceLevel >= 0.99) return 2.326348;
  if (confidenceLevel >= 0.95) return 1.644854;
  if (confidenceLevel >= 0.90) return 1.281552;
  return 1.644854;
}

/**
 * Max Drawdown ve Süresi Hesaplar
 */
export function calculateMaxDrawdown(prices: HistoricalPricePoint[]): {
  maxDrawdownPct: number;
  durationDays: number;
} {
  if (!prices || prices.length < 2) return { maxDrawdownPct: 0, durationDays: 0 };

  const sorted = [...prices].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let peak = sorted[0].close;
  let peakDate = new Date(sorted[0].date).getTime();
  let maxDd = 0;
  let maxDdDuration = 0;

  for (let i = 1; i < sorted.length; i++) {
    const price = sorted[i].close;
    const date = new Date(sorted[i].date).getTime();

    if (price > peak) {
      peak = price;
      peakDate = date;
    } else {
      const dd = (peak - price) / peak;
      if (dd > maxDd) {
        maxDd = dd;
        maxDdDuration = Math.max(0, Math.floor((date - peakDate) / (1000 * 60 * 60 * 24)));
      }
    }
  }

  return {
    maxDrawdownPct: Number((-maxDd * 100).toFixed(2)),
    durationDays: maxDdDuration,
  };
}

/**
 * VaR (Riske Maruz Değer) ve CVaR (Expected Shortfall) Hesaplar
 */
export function calculateVarCvar(dailyReturns: number[]): VarCvarMetrics | null {
  if (!dailyReturns || dailyReturns.length < 20) return null;

  const sortedReturns = [...dailyReturns].sort((a, b) => a - b);
  const n = sortedReturns.length;

  const mean = dailyReturns.reduce((s, v) => s + v, 0) / n;
  const variance = dailyReturns.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  // 1. %95 Güven Düzeyi
  const z95 = getZScore(0.95);
  const parametric95 = -(mean - z95 * stdDev);
  const index95 = Math.floor(n * 0.05);
  const historical95 = -sortedReturns[index95];
  const tailReturns95 = sortedReturns.slice(0, index95 + 1);
  const cvar95 = -(tailReturns95.reduce((s, v) => s + v, 0) / (tailReturns95.length || 1));

  // 2. %99 Güven Düzeyi
  const z99 = getZScore(0.99);
  const parametric99 = -(mean - z99 * stdDev);
  const index99 = Math.floor(n * 0.01);
  const historical99 = -sortedReturns[index99];
  const tailReturns99 = sortedReturns.slice(0, index99 + 1);
  const cvar99 = -(tailReturns99.reduce((s, v) => s + v, 0) / (tailReturns99.length || 1));

  return {
    confidence95Pct: {
      parametricVaRPct: Number((parametric95 * 100).toFixed(2)),
      historicalVaRPct: Number((historical95 * 100).toFixed(2)),
      expectedShortfallPct: Number((cvar95 * 100).toFixed(2)),
    },
    confidence99Pct: {
      parametricVaRPct: Number((parametric99 * 100).toFixed(2)),
      historicalVaRPct: Number((historical99 * 100).toFixed(2)),
      expectedShortfallPct: Number((cvar99 * 100).toFixed(2)),
    },
  };
}

/**
 * Benchmark Karşılaştırma Metrikleri (Beta, Alpha, Tracking Error, IR, R^2)
 */
export function calculateBenchmarkMetrics(
  portfolioReturns: number[],
  benchmarkReturns: number[],
  benchmarkSymbol: string = "XU100.IS",
  config: RiskEngineConfig = {}
): BenchmarkMetrics | null {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const n = Math.min(portfolioReturns.length, benchmarkReturns.length);
  if (n < cfg.minDataPoints) return null;

  const pRet = portfolioReturns.slice(0, n);
  const bRet = benchmarkReturns.slice(0, n);

  const meanP = pRet.reduce((s, v) => s + v, 0) / n;
  const meanB = bRet.reduce((s, v) => s + v, 0) / n;

  let cov = 0;
  let varB = 0;
  let varP = 0;

  const diffSeries: number[] = [];

  for (let i = 0; i < n; i++) {
    const dP = pRet[i] - meanP;
    const dB = bRet[i] - meanB;
    cov += dP * dB;
    varB += dB * dB;
    varP += dP * dP;
    diffSeries.push(pRet[i] - bRet[i]);
  }

  if (varB === 0) return null;

  const beta = cov / varB;
  const r = cov / Math.sqrt(varP * varB || 1);
  const rSquared = Math.pow(r, 2);

  // Annualized returns
  const annReturnP = Math.exp(meanP * cfg.tradingDaysPerYear) - 1;
  const annReturnB = Math.exp(meanB * cfg.tradingDaysPerYear) - 1;
  const rfDecimal = cfg.riskFreeRatePct / 100;

  // Jensen's Alpha = R_p - [R_f + β * (R_m - R_f)]
  const jensenAlpha = annReturnP - (rfDecimal + beta * (annReturnB - rfDecimal));

  // Tracking Error = σ(R_p - R_m) * √252
  const meanDiff = diffSeries.reduce((s, v) => s + v, 0) / n;
  const varDiff = diffSeries.reduce((s, v) => s + Math.pow(v - meanDiff, 2), 0) / (n - 1);
  const trackingErrorDaily = Math.sqrt(varDiff);
  const trackingErrorAnn = trackingErrorDaily * Math.sqrt(cfg.tradingDaysPerYear);

  // Information Ratio = (R_p,ann - R_m,ann) / Tracking Error
  const activeReturn = annReturnP - annReturnB;
  const informationRatio = trackingErrorAnn > 0 ? activeReturn / trackingErrorAnn : 0;

  return {
    benchmarkSymbol,
    beta: Number(beta.toFixed(2)),
    jensenAlphaPct: Number((jensenAlpha * 100).toFixed(2)),
    trackingErrorPct: Number((trackingErrorAnn * 100).toFixed(2)),
    informationRatio: Number(informationRatio.toFixed(2)),
    correlationWithBenchmark: Number(r.toFixed(2)),
    rSquared: Number(rSquared.toFixed(2)),
  };
}

/**
 * Kapsamlı Kantitatif Risk Profili Oluşturur
 */
export function calculateRiskProfile(
  priceSeries: HistoricalPricePoint[],
  benchmarkSeries?: HistoricalPricePoint[],
  benchmarkSymbol: string = "XU100.IS",
  config: RiskEngineConfig = {}
): ComprehensiveRiskProfile {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const emptyProfile = (status: RiskDataQuality, pts = 0): ComprehensiveRiskProfile => ({
    status,
    dataPoints: pts,
    volatilityAnnualizedPct: null,
    sharpeRatio: null,
    sortinoRatio: null,
    maxDrawdownPct: null,
    maxDrawdownDurationDays: null,
    varCvar: null,
    riskGrade: "NR",
    riskSummary: status === "insufficient"
      ? `Yetersiz tarihsel seri (${pts} gün < ${cfg.minDataPoints} gün).`
      : "Tarihsel fiyat serisi bulunamadı.",
  });

  if (!priceSeries || priceSeries.length < 2) {
    return emptyProfile("unavailable");
  }

  const { dates, returns } = calculateLogReturns(priceSeries);
  const n = returns.length;

  if (n < cfg.minDataPoints) {
    return emptyProfile("insufficient", n);
  }

  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  // 1. Mean & Volatility
  const meanReturnDaily = returns.reduce((s, v) => s + v, 0) / n;
  const varianceDaily = returns.reduce((s, v) => s + Math.pow(v - meanReturnDaily, 2), 0) / (n - 1);
  const volDaily = Math.sqrt(varianceDaily);
  const volAnnualizedPct = volDaily * Math.sqrt(cfg.tradingDaysPerYear) * 100;

  // 2. Annualized Return
  const returnAnnualizedPct = (Math.exp(meanReturnDaily * cfg.tradingDaysPerYear) - 1) * 100;

  // 3. Sharpe Ratio
  const excessReturn = returnAnnualizedPct - cfg.riskFreeRatePct;
  const sharpe = volAnnualizedPct > 0 ? excessReturn / volAnnualizedPct : 0;

  // 4. Downside Deviation & Sortino Ratio
  const targetDailyReturn = (cfg.riskFreeRatePct / 100) / cfg.tradingDaysPerYear;
  const downsideSquareSum = returns.reduce((s, r) => {
    const diff = Math.min(0, r - targetDailyReturn);
    return s + diff * diff;
  }, 0);
  const downsideDevDaily = Math.sqrt(downsideSquareSum / n);
  const downsideDevAnnualizedPct = downsideDevDaily * Math.sqrt(cfg.tradingDaysPerYear) * 100;
  const sortino = downsideDevAnnualizedPct > 0 ? excessReturn / downsideDevAnnualizedPct : 0;

  // 5. Max Drawdown
  const { maxDrawdownPct, durationDays } = calculateMaxDrawdown(priceSeries);

  // 6. VaR & CVaR
  const varCvar = calculateVarCvar(returns);

  // 7. Benchmark
  let benchmark: BenchmarkMetrics | undefined;
  if (benchmarkSeries && benchmarkSeries.length >= 2) {
    const { returns: bReturns } = calculateLogReturns(benchmarkSeries);
    const bMetrics = calculateBenchmarkMetrics(returns, bReturns, benchmarkSymbol, cfg);
    if (bMetrics) benchmark = bMetrics;
  }

  // 8. Risk Grade Calculation (Sharpe, Volatility, Max DD combination)
  let riskGrade: ComprehensiveRiskProfile["riskGrade"] = "BBB";
  if (sharpe >= 1.5 && Math.abs(maxDrawdownPct) < 15) riskGrade = "AAA";
  else if (sharpe >= 1.0 && Math.abs(maxDrawdownPct) < 22) riskGrade = "AA";
  else if (sharpe >= 0.6 && Math.abs(maxDrawdownPct) < 30) riskGrade = "A";
  else if (sharpe >= 0.2 && Math.abs(maxDrawdownPct) < 40) riskGrade = "BBB";
  else if (sharpe >= 0) riskGrade = "BB";
  else if (sharpe >= -0.5) riskGrade = "B";
  else riskGrade = "CCC";

  const riskSummary = `Portföy ${n} günlük veri setiyle incelendi. Yıllıklandırılmış volatilite %${volAnnualizedPct.toFixed(1)}, Sharpe oranı ${sharpe.toFixed(2)}, Max DD %${Math.abs(maxDrawdownPct).toFixed(1)}.`;

  return {
    status: "live",
    dataPoints: n,
    startDate,
    endDate,
    volatilityAnnualizedPct: Number(volAnnualizedPct.toFixed(2)),
    sharpeRatio: Number(sharpe.toFixed(2)),
    sortinoRatio: Number(sortino.toFixed(2)),
    maxDrawdownPct: Number(maxDrawdownPct.toFixed(2)),
    maxDrawdownDurationDays: durationDays,
    varCvar,
    benchmark,
    riskGrade,
    riskSummary,
  };
}
