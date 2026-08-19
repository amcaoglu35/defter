import {
  calculateRebalanceOrders,
  RebalanceItemInput,
} from "../lib/rebalanceEngine";

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

console.log("=== DEFTER REBALANCING & TRADING FRICTION ENGINE TESTS ===\n");

// Test 1: Simple 2-Asset Rebalance (BUY 1, SELL 1)
{
  const items: RebalanceItemInput[] = [
    { symbol: "THYAO", currentQuantity: 100, currentPrice: 300, targetWeightPct: 40 }, // Current 30k = 60% -> Target 40% (SELL 20k)
    { symbol: "ASELS", currentQuantity: 333.333333, currentPrice: 60, targetWeightPct: 60 }, // Current 20k = 40% -> Target 60% (BUY 10k)
  ];

  const res = calculateRebalanceOrders(items, 0, {
    commissionRatePct: 0.15,
    bsmvRatePct: 5.0,
    slippagePct: 0.10,
    minTradeAmountTl: 250,
    minDriftPct: 0.5,
  });

  assertCloseTo(res.totalPortfolioValueBeforeTl, 50000, 1.0, "Total portfolio value is ~50,000 TL");
  assertEqual(res.executedOrdersCount, 2, "2 orders executed");
  assertEqual(res.ignoredOrdersCount, 0, "0 orders ignored");

  const sellOrder = res.orders.find((o) => o.symbol === "THYAO");
  assertEqual(sellOrder?.action, "SELL", "THYAO action is SELL");

  const buyOrder = res.orders.find((o) => o.symbol === "ASELS");
  assertEqual(buyOrder?.action, "BUY", "ASELS action is BUY");

  assertEqual(buyOrder?.commissionTl !== undefined && buyOrder.commissionTl > 0, true, "Buy order commission calculated");
  assertEqual(buyOrder?.bsmvTl !== undefined && buyOrder.bsmvTl > 0, true, "BSMV tax calculated");
}

// Test 2: Threshold Filtering (Ignoring Tiny Trades < 250 TL)
{
  const items: RebalanceItemInput[] = [
    { symbol: "THYAO", currentQuantity: 100, currentPrice: 300, targetWeightPct: 50 }, // 30,000 TL
    { symbol: "GARAN", currentQuantity: 300, currentPrice: 100, targetWeightPct: 50 },  // 30,000 TL
    { symbol: "SISE",  currentQuantity: 2,   currentPrice: 50,  targetWeightPct: 0.1 },  // Current 100 TL (< 250 TL min trade)
  ];

  const res = calculateRebalanceOrders(items, 0, { minTradeAmountTl: 250 });
  const siseOrder = res.orders.find((o) => o.symbol === "SISE");
  assertEqual(siseOrder?.action, "HOLD", "Tiny SISE trade below 250 TL is ignored (HOLD)");
  assertEqual(siseOrder?.isIgnoredDueToThreshold, true, "isIgnoredDueToThreshold is true for SISE");
  assertEqual(res.ignoredOrdersCount, 1, "1 ignored order count recorded");
}

// Test 3: Total Portfolio Friction Summary
{
  const items: RebalanceItemInput[] = [
    { symbol: "THYAO", currentQuantity: 1000, currentPrice: 300, targetWeightPct: 20 }, // 300k -> 100k (SELL 200k)
    { symbol: "ASELS", currentQuantity: 1000, currentPrice: 50,  targetWeightPct: 80 }, // 50k -> 400k (BUY 350k)
  ];

  const res = calculateRebalanceOrders(items, 150000); // 350k holdings + 150k cash = 500k total
  assertEqual(res.totalPortfolioValueBeforeTl, 500000, "Total portfolio value with cash is 500,000 TL");
  assertEqual(res.totalTurnoverAmountTl > 0, true, "Turnover amount calculated");
  assertEqual(res.totalFrictionCostsTl > 0, true, "Total friction cost calculated");
  assertEqual(res.totalPortfolioValueAfterTl < res.totalPortfolioValueBeforeTl, true, "Value after rebalance accounts for friction deduction");
}

console.log("\n🎉 ALL REBALANCING & TRADING FRICTION ENGINE TESTS PASSED PERFECTLY!");
