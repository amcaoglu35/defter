"use client";

import React, { useState, useMemo } from "react";
import { X, Calculator, TrendingUp, Sparkles, Calendar, Coins, ArrowRight, CheckCircle2 } from "lucide-react";
import { runDcaBacktest } from "@/lib/dcaBacktest";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface DcaBacktestModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  currency?: string;
  historicalData: Array<{ date: string; close: number }>;
}

export default function DcaBacktestModal({
  isOpen,
  onClose,
  symbol,
  currency = "₺",
  historicalData,
}: DcaBacktestModalProps) {
  useEscapeKey(isOpen, onClose);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(5000);

  const result = useMemo(() => {
    return runDcaBacktest(historicalData, monthlyAmount);
  }, [historicalData, monthlyAmount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
                DCA (Düzenli Alım) Geçmiş Backtest Simülatörü
              </h3>
              <p className="text-xs font-mono text-[var(--mist)]">
                {symbol} • Gerçek geçmiş fiyat serisi üzerinde düzenli alım simülasyonu
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

        {/* Input Controls */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between text-[var(--mist)]">
            <span>Aylık Düzenli Yatırım Tutarı:</span>
            <span className="font-bold text-[var(--brass)]">+{monthlyAmount.toLocaleString("tr-TR")} {currency} / ay</span>
          </div>
          <div className="flex items-center gap-2">
            {[1000, 2500, 5000, 10000, 20000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMonthlyAmount(val)}
                className={`flex-1 py-1.5 rounded text-xs border transition-all cursor-pointer ${
                  monthlyAmount === val
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)]"
                    : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)] hover:text-[var(--paper)]"
                }`}
              >
                {val >= 1000 ? `${val / 1000}k` : val} {currency}
              </button>
            ))}
          </div>
        </div>

        {!result ? (
          <div className="text-center py-8 text-xs font-mono text-[var(--mist)]">
            Bu varlık için yeterli geçmiş fiyat verisi bulunamadı.
          </div>
        ) : (
          <div className="space-y-4">
            {/* 3 Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-xl p-4 space-y-1">
                <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                  Toplam Yatırılan
                </span>
                <div className="text-lg font-bold text-[var(--paper)]">
                  {result.totalInvested.toLocaleString("tr-TR")} {currency}
                </div>
                <span className="text-[10px] text-[var(--mist)]">
                  {result.monthsCount} aylık dönem
                </span>
              </div>

              <div className="bg-[rgba(201,162,75,0.06)] border border-[var(--brass-dim)] rounded-xl p-4 space-y-1">
                <span className="text-[10px] text-[var(--brass)] uppercase tracking-wider block">
                  Ulaşılan Portföy Değeri
                </span>
                <div className="text-xl font-bold text-[var(--brass)]">
                  {result.finalPortfolioValue.toLocaleString("tr-TR")} {currency}
                </div>
                <span className="text-[10px] text-[var(--mist)]">
                  {result.accumulatedShares} Lot Birikti
                </span>
              </div>

              <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-xl p-4 space-y-1">
                <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                  Net Kâr / Getiri
                </span>
                <div
                  className={`text-lg font-bold ${
                    result.totalProfit >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                  }`}
                >
                  {result.totalProfit >= 0 ? "+" : ""}
                  {result.totalProfit.toLocaleString("tr-TR")} {currency}
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    result.profitPct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                  }`}
                >
                  %{result.profitPct} Kümülatif
                </span>
              </div>
            </div>

            {/* Average Cost Comparison */}
            <div className="bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-center justify-between text-xs font-mono text-[var(--mist)]">
              <span>Ortalama DCA Alış Maliyetiniz:</span>
              <strong className="text-[var(--paper)]">
                {result.averageCostPerShare} {currency} / Lot
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
