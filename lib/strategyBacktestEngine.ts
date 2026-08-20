import { fetchHistoricalDailyCloses } from "./aiService";
import {
  calculateRSI,
  calculateSMA,
  calculateMACD,
  calculateBollingerBands,
} from "./technicalAnalysis";
import { getSymbolTicker } from "./liveSymbols";

export interface StrategyRule {
  indicator: "RSI" | "SMA_CROSS" | "MACD" | "BOLLINGER" | "PRICE_CHANGE_PCT";
  condition: "BELOW" | "ABOVE" | "CROSSES_UP" | "CROSSES_DOWN";
  value?: number; // e.g. 30 for RSI, 0 for MACD histogram
  period?: number; // e.g. 14 for RSI, 50 for SMA
  secondaryPeriod?: number; // e.g. 200 for SMA Cross
}

export interface TradingStrategy {
  name: string;
  description?: string;
  entryRules: StrategyRule[]; // AND logic
  exitRules: StrategyRule[];  // OR logic (any exit trigger closes position)
  stopLossPct?: number;       // e.g. -8 => sell if current price is <= 8% below entry
  takeProfitPct?: number;     // e.g. 20 => sell if current price is >= 20% above entry
}

export interface TradeLogEntry {
  id: string;
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
  exitReason: "KURAL_ÇIKIŞI" | "STOP_LOSS" | "TAKE_PROFIT" | "DÖNEM_SONU";
  durationDays: number;
}

export interface DailyEquityPoint {
  date: string;
  price: number;
  equity: number;
  benchmarkEquity: number;
  inPosition: boolean;
  signal?: "BUY" | "SELL";
}

export interface StrategyBacktestResult {
  symbol: string;
  strategyName: string;
  periodMonths: number;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturnPct: number;
  benchmarkReturnPct: number;
  alphaPct: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePct: number;
  avgTradeReturnPct: number;
  profitFactor: number;
  isDataSufficient: boolean;
  warningMessage?: string;
  equityCurve: DailyEquityPoint[];
  tradeLog: TradeLogEntry[];
}

export const PRESET_STRATEGIES: Record<string, TradingStrategy> = {
  rsi_mean_reversion: {
    name: "RSI Ortalamaya Dönüş",
    description: "Aşırı satım (RSI < 30) seviyesinde alım yapar, aşırı alım (RSI > 70) bölgesinde veya %15 kâr hedefinde satar.",
    entryRules: [{ indicator: "RSI", condition: "BELOW", value: 30, period: 14 }],
    exitRules: [{ indicator: "RSI", condition: "ABOVE", value: 70, period: 14 }],
    stopLossPct: -7,
    takeProfitPct: 18,
  },
  golden_cross: {
    name: "50 / 200 Altın Kesişim (Golden Cross)",
    description: "50 günlük hareketli ortalama 200 günlüğü yukarı kestiğinde alım yapar, aşağı kırdığında pozisyonu kapatır.",
    entryRules: [{ indicator: "SMA_CROSS", condition: "CROSSES_UP", period: 50, secondaryPeriod: 200 }],
    exitRules: [{ indicator: "SMA_CROSS", condition: "CROSSES_DOWN", period: 50, secondaryPeriod: 200 }],
    stopLossPct: -10,
    takeProfitPct: 40,
  },
  bollinger_bounce: {
    name: "Bollinger Bant Sıçraması",
    description: "Fiyat alt Bollinger bandının altına sarktığında tepki alımı yapar, üst banda ulaştığında kâr realize eder.",
    entryRules: [{ indicator: "BOLLINGER", condition: "BELOW", period: 20 }],
    exitRules: [{ indicator: "BOLLINGER", condition: "ABOVE", period: 20 }],
    stopLossPct: -6,
    takeProfitPct: 15,
  },
  macd_momentum: {
    name: "MACD Trend & Momentum Takibi",
    description: "MACD histogramı pozitif bölgeye geçip boğa trendi başladığında alım yapar, momentum negatife döndüğünde çıkar.",
    entryRules: [{ indicator: "MACD", condition: "CROSSES_UP", value: 0 }],
    exitRules: [{ indicator: "MACD", condition: "CROSSES_DOWN", value: 0 }],
    stopLossPct: -8,
    takeProfitPct: 25,
  },
};

/**
 * Evaluates whether a specific strategy rule is met on day index `i`.
 */
