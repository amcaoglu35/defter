import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { Ticker, Fund } from "@muhammedaksam/borsats";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { SYMBOL_MAP, getSymbolTicker } from "@/lib/liveSymbols";
import { MOCK_COMPANIES } from "@/lib/mockData";

// In-memory micro-cache for borsats to reduce latency
const BORSATS_STOCK_CACHE = new Map<string, { data: EnrichedPriceItem; timestamp: number }>();
const BORSATS_FUND_CACHE = new Map<string, { data: EnrichedPriceItem; timestamp: number }>();
const BORSATS_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

async function fetchBorsatsStockPrice(symbol: string): Promise<EnrichedPriceItem | null> {
  const cached = BORSATS_STOCK_CACHE.get(symbol);
  if (cached && Date.now() - cached.timestamp < BORSATS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const stock = new Ticker(symbol);
    const fastInfo = await stock.fastInfo;
    const lastPrice = await fastInfo.lastPrice;
    if (lastPrice == null || isNaN(lastPrice) || lastPrice <= 0) return null;

    const prevClose = (await fastInfo.previousClose) ?? undefined;
    const dailyChange = prevClose && prevClose > 0
      ? Number((((lastPrice - prevClose) / prevClose) * 100).toFixed(2))
      : 0;

    const marketCap = (await fastInfo.marketCap) ?? undefined;
    let marketCapStr: string | undefined = undefined;
    if (marketCap && marketCap > 0) {
      marketCapStr = marketCap >= 1e9
        ? `${(marketCap / 1e9).toFixed(2)} Mr ₺`
        : `${(marketCap / 1e6).toFixed(1)} M ₺`;
    }

    const peRatio = (await fastInfo.peRatio) ? Number(Number(await fastInfo.peRatio).toFixed(1)) : undefined;
    const pbRatio = (await fastInfo.pbRatio) ? Number(Number(await fastInfo.pbRatio).toFixed(2)) : undefined;
    const dayHigh = (await fastInfo.dayHigh) ?? undefined;
    const dayLow = (await fastInfo.dayLow) ?? undefined;
    const high52 = (await fastInfo.yearHigh) ?? undefined;
    const low52 = (await fastInfo.yearLow) ?? undefined;
    const fiftyDayAvg = (await fastInfo.fiftyDayAverage) ?? undefined;
    const twoHundredDayAvg = (await fastInfo.twoHundredDayAverage) ?? undefined;

    const item: EnrichedPriceItem = {
      price: Number(lastPrice.toFixed(2)),
      dailyChange,
      previousClose: prevClose ? Number(prevClose.toFixed(2)) : undefined,
      marketCap: marketCapStr,
      peRatio: peRatio && peRatio > 0 ? peRatio : undefined,
      pbRatio: pbRatio && pbRatio > 0 ? pbRatio : undefined,
      dayHigh: dayHigh ? Number(dayHigh.toFixed(2)) : undefined,
      dayLow: dayLow ? Number(dayLow.toFixed(2)) : undefined,
      high52: high52 ? Number(high52.toFixed(2)) : undefined,
      low52: low52 ? Number(low52.toFixed(2)) : undefined,
      fiftyDayAverage: fiftyDayAvg ? Number(fiftyDayAvg.toFixed(2)) : undefined,
      twoHundredDayAverage: twoHundredDayAvg ? Number(twoHundredDayAvg.toFixed(2)) : undefined,
    };

    BORSATS_STOCK_CACHE.set(symbol, { data: item, timestamp: Date.now() });
    return item;
  } catch {
    return null;
  }
}

async function fetchBorsatsFundPrice(fundCode: string): Promise<EnrichedPriceItem | null> {
  const cached = BORSATS_FUND_CACHE.get(fundCode);
  if (cached && Date.now() - cached.timestamp < BORSATS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const fund = new Fund(fundCode);
    const info = await fund.info;
    if (info?.price == null || isNaN(Number(info.price))) return null;

    const price = Number(info.price);
    const dailyChange = info.daily_return != null ? Number(info.daily_return) : 0;
    const yearChangePct = info.return_1y != null ? Number(info.return_1y) : undefined;
    const fundSize = info.fund_size != null ? Number(info.fund_size) : undefined;
    let fundSizeStr: string | undefined = undefined;
    if (fundSize && fundSize > 0) {
      fundSizeStr = fundSize >= 1e9
        ? `${(fundSize / 1e9).toFixed(2)} Mr ₺`
        : `${(fundSize / 1e6).toFixed(1)} M ₺`;
    }

    const item: EnrichedPriceItem = {
      price: Number(price.toFixed(4)),
      dailyChange: Number(dailyChange.toFixed(2)),
      marketCap: fundSizeStr,
      yearChangePct,
    };

    BORSATS_FUND_CACHE.set(fundCode, { data: item, timestamp: Date.now() });
    return item;
  } catch {
    return null;
  }
}

