import { NextResponse } from "next/server";
import Parser from "rss-parser";
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

const rssParser = new Parser({
  customFields: {
    item: [["pubDate", "pubDate"]],
  },
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

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

function categorizeDisclosure(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("temettü") || lower.includes("kar payı") || lower.includes("kâr payı"))
    return "Kâr Payı Dağıtım İşlemleri";
  if (lower.includes("bilanço") || lower.includes("finansal rapor") || lower.includes("faaliyet raporu"))
    return "Finansal Rapor (FR)";
  if (lower.includes("genel kurul"))
    return "Genel Kurul Bildirimi";
  if (lower.includes("sermaye") || lower.includes("bedelli") || lower.includes("bedelsiz") || lower.includes("tahsisli"))
    return "Sermaye Artırımı / Azaltımı";
  if (lower.includes("pay alım") || lower.includes("geri alım"))
    return "Pay Geri Alım Bildirimi";
  if (lower.includes("derecelendirme") || lower.includes("kredi notu"))
    return "Kredi Derecelendirmesi";
  if (lower.includes("ihale") || lower.includes("yeni iş"))
    return "Yeni İş İlişkisi / İhale";
  return "Özel Durum Açıklaması (ODA)";
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
    const query = encodeURIComponent(`"${cleanSymbol}" site:kap.org.tr`);
    const kapRssUrl = `https://news.google.com/rss/search?q=${query}&hl=tr-TR&gl=TR&ceid=TR:tr`;

    // Use rss-parser for robust, encoding-safe XML parsing (replaces brittle regex approach)
    const feed = await rssParser.parseURL(kapRssUrl);

    const sortedItems = [...(feed.items || [])].sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA;
    });

    // Şirket unvanını MOCK_COMPANIES veya bilinen kütükten bul
    let companyNamePart = "";
    try {
      const { MOCK_COMPANIES } = await import("@/lib/mockData");
      const co = MOCK_COMPANIES.find((c) => c.symbol.toUpperCase() === cleanSymbol);
      if (co && co.name) {
        // Şirket adının ilk kelimesi veya temel kökü (Örn: "Türk Hava Yolları" -> "Türk Hava", "Mavi Giyim" -> "Mavi")
        companyNamePart = co.name.split(" ")[0].toUpperCase().trim();
      }
    } catch {}

    for (const entry of sortedItems) {
      if (items.length >= 5) break;

      const rawTitle = (entry.title || "").trim();
      const contentSnippet = ((entry as { contentSnippet?: string }).contentSnippet || "").trim();
      const pubDate = entry.pubDate || new Date().toISOString();

      if (!rawTitle) continue;

      const combinedUpper = `${rawTitle} ${contentSnippet}`.toUpperCase();

      // Sembol doğrulaması (cleanSymbol kelime olarak veya parantez içinde geçiyor mu?)
      const hasSymbol =
        combinedUpper.includes(cleanSymbol) ||
        combinedUpper.includes(`[${cleanSymbol}]`) ||
        combinedUpper.includes(`(${cleanSymbol})`);

      // Şirket adı doğrulaması (unvanın ilk kelimesi 3 harften uzunsa)
      const hasCompanyName =
        companyNamePart.length >= 3 && combinedUpper.includes(companyNamePart);

      // Eğer ne sembol ne de şirket adı geçmiyorsa bu alakasız bir Google News sonucudur, atla!
      if (!hasSymbol && !hasCompanyName) {
        continue;
      }

      items.push({
        id: `kap-${cleanSymbol}-${items.length}-${Date.now()}`,
        title: rawTitle,
        disclosureType: categorizeDisclosure(rawTitle),
        publishDate: pubDate,
        timeAgo: formatTimeAgo(pubDate),
        kapUrl: `https://www.kap.org.tr/tr/sirket-bilgileri/ozet/${cleanSymbol}`,
      });
    }

    kapCache.set(cacheKey, { timestamp: now, data: items });

    return NextResponse.json({
      success: true,
      symbol: cleanSymbol,
      count: items.length,
      source: "google_news_kap_rss_parser",
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