function evaluateRule(rule: StrategyRule, closesSlice: number[], prevClosesSlice?: number[]): boolean {
  if (!closesSlice || closesSlice.length < 2) return false;
  const currentPrice = closesSlice[closesSlice.length - 1];

  switch (rule.indicator) {
    case "RSI": {
      const period = rule.period || 14;
      const rsi = calculateRSI(closesSlice, period);
      if (rsi === null) return false;
      const threshold = rule.value ?? 30;

      if (rule.condition === "BELOW") return rsi < threshold;
      if (rule.condition === "ABOVE") return rsi > threshold;
      if (rule.condition === "CROSSES_UP" && prevClosesSlice) {
        const prevRsi = calculateRSI(prevClosesSlice, period);
        return prevRsi !== null && prevRsi < threshold && rsi >= threshold;
      }
      if (rule.condition === "CROSSES_DOWN" && prevClosesSlice) {
        const prevRsi = calculateRSI(prevClosesSlice, period);
        return prevRsi !== null && prevRsi > threshold && rsi <= threshold;
      }
      return false;
    }

    case "SMA_CROSS": {
      const fastP = rule.period || 50;
      const slowP = rule.secondaryPeriod || 200;
      const fastSma = calculateSMA(closesSlice, fastP);
      const slowSma = calculateSMA(closesSlice, slowP);
      if (fastSma === null || slowSma === null) return false;

      if (rule.condition === "CROSSES_UP" && prevClosesSlice) {
        const prevFast = calculateSMA(prevClosesSlice, fastP);
        const prevSlow = calculateSMA(prevClosesSlice, slowP);
        return prevFast !== null && prevSlow !== null && prevFast <= prevSlow && fastSma > slowSma;
      }
      if (rule.condition === "CROSSES_DOWN" && prevClosesSlice) {
        const prevFast = calculateSMA(prevClosesSlice, fastP);
        const prevSlow = calculateSMA(prevClosesSlice, slowP);
        return prevFast !== null && prevSlow !== null && prevFast >= prevSlow && fastSma < slowSma;
      }
      if (rule.condition === "ABOVE") return fastSma > slowSma;
      if (rule.condition === "BELOW") return fastSma < slowSma;
      return false;
    }

    case "BOLLINGER": {
      const period = rule.period || 20;
      const bb = calculateBollingerBands(closesSlice, period);
      if (!bb) return false;

      if (rule.condition === "BELOW") return currentPrice <= bb.lower;
      if (rule.condition === "ABOVE") return currentPrice >= bb.upper;
      return false;
    }

    case "MACD": {
      const macd = calculateMACD(closesSlice);
      if (!macd) return false;

      if (rule.condition === "CROSSES_UP" && prevClosesSlice) {
        const prevMacd = calculateMACD(prevClosesSlice);
        return prevMacd !== null && prevMacd.histogram <= 0 && macd.histogram > 0;
      }
      if (rule.condition === "CROSSES_DOWN" && prevClosesSlice) {
        const prevMacd = calculateMACD(prevClosesSlice);
        return prevMacd !== null && prevMacd.histogram >= 0 && macd.histogram < 0;
      }
      if (rule.condition === "ABOVE") return macd.histogram > (rule.value ?? 0);
      if (rule.condition === "BELOW") return macd.histogram < (rule.value ?? 0);
      return false;
    }

    case "PRICE_CHANGE_PCT": {
      const period = rule.period || 1;
      if (closesSlice.length <= period) return false;
      const pastPrice = closesSlice[closesSlice.length - 1 - period];
      const changePct = ((currentPrice - pastPrice) / pastPrice) * 100;
      const threshold = rule.value ?? 0;

      if (rule.condition === "ABOVE") return changePct > threshold;
      if (rule.condition === "BELOW") return changePct < threshold;
      return false;
    }

    default:
      return false;
  }
}

/**
 * Runs a complete authentic backtest simulation of a trading strategy on real historical daily price closes.
 */
