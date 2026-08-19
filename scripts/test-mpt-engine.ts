import {
  calculateEfficientFrontier,
  MptAssetInput,
} from "../lib/mptEngine";
import { HistoricalPricePoint } from "../lib/riskEngine";

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

console.log("=== DEFTER MARKOWITZ MPT & EFFICIENT FRONTIER TESTS ===\n");

// Helper to generate synthetic price series with trend & volatility
function generateSeries(startPrice: number, dailyReturn: number, vol: number, days: number = 30): HistoricalPricePoint[] {
  const points: HistoricalPricePoint[] = [];
  let price = startPrice;
  for (let i = 0; i < days; i++) {
    const d = `2025-01-${String(i + 1).padStart(2, "0")}`;
    points.push({ date: d, close: Number(price.toFixed(2)) });
    const noise = (Math.sin(i * 1.5) + Math.cos(i * 0.7)) * vol;
    price = Math.max(1, price * (1 + dailyReturn + noise));
  }
  return points;
}

// Test 1: 2-Asset MPT Optimization
{
  const assetA: MptAssetInput = {
    symbol: "THYAO",
    weight: 0.5,
    priceHistory: generateSeries(200, 0.002, 0.015, 30), // High return, higher vol
  };
  const assetB: MptAssetInput = {
    symbol: "ASELS",
    weight: 0.5,
    priceHistory: generateSeries(60, 0.001, 0.005, 30),  // Lower return, lower vol
  };

  const res = calculateEfficientFrontier([assetA, assetB]);

  assertEqual(res.status, "success", "MPT optimization status is success");
  assertEqual(res.symbols.length, 2, "2 asset symbols processed");
  assertEqual(res.currentPortfolio !== null, true, "Current portfolio point calculated");
  assertEqual(res.minVariancePortfolio !== null, true, "Minimum Variance Portfolio (MVP) calculated");
  assertEqual(res.maxSharpePortfolio !== null, true, "Max Sharpe / Tangency Portfolio calculated");
  assertEqual(res.frontierPoints.length > 0, true, "Efficient Frontier curve points generated");
}

// Test 2: Insufficient Data Guard (< 2 assets)
{
  const singleAsset: MptAssetInput = {
    symbol: "THYAO",
    weight: 1.0,
    priceHistory: generateSeries(200, 0.002, 0.015, 30),
  };
  const res = calculateEfficientFrontier([singleAsset]);

  assertEqual(res.status, "insufficient_data", "Single asset returns 'insufficient_data' status");
  assertEqual(res.minVariancePortfolio, null, "MVP is null when insufficient data");
}

// Test 3: Insufficient Price History Guard (< 20 days)
{
  const assetA: MptAssetInput = {
    symbol: "THYAO",
    weight: 0.5,
    priceHistory: generateSeries(200, 0.002, 0.015, 10), // Only 10 days
  };
  const assetB: MptAssetInput = {
    symbol: "ASELS",
    weight: 0.5,
    priceHistory: generateSeries(60, 0.001, 0.005, 10),
  };

  const res = calculateEfficientFrontier([assetA, assetB]);
  assertEqual(res.status, "insufficient_data", "10-day series returns 'insufficient_data' status");
}

console.log("\n🎉 ALL MARKOWITZ MPT & EFFICIENT FRONTIER TESTS PASSED PERFECTLY!");
