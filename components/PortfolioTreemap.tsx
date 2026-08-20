"use client";

import React, { useState, useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { LayoutGrid, TrendingUp, TrendingDown, Eye, Filter } from "lucide-react";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";
import Link from "next/link";

interface PortfolioTreemapProps {
  holdings: PortfolioAssetHolding[];
  totalValue: number;
}

interface TreemapItem {
  name: string;
  symbol: string;
  size: number;
  change24h: number;
  value: number;
  weightPct: number;
  category: string;
  sector?: string;
  currency: string;
}

// Renk skalası: Getiriye göre yeşil / kırmızı tonları
function getReturnColor(change: number) {
  if (change >= 5) return "#059669"; // Koyu zümrüt
  if (change >= 2) return "#10b981"; // Canlı yeşil
  if (change > 0) return "#34d399"; // Açık yeşil
  if (change === 0) return "#64748b"; // Nötr gri
  if (change > -2) return "#f87171"; // Açık kırmızı
  if (change > -5) return "#ef4444"; // Canlı kırmızı
  return "#b91c1c"; // Koyu kırmızı
}

const CustomizedContent = (props: any) => {
  const { x, y, width, height, symbol, change24h, weightPct, value } = props;

  if (width < 32 || height < 28) return null;

  const bg = getReturnColor(change24h || 0);
  const isPositive = (change24h || 0) >= 0;

  return (
    <g>
      <rect
        x={x + 2}
        y={y + 2}
        width={Math.max(0, width - 4)}
        height={Math.max(0, height - 4)}
        rx={6}
        ry={6}
        style={{
          fill: bg,
          stroke: "rgba(0,0,0,0.3)",
          strokeWidth: 1.5,
          cursor: "pointer",
        }}
      />
      {width > 60 && height > 45 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={width > 100 ? 14 : 11}
            fontWeight="bold"
            fontFamily="monospace"
          >
            {symbol}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={width > 100 ? 11 : 9}
            fontWeight="600"
          >
            {isPositive ? "+" : ""}
            {(change24h || 0).toFixed(2)}%
          </text>
          {height > 70 && width > 90 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 24}
              textAnchor="middle"
              fill="rgba(255,255,255,0.75)"
              fontSize={9}
            >
              %{weightPct?.toFixed(1)}
            </text>
          )}
        </>
      )}
    </g>
  );
};

export default function PortfolioTreemap({ holdings, totalValue }: PortfolioTreemapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredAsset, setHoveredAsset] = useState<TreemapItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set(holdings.map((h) => h.category));
    return ["all", ...Array.from(set)];
  }, [holdings]);

  const filteredData = useMemo(() => {
    let list = holdings;
    if (selectedCategory !== "all") {
      list = list.filter((h) => h.category === selectedCategory);
    }

    return list.map((h) => ({
      name: h.name,
      symbol: h.symbol,
      size: Math.max(1, h.totalCurrentValue),
      value: h.totalCurrentValue,
      change24h: h.change24h || 0,
      weightPct: h.weightPct,
      category: h.category,
      sector: h.sector,
      currency: h.currency,
    }));
  }, [holdings, selectedCategory]);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="p-8 text-center bg-[var(--card)] border border-[var(--line)] rounded-xl">
        <LayoutGrid className="w-10 h-10 text-[var(--muted)] mx-auto mb-3 opacity-40" />
        <p className="text-sm text-[var(--muted)]">Portföyünüzde henüz görselleştirilecek varlık bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 shadow-xs space-y-4">
      {/* Header & Filtreler */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)]">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">Portföy Isı Haritası (Treemap)</h3>
            <p className="text-xs text-[var(--muted)]">Kutu boyutu varlık ağırlığını, renk ise 24s performansını gösterir.</p>
          </div>
        </div>

        {/* Kategori Filtresi */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                  : "bg-[var(--line)]/50 text-[var(--muted)] hover:text-[var(--paper)]"
              }`}
            >
              {cat === "all" ? "Tümü" : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Renk Skalası Göstergesi */}
      <div className="flex items-center justify-between text-[11px] text-[var(--muted)] px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[#b91c1c] inline-block" />
          <span>-5% altı</span>
          <span className="w-3 h-3 rounded-xs bg-[#ef4444] inline-block" />
          <span>-2%</span>
          <span className="w-3 h-3 rounded-xs bg-[#64748b] inline-block" />
          <span>0%</span>
          <span className="w-3 h-3 rounded-xs bg-[#10b981] inline-block" />
          <span>+2%</span>
          <span className="w-3 h-3 rounded-xs bg-[#059669] inline-block" />
          <span>+5% üstü</span>
        </div>
        <span className="font-mono text-xs text-[var(--paper)]">
          Toplam: {totalValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
        </span>
      </div>

      {/* Treemap Görselleştirme */}
      <div className="w-full h-80 sm:h-96 rounded-lg overflow-hidden bg-[var(--ink)]/40 p-1 border border-[var(--line)]/60">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={filteredData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#000"
            content={<CustomizedContent />}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
}
