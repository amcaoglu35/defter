import {
  calculateLogReturns,
  calculateMaxDrawdown,
  calculateVarCvar,
  calculateBenchmarkMetrics,
  calculateRiskProfile,
  HistoricalPricePoint,
} from "../lib/riskEngine";

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    console.error(`❌ FAILED: ${message}\n  Expected: ${expectedStr}\n  Actual:   ${actualStr}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

function assertCloseTo(actual: number | null | undefined, expected: number, tolerance: number, message: string) {
  if (actual === null || actual === undefined || Math.abs(actual - expected) > tolerance) {
    console.error(`❌ FAILED: ${message}\n  Expected close to: ${expected} (±${tolerance})\n  Actual:            ${actual}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message} (${actual} ≈ ${expected})`);
  }
}

console.log("=== DEFTER QUANT RISK ENGINE & BENCHMARK TESTS ===\n");

// Test 1: Log Returns Calculation
{
  const prices: HistoricalPricePoint[] = [
    { date: "2025-01-01", close: 100 },
    { date: "2025-01-02", close: 110 },
    { date: "2025-01-03", close: 99 },
  ];
  const { returns } = calculateLogReturns(prices);
  // r1 = ln(110/100) = 0.09531
  // r2 = ln(99/110) = -0.10536
  assertEqual(returns.length, 2, "2 return points generated from 3 prices");
  assertCloseTo(returns[0], 0.09531, 0.001, "First daily log return is ~0.0953");
  assertCloseTo(returns[1], -0.10536, 0.001, "Second daily log return is ~-0.1054");
}

// Test 2: Max Drawdown and Duration
{
  const prices: HistoricalPricePoint[] = [
    { date: "2025-01-01", close: 100 },
    { date: "2025-01-02", close: 150 }, // Peak
    { date: "2025-01-03", close: 120 },
    { date: "2025-01-07", close: 90 },  // Trough (-40% from 150)
    { date: "2025-01-10", close: 140 },
  ];
  const { maxDrawdownPct, durationDays } = calculateMaxDrawdown(prices);
  assertEqual(maxDrawdownPct, -40.0, "Max Drawdown is -40.0%");
  assertEqual(durationDays, 5, "Peak (Jan 2) to Trough (Jan 7) duration is 5 days");
}

// Test 3: VaR & CVaR (Expected Shortfall)
{
  // Simulated 50 daily returns
  const returns: number[] = Array.from({ length: 50 }, (_, i) => (i - 25) * 0.005);
  const varCvar = calculateVarCvar(returns);

  assertEqual(varCvar !== null, true, "VaR/CVaR metrics generated for 50 data points");
  if (varCvar) {
    assertEqual(varCvar.confidence95Pct.historicalVaRPct > 0, true, "95% Historical VaR is positive loss");
    assertEqual(varCvar.confidence95Pct.expectedShortfallPct >= varCvar.confidence95Pct.historicalVaRPct, true, "CVaR (Expected Shortfall) >= VaR");
  }
}

// Test 4: Benchmark Beta, Alpha, Tracking Error
{
  // Perfect linear relationship: Portfolio return = 1.2 * Benchmark return
  const benchmarkReturns = [0.01, -0.02, 0.015, -0.01, 0.03, -0.015, 0.02, -0.005, 0.01, 0.025,
                            0.01, -0.02, 0.015, -0.01, 0.03, -0.015, 0.02, -0.005, 0.01, 0.025];
  const portfolioReturns = benchmarkReturns.map((r) => r * 1.2);

  const bMetrics = calculateBenchmarkMetrics(portfolioReturns, benchmarkReturns, "XU100.IS");
  assertEqual(bMetrics !== null, true, "Benchmark metrics generated");
  if (bMetrics) {
    assertCloseTo(bMetrics.beta, 1.2, 0.05, "Beta is ~1.2");
    assertEqual(bMetrics.correlationWithBenchmark, 1.0, "Correlation with scaled benchmark is 1.0");
    assertEqual(bMetrics.rSquared, 1.0, "R-squared is 1.0");
  }
}

// Test 5: Comprehensive Risk Profile & Insufficient Data Guard
{
  const shortPrices: HistoricalPricePoint[] = [
    { date: "2025-01-01", close: 100 },
    { date: "2025-01-02", close: 105 },
  ];
  const shortProfile = calculateRiskProfile(shortPrices);
  assertEqual(shortProfile.status, "insufficient", "Short price series (<20 points) produces 'insufficient' status");
  assertEqual(shortProfile.volatilityAnnualizedPct, null, "Volatility is null when status is insufficient");

  // Long price series (30 days)
  const longPrices: HistoricalPricePoint[] = Array.from({ length: 30 }, (_, i) => ({
    date: `2025-01-${String(i + 1).padStart(2, "0")}`,
    close: 100 + Math.sin(i * 0.5) * 10 + i * 0.5,
  }));
  const fullProfile = calculateRiskProfile(longPrices);
  assertEqual(fullProfile.status, "live", "30-point series produces 'live' status");
  assertEqual(fullProfile.volatilityAnnualizedPct !== null, true, "Annualized volatility calculated");
  assertEqual(fullProfile.sharpeRatio !== null, true, "Sharpe ratio calculated");
  assertEqual(fullProfile.sortinoRatio !== null, true, "Sortino ratio calculated");
}

console.log("\n🎉 ALL 5 QUANT RISK ENGINE & BENCHMARK TESTS PASSED PERFECTLY!");
