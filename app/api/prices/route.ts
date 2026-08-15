import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { SYMBOL_MAP, getSymbolTicker } from "@/lib/liveSymbols";
import { MOCK_COMPANIES } from "@/lib/mockData";

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
  "USD/TRY": { price: 36.45, dailyChange: 0.08 },
  "EUR/TRY": { price: 39.80, dailyChange: 0.12 },
  "GBP/TRY": { price: 47.10, dailyChange: 0.15 },
  "CHF/TRY": { price: 41.85, dailyChange: 0.05 },
  "EUR/USD": { price: 1.092, dailyChange: 0.05 },
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
  "USD/TRY": { price: 38.45, dailyChange: 0.12, formattedPrice: "38,45 ₺", isPositive: true },
  "EUR/TRY": { price: 41.80, dailyChange: 0.25, formattedPrice: "41,80 ₺", isPositive: true },
  "Gram Altın": { price: 3420.0, dailyChange: 0.85, formattedPrice: "3.420,00 ₺", isPositive: true },
  "Gümüş/Gr": { price: 39.50, dailyChange: 1.40, formattedPrice: "39,50 ₺", isPositive: true },
  "Brent Petrol": { price: 74.20, dailyChange: -0.40, formattedPrice: "74,20 $", isPositive: false },
  "S&P 500": { price: 5648.4, dailyChange: 0.45, formattedPrice: "5.648,40", isPositive: true },
  "NASDAQ": { price: 17683.9, dailyChange: 0.84, formattedPrice: "17.683,90", isPositive: true },
  "ABD 10Y Tahvil": { price: 3.92, dailyChange: -0.05, formattedPrice: "%3,92", isPositive: false },
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
  marketCap?: string;
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
    const yfSymbols = Array.from(new Set(Object.values(combinedSymbolMap)));

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

        let marketCapStr: string | undefined = undefined;
        if (quote.marketCap != null && Number(quote.marketCap) > 0) {
          const mc = Number(quote.marketCap);
          if (mc >= 1e9) {
            marketCapStr = `${(mc / 1e9).toFixed(2)} Mr ₺`;
          } else if (mc >= 1e6) {
            marketCapStr = `${(mc / 1e6).toFixed(1)} M ₺`;
          }
        }

        const isIndex = [
          "BIST 100", "BIST 30", "BIST Banka", "BIST Sınai", "BIST Teknoloji",
          "BIST GYO", "BIST Temettü", "S&P 500", "NASDAQ", "ABD 10Y Tahvil"
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
          };
        }
      }
    }

    // 2. Compute Gram Gold & Gram Silver in TRY dynamically
    // 1 Troy Ounce = 31.1034768 Grams
    const usdTryQuote = rawQuotes["USD/TRY"]?.regularMarketPrice || FALLBACK_PRICES["USD/TRY"].price;
    const goldOunceUsd = rawQuotes["GOLD_OUNCE"]?.regularMarketPrice || 2650.0;
    const silverOunceUsd = rawQuotes["SILVER_OUNCE"]?.regularMarketPrice || 31.5;

    const platinumOunceUsd = rawQuotes["PLATINUM_OUNCE"]?.regularMarketPrice || 980.0;

    if (usdTryQuote && goldOunceUsd) {
      const gramGoldTry = (Number(goldOunceUsd) * Number(usdTryQuote)) / 31.1034768;
      const goldDailyChange = rawQuotes["GOLD_OUNCE"]?.regularMarketChangePercent != null
        ? Number(rawQuotes["GOLD_OUNCE"].regularMarketChangePercent)
        : FALLBACK_PRICES["ALTIN/GR"].dailyChange;

      updatedPrices["ALTIN/GR"] = {
        price: Number(gramGoldTry.toFixed(2)),
        dailyChange: Number(goldDailyChange.toFixed(2)),
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

    if (usdTryQuote && silverOunceUsd) {
      const gramSilverTry = (Number(silverOunceUsd) * Number(usdTryQuote)) / 31.1034768;
      const silverDailyChange = rawQuotes["SILVER_OUNCE"]?.regularMarketChangePercent != null
        ? Number(rawQuotes["SILVER_OUNCE"].regularMarketChangePercent)
        : FALLBACK_PRICES["GÜMÜŞ/GR"].dailyChange;

      updatedPrices["GÜMÜŞ/GR"] = {
        price: Number(gramSilverTry.toFixed(2)),
        dailyChange: Number(silverDailyChange.toFixed(2)),
      };
    }

    if (usdTryQuote && platinumOunceUsd) {
      const gramPlatinTry = (Number(platinumOunceUsd) * Number(usdTryQuote)) / 31.1034768;
      const platinDailyChange = rawQuotes["PLATINUM_OUNCE"]?.regularMarketChangePercent != null
        ? Number(rawQuotes["PLATINUM_OUNCE"].regularMarketChangePercent)
        : FALLBACK_PRICES["PLATIN/GR"].dailyChange;

      updatedPrices["PLATIN/GR"] = {
        price: Number(gramPlatinTry.toFixed(2)),
        dailyChange: Number(platinDailyChange.toFixed(2)),
      };
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
