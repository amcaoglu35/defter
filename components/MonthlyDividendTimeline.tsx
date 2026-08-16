"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Calendar, Coins, ArrowUpRight, TrendingUp, Info } from "lucide-react";
import { useDefterStore } from "@/lib/store";

const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function MonthlyDividendTimeline() {
  const { dividends, companies, baskets } = useDefterStore();

  // Aggregate payouts by month (0-11)
  const monthlyData = useMemo(() => {
    const months = MONTH_NAMES.map((name, index) => ({
      index,
      name,
      shortName: name.slice(0, 3),
      totalPayout: 0,
      symbols: [] as Array<{ symbol: string; payout: number; perShare: number }>,
    }));

    for (const div of dividends) {
      if (!div.paymentDate) continue;
      const dateParts = div.paymentDate.split("-");
      if (dateParts.length >= 2) {
        const monthIdx = parseInt(dateParts[1], 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          const payout = div.totalEstimatedPayout || 0;
          months[monthIdx].totalPayout += payout;
          months[monthIdx].symbols.push({
            symbol: div.companySymbol,
            payout,
            perShare: div.netAmountPerShare,
          });
        }
      }
    }

    return months;
  }, [dividends]);

  const totalAnnualPayout = useMemo(() => {
    return monthlyData.reduce((sum, m) => sum + m.totalPayout, 0);
  }, [monthlyData]);

  const maxMonthlyPayout = useMemo(() => {
    const max = Math.max(...monthlyData.map((m) => m.totalPayout), 1);
    return max;
  }, [monthlyData]);

  const activeMonthsCount = monthlyData.filter((m) => m.totalPayout > 0).length;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--paper)]">
              📅 12 Aylık Temettü Nakit Akışı Takvimi
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Yıllık Beklenen Net Dağıtım: <strong className="text-[var(--brass)]">{totalAnnualPayout.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</strong> ({activeMonthsCount} Ay Nakit Girişi)
            </p>
          </div>
        </div>

        <Link
          href="/sirketler"
          className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1 self-start sm:self-center"
        >
          <span>Temettü Hisselerini İncele</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 12-Month Bar Chart */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2">
        {monthlyData.map((m) => {
          const heightPct = m.totalPayout > 0 ? Math.max(15, Math.round((m.totalPayout / maxMonthlyPayout) * 100)) : 6;
          const hasPayout = m.totalPayout > 0;

          return (
            <div key={m.index} className="flex flex-col items-center gap-2 group relative">
              {/* Tooltip on hover */}
              {hasPayout && (
                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-[var(--ink-3)] border border-[var(--brass-dim)] px-2.5 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in">
                  <span className="font-mono text-[10px] text-[var(--brass)] font-bold">
                    {m.totalPayout.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                  </span>
                  <span className="font-mono text-[9px] text-[var(--mist)]">
                    {m.symbols.map((s) => s.symbol).join(", ")}
                  </span>
                </div>
              )}

              {/* Bar Container */}
              <div className="w-full h-28 bg-[var(--ink-3)] rounded-md flex flex-col justify-end p-1 border border-[var(--line)] group-hover:border-[var(--brass-dim)] transition-colors">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded transition-all duration-500 ${
                    hasPayout
                      ? "bg-gradient-to-t from-[var(--brass-dim)] to-[var(--brass)] shadow-[0_0_8px_rgba(201,162,75,0.3)]"
                      : "bg-[var(--line)] opacity-30"
                  }`}
                />
              </div>

              {/* Month Label */}
              <div className="text-center font-mono">
                <span className={`text-[11px] block font-semibold ${hasPayout ? "text-[var(--paper)]" : "text-[var(--mist)] opacity-60"}`}>
                  {m.shortName}
                </span>
                {hasPayout ? (
                  <span className="text-[9px] text-[var(--brass)] font-bold block truncate max-w-[45px]">
                    {Math.round(m.totalPayout).toLocaleString("tr-TR")}₺
                  </span>
                ) : (
                  <span className="text-[9px] text-[var(--mist)] opacity-40 block">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlights footer note */}
      <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex items-start gap-2.5 text-xs font-mono text-[var(--mist)]">
        <Info className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          Temettü nakit akışı takvimi, kütüğünüzdeki onaylanmış ve KAP'ta ilan edilmiş brüt/net nakit kâr payı dağıtım tarihlerine göre otomatik hesaplanır.
        </span>
      </div>
    </div>
  );
}
