"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, Sparkles, TrendingUp, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";

export default function CompoundGrowthWidget() {
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [monthlyAddition, setMonthlyAddition] = useState<number>(10000);
  const [years, setYears] = useState<number>(5);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(35);

  // Future value calculation using standard monthly compound formula
  const projection = useMemo(() => {
    const monthlyRate = annualReturnRate / 100 / 12;
    const totalMonths = years * 12;

    // Compound on initial capital
    const fvInitial = initialCapital * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of regular monthly additions
    let fvMonthly = 0;
    if (monthlyRate > 0) {
      fvMonthly = monthlyAddition * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else {
      fvMonthly = monthlyAddition * totalMonths;
    }

    const totalFutureValue = Math.round(fvInitial + fvMonthly);
    const totalInvested = initialCapital + monthlyAddition * totalMonths;
    const totalGain = Math.max(0, totalFutureValue - totalInvested);
    const monthlyPassiveIncome = Math.round((totalFutureValue * 0.08) / 12); // Assuming ~8% dividend yield

    return {
      totalFutureValue,
      totalInvested,
      totalGain,
      monthlyPassiveIncome,
      gainMultiplier: totalInvested > 0 ? (totalFutureValue / totalInvested).toFixed(1) : "1.0",
    };
  }, [initialCapital, monthlyAddition, years, annualReturnRate]);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--paper)]">
              🧮 İnteraktif Bileşik Büyüme &amp; Gelecek Simülatörü
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Düzenli Tasarruf &amp; Bileşik Faiz ile Sermaye Projeksiyonu
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-[var(--brass)] bg-[var(--brass-glow)] px-3 py-1 rounded border border-[var(--brass-dim)] self-start sm:self-center">
          {years} Yıl Sonra: ~{projection.totalFutureValue.toLocaleString("tr-TR")} ₺
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Form Controls */}
        <div className="space-y-4 font-mono text-xs">
          {/* Initial Capital */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[var(--mist)]">
              <span>Başlangıç Sermayesi:</span>
              <span className="font-bold text-[var(--paper)]">{initialCapital.toLocaleString("tr-TR")} ₺</span>
            </div>
            <div className="flex items-center gap-2">
              {[25000, 50000, 100000, 250000, 500000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInitialCapital(val)}
                  className={`flex-1 py-1.5 rounded text-[11px] border transition-all cursor-pointer ${
                    initialCapital === val
                      ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)]"
                      : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)] hover:text-[var(--paper)]"
                  }`}
                >
                  {val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Addition */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[var(--mist)]">
              <span>Aylık Düzenli Ekleme:</span>
              <span className="font-bold text-[var(--brass)]">+{monthlyAddition.toLocaleString("tr-TR")} ₺ / ay</span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={monthlyAddition}
              onChange={(e) => setMonthlyAddition(Number(e.target.value))}
              className="w-full accent-[var(--brass)] cursor-pointer h-1.5 bg-[var(--ink-3)] rounded-lg appearance-none"
            />
          </div>

          {/* Target Years */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[var(--mist)]">
              <span>Yatırım Ufku (Süre):</span>
              <span className="font-bold text-[var(--paper)]">{years} Yıl</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 3, 5, 10, 15, 20].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYears(y)}
                  className={`flex-1 py-1.5 rounded text-[11px] border transition-all cursor-pointer ${
                    years === y
                      ? "bg-[var(--brass-glow)] text-[var(--brass)] font-bold border-[var(--brass)] shadow-inner"
                      : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)] hover:text-[var(--paper)]"
                  }`}
                >
                  {y} Yıl
                </button>
              ))}
            </div>
          </div>

          {/* Annual Return Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[var(--mist)]">
              <span>Tahmini Yıllık Getiri Oranı:</span>
              <span className="font-bold text-[var(--verdigris)]">%{annualReturnRate}</span>
            </div>
            <input
              type="range"
              min={15}
              max={65}
              step={5}
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
              className="w-full accent-[var(--verdigris)] cursor-pointer h-1.5 bg-[var(--ink-3)] rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Right Results Card */}
        <div className="bg-[var(--ink-3)] rounded-xl border border-[var(--line)] p-5 space-y-4 font-mono">
          <div className="border-b border-dashed border-[var(--line)] pb-3">
            <span className="text-[11px] text-[var(--mist)] uppercase tracking-wider block">
              {years} Yıl Sonra Tahmini Portföy
            </span>
            <div className="font-serif text-3xl font-bold text-[var(--brass)] mt-1">
              {projection.totalFutureValue.toLocaleString("tr-TR")} ₺
            </div>
            <span className="text-[11px] text-[var(--verdigris)] font-bold">
              ⚡ Toplam Yatırımın {projection.gainMultiplier}x Katı
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[var(--ink-2)] rounded-lg border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] block">Yatırılan Anapara</span>
              <span className="font-bold text-[var(--paper)] block mt-0.5">
                {projection.totalInvested.toLocaleString("tr-TR")} ₺
              </span>
            </div>

            <div className="p-3 bg-[var(--ink-2)] rounded-lg border border-[rgba(91,140,123,0.3)]">
              <span className="text-[10px] text-[var(--verdigris)] block">Bileşik Kâr / Kazanç</span>
              <span className="font-bold text-[var(--verdigris)] block mt-0.5">
                +{projection.totalGain.toLocaleString("tr-TR")} ₺
              </span>
            </div>
          </div>

          {/* Monthly Passive Dividend Income */}
          <div className="p-3 bg-[rgba(201,162,75,0.08)] border border-[rgba(201,162,75,0.3)] rounded-lg text-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--brass)] font-bold block">
              ☕ Aylık Tahmini Pasif Temettü Getirisi
            </span>
            <div className="text-base font-bold text-[var(--paper)]">
              ~{projection.monthlyPassiveIncome.toLocaleString("tr-TR")} ₺ / ay
            </div>
            <span className="text-[10px] text-[var(--mist)] block font-sans">
              (%8 yıllık temettü portföyü varsayımıyla)
            </span>
          </div>

          <Link
            href="/orakul?category=strategy&tab=wizard"
            className="w-full py-2.5 rounded bg-[var(--brass)] text-[var(--ink)] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#d9b35a] transition-all cursor-pointer shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bu Hedef İçin Sepet Sihirbazını Başlat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
