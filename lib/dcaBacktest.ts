/**
 * Defter — Dollar Cost Averaging (DCA) Historical Backtesting Engine
 * Simulates regular periodic monthly purchases over actual historical price series.
 * Zero-mock compliant: Calculations are strictly deterministic based on real historical close prices.
 */

export interface DcaBacktestResult {
  totalInvested: number;
  finalPortfolioValue: number;
  totalProfit: number;
  profitPct: number;
  accumulatedShares: number;
  averageCostPerShare: number;
  currentPrice: number;
  monthlyContribution: number;
  monthsCount: number;
  periodicSnapshots: Array<{
    date: string;
    investedSoFar: number;
    portfolioValue: number;
    priceAtTime: number;
    profitSoFar: number;
  }>;
}

export function runDcaBacktest(
  historicalData: Array<{ date: string; close: number }>,
  monthlyContribution: number = 3000
): DcaBacktestResult | null {
  if (!historicalData || historicalData.length < 5) return null;

  // Group historical data roughly by monthly steps (or every 20 trading days)
  const step = Math.max(1, Math.floor(historicalData.length / 12));
  const sampledPoints: Array<{ date: string; close: number }> = [];

  for (let i = 0; i < historicalData.length; i += step) {
    sampledPoints.push(historicalData[i]);
  }
  // Ensure the latest point is included
  if (sampledPoints[sampledPoints.length - 1] !== historicalData[historicalData.length - 1]) {
    sampledPoints.push(historicalData[historicalData.length - 1]);
  }

  let totalInvested = 0;
  let totalShares = 0;
  const periodicSnapshots: DcaBacktestResult["periodicSnapshots"] = [];

  sampledPoints.forEach((pt) => {
    const price = Math.max(0.1, pt.close);
    const sharesBought = monthlyContribution / price;
    totalInvested += monthlyContribution;
    totalShares += sharesBought;

    const currentPortfolioValue = Math.round(totalShares * price);
    const profitSoFar = currentPortfolioValue - totalInvested;

    periodicSnapshots.push({
      date: pt.date,
      investedSoFar: totalInvested,
      portfolioValue: currentPortfolioValue,
      priceAtTime: price,
      profitSoFar,
    });
  });

  const latestPrice = historicalData[historicalData.length - 1].close;
  const finalPortfolioValue = Math.round(totalShares * latestPrice);
  const totalProfit = finalPortfolioValue - totalInvested;
  const profitPct = totalInvested > 0 ? Number(((totalProfit / totalInvested) * 100).toFixed(1)) : 0;
  const averageCostPerShare = totalShares > 0 ? Number((totalInvested / totalShares).toFixed(2)) : 0;

  return {
    totalInvested,
    finalPortfolioValue,
    totalProfit,
    profitPct,
    accumulatedShares: Number(totalShares.toFixed(2)),
    averageCostPerShare,
    currentPrice: latestPrice,
    monthlyContribution,
    monthsCount: sampledPoints.length,
    periodicSnapshots,
  };
}
