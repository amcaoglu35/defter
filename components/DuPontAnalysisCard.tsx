"use client";

import React, { useMemo } from "react";
import { Layers, Activity, Percent, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Company } from "@/lib/mockData";
import { performDuPontAnalysis } from "@/lib/dupontAnalysis";

interface DuPontAnalysisCardProps {
  company: Company;
}

export function DuPontAnalysisCard({ company }: DuPontAnalysisCardProps) {
  const result = useMemo(() => {
    return performDuPontAnalysis(company);
  }, [company]);

  const {
    roePct,
    netProfitMarginPct,
    assetTurnoverRatio,
    equityMultiplier,
    profitabilityDriver,
    healthVerdict,
    summary,
  } = result;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                DuPont Kârlılık &amp; ROE Dekompozisyonu
              </h3>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  healthVerdict === "Mükemmel & Organik"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : healthVerdict === "Sağlıklı"
                    ? "bg-[var(--brass-glow)] text-[var(--brass)] border-[var(--brass-dim)]"
                    : healthVerdict === "Kaldıraç Ağırlıklı (Riskli)"
                    ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
                }`}
              >
                {healthVerdict}
              </span>
              {result.isEstimated && (
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border bg-amber-500/10 text-amber-300 border-amber-500/30">
                  📌 Sektör Tahmini (Proxy)
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Özkaynak kârlılığının kaynağı: Marj × Devir Hızı × Finansal Kaldıraç
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-[var(--brass)] bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)] self-start sm:self-center">
          Ana Sürücü: <strong>{profitabilityDriver}</strong>
        </div>
      </div>

      {/* 3 Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center font-mono">
        {/* Component 1: Net Margin */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-[var(--mist)] block">1. Net Kâr Marjı</span>
          <div className="text-xl font-bold text-emerald-400">
            %{netProfitMarginPct}
          </div>
          <span className="text-[10px] text-[var(--mist)] block">Fiyatlama Gücü</span>
        </div>

        {/* Component 2: Asset Turnover */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-[var(--mist)] block">2. Varlık Devir Hızı</span>
          <div className="text-xl font-bold text-cyan-400">
            {assetTurnoverRatio}x
          </div>
          <span className="text-[10px] text-[var(--mist)] block">Operasyonel Hız</span>
        </div>

        {/* Component 3: Leverage */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-[var(--mist)] block">3. Finansal Kaldıraç</span>
          <div className="text-xl font-bold text-amber-400">
            {equityMultiplier}x
          </div>
          <span className="text-[10px] text-[var(--mist)] block">Borç / Özkaynak Çarpanı</span>
        </div>

        {/* Result: Composite ROE */}
        <div className="bg-[rgba(201,162,75,0.08)] border border-[var(--brass-dim)] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-[var(--brass)] font-bold block uppercase tracking-wider">
            = Özkaynak Kârlılığı (ROE)
          </span>
          <div className="text-2xl font-bold text-[var(--brass)]">
            %{roePct}
          </div>
          <span className="text-[10px] text-[var(--mist)] block">Bileşik Yıllık Kârlılık</span>
        </div>
      </div>

      {/* Summary Note */}
      <div className="text-xs font-mono text-[var(--mist)] bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
        <span>{summary}</span>
      </div>
    </div>
  );
}
