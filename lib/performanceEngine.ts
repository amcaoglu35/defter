/**
 * Defter — Kurumsal Performans Hesaplama Motoru (Performance Engine)
 *
 * GIPS (Global Investment Performance Standards) uyumlu getiri metotları:
 *
 * 1. TWRR (Time-Weighted Rate of Return / Zaman Ağırlıklı Getiri):
 *    Portföy yöneticisinin veya stratejinin gerçek getirisini ölçer.
 *    Dış nakit giriş ve çıkışlarının (para yatırma/çekme) büyüklük etkisini nötralize eder.
 *    Formül: R_TWRR = ∏ (1 + R_sub) - 1
 *
 * 2. MWRR / IRR (Money-Weighted Rate of Return / İç Verim Oranı):
 *    Yatırımcının cebine yansıyan gerçek getirisini ölçer (zamanlama başarısı).
 *    Newton-Raphson numerik algoritması ile çözülür:
 *    NPV(r) = ∑ [ CF_t / (1 + r)^(t / 365.25) ] - V_end = 0
 *
 * 3. Simple Return (Basit Nominal Getiri):
 *    (Son Değer - Toplam Yatırılan Net Sermaye) / Toplam Yatırılan Net Sermaye
 */

export interface CashFlowEvent {
  date: string;
  /** Pozitif: Portföye para yatırma / Negatif: Portföyden para çekme */
  amount: number;
}

export interface ValuationSnapshot {
  date: string;
  portfolioValue: number;
  cashFlowOnDate?: number;
}

export interface PerformanceMetricsResult {
  /** Basit Nominal Getiri (%) */
  simpleReturnPct: number;
  /** Zaman Ağırlıklı Getiri / TWRR (%) */
  twrrPct: number;
  /** Yıllıklandırılmış TWRR (%) (Dönem > 365 gün ise) */
  annualizedTwrrPct?: number;
  /** Para Ağırlıklı Getiri / MWRR / Yıllık IRR (%) */
  mwrrPct: number | null;
  /** Toplam Net Yatırılan Sermaye (₺) */
  netInvestedCapital: number;
  /** Başlangıç Portföy Değeri (₺) */
  startValue: number;
  /** Bitiş Portföy Değeri (₺) */
  endValue: number;
  /** Net Kâr / Zarar (₺) */
  netGainLoss: number;
  /** Analiz Dönemi Gün Sayısı */
  periodDays: number;
  /** Numerik Çözüm Durumu */
  mwrrConvergence: "converged" | "failed" | "not_enough_data";
}

/**
 * Newton-Raphson algoritması ile MWRR (Yıllıklandırılmış IRR) hesaplar.
 *
 * @param cashFlows  Tarih ve nakit akış tutarları listesi
 * @param startValue Başlangıç portföy değeri
 * @param startDate  Başlangıç tarihi (YYYY-MM-DD)
 * @param endValue   Bitiş portföy değeri
 * @param endDate    Bitiş tarihi (YYYY-MM-DD)
 */
export function calculateMWRR(
  cashFlows: CashFlowEvent[],
  startValue: number,
  startDate: string,
  endValue: number,
  endDate: string
): { mwrrPct: number | null; convergence: "converged" | "failed" | "not_enough_data" } {
  const t0 = new Date(startDate).getTime();
  const tEnd = new Date(endDate).getTime();
  const totalDays = (tEnd - t0) / (1000 * 60 * 60 * 24);

  if (totalDays <= 0 || (startValue <= 0 && cashFlows.length === 0 && endValue <= 0)) {
    return { mwrrPct: null, convergence: "not_enough_data" };
  }

  // Tüm nakit hareketlerini normalize et:
  // t=0'da başlangıç değeri yatırılmış gibi (pozitif CF)
  // t=tEnd'de bitiş değeri çekilmiş gibi (negatif CF)
  interface NormalizedCF {
    yearFraction: number;
    amount: number;
  }

  const normalizedFlows: NormalizedCF[] = [];

  if (startValue > 0) {
    normalizedFlows.push({ yearFraction: 0, amount: startValue });
  }

  for (const cf of cashFlows) {
    const t = new Date(cf.date).getTime();
    const days = (t - t0) / (1000 * 60 * 60 * 24);
    if (days >= 0 && days <= totalDays) {
      normalizedFlows.push({ yearFraction: days / 365.25, amount: cf.amount });
    }
  }

  // Bitiş değeri çıkış olarak modellenir (portföyü tasfiye edip nakde dönme)
  const finalYearFraction = totalDays / 365.25;
  normalizedFlows.push({ yearFraction: finalYearFraction, amount: -endValue });

  // Newton-Raphson Solver
  // f(r) = ∑ [ CF_i * (1 + r)^(-t_i) ]
  // f'(r) = ∑ [ -t_i * CF_i * (1 + r)^(-t_i - 1) ]
  let r = 0.1; // İlk tahmin: %10
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let iter = 0; iter < maxIterations; iter++) {
    // r < -0.9999 ise patlama önleme
    if (r <= -0.9999) r = -0.99;

    let fVal = 0;
    let fPrime = 0;

    for (const flow of normalizedFlows) {
      const base = 1 + r;
      const t = flow.yearFraction;
      const discount = Math.pow(base, -t);
      fVal += flow.amount * discount;
      if (base > 0) {
        fPrime += -t * flow.amount * Math.pow(base, -t - 1);
      }
    }

    if (Math.abs(fVal) < tolerance) {
      const mwrrAnnualPct = Number((r * 100).toFixed(2));
      return { mwrrPct: mwrrAnnualPct, convergence: "converged" };
    }

    if (Math.abs(fPrime) < 1e-12) {
      break; // Türev sıfıra çok yakın, yön bulunamıyor
    }

    const nextR = r - fVal / fPrime;
    // Aşırı sıçramaları sınırla
    if (Math.abs(nextR - r) > 2.0) {
      r = r + Math.sign(nextR - r) * 0.5;
    } else {
      r = nextR;
    }
  }

  // İkincil deneme: Basit bisection fallback
  let low = -0.99;
  let high = 5.0;
  const evalAt = (rate: number) =>
    normalizedFlows.reduce((sum, f) => sum + f.amount * Math.pow(1 + rate, -f.yearFraction), 0);

  const fLow = evalAt(low);
  const fHigh = evalAt(high);

  if (fLow * fHigh <= 0) {
    for (let i = 0; i < 60; i++) {
      const mid = (low + high) / 2;
      const fMid = evalAt(mid);
      if (Math.abs(fMid) < tolerance) {
        return { mwrrPct: Number((mid * 100).toFixed(2)), convergence: "converged" };
      }
      if (fLow * fMid < 0) {
        high = mid;
      } else {
        low = mid;
      }
    }
    const finalMid = (low + high) / 2;
    return { mwrrPct: Number((finalMid * 100).toFixed(2)), convergence: "converged" };
  }

  return { mwrrPct: null, convergence: "failed" };
}

