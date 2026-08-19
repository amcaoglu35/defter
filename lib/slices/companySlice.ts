/**
 * Defter — Domain Slice: Company Watchlist & Live Market Data
 */

import { Company, MOCK_COMPANIES } from "../mockData";

export function toggleCompanyWatchlist(
  companies: Company[],
  symbol: string
): Company[] {
  return companies.map((c) =>
    c.symbol.toUpperCase() === symbol.toUpperCase()
      ? { ...c, inWatchlist: !c.inWatchlist }
      : c
  );
}

export function updateCompanyPrice(
  companies: Company[],
  symbol: string,
  newPrice: number,
  dailyChange?: number
): Company[] {
  return companies.map((c) => {
    if (c.symbol.toUpperCase() === symbol.toUpperCase()) {
      const prevPrice = c.price;
      const change = dailyChange ?? (prevPrice > 0 ? ((newPrice - prevPrice) / prevPrice) * 100 : c.dailyChange);
      return {
        ...c,
        price: newPrice,
        dailyChange: Number(change.toFixed(2)),
      };
    }
    return c;
  });
}

export { MOCK_COMPANIES };
