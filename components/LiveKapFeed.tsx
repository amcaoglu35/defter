"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Newspaper, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

export interface KapDisclosureItem {
  id: string;
  title: string;
  disclosureType: string;
  publishDate: string;
  timeAgo: string;
  kapUrl: string;
  symbol?: string;
}

interface LiveKapFeedProps {
  symbols?: string[];
  maxItems?: number;
  compact?: boolean;
}

export default function LiveKapFeed({
  symbols = ["THYAO", "EREGL", "TUPRS", "ASELS", "KCHOL"],
  maxItems = 5,
  compact = false,
}: LiveKapFeedProps) {
  const [items, setItems] = useState<KapDisclosureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisclosures = async () => {
    setLoading(true);
    setError(null);
    try {
      const targets = symbols.slice(0, 3);
      const fetchedItems: KapDisclosureItem[] = [];

      for (const sym of targets) {
        try {
          const res = await fetch(`/api/prices/kap?symbol=${encodeURIComponent(sym)}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.data)) {
              for (const item of data.data) {
                fetchedItems.push({
                  ...item,
                  symbol: sym,
                });
              }
            }
          }
        } catch {}
      }

      if (fetchedItems.length > 0) {
        setItems(fetchedItems.slice(0, maxItems));
      } else {
        setItems([]);
      }
    } catch {
      setError("KAP bildirimleri şu anda alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisclosures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(",")]);

  const getBadgeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("temettü") || t.includes("kâr payı")) {
      return "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]";
    }
    if (t.includes("bilanço") || t.includes("finansal")) {
      return "bg-[rgba(201,162,75,0.15)] text-[var(--brass)] border-[var(--brass-dim)]";
    }
    if (t.includes("sermaye") || t.includes("bedelsiz")) {
      return "bg-[rgba(147,112,219,0.15)] text-[#a78bfa] border-[#a78bfa]";
    }
    return "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]";
  };

  return (
    <div className={`bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-4 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Newspaper className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              ⚡ Şirket Haber &amp; Bildirim Akışı
            </h3>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Google News — KAP Odaklı Şirket Bildirimleri &amp; Gelişmeleri
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchDisclosures}
          disabled={loading}
          className="text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] p-1.5 rounded bg-[var(--ink-3)] border border-[var(--line)] flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
          title="KAP Akışını Yenile"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Yenile</span>
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="space-y-3 animate-pulse py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-[var(--ink-3)] rounded-lg space-y-2 border border-[var(--line)]">
              <div className="h-3.5 bg-[var(--line)] rounded w-3/4" />
              <div className="h-2.5 bg-[var(--line)] rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-6 text-xs font-mono text-[var(--mist)] space-y-1">
          <AlertCircle className="w-5 h-5 mx-auto text-[var(--mist)] opacity-60 mb-1" />
          <p>Seçili varlıklar için son 24 saatte yeni bir KAP bildirimi kaydedilmedi.</p>
        </div>
      ) : (
        <div className="divide-y divide-dashed divide-[var(--line)]">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[rgba(201,162,75,0.03)] px-2 rounded transition-colors group"
            >
              <div className="space-y-1 flex-1 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  {item.symbol && (
                    <Link
                      href={`/sirketler/${encodeURIComponent(item.symbol)}`}
                      className="px-1.5 py-0.5 rounded bg-[var(--ink-3)] border border-[var(--line)] font-mono text-[10px] font-bold text-[var(--brass)] hover:border-[var(--brass)] transition-colors"
                    >
                      {item.symbol}
                    </Link>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getBadgeColor(item.disclosureType)}`}>
                    {item.disclosureType}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--mist)]">
                    {item.timeAgo}
                  </span>
                </div>

                <h4 className="text-xs font-medium text-[var(--paper)] leading-snug group-hover:text-[var(--brass)] transition-colors">
                  {item.title}
                </h4>
              </div>

              <a
                href={item.kapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--brass)] hover:underline shrink-0 self-start sm:self-center"
              >
                <span>KAP Şirket Sayfası</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
