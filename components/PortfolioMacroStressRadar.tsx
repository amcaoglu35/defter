"use client";

import React, { useMemo, useState } from "react";
import { Gauge, Sparkles, DollarSign, Percent, TrendingUp, Layers, Compass, HelpCircle } from "lucide-react";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";
import { calculateMacroSensitivities } from "@/lib/quantEngine";
import FormulaInfoModal from "@/components/FormulaInfoModal";

interface PortfolioMacroStressRadarProps {
  holdings: PortfolioAssetHolding[];
  portfolioBeta: number;
}

export default function PortfolioMacroStressRadar({
  holdings,
  portfolioBeta,
}: PortfolioMacroStressRadarProps) {
  const [activeFormulaKey, setActiveFormulaKey] = useState<string | null>(null);

  const quantAssets = useMemo(() => {
    return holdings.map((h) => ({
      symbol: h.symbol,
      name: h.name,
      category: h.category,
      sector: h.sector,
      totalCurrentValue: h.totalCurrentValue,
      weightPct: h.weightPct,
      unrealizedProfitLossPct: h.unrealizedProfitLossPct,
      currency: h.currency,
      dailyChangePct: h.change24h,
    }));
  }, [holdings]);

  const macro = useMemo(() => {
    return calculateMacroSensitivities(quantAssets, portfolioBeta);
  }, [quantAssets, portfolioBeta]);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-6">
      {/* Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)] flex items-center gap-2">
              <span>Makro Duyarlılık, Fama-French &amp; Black-Litterman</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)]">
                EKONOMETRİ
              </span>
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Dolar kuru, faiz oranları, Fama-French 5 faktör ayrıştırması ve Bayesyen portföy ağırlıkları.
            </p>
          </div>
        </div>
      </div>

      {/* 1. MAKRO ELASTİKİYET KARTLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Dolar Elastikiyeti */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1.5 relative">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Dolar/TL Elastikiyeti</span>
            <button
              onClick={() => setActiveFormulaKey("macroElasticity")}
              className="text-[var(--mist)] hover:text-emerald-400 cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-mono text-2xl font-bold text-emerald-400">
            +{macro.usdElasticityPct}%
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block leading-relaxed">
            Dolar/TL %10 arttığında döviz ve ihracatçı hisselerinizin portföye net pozitif katkısı.
          </span>
        </div>

        {/* Faiz Duyarlılığı */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1.5 relative">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Faiz İndirim Duyarlılığı</span>
            <button
              onClick={() => setActiveFormulaKey("macroElasticity")}
              className="text-[var(--mist)] hover:text-cyan-400 cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-mono text-2xl font-bold text-cyan-400">
            +{macro.interestRateSensitivityPct}%
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block leading-relaxed">
            TCMB faizleri 500 baz puan indirdiğinde banka ve büyüme hisselerinizin beklenen getirisi.
          </span>
        </div>

        {/* Enflasyon Beta */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1.5 relative">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Enflasyon Koruma Gücü</span>
            <span className="text-[10px] text-[var(--brass)]">Reel Beta</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[var(--brass)]">
            {macro.inflationBeta}x
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block leading-relaxed">
            1.00 üzerindeki değerler portföyün enflasyonu reel olarak ezdiğini doğrular.
          </span>
        </div>
      </div>

      {/* 2. NOBEL ÖDÜLLÜ FAMA-FRENCH 5 FAKTÖR AYRIŞTIRMASI */}
      <div className="p-4 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl space-y-3 relative">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[var(--brass)]" />
            <h4 className="font-serif font-bold text-sm text-[var(--paper)]">
              Fama-French 5 Faktör Modeli &amp; Arı Yetenek Alfası (α)
            </h4>
            <button
              onClick={() => setActiveFormulaKey("famaFrench")}
              className="text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Arı Alfa: +%{macro.famaFrench.pureAlphaPct}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 text-center font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] space-y-0.5">
            <span className="text-[10px] text-[var(--mist)] block">Piyasa Beta</span>
            <span className="font-bold text-[var(--paper)] text-sm">{macro.famaFrench.marketBeta}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] space-y-0.5">
            <span className="text-[10px] text-[var(--mist)] block">SMB (Ölçek)</span>
            <span className="font-bold text-cyan-400 text-sm">{macro.famaFrench.smbSizeBeta}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] space-y-0.5">
            <span className="text-[10px] text-[var(--mist)] block">HML (Değer)</span>
            <span className="font-bold text-emerald-400 text-sm">{macro.famaFrench.hmlValueBeta}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] space-y-0.5">
            <span className="text-[10px] text-[var(--mist)] block">RMW (Kârlılık)</span>
            <span className="font-bold text-amber-400 text-sm">{macro.famaFrench.rmwProfitabilityBeta}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] space-y-0.5">
            <span className="text-[10px] text-[var(--mist)] block">CMA (Yatırım)</span>
            <span className="font-bold text-[var(--brass)] text-sm">{macro.famaFrench.cmaInvestmentBeta}</span>
          </div>
        </div>
      </div>

      {/* 3. BLACK-LITTERMAN BAYESYEN AĞIRLIK ÖNERİLERİ */}
      <div className="space-y-3">
        <h4 className="font-serif font-bold text-sm text-[var(--paper)] flex items-center gap-2">
          <Compass className="w-4 h-4 text-[var(--brass)]" />
          <span>Black-Litterman Optimal Portföy Ağırlık Tavsiyeleri</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {macro.blackLittermanSuggestedWeights.slice(0, 8).map((bl) => (
            <div
              key={bl.symbol}
              className="p-3 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[var(--paper)] text-sm">{bl.symbol}</span>
                <span className="text-[10px] text-[var(--mist)] block">
                  Mevcut: %{bl.currentWeight.toFixed(0)} ➔ Hedef: %{bl.optimalWeight.toFixed(0)}
                </span>
              </div>
              <span
                className={`font-bold ${
                  bl.diffPct > 0
                    ? "text-emerald-400"
                    : bl.diffPct < 0
                    ? "text-rose-400"
                    : "text-[var(--mist)]"
                }`}
              >
                {bl.diffPct > 0 ? `+${bl.diffPct}%` : `${bl.diffPct}%`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FORMÜL BİLGİ MODALI */}
      <FormulaInfoModal
        formulaKey={activeFormulaKey}
        onClose={() => setActiveFormulaKey(null)}
      />
    </div>
  );
}
