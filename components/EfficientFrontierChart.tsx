"use client";

import React, { useState } from "react";
import { TrendingUp, ShieldCheck, Sparkles, Sliders, Check } from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { MptOptimizationResult, MptPortfolioPoint } from "@/lib/mptEngine";

interface EfficientFrontierChartProps {
  mptData: MptOptimizationResult;
  onApplyWeights?: (weights: Record<string, number>) => void;
}

export function EfficientFrontierChart({
  mptData,
  onApplyWeights,
}: EfficientFrontierChartProps) {
  const [appliedType, setAppliedType] = useState<"current" | "mvp" | "maxSharpe" | null>(null);

  if (mptData.status !== "success" || !mptData.currentPortfolio) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 font-mono text-xs text-[var(--mist)] space-y-2">
        <div className="flex items-center gap-2 text-[var(--paper)] font-bold text-sm">
          <TrendingUp className="w-4 h-4 text-[var(--brass)]" />
          <span>Markowitz Etkin Sınır (Efficient Frontier) Analizi</span>
        </div>
        <p>{mptData.message || "Optimizasyon için en az 2 adet yeterli veriye sahip varlık gereklidir."}</p>
      </div>
    );
  }

  const {
    currentPortfolio,
    minVariancePortfolio,
    maxSharpePortfolio,
    frontierPoints,
  } = mptData;

  // Recharts Scatter verilerini oluştur
  const scatterData = frontierPoints.map((pt) => ({
    x: pt.volatilityPct,
    y: pt.expectedReturnPct,
    sharpe: pt.sharpeRatio,
    weights: pt.weights,
    isCurrent:
      currentPortfolio &&
      Math.abs(pt.volatilityPct - currentPortfolio.volatilityPct) < 0.05 &&
      Math.abs(pt.expectedReturnPct - currentPortfolio.expectedReturnPct) < 0.05,
    isMvp:
      minVariancePortfolio &&
      Math.abs(pt.volatilityPct - minVariancePortfolio.volatilityPct) < 0.05 &&
      Math.abs(pt.expectedReturnPct - minVariancePortfolio.expectedReturnPct) < 0.05,
    isMaxSharpe:
      maxSharpePortfolio &&
      Math.abs(pt.volatilityPct - maxSharpePortfolio.volatilityPct) < 0.05 &&
      Math.abs(pt.expectedReturnPct - maxSharpePortfolio.expectedReturnPct) < 0.05,
  }));

  const handleApply = (type: "mvp" | "maxSharpe") => {
    const pt = type === "mvp" ? minVariancePortfolio : maxSharpePortfolio;
    if (pt && onApplyWeights) {
      onApplyWeights(pt.weights);
      setAppliedType(type);
      setTimeout(() => setAppliedType(null), 3000);
    }
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-5 sm:p-6 space-y-5 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)] flex items-center gap-2">
              <span>Markowitz Etkin Sınır &amp; Portföy Optimizasyonu</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)] font-mono">
                MPT Quant Engine
              </span>
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Minimal Volatilite (MVP) ve Maksimum Sharpe (Teğet) Ağırlık İyileştirmesi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {maxSharpePortfolio && onApplyWeights && (
            <button
              onClick={() => handleApply("maxSharpe")}
              className="px-3 py-1.5 rounded-lg bg-[var(--brass)] text-[var(--ink)] font-bold border border-[var(--brass)] hover:bg-[var(--brass)]/90 transition-all cursor-pointer flex items-center gap-1.5 text-xs shadow-md"
            >
              {appliedType === "maxSharpe" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Uygulandı!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Max Sharpe Ağırlıklarını Uygula</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 3 Strategy Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Mevcut Portföy */}
        <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-1">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Mevcut Portföy</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-[var(--paper)]">
              %{currentPortfolio.expectedReturnPct}
            </span>
            <span className="text-[10px] text-[var(--mist)]">Getiri</span>
          </div>
          <div className="text-[11px] text-[var(--mist)] flex justify-between">
            <span>Risk: %{currentPortfolio.volatilityPct}</span>
            <span className="font-bold text-[var(--brass)]">Sharpe: {currentPortfolio.sharpeRatio}</span>
          </div>
        </div>

        {/* 2. Min Varyans (MVP) */}
        {minVariancePortfolio && (
          <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--brass-dim)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--brass)] uppercase font-bold block">
                🛡️ Min Volatilite (MVP)
              </span>
              {onApplyWeights && (
                <button
                  onClick={() => handleApply("mvp")}
                  className="text-[9px] text-[var(--brass)] underline hover:text-[var(--paper)] cursor-pointer"
                >
                  Uygula
                </button>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[var(--paper)]">
                %{minVariancePortfolio.expectedReturnPct}
              </span>
              <span className="text-[10px] text-[var(--mist)]">Getiri</span>
            </div>
            <div className="text-[11px] text-[var(--mist)] flex justify-between">
              <span className="text-[var(--verdigris)] font-bold">Min Risk: %{minVariancePortfolio.volatilityPct}</span>
              <span className="font-bold text-[var(--brass)]">Sharpe: {minVariancePortfolio.sharpeRatio}</span>
            </div>
          </div>
        )}

        {/* 3. Max Sharpe (Teğet) */}
        {maxSharpePortfolio && (
          <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--verdigris)] space-y-1 shadow-md">
            <span className="text-[10px] text-[var(--verdigris)] uppercase font-bold block">
              🎯 Max Sharpe (Optimal Teğet)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[var(--verdigris)]">
                %{maxSharpePortfolio.expectedReturnPct}
              </span>
              <span className="text-[10px] text-[var(--mist)]">Getiri</span>
            </div>
            <div className="text-[11px] text-[var(--mist)] flex justify-between">
              <span>Risk: %{maxSharpePortfolio.volatilityPct}</span>
              <span className="font-bold text-[var(--verdigris)]">Max Sharpe: {maxSharpePortfolio.sharpeRatio}</span>
            </div>
          </div>
        )}
      </div>

      {/* Efficient Frontier Scatter Chart */}
      <div className="h-64 sm:h-72 w-full bg-[var(--ink-3)] rounded-lg p-3 border border-[var(--line)] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 20, bottom: 20, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Risk (Volatilite %)"
              unit="%"
              stroke="var(--mist)"
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Beklenen Getiri %"
              unit="%"
              stroke="var(--mist)"
              fontSize={10}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as {
                    x: number;
                    y: number;
                    sharpe: number;
                    weights: Record<string, number>;
                    isCurrent?: boolean;
                    isMvp?: boolean;
                    isMaxSharpe?: boolean;
                  };
                  return (
                    <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-lg p-3 space-y-1.5 text-xs font-mono shadow-2xl z-50">
                      <div className="font-bold text-[var(--paper)] border-b border-[var(--line)] pb-1">
                        {pt.isMaxSharpe
                          ? "🎯 Max Sharpe (Optimal Teğet) Portföyü"
                          : pt.isMvp
                          ? "🛡️ Minimal Volatilite (MVP) Portföyü"
                          : pt.isCurrent
                          ? "📌 Mevcut Portföyün Konumu"
                          : "Etkin Sınır Simülasyon Noktası"}
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--mist)]">Beklenen Getiri:</span>
                        <span className="font-bold text-[var(--verdigris)]">%{pt.y}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--mist)]">Yıllık Volatilite:</span>
                        <span className="font-bold text-[var(--paper)]">%{pt.x}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--mist)]">Sharpe Oranı:</span>
                        <span className="font-bold text-[var(--brass)]">{pt.sharpe}</span>
                      </div>
                      <div className="pt-1 border-t border-[var(--line)] space-y-0.5 text-[10px]">
                        <span className="text-[var(--mist)] block uppercase">Ağırlık Dağılımı:</span>
                        {Object.entries(pt.weights).map(([sym, w]) => (
                          <div key={sym} className="flex justify-between gap-2">
                            <span>{sym}:</span>
                            <span className="font-bold text-[var(--paper)]">%{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Portföyler" data={scatterData}>
              {scatterData.map((entry, index) => {
                let fill = "rgba(160, 160, 160, 0.4)";
                let r = 4;
                if (entry.isMaxSharpe) {
                  fill = "var(--verdigris)";
                  r = 8;
                } else if (entry.isMvp) {
                  fill = "var(--brass)";
                  r = 7;
                } else if (entry.isCurrent) {
                  fill = "var(--paper)";
                  r = 7;
                }
                return <Cell key={`cell-${index}`} fill={fill} r={r} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Explanation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-[var(--mist)] pt-1">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--verdigris)] inline-block" />
            <span>Max Sharpe (Teğet)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brass)] inline-block" />
            <span>Min Volatilite (MVP)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--paper)] inline-block" />
            <span>Mevcut Portföy</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--brass)]" />
          <span>Long-Only Markowitz Sınırı</span>
        </div>
      </div>
    </div>
  );
}
