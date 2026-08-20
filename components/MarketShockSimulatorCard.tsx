"use client";

import React, { useState, useMemo } from "react";
import { ShieldAlert, Zap, AlertTriangle, TrendingDown, ArrowRight } from "lucide-react";
import { Basket } from "@/lib/mockData";

interface MarketShockSimulatorCardProps {
  basket: Basket;
}

interface StressScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  impacts: { assetClass: string; multiplier: number }[];
}

const SCENARIOS: StressScenario[] = [
  {
    id: "bist_crash",
    title: "📉 BIST 100 %20 Çöküşü (Borsa Türbülansı)",
    description: "Yerli hisse senedi piyasasında ani %20 satış ve likidite daralması kriz senaryosu.",
    icon: "📉",
    impacts: [
      { assetClass: "hisse", multiplier: -0.2 },
      { assetClass: "maden", multiplier: 0.05 },
      { assetClass: "doviz", multiplier: 0.08 },
      { assetClass: "fon", multiplier: -0.12 },
    ],
  },
  {
    id: "currency_spike",
    title: "💵 Dolar %30 Sıçraması (Kur Şoku)",
    description: "USD/TRY kurunda %30 ani yukarı yönlü şok ve enflasyonist baskı.",
    icon: "💵",
    impacts: [
      { assetClass: "hisse", multiplier: 0.15 },
      { assetClass: "maden", multiplier: 0.28 },
      { assetClass: "doviz", multiplier: 0.3 },
      { assetClass: "fon", multiplier: 0.1 },
    ],
  },
  {
    id: "gold_rally",
    title: "🥇 Jeopolitik Kriz & Altın %25 Yükselişi",
    description: "Küresel risk algısının artmasıyla kıymetli madenlere sığınma dalgası.",
    icon: "🥇",
    impacts: [
      { assetClass: "hisse", multiplier: -0.05 },
      { assetClass: "maden", multiplier: 0.25 },
      { assetClass: "doviz", multiplier: 0.05 },
      { assetClass: "fon", multiplier: 0.02 },
    ],
  },
  {
    id: "rate_hike",
    title: "🏦 %10 Ek Faiz Artışı (Para Politikası Şoku)",
    description: "Merkez bankasının mevduat faizlerini %10 yükseltmesi ve sıkılaşma.",
    icon: "🏦",
    impacts: [
      { assetClass: "hisse", multiplier: -0.12 },
      { assetClass: "maden", multiplier: -0.05 },
      { assetClass: "doviz", multiplier: -0.02 },
      { assetClass: "fon", multiplier: -0.04 },
    ],
  },
];

export function MarketShockSimulatorCard({ basket }: MarketShockSimulatorCardProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("bist_crash");

  const selectedScenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  const shockAnalysis = useMemo(() => {
    const totalValue = basket.totalValue || 0;
    if (!basket.holdings || basket.holdings.length === 0 || totalValue <= 0) {
      return {
        simulatedChangeTL: 0,
        simulatedChangePct: 0,
        finalSimulatedValue: totalValue,
        resilience: "NÖTR (Varlık Yok)",
        resilienceColor: "var(--mist)",
      };
    }

    let simulatedChangeTL = 0;

    basket.holdings.forEach((h) => {
      const holdingValue = (totalValue * (h.weightPercent || 1)) / 100;
      // Infer asset class: Maden if ALTIN/GÜMÜŞ, else Hisse
      const sym = h.companySymbol.toUpperCase();
      let assetClass = "hisse";
      if (sym.includes("ALTIN") || sym.includes("GÜMÜŞ") || sym.includes("MADEN")) {
        assetClass = "maden";
      } else if (sym.includes("USD") || sym.includes("EUR")) {
        assetClass = "doviz";
      }

      const impact = selectedScenario.impacts.find((imp) => imp.assetClass === assetClass);
      const mult = impact ? impact.multiplier : -0.1;
      simulatedChangeTL += holdingValue * mult;
    });

    const simulatedChangePct = parseFloat(((simulatedChangeTL / totalValue) * 100).toFixed(1));
    const finalSimulatedValue = totalValue + simulatedChangeTL;

    let resilience = "DENGELİ (Orta Hassasiyet)";
    let resilienceColor = "var(--brass)";

    if (simulatedChangePct >= 0) {
      resilience = "🛡️ YÜKSEK KORUMA (Hedging Başarılı)";
      resilienceColor = "var(--verdigris)";
    } else if (simulatedChangePct > -10) {
      resilience = "🟡 MAKul HASSASİYET";
      resilienceColor = "var(--brass)";
    } else {
      resilience = "⚠️ KIRILGAN (Yüksek Şok Riski)";
      resilienceColor = "var(--loss)";
    }

    return {
      simulatedChangeTL: parseFloat(simulatedChangeTL.toFixed(2)),
      simulatedChangePct,
      finalSimulatedValue: parseFloat(finalSimulatedValue.toFixed(2)),
      resilience,
      resilienceColor,
    };
  }, [basket, selectedScenario]);

  const { simulatedChangeTL, simulatedChangePct, finalSimulatedValue, resilience, resilienceColor } = shockAnalysis;
  const isShockPositive = simulatedChangeTL >= 0;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(163,59,59,0.15)] border border-[var(--loss)] flex items-center justify-center text-[var(--loss)] shadow-inner">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🛡️ Portföy Piyasa Şoku &amp; Kriz Stres Testi (Market Shock Simulator)
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Olası Piyasa Çöküşlerinde Sepetinizin Tahmini Dayanıklılık Testi
            </p>
          </div>
        </div>

        <span
          className="px-3 py-1 rounded text-xs font-bold border"
          style={{
            color: resilienceColor,
            borderColor: resilienceColor,
            backgroundColor: "rgba(18,21,28,0.6)",
          }}
        >
          {resilience}
        </span>
      </div>

      {/* Scenario Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {SCENARIOS.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;
          return (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenarioId(scenario.id)}
              className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                isSelected
                  ? "bg-[var(--ink-3)] border-[var(--brass)] shadow-md text-[var(--paper)]"
                  : "bg-[var(--ink-3)] border-[var(--line)] text-[var(--mist)] hover:border-[var(--brass-dim)] hover:text-[var(--paper)]"
              }`}
            >
              <div className="font-bold text-[11px] truncate">{scenario.title}</div>
              <p className="text-[9px] text-[var(--mist)] line-clamp-2 mt-1 leading-relaxed">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Shock Simulation Output Box */}
      <div className="p-4 bg-[var(--ink-3)] rounded-xl border border-[var(--line)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-[10px] text-[var(--mist)] uppercase block">Mevcut Sepet Değeri</span>
          <span className="font-serif text-lg font-bold text-[var(--paper)] block mt-0.5">
            {basket.totalValue.toLocaleString("tr-TR")} ₺
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[var(--mist)] uppercase block">Tahmini Şok Etkisi</span>
          <span
            className={`font-serif text-lg font-bold block mt-0.5 ${
              isShockPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
            }`}
          >
            {isShockPositive ? "+" : ""}{simulatedChangeTL.toLocaleString("tr-TR")} ₺ ({isShockPositive ? "+" : ""}%{simulatedChangePct})
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[var(--mist)] uppercase block">Şok Sonrası Portföy Değeri</span>
          <span className="font-serif text-lg font-bold text-[var(--brass)] block mt-0.5">
            {finalSimulatedValue.toLocaleString("tr-TR")} ₺
          </span>
        </div>
      </div>
    </div>
  );
}
