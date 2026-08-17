"use client";

import React, { useState, useMemo } from "react";
import { X, Sparkles, TrendingUp, ShieldAlert, BarChart3, Calculator, Award } from "lucide-react";
import { runMonteCarloSimulation } from "@/lib/monteCarlo";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface MonteCarloSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketName: string;
  initialValue: number;
  annualReturnPct?: number;
  annualVolPct?: number;
}

export default function MonteCarloSimulatorModal({
  isOpen,
  onClose,
  basketName,
  initialValue,
  annualReturnPct = 35,
  annualVolPct = 24,
}: MonteCarloSimulatorModalProps) {
  useEscapeKey(isOpen, onClose);

  const [years, setYears] = useState<number>(5);
  const [monthlyAddition, setMonthlyAddition] = useState<number>(5000);

  const simResult = useMemo(() => {
    return runMonteCarloSimulation(
      Math.max(1000, initialValue),
      monthlyAddition,
      annualReturnPct,
      annualVolPct,
      years,
      1000
    );
  }, [initialValue, monthlyAddition, annualReturnPct, annualVolPct, years]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
                Monte Carlo Portföy Olasılık Simülatörü
              </h3>
              <p className="text-xs font-mono text-[var(--mist)]">
                {basketName} • 1.000 Rastgele Piyasa Senaryosu (GBM Modeli)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-3)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[var(--mist)]">
              <span>Aylık Tasarruf Ekleme:</span>
              <span className="font-bold text-[var(--paper)]">+{monthlyAddition.toLocaleString("tr-TR")} ₺ / ay</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={monthlyAddition}
              onChange={(e) => setMonthlyAddition(Number(e.target.value))}
              className="w-full accent-[var(--brass)] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[var(--mist)]">
              <span>Zaman Ufku:</span>
              <span className="font-bold text-[var(--brass)]">{years} Yıl</span>
            </div>
            <div className="flex gap-2">
              {[1, 3, 5, 10].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYears(y)}
                  className={`flex-1 py-1.5 rounded text-xs border transition-all cursor-pointer ${
                    years === y
                      ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)]"
                      : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
                  }`}
                >
                  {y} Yıl
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Outcome Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          {/* 1. Bearish / Crisis */}
          <div className="bg-[var(--ink-3)] border border-rose-500/30 rounded-xl p-4 space-y-1 relative overflow-hidden">
            <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
              Kötümser / Kriz (%10)
            </div>
            <div className="text-lg font-bold text-[var(--paper)]">
              ~{simResult.percentile10.toLocaleString("tr-TR")} ₺
            </div>
            <p className="text-[10px] text-[var(--mist)] leading-snug">
              Piyasa dalgalanmaları ve düşük getirili kriz dönemlerinde beklenen taban servet.
            </p>
          </div>

          {/* 2. Expected Median */}
          <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-4 space-y-1 relative overflow-hidden bg-[rgba(201,162,75,0.05)]">
            <div className="text-[10px] text-[var(--brass)] font-bold uppercase tracking-wider">
              Beklenen Medyan (%50)
            </div>
            <div className="text-lg font-bold text-[var(--brass)]">
              ~{simResult.percentile50.toLocaleString("tr-TR")} ₺
            </div>
            <p className="text-[10px] text-[var(--mist)] leading-snug">
              En yüksek olasılıklı dengeli piyasa getiri patikası.
            </p>
          </div>

          {/* 3. Bullish Growth */}
          <div className="bg-[var(--ink-3)] border border-emerald-500/30 rounded-xl p-4 space-y-1 relative overflow-hidden">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              İyimser / Boğa (%90)
            </div>
            <div className="text-lg font-bold text-[var(--paper)]">
              ~{simResult.percentile90.toLocaleString("tr-TR")} ₺
            </div>
            <p className="text-[10px] text-[var(--mist)] leading-snug">
              Güçlü büyüme ve yüksek kâr marjı döngülerinde ulaşılabilecek tavan servet.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-center justify-between text-xs font-mono text-[var(--mist)]">
          <span>Başarı Olasılığı (Sermaye Katlama):</span>
          <strong className="text-[var(--verdigris)]">%{simResult.successProbability}</strong>
        </div>
      </div>
    </div>
  );
}
