"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  PieChart as PieIcon,
  ShieldCheck,
  Globe,
  Layers,
  Building2,
  Coins,
  AlertTriangle,
} from "lucide-react";
import { PortfolioXRayData, CATEGORY_COLORS } from "@/lib/portfolioIntelligence";

interface PortfolioXRayViewProps {
  xray: PortfolioXRayData;
}

const SECTOR_COLORS = [
  "#3b82f6", // Mavi
  "#10b981", // Zümrüt
  "#f59e0b", // Kehribar
  "#8b5cf6", // Mor
  "#ec4899", // Pembe
  "#06b6d4", // Camgöbeği
  "#f97316", // Turuncu
  "#14b8a6", // Teal
  "#6366f1", // İndigo
  "#84cc16", // Lime
  "#e11d48", // Gül
  "#d97706", // Sıcak Sarı
  "#0284c7", // Gök Mavisi
  "#7c3aed", // Menekşe
  "#db2777", // Fuşya
  "#059669", // Koyu Zümrüt
  "#475569", // Arduvaz
  "#ca8a04", // Altın
  "#4f46e5", // Derin Mavi
  "#0d9488", // Derin Teal
  "#9333ea", // Parlak Mor
  "#c026d3", // Orkide
  "#2563eb", // Kraliyet Mavisi
  "#16a34a", // Çimen Yeşili
];

export default function PortfolioXRayView({ xray }: PortfolioXRayViewProps) {
  return (
    <div className="space-y-5">
      {/* Üst Özet & Çeşitlendirme Skoru */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Çeşitlendirme Skoru */}
        <div className="p-4 bg-[var(--card)] border border-[var(--line)] rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Çeşitlendirme Düzeyi</span>
            </div>
            <p className="font-serif font-bold text-xl text-[var(--paper)]">
              {xray.diversificationLevel}
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              HHI Yoğunlaşma Endeksi:{" "}
              <span className="font-mono font-bold text-[var(--paper)]">
                {xray.hhiScore}
              </span>
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold ${
              xray.diversificationLevel === "Mükemmel"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : xray.diversificationLevel === "Orta"
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-rose-500 bg-rose-500/10 text-rose-400"
            }`}
          >
            {xray.diversificationLevel === "Mükemmel"
              ? "A+"
              : xray.diversificationLevel === "Orta"
              ? "B"
              : "C"}
          </div>
        </div>

        {/* Toplam Varlık Sayısı */}
        <div className="p-4 bg-[var(--card)] border border-[var(--line)] rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Farklı Varlık Adedi</span>
          </div>
          <p className="font-serif font-bold text-xl text-[var(--paper)]">
            {xray.assetCount} Enstrüman
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            Hisse, Fon, Kıymetli Maden ve Döviz
          </p>
        </div>

        {/* En Büyük Pozisyon Riski */}
        <div className="p-4 bg-[var(--card)] border border-[var(--line)] rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>En Büyük Varlık Ağırlığı</span>
          </div>
          <p className="font-serif font-bold text-xl text-[var(--paper)]">
            {xray.holdings[0]
              ? `${xray.holdings[0].symbol} (%${xray.holdings[0].weightPct.toFixed(1)})`
              : "—"}
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            {xray.holdings[0] && xray.holdings[0].weightPct > 25
              ? "⚠️ Tek varlıkta yüksek yoğunlaşma riski"
              : "✅ Sağlıklı dağılım oranı"}
          </p>
        </div>
      </div>

      {/* Dağılım Grafikleri Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Kategori & Varlık Sınıfı Röntgeni */}
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
            <PieIcon className="w-4 h-4 text-[var(--brass)]" />
            <h4 className="font-serif font-bold text-sm text-[var(--paper)]">
              Varlık Sınıfı Dağılımı
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={xray.byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {xray.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [
                      `${Number(val).toLocaleString("tr-TR")} ₺`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-2">
              {xray.byCategory.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[var(--paper)] font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    <span className="font-mono text-[var(--muted)]">
                      %{item.percentage.toFixed(1)} (
                      {item.value.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ₺)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Sektörel Dağılım Röntgeni */}
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h4 className="font-serif font-bold text-sm text-[var(--paper)]">
              Sektörel Dağılım
            </h4>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {xray.bySector.slice(0, 6).map((item, idx) => {
              const color = SECTOR_COLORS[idx % SECTOR_COLORS.length];
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--paper)] font-medium truncate max-w-[200px]">
                      {item.name}
                    </span>
                    <span className="font-mono text-[var(--muted)] shrink-0">
                      %{item.percentage.toFixed(1)} (
                      {item.value.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      ₺)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Varlık Ağırlıkları Tablosu */}
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 shadow-xs space-y-3">
        <h4 className="font-serif font-bold text-sm text-[var(--paper)] border-b border-[var(--line)] pb-2">
          Tüm Varlıkların Ağırlık ve Getiri Karnesi
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--line)]/60 font-mono">
                <th className="pb-2">Varlık</th>
                <th className="pb-2">Kategori / Sektör</th>
                <th className="pb-2 text-right">Adet</th>
                <th className="pb-2 text-right">Piyasa Değeri</th>
                <th className="pb-2 text-right">Ağırlık</th>
                <th className="pb-2 text-right">Kâr / Zarar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]/30">
              {xray.holdings.map((h) => (
                <tr key={h.symbol} className="hover:bg-[var(--ink)]/30 transition-colors">
                  <td className="py-2.5 font-bold font-mono text-[var(--paper)]">
                    {h.symbol}
                    <span className="block text-[10px] font-normal text-[var(--muted)] truncate max-w-[150px]">
                      {h.name}
                    </span>
                  </td>
                  <td className="py-2.5 text-[var(--muted)]">
                    <span className="px-1.5 py-0.5 rounded-xs bg-[var(--line)]/60 text-[10px] font-medium mr-1 uppercase">
                      {h.category}
                    </span>
                    <span className="text-[10px]">{h.sector}</span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-[var(--paper)]">
                    {h.totalQuantity.toLocaleString("tr-TR")}
                  </td>
                  <td className="py-2.5 text-right font-mono font-medium text-[var(--paper)]">
                    {h.totalCurrentValue.toLocaleString("tr-TR", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    {h.currency}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-[var(--brass)]">
                    %{h.weightPct.toFixed(1)}
                  </td>
                  <td
                    className={`py-2.5 text-right font-mono font-bold ${
                      h.unrealizedProfitLoss >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {h.unrealizedProfitLoss >= 0 ? "+" : ""}
                    {h.unrealizedProfitLoss.toLocaleString("tr-TR", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    {h.currency}
                    <span className="block text-[10px]">
                      ({h.unrealizedProfitLossPct >= 0 ? "+" : ""}
                      {h.unrealizedProfitLossPct.toFixed(1)}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
