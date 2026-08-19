import { DEFAULT_USER_SETTINGS } from "../lib/slices/userSlice";
import { toggleCompanyWatchlist, updateCompanyPrice } from "../lib/slices/companySlice";
import { addTransactionRecord, getPortfolioCostReport, TransactionRecord } from "../lib/slices/transactionSlice";
import { recalculateBasketTotals, addHoldingToBasket, removeHoldingFromBasket } from "../lib/slices/basketSlice";
import { Company, Basket } from "../lib/mockData";

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

console.log("=== DEFTER DOMAIN-DRIVEN SLICES INTEGRATION TESTS ===\n");

// Test 1: User Slice
{
  assertEqual(DEFAULT_USER_SETTINGS.currency, "₺ TRY", "Default user settings currency is TRY");
  assertEqual(DEFAULT_USER_SETTINGS.commissionRate, 0.15, "Default commission rate is 0.15%");
}

// Test 2: Company Slice
{
  const testCompanies: Company[] = [
    {
      id: "thyao",
      symbol: "THYAO",
      name: "Türk Hava Yolları",
      sector: "Ulaştırma",
      exchange: "BIST",
      assetClass: "hisse",
      price: 300,
      currency: "₺",
      dailyChange: 1.5,
      recommendation: "AL",
      inWatchlist: false,
      metrics: [],
    },
  ];

  const toggled = toggleCompanyWatchlist(testCompanies, "THYAO");
  assertEqual(toggled[0].inWatchlist, true, "THYAO added to watchlist");

  const updatedPrice = updateCompanyPrice(toggled, "THYAO", 330);
  assertEqual(updatedPrice[0].price, 330, "THYAO price updated to 330 TL");
  assertEqual(updatedPrice[0].dailyChange, 10, "THYAO daily change updated to 10%");
}

// Test 3: Transaction Slice & Cost Basis Integration
{
  let txs: TransactionRecord[] = [];
  txs = addTransactionRecord(txs, {
    companySymbol: "GARAN",
    type: "BUY",
    quantity: 100,
    price: 100,
    totalAmount: 10000,
    date: "2025-01-01",
  });

  assertEqual(txs.length, 1, "Transaction record added");
  const report = getPortfolioCostReport(txs, { GARAN: 120 }, "FIFO");
  assertEqual(report.totalCostBasis, 10000, "Portfolio cost basis is 10,000 TL");
  assertEqual(report.totalUnrealizedGain, 2000, "Unrealized gain is 2,000 TL");
}

// Test 4: Basket Slice
{
  const testBasket: Basket = {
    id: "b1",
    name: "Test Sepet",
    subtitle: "Alt Sepet",
    riskLevel: "Orta",
    riskColor: "mid",
    totalValue: 0,
    totalCost: 0,
    dailyChange: 0,
    totalProfitPercent: 0,
    description: "Açıklama",
    holdings: [
      { companySymbol: "THYAO", weightPercent: 100, quantity: 10, avgCost: 200, currentPrice: 200 },
    ],
  };

  const companies: Company[] = [
    {
      id: "thyao",
      symbol: "THYAO",
      name: "THY",
      sector: "Ulaştırma",
      exchange: "BIST",
      assetClass: "hisse",
      price: 300,
      currency: "₺",
      dailyChange: 0,
      recommendation: "AL",
      inWatchlist: true,
      metrics: [],
    },
  ];

  const recalculated = recalculateBasketTotals(testBasket, companies);
  assertEqual(recalculated.totalValue, 3000, "Total value recalculated to 3,000 TL (10 * 300)");
  assertEqual(recalculated.totalCost, 2000, "Total cost is 2,000 TL (10 * 200)");
  assertEqual(recalculated.totalProfitPercent, 50, "Total profit percent is 50%");

  const added = addHoldingToBasket(recalculated, {
    companySymbol: "ASELS",
    weightPercent: 50,
    quantity: 20,
    avgCost: 50,
    currentPrice: 50,
  });
  assertEqual(added.holdings.length, 2, "ASELS added to basket (2 holdings total)");

  const removed = removeHoldingFromBasket(added, "THYAO");
  assertEqual(removed.holdings.length, 1, "THYAO removed from basket (1 holding remaining)");
  assertEqual(removed.holdings[0].companySymbol, "ASELS", "Remaining holding is ASELS");
}

console.log("\n🎉 ALL DOMAIN-DRIVEN SLICES INTEGRATION TESTS PASSED PERFECTLY!");
