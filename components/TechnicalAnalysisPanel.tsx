"use client";

import React, { useMemo } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Compass,
  Zap,
  Layers,
  BarChart2,
  Info,
} from "lucide-react";
import { performTechnicalAnalysis } from "@/lib/technicalAnalysis";

interface TechnicalAnalysisPanelProps {
  closes: number[];
  currentPrice: number;
  currency?: string;
  symbol: string;
}

export default function TechnicalAnalysisPanel({
  closes,
  currentPrice,
  currency = "₺",
  symbol,
}: TechnicalAnalysisPanelProps) {
  const analysis = useMemo(() => {
    if (!closes || closes.length < 15) return null;
    return performTechnicalAnalysis(closes);
  }, [closes]);

  if (!analysis) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 text-center font-mono text-xs text-[var(--mist)] space-y-1">
        <Activity className="w-5 h-5 mx-auto text-[var(--mist)] opacity-40 mb-1" />
        <p>Teknik Analiz Göstergeleri</p>
        <p className="text-[10px] opacity-70">
          Bu varlık için yeterli geçmiş veri bulunamadığı için teknik göstergeler hesaplanamadı.
        </p>
      </div>
    );
  }

  const { rsi14, rsiSignal, macd, sma20, sma50, sma200, bollingerBands, crossSignal, overallScore } = analysis;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-5 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                Teknik Analiz &amp; İndikatör Paneli
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${overallScore.color}`}>
                {overallScore.verdict}
              </span>
            </div>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Gerçek geçmiş fiyat serisi üzerinden hesaplanmış teknik sinyaller
            </p>
          </div>
        </div>

        {/* Technical Score Gauge */}
        <div className="flex items-center gap-2 bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)] self-start sm:self-center font-mono text-xs">
          <span className="text-[var(--mist)]">Teknik Sinyal Skoru:</span>
          <span
            className={`font-bold ${
              overallScore.score > 0
                ? "text-[var(--verdigris)]"
                : overallScore.score < 0
                ? "text-[var(--loss)]"
                : "text-[var(--mist)]"
            }`}
          >
            {overallScore.score > 0 ? `+${overallScore.score}` : overallScore.score} / 100
          </span>
        </div>
      </div>

      {/* Grid of Key Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. RSI (14) */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--mist)]">RSI (14 Dönem)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--ink-2)] text-[var(--brass)] border border-[var(--brass-dim)]">
              {rsiSignal}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[var(--paper)]">
              {rsi14 !== null ? rsi14 : "—"}
            </span>
            <span className="text-[10px] font-mono text-[var(--mist)]">/ 100</span>
          </div>
          {/* Visual RSI Bar */}
          {rsi14 !== null && (
            <div className="w-full h-1.5 bg-[var(--ink)] rounded-full overflow-hidden flex relative">
              <div
                className={`h-full ${
                  rsi14 >= 70 ? "bg-rose-500" : rsi14 <= 30 ? "bg-emerald-500" : "bg-[var(--brass)]"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, rsi14))}%` }}
              />
            </div>
          )}
        </div>

        {/* 2. MACD (12, 26, 9) */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--mist)]">MACD (12, 26, 9)</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                macd?.trend === "BOĞA (YUKARI)"
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : macd?.trend === "AYI (AŞAĞI)"
                  ? "text-rose-400 border-rose-500/30 bg-rose-500/10"
                  : "text-[var(--mist)] border-[var(--line)]"
              }`}
            >
              {macd?.trend || "Nötr"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-xl font-bold text-[var(--paper)]">
              {macd?.histogram !== undefined ? (macd.histogram > 0 ? `+${macd.histogram}` : macd.histogram) : "—"}
            </span>
            <span className="text-[10px] text-[var(--mist)]">Histogram</span>
          </div>
          <div className="text-[10px] font-mono text-[var(--mist)] truncate">
            Çizgi: {macd?.macdLine ?? "—"} • Sinyal: {macd?.signalLine ?? "—"}
          </div>
        </div>

        {/* 3. Hareketli Ortalamalar (SMA) */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--mist)]">Hareketli Ort. (SMA)</span>
            {crossSignal && crossSignal !== "NÖTR" && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                {crossSignal.split(" ")[0]}
              </span>
            )}
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--mist)]">SMA 20:</span>
              <span className="font-bold text-[var(--paper)]">{sma20 ? `${sma20} ${currency}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--mist)]">SMA 50:</span>
              <span className="font-bold text-[var(--paper)]">{sma50 ? `${sma50} ${currency}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--mist)]">SMA 200:</span>
              <span className="font-bold text-[var(--paper)]">{sma200 ? `${sma200} ${currency}` : "—"}</span>
            </div>
          </div>
        </div>

        {/* 4. Bollinger Bantları (20, 2) */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--mist)]">Bollinger Bantları</span>
            <span className="text-[10px] font-mono text-[var(--mist)]">
              Genişlik: %{bollingerBands?.bandwidthPct ?? "—"}
            </span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--mist)]">Üst Bant:</span>
              <span className="font-bold text-rose-400">{bollingerBands?.upper ? `${bollingerBands.upper} ${currency}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--mist)]">Orta Bant:</span>
              <span className="font-bold text-[var(--paper)]">{bollingerBands?.middle ? `${bollingerBands.middle} ${currency}` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--mist)]">Alt Bant:</span>
              <span className="font-bold text-emerald-400">{bollingerBands?.lower ? `${bollingerBands.lower} ${currency}` : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
