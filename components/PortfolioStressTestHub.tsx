"use client";

import React, { useState, useMemo } from "react";
import {
  AlertOctagon,
  Zap,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Flame,
  ArrowRight,
} from "lucide-react";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";

interface PortfolioStressTestHubProps {
  holdings: PortfolioAssetHolding[];
  totalValue: number;
}

interface Scenario {
  id: string;
  name: string;
  desc: string;
  bistImpact: number;
  usdImpact: number;
  goldImpact: number;
  globalImpact: number;
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: "kur_soku",
    name: "⚡ Ani Kur Şoku (+%25 Dolar)",
    desc: "Döviz kuru aniden %25 fırlar, ons altın ve küresel hisseler TL bazında değer kazanır.",
    bistImpact: -5,
    usdImpact: 25,
    goldImpact: 22,
    globalImpact: 20,
  },
  {
    id: "bist_duzeltme",
    name: "📉 BIST %15 Sert Düzeltme",
    desc: "Borsa İstanbul genelinde kâr realizasyonu ve sert bir düşüş dalgası yaşanır.",
    bistImpact: -15,
    usdImpact: 2,
    goldImpact: 1,
    globalImpact: 0,
  },
  {
    id: "global_kriz",
    name: "🌍 Küresel Resesyon & Riskten Kaçış",
    desc: "ABD ve Avrupa borsalarında satış, güvenli liman altına kaçış ve gelişen piyasalarda baskı.",
    bistImpact: -18,
    usdImpact: 15,
    goldImpact: 18,
    globalImpact: -15,
  },
  {
    id: "faiz_indirimi",
    name: "🚀 Güçlü BIST Rallisi & Faiz İndirimi",
    desc: "Merkez Bankası faiz indirim döngüsüne başlar, yabancı girişiyle yerli hisseler coşar.",
    bistImpact: 25,
    usdImpact: -3,
    goldImpact: 2,
    globalImpact: 5,
  },
];

export default function PortfolioStressTestHub({
  holdings,
  totalValue,
}: PortfolioStressTestHubProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("kur_soku");

  const selectedScenario = useMemo(() => {
    return PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Simülasyon Sonuçları
  const simulationResult = useMemo(() => {
    let simulatedTotal = 0;
    const items = holdings.map((h) => {
      let impactPct = 0;
      const cat = h.category?.toLowerCase() || "hisse";
      const isForeign = h.exchange === "ABD" || h.exchange === "Avrupa" || cat === "global";

      if (isForeign) {
        impactPct = selectedScenario.globalImpact + (selectedScenario.usdImpact * 0.8);
      } else if (cat === "hisse") {
        impactPct = selectedScenario.bistImpact;
      } else if (cat === "maden") {
        impactPct = selectedScenario.goldImpact;
      } else if (cat === "doviz") {
        impactPct = selectedScenario.usdImpact;
      } else if (cat === "fon") {
        impactPct = (selectedScenario.bistImpact + selectedScenario.globalImpact) / 2;
      } else {
        impactPct = 0;
      }

      const simVal = h.totalCurrentValue * (1 + impactPct / 100);
      simulatedTotal += simVal;

      return {
        ...h,
        impactPct,
        simulatedValue: simVal,
        valueDiff: simVal - h.totalCurrentValue,
      };
    });

    const totalDiff = simulatedTotal - totalValue;
    const totalDiffPct = totalValue > 0 ? (totalDiff / totalValue) * 100 : 0;

    return {
      items,
      simulatedTotal,
      totalDiff,
      totalDiffPct,
    };
  }, [holdings, totalValue, selectedScenario]);

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 shadow-xs space-y-5">
      {/* Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Stres Testi & Şok Senaryoları (What-If)
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Portföyünüzün ani kur şoku, faiz kararı veya küresel krizlerdeki dayanıklılığını test edin.
            </p>
          </div>
        </div>
      </div>

      {/* Senaryo Seçim Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESET_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenarioId(sc.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedScenarioId === sc.id
                ? "bg-[var(--ink)] border-[var(--brass)] shadow-xs"
                : "bg-[var(--ink)]/40 border-[var(--line)] hover:border-[var(--muted)]"
            }`}
          >
            <span className="font-serif font-bold text-xs text-[var(--paper)] block">
              {sc.name}
            </span>
            <p className="text-[11px] text-[var(--muted)] line-clamp-2">
              {sc.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Simülasyon Sonuç Paneli */}
      <div className="p-4 bg-[var(--ink)]/50 border border-[var(--line)] rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-3">
          <div>
            <span className="text-xs text-[var(--muted)]">Seçilen Senaryo:</span>
            <h4 className="font-serif font-bold text-sm text-[var(--paper)]">
              {selectedScenario.name}
            </h4>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[11px] text-[var(--muted)] block">Tahmini Portföy Değeri</span>
              <span className="font-mono text-base font-bold text-[var(--paper)]">
                {simulationResult.simulatedTotal.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[var(--muted)] block">Tahmini Şok Etkisi</span>
              <span
                className={`font-mono text-base font-bold ${
                  simulationResult.totalDiff >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {simulationResult.totalDiff >= 0 ? "+" : ""}
                {simulationResult.totalDiff.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                ({simulationResult.totalDiffPct >= 0 ? "+" : ""}
                {simulationResult.totalDiffPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Varlık Bazlı Şok Etkisi Tablosu */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--line)]/60 font-mono">
                <th className="pb-2">Varlık</th>
                <th className="pb-2">Kategori</th>
                <th className="pb-2 text-right">Mevcut Değer</th>
                <th className="pb-2 text-right">Şok Etkisi %</th>
                <th className="pb-2 text-right">Simüle Değer</th>
                <th className="pb-2 text-right">Fark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]/30">
              {simulationResult.items.map((item) => (
                <tr key={item.symbol} className="hover:bg-[var(--ink)]/30 transition-colors">
                  <td className="py-2 font-bold font-mono text-[var(--paper)]">
                    {item.symbol}
                  </td>
                  <td className="py-2 text-[var(--muted)] uppercase text-[10px]">
                    {item.category}
                  </td>
                  <td className="py-2 text-right font-mono text-[var(--paper)]">
                    {item.totalCurrentValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                  </td>
                  <td
                    className={`py-2 text-right font-mono font-bold ${
                      item.impactPct >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.impactPct >= 0 ? "+" : ""}
                    {item.impactPct}%
                  </td>
                  <td className="py-2 text-right font-mono text-[var(--paper)]">
                    {item.simulatedValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                  </td>
                  <td
                    className={`py-2 text-right font-mono font-bold ${
                      item.valueDiff >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.valueDiff >= 0 ? "+" : ""}
                    {item.valueDiff.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
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
