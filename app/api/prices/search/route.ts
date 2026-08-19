import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// In-memory micro cache for search queries (5 mins)
const SEARCH_CACHE = new Map<string, { data: SearchResultItem[]; timestamp: number }>();
const SEARCH_CACHE_TTL = 5 * 60 * 1000;

export interface SearchResultItem {
  symbol: string;
  cleanSymbol: string;
  name: string;
  exchange: "BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz";
  exchangeDisplay: string;
  quoteType: string;
  sector?: string;
  currency: string;
  assetClass: "hisse" | "fon" | "maden" | "doviz";
}

function mapSector(sectorRaw?: string): string {
  if (!sectorRaw) return "Genel Sektör";
  const lower = sectorRaw.toLowerCase();
  if (lower.includes("tech") || lower.includes("software") || lower.includes("semiconductor")) return "Teknoloji & Yazılım";
  if (lower.includes("financial") || lower.includes("bank") || lower.includes("insurance")) return "Finans & Bankacılık";
  if (lower.includes("health") || lower.includes("pharma") || lower.includes("biotech")) return "Sağlık & İlaç";
  if (lower.includes("consumer") && lower.includes("cyclical")) return "Tüketim & Perakende";
  if (lower.includes("consumer") && lower.includes("defensive")) return "Temel Tüketim & Gıda";
  if (lower.includes("industrials") || lower.includes("aerospace")) return "Sanayi & Üretim";
  if (lower.includes("energy") || lower.includes("oil") || lower.includes("gas")) return "Enerji & Petrol";
  if (lower.includes("auto") || lower.includes("motor")) return "Otomotiv";
  if (lower.includes("utilities")) return "Altyapı & Elektrik";
  if (lower.includes("real estate") || lower.includes("reit")) return "GYO & Gayrimenkul";
  if (lower.includes("communication") || lower.includes("telecom")) return "Telekom & Medya";
  if (lower.includes("materials") || lower.includes("chemical") || lower.includes("steel")) return "Madencilik & Kimya";
  return sectorRaw;
}

function mapExchangeAndAsset(
  sym: string,
  exchDisp?: string,
  rawExch?: string,
  quoteType?: string
): {
  exchange: "BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz";
  currency: string;
  assetClass: "hisse" | "fon" | "maden" | "doviz";
} {
  const upperSym = sym.toUpperCase();
  const upperExch = (exchDisp || rawExch || "").toUpperCase();

  // BIST
  if (upperSym.endsWith(".IS") || upperExch.includes("ISTANBUL") || upperExch.includes("BIST")) {
    return { exchange: "BIST", currency: "₺", assetClass: quoteType === "ETF" ? "fon" : "hisse" };
  }

  // Currency
  if (quoteType === "CURRENCY" || upperSym.endsWith("=X")) {
    return { exchange: "Döviz", currency: "₺", assetClass: "doviz" };
  }

  // Commodities / Metals
  if (
    quoteType === "FUTURE" ||
    upperSym.includes("GC=F") ||
    upperSym.includes("SI=F") ||
    upperSym.includes("PL=F") ||
    upperSym.includes("CL=F")
  ) {
    return { exchange: "Emtia", currency: "$", assetClass: "maden" };
  }

  // European Exchanges
  if (
    upperSym.endsWith(".DE") ||
    upperSym.endsWith(".PA") ||
    upperSym.endsWith(".AS") ||
    upperSym.endsWith(".MC") ||
    upperSym.endsWith(".MI") ||
    upperSym.endsWith(".SW") ||
    upperSym.endsWith(".L") ||
    upperExch.includes("XETRA") ||
    upperExch.includes("FRANKFURT") ||
    upperExch.includes("PARIS") ||
    upperExch.includes("AMSTERDAM") ||
    upperExch.includes("MADRID") ||
    upperExch.includes("MILAN") ||
    upperExch.includes("SWISS") ||
    upperExch.includes("SIX") ||
    upperExch.includes("LONDON")
  ) {
    const isUK = upperSym.endsWith(".L") || upperExch.includes("LONDON");
    return {
      exchange: "Avrupa",
      currency: isUK ? "£" : "€",
      assetClass: quoteType === "ETF" ? "fon" : "hisse",
    };
  }

  // US Markets (NASDAQ, NYSE, AMEX, BATS)
  if (quoteType === "ETF") {
    return { exchange: "ABD", currency: "$", assetClass: "fon" };
  }

  return { exchange: "ABD", currency: "$", assetClass: "hisse" };
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(ip, 90, 60 * 1000);

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 1) {
    return NextResponse.json({ success: true, count: 0, results: [] });
  }

  const cacheKey = query.toUpperCase();
  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_TTL) {
    return NextResponse.json({
      success: true,
      count: cached.data.length,
      results: cached.data,
      cached: true,
    });
  }

  try {
    const searchRes = await yf.search(query, {
      newsCount: 0,
      enableFuzzyQuery: true,
    });

    const quotes = searchRes.quotes || [];
    const results: SearchResultItem[] = (quotes as Record<string, unknown>[])
      .filter((q) => q["symbol"] && (q["quoteType"] === "EQUITY" || q["quoteType"] === "ETF" || q["quoteType"] === "MUTUALFUND" || q["quoteType"] === "CURRENCY" || q["quoteType"] === "FUTURE"))
      .slice(0, 15)
      .map((q) => {
        const symbol = String(q["symbol"] ?? "");
        let cleanSymbol = symbol;
        if (cleanSymbol.endsWith(".IS")) cleanSymbol = cleanSymbol.replace(".IS", "");

        const { exchange, currency, assetClass } = mapExchangeAndAsset(
          symbol,
          q["exchDisp"] ? String(q["exchDisp"]) : undefined,
          q["exchange"] ? String(q["exchange"]) : undefined,
          q["quoteType"] ? String(q["quoteType"]) : undefined
        );

        return {
          symbol,
          cleanSymbol,
          name: String(q["longname"] || q["shortname"] || cleanSymbol),
          exchange,
          exchangeDisplay: String(q["exchDisp"] || q["exchange"] || exchange),
          quoteType: String(q["quoteType"] || "EQUITY"),
          sector: mapSector(q["sector"] ? String(q["sector"]) : (q["sectorDisp"] ? String(q["sectorDisp"]) : undefined)),
          currency,
          assetClass,
        };
      });

    SEARCH_CACHE.set(cacheKey, { data: results, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error: unknown) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || "Arama sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
