"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import MarketStatusBadge from "@/components/MarketStatusBadge";

export default function Ticker() {
  const { companies, indices } = useDefterStore();

  const fallbackIndices = {
    "BIST 100": { price: 9840.5, dailyChange: 1.42, formattedPrice: "9.840,50", isPositive: true },
    "BIST 30": { price: 10720.1, dailyChange: 1.65, formattedPrice: "10.720,10", isPositive: true },
    "BIST Banka": { price: 13850.0, dailyChange: 2.10, formattedPrice: "13.850,00", isPositive: true },
    "BIST Sınai": { price: 14200.4, dailyChange: 0.95, formattedPrice: "14.200,40", isPositive: true },
    "BIST Teknoloji": { price: 12450.8, dailyChange: 3.20, formattedPrice: "12.450,80", isPositive: true },
    "USD/TRY": { price: 47.88, dailyChange: 0.11, formattedPrice: "47,88 ₺", isPositive: true },
    "EUR/TRY": { price: 55.38, dailyChange: 0.37, formattedPrice: "55,38 ₺", isPositive: true },
    "Gram Altın": { price: 4078.0, dailyChange: 0.85, formattedPrice: "4.078,00 ₺", isPositive: true },
    "Gümüş/Gr": { price: 48.50, dailyChange: 1.40, formattedPrice: "48,50 ₺", isPositive: true },
    "Brent Petrol": { price: 74.20, dailyChange: -0.40, formattedPrice: "74,20 $", isPositive: false },
    "S&P 500": { price: 5648.4, dailyChange: 0.45, formattedPrice: "5.648,40", isPositive: true },
    "NASDAQ": { price: 17683.9, dailyChange: 0.84, formattedPrice: "17.683,90", isPositive: true },
    "ABD 10Y": { price: 3.92, dailyChange: -0.05, formattedPrice: "%3,92", isPositive: false },
    "VIX Korku": { price: 15.40, dailyChange: -2.10, formattedPrice: "15,40", isPositive: false },
    "DXY Dolar": { price: 104.20, dailyChange: 0.15, formattedPrice: "104,20", isPositive: true },
  };

  const effectiveIndices = indices && Object.keys(indices).length > 0 ? indices : fallbackIndices;

  const indexItems = Object.entries(effectiveIndices).map(([name, data]) => ({
    symbol: name,
    price: data.formattedPrice,
    change: `${data.dailyChange >= 0 ? "+" : ""}${data.dailyChange}%`,
    isPositive: data.dailyChange >= 0,
    isMacro: true,
  }));

  // Prioritize watchlist companies first, then fill with other companies up to 25 items total
  const watchlistCompanies = (companies || []).filter((c) => c.inWatchlist);
  const otherCompanies = (companies || []).filter((c) => !c.inWatchlist);
  const selectedCompanies = [...watchlistCompanies, ...otherCompanies].slice(0, 25);

  const companyItems = selectedCompanies.map((c) => ({
    symbol: c.symbol,
    price: `${c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${c.currency}`,
    change: `${c.dailyChange >= 0 ? "+" : ""}${c.dailyChange}%`,
    isPositive: c.dailyChange >= 0,
    isMacro: false,
  }));

  const tickerItems = [...indexItems, ...companyItems];

  return (
    <div className="bg-[var(--ink-3)] border-b border-[var(--line)] py-1.5 overflow-hidden select-none text-[11px] font-mono w-full flex items-center">
      {/* Pinned Market Status Indicator */}
      <div className="pl-3 pr-2 shrink-0 z-10 bg-[var(--ink-3)] border-r border-[var(--line)] flex items-center">
        <MarketStatusBadge compact />
      </div>

      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap pl-4">
        {/* Double the list for infinite seamless marquee */}
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const content = (
            <div
              className={`inline-flex items-center gap-2 text-[var(--paper-dim)] hover:text-[var(--paper)] transition-colors shrink-0 ${
                !item.isMacro ? "cursor-pointer group hover:text-[var(--brass)]" : ""
              }`}
            >
              <span
                className={`font-bold ${
                  item.isMacro
                    ? "text-[var(--brass)]"
                    : "text-[var(--paper)] group-hover:text-[var(--brass)]"
                }`}
              >
                {item.symbol}
              </span>
              <span className="text-[var(--paper)]">{item.price}</span>
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
              <span className="text-[var(--mist)] opacity-40 ml-2">•</span>
            </div>
          );

          if (!item.isMacro) {
            return (
              <Link
                key={`${item.symbol}-${idx}`}
                href={`/sirketler/${encodeURIComponent(item.symbol)}`}
                className="shrink-0"
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={`${item.symbol}-${idx}`} className="shrink-0">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
