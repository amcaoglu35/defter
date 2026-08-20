"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Radio, ExternalLink, RefreshCw, Filter, Layers, Bell, FileText, ArrowRight } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { KapDisclosureItem } from "@/app/api/prices/kap/route";

export function PersonalizedKapFeed() {
  const { baskets, companies } = useDefterStore();
  const [disclosures, setDisclosures] = useState<Record<string, KapDisclosureItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  // Extract unique symbols from all user baskets
  const userSymbols = useMemo(() => {
    const symbols = new Set<string>();
    baskets.forEach((b) => {
      b.holdings.forEach((h) => {
        if (h.companySymbol && !h.companySymbol.includes("/") && !h.companySymbol.includes("TEFAS:")) {
          symbols.add(h.companySymbol.toUpperCase());
        }
      });
    });
    return Array.from(symbols).slice(0, 8); // Top 8 holdings
  }, [baskets]);

  const fetchHoldingDisclosures = async () => {
    if (userSymbols.length === 0) return;
    setLoading(true);
    const results: Record<string, KapDisclosureItem[]> = {};

    try {
      await Promise.all(
        userSymbols.map(async (sym) => {
          try {
            const res = await fetch(`/api/prices/kap?symbol=${encodeURIComponent(sym)}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
              results[sym] = data.data;
            }
          } catch (e) {
            console.error(`KAP fetch error for ${sym}:`, e);
          }
        })
      );
      setDisclosures(results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldingDisclosures();
  }, [userSymbols]);

  // Aggregate and sort all disclosures
  const allItems = useMemo(() => {
    const list: Array<KapDisclosureItem & { companySymbol: string }> = [];
    Object.entries(disclosures).forEach(([sym, items]) => {
      items.forEach((item) => {
        list.push({ ...item, companySymbol: sym });
      });
    });

    // En yeni bildirim en üstte olacak şekilde tarihe göre sırala
    list.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

    if (selectedFilter !== "ALL") {
      return list.filter((item) => item.companySymbol === selectedFilter);
    }

    return list.slice(0, 10);
  }, [disclosures, selectedFilter]);

  if (userSymbols.length === 0) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 text-center space-y-3">
        <Radio className="w-8 h-8 text-[var(--brass)] mx-auto opacity-60" />
        <h4 className="font-serif font-bold text-base text-[var(--paper)]">
          Portföye Özel Canlı KAP Bildirimleri
        </h4>
        <p className="text-xs font-mono text-[var(--mist)] max-w-md mx-auto">
          Sepetlerinize eklediğiniz şirketlerin resmi KAP bildirimleri (Kâr payı, bilanço, genel kurul vb.) bu akışta anlık olarak listelenir.
        </p>
        <Link
          href="/sepetlerim"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-bold font-mono rounded shadow transition-all"
        >
          <span>Sepetlerime Git</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                Portföye Özel Canlı KAP Akışı
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)]/30 font-bold">
                {userSymbols.length} Şirket Takipte
              </span>
            </div>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Yalnızca portföyünüzde bulunan şirketlerin Kamuyu Aydınlatma Platformu bildirimleri
            </p>
          </div>
        </div>

        {/* Filter Badges & Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[var(--ink-3)] p-1 rounded-lg border border-[var(--line)] font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter("ALL")}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                selectedFilter === "ALL"
                  ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                  : "text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
            >
              Tümü
            </button>
            {userSymbols.slice(0, 5).map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => setSelectedFilter(sym)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  selectedFilter === sym
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                    : "text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchHoldingDisclosures}
            disabled={loading}
            className="p-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-3)] hover:border-[var(--brass)] text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
            title="KAP Bildirimlerini Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--brass)]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Disclosures Feed List */}
      {allItems.length === 0 ? (
        <div className="text-center py-8 text-xs font-mono text-[var(--mist)] space-y-1">
          <FileText className="w-5 h-5 mx-auto opacity-50 mb-1" />
          <p>Takip edilen şirketler için son 24 saatte yeni bildirim bulunamadı.</p>
        </div>
      ) : (
        <div className="divide-y divide-dashed divide-[var(--line)]">
          {allItems.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[rgba(201,162,75,0.03)] transition-colors rounded-lg px-2 -mx-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--brass-dim)]">
                    {item.companySymbol}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(201,162,75,0.1)] text-[var(--paper)] border border-[var(--line)]">
                    {item.disclosureType}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--mist)]">{item.timeAgo}</span>
                </div>
                <h4 className="text-xs font-serif text-[var(--paper)] leading-snug">
                  {item.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <a
                  href={item.kapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--brass)] hover:underline border border-[var(--brass-dim)] px-2.5 py-1 rounded bg-[rgba(201,162,75,0.08)]"
                >
                  <span>KAP&apos;ta Aç</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
