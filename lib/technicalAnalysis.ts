/**
 * Defter — Authentic Mathematical Technical Analysis Engine
 * Calculates indicators strictly from real historical OHLC/Close price arrays.
 * Zero-mock rule compliant: Returns null if data is insufficient (< 15 periods for RSI, < 35 periods for MACD).
 */

export interface TechnicalIndicators {
  rsi14: number | null;
  rsiSignal: "AŞIRI ALIM (RİSK)" | "AŞIRI SATIM (FIRSAT)" | "NÖTR" | null;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    trend: "BOĞA (YUKARI)" | "AYI (AŞAĞI)" | "NÖTR";
  } | null;
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    bandwidthPct: number;
  } | null;
  crossSignal: "ALTIN KESİŞİM (GOLDEN CROSS)" | "ÖLÜM KESİŞİMİ (DEATH CROSS)" | "NÖTR" | null;
  overallScore: {
    score: number; // -100 (Strong Sell) to +100 (Strong Buy)
    verdict: "GÜÇLÜ AL" | "AL" | "NÖTR" | "SAT" | "GÜÇLÜ SAT";
    color: string;
  };
}

/**
 * Relative Strength Index (RSI) using standard Wilder's 14-period smoothing
 */
export function calculateRSI(closes: number[], period: number = 14): number | null {
  if (!closes || closes.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  // First period average
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Smoothed averages for remaining periods
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return Number(rsi.toFixed(2));
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(closes: number[], period: number): number[] {
  if (closes.length < period) return [];
  const k = 2 / (period + 1);
  const emaArray: number[] = [];

  // Initial SMA as first EMA
  let initialSum = 0;
  for (let i = 0; i < period; i++) initialSum += closes[i];
  let prevEma = initialSum / period;
  emaArray.push(prevEma);

  for (let i = period; i < closes.length; i++) {
    const currentEma = closes[i] * k + prevEma * (1 - k);
    emaArray.push(currentEma);
    prevEma = currentEma;
  }

  return emaArray;
}

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(closes: number[], period: number): number | null {
  if (!closes || closes.length < period) return null;
  const slice = closes.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return Number((sum / period).toFixed(2));
}

/**
 * Moving Average Convergence Divergence (MACD 12, 26, 9)
 */
export function calculateMACD(
  closes: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
) {
  if (!closes || closes.length < slowPeriod + signalPeriod) return null;

  const emaFast = calculateEMA(closes, fastPeriod);
  const emaSlow = calculateEMA(closes, slowPeriod);

  const offset = slowPeriod - fastPeriod;
  const macdLineSeries: number[] = [];

  for (let i = 0; i < emaSlow.length; i++) {
    const fastVal = emaFast[i + offset];
    const slowVal = emaSlow[i];
    macdLineSeries.push(fastVal - slowVal);
  }

  if (macdLineSeries.length < signalPeriod) return null;

  const signalLineSeries = calculateEMA(macdLineSeries, signalPeriod);
  const latestMacd = macdLineSeries[macdLineSeries.length - 1];
  const latestSignal = signalLineSeries[signalLineSeries.length - 1];
  const histogram = latestMacd - latestSignal;

  return {
    macdLine: Number(latestMacd.toFixed(2)),
    signalLine: Number(latestSignal.toFixed(2)),
    histogram: Number(histogram.toFixed(2)),
    trend: (histogram > 0.05 ? "BOĞA (YUKARI)" : histogram < -0.05 ? "AYI (AŞAĞI)" : "NÖTR") as "BOĞA (YUKARI)" | "AYI (AŞAĞI)" | "NÖTR",
  };
}

/**
 * Bollinger Bands (20 period, 2 Standard Deviations)
 */
export function calculateBollingerBands(closes: number[], period: number = 20, multiplier: number = 2) {
  if (!closes || closes.length < period) return null;

  const slice = closes.slice(-period);
  const mean = slice.reduce((sum, val) => sum + val, 0) / period;

  const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = mean + multiplier * stdDev;
  const lower = mean - multiplier * stdDev;
  const bandwidthPct = mean > 0 ? ((upper - lower) / mean) * 100 : 0;

  return {
    upper: Number(upper.toFixed(2)),
    middle: Number(mean.toFixed(2)),
    lower: Number(lower.toFixed(2)),
    bandwidthPct: Number(bandwidthPct.toFixed(2)),
  };
}

/**
 * Comprehensive Technical Analysis Assessment
 */
export function performTechnicalAnalysis(closes: number[]): TechnicalIndicators {
  const rsi = calculateRSI(closes, 14);
  let rsiSignal: TechnicalIndicators["rsiSignal"] = "NÖTR";
  if (rsi !== null) {
    if (rsi >= 70) rsiSignal = "AŞIRI ALIM (RİSK)";
    else if (rsi <= 30) rsiSignal = "AŞIRI SATIM (FIRSAT)";
    else rsiSignal = "NÖTR";
  }

  const macd = calculateMACD(closes);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);
  const bb = calculateBollingerBands(closes, 20);

  // Golden / Death Cross
  let crossSignal: TechnicalIndicators["crossSignal"] = "NÖTR";
  if (sma50 !== null && sma200 !== null) {
    if (sma50 > sma200 * 1.01) crossSignal = "ALTIN KESİŞİM (GOLDEN CROSS)";
    else if (sma50 < sma200 * 0.99) crossSignal = "ÖLÜM KESİŞİMİ (DEATH CROSS)";
  }

  // Composite Technical Scoring (-100 to +100)
  let score = 0;
  const latestClose = closes.length > 0 ? closes[closes.length - 1] : 0;

  // 1. RSI Factor
  if (rsi !== null) {
    if (rsi < 30) score += 30; // Oversold -> Buy opportunity
    else if (rsi < 45) score += 15;
    else if (rsi > 70) score -= 30; // Overbought -> Risk
    else if (rsi > 60) score += 10;
  }

  // 2. MACD Factor
  if (macd !== null) {
    if (macd.trend === "BOĞA (YUKARI)") score += 30;
    else if (macd.trend === "AYI (AŞAĞI)") score -= 30;
  }

  // 3. Moving Average Position
  if (sma20 !== null && latestClose > 0) {
    if (latestClose > sma20) score += 20;
    else score -= 20;
  }

  if (crossSignal === "ALTIN KESİŞİM (GOLDEN CROSS)") score += 20;
  else if (crossSignal === "ÖLÜM KESİŞİMİ (DEATH CROSS)") score -= 20;

  // Normalize score between -100 and +100
  score = Math.max(-100, Math.min(100, score));

  let verdict: TechnicalIndicators["overallScore"]["verdict"] = "NÖTR";
  let color = "text-[var(--mist)] border-[var(--mist)] bg-[var(--ink-3)]";

  if (score >= 45) {
    verdict = "GÜÇLÜ AL";
    color = "text-[var(--verdigris)] border-[var(--verdigris)] bg-[rgba(91,140,123,0.15)]";
  } else if (score >= 15) {
    verdict = "AL";
    color = "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
  } else if (score <= -45) {
    verdict = "GÜÇLÜ SAT";
    color = "text-[var(--loss)] border-[var(--loss)] bg-[rgba(163,59,59,0.15)]";
  } else if (score <= -15) {
    verdict = "SAT";
    color = "text-rose-400 border-rose-500/40 bg-rose-500/10";
  }

  return {
    rsi14: rsi,
    rsiSignal,
    macd,
    sma20,
    sma50,
    sma200,
    bollingerBands: bb,
    crossSignal,
    overallScore: {
      score,
      verdict,
      color,
    },
  };
}
