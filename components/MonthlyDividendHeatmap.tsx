"use client";

import React, { useMemo } from "react";
import { Calendar, Coins, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { DividendItem } from "@/lib/mockData";

interface MonthlyDividendHeatmapProps {
  dividends: DividendItem[];
}

const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export function MonthlyDividendHeatmap({ dividends }: MonthlyDividendHeatmapProps) {
  const monthlyFlows = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, idx) => ({
      monthIdx: idx,
      name: MONTH_NAMES[idx],
      shortName: MONTH_NAMES[idx].slice(0, 3),
      totalPayout: 0,
      count: 0,
      symbols: [] as string[],
    }));

    dividends.forEach((d) => {
      if (!d.paymentDate || d.paymentDate === "Açıklanmadı") return;
      const dateObj = new Date(d.paymentDate);
      if (isNaN(dateObj.getTime())) return;

      const mIdx = dateObj.getMonth();
      const payout = d.totalEstimatedPayout || 0;

      if (months[mIdx]) {
        months[mIdx].totalPayout += payout;
        months[mIdx].count += 1;
        if (!months[mIdx].symbols.includes(d.companySymbol)) {
          months[mIdx].symbols.push(d.companySymbol);
        }
      }
    });

    const maxMonthlyPayout = Math.max(...months.map((m) => m.totalPayout), 1);
    const totalAnnualDividend = months.reduce((acc, m) => acc + m.totalPayout, 0);
    const activeMonthsCount = months.filter((m) => m.totalPayout > 0).length;

    return {
      months,
      maxMonthlyPayout,
      totalAnnualDividend: parseFloat(totalAnnualDividend.toFixed(2)),
      activeMonthsCount,
      currentYear,
    };
  }, [dividends]);

  const { months, maxMonthlyPayout, totalAnnualDividend, activeMonthsCount, currentYear } = monthlyFlows;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] flex items-center justify-center text-[var(--verdigris)] shadow-inner">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🗓️ Aylık Temettü Nakit Akışı Isı Haritası ({currentYear})
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Ghostfolio Tarzı 12 Aylık Pasif Gelir Dağılım Matrisi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[var(--mist)] uppercase block">Yıllık Toplam Temettü</span>
            <span className="font-serif text-base font-bold text-[var(--brass)]">
              {totalAnnualDividend.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </span>
          </div>
        </div>
      </div>

      {/* 12 Month Heatmap Matrix Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {months.map((m) => {
          const hasPayout = m.totalPayout > 0;
          const intensityRatio = hasPayout ? Math.max(0.2, m.totalPayout / maxMonthlyPayout) : 0;

          return (
            <div
              key={m.monthIdx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                hasPayout
                  ? "bg-[var(--ink-3)] border-[var(--verdigris)] shadow-md"
                  : "bg-[var(--ink-3)] border-[var(--line)] opacity-60"
              }`}
            >
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[var(--paper)] uppercase">{m.name}</span>
                {hasPayout && (
                  <span className="w-2 h-2 rounded-full bg-[var(--verdigris)] animate-pulse" />
                )}
              </div>

              <div className="my-1 text-center">
                <span
                  className={`font-serif text-base font-bold block ${
                    hasPayout ? "text-[var(--verdigris)]" : "text-[var(--mist)]"
                  }`}
                >
                  {hasPayout ? `${m.totalPayout.toLocaleString("tr-TR")} ₺` : "—"}
                </span>
                {hasPayout && (
                  <span className="text-[9px] text-[var(--mist)] block truncate mt-0.5">
                    {m.symbols.join(", ")}
                  </span>
                )}
              </div>

              {/* Intensity progress line */}
              <div className="w-full h-1 bg-[var(--ink-2)] rounded-full overflow-hidden border border-[var(--line)]">
                <div
                  className="h-full bg-[var(--verdigris)] rounded-full transition-all duration-500"
                  style={{ width: `${intensityRatio * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--mist)] pt-2 border-t border-[var(--line)]">
        <span>Yılın 12 ayının <strong>{activeMonthsCount}</strong> ayında nakit temettü girişi beklenmektedir.</span>
      </div>
    </div>
  );
}
