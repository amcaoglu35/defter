import { NextResponse } from "next/server";
import { Fund } from "@muhammedaksam/borsats";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";

interface TefasFundInfo {
  code: string;
  name?: string;
  category?: string;
  price: number;
  date: string;
  totalValue?: number;
  sharesCount?: number;
  investorCount?: number;
  dailyChangePct?: number;
  return1m?: number;
  return3m?: number;
  return6m?: number;
  returnYtd?: number;
  return1y?: number;
  return3y?: number;
  return5y?: number;
  riskValue?: number;
}

// In-memory cache for TEFAS fund data (TTL: 15 minutes)
const tefasCache = new Map<string, { timestamp: number; data: TefasFundInfo }>();
const TEFAS_CACHE_TTL = 15 * 60 * 1000;

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = await checkRateLimit(`tefas:${clientIp}`, 60, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") || searchParams.get("symbol") || "TI2";
  const cleanCode = decodeURIComponent(code).toUpperCase().trim();

  const cacheKey = `tefas:${cleanCode}`;
  const now = Date.now();
  const cached = tefasCache.get(cacheKey);
  if (cached && now - cached.timestamp < TEFAS_CACHE_TTL) {
    return NextResponse.json({
      success: true,
      code: cleanCode,
      source: "cache",
      data: cached.data,
    });
  }

  try {
    // 1. First Attempt: borsats Fund info
    try {
      const fund = new Fund(cleanCode);
      const info = await fund.info;
      if (info && info.price != null && !isNaN(Number(info.price))) {
        const fundData: TefasFundInfo = {
          code: cleanCode,
          name: info.name,
          category: info.category || info.fund_type,
          price: Number(info.price),
          date: info.date || new Date().toISOString().split("T")[0],
          totalValue: info.fund_size ? Number(info.fund_size) : undefined,
          investorCount: info.investor_count ? Number(info.investor_count) : undefined,
          dailyChangePct: info.daily_return != null ? Number(info.daily_return) : undefined,
          return1m: info.return_1m != null ? Number(info.return_1m) : undefined,
          return3m: info.return_3m != null ? Number(info.return_3m) : undefined,
          return6m: info.return_6m != null ? Number(info.return_6m) : undefined,
          returnYtd: info.return_ytd != null ? Number(info.return_ytd) : undefined,
          return1y: info.return_1y != null ? Number(info.return_1y) : undefined,
          return3y: info.return_3y != null ? Number(info.return_3y) : undefined,
          return5y: info.return_5y != null ? Number(info.return_5y) : undefined,
          riskValue: info.risk_value != null ? Number(info.risk_value) : undefined,
        };

        tefasCache.set(cacheKey, { timestamp: now, data: fundData });

        return NextResponse.json({
          success: true,
          code: cleanCode,
          source: "borsats_fund",
          data: fundData,
        });
      }
    } catch (borsatsErr) {
      console.warn(`[TEFAS API] borsats fetch fallback for ${cleanCode}:`, borsatsErr);
    }
    // Format start & end date for the past 5 days
    const today = new Date();
    const past = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatDate = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

    const startDate = formatDate(past);
    const endDate = formatDate(today);

    // Call TEFAS historical price endpoint
    const bodyParams = new URLSearchParams({
      fontip: "YAT",
      sfontur: "",
      fonkod: cleanCode,
      bastarih: startDate,
      bittarih: endDate,
    });

    const response = await fetch("https://www.tefas.gov.tr/api/DB/BindHistoryInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json, text/javascript, */*; q=0.01",
        Referer: `https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=${cleanCode}`,
      },
      body: bodyParams.toString(),
      next: { revalidate: 900 },
    });

    if (response.ok) {
      const result = await response.json();
      const records = result.data || result;

      if (Array.isArray(records) && records.length > 0) {
        // Sort descending by date
        const latest = records[records.length - 1];
        const prev = records.length > 1 ? records[records.length - 2] : null;

        const latestPrice = parseFloat(latest.FIYAT || latest.Price || "0");
        const prevPrice = prev ? parseFloat(prev.FIYAT || prev.Price || "0") : latestPrice;
        const dailyChangePct = prevPrice > 0 ? Number((((latestPrice - prevPrice) / prevPrice) * 100).toFixed(2)) : 0;

        const fundData: TefasFundInfo = {
          code: cleanCode,
          price: latestPrice,
          date: latest.TARIH || latest.Date || new Date().toISOString().split("T")[0],
          totalValue: latest.PORTFOYBUYUKLUK ? parseFloat(latest.PORTFOYBUYUKLUK) : undefined,
          sharesCount: latest.TEDPAYSAYISI ? parseFloat(latest.TEDPAYSAYISI) : undefined,
          investorCount: latest.KISIKISI ? parseInt(latest.KISIKISI, 10) : undefined,
          dailyChangePct,
        };

        tefasCache.set(cacheKey, { timestamp: now, data: fundData });

        return NextResponse.json({
          success: true,
          code: cleanCode,
          source: "tefas_gov_tr",
          data: fundData,
        });
      }
    }

    return NextResponse.json({
      success: false,
      code: cleanCode,
      error: "TEFAS veri tabanında bu fon kodu için kayıt bulunamadı.",
    }, { status: 404 });
  } catch (err) {
    console.warn(`[TEFAS API] Error fetching fund data for ${cleanCode}:`, err);
    return NextResponse.json({
      success: false,
      code: cleanCode,
      error: "TEFAS bağlantı hatası.",
    }, { status: 500 });
  }
}
