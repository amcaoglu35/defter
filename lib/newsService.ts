import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  timeout: 8000,
});

export interface NewsItem {
  id?: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  timeAgo?: string;
}

// In-memory cache for news items (TTL: 30 minutes)
interface CachedNews {
  timestamp: number;
  items: NewsItem[];
}

const NEWS_CACHE = new Map<string, CachedNews>();
const NEWS_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Bugün";
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Az önce";
    if (diffHours < 24) return `${diffHours} sa önce`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  } catch {
    return "Bugün";
  }
}

/**
 * Fetches real, live financial news for a Turkish BIST company or fund via Google News RSS.
 * Results are cached in-memory for 30 minutes.
 */
export async function fetchCompanyNews(
  symbol: string,
  companyName: string,
  limit: number = 5
): Promise<NewsItem[]> {
  const cleanSymbol = (symbol || "").toUpperCase().trim();
  const cleanName = (companyName || "").trim();
  const cacheKey = `${cleanSymbol}:${cleanName}:${limit}`;
  const now = Date.now();

  const cached = NEWS_CACHE.get(cacheKey);
  if (cached && now - cached.timestamp < NEWS_CACHE_TTL_MS) {
    return cached.items;
  }

  try {
    const query = encodeURIComponent(`${cleanName} ${cleanSymbol} hisse borsa`);
    const url = `https://news.google.com/rss/search?q=${query}&hl=tr&gl=TR&ceid=TR:tr`;

    const feed = await parser.parseURL(url);
    const items: NewsItem[] = (feed.items || []).slice(0, limit).map((item, idx) => {
      const rawTitle = item.title || "";
      const sourceFromTitle = rawTitle.includes(" - ") ? rawTitle.split(" - ").pop()?.trim() : undefined;
      const cleanTitle = rawTitle.includes(" - ") ? rawTitle.split(" - ").slice(0, -1).join(" - ").trim() : rawTitle;

      return {
        id: item.guid || `${cleanSymbol}-${idx}-${Date.now()}`,
        title: cleanTitle || rawTitle,
        link: item.link || "",
        pubDate: item.pubDate || new Date().toISOString(),
        source: item.creator || sourceFromTitle || "Google News",
        timeAgo: formatTimeAgo(item.pubDate),
      };
    });

    NEWS_CACHE.set(cacheKey, { timestamp: now, items });
    return items;
  } catch (err) {
    console.warn(`[NewsService] Error fetching news for ${cleanSymbol}:`, err);
    return [];
  }
}
