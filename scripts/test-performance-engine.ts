import {
  calculateTWRR,
  calculateMWRR,
  calculateComprehensivePerformance,
  ValuationSnapshot,
  CashFlowEvent,
} from "../lib/performanceEngine";

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
    console.log(`✅ PASSED: ${message} (${actual}% ≈ ${expected}%)`);
  }
}

console.log("=== DEFTER GIPS TWRR & MWRR PERFORMANCE ENGINE TESTS ===\n");

// Test 1: Simple TWRR without Cash Flows (100 -> 120 -> 150)
{
  const snapshots: ValuationSnapshot[] = [
    { date: "2025-01-01", portfolioValue: 100 },
    { date: "2025-06-01", portfolioValue: 120 },
    { date: "2025-12-31", portfolioValue: 150 },
  ];

  const res = calculateTWRR(snapshots);
  // Sub 1: (120 - 0) / 100 - 1 = +20%
  // Sub 2: (150 - 0) / 120 - 1 = +25%
  // Total TWRR = (1.20 * 1.25) - 1 = +50%
  assertEqual(res.twrrPct, 50, "TWRR cumulative without cash flow is 50%");
}

// Test 2: TWRR with External Deposit (Neutralizes Manager Impact)
{
  // Manager turns 100 into 150 (+50%).
  // Investor deposits 150 on June 1 -> Portfolio becomes 300.
  // In second half, portfolio drops from 300 to 240 (-20%).
  const snapshots: ValuationSnapshot[] = [
    { date: "2025-01-01", portfolioValue: 100 },
    { date: "2025-06-01", portfolioValue: 300, cashFlowOnDate: 150 }, // 150 organic + 150 deposit
    { date: "2025-12-31", portfolioValue: 240 },
  ];

  const res = calculateTWRR(snapshots);
  // Sub 1: (300 - 150) / 100 - 1 = +50%
  // Sub 2: (240 - 0) / 300 - 1 = -20%
  // Total TWRR = (1.50 * 0.80) - 1 = +20%
  assertEqual(res.twrrPct, 20, "TWRR correctly isolates manager skill: (1.5 * 0.8) - 1 = +20%");
}

// Test 3: MWRR / IRR Numerical Convergence (1 Year Standard)
{
  // Invest 100,000 TL on 2025-01-01.
  // Portfolio grows to 125,000 TL on 2026-01-01 (exact 1 year, 25% return).
  const cashFlows: CashFlowEvent[] = [];
  const res = calculateMWRR(cashFlows, 100000, "2025-01-01", 125000, "2026-01-01");

  assertEqual(res.convergence, "converged", "MWRR solver converged");
  assertCloseTo(res.mwrrPct, 25.0, 0.5, "MWRR 1-year annual IRR is ~25.0%");
}

// Test 4: MWRR with Mid-Year Inflow
{
  // Start with 100k on Jan 1.
  // Deposit 50k on July 1 (~0.5 yr).
  // End value is 170k on Dec 31 (~1 yr).
  const cashFlows: CashFlowEvent[] = [
    { date: "2025-07-02", amount: 50000 },
  ];
  const res = calculateMWRR(cashFlows, 100000, "2025-01-01", 170000, "2025-12-31");

  assertEqual(res.convergence, "converged", "MWRR with mid-year deposit converged");
  // Total invested = 150k, end = 170k (+20k gain). IRR ~ 16.5%
  assertCloseTo(res.mwrrPct, 16.5, 1.0, "MWRR with mid-year inflow is ~16.5%");
}

// Test 5: Comprehensive Performance Report (TWRR vs MWRR vs Simple Return)
{
  const snapshots: ValuationSnapshot[] = [
    { date: "2025-01-01", portfolioValue: 100000 },
    { date: "2025-06-01", portfolioValue: 160000, cashFlowOnDate: 50000 },
    { date: "2025-12-31", portfolioValue: 180000 },
  ];
  const cashFlows: CashFlowEvent[] = [
    { date: "2025-06-01", amount: 50000 },
  ];

  const report = calculateComprehensivePerformance(snapshots, cashFlows);
  assertEqual(report.startValue, 100000, "Start value is 100,000 TL");
  assertEqual(report.netInvestedCapital, 150000, "Net invested capital is 150,000 TL");
  assertEqual(report.endValue, 180000, "End value is 180,000 TL");
  assertEqual(report.netGainLoss, 30000, "Net gain is 30,000 TL");
  assertEqual(report.simpleReturnPct, 20.0, "Simple return is 20.0% (30k/150k)");
  assertCloseTo(report.twrrPct, 23.75, 0.5, "TWRR is ~23.75% ((1.10 * 1.125) - 1)");
}

console.log("\n🎉 ALL 5 GIPS-COMPLIANT PERFORMANCE ENGINE TESTS PASSED PERFECTLY!");