// Initialize yahoo-finance2 instance with suppressed notices
const yf = typeof YahooFinance === "function" ? new (YahooFinance as unknown as new (opts: { suppressNotices: string[] }) => typeof YahooFinance)({ suppressNotices: ["yahooSurvey"] }) : YahooFinance;


// Fallback prices in case Yahoo is unreachable or rate-limited
const FALLBACK_PRICES: Record<string, { price: number; dailyChange: number; previousClose?: number }> = {
  THYAO: { price: 328.50, dailyChange: 2.65 },
  PGSUS: { price: 242.80, dailyChange: 1.95 },
  TAVHL: { price: 268.00, dailyChange: 0.85 },
  ASELS: { price: 64.20, dailyChange: 0.78 },
  SDTTR: { price: 245.50, dailyChange: 3.40 },
  MIATK: { price: 58.40, dailyChange: -1.20 },
  LOGO: { price: 98.60, dailyChange: 1.15 },
  REEDR: { price: 32.40, dailyChange: -0.85 },
  FROTO: { price: 1145.0, dailyChange: 3.10 },
  TOASO: { price: 248.60, dailyChange: 1.45 },
  DOAS: { price: 284.00, dailyChange: 0.65 },
  OTKAR: { price: 512.00, dailyChange: 2.10 },
  ARCLK: { price: 158.40, dailyChange: 0.45 },
  VESTL: { price: 68.20, dailyChange: -0.75 },
  TUPRS: { price: 172.30, dailyChange: -1.15 },
  ENJSA: { price: 63.80, dailyChange: 1.25 },
  ASTOR: { price: 104.50, dailyChange: 2.85 },
  KONTR: { price: 52.60, dailyChange: 3.80 },
  CWENE: { price: 215.00, dailyChange: 1.65 },
  EUPWR: { price: 112.40, dailyChange: 2.20 },
  ODAS: { price: 8.92, dailyChange: -0.45 },
  AKBNK: { price: 58.90, dailyChange: 1.80 },
  GARAN: { price: 118.50, dailyChange: 2.15 },
  ISCTR: { price: 14.85, dailyChange: 1.60 },
  YKBNK: { price: 32.40, dailyChange: 1.35 },
  VAKBN: { price: 21.80, dailyChange: 0.95 },
  ISMEN: { price: 38.50, dailyChange: 2.45 },
  KCHOL: { price: 218.40, dailyChange: 1.50 },
  SAHOL: { price: 94.60, dailyChange: 1.10 },
  ALARK: { price: 108.20, dailyChange: 2.30 },
  ENKAI: { price: 49.50, dailyChange: 0.75 },
  SISE: { price: 46.20, dailyChange: 0.85 },
  EREGL: { price: 52.80, dailyChange: -0.94 },
  KRDMD: { price: 27.60, dailyChange: 1.25 },
  BIMAS: { price: 542.00, dailyChange: -0.45 },
  MGROS: { price: 518.00, dailyChange: 1.85 },
  SOKM: { price: 54.80, dailyChange: 0.65 },
  CCOLA: { price: 68.50, dailyChange: 2.40 },
  TCELL: { price: 102.40, dailyChange: 1.15 },
  TTKOM: { price: 51.20, dailyChange: 0.85 },
  "ALTIN/GR": { price: 3120.4, dailyChange: 0.45 },
  CEYREK: { price: 5110.0, dailyChange: 0.45 },
  TAM: { price: 20440.0, dailyChange: 0.45 },
  ATA: { price: 21050.0, dailyChange: 0.48 },
  "GÜMÜŞ/GR": { price: 38.9, dailyChange: 1.80 },
  "PLATIN/GR": { price: 1145.0, dailyChange: 0.85 },
  BRENT: { price: 78.40, dailyChange: -0.65 },
  BAKIR: { price: 4.38, dailyChange: 1.20 },
  AFT: { price: 0.482, dailyChange: 1.95 },
  TTE: { price: 5.64, dailyChange: 2.40 },
  MAC: { price: 1.842, dailyChange: 1.45 },
  QQQ: { price: 492.50, dailyChange: 1.25 },
  SPY: { price: 564.80, dailyChange: 0.45 },
  GLD: { price: 245.80, dailyChange: 0.42 },
  "USD/TRY": { price: 47.88, dailyChange: 0.11 },
  "EUR/TRY": { price: 55.38, dailyChange: 0.37 },
  "GBP/TRY": { price: 64.80, dailyChange: 0.46 },
  "CHF/TRY": { price: 58.90, dailyChange: 0.22 },
  "EUR/USD": { price: 1.156, dailyChange: 0.05 },
  NVDA: { price: 138.25, dailyChange: 4.18 },
  AAPL: { price: 232.40, dailyChange: 0.92 },
  MSFT: { price: 448.50, dailyChange: 1.45 },
  GOOGL: { price: 182.40, dailyChange: 1.85 },
  AMZN: { price: 198.60, dailyChange: 2.10 },
  TSLA: { price: 218.40, dailyChange: 3.45 },
  PLTR: { price: 36.80, dailyChange: 5.12 },
  ASML: { price: 785.00, dailyChange: 2.35 },
};

