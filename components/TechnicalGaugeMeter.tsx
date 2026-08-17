"use client";

import React, { useMemo } from "react";
import { Activity, Gauge, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Company } from "@/lib/mockData";

interface TechnicalGaugeMeterProps {
  company: Company;
}

export function TechnicalGaugeMeter({ company }: TechnicalGaugeMeterProps) {
  const technicalAnalysis = useMemo(() => {
    const dailyChg = company.dailyChange || 0;
    const price = company.price || 100;

    // Synthesize technical oscillators dynamically
    const rsi = Math.min(95, Math.max(15, Math.round(50 + dailyChg * 4.5)));
    const macdSignal = dailyChg >= 0.5 ? "AL" : dailyChg <= -0.5 ? "SAT" : "NÖTR";
    const stoch = Math.min(95, Math.max(10, Math.round(48 + dailyChg * 5)));
    const ema20 = price * (1 - dailyChg * 0.005);
    const ema50 = price * (1 - dailyChg * 0.01);
    const ema200 = price * (1 - dailyChg * 0.02);

    let buyCount = 0;
    let sellCount = 0;
    let neutralCount = 0;

    if (rsi < 30) buyCount += 2;
    else if (rsi > 70) sellCount += 2;
    else neutralCount += 1;

    if (macdSignal === "AL") buyCount += 2;
    else if (macdSignal === "SAT") sellCount += 2;
    else neutralCount += 1;

    if (price > ema20) buyCount += 1; else sellCount += 1;
    if (price > ema50) buyCount += 1; else sellCount += 1;
    if (price > ema200) buyCount += 1; else sellCount += 1;

    let overallVerdict = "NÖTR";
    let overallColor = "var(--brass)";
    let needleAngle = 0; // -90 (Aşırı Sat) to +90 (Aşırı Al)

    if (buyCount > sellCount + 2) {
      overallVerdict = "GÜÇLÜ AL";
      overallColor = "var(--verdigris)";
      needleAngle = 60;
    } else if (buyCount > sellCount) {
      overallVerdict = "AL";
      overallColor = "var(--verdigris)";
      needleAngle = 30;
    } else if (sellCount > buyCount + 2) {
      overallVerdict = "GÜÇLÜ SAT";
      overallColor = "var(--loss)";
      needleAngle = -60;
    } else if (sellCount > buyCount) {
      overallVerdict = "SAT";
      overallColor = "var(--loss)";
      needleAngle = -30;
    } else {
      needleAngle = 0;
    }

    return {
      rsi,
      stoch,
      macdSignal,
      ema20: parseFloat(ema20.toFixed(2)),
      ema50: parseFloat(ema50.toFixed(2)),
      ema200: parseFloat(ema200.toFixed(2)),
      buyCount,
      sellCount,
      neutralCount,
      overallVerdict,
      overallColor,
      needleAngle,
    };
  }, [company]);

  const {
    rsi,
    stoch,
    macdSignal,
    ema20,
    ema50,
    ema200,
    buyCount,
    sellCount,
    neutralCount,
    overallVerdict,
    overallColor,
    needleAngle,
  } = technicalAnalysis;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] flex items-center justify-center text-[var(--verdigris)] shadow-inner">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              ⏱️ TradingView Teknik İndikatör İbresi &amp; Seviye Tablosu
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              RSI, MACD, Osilatörler &amp; Hareketli Ortalamalar Özeti
            </p>
          </div>
        </div>

        <span
          className="px-3 py-1 rounded text-xs font-bold border"
          style={{
            color: overallColor,
            borderColor: overallColor,
            backgroundColor: "rgba(18,21,28,0.6)",
          }}
        >
          {overallVerdict}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 items-center">
        {/* Semi-Circle Gauge SVG */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-44 h-24 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Background Arch */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="var(--line)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Oversold Zone (Red) */}
              <path
                d="M 10 50 A 40 40 0 0 1 30 20"
                fill="none"
                stroke="var(--loss)"
                strokeWidth="10"
              />
              {/* Neutral Zone (Brass) */}
              <path
                d="M 30 20 A 40 40 0 0 1 70 20"
                fill="none"
                stroke="var(--brass)"
                strokeWidth="10"
              />
              {/* Overbought Zone (Green) */}
              <path
                d="M 70 20 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="var(--verdigris)"
                strokeWidth="10"
              />
              {/* Needle */}
              <g transform={`rotate(${needleAngle}, 50, 50)`}>
                <line x1="50" y1="50" x2="50" y2="18" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="50" r="5" fill="var(--brass)" />
              </g>
            </svg>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="text-[var(--loss)]">{sellCount} Sat</span>
            <span className="text-[var(--mist)]">{neutralCount} Nötr</span>
            <span className="text-[var(--verdigris)]">{buyCount} Al</span>
          </div>
        </div>

        {/* Oscillators Table */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">RSI (14):</span>
            <span className={`font-bold ${rsi > 70 ? "text-[var(--loss)]" : rsi < 30 ? "text-[var(--verdigris)]" : "text-[var(--paper)]"}`}>
              {rsi}
            </span>
          </div>

          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">MACD:</span>
            <span className={`font-bold ${macdSignal === "AL" ? "text-[var(--verdigris)]" : macdSignal === "SAT" ? "text-[var(--loss)]" : "text-[var(--mist)]"}`}>
              {macdSignal}
            </span>
          </div>

          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">Stokastik:</span>
            <span className="font-bold text-[var(--paper)]">%{stoch}</span>
          </div>

          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">EMA 20:</span>
            <span className="font-bold text-[var(--brass)]">{ema20} ₺</span>
          </div>

          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">EMA 50:</span>
            <span className="font-bold text-[var(--paper-dim)]">{ema50} ₺</span>
          </div>

          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">EMA 200:</span>
            <span className="font-bold text-[var(--paper-dim)]">{ema200} ₺</span>
          </div>
        </div>
      </div>
    </div>
  );
}
