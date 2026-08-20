"use client";

import React, { useMemo } from "react";
import { LayoutGrid, PieChart, Layers } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";

interface BasketTreemapProps {
  basket: Basket;
  companies: Company[];
}

export function BasketTreemap({ basket, companies }: BasketTreemapProps) {
  const sectorGroups = useMemo(() => {
    const totalVal = basket.totalValue || 1;
    const map = new Map<string, { sector: string; value: number; holdings: Array<{ symbol: string; value: number; weightPct: number }> }>();

    basket.holdings.forEach((h) => {
      const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
      const sector = co?.sector || "Diğer Varlıklar";
      const val = h.quantity * (co?.price || h.currentPrice || h.avgCost || 0);

      if (!map.has(sector)) {
        map.set(sector, { sector, value: 0, holdings: [] });
      }
      const g = map.get(sector)!;
      g.value += val;
      g.holdings.push({
        symbol: h.companySymbol,
        value: Math.round(val),
        weightPct: Number(((val / totalVal) * 100).toFixed(1)),
      });
    });

    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [basket, companies]);

  if (sectorGroups.length === 0) return null;

  const totalValue = basket.totalValue || 1;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Sektörel &amp; Varlık Dağılım Treemap Haritası
            </h3>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Portföy ağırlıklarının sektör bazlı görsel oranları
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[var(--brass)] bg-[var(--ink-3)] px-2.5 py-1 rounded border border-[var(--line)]">
          {sectorGroups.length} Sektör
        </span>
      </div>

      {/* Proportional Grid Map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectorGroups.map((g, idx) => {
          const sectorWeight = Number(((g.value / totalValue) * 100).toFixed(1));
          return (
            <div
              key={g.sector}
              className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-2 hover:border-[var(--brass-dim)] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-[var(--paper)] truncate max-w-[160px]">
                  {g.sector}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--brass)]">
                  %{sectorWeight}
                </span>
              </div>

              {/* Progress visual */}
              <div className="w-full h-1.5 bg-[var(--ink)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--brass)] to-[var(--verdigris)] rounded-full"
                  style={{ width: `${Math.min(100, Math.max(5, sectorWeight))}%` }}
                />
              </div>

              {/* Holdings inside sector */}
              <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                {g.holdings.map((h) => (
                  <span
                    key={h.symbol}
                    className="px-1.5 py-0.5 rounded bg-[var(--ink-2)] text-[var(--mist)] border border-[var(--line)]"
                  >
                    {h.symbol} (%{h.weightPct})
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