/**
 * GIPS standardına uygun TWRR (Zaman Ağırlıklı Getiri) hesaplar.
 *
 * @param snapshots  Tarih sıralı portföy değer ve nakit akış kesitleri
 */
export function calculateTWRR(
  snapshots: ValuationSnapshot[]
): {
  twrrPct: number;
  annualizedTwrrPct?: number;
  subPeriodReturns: Array<{ date: string; returnPct: number }>;
} {
  if (!snapshots || snapshots.length < 2) {
    return { twrrPct: 0, subPeriodReturns: [] };
  }

  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let cumulativeCompound = 1.0;
  const subPeriodReturns: Array<{ date: string; returnPct: number }> = [];

  for (let i = 1; i < sorted.length; i++) {
    const startVal = sorted[i - 1].portfolioValue;
    const endVal = sorted[i].portfolioValue;
    const cf = sorted[i].cashFlowOnDate ?? 0;

    if (startVal > 0) {
      // GIPS Formülü: Alt dönem getirisi = (Bitiş Değeri - Gün İçi Nakit Akışı) / Başlangıç Değeri - 1
      const subReturn = (endVal - cf) / startVal - 1;
      cumulativeCompound *= 1 + subReturn;
      subPeriodReturns.push({
        date: sorted[i].date,
        returnPct: Number((subReturn * 100).toFixed(4)),
      });
    }
  }

  const twrr = cumulativeCompound - 1;
  const twrrPct = Number((twrr * 100).toFixed(2));

  // Yıllıklandırma: Süre 365 günden uzunsa
  const t0 = new Date(sorted[0].date).getTime();
  const tN = new Date(sorted[sorted.length - 1].date).getTime();
  const totalDays = (tN - t0) / (1000 * 60 * 60 * 24);

  let annualizedTwrrPct: number | undefined;
  if (totalDays > 365 && cumulativeCompound > 0) {
    const years = totalDays / 365.25;
    const annRate = Math.pow(cumulativeCompound, 1 / years) - 1;
    annualizedTwrrPct = Number((annRate * 100).toFixed(2));
  }

  return {
    twrrPct,
    annualizedTwrrPct,
    subPeriodReturns,
  };
}

/**
 * Portföy için kapsamlı TWRR, MWRR ve Basit Getiri analiz raporu üretir.
 */
export function calculateComprehensivePerformance(
  snapshots: ValuationSnapshot[],
  cashFlows: CashFlowEvent[] = []
): PerformanceMetricsResult {
  if (!snapshots || snapshots.length === 0) {
    return {
      simpleReturnPct: 0,
      twrrPct: 0,
      mwrrPct: null,
      netInvestedCapital: 0,
      startValue: 0,
      endValue: 0,
      netGainLoss: 0,
      periodDays: 0,
      mwrrConvergence: "not_enough_data",
    };
  }

  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const t0 = new Date(first.date).getTime();
  const tN = new Date(last.date).getTime();
  const periodDays = Math.max(0, Math.floor((tN - t0) / (1000 * 60 * 60 * 24)));

  const netExternalCashFlow = cashFlows.reduce((s, c) => s + c.amount, 0);
  const netInvestedCapital = first.portfolioValue + netExternalCashFlow;
  const netGainLoss = last.portfolioValue - netInvestedCapital;
  const simpleReturnPct =
    netInvestedCapital > 0 ? Number(((netGainLoss / netInvestedCapital) * 100).toFixed(2)) : 0;

  const twrrRes = calculateTWRR(sorted);
  const mwrrRes = calculateMWRR(
    cashFlows,
    first.portfolioValue,
    first.date,
    last.portfolioValue,
    last.date
  );

  return {
    simpleReturnPct,
    twrrPct: twrrRes.twrrPct,
    annualizedTwrrPct: twrrRes.annualizedTwrrPct,
    mwrrPct: mwrrRes.mwrrPct,
    netInvestedCapital: Number(netInvestedCapital.toFixed(2)),
    startValue: Number(first.portfolioValue.toFixed(2)),
    endValue: Number(last.portfolioValue.toFixed(2)),
    netGainLoss: Number(netGainLoss.toFixed(2)),
    periodDays,
    mwrrConvergence: mwrrRes.convergence,
  };
}
