import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { Ticker, Fund } from "@muhammedaksam/borsats";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";
import { Company } from "@/lib/mockData";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const LOOKUP_CACHE = new Map<string, { data: Partial<Company>; timestamp: number }>();
const LOOKUP_CACHE_TTL = 3 * 60 * 1000; // 3 mins

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

function formatLargeNum(val?: number, currency: string = "₺"): string | undefined {
  if (val == null || isNaN(val) || val <= 0) return undefined;
  if (currency === "₺") {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)} Mr ₺`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(1)} M ₺`;
    return `${val.toLocaleString("tr-TR")} ₺`;
  }
  if (currency === "$") {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    return `$${val.toLocaleString("en-US")}`;
  }
  if (currency === "€") {
    if (val >= 1e9) return `€${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `€${(val / 1e6).toFixed(1)}M`;
    return `€${val.toLocaleString("de-DE")}`;
  }
  return `${val.toLocaleString()}`;
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(ip, 90, 60 * 1000);

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const rawSymbol = searchParams.get("symbol")?.trim();

  if (!rawSymbol) {
    return NextResponse.json(
      { success: false, error: "Sembol parametresi gereklidir." },
      { status: 400 }
    );
  }

  const cacheKey = rawSymbol.toUpperCase();
  const cached = LOOKUP_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < LOOKUP_CACHE_TTL) {
    return NextResponse.json({
      success: true,
      data: cached.data,
      cached: true,
    });
  }

  try {
    let cleanSymbol = rawSymbol.toUpperCase();
    let isBist = false;

    if (cleanSymbol.endsWith(".IS")) {
      isBist = true;
      cleanSymbol = cleanSymbol.replace(".IS", "");
    } else if (cleanSymbol.length === 3 && /^[A-Z]{3}$/.test(cleanSymbol)) {
      // Possible TEFAS fund
      try {
        const fund = new Fund(cleanSymbol);
        const info = (await fund.info) as unknown as Record<string, unknown>;
        if (info && (info["title"] || info["name"]) && info["price"]) {
          const fundTitle = String(info["title"] || info["name"] || cleanSymbol);
          const fundPrice = Number(Number(info["price"]).toFixed(4));
          const dailyChange = info["daily_return"] != null ? Number(Number(info["daily_return"]).toFixed(2)) : 0;
          const companyData: Partial<Company> = {
            id: cleanSymbol.toLowerCase(),
            symbol: cleanSymbol,
            name: fundTitle,
            sector: "Yatırım Fonu",
            exchange: "BIST",
            assetClass: "fon",
            indexTag: "TEFAS",
            price: fundPrice,
            currency: "₺",
            dailyChange,
            marketCap: formatLargeNum(info["fund_size"] ? Number(info["fund_size"]) : undefined, "₺"),
            recommendation: "AL",
            inWatchlist: true,
            description: `${fundTitle} - TEFAS Portföy Yatırım Fonu`,
            fundManager: info["founder"] ? String(info["founder"]) : "Portföy Yönetim",
            fundType: "Yatırım Fonu",
            oneYearReturn: info["return_1y"] != null ? Number(Number(info["return_1y"]).toFixed(2)) : undefined,
            metrics: [
              ...(info["return_1y"] ? [{ label: "1 Yıllık Getiri", value: `%${info["return_1y"]}` }] : []),
              ...(info["fund_size"] ? [{ label: "Fon Büyüklüğü", value: formatLargeNum(Number(info["fund_size"]), "₺") || "" }] : []),
            ],
          };
          LOOKUP_CACHE.set(cacheKey, { data: companyData, timestamp: Date.now() });
          return NextResponse.json({ success: true, data: companyData });
        }
      } catch {
        // Not a TEFAS fund, continue
      }
    }

    // Try borsats first for BIST symbols if no dot
    if (!cleanSymbol.includes(".") && (/^[A-Z0-9]{4,6}$/.test(cleanSymbol) || isBist)) {
      try {
        const stock = new Ticker(cleanSymbol);
        const fastInfo = await stock.fastInfo;
        const lastPrice = await fastInfo.lastPrice;
        if (lastPrice && !isNaN(lastPrice) && lastPrice > 0) {
          const prevClose = (await fastInfo.previousClose) ?? undefined;
          const dailyChange = prevClose && prevClose > 0
            ? Number((((lastPrice - prevClose) / prevClose) * 100).toFixed(2))
            : 0;
          const pe = (await fastInfo.peRatio) ? Number(Number(await fastInfo.peRatio).toFixed(1)) : undefined;
          const pb = (await fastInfo.pbRatio) ? Number(Number(await fastInfo.pbRatio).toFixed(2)) : undefined;
          const mcap = (await fastInfo.marketCap) ?? undefined;
          const high52 = (await fastInfo.yearHigh) ?? undefined;
          const low52 = (await fastInfo.yearLow) ?? undefined;

          const companyData: Partial<Company> = {
            id: cleanSymbol.toLowerCase(),
            symbol: cleanSymbol,
            name: `${cleanSymbol} A.Ş.`,
            sector: "BIST Sanayi & Ticaret",
            exchange: "BIST",
            assetClass: "hisse",
            indexTag: "BIST 100",
            price: Number(lastPrice.toFixed(2)),
            currency: "₺",
            dailyChange,
            peRatio: pe && pe > 0 ? pe : undefined,
            pbRatio: pb && pb > 0 ? pb : undefined,
            marketCap: formatLargeNum(mcap, "₺"),
            high52: high52 ? Number(high52.toFixed(2)) : undefined,
            low52: low52 ? Number(low52.toFixed(2)) : undefined,
            recommendation: "AL",
            inWatchlist: true,
            description: `${cleanSymbol} Borsa İstanbul işlem varlığı.`,
            metrics: [
              ...(pe ? [{ label: "F/K Oranı", value: `${pe}x` }] : []),
              ...(pb ? [{ label: "PD/DD", value: `${pb}` }] : []),
            ],
          };

          LOOKUP_CACHE.set(cacheKey, { data: companyData, timestamp: Date.now() });
          return NextResponse.json({ success: true, data: companyData });
        }
      } catch {
        // Fallback to Yahoo Finance
      }
    }

    // Yahoo Finance Query
    const yfTicker = isBist && !rawSymbol.endsWith(".IS") ? `${cleanSymbol}.IS` : rawSymbol;
    const quoteSummary = await yf.quoteSummary(yfTicker, {
      modules: [
        "price",
        "summaryDetail",
        "defaultKeyStatistics",
        "financialData",
        "assetProfile",
        "recommendationTrend",
      ],
    });

    const priceMod = quoteSummary.price;
    const summaryMod = quoteSummary.summaryDetail;
    const keyStats = quoteSummary.defaultKeyStatistics;
    const finData = quoteSummary.financialData;
    const profile = quoteSummary.assetProfile;

    if (!priceMod || priceMod.regularMarketPrice == null) {
      return NextResponse.json(
        { success: false, error: "Varlık fiyat verisi Yahoo Finance üzerinde bulunamadı." },
        { status: 404 }
      );
    }

    const regularPrice = Number(priceMod.regularMarketPrice);
    const dailyChange = priceMod.regularMarketChangePercent != null
      ? Number((priceMod.regularMarketChangePercent * 100).toFixed(2))
      : 0;
    const rawCurrency = priceMod.currency || "USD";
    const currencySymbol = rawCurrency === "TRY" ? "₺" : rawCurrency === "EUR" ? "€" : rawCurrency === "GBP" ? "£" : "$";

    const exchangeName = (priceMod.exchangeName || "").toUpperCase();
    const isTurkish = yfTicker.endsWith(".IS") || rawCurrency === "TRY";
    const isEuropean = yfTicker.includes(".DE") || yfTicker.includes(".PA") || yfTicker.includes(".AS") || yfTicker.includes(".MC") || yfTicker.includes(".MI") || yfTicker.includes(".SW") || yfTicker.includes(".L") || exchangeName.includes("GER") || exchangeName.includes("PAR") || exchangeName.includes("AMS") || exchangeName.includes("LON");
    
    let exchangeVal: "BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz" = "ABD";
    if (isTurkish) exchangeVal = "BIST";
    else if (isEuropean) exchangeVal = "Avrupa";

    const pe = summaryMod?.trailingPE != null ? Number(Number(summaryMod.trailingPE).toFixed(1)) : undefined;
    const pb = keyStats?.priceToBook != null ? Number(Number(keyStats.priceToBook).toFixed(2)) : undefined;
    const divYield = summaryMod?.dividendYield != null ? Number((summaryMod.dividendYield * 100).toFixed(2)) : undefined;
    const marketCapVal = priceMod.marketCap || summaryMod?.marketCap;
    const betaVal = summaryMod?.beta != null ? Number(Number(summaryMod.beta).toFixed(2)) : undefined;

    const high52 = summaryMod?.fiftyTwoWeekHigh != null ? Number(Number(summaryMod.fiftyTwoWeekHigh).toFixed(2)) : undefined;
    const low52 = summaryMod?.fiftyTwoWeekLow != null ? Number(Number(summaryMod.fiftyTwoWeekLow).toFixed(2)) : undefined;
    const targetMean = finData?.targetMeanPrice != null ? Number(Number(finData.targetMeanPrice).toFixed(2)) : undefined;
    const targetHigh = finData?.targetHighPrice != null ? Number(Number(finData.targetHighPrice).toFixed(2)) : undefined;
    const targetLow = finData?.targetLowPrice != null ? Number(Number(finData.targetLowPrice).toFixed(2)) : undefined;

    let targetUpsidePct: number | undefined = undefined;
    if (targetMean && regularPrice > 0) {
      targetUpsidePct = Number((((targetMean - regularPrice) / regularPrice) * 100).toFixed(1));
    }

    let recommendation: "AL" | "SAT" | "TUT" | "NÖTR" = "AL";
    const recKey = finData?.recommendationKey?.toLowerCase();
    if (recKey === "buy" || recKey === "strong_buy") recommendation = "AL";
    else if (recKey === "sell" || recKey === "strong_sell") recommendation = "SAT";
    else if (recKey === "hold") recommendation = "TUT";

    const companyData: Partial<Company> = {
      id: cleanSymbol.toLowerCase().replace(/[^a-z0-9]/g, ""),
      symbol: cleanSymbol,
      name: priceMod.longName || priceMod.shortName || cleanSymbol,
      sector: mapSector(profile?.sector),
      exchange: exchangeVal,
      assetClass: priceMod.quoteType === "ETF" ? "fon" : "hisse",
      indexTag: exchangeVal === "BIST" ? "BIST 100" : exchangeVal === "Avrupa" ? "Avrupa" : "S&P 500",
      price: Number(regularPrice.toFixed(2)),
      currency: currencySymbol,
      dailyChange,
      peRatio: pe && pe > 0 ? pe : undefined,
      pbRatio: pb && pb > 0 ? pb : undefined,
      dividendYield: divYield && divYield > 0 ? divYield : undefined,
      marketCap: formatLargeNum(marketCapVal, currencySymbol),
      beta: betaVal,
      high52,
      low52,
      targetMeanPrice: targetMean,
      targetHighPrice: targetHigh,
      targetLowPrice: targetLow,
      targetUpsidePct,
      recommendation,
      inWatchlist: true,
      description: profile?.longBusinessSummary || `${cleanSymbol} şirket profili.`,
      ceo: profile?.companyOfficers?.[0]?.name,
      fullTimeEmployees: profile?.fullTimeEmployees,
      website: profile?.website,
      city: profile?.city,
      metrics: [
        ...(pe ? [{ label: "F/K Oranı", value: `${pe}x` }] : []),
        ...(pb ? [{ label: "PD/DD", value: `${pb}` }] : []),
        ...(divYield ? [{ label: "Temettü Verimi", value: `%${divYield}` }] : []),
        ...(betaVal ? [{ label: "Beta", value: `${betaVal}` }] : []),
      ],
    };

    LOOKUP_CACHE.set(cacheKey, { data: companyData, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      data: companyData,
    });
  } catch (error: unknown) {
    console.error("Lookup API error:", error);
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || "Varlık verisi alınamadı." },
      { status: 500 }
    );
  }
}
