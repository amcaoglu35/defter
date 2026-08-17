"use client";

import React, { useMemo } from "react";
import { Shield, ShieldAlert, ShieldCheck, TrendingDown, Percent, Activity, Layers, Award } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";
import { calculateBasketRiskProfile } from "@/lib/riskCalculator";

interface BasketRiskMetricsCardProps {
  basket: Basket;
  companies: Company[];
}

export function BasketRiskMetricsCard({ basket, companies }: BasketRiskMetricsCardProps) {
  const profile = useMemo(() => {
    return calculateBasketRiskProfile(basket, companies);
  }, [basket, companies]);

  const {
    volatilityAnnualizedPct,
    sharpeRatio,
    sortinoRatio,
    maxDrawdownPct,
    diversificationLevel,
    riskGrade,
    riskSummary,
  } = profile;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)] flex items-center gap-2">
              <span>Portföy Risk &amp; Volatilite Karnesi</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)]">
                Not: {riskGrade}
              </span>
            </h3>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Sharpe, Sortino, Maksimum Düşüş (Max DD) ve Çeşitlendirme Analizi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--mist)] bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)] self-start sm:self-center">
          <span>Çeşitlendirme:</span>
          <strong className="text-[var(--paper)]">{diversificationLevel}</strong>
        </div>
      </div>

      {/* Grid of 4 Key Quant Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {/* 1. Sharpe Ratio */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 space-y-1">
          <span className="text-[10px] text-[var(--mist)] block">Sharpe Oranı</span>
          <div className="text-lg font-bold text-[var(--paper)] flex items-baseline gap-1">
            <span>{sharpeRatio}</span>
            <span className="text-[9px] text-[var(--mist)] font-normal">
              {sharpeRatio > 1.0 ? "Güçlü" : sharpeRatio > 0 ? "Pozitif" : "Düşük"}
            </span>
          </div>
        </div>

        {/* 2. Sortino Ratio */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 space-y-1">
          <span className="text-[10px] text-[var(--mist)] block">Sortino Oranı</span>
          <div className="text-lg font-bold text-[var(--paper)] flex items-baseline gap-1">
            <span>{sortinoRatio}</span>
            <span className="text-[9px] text-[var(--mist)] font-normal">Düşüş Riski</span>
          </div>
        </div>

        {/* 3. Volatilite */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 space-y-1">
          <span className="text-[10px] text-[var(--mist)] block">Yıllık Volatilite</span>
          <div className="text-lg font-bold text-amber-400">
            %{volatilityAnnualizedPct}
          </div>
        </div>

        {/* 4. Max Drawdown */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 space-y-1">
          <span className="text-[10px] text-[var(--mist)] block">Öngörülen Max DD</span>
          <div className="text-lg font-bold text-rose-400">
            %{Math.abs(maxDrawdownPct)}
          </div>
        </div>
      </div>

      {/* Summary Text Note */}
      <div className="text-xs font-mono text-[var(--mist)] bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
        <span>{riskSummary}</span>
      </div>
    </div>
  );
}
