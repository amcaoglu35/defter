import { NextResponse } from "next/server";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";

export interface KapDisclosureItem {
  id: string;
  title: string;
  disclosureType: string;
  publishDate: string;
  timeAgo: string;
  kapUrl: string;
}

// In-memory cache for KAP announcements (TTL: 15 minutes)
const kapCache = new Map<string, { timestamp: number; data: KapDisclosureItem[] }>();
const KAP_CACHE_TTL = 15 * 60 * 1000;

function formatTimeAgo(dateStr: string): string {
  try {
    const pubDate = new Date(dateStr).getTime();
    const now = Date.now();
    const diffMin = Math.floor((now - pubDate) / (1000 * 60));
    if (diffMin < 60) return `${Math.max(1, diffMin)} dk önce`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce`;
  } catch {
    return "Bugün";
  }
}

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = await checkRateLimit(`kap:${clientIp}`, 60, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "THYAO";
  const cleanSymbol = decodeURIComponent(symbol).toUpperCase().trim();

  const cacheKey = `kap:${cleanSymbol}`;
  const now = Date.now();
  const cached = kapCache.get(cacheKey);
  if (cached && now - cached.timestamp < KAP_CACHE_TTL) {
    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      source: "cache",
      data: cached.data,
    });
  }

  const items: KapDisclosureItem[] = [];

  try {
    // 1. Fetch KAP disclosures using Google's KAP-indexed feed
    const query = encodeURIComponent(`"${cleanSymbol}" site:kap.org.tr`);
    const kapRssUrl = `https://news.google.com/rss/search?q=${query}&hl=tr-TR&gl=TR&ceid=TR:tr`;

    const response = await fetch(kapRssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 900 },
    });

    if (response.ok) {
      const xmlText = await response.text();
      const itemRegex =
        /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/gi;
      let match;
      let count = 0;

      while ((match = itemRegex.exec(xmlText)) !== null && count < 5) {
        let rawTitle = match[1] || "";
        const link = match[2] || `https://www.kap.org.tr/tr/sirket-bilgileri/ozet/${cleanSymbol}`;
        const pubDate = match[3] || new Date().toISOString();

        rawTitle = rawTitle
          .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim();

        let disclosureType = "Özel Durum Açıklaması";
        if (rawTitle.toLowerCase().includes("temettü") || rawTitle.toLowerCase().includes("kar payı")) {
          disclosureType = "Kâr Payı Dağıtım İşlemleri";
        } else if (rawTitle.toLowerCase().includes("bilanço") || rawTitle.toLowerCase().includes("finansal rapor")) {
          disclosureType = "Finansal Rapor / Bilanço";
        } else if (rawTitle.toLowerCase().includes("genel kurul")) {
          disclosureType = "Genel Kurul Bildirimi";
        } else if (rawTitle.toLowerCase().includes("sermaye") || rawTitle.toLowerCase().includes("bedelli") || rawTitle.toLowerCase().includes("bedelsiz")) {
          disclosureType = "Sermaye Artırımı";
        } else if (rawTitle.toLowerCase().includes("pay alım") || rawTitle.toLowerCase().includes("geri alım")) {
          disclosureType = "Pay Geri Alım Bildirimi";
        }

        if (rawTitle) {
          items.push({
            id: `kap-${cleanSymbol}-${count}-${Date.now()}`,
            title: rawTitle,
            disclosureType,
            publishDate: pubDate,
            timeAgo: formatTimeAgo(pubDate),
            kapUrl: `https://www.kap.org.tr/tr/sirket-bilgileri/ozet/${cleanSymbol}`,
          });
          count++;
        }
      }
    }

    kapCache.set(cacheKey, { timestamp: now, data: items });

    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      count: items.length,
      source: "google_news_kap_search",
      data: items,
    });
  } catch (err) {
    console.warn(`[KAP API] Error fetching KAP disclosures for ${cleanSymbol}:`, err);
    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      count: 0,
      source: "error_empty",
      data: [],
    });
  }
}
