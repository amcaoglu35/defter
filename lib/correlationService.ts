/**
 * Defter — Pearson Korelasyon ve Risk Çeşitlendirme Servisi
 *
 * ⚠️ VERİ KALİTESİ STANDARDI:
 * Korelasyon, SADECE gerçek günlük fiyat serilerinden Pearson formülüyle hesaplanır.
 * Gerçek seri yoksa korelasyon "Veri Yok" olarak raporlanır; sektör tabanlı
 * tahmini sabitler döndürülmez.
 */

export type CorrelationStatus = "live" | "insufficient" | "unavailable";

export interface CorrelationResult {
  symbolA: string;
  symbolB: string;
  /** Pearson r, -1.00 ile +1.00 arasında. Null ise hesaplanamadı. */
  correlation: number | null;
  status: CorrelationStatus;
  dataPoints: number;
  colorClass: string;
}

/** En az bu kadar ortak günlük return noktası olmadan hesaplama yapılmaz */
const MIN_CORRELATION_POINTS = 20;

/**
 * İki sayı dizisinden Pearson korelasyon katsayısı hesaplar.
 * Dizi uzunlukları eşit değilse ortak kısmen kullanılır.
 */
export function computePearsonCorrelation(
  seriesA: number[],
  seriesB: number[]
): number {
  const n = Math.min(seriesA.length, seriesB.length);
  if (n < 2) return 0;

  const a = seriesA.slice(0, n);
  const b = seriesB.slice(0, n);

  const meanA = a.reduce((s, v) => s + v, 0) / n;
  const meanB = b.reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let denA = 0;
  let denB = 0;

  for (let i = 0; i < n; i++) {
    const dA = a[i] - meanA;
    const dB = b[i] - meanB;
    num += dA * dB;
    denA += dA * dA;
    denB += dB * dB;
  }

  const den = Math.sqrt(denA * denB);
  if (den === 0) return 0;
  const r = num / den;
  return Number(Math.max(-1, Math.min(1, r)).toFixed(4));
}

/**
 * İki günlük kapanış fiyat serisinden log-return serileri türetir ve
 * Pearson korelasyonunu hesaplar.
 *
 * @param pricesA  [{date, close}] dizisi
 * @param pricesB  [{date, close}] dizisi
 * @returns        CorrelationResult (status ile birlikte)
 */
export function computeCorrelationFromPriceSeries(
  symbolA: string,
  symbolB: string,
  pricesA: Array<{ date: string; close: number }>,
  pricesB: Array<{ date: string; close: number }>
): CorrelationResult {
  const noData = (status: CorrelationStatus, pts = 0): CorrelationResult => ({
    symbolA,
    symbolB,
    correlation: null,
    status,
    dataPoints: pts,
    colorClass: "bg-[var(--ink-3)] text-[var(--mist)]",
  });

  if (!pricesA || pricesA.length < 2 || !pricesB || pricesB.length < 2) {
    return noData("unavailable");
  }

  // Her iki serinin de bulunduğu ortak tarihler üzerinde çalış
  const mapB = new Map(pricesB.map((p) => [p.date, p.close]));

  const returnsA: number[] = [];
  const returnsB: number[] = [];

  for (let i = 1; i < pricesA.length; i++) {
    const dateA = pricesA[i].date;
    const prevA = pricesA[i - 1].close;
    const currA = pricesA[i].close;
    const currB = mapB.get(dateA);

    // Önceki günün B fiyatı da lazım (return için)
    const prevDate = pricesA[i - 1].date;
    const prevB = mapB.get(prevDate);

    if (
      prevA > 0 && currA > 0 &&
      currB !== undefined && currB > 0 &&
      prevB !== undefined && prevB > 0
    ) {
      returnsA.push(Math.log(currA / prevA));
      returnsB.push(Math.log(currB / prevB));
    }
  }

  const pts = returnsA.length;

  if (pts < MIN_CORRELATION_POINTS) {
    return noData("insufficient", pts);
  }

  const r = computePearsonCorrelation(returnsA, returnsB);

  return {
    symbolA,
    symbolB,
    correlation: Number(r.toFixed(2)),
    status: "live",
    dataPoints: pts,
    colorClass: getCorrelationColorClass(r),
  };
}

/**
 * Korelasyon katsayısına göre Tailwind renk sınıfı döndürür.
 * Değer null ise nötr (mist) sınıf döner.
 */
export function getCorrelationColorClass(r: number | null): string {
  if (r === null) return "bg-[var(--ink-3)] text-[var(--mist)]";
  if (r >= 0.8) return "bg-rose-500/25 text-rose-300 font-bold";
  if (r >= 0.5) return "bg-amber-500/20 text-amber-300";
  if (r >= 0.2) return "bg-cyan-500/15 text-cyan-300";
  if (r >= 0) return "bg-emerald-500/20 text-emerald-300 font-bold";
  return "bg-purple-500/25 text-purple-300 font-bold";
}

/**
 * Tüm holdingların pairwise korelasyon matrisini hesaplar.
 * Fiyat serisi olmayan veya yetersiz olan çiftler için status: "unavailable"
 * döndürülür; sektörel tahmini değerler kullanılmaz.
 *
 * @param symbols       Sembol listesi (sıralı)
 * @param seriesMap     Sembol → fiyat serisi map'i
 */
export function buildCorrelationMatrix(
  symbols: string[],
  seriesMap: Map<string, Array<{ date: string; close: number }>>
): CorrelationResult[] {
  const results: CorrelationResult[] = [];

  for (let i = 0; i < symbols.length; i++) {
    for (let j = i + 1; j < symbols.length; j++) {
      const symA = symbols[i];
      const symB = symbols[j];
      const serA = seriesMap.get(symA) ?? [];
      const serB = seriesMap.get(symB) ?? [];

      results.push(
        computeCorrelationFromPriceSeries(symA, symB, serA, serB)
      );
    }
  }

  return results;
}

/**
 * Aynı sembol çiftinin korelasyonu her zaman 1.0'dir.
 */
export function selfCorrelationResult(symbol: string): CorrelationResult {
  return {
    symbolA: symbol,
    symbolB: symbol,
    correlation: 1.0,
    status: "live",
    dataPoints: 0,
    colorClass: "bg-rose-500/25 text-rose-300 font-bold",
  };
}
