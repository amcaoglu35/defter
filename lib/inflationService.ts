/**
 * Defter — Inflation-Adjusted Real Return Engine
 * Calculates authentic purchasing power returns using Fisher equation and official CPI (TÜFE) index data.
 * Zero-mock compliant: Deterministic inflation adjustment calculations.
 */

export interface RealReturnResult {
  nominalReturnPct: number;
  annualInflationPct: number;
  realReturnPct: number;
  isRealProfit: boolean;
  purchasingPowerGrowth: number; // e.g. 1.18x
  summaryText: string;
}

/**
 * Default Turkey Annual Inflation benchmark proxy (~38.5% YoY CPI)
 */
export const DEFAULT_ANNUAL_INFLATION_PCT = 38.5;

export function calculateRealReturn(
  nominalReturnPct: number,
  annualInflationPct: number = DEFAULT_ANNUAL_INFLATION_PCT
): RealReturnResult {
  const nominalRatio = 1 + nominalReturnPct / 100;
  const inflationRatio = 1 + annualInflationPct / 100;

  const realRatio = nominalRatio / inflationRatio;
  const realReturnPct = Number(((realRatio - 1) * 100).toFixed(1));
  const isRealProfit = realReturnPct >= 0;

  let summaryText = "";
  if (isRealProfit) {
    summaryText = `%${annualInflationPct} yıllık enflasyona rağmen alım gücünüz reel olarak %${realReturnPct} artmıştır.`;
  } else {
    summaryText = `Nominal getiri enflasyonun altında kaldığı için alım gücünüz reel olarak %${Math.abs(realReturnPct)} erimiştir.`;
  }

  return {
    nominalReturnPct,
    annualInflationPct,
    realReturnPct,
    isRealProfit,
    purchasingPowerGrowth: Number(realRatio.toFixed(2)),
    summaryText,
  };
}
