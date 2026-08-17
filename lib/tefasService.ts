import { Fund } from "@muhammedaksam/borsats";

export interface TefasFundDetail {
  code: string;
  name: string;
  price: number;
  dailyChange: number;
  fundSize: number;
  formattedFundSize: string;
  investorCount: number;
  fundType: string;
  category: string;
  riskValue: number;
  categoryRank?: number;
  categoryFundCount?: number;
  marketShare?: number;
  returns: {
    oneMonth?: number;
    threeMonths?: number;
    sixMonths?: number;
    ytd?: number;
    oneYear?: number;
    threeYears?: number;
    fiveYears?: number;
  };
}

// In-memory cache for TEFAS fund details (TTL: 15 minutes)
const TEFAS_CACHE = new Map<string, { timestamp: number; data: TefasFundDetail }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function formatFundSize(size: number): string {
  if (!size || isNaN(size)) return "0 ₺";
  if (size >= 1_000_000_000) {
    return `${(size / 1_000_000_000).toFixed(2)} Mr ₺`;
  }
  if (size >= 1_000_000) {
    return `${(size / 1_000_000).toFixed(2)} Mn ₺`;
  }
  return `${size.toLocaleString("tr-TR")} ₺`;
}

/**
 * Fetches rich authentic TEFAS fund profile & returns.
 * Uses 15-minute in-memory caching.
 */
export async function getTefasFundDetail(fundCode: string): Promise<TefasFundDetail | null> {
  const code = (fundCode || "").toUpperCase().trim();
  if (!code || code.length < 2) return null;

  const now = Date.now();
  const cached = TEFAS_CACHE.get(code);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const fund = new Fund(code);
    const info = await fund.info;

    if (!info || info.price == null) {
      return null;
    }

    const detail: TefasFundDetail = {
      code,
      name: info.name || code,
      price: Number(info.price),
      dailyChange: info.daily_return != null ? Number(Number(info.daily_return).toFixed(2)) : 0,
      fundSize: Number(info.fund_size || 0),
      formattedFundSize: formatFundSize(Number(info.fund_size || 0)),
      investorCount: Number(info.investor_count || 0),
      fundType: info.fund_type || "Yatırım Fonu",
      category: info.category || "Fon",
      riskValue: Number(info.risk_value || 0),
      categoryRank: info.category_rank,
      categoryFundCount: info.category_fund_count,
      marketShare: info.market_share != null ? Number(Number(info.market_share).toFixed(2)) : undefined,
      returns: {
        oneMonth: info.return_1m != null ? Number(Number(info.return_1m).toFixed(2)) : undefined,
        threeMonths: info.return_3m != null ? Number(Number(info.return_3m).toFixed(2)) : undefined,
        sixMonths: info.return_6m != null ? Number(Number(info.return_6m).toFixed(2)) : undefined,
        ytd: info.return_ytd != null ? Number(Number(info.return_ytd).toFixed(2)) : undefined,
        oneYear: info.return_1y != null ? Number(Number(info.return_1y).toFixed(2)) : undefined,
        threeYears: info.return_3y != null ? Number(Number(info.return_3y).toFixed(2)) : undefined,
        fiveYears: info.return_5y != null ? Number(Number(info.return_5y).toFixed(2)) : undefined,
      },
    };

    TEFAS_CACHE.set(code, { timestamp: now, data: detail });
    return detail;
  } catch (err) {
    console.warn(`[TefasService] Error fetching details for ${code}:`, err);
    return null;
  }
}
