"use client";

import React from "react";
import { Shield, ShieldCheck, Activity } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";
import { ComprehensiveRiskProfile } from "@/lib/riskEngine";

interface BasketRiskMetricsCardProps {
  basket: Basket;
  companies?: Company[];
  riskProfile?: ComprehensiveRiskProfile | null;
}

interface MetricDisplayProps {
  label: string;
  value: number | string | null;
  unit?: string;
  abs?: boolean;
  qualifier?: string;
  status?: string;
  dataPoints?: number;
}

function MetricDisplay({
  label,
  value,
  unit = "",
  abs = false,
  qualifier,
  status = "live",
  dataPoints = 0,
}: MetricDisplayProps) {
  if (status !== "live" || value === null || value === undefined) {
    return (
      <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 space-y-1 font-mono">
        <span className="text-[10px] text-[var(--mist)] block">{label}</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[var(--mist)]">Veri Yok</span>
          <span className="text-[9px] text-[var(--mist)]/70 leading-tight">
            {status === "insufficient"
              ? `Yetersiz seri (${dataPoints} gün < 20)`
              : "Tarihsel fiyat serisi gerekli"}
          </span>
        </div>
      </div>
    );
  }

  const numVal = typeof value === "number" ? value : parseFloat(value);
  const displayVal = isNaN(numVal) ? value : abs ? Math.abs(numVal) : numVal;
  const formattedText =
    typeof displayVal === "number"
      ? `${unit}${displayVal.toFixed(unit === "%" ? 1 : 2)}`
      : `${unit}${displayVal}`;

  return (
    <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 space-y-1 font-mono">
      <span className="text-[10px] text-[var(--mist)] block">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-[var(--paper)]">
          {formattedText}
        </span>
        {qualifier && (
          <span className="text-[9px] text-[var(--mist)] font-normal">{qualifier}</span>
        )}
      </div>
      {dataPoints > 0 && (
        <span className="text-[9px] text-[var(--verdigris)] block">
          📊 {dataPoints} gün veri
        </span>
      )}
    </div>
  );
}

export function BasketRiskMetricsCard({
  basket,
  riskProfile,
}: BasketRiskMetricsCardProps) {
  const status = riskProfile?.status ?? "unavailable";
  const dataPts = riskProfile?.dataPoints ?? 0;
  const riskGrade = riskProfile?.riskGrade ?? "NR";

  const sharpeVal = riskProfile?.sharpeRatio ?? null;
  const sharpeQualifier =
    sharpeVal !== null
      ? sharpeVal > 1.0
        ? "Güçlü"
        : sharpeVal > 0
        ? "Pozitif"
        : "Düşük"
      : undefined;

  const summaryText =
    riskProfile?.riskSummary ??
    "Portföy risk karnesi için tarihsel günlük fiyat serisi yükleniyor...";

  // VaR %95
  const var95Pct = riskProfile?.varCvar?.confidence95Pct.historicalVaRPct ?? null;
  const cvar95Pct = riskProfile?.varCvar?.confidence95Pct.expectedShortfallPct ?? null;
  const betaVal = riskProfile?.benchmark?.beta ?? null;

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
              Sharpe, Sortino, VaR (%95), CVaR ve BIST Beta — Gerçek Seri
            </p>
          </div>
        </div>

        {betaVal !== null && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--mist)] bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)] self-start sm:self-center">
            <Activity className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>BIST 100 Beta:</span>
            <strong className="text-[var(--paper)]">{betaVal}</strong>
          </div>
        )}
      </div>

      {/* Grid of 6 Key Quant Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricDisplay
          label="Sharpe Oranı"
          value={sharpeVal}
          qualifier={sharpeQualifier}
          status={status}
          dataPoints={dataPts}
        />
        <MetricDisplay
          label="Sortino Oranı"
          value={riskProfile?.sortinoRatio ?? null}
          qualifier="Düşüş Riski"
          status={status}
          dataPoints={dataPts}
        />
        <MetricDisplay
          label="Yıllık Volatilite"
          value={riskProfile?.volatilityAnnualizedPct ?? null}
          unit="%"
          status={status}
          dataPoints={dataPts}
        />
        <MetricDisplay
          label="Gerçek Max DD"
          value={riskProfile?.maxDrawdownPct ?? null}
          unit="%"
          abs={true}
          status={status}
          dataPoints={dataPts}
        />
        <MetricDisplay
          label="Tarihsel VaR (%95)"
          value={var95Pct}
          unit="%"
          status={status}
          dataPoints={dataPts}
        />
        <MetricDisplay
          label="CVaR (Risk Tayfı)"
          value={cvar95Pct}
          unit="%"
          status={status}
          dataPoints={dataPts}
        />
      </div>

      {/* Summary Text Note */}
      <div className="text-xs font-mono text-[var(--mist)] bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
        <span>{summaryText}</span>
      </div>
    </div>
  );
}
