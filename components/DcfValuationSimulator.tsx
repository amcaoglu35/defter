"use client";

import React, { useState, useMemo } from "react";
import { Sliders, Calculator, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { Company } from "@/lib/mockData";

interface DcfValuationSimulatorProps {
  company: Company;
}

export function DcfValuationSimulator({ company }: DcfValuationSimulatorProps) {
  const [growthRate, setGrowthRate] = useState<number>(15); // % Expected 5Y Growth
  const [discountRate, setDiscountRate] = useState<number>(12); // % WACC / Required Return
  const [terminalGrowth, setTerminalGrowth] = useState<number>(3); // % Perpetual Growth

  // DCF Fair Value Calculation
  const dcfResults = useMemo(() => {
    const price = company.price || 100;
    const pe = company.peRatio || 15;
    const eps = price / pe;

    // Project 5 years cash flows / earnings per share
    const calcFairValueForGrowth = (gPct: number, dPct: number) => {
      const g = gPct / 100;
      const d = dPct / 100;
      const gTerm = terminalGrowth / 100;

      let currentEps = eps;
      let pvSum = 0;

      for (let yr = 1; yr <= 5; yr++) {
        currentEps = currentEps * (1 + g);
        const pv = currentEps / Math.pow(1 + d, yr);
        pvSum += pv;
      }

      // Terminal Value via Gordon Growth Model
      const terminalVal = (currentEps * (1 + gTerm)) / (d - gTerm);
      const pvTerminal = terminalVal / Math.pow(1 + d, 5);
      const totalFairVal = pvSum + pvTerminal;

      return Math.max(1, totalFairVal);
    };

    const baseFairValue = calcFairValueForGrowth(growthRate, discountRate);
    const bearFairValue = calcFairValueForGrowth(Math.max(0, growthRate * 0.6), discountRate * 1.15);
    const bullFairValue = calcFairValueForGrowth(growthRate * 1.4, Math.max(7, discountRate * 0.85));

    const marginOfSafetyPct = ((baseFairValue - price) / price) * 100;
    const isUndervalued = marginOfSafetyPct >= 0;

    return {
      eps: parseFloat(eps.toFixed(2)),
      baseFairValue: parseFloat(baseFairValue.toFixed(2)),
      bearFairValue: parseFloat(bearFairValue.toFixed(2)),
      bullFairValue: parseFloat(bullFairValue.toFixed(2)),
      marginOfSafetyPct: parseFloat(marginOfSafetyPct.toFixed(1)),
      isUndervalued,
      currency: company.currency || "₺",
    };
  }, [company, growthRate, discountRate, terminalGrowth]);

  const { baseFairValue, bearFairValue, bullFairValue, marginOfSafetyPct, isUndervalued, currency } = dcfResults;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-5 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🎛️ Canlı DCF (Nakit Akım İskonto) Değerleme Simülatörü
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Parametreleri Kaydırarak Kendi Adil Değer Senaryolarınızı Test Edin
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded text-xs font-bold border ${
            isUndervalued
              ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
              : "bg-[rgba(201,124,124,0.15)] text-[var(--loss)] border-[var(--loss)]"
          }`}
        >
          {isUndervalued
            ? `🎯 Güvenlik Marjı: %${marginOfSafetyPct} İskonto`
            : `⚠️ Piyasa Fiyatı %${Math.abs(marginOfSafetyPct)} Primli`}
        </span>
      </div>

      {/* Sliders Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--ink-3)] p-4 rounded-xl border border-[var(--line)]">
        {/* Slider 1: Growth Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[var(--paper)] font-semibold">5 Yıllık Tahmini Kâr Büyümesi:</span>
            <span className="font-bold text-[var(--brass)] font-mono text-sm">%{growthRate} / yıl</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="w-full accent-[var(--brass)] bg-[var(--ink-2)] rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[var(--mist)]">
            <span>%0 (Durgun)</span>
            <span>%25 (Hızlı)</span>
            <span>%50 (Hiper Büyüme)</span>
          </div>
        </div>

        {/* Slider 2: Discount Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[var(--paper)] font-semibold">İskonto Oranı (WACC):</span>
            <span className="font-bold text-[var(--verdigris)] font-mono text-sm">%{discountRate}</span>
          </div>
          <input
            type="range"
            min="8"
            max="22"
            step="1"
            value={discountRate}
            onChange={(e) => setDiscountRate(Number(e.target.value))}
            className="w-full accent-[var(--verdigris)] bg-[var(--ink-2)] rounded cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[var(--mist)]">
            <span>%8 (Düşük Risk)</span>
            <span>%15 (Standart)</span>
            <span>%22 (Yüksek Risk)</span>
          </div>
        </div>
      </div>

      {/* 3 Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        {/* Bear Case */}
        <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[rgba(201,124,124,0.3)] space-y-1">
          <span className="text-[10px] text-[var(--loss)] uppercase font-bold block">🔴 Ayı Senaryosu (Kötümser)</span>
          <span className="font-serif text-lg font-bold text-[var(--paper)] block">
            {bearFairValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[9px] text-[var(--mist)] block">Büyüme: %{Math.round(growthRate * 0.6)}</span>
        </div>

        {/* Base Case */}
        <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--brass)] space-y-1 shadow-md">
          <span className="text-[10px] text-[var(--brass)] uppercase font-bold block">🟡 Baz Senaryo (Hesaplanan)</span>
          <span className="font-serif text-xl font-bold text-[var(--brass)] block">
            {baseFairValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[9px] text-[var(--paper-dim)] block">Büyüme: %{growthRate} | WACC: %{discountRate}</span>
        </div>

        {/* Bull Case */}
        <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[rgba(91,140,123,0.3)] space-y-1">
          <span className="text-[10px] text-[var(--verdigris)] uppercase font-bold block">🟢 Boğa Senaryosu (İyimser)</span>
          <span className="font-serif text-lg font-bold text-[var(--paper)] block">
            {bullFairValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
          </span>
          <span className="text-[9px] text-[var(--mist)] block">Büyüme: %{Math.round(growthRate * 1.4)}</span>
        </div>
      </div>
    </div>
  );
}
