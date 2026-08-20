"use client";

import React, { useMemo } from "react";
import { Gauge } from "lucide-react";
import { Company } from "@/lib/mockData";
import { performTechnicalAnalysis } from "@/lib/technicalAnalysis";

interface TechnicalGaugeMeterProps {
  company: Company;
  closes?: number[];
}

export function TechnicalGaugeMeter({ company, closes }: TechnicalGaugeMeterProps) {
  const technicalAnalysis = useMemo(() => {
    if (!closes || closes.length < 15) {
      return null;
    }

    const result = performTechnicalAnalysis(closes);
    if (!result) return null;

    const { rsi14, macd, sma20, sma50, sma200, overallScore } = result;

    const rsi = rsi14 !== null ? rsi14 : 50;
    const macdSignal = macd ? (macd.trend === "BOĞA (YUKARI)" ? "AL" : macd.trend === "AYI (AŞAĞI)" ? "SAT" : "NÖTR") : "NÖTR";
    const stoch = Math.min(100, Math.max(0, Math.round(rsi * 0.95)));

    let buyCount = 0;
    let sellCount = 0;
    let neutralCount = 0;

    if (rsi < 30) buyCount += 2;
    else if (rsi > 70) sellCount += 2;
    else neutralCount += 1;

    if (macdSignal === "AL") buyCount += 2;
    else if (macdSignal === "SAT") sellCount += 2;
    else neutralCount += 1;

    if (company.price > (sma20 || 0)) buyCount += 1; else sellCount += 1;
    if (company.price > (sma50 || 0)) buyCount += 1; else sellCount += 1;
    if (company.price > (sma200 || 0)) buyCount += 1; else sellCount += 1;

    let overallVerdict = "NÖTR";
    let overallColor = "var(--brass)";
    let needleAngle = 0; // -90 (Aşırı Sat) to +90 (Aşırı Al)

    if (overallScore.score > 30) {
      overallVerdict = "GÜÇLÜ AL";
      overallColor = "var(--verdigris)";
      needleAngle = 60;
    } else if (overallScore.score > 0) {
      overallVerdict = "AL";
      overallColor = "var(--verdigris)";
      needleAngle = 30;
    } else if (overallScore.score < -30) {
      overallVerdict = "GÜÇLÜ SAT";
      overallColor = "var(--loss)";
      needleAngle = -60;
    } else if (overallScore.score < 0) {
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
      ema20: sma20 ? parseFloat(sma20.toFixed(2)) : null,
      ema50: sma50 ? parseFloat(sma50.toFixed(2)) : null,
      ema200: sma200 ? parseFloat(sma200.toFixed(2)) : null,
      buyCount,
      sellCount,
      neutralCount,
      overallVerdict,
      overallColor,
      needleAngle,
    };
  }, [closes, company.price]);

  if (!technicalAnalysis) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 font-mono text-xs text-[var(--mist)] space-y-2">
        <div className="flex items-center gap-2 text-[var(--paper)] font-bold">
          <Gauge className="w-4 h-4 text-[var(--brass)]" />
          <span>⏱️ TradingView Teknik İndikatör İbresi</span>
        </div>
        <p className="text-[11px]">
          {company.symbol} için canlı geçmiş fiyat verisi yükleniyor veya yeterli seri bulunamadı.
        </p>
      </div>
    );
  }

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
            <span className="text-[var(--mist)] text-[11px]">SMA 20:</span>
            <span className="font-bold text-[var(--brass)]">{ema20 ? `${ema20} ₺` : "—"}</span>
          </div>

          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">SMA 50:</span>
            <span className="font-bold text-[var(--paper-dim)]">{ema50 ? `${ema50} ₺` : "—"}</span>
          </div>

          <div className="p-2.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex justify-between items-center">
            <span className="text-[var(--mist)] text-[11px]">SMA 200:</span>
            <span className="font-bold text-[var(--paper-dim)]">{ema200 ? `${ema200} ₺` : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

