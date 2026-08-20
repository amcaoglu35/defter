"use client";

import React, { useState, useMemo } from "react";
import { Target, Compass, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";

interface PortfolioModelTargetHubProps {
  holdings: PortfolioAssetHolding[];
}

interface ModelStrategy {
  id: string;
  name: string;
  desc: string;
  targetDistribution: {
    Hisse: number;
    Fon: number;
    Emtia: number;
    Döviz: number;
    Kripto: number;
  };
}

const STRATEGIES: ModelStrategy[] = [
  {
    id: "balanced",
    name: "BIST 30 Dengeli Kalesi",
    desc: "Büyük ölçekli sağlam şirketler, altın ve nakit ile orta riskli dengeli kurumsal portföy.",
    targetDistribution: { Hisse: 55, Fon: 15, Emtia: 20, Döviz: 10, Kripto: 0 },
  },
  {
    id: "dividend",
    name: "Pasif Gelir & Temettü Emekliliği",
    desc: "Yüksek nakit temettü verimi, fonlar ve altın kalkanı ile düzenli pasif nakit akışı.",
    targetDistribution: { Hisse: 65, Fon: 15, Emtia: 15, Döviz: 5, Kripto: 0 },
  },
  {
    id: "growth",
    name: "Agresif Büyüme & Teknoloji",
    desc: "Yüksek kâr büyümesine ve küresel teknoloji trendlerine odaklı agresif büyüme sepeti.",
    targetDistribution: { Hisse: 75, Fon: 15, Emtia: 5, Döviz: 5, Kripto: 0 },
  },
  {
    id: "inflation-shield",
    name: "Enflasyon & Kriz Kalkanı",
    desc: "Altın, döviz ve defansif ihracatçı şirketlerle kura ve enflasyona karşı zırhlı dağılım.",
    targetDistribution: { Hisse: 35, Fon: 15, Emtia: 35, Döviz: 15, Kripto: 0 },
  },
];

export default function PortfolioModelTargetHub({
  holdings,
}: PortfolioModelTargetHubProps) {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("balanced");

  // Mevcut Dağılımı Hesapla
  const currentDistribution = useMemo(() => {
    const total = holdings.reduce((sum, h) => sum + h.totalCurrentValue, 0);
    if (total <= 0) {
      return { Hisse: 0, Fon: 0, Emtia: 0, Döviz: 0, Kripto: 0 };
    }

    const dist = { Hisse: 0, Fon: 0, Emtia: 0, Döviz: 0, Kripto: 0 };
    holdings.forEach((h) => {
      const pct = (h.totalCurrentValue / total) * 100;
      if (h.category === "hisse") dist.Hisse += pct;
      else if (h.category === "fon") dist.Fon += pct;
      else if (h.category === "emtia") dist.Emtia += pct;
      else if (h.category === "döviz") dist.Döviz += pct;
      else if (h.category === "kripto") dist.Kripto += pct;
    });

    return {
      Hisse: parseFloat(dist.Hisse.toFixed(1)),
      Fon: parseFloat(dist.Fon.toFixed(1)),
      Emtia: parseFloat(dist.Emtia.toFixed(1)),
      Döviz: parseFloat(dist.Döviz.toFixed(1)),
      Kripto: parseFloat(dist.Kripto.toFixed(1)),
    };
  }, [holdings]);

  const selectedStrategy = useMemo(() => {
    return STRATEGIES.find((s) => s.id === selectedStrategyId) || STRATEGIES[0];
  }, [selectedStrategyId]);

  // Radar Grafiği Verisi
  const radarData = useMemo(() => {
    const keys: (keyof typeof currentDistribution)[] = ["Hisse", "Fon", "Emtia", "Döviz"];
    return keys.map((key) => ({
      category: key,
      mevcut: currentDistribution[key],
      hedef: selectedStrategy.targetDistribution[key],
    }));
  }, [currentDistribution, selectedStrategy]);

  // Sapma Skoru
  const trackingError = useMemo(() => {
    let diffSum = 0;
    radarData.forEach((d) => {
      diffSum += Math.abs(d.mevcut - d.hedef);
    });
    return parseFloat((diffSum / 2).toFixed(1));
  }, [radarData]);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-5">
      {/* Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Hedef Model Portföy Kıyaslaması (İdeal vs Mevcut)
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              İdeal kurumsal varlık dağılım stratejileriyle mevcut portföyünüzün örtüşme radarı.
            </p>
          </div>
        </div>

        {/* Uyum Skoru */}
        <div className="px-3 py-1.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] text-right">
          <span className="text-[10px] font-mono text-[var(--mist)] block">Strateji Uyumu</span>
          <span
            className={`font-mono text-sm font-bold ${
              trackingError <= 10
                ? "text-emerald-400"
                : trackingError <= 25
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            %{Math.max(0, Math.round(100 - trackingError))} Uyumlu
          </span>
        </div>
      </div>

      {/* Strateji Seçim Butonları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STRATEGIES.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStrategyId(st.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedStrategyId === st.id
                ? "bg-[var(--ink-3)] border-[var(--brass)] shadow-sm"
                : "bg-[var(--ink)] border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--mist)]"
            }`}
          >
            <span className="font-serif font-bold text-xs text-[var(--paper)] block">
              {st.name}
            </span>
            <p className="text-[11px] font-mono text-[var(--mist)] line-clamp-2">
              {st.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Radar Grafiği ve Dağılım Tablosu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* Radar Grafik */}
        <div className="w-full h-72 bg-[var(--ink-3)] rounded-xl p-2 border border-[var(--line)] shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--line)" />
              <PolarAngleAxis
                dataKey="category"
                stroke="var(--mist)"
                fontSize={11}
                fontFamily="monospace"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="var(--line)"
                fontSize={10}
              />
              <Radar
                name="Mevcut Portföyünüz"
                dataKey="mevcut"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
              />
              <Radar
                name={selectedStrategy.name}
                dataKey="hedef"
                stroke="#C9A24B"
                fill="#C9A24B"
                fillOpacity={0.25}
              />
              <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ink-2)",
                  borderColor: "var(--brass-dim)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--paper)",
                  fontFamily: "monospace",
                }}
                formatter={(val: any) => [`%${val}`, ""]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dağılım Kıyaslama Tablosu */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-[var(--paper)] border-b border-[var(--line)] pb-2">
            Varlık Sınıfı Sapma Tablosu
          </h4>
          <div className="space-y-2 font-mono text-xs">
            {radarData.map((item) => {
              const diff = parseFloat((item.mevcut - item.hedef).toFixed(1));
              return (
                <div
                  key={item.category}
                  className="p-2.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-[var(--paper)]">{item.category}</span>
                    <span className="text-[10px] text-[var(--mist)] block">
                      Mevcut: %{item.mevcut} | Hedef: %{item.hedef}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold ${
                        Math.abs(diff) <= 5
                          ? "text-emerald-400"
                          : diff > 0
                          ? "text-amber-400"
                          : "text-sky-400"
                      }`}
                    >
                      {diff > 0 ? `+${diff}% Fazla` : diff < 0 ? `${diff}% Eksik` : "Tam Hedefte"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