const FALLBACK_INDICES: Record<string, { price: number; dailyChange: number; formattedPrice: string; isPositive: boolean }> = {
  "BIST 100": { price: 9840.5, dailyChange: 1.42, formattedPrice: "9.840,50", isPositive: true },
  "BIST 30": { price: 10720.1, dailyChange: 1.65, formattedPrice: "10.720,10", isPositive: true },
  "BIST Banka": { price: 13850.0, dailyChange: 2.10, formattedPrice: "13.850,00", isPositive: true },
  "BIST Sınai": { price: 14200.4, dailyChange: 0.95, formattedPrice: "14.200,40", isPositive: true },
  "BIST Teknoloji": { price: 12450.8, dailyChange: 3.20, formattedPrice: "12.450,80", isPositive: true },
  "BIST GYO": { price: 3420.5, dailyChange: 1.15, formattedPrice: "3.420,50", isPositive: true },
  "BIST Temettü": { price: 10890.2, dailyChange: 1.30, formattedPrice: "10.890,20", isPositive: true },
  "USD/TRY": { price: 47.88, dailyChange: 0.11, formattedPrice: "47,88 ₺", isPositive: true },
  "EUR/TRY": { price: 55.38, dailyChange: 0.37, formattedPrice: "55,38 ₺", isPositive: true },
  "Gram Altın": { price: 4078.0, dailyChange: 0.85, formattedPrice: "4.078,00 ₺", isPositive: true },
  "Gümüş/Gr": { price: 48.50, dailyChange: 1.40, formattedPrice: "48,50 ₺", isPositive: true },
  "Brent Petrol": { price: 74.20, dailyChange: -0.40, formattedPrice: "74,20 $", isPositive: false },
  "S&P 500": { price: 5648.4, dailyChange: 0.45, formattedPrice: "5.648,40", isPositive: true },
  "NASDAQ": { price: 17683.9, dailyChange: 0.84, formattedPrice: "17.683,90", isPositive: true },
  "ABD 10Y Tahvil": { price: 3.92, dailyChange: -0.05, formattedPrice: "%3,92", isPositive: false },
  "VIX Korku": { price: 15.40, dailyChange: -2.10, formattedPrice: "15,40", isPositive: false },
  "DXY Dolar": { price: 104.20, dailyChange: 0.15, formattedPrice: "104,20", isPositive: true },
};

export interface EnrichedPriceItem {
  price: number;
  dailyChange: number;
  previousClose?: number;
  high52?: number;
  low52?: number;
  dayHigh?: number;
  dayLow?: number;
  openPrice?: number;
  volume?: number;
  avgVolume?: number;
  volumeRatio?: number;
  peRatio?: number;
  pbRatio?: number;
  marketCap?: string;
  eps?: number;
  sharesOutstanding?: string;
  yearChangePct?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;

  // Analyst & Consensus
  targetMeanPrice?: number;
  targetHighPrice?: number;
  targetLowPrice?: number;
  recommendationKey?: string;
  numberOfAnalystOpinions?: number;
  targetUpsidePct?: number;

  // Calendar
  nextEarningsDate?: string;
  exDividendDate?: string;
  dividendRate?: number;

  // Financials & Margins
  totalRevenue?: string;
  netIncome?: string;
  operatingMargin?: number;
  returnOnEquity?: number;
}

// Cache structure (TTL: 10 minutes)
interface PriceCache {
  timestamp: number;
  data: {
    prices: Record<string, EnrichedPriceItem>;
    indices: Record<string, { price: number; dailyChange: number; formattedPrice: string; isPositive: boolean }>;
    formattedTime: string;
  };
}

