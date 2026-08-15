import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { getSymbolTicker } from "@/lib/liveSymbols";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";

const yf = typeof YahooFinance === "function"
  ? new (YahooFinance as unknown as new (opts: { suppressNotices: string[] }) => typeof YahooFinance)({ suppressNotices: ["yahooSurvey"] })
  : YahooFinance;

interface HistoryPoint {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

// In-memory cache for historical charts (TTL: 15 minutes)
const historyCache = new Map<string, { timestamp: number; data: HistoryPoint[] }>();
const CACHE_TTL = 15 * 60 * 1000;

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = await checkRateLimit(`history:${clientIp}`, 60, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const rawSymbol = searchParams.get("symbol") || "THYAO";
  const period = searchParams.get("period") || "6A"; // 1A | 3A | 6A | 1Y
  const cleanSymbol = decodeURIComponent(rawSymbol).toUpperCase().trim();
  const ticker = getSymbolTicker(cleanSymbol);

  const cacheKey = `${ticker}:${period}`;
  const now = Date.now();
  const cached = historyCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      ticker,
      period,
      source: "cache",
      data: cached.data,
    });
  }

  try {
    let days = 180;
    let interval: "1d" | "1wk" = "1d";

    if (period === "1A") days = 30;
    else if (period === "3A") days = 90;
    else if (period === "6A") days = 180;
    else if (period === "1Y") {
      days = 365;
      interval = "1d";
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Call Yahoo Finance historical / chart API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartResult = (await (yf as any).chart(ticker, {
      period1: startDate,
      period2: new Date(),
      interval,
    })) as { quotes?: Array<{ date: Date | string; close?: number; open?: number; high?: number; low?: number; volume?: number }> };

    const quotes = chartResult?.quotes || [];
    const validPoints: HistoryPoint[] = [];

    for (const q of quotes) {
      if (q && q.close != null && !isNaN(q.close)) {
        const d = new Date(q.date);
        validPoints.push({
          date: d.toISOString().split("T")[0],
          close: Number(Number(q.close).toFixed(2)),
          open: q.open != null ? Number(Number(q.open).toFixed(2)) : undefined,
          high: q.high != null ? Number(Number(q.high).toFixed(2)) : undefined,
          low: q.low != null ? Number(Number(q.low).toFixed(2)) : undefined,
          volume: q.volume != null ? Number(q.volume) : undefined,
        });
      }
    }

    if (validPoints.length > 0) {
      historyCache.set(cacheKey, { timestamp: now, data: validPoints });

      return NextResponse.json({
        success: true,
        symbol: cleanSymbol,
        ticker,
        period,
        count: validPoints.length,
        source: "live_yahoo",
        data: validPoints,
      });
    }

    return NextResponse.json({
      success: false,
      symbol: cleanSymbol,
      error: "Geçmiş fiyat verisi bulunamadı.",
    }, { status: 404 });
  } catch (error: unknown) {
    console.warn(`[History API] Error fetching history for ${ticker}:`, error);
    return NextResponse.json({
      success: false,
      symbol: cleanSymbol,
      error: "Geçmiş piyasa verisi alınırken bir hata oluştu.",
    }, { status: 500 });
  }
}
