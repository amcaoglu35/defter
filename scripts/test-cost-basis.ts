import {
  calculatePositionFifo,
  calculatePositionWac,
  calculatePortfolioCostBasis,
  TransactionRecord,
} from "../lib/costBasis";

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

console.log("=== DEFTER COST BASIS & FIFO/WAC ENGINE TESTS ===\n");

// Test 1: Simple FIFO Lot Consumption
{
  const txs: TransactionRecord[] = [
    { id: "1", companySymbol: "THYAO", type: "BUY", quantity: 100, price: 200, totalAmount: 20000, date: "2025-01-10" },
    { id: "2", companySymbol: "THYAO", type: "BUY", quantity: 100, price: 300, totalAmount: 30000, date: "2025-02-10" },
    { id: "3", companySymbol: "THYAO", type: "SELL", quantity: 150, price: 350, totalAmount: 52500, date: "2025-03-10" },
  ];

  const fifo = calculatePositionFifo("THYAO", txs, 350);
  // FIFO should consume:
  // - 100 shares @ 200 TL (cost: 20,000 TL, gain: 100 * (350 - 200) = 15,000 TL)
  // - 50 shares @ 300 TL (cost: 15,000 TL, gain: 50 * (350 - 300) = 2,500 TL)
  // Total Realized Gain = 17,500 TL
  // Remaining: 50 shares @ 300 TL (cost basis: 15,000 TL)
  assertEqual(fifo.summary.totalQuantity, 50, "FIFO remaining quantity is 50");
  assertEqual(fifo.summary.totalCostBasis, 15000, "FIFO remaining cost basis is 15,000 TL");
  assertEqual(fifo.summary.averageCost, 300, "FIFO remaining average cost is 300 TL");
  assertEqual(fifo.summary.realizedGainTotal, 17500, "FIFO realized gain is 17,500 TL");
  assertEqual(fifo.realizedEvents.length, 1, "FIFO produced 1 realized sell event");
  assertEqual(fifo.realizedEvents[0].matchedLots?.length, 2, "FIFO matched 2 buy lots");
}

// Test 2: WAC (Weighted Average Cost)
{
  const txs: TransactionRecord[] = [
    { id: "1", companySymbol: "THYAO", type: "BUY", quantity: 100, price: 200, totalAmount: 20000, date: "2025-01-10" },
    { id: "2", companySymbol: "THYAO", type: "BUY", quantity: 100, price: 300, totalAmount: 30000, date: "2025-02-10" },
    { id: "3", companySymbol: "THYAO", type: "SELL", quantity: 150, price: 350, totalAmount: 52500, date: "2025-03-10" },
  ];

  const wac = calculatePositionWac("THYAO", txs, 350);
  // Average Cost before sell = (20000 + 30000) / 200 = 250 TL
  // Sale: 150 shares * 350 = 52,500 TL. Cost of sold = 150 * 250 = 37,500 TL.
  // Realized Gain = 52,500 - 37,500 = 15,000 TL
  // Remaining: 50 shares * 250 = 12,500 TL
  assertEqual(wac.summary.totalQuantity, 50, "WAC remaining quantity is 50");
  assertEqual(wac.summary.averageCost, 250, "WAC average cost is 250 TL");
  assertEqual(wac.summary.totalCostBasis, 12500, "WAC remaining cost basis is 12,500 TL");
  assertEqual(wac.summary.realizedGainTotal, 15000, "WAC realized gain is 15,000 TL");
}

// Test 3: Stock Split (2-for-1 Split)
{
  const txs: TransactionRecord[] = [
    { id: "1", companySymbol: "FROTO", type: "BUY", quantity: 100, price: 1000, totalAmount: 100000, date: "2025-01-01" },
    { id: "2", companySymbol: "FROTO", type: "SPLIT", quantity: 2, price: 0, totalAmount: 0, date: "2025-02-01", splitRatio: 2 },
  ];

  const fifo = calculatePositionFifo("FROTO", txs, 600);
  assertEqual(fifo.summary.totalQuantity, 200, "SPLIT doubled quantity to 200");
  assertEqual(fifo.summary.averageCost, 500, "SPLIT halved unit cost to 500 TL");
  assertEqual(fifo.summary.totalCostBasis, 100000, "SPLIT kept total cost basis unchanged at 100,000 TL");
  assertEqual(fifo.summary.unrealizedGain, 20000, "Unrealized gain at 600 TL is 20,000 TL");
}

// Test 4: Bonus Shares (Bedelsiz %100)
{
  const txs: TransactionRecord[] = [
    { id: "1", companySymbol: "ASELS", type: "BUY", quantity: 100, price: 60, totalAmount: 6000, date: "2025-01-01" },
    { id: "2", companySymbol: "ASELS", type: "BONUS", quantity: 100, price: 0, totalAmount: 0, date: "2025-02-01" },
  ];

  const wac = calculatePositionWac("ASELS", txs, 40);
  assertEqual(wac.summary.totalQuantity, 200, "BONUS added 100 shares -> 200 total");
  assertEqual(wac.summary.averageCost, 30, "BONUS halved average cost to 30 TL");
  assertEqual(wac.summary.totalCostBasis, 6000, "Total cost basis preserved at 6,000 TL");
}

// Test 5: Full Portfolio Report with Dividends, Fees, and Taxes
{
  const txs: TransactionRecord[] = [
    { id: "1", companySymbol: "THYAO", type: "BUY", quantity: 100, price: 200, totalAmount: 20000, date: "2025-01-10", fee: 40 },
    { id: "2", companySymbol: "THYAO", type: "DIVIDEND", quantity: 0, price: 0, totalAmount: 1500, date: "2025-05-15" },
    { id: "3", companySymbol: "THYAO", type: "SELL", quantity: 50, price: 300, totalAmount: 15000, date: "2025-06-10", fee: 30, tax: 100 },
  ];

  const report = calculatePortfolioCostBasis(txs, { THYAO: 320 }, "FIFO");
  // Buy unit cost = (20000 + 40) / 100 = 200.4 TL
  // Sell 50 shares: Gross = 15000, Cost = 50 * 200.4 = 10020.
  // Realized gain = 15000 - 10020 = 4980. Net realized = 4980 - 30 - 100 = 4850 TL.
  // Remaining 50 shares @ 200.4 TL = 10020 TL cost basis.
  // Current Value = 50 * 320 = 16000 TL. Unrealized Gain = 16000 - 10020 = 5980 TL.
  // Total Net Profit = 4850 (net realized) + 5980 (unrealized) + 1500 (dividend) - 40 (buy fee already in cost basis? let's check)
  assertEqual(report.positions["THYAO"].totalQuantity, 50, "Portfolio remaining quantity is 50");
  assertEqual(report.positions["THYAO"].totalCostBasis, 10020, "Portfolio cost basis includes buy fee (10,020 TL)");
  assertEqual(report.positions["THYAO"].dividendIncomeTotal, 1500, "Dividend income is 1,500 TL");
  assertEqual(report.positions["THYAO"].realizedGainTotal, 4850, "Net realized gain is 4,850 TL");
}

console.log("\n🎉 ALL 5 MATHEMATICAL COST BASIS ENGINE TESTS PASSED PERFECTLY!");
