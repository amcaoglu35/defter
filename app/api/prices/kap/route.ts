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
          .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&nbsp;/g, " ")
          .trim();

        // Categorize disclosure type based on official KAP taxonomy (FR / ODA / DG)
        let disclosureType = "Özel Durum Açıklaması (ODA)";
        const lower = rawTitle.toLowerCase();
        if (lower.includes("temettü") || lower.includes("kar payı") || lower.includes("kâr payı")) {
          disclosureType = "Kâr Payı Dağıtım İşlemleri";
        } else if (lower.includes("bilanço") || lower.includes("finansal rapor") || lower.includes("faaliyet raporu")) {
          disclosureType = "Finansal Rapor (FR)";
        } else if (lower.includes("genel kurul")) {
          disclosureType = "Genel Kurul Bildirimi";
        } else if (lower.includes("sermaye") || lower.includes("bedelli") || lower.includes("bedelsiz") || lower.includes("tahsisli")) {
          disclosureType = "Sermaye Artırımı / Azaltımı";
        } else if (lower.includes("pay alım") || lower.includes("geri alım")) {
          disclosureType = "Pay Geri Alım Bildirimi";
        } else if (lower.includes("derecelendirme") || lower.includes("kredi notu")) {
          disclosureType = "Kredi Derecelendirmesi";
        } else if (lower.includes("ihale") || lower.includes("yeni iş")) {
          disclosureType = "Yeni İş İlişkisi / İhale";
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
