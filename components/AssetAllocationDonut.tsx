"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon, Layers } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";
import { inferAssetClass } from "@/lib/store";

interface AssetAllocationDonutProps {
  baskets: Basket[];
  companies: Company[];
  totalPortfolioValue: number;
  currencySymbol?: string;
  exchangeRate?: number;
}

const ASSET_CLASS_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  hisse: { label: "Hisse Senedi (BIST & Global)", icon: "📈", color: "#10b981" },
  maden: { label: "Kıymetli Maden (Altın & Gümüş)", icon: "🥇", color: "#c9a24b" },
  fon: { label: "Yatırım Fonu (TEFAS & ETF)", icon: "🏦", color: "#3b82f6" },
  doviz: { label: "Döviz & Nakit Varlık", icon: "💵", color: "#a855f7" },
};

export default function AssetAllocationDonut({
  baskets,
  companies,
  totalPortfolioValue,
  currencySymbol = "₺",
  exchangeRate = 1,
}: AssetAllocationDonutProps) {
  const allocationData = useMemo(() => {
    if (!baskets || baskets.length === 0 || totalPortfolioValue <= 0) {
      return [];
    }

    const classTotals: Record<string, number> = {
      hisse: 0,
      maden: 0,
      fon: 0,
      doviz: 0,
    };

    baskets.forEach((b) => {
      b.holdings.forEach((h) => {
        const co = companies.find(
          (c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase()
        );
        const assetClass = co ? inferAssetClass(co) : "hisse";
        const currentPrice = co ? co.price : (h.currentPrice || h.avgCost);
        const itemVal = (h.quantity || 1) * currentPrice;
        classTotals[assetClass] = (classTotals[assetClass] || 0) + itemVal;
      });
    });

    const totalVal = Object.values(classTotals).reduce((sum, v) => sum + v, 0);
    if (totalVal <= 0) return [];

    return Object.entries(classTotals)
      .filter(([_, val]) => val > 0)
      .map(([key, val]) => {
        const meta = ASSET_CLASS_LABELS[key] || {
          label: key,
          icon: "📦",
          color: "#64748b",
        };
        const convertedVal = val / exchangeRate;
        const pct = (val / totalVal) * 100;

        return {
          name: meta.label,
          rawKey: key,
          value: Math.round(convertedVal),
          weightPct: Number(pct.toFixed(1)),
          color: meta.color,
          icon: meta.icon,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [baskets, companies, totalPortfolioValue, exchangeRate]);

  if (totalPortfolioValue <= 0 || allocationData.length === 0) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 text-center space-y-3 font-mono h-full flex flex-col items-center justify-center">
        <PieIcon className="w-8 h-8 text-[var(--brass)] opacity-60" />
        <h4 className="font-serif text-base font-bold text-[var(--paper)]">
          Varlık Sınıfı Dağılım Pastası
        </h4>
        <p className="text-xs text-[var(--mist)] max-w-xs font-sans">
          Sepetinize varlık eklediğinizde oransal dağılım pastası burada otomatik görüntülenir.
        </p>
      </div>
    );
  }

  const convertedTotal = Math.round(totalPortfolioValue / exchangeRate);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🍩 Varlık Sınıfı Dağılımı
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Varlık Türü Ağırlık Denge Analizi
            </p>
          </div>
        </div>
      </div>

      {/* Donut Chart & Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center">
        {/* Donut Chart with Center Label */}
        <div className="w-full h-48 sm:h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {allocationData.map((entry) => (
                  <Cell key={entry.rawKey} fill={entry.color} stroke="var(--ink-2)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ink-3)",
                  borderColor: "var(--line)",
                  borderRadius: "0.5rem",
                  color: "var(--paper)",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
                formatter={(value: unknown) => [
                  `${Number(value).toLocaleString("tr-TR")} ${currencySymbol}`,
                  "Tutar",
                ] as [string, string]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-mono text-[10px] text-[var(--mist)] uppercase">Toplam</span>
            <span className="font-serif text-sm font-bold text-[var(--paper)]">
              {convertedTotal.toLocaleString("tr-TR")} {currencySymbol}
            </span>
          </div>
        </div>

        {/* Legend Cards */}
        <div className="space-y-2 font-mono text-xs">
          {allocationData.map((item) => (
            <div
              key={item.rawKey}
              className="p-2.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between hover:border-[var(--brass-dim)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-semibold text-[var(--paper)]">
                  {item.icon} {item.name}
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold text-[var(--paper)] block text-[11px]">
                  %{item.weightPct}
                </span>
                <span className="text-[10px] text-[var(--mist)] block">
                  {item.value.toLocaleString("tr-TR")} {currencySymbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