let priceCache: PriceCache | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  // 1. Rate Limiting (30 requests per minute per IP)
  const clientIp = getClientIp(request);
  const rateLimit = await checkRateLimit(`prices:${clientIp}`, 30, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";
  const now = Date.now();

  // 2. Persistent Supabase DB Cache Check
  if (!forceRefresh && isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data: dbCache } = await supabaseAdmin
        .from("price_cache")
        .select("*")
        .eq("id", "latest")
        .maybeSingle();

      if (dbCache && dbCache.updated_at) {
        const cacheAge = now - new Date(dbCache.updated_at).getTime();
        if (cacheAge < CACHE_TTL_MS && dbCache.data) {
          return NextResponse.json({
            success: true,
            source: "persistent_cache",
            cachedAt: dbCache.updated_at,
            ...(dbCache.data as Record<string, unknown>),
          });
        }
      }
    } catch (dbErr) {
      console.warn("[Price API] DB cache fetch warning:", dbErr);
    }
  }

  // 3. Fallback In-Memory Cache Check
  if (!forceRefresh && priceCache && now - priceCache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      source: "memory_cache",
      cachedAt: new Date(priceCache.timestamp).toISOString(),
      ...priceCache.data,
    });
  }

// Live FX Rate fetcher from global central banks exchange API
async function fetchLiveFxRates(): Promise<{
  usdTry?: number;
  eurTry?: number;
  gbpTry?: number;
  chfTry?: number;
  eurUsd?: number;
}> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 300 }, // 5 mins cache
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && data.rates.TRY) {
        const usdTry = Number(data.rates.TRY);
        const eurRate = Number(data.rates.EUR) || 1;
        const gbpRate = Number(data.rates.GBP) || 1;
        const chfRate = Number(data.rates.CHF) || 1;
        return {
          usdTry: Number(usdTry.toFixed(4)),
          eurTry: Number((usdTry / eurRate).toFixed(4)),
          gbpTry: Number((usdTry / gbpRate).toFixed(4)),
          chfTry: Number((usdTry / chfRate).toFixed(4)),
          eurUsd: Number((1 / eurRate).toFixed(4)),
        };
      }
    }
  } catch (err) {
    console.warn("[Prices API] Live FX API error:", err);
  }
  return {};
}

