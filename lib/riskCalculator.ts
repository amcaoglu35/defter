/**
 * Defter — Portfolio Risk & Volatility Analytics Engine
 *
 * ⚠️ VERİ KALİTESİ STANDARDI:
 * Bu modülde tüm risk metrikleri gerçek tarihsel günlük getiri serilerinden
 * hesaplanır. Gerçek seri yoksa her metrik açıkça DataQualityStatus.INSUFFICIENT
 * olarak işaretlenir; hiçbir zaman proxy/tahmini değer döndürülmez.
 *
 * Referans formüller:
 * - Annualized Volatility = std_dev(daily_returns) * sqrt(252)
 * - Sharpe = (annualReturn - rfRate) / annualVol
 * - Sortino = (annualReturn - rfRate) / downsideDeviation
 * - Max Drawdown = min( (V_t - peak_t) / peak_t ) over all t
 * - HHI = sum of (weight_i^2) for each holding (i)
 */

import { Basket, Company } from "./mockData";

// ─── Data Quality Types ────────────────────────────────────────────────────

export type DataQualityStatus =
  | "live"            // Gerçek tarihsel seri üzerinden hesaplandı
  | "insufficient"    // Seri yeterli değil (< MIN_DATA_POINTS gün)
  | "unavailable";    // Seri hiç yok

export interface RiskMetricValue {
  value: number | null;
  status: DataQualityStatus;
  /** Hesaplamada kullanılan gün sayısı (seri uzunluğu) */
  dataPoints: number;
  /** Hesaplanan dönem başlangıç tarihi (ISO string) */
  periodStart?: string;
  /** Hesaplanan dönem bitiş tarihi (ISO string) */
  periodEnd?: string;
}

/** En az bu kadar günlük return noktası olmadan hesaplama yapılmaz */
const MIN_DATA_POINTS = 20;

// ─── Public Interfaces ─────────────────────────────────────────────────────

export interface BasketRiskProfile {
  /** Annualized Volatility (e.g. 24.5%) */
  volatilityAnnualizedPct: RiskMetricValue;
  /** Sharpe Ratio */
  sharpeRatio: RiskMetricValue;
  /** Sortino Ratio */
  sortinoRatio: RiskMetricValue;
  /** Maximum Drawdown (negative, e.g. -12.4%) */
  maxDrawdownPct: RiskMetricValue;
  /** Herfindahl-Hirschman Index (0–10 000) — bu her zaman hesaplanabilir */
  hhiConcentration: number;
  diversificationLevel: "Çok Yüksek" | "Yüksek" | "Dengeli" | "Yoğunlaşmış (Riskli)";
  riskGrade: "A+" | "A" | "B" | "C" | "D" | "Veri Yok";
  riskSummary: string;
}

export interface DailyPricePoint {
  date: string;   // ISO "YYYY-MM-DD"
  close: number;
}

export interface HoldingPriceSeries {
  symbol: string;
  /** Ağırlık 0–100 arası (yüzde) */
  weightPercent: number;
  series: DailyPricePoint[];
}

// ─── Core Math Helpers ─────────────────────────────────────────────────────

/**
 * Günlük kapanış fiyatlarından günlük log-return serisi hesaplar.
 */
export function computeDailyReturns(prices: DailyPricePoint[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1].close;
    const curr = prices[i].close;
    if (prev > 0 && curr > 0) {
      returns.push(Math.log(curr / prev));
    }
  }
  return returns;
}

/**
 * Sayı dizisinin aritmetik ortalamasını döndürür.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

/**
 * Sayı dizisinin sample standard deviation'ını (ddof=1) döndürür.
 */
