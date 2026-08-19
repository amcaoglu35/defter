import {
  calculateTurkishIncomeTaxBracket,
  calculateForeignStockTax,
  calculateBistDividendTax,
  calculateDomesticAssetTax,
  ForeignStockTaxInput,
  DividendTaxInput,
} from "../lib/taxEngine";

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

console.log("=== DEFTER TURKISH TAX REGULATION ENGINE TESTS ===\n");

// Test 1: BIST Stocks & TEFAS Equity Funds (%0 Withholding Tax)
{
  const bistTax = calculateDomesticAssetTax("THYAO", "hisse", 50000);
  assertEqual(bistTax.withholdingTaxTl, 0, "BIST stock capital gain has 0 TL withholding tax (%0)");
  assertEqual(bistTax.netAfterTaxGainTl, 50000, "Net gain equals gross gain for BIST stocks");

  const tefasEquityTax = calculateDomesticAssetTax("TI2", "fon", 30000, true);
  assertEqual(tefasEquityTax.withholdingTaxTl, 0, "TEFAS equity fund has 0 TL withholding tax (%0)");

  const tefasFixedTax = calculateDomesticAssetTax("OKT", "fon", 10000, false);
  assertEqual(tefasFixedTax.withholdingTaxTl, 750, "TEFAS fixed income fund has %7.5 withholding tax (750 TL)");
}

// Test 2: Foreign Stock with ÜFE Inflation Indexation (GVK Mülga 81)
{
  // Buy: 100 AAPL @ $150 = $15,000 on 2024-01-01 (USD/TRY = 30.0 TL, ÜFE = 3000) -> Original TL Cost = 450,000 TL
  // Sell: 100 AAPL @ $200 = $20,000 on 2025-01-01 (USD/TRY = 35.0 TL, ÜFE = 3600) -> Proceeds = 700,000 TL
  // Nominal TL Gain = 700,000 - 450,000 = 250,000 TL
  // ÜFE Inflation = (3600 - 3000) / 3000 = +20% (>= 10% threshold -> ÜFE Applied!)
  // Indexed Cost = 450,000 * 1.20 = 540,000 TL
  // Taxable Gain = 700,000 - 540,000 = 160,000 TL (instead of 250,000 TL!)
  const input: ForeignStockTaxInput = {
    symbol: "AAPL",
    buyDate: "2024-01-01",
    sellDate: "2025-01-01",
    quantity: 100,
    buyPriceUsd: 150,
    sellPriceUsd: 200,
    buyTcmbUsdRate: 30.0,
    sellTcmbUsdRate: 35.0,
    buyUfeIndex: 3000,
    sellUfeIndex: 3600,
  };

  const res = calculateForeignStockTax(input);
  assertEqual(res.isUfeApplied, true, "ÜFE inflation indexation applied (20% >= 10%)");
  assertEqual(res.buyCostOriginalTl, 450000, "Original TL cost is 450,000 TL");
  assertEqual(res.indexedCostTl, 540000, "Indexed TL cost is 540,000 TL");
  assertEqual(res.taxableGainTl, 160000, "Taxable gain after ÜFE relief is 160,000 TL (shielded 90k inflation gain)");
  assertEqual(res.estimatedIncomeTaxTl > 0, true, "Progressive income tax calculated");
}

// Test 3: Progressive Tax Brackets (15% - 40%)
{
  // 100,000 TL -> 15% = 15,000 TL
  assertEqual(calculateTurkishIncomeTaxBracket(100000), 15000, "100,000 TL tax is 15,000 TL (15%)");

  // 200,000 TL -> 158k * 0.15 (23.7k) + 42k * 0.20 (8.4k) = 32,100 TL
  assertEqual(calculateTurkishIncomeTaxBracket(200000), 32100, "200,000 TL tax is 32,100 TL");
}

// Test 4: BIST Dividend Withholding & Declaration Threshold (GVK 22/2 & 86/1-c)
{
  const smallDiv: DividendTaxInput = {
    symbol: "FROTO",
    grossDividendTl: 100000,
    paymentDate: "2025-04-10",
  };
  const smallRes = calculateBistDividendTax(smallDiv);
  assertEqual(smallRes.withholdingTaxTl, 10000, "100k gross dividend withholding is 10,000 TL (%10)");
  assertEqual(smallRes.netDividendReceivedTl, 90000, "Net received is 90,000 TL");
  assertEqual(smallRes.taxableDividendTl, 50000, "Taxable portion (50% exempt) is 50,000 TL");
  assertEqual(smallRes.requiresDeclaration, false, "50k <= 230k threshold -> No annual declaration required");

  const largeDiv: DividendTaxInput = {
    symbol: "FROTO",
    grossDividendTl: 600000,
    paymentDate: "2025-04-10",
  };
  const largeRes = calculateBistDividendTax(largeDiv);
  assertEqual(largeRes.taxableDividendTl, 300000, "Taxable portion is 300,000 TL");
  assertEqual(largeRes.requiresDeclaration, true, "300k > 230k threshold -> Annual declaration required");
}

console.log("\n🎉 ALL TURKISH TAX REGULATION ENGINE TESTS PASSED PERFECTLY!");
