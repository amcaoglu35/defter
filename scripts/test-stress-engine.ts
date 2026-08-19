import {
  runStressTest,
  STRESS_SCENARIOS,
  StressHoldingInput,
} from "../lib/stressTestEngine";

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

console.log("=== DEFTER MACRO SCENARIO & STRESS TEST ENGINE TESTS ===\n");

// Test 1: FX Shock (USD/TRY +25%)
{
  const holdings: StressHoldingInput[] = [
    { symbol: "THYAO", assetClass: "hisse", sector: "Ulaştırma", weightPercent: 50, exportRatioPct: 80 }, // Exporter (+16.5%)
    { symbol: "USD", assetClass: "doviz", sector: "Döviz", weightPercent: 50 },                          // FX Asset (+24.5%)
  ];

  const results = runStressTest(holdings, 100000, "FX_SHOCK_USD");
  assertEqual(results.length, 1, "1 FX Shock scenario returned");
  const fxRes = results[0];
  assertEqual(fxRes.portfolioImpactPct > 15.0, true, "Portfolio impact is strongly positive for export & FX asset basket");
  assertEqual(fxRes.verdict, "Korumalı", "Verdict is 'Korumalı' (Protected)");
}

// Test 2: BIST Crash (-20%) with High Beta vs Safe Haven Asset
{
  const holdings: StressHoldingInput[] = [
    { symbol: "EREGL", assetClass: "hisse", sector: "Sanayi", weightPercent: 50, beta: 1.5 }, // Beta 1.5 -> -30%
    { symbol: "ALTIN", assetClass: "maden", sector: "Maden", weightPercent: 50, beta: 0.1 }, // Safe Haven -> +1.5%
  ];

  const results = runStressTest(holdings, 200000, "BIST_CRASH");
  const crashRes = results[0];
  // Weighted impact: 0.5 * (-30) + 0.5 * (1.5) = -15.0 + 0.75 = -14.25%
  assertEqual(crashRes.portfolioImpactPct, -14.25, "Portfolio impact under BIST crash is -14.25%");
  assertEqual(crashRes.portfolioImpactAmountTl, -28500, "TL Impact on 200,000 TL portfolio is -28,500 TL");
}

// Test 3: All 5 Scenarios Executed
{
  const holdings: StressHoldingInput[] = [
    { symbol: "THYAO", assetClass: "hisse", sector: "Ulaştırma", weightPercent: 40, beta: 1.2, exportRatioPct: 85 },
    { symbol: "GARAN", assetClass: "hisse", sector: "Finans & Bankacılık", weightPercent: 30, beta: 1.4 },
    { symbol: "ALTIN", assetClass: "maden", sector: "Maden", weightPercent: 30, beta: 0.0 },
  ];

  const allResults = runStressTest(holdings, 500000);
  assertEqual(allResults.length, STRESS_SCENARIOS.length, "All 5 macro scenarios executed");
  for (const r of allResults) {
    assertEqual(typeof r.portfolioImpactPct, "number", `Scenario ${r.scenario.id} impact is number`);
    assertEqual(r.holdingImpacts.length, 3, `Scenario ${r.scenario.id} evaluated 3 holdings`);
  }
}

console.log("\n🎉 ALL MACRO SCENARIO & STRESS TEST ENGINE TESTS PASSED PERFECTLY!");