export function stdDev(values: number[], avg?: number): number {
  if (values.length < 2) return 0;
  const mu = avg !== undefined ? avg : mean(values);
  const variance =
    values.reduce((s, v) => s + (v - mu) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Yıllık volatilite hesaplar (günlük std dev * sqrt(252)).
 * Türkiye için 252 işlem günü kullanılır.
 */
export function annualizedVolatility(dailyReturns: number[]): number {
  return stdDev(dailyReturns) * Math.sqrt(252);
}

/**
 * Yıllık getiri hesaplar (CAGR yaklaşımı): (son/ilk)^(252/n) - 1
 * n: return sayısı (gün sayısı - 1)
 */
export function annualizedReturn(
  firstPrice: number,
  lastPrice: number,
  nDays: number
): number {
  if (firstPrice <= 0 || lastPrice <= 0 || nDays <= 0) return 0;
  return Math.pow(lastPrice / firstPrice, 252 / nDays) - 1;
}

/**
 * Downside deviation — Sortino için (hedef = riskFreeRate / 252 günlük)
 * Sadece negatif aşımlar dikkate alınır.
 */
export function downsideDeviation(
  dailyReturns: number[],
  targetDailyReturn: number = 0
): number {
  const negativeExcesses = dailyReturns
    .map((r) => Math.min(0, r - targetDailyReturn))
    .filter((e) => e < 0);

  if (negativeExcesses.length < 2) return 0;
  const variance =
    negativeExcesses.reduce((s, e) => s + e ** 2, 0) / negativeExcesses.length;
  return Math.sqrt(variance) * Math.sqrt(252);
}

/**
 * Maximum Drawdown: Tüm zirvelere göre en büyük düşüşü bulur.
 * Dönüş değeri negatif (örn. -0.124 = %-12.4)
 */
export function maxDrawdown(prices: DailyPricePoint[]): number {
  if (prices.length < 2) return 0;
  let peak = prices[0].close;
  let maxDD = 0;

  for (const p of prices) {
    if (p.close > peak) peak = p.close;
    const dd = (p.close - peak) / peak;
    if (dd < maxDD) maxDD = dd;
  }

  return maxDD;
}

/**
 * Herfindahl-Hirschman Index (0–10 000).
 * Her holdingin normalize edilmiş ağırlığının karesi toplamı.
 */
export function computeHHI(weightPercents: number[]): number {
  const totalWeight = weightPercents.reduce((s, w) => s + w, 0) || 100;
  return weightPercents.reduce((hhi, w) => {
    const norm = (w / totalWeight) * 100;
    return hhi + norm ** 2;
  }, 0);
}

// ─── Portfolio-level aggregation ──────────────────────────────────────────

/**
 * Portföy ağırlıklı günlük return serisi üretir.
 * Tüm holdingları ortak tarih ekseni üzerinde birleştirir;
 * eksik veri olan günler atlanır.
 */
export function buildWeightedPortfolioReturns(
  holdingSeries: HoldingPriceSeries[]
): number[] {
  if (holdingSeries.length === 0) return [];

  const totalWeight = holdingSeries.reduce((s, h) => s + h.weightPercent, 0);
  if (totalWeight <= 0) return [];

  // Her holding için tarih → return map oluştur
  const maps: Map<string, number>[] = holdingSeries.map((h) => {
    const map = new Map<string, number>();
    const returns = computeDailyReturns(h.series);
    for (let i = 0; i < returns.length; i++) {
      const date = h.series[i + 1]?.date;
      if (date) map.set(date, returns[i]);
    }
    return map;
  });

  // Tüm holdinglarda ortak tarihler
  const allDates = [...maps[0].keys()].filter((date) =>
    maps.every((m) => m.has(date))
  ).sort();

  if (allDates.length < MIN_DATA_POINTS) return [];

  return allDates.map((date) => {
    let weightedReturn = 0;
    holdingSeries.forEach((h, idx) => {
      const r = maps[idx].get(date) ?? 0;
      weightedReturn += r * (h.weightPercent / totalWeight);
    });
    return weightedReturn;
  });
}

// ─── Main calculation entry point ─────────────────────────────────────────

/**
 * Portföy risk profilini gerçek tarihsel fiyat serileri üzerinden hesaplar.
 *
 * @param basket           Sepet (holdings + weights)
 * @param companies        Şirket listesi (metadata)
 * @param holdingSeries    Her holding için tarihsel fiyat serisi (API'den çekilmiş)
 * @param riskFreeRatePct  Yıllık risksiz faiz oranı (örn. 42.5 = %42.5)
 */
export function calculateBasketRiskProfile(
  basket: Basket,
  companies: Company[],
  holdingSeries: HoldingPriceSeries[],
  riskFreeRatePct: number
): BasketRiskProfile {
  const unavailableMetric = (n = 0): RiskMetricValue => ({
    value: null,
    status: "unavailable",
    dataPoints: n,
  });

  const insufficientMetric = (n: number): RiskMetricValue => ({
    value: null,
    status: "insufficient",
    dataPoints: n,
  });

  // ── HHI (weights only, no price series needed) ──────────────────────────
  const holdings = basket.holdings ?? [];
  const weightPercents = holdings.map((h) => h.weightPercent ?? 0);
  const hhi = computeHHI(weightPercents);
  const n = holdings.length;

  let diversificationLevel: BasketRiskProfile["diversificationLevel"] =
    "Dengeli";
  if (hhi < 1500 && n >= 6) diversificationLevel = "Çok Yüksek";
  else if (hhi < 2500 && n >= 4) diversificationLevel = "Yüksek";
  else if (hhi < 4000) diversificationLevel = "Dengeli";
  else diversificationLevel = "Yoğunlaşmış (Riskli)";

  // ── Eğer seri yoksa tüm metrikleri "unavailable" dön ───────────────────
  if (!holdingSeries || holdingSeries.length === 0) {
    return {
      volatilityAnnualizedPct: unavailableMetric(),
      sharpeRatio: unavailableMetric(),
      sortinoRatio: unavailableMetric(),
      maxDrawdownPct: unavailableMetric(),
      hhiConcentration: Math.round(hhi),
      diversificationLevel,
      riskGrade: "Veri Yok",
      riskSummary:
        "Risk metrikleri için tarihsel fiyat verisi henüz yüklenmedi. Sepet detay sayfasında fiyat yenilemesi yaparak tekrar deneyin.",
    };
  }

  // ── Ağırlıklı portföy return serisi ────────────────────────────────────
  const portfolioReturns = buildWeightedPortfolioReturns(holdingSeries);

  if (portfolioReturns.length < MIN_DATA_POINTS) {
    return {
      volatilityAnnualizedPct: insufficientMetric(portfolioReturns.length),
      sharpeRatio: insufficientMetric(portfolioReturns.length),
      sortinoRatio: insufficientMetric(portfolioReturns.length),
      maxDrawdownPct: insufficientMetric(portfolioReturns.length),
      hhiConcentration: Math.round(hhi),
      diversificationLevel,
      riskGrade: "Veri Yok",
      riskSummary: `Risk hesabı için en az ${MIN_DATA_POINTS} günlük ortak veri gerekiyor. Mevcut: ${portfolioReturns.length} gün.`,
    };
  }

  const dataPoints = portfolioReturns.length;

  // Tüm serilerden en erken ve en geç tarih (metadata)
  const allDates = holdingSeries
    .flatMap((h) => h.series.map((p) => p.date))
    .sort();
  const periodStart = allDates[0];
  const periodEnd = allDates[allDates.length - 1];

  // ── Volatilite ──────────────────────────────────────────────────────────
  const annVol = annualizedVolatility(portfolioReturns);
  const volatilityAnnualizedPct: RiskMetricValue = {
    value: parseFloat((annVol * 100).toFixed(2)),
    status: "live",
    dataPoints,
    periodStart,
    periodEnd,
  };

  // ── Portföy yıllık getiri (en iyi birleşik seriden proxy) ──────────────
  // Gerçek equity curve olmadığından basket.totalProfitPercent üzerinden
  // CAGR hesaplamak yanıltıcı olabilir; return mean kullanıyoruz
  const dailyMeanReturn = mean(portfolioReturns);
  const annReturn = dailyMeanReturn * 252; // yaklaşık (log-return için)

  const rfDailyRate = riskFreeRatePct / 100 / 252;
  const rfAnnual = riskFreeRatePct / 100;

  // ── Sharpe ─────────────────────────────────────────────────────────────
  const sharpeVal =
    annVol > 0 ? (annReturn - rfAnnual) / annVol : 0;
  const sharpeRatio: RiskMetricValue = {
    value: parseFloat(sharpeVal.toFixed(3)),
    status: "live",
    dataPoints,
    periodStart,
    periodEnd,
  };

  // ── Sortino ─────────────────────────────────────────────────────────────
  const downDev = downsideDeviation(portfolioReturns, rfDailyRate);
  const sortinoVal =
    downDev > 0 ? (annReturn - rfAnnual) / downDev : 0;
  const sortinoRatio: RiskMetricValue = {
    value: parseFloat(sortinoVal.toFixed(3)),
    status: "live",
    dataPoints,
    periodStart,
    periodEnd,
  };

  // ── Max Drawdown ────────────────────────────────────────────────────────
  // Portföy için tam fiyat serisi yok; kümülatif return serisi kullanıyoruz
  const cumPrices: DailyPricePoint[] = [{ date: "t0", close: 100 }];
  let cumVal = 100;
  for (let i = 0; i < portfolioReturns.length; i++) {
    cumVal = cumVal * Math.exp(portfolioReturns[i]);
    cumPrices.push({
      date: holdingSeries[0]?.series[i + 1]?.date ?? `t${i + 1}`,
      close: cumVal,
    });
  }
  const maxDD = maxDrawdown(cumPrices);
  const maxDrawdownPct: RiskMetricValue = {
    value: parseFloat((maxDD * 100).toFixed(2)),
    status: "live",
    dataPoints,
    periodStart,
    periodEnd,
  };

  // ── Risk Grade ──────────────────────────────────────────────────────────
  let riskGrade: BasketRiskProfile["riskGrade"] = "B";
  const sharpeNum = sharpeVal;
  const ddNum = Math.abs(maxDD * 100);

  if (sharpeNum > 1.2 && hhi < 2500 && ddNum < 18) riskGrade = "A+";
  else if (sharpeNum > 0.5 && hhi < 3500) riskGrade = "A";
  else if (sharpeNum >= 0) riskGrade = "B";
  else if (sharpeNum > -1.0) riskGrade = "C";
  else riskGrade = "D";

  const riskSummary =
    diversificationLevel === "Çok Yüksek" || diversificationLevel === "Yüksek"
      ? `Sepet ${n} farklı varlıkla güçlü bir risk dağılımına sahiptir (HHI: ${Math.round(hhi)}). ` +
        `Yıllık volatilite %${(annVol * 100).toFixed(1)}, Sharpe ${sharpeVal.toFixed(2)}.`
      : diversificationLevel === "Dengeli"
      ? `Sepet dengeli bir ağırlık yapısına sahip. Maks. düşüş: %${ddNum.toFixed(1)}, Volatilite: %${(annVol * 100).toFixed(1)}.`
      : `Sepette yoğunlaşma riski var (HHI: ${Math.round(hhi)}). Daha fazla çeşitlendirme önerilir.`;

  return {
    volatilityAnnualizedPct,
    sharpeRatio,
    sortinoRatio,
    maxDrawdownPct,
    hhiConcentration: Math.round(hhi),
    diversificationLevel,
    riskGrade,
    riskSummary,
  };
}

/**
 * Gerçek veri olmadığında tüm metriklerin "Veri Yok" durumunu gösteren
 * profil döndürür. Kullanıcıya yanlış değer gösterilmez.
 */
export function emptyRiskProfile(): BasketRiskProfile {
  const noData: RiskMetricValue = { value: null, status: "unavailable", dataPoints: 0 };
  return {
    volatilityAnnualizedPct: noData,
    sharpeRatio: noData,
    sortinoRatio: noData,
    maxDrawdownPct: noData,
    hhiConcentration: 0,
    diversificationLevel: "Dengeli",
    riskGrade: "Veri Yok",
    riskSummary: "Risk profili için tarihsel fiyat verisi gereklidir.",
  };
}
