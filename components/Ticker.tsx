"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDefterStore } from "@/lib/store";

export default function Ticker() {
  const { companies, indices } = useDefterStore();

  const indexItems = indices
    ? Object.entries(indices).map(([name, data]) => ({
        symbol: name,
        price: data.formattedPrice,
        change: `${data.dailyChange >= 0 ? "+" : ""}${data.dailyChange}%`,
        isPositive: data.dailyChange >= 0,
      }))
    : [
        { symbol: "BIST 100", price: "9.840,50", change: "+1.42%", isPositive: true },
        { symbol: "BIST 30", price: "10.720,10", change: "+1.65%", isPositive: true },
      ];

  // Prioritize watchlist companies first, then fill with other companies up to 25 items total
  const watchlistCompanies = (companies || []).filter((c) => c.inWatchlist);
  const otherCompanies = (companies || []).filter((c) => !c.inWatchlist);
  const selectedCompanies = [...watchlistCompanies, ...otherCompanies].slice(0, 25);

  const companyItems = selectedCompanies.map((c) => ({
    symbol: c.symbol,
    price: `${c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${c.currency}`,
    change: `${c.dailyChange >= 0 ? "+" : ""}${c.dailyChange}%`,
    isPositive: c.dailyChange >= 0,
  }));

  const tickerItems = [...indexItems, ...companyItems];

  return (
    <div className="bg-[var(--ink-3)] border-b border-[var(--line)] py-1.5 overflow-hidden select-none text-[11px] font-mono">
      <div className="ticker-track flex items-center gap-8 whitespace-nowrap">
        {/* Double the list for infinite seamless marquee */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={`${item.symbol}-${idx}`}
            className="inline-flex items-center gap-2 text-[var(--paper-dim)] hover:text-[var(--paper)] transition-colors"
          >
            <span className="font-bold text-[var(--paper)]">{item.symbol}</span>
            <span>{item.price}</span>
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                item.isPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
              }`}
            >
              {item.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {item.change}
            </span>
            <span className="text-[var(--mist)] opacity-30">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