interface YahooQuote {
  symbol?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketOpen?: number;
  regularMarketVolume?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  trailingPE?: number;
  marketCap?: number;
  [key: string]: unknown;
}

  try {
    // Fetch live FX rates in parallel
    const liveFxPromise = fetchLiveFxRates();
    const combinedSymbolMap: Record<string, string> = { ...SYMBOL_MAP };

    // Include all companies from ledger
    for (const c of MOCK_COMPANIES) {
      const sym = c.symbol.toUpperCase().trim();
      if (sym && !combinedSymbolMap[sym]) {
        combinedSymbolMap[sym] = getSymbolTicker(sym);
      }
    }

    // Dynamically include all symbols registered in the companies table
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const { data: dbCompanies } = await supabaseAdmin.from("companies").select("symbol");
        if (dbCompanies) {
          for (const c of dbCompanies) {
            const sym = (c.symbol as string)?.toUpperCase().trim();
            if (sym && !combinedSymbolMap[sym]) {
              combinedSymbolMap[sym] = getSymbolTicker(sym);
            }
          }
        }
      } catch (dbErr) {
        console.warn("[Prices API] Dynamic symbols DB query warning:", dbErr);
      }
    }

    const rawQuotes: Record<string, YahooQuote> = {};
    const symbolEntries = Object.entries(combinedSymbolMap);
    const yfSymbols = Array.from(new Set(Object.values(combinedSymbolMap))).filter(
      (s) =>
        !s.startsWith("TEFAS:") &&
        s !== "ALTIN/GR" &&
        s !== "CEYREK" &&
        s !== "TAM" &&
        s !== "ATA" &&
        s !== "GÜMÜŞ/GR" &&
        s !== "GUMUS/GR" &&
        s !== "PLATIN/GR"
    );

    // Chunked Batch Requests (50 symbols per chunk to respect Yahoo limits)
    const CHUNK_SIZE = 50;
    for (let i = 0; i < yfSymbols.length; i += CHUNK_SIZE) {
      const chunk = yfSymbols.slice(i, i + CHUNK_SIZE);
      try {
        const batchQuotes = (await yf.quote(chunk)) as unknown as YahooQuote[];
        if (Array.isArray(batchQuotes)) {
          const yfQuoteMap = new Map<string, YahooQuote>();
          for (const q of batchQuotes) {
            if (q && q.symbol) {
              yfQuoteMap.set(q.symbol.toUpperCase(), q);
            }
          }

          for (const [key, yfSymbol] of symbolEntries) {
            if (chunk.includes(yfSymbol)) {
              const quote = yfQuoteMap.get(yfSymbol.toUpperCase());
              if (quote) {
                rawQuotes[key] = quote;
              }
            }
          }
        }
      } catch (chunkErr) {
        console.warn(`[YahooFinance] Chunk ${i} warning, trying fallback:`, chunkErr);
        for (const sym of chunk) {
          try {
            const q = (await yf.quote(sym)) as unknown as YahooQuote;
            if (q && q.symbol) {
              for (const [key, yfSymbol] of symbolEntries) {
                if (yfSymbol.toUpperCase() === sym.toUpperCase()) {
                  rawQuotes[key] = q;
                }
              }
            }
          } catch {}
        }
      }
    }

    const updatedPrices: Record<string, EnrichedPriceItem> = {
      ...FALLBACK_PRICES,
    };

    const updatedIndices: Record<string, { price: number; dailyChange: number; formattedPrice: string; isPositive: boolean }> = {
      ...FALLBACK_INDICES,
    };

    // 1. Process regular stock, indices and FX quotes
    for (const [key, quote] of Object.entries(rawQuotes)) {
      if (quote?.regularMarketPrice != null) {
        const price = Number(quote.regularMarketPrice);
        const changePercent = quote.regularMarketChangePercent != null ? Number(quote.regularMarketChangePercent) : 0;
        const prevClose = quote.regularMarketPreviousClose != null ? Number(quote.regularMarketPreviousClose) : undefined;
        const high52 = quote.fiftyTwoWeekHigh != null ? Number(Number(quote.fiftyTwoWeekHigh).toFixed(2)) : undefined;
        const low52 = quote.fiftyTwoWeekLow != null ? Number(Number(quote.fiftyTwoWeekLow).toFixed(2)) : undefined;
        const dayHigh = quote.regularMarketDayHigh != null ? Number(Number(quote.regularMarketDayHigh).toFixed(2)) : undefined;
        const dayLow = quote.regularMarketDayLow != null ? Number(Number(quote.regularMarketDayLow).toFixed(2)) : undefined;
        const openPrice = quote.regularMarketOpen != null ? Number(Number(quote.regularMarketOpen).toFixed(2)) : undefined;
        const volume = quote.regularMarketVolume != null ? Number(quote.regularMarketVolume) : undefined;
        const avgVol = quote.averageDailyVolume3Month != null
          ? Number(quote.averageDailyVolume3Month)
          : (quote.averageDailyVolume10Day != null ? Number(quote.averageDailyVolume10Day) : undefined);
        const volumeRatio = (volume && avgVol && avgVol > 0) ? Number((volume / avgVol).toFixed(2)) : undefined;
        const peRatio = quote.trailingPE != null && Number(quote.trailingPE) > 0 ? Number(Number(quote.trailingPE).toFixed(1)) : undefined;
        const eps = quote.epsTrailingTwelveMonths != null ? Number(Number(quote.epsTrailingTwelveMonths).toFixed(2)) : undefined;
        const yearChangePct = quote["52WeekChange"] != null ? Number((Number(quote["52WeekChange"]) * 100).toFixed(1)) : undefined;

        let sharesOutstandingStr: string | undefined = undefined;
        if (quote.sharesOutstanding != null && Number(quote.sharesOutstanding) > 0) {
          const so = Number(quote.sharesOutstanding);
          if (so >= 1e9) sharesOutstandingStr = `${(so / 1e9).toFixed(2)} Mr Lot`;
          else if (so >= 1e6) sharesOutstandingStr = `${(so / 1e6).toFixed(1)} M Lot`;
          else sharesOutstandingStr = `${so.toLocaleString("tr-TR")} Lot`;
        }

        let marketCapStr: string | undefined = undefined;
        if (quote.marketCap != null && Number(quote.marketCap) > 0) {
          const mc = Number(quote.marketCap);
          if (mc >= 1e9) {
            marketCapStr = `${(mc / 1e9).toFixed(2)} Mr ₺`;
          } else if (mc >= 1e6) {
            marketCapStr = `${(mc / 1e6).toFixed(1)} M ₺`;
          }
        }

        // Analyst Targets
        const targetMeanPrice = quote.targetMeanPrice != null ? Number(Number(quote.targetMeanPrice).toFixed(2)) : undefined;
        const targetHighPrice = quote.targetHighPrice != null ? Number(Number(quote.targetHighPrice).toFixed(2)) : undefined;
        const targetLowPrice = quote.targetLowPrice != null ? Number(Number(quote.targetLowPrice).toFixed(2)) : undefined;
        const recommendationKey = quote.recommendationKey ? String(quote.recommendationKey).toLowerCase() : undefined;
        const numberOfAnalystOpinions = quote.numberOfAnalystOpinions != null ? Number(quote.numberOfAnalystOpinions) : undefined;
        const targetUpsidePct = (targetMeanPrice && price > 0) ? Number((((targetMeanPrice - price) / price) * 100).toFixed(1)) : undefined;

        // Calendar & Dividends
        let nextEarningsDate: string | undefined = undefined;
        if (quote.earningsTimestamp) {
          try {
            const dt = new Date(Number(quote.earningsTimestamp) * 1000);
            nextEarningsDate = dt.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
          } catch {}
        }
        let exDividendDate: string | undefined = undefined;
        if (quote.exDividendDate) {
          try {
            const dt = new Date(Number(quote.exDividendDate) * 1000);
            exDividendDate = dt.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
          } catch {}
        }
        const dividendRate = quote.trailingAnnualDividendRate != null ? Number(Number(quote.trailingAnnualDividendRate).toFixed(2)) : undefined;

        // Financial Highlights
        let totalRevenueStr: string | undefined = undefined;
        if (quote.totalRevenue != null && Number(quote.totalRevenue) > 0) {
          const tr = Number(quote.totalRevenue);
          totalRevenueStr = tr >= 1e9 ? `${(tr / 1e9).toFixed(2)} Mr ₺` : `${(tr / 1e6).toFixed(1)} M ₺`;
        }
        let netIncomeStr: string | undefined = undefined;
        if (quote.netIncomeToCommon != null && Number(quote.netIncomeToCommon) !== 0) {
          const ni = Number(quote.netIncomeToCommon);
          netIncomeStr = Math.abs(ni) >= 1e9 ? `${(ni / 1e9).toFixed(2)} Mr ₺` : `${(ni / 1e6).toFixed(1)} M ₺`;
        }
        const operatingMargin = quote.operatingMargins != null ? Number((Number(quote.operatingMargins) * 100).toFixed(1)) : undefined;
        const returnOnEquity = quote.returnOnEquity != null ? Number((Number(quote.returnOnEquity) * 100).toFixed(1)) : undefined;

        const isIndex = [
          "BIST 100", "BIST 30", "BIST Banka", "BIST Sınai", "BIST Teknoloji",
          "BIST GYO", "BIST Temettü", "S&P 500", "NASDAQ", "ABD 10Y Tahvil",
          "VIX Korku", "DXY Dolar"
        ].includes(key);

        if (isIndex) {
          const isYield = key === "ABD 10Y Tahvil";
          updatedIndices[key] = {
            price: Number(price.toFixed(2)),
            dailyChange: Number(changePercent.toFixed(2)),
            formattedPrice: isYield
              ? `%${price.toFixed(2)}`
              : price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            isPositive: changePercent >= 0,
          };
        } else {
          updatedPrices[key] = {
            price: Number(price.toFixed(2)),
            dailyChange: Number(changePercent.toFixed(2)),
            previousClose: prevClose ? Number(prevClose.toFixed(2)) : undefined,
            high52,
            low52,
            dayHigh,
            dayLow,
            openPrice,
            volume,
            avgVolume: avgVol,
            volumeRatio,
            peRatio,
            marketCap: marketCapStr,
            eps,
            sharesOutstanding: sharesOutstandingStr,
            yearChangePct,
            targetMeanPrice,
            targetHighPrice,
            targetLowPrice,
            recommendationKey,
            numberOfAnalystOpinions,
            targetUpsidePct,
            nextEarningsDate,
            exDividendDate,
            dividendRate,
            totalRevenue: totalRevenueStr,
            netIncome: netIncomeStr,
            operatingMargin,
            returnOnEquity,
          };
        }
      }
    }

    // 2. Await Live FX rates and merge
    const liveFx = await liveFxPromise;

    if (liveFx.usdTry && liveFx.usdTry > 0) {
      const dailyChange = rawQuotes["USD/TRY"]?.regularMarketChangePercent != null
        ? Number(Number(rawQuotes["USD/TRY"].regularMarketChangePercent).toFixed(2))
        : 0.11;
      updatedPrices["USD/TRY"] = {
        price: liveFx.usdTry,
        dailyChange,
      };
      updatedIndices["USD/TRY"] = {
        price: liveFx.usdTry,
        dailyChange,
        formattedPrice: `${liveFx.usdTry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
        isPositive: dailyChange >= 0,
      };
    }

    if (liveFx.eurTry && liveFx.eurTry > 0) {
      const dailyChange = rawQuotes["EUR/TRY"]?.regularMarketChangePercent != null
        ? Number(Number(rawQuotes["EUR/TRY"].regularMarketChangePercent).toFixed(2))
        : 0.37;
      updatedPrices["EUR/TRY"] = {
        price: liveFx.eurTry,
        dailyChange,
      };
      updatedIndices["EUR/TRY"] = {
        price: liveFx.eurTry,
        dailyChange,
        formattedPrice: `${liveFx.eurTry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
        isPositive: dailyChange >= 0,
      };
    }

    if (liveFx.gbpTry && liveFx.gbpTry > 0) {
      updatedPrices["GBP/TRY"] = {
        price: liveFx.gbpTry,
        dailyChange: 0.46,
      };
    }

    if (liveFx.chfTry && liveFx.chfTry > 0) {
      updatedPrices["CHF/TRY"] = {
        price: liveFx.chfTry,
        dailyChange: 0.22,
      };
    }

    if (liveFx.eurUsd && liveFx.eurUsd > 0) {
      updatedPrices["EUR/USD"] = {
        price: liveFx.eurUsd,
        dailyChange: 0.05,
      };
    }

    // 3. Compute Gram Gold & Gram Silver in TRY dynamically
    // 1 Troy Ounce = 31.1034768 Grams
    const effectiveUsdTry = liveFx.usdTry || rawQuotes["USD/TRY"]?.regularMarketPrice || FALLBACK_PRICES["USD/TRY"].price;
    const goldOunceUsd = rawQuotes["GOLD_OUNCE"]?.regularMarketPrice || 2650.0;
    const silverOunceUsd = rawQuotes["SILVER_OUNCE"]?.regularMarketPrice || 31.5;
    const platinumOunceUsd = rawQuotes["PLATINUM_OUNCE"]?.regularMarketPrice || 980.0;

    if (effectiveUsdTry && goldOunceUsd) {
      const gramGoldTry = (Number(goldOunceUsd) * Number(effectiveUsdTry)) / 31.1034768;
      const goldDailyChange = rawQuotes["GOLD_OUNCE"]?.regularMarketChangePercent != null
        ? Number(rawQuotes["GOLD_OUNCE"].regularMarketChangePercent)
        : FALLBACK_PRICES["ALTIN/GR"].dailyChange;

      updatedPrices["ALTIN/GR"] = {
        price: Number(gramGoldTry.toFixed(2)),
        dailyChange: Number(goldDailyChange.toFixed(2)),
      };

      updatedIndices["Gram Altın"] = {
        price: Number(gramGoldTry.toFixed(2)),
        dailyChange: Number(goldDailyChange.toFixed(2)),
        formattedPrice: `${gramGoldTry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
        isPositive: goldDailyChange >= 0,
      };

      // Gold derivatives (Çeyrek, Tam, Ata)
      updatedPrices["CEYREK"] = {
        price: Number((gramGoldTry * 1.635).toFixed(2)),
        dailyChange: Number(goldDailyChange.toFixed(2)),
      };

      updatedPrices["TAM"] = {
        price: Number((gramGoldTry * 6.54).toFixed(2)),
        dailyChange: Number(goldDailyChange.toFixed(2)),
      };

      updatedPrices["ATA"] = {
        price: Number((gramGoldTry * 6.75).toFixed(2)),
        dailyChange: Number(goldDailyChange.toFixed(2)),
      };
    }

    if (effectiveUsdTry && silverOunceUsd) {
      const gramSilverTry = (Number(silverOunceUsd) * Number(effectiveUsdTry)) / 31.1034768;
      const silverDailyChange = rawQuotes["SILVER_OUNCE"]?.regularMarketChangePercent != null
        ? Number(rawQuotes["SILVER_OUNCE"].regularMarketChangePercent)
        : FALLBACK_PRICES["GÜMÜŞ/GR"].dailyChange;

      updatedPrices["GÜMÜŞ/GR"] = {
        price: Number(gramSilverTry.toFixed(2)),
        dailyChange: Number(silverDailyChange.toFixed(2)),
      };

      updatedIndices["Gümüş/Gr"] = {
        price: Number(gramSilverTry.toFixed(2)),
        dailyChange: Number(silverDailyChange.toFixed(2)),
        formattedPrice: `${gramSilverTry.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`,
        isPositive: silverDailyChange >= 0,
      };
    }

    if (effectiveUsdTry && platinumOunceUsd) {
      const gramPlatinTry = (Number(platinumOunceUsd) * Number(effectiveUsdTry)) / 31.1034768;
      const platinDailyChange = rawQuotes["PLATINUM_OUNCE"]?.regularMarketChangePercent != null
        ? Number(rawQuotes["PLATINUM_OUNCE"].regularMarketChangePercent)
        : FALLBACK_PRICES["PLATIN/GR"].dailyChange;

      updatedPrices["PLATIN/GR"] = {
        price: Number(gramPlatinTry.toFixed(2)),
        dailyChange: Number(platinDailyChange.toFixed(2)),
      };
    }

    // 3. Process TEFAS Mutual Funds (using borsats Fund with fallback to direct TEFAS API)
    const tefasEntries = symbolEntries.filter(([_, ticker]) => ticker.startsWith("TEFAS:"));
    if (tefasEntries.length > 0) {
      await Promise.allSettled(
        tefasEntries.map(async ([key, ticker]) => {
          const fundCode = ticker.replace("TEFAS:", "").trim();
          try {
            // First attempt: borsats Fund info
            const borsatsFundData = await fetchBorsatsFundPrice(fundCode);
            if (borsatsFundData && borsatsFundData.price > 0) {
              updatedPrices[key] = borsatsFundData;
              return;
            }

            // Fallback: Direct TEFAS API query
            const today = new Date();
            const past = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const pad = (n: number) => n.toString().padStart(2, "0");
            const formatDate = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

            const bodyParams = new URLSearchParams({
              fontip: "YAT",
              sfontur: "",
              fonkod: fundCode,
              bastarih: formatDate(past),
              bittarih: formatDate(today),
            });

            const res = await fetch("https://www.tefas.gov.tr/api/DB/BindHistoryInfo", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json, text/javascript, */*; q=0.01",
                Referer: `https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=${fundCode}`,
              },
              body: bodyParams.toString(),
              next: { revalidate: 900 },
            });

            if (res.ok) {
              const data = await res.json();
              const records = data.data || data;
              if (Array.isArray(records) && records.length > 0) {
                const latest = records[records.length - 1];
                const prev = records.length > 1 ? records[records.length - 2] : null;
                const latestPrice = parseFloat(latest.FIYAT || latest.Price || "0");
                const prevPrice = prev ? parseFloat(prev.FIYAT || prev.Price || "0") : latestPrice;
                const dailyChange =
                  prevPrice > 0 ? Number((((latestPrice - prevPrice) / prevPrice) * 100).toFixed(2)) : 0;

                updatedPrices[key] = {
                  price: latestPrice,
                  dailyChange,
                  marketCap: latest.PORTFOYBUYUKLUK
                    ? `${(parseFloat(latest.PORTFOYBUYUKLUK) / 1e6).toFixed(1)} M ₺`
                    : undefined,
                };
              }
            }
          } catch (tefasErr) {
            console.warn(`[Prices API] TEFAS fetch error for ${key}:`, tefasErr);
          }
        })
      );
    }

    // 4. BIST Stocks Fallback & Expansion via borsats Ticker
    // For any BIST stocks that did not receive quotes from Yahoo Finance
    const missingBistSymbols = symbolEntries
      .filter(([key, ticker]) => {
        if (ticker.startsWith("TEFAS:") || key.includes("/") || key === "CEYREK" || key === "TAM" || key === "ATA") return false;
        // Check if rawQuotes returned valid data
        const hasValidYfQuote = rawQuotes[key]?.regularMarketPrice != null;
        return !hasValidYfQuote;
      })
      .map(([key]) => key);

    if (missingBistSymbols.length > 0) {
      // Chunked queries to maintain responsiveness
      const BATCH_SIZE = 15;
      for (let i = 0; i < missingBistSymbols.length; i += BATCH_SIZE) {
        const batch = missingBistSymbols.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map(async (sym) => {
            const borsatsStock = await fetchBorsatsStockPrice(sym);
            if (borsatsStock && borsatsStock.price > 0) {
              updatedPrices[sym] = borsatsStock;
            }
          })
        );
      }
    }

    const formattedTime = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const responsePayload = {
      prices: updatedPrices,
      indices: updatedIndices,
      formattedTime,
    };

    // Update in-memory cache
    priceCache = {
      timestamp: now,
      data: responsePayload,
    };

    // Save to persistent DB cache
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from("price_cache").upsert({
          id: "latest",
          data: responsePayload,
          updated_at: new Date().toISOString(),
        });
      } catch (err: unknown) {
        console.warn("[Price API] DB cache save error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      source: "yahoo_finance",
      timestamp: new Date().toISOString(),
      ...responsePayload,
    });
  } catch (error: unknown) {
    console.error("[Price API] Error during market sync:", error);

    // If cache exists, return it even if expired rather than failing
    if (priceCache) {
      return NextResponse.json({
        success: true,
        source: "expired_cache_fallback",
        ...priceCache.data,
      });
    }

    // Default fallback
    return NextResponse.json({
      success: true,
      source: "static_fallback",
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      prices: FALLBACK_PRICES,
      indices: FALLBACK_INDICES,
    });
  }
}
