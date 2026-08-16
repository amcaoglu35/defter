import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import {
  getClientIp,
  checkRateLimit,
  createRateLimitResponse,
} from "@/lib/rateLimit";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

interface NewsItem {
  id: string;
  title: string;
  link: string;
  publisher: string;
  publishedAt: string;
  timeAgo: string;
}

// In-memory cache for news (TTL: 15 minutes)
const newsCache = new Map<string, { timestamp: number; data: NewsItem[] }>();
const NEWS_CACHE_TTL = 15 * 60 * 1000;

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
  const rateLimit = await checkRateLimit(`news:${clientIp}`, 60, 60000);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "THYAO";
  const name = searchParams.get("name") || "";
  const cleanSymbol = decodeURIComponent(symbol).toUpperCase().trim();
  const cleanName = decodeURIComponent(name).trim();

  const cacheKey = `news:${cleanSymbol}`;
  const now = Date.now();
  const cached = newsCache.get(cacheKey);
  if (cached && now - cached.timestamp < NEWS_CACHE_TTL) {
    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      source: "cache",
      data: cached.data,
    });
  }

  const items: NewsItem[] = [];
  const seenTitles = new Set<string>();

  try {
    // 1. Primary: Yahoo Finance Search News API
    try {
      const ticker = cleanSymbol.includes(".") ? cleanSymbol : `${cleanSymbol}.IS`;
      const yfRes = await yf.search(ticker, { newsCount: 5 });
      if (yfRes && Array.isArray(yfRes.news)) {
        for (const n of yfRes.news) {
          if (n.title && n.link) {
            const cleanTitle = n.title.trim();
            const normalizedTitle = cleanTitle.toLowerCase().slice(0, 30);
            if (!seenTitles.has(normalizedTitle)) {
              seenTitles.add(normalizedTitle);
              const pubTimeStr = n.providerPublishTime
                ? new Date(n.providerPublishTime).toISOString()
                : new Date().toISOString();
              items.push({
                id: n.uuid || `yf-${cleanSymbol}-${items.length}`,
                title: cleanTitle,
                link: n.link,
                publisher: n.publisher || "Yahoo Finance",
                publishedAt: pubTimeStr,
                timeAgo: formatTimeAgo(pubTimeStr),
              });
            }
          }
        }
      }
    } catch (yfErr) {
      console.warn(`[News API] Yahoo Finance search news fallback for ${cleanSymbol}:`, yfErr);
    }

    // 2. Secondary: Google News RSS for Turkish financial market coverage
    try {
      const query = encodeURIComponent(`${cleanSymbol} ${cleanName} BIST hisse`);
      const googleNewsUrl = `https://news.google.com/rss/search?q=${query}&hl=tr-TR&gl=TR&ceid=TR:tr`;

      const response = await fetch(googleNewsUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 900 },
      });

      if (response.ok) {
        const xmlText = await response.text();
        const itemRegex =
          /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<source[^>]*>(.*?)<\/source>[\s\S]*?<\/item>/gi;
        let match;
        let count = 0;

        while ((match = itemRegex.exec(xmlText)) !== null && count < 6) {
          let rawTitle = match[1] || "";
          const link = match[2] || `https://www.google.com/search?q=${encodeURIComponent(cleanSymbol + " hisse")}`;
          const pubDate = match[3] || new Date().toISOString();
          let publisher = match[4] || "Google Haberler";

          rawTitle = rawTitle
            .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
          publisher = publisher.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();

          if (rawTitle.includes(" - ")) {
            const parts = rawTitle.split(" - ");
            if (parts.length >= 2) {
              publisher = parts.pop() || publisher;
              rawTitle = parts.join(" - ");
            }
          }

          const normalizedTitle = rawTitle.toLowerCase().slice(0, 30);
          if (rawTitle && !seenTitles.has(normalizedTitle)) {
            seenTitles.add(normalizedTitle);
            items.push({
              id: `news-${cleanSymbol}-${count}-${Date.now()}`,
              title: rawTitle,
              link,
              publisher: publisher || "Google Haberler",
              publishedAt: pubDate,
              timeAgo: formatTimeAgo(pubDate),
            });
            count++;
          }
        }
      }
    } catch (rssErr) {
      console.warn(`[News API] Google News RSS fetch warning for ${cleanSymbol}:`, rssErr);
    }

    // Save to in-memory cache
    newsCache.set(cacheKey, { timestamp: now, data: items });

    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      count: items.length,
      source: "google_news_rss",
      data: items,
    });
  } catch (err: unknown) {
    console.warn(`[News API] Error fetching news for ${cleanSymbol}:`, err);
    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      count: 0,
      source: "error_empty",
      data: [],
    });
  }
}