export async function runStrategyBacktest(
  symbol: string,
  strategy: TradingStrategy,
  periodMonths: number = 12,
  initialCapital: number = 100000,
  customHistoricalCloses?: Array<{ date: string; close: number }>
): Promise<StrategyBacktestResult> {
  const cleanSymbol = symbol.toUpperCase().trim();
  const ticker = getSymbolTicker(cleanSymbol);

  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - periodMonths);

  let quotes: Array<{ date: string; close: number }> = [];
  if (customHistoricalCloses && customHistoricalCloses.length > 0) {
    quotes = customHistoricalCloses;
  } else {
    quotes = await fetchHistoricalDailyCloses(ticker, startDate, now);
  }

  // Zero-Mock Data Rule: Fail-safe verification if data is insufficient (< 30 daily bars)
  if (!quotes || quotes.length < 30) {
    return {
      symbol: cleanSymbol,
      strategyName: strategy.name,
      periodMonths,
      startDate: startDate.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
      initialCapital,
      finalCapital: initialCapital,
      totalReturnPct: 0,
      benchmarkReturnPct: 0,
      alphaPct: 0,
      maxDrawdownPct: 0,
      sharpeRatio: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRatePct: 0,
      avgTradeReturnPct: 0,
      profitFactor: 0,
      isDataSufficient: false,
      warningMessage: `⚠️ ${cleanSymbol} (${ticker}) için yeterli tarihsel piyasa verisi bulunamadı (En az 30 gün gereklidir). Sıfır uydurma veri kuralı gereğince simülasyon iptal edildi.`,
      equityCurve: [],
      tradeLog: [],
    };
  }

  let cash = initialCapital;
  let shares = 0;
  let inPosition = false;
  let entryPrice = 0;
  let entryDate = "";
  let tradeIndex = 1;

  const tradeLog: TradeLogEntry[] = [];
  const equityCurve: DailyEquityPoint[] = [];

  const initialPrice = quotes[0].close;
  const benchmarkShares = initialCapital / initialPrice;

  let peakEquity = initialCapital;
  let maxDrawdown = 0;
  const dailyReturns: number[] = [];

  for (let i = 0; i < quotes.length; i++) {
    const currentQuote = quotes[i];
    const currentPrice = currentQuote.close;
    const currentDate = currentQuote.date;
    const closesSlice = quotes.slice(0, i + 1).map((q) => q.close);
    const prevClosesSlice = i > 0 ? quotes.slice(0, i).map((q) => q.close) : undefined;

    let signal: "BUY" | "SELL" | undefined;

    if (!inPosition) {
      // Check entry conditions (ALL rules must evaluate to true - AND logic)
      const allEntryMet = strategy.entryRules.length > 0 && strategy.entryRules.every((r) =>
        evaluateRule(r, closesSlice, prevClosesSlice)
      );

      if (allEntryMet && i < quotes.length - 1) {
        // Enter position with full cash
        shares = cash / currentPrice;
        cash = 0;
        inPosition = true;
        entryPrice = currentPrice;
        entryDate = currentDate;
        signal = "BUY";
      }
    } else {
      // Check exit conditions
      const priceChangeFromEntry = ((currentPrice - entryPrice) / entryPrice) * 100;
      let shouldExit = false;
      let exitReason: TradeLogEntry["exitReason"] = "KURAL_ÇIKIŞI";

      // Stop Loss
      if (strategy.stopLossPct !== undefined && priceChangeFromEntry <= strategy.stopLossPct) {
        shouldExit = true;
        exitReason = "STOP_LOSS";
      }
      // Take Profit
      else if (strategy.takeProfitPct !== undefined && priceChangeFromEntry >= strategy.takeProfitPct) {
        shouldExit = true;
        exitReason = "TAKE_PROFIT";
      }
      // Strategy Exit Rules (OR logic: any exit trigger met)
      else if (
        strategy.exitRules.length > 0 &&
        strategy.exitRules.some((r) => evaluateRule(r, closesSlice, prevClosesSlice))
      ) {
        shouldExit = true;
        exitReason = "KURAL_ÇIKIŞI";
      }
      // End of backtest period forced exit
      else if (i === quotes.length - 1) {
        shouldExit = true;
        exitReason = "DÖNEM_SONU";
      }

      if (shouldExit) {
        cash = shares * currentPrice;
        const returnPct = ((currentPrice - entryPrice) / entryPrice) * 100;
        const entryD = new Date(entryDate);
        const exitD = new Date(currentDate);
        const durationDays = Math.max(1, Math.round((exitD.getTime() - entryD.getTime()) / (1000 * 60 * 60 * 24)));

        tradeLog.push({
          id: `trade-${tradeIndex++}`,
          entryDate,
          exitDate: currentDate,
          entryPrice: Number(entryPrice.toFixed(2)),
          exitPrice: Number(currentPrice.toFixed(2)),
          returnPct: Number(returnPct.toFixed(2)),
          exitReason,
          durationDays,
        });

        shares = 0;
        inPosition = false;
        entryPrice = 0;
        entryDate = "";
        signal = "SELL";
      }
    }

    // Current total portfolio equity
    const currentEquity = inPosition ? shares * currentPrice : cash;
    const benchmarkEquity = benchmarkShares * currentPrice;

    // Track Peak & Max Drawdown
    if (currentEquity > peakEquity) peakEquity = currentEquity;
    const dd = ((peakEquity - currentEquity) / peakEquity) * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;

    if (i > 0) {
      const prevEquity = equityCurve[i - 1]?.equity || initialCapital;
      const dailyReturn = (currentEquity - prevEquity) / prevEquity;
      dailyReturns.push(dailyReturn);
    }

    equityCurve.push({
      date: currentDate,
      price: Number(currentPrice.toFixed(2)),
      equity: Number(currentEquity.toFixed(2)),
      benchmarkEquity: Number(benchmarkEquity.toFixed(2)),
      inPosition,
      signal,
    });
  }

  const finalCapital = equityCurve[equityCurve.length - 1]?.equity || initialCapital;
  const totalReturnPct = Number((((finalCapital - initialCapital) / initialCapital) * 100).toFixed(2));
  const finalBenchmark = equityCurve[equityCurve.length - 1]?.benchmarkEquity || initialCapital;
  const benchmarkReturnPct = Number((((finalBenchmark - initialCapital) / initialCapital) * 100).toFixed(2));
  const alphaPct = Number((totalReturnPct - benchmarkReturnPct).toFixed(2));

  // Trade Statistics
  const totalTrades = tradeLog.length;
  const winningTrades = tradeLog.filter((t) => t.returnPct > 0).length;
  const losingTrades = tradeLog.filter((t) => t.returnPct <= 0).length;
  const winRatePct = totalTrades > 0 ? Number(((winningTrades / totalTrades) * 100).toFixed(1)) : 0;
  const avgTradeReturnPct = totalTrades > 0 ? Number((tradeLog.reduce((sum, t) => sum + t.returnPct, 0) / totalTrades).toFixed(2)) : 0;

  const totalGains = tradeLog.filter((t) => t.returnPct > 0).reduce((sum, t) => sum + (t.exitPrice - t.entryPrice), 0);
  const totalLosses = Math.abs(tradeLog.filter((t) => t.returnPct < 0).reduce((sum, t) => sum + (t.exitPrice - t.entryPrice), 0));
  const profitFactor = totalLosses > 0 ? Number((totalGains / totalLosses).toFixed(2)) : totalGains > 0 ? 99 : 0;

  // Annualized Sharpe Ratio (Using standard 252 trading days and 35% annualized risk-free rate for TRY assets)
  let sharpeRatio = 0;
  if (dailyReturns.length > 10) {
    const meanDailyReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
    const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - meanDailyReturn, 2), 0) / dailyReturns.length;
    const stdDev = Math.sqrt(variance);

    const dailyRiskFree = Math.pow(1 + 0.35, 1 / 252) - 1; // 35% TR bond/deposit rate benchmark
    if (stdDev > 0.0001) {
      sharpeRatio = Number((((meanDailyReturn - dailyRiskFree) / stdDev) * Math.sqrt(252)).toFixed(2));
    }
  }

  return {
    symbol: cleanSymbol,
    strategyName: strategy.name,
    periodMonths,
    startDate: quotes[0]?.date || startDate.toISOString().split("T")[0],
    endDate: quotes[quotes.length - 1]?.date || now.toISOString().split("T")[0],
    initialCapital,
    finalCapital: Number(finalCapital.toFixed(2)),
    totalReturnPct,
    benchmarkReturnPct,
    alphaPct,
    maxDrawdownPct: Number(maxDrawdown.toFixed(2)),
    sharpeRatio,
    totalTrades,
    winningTrades,
    losingTrades,
    winRatePct,
    avgTradeReturnPct,
    profitFactor,
    isDataSufficient: true,
    equityCurve,
    tradeLog,
  };
}
