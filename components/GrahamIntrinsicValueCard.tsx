"use client";

import React, { useMemo } from "react";
import { Scale, Calculator, Info, ShieldCheck, AlertTriangle } from "lucide-react";
import { Company } from "@/lib/mockData";

interface GrahamIntrinsicValueCardProps {
  company: Company;
}

export function GrahamIntrinsicValueCard({ company }: GrahamIntrinsicValueCardProps) {
  // Graham Intrinsic Value Formula: sqrt(22.5 * EPS * BVPS)
  // EPS = Price / P/E Ratio
  // BVPS = Price / P/B Ratio
  const grahamAnalysis = useMemo(() => {
    const { price, peRatio, pbRatio, currency } = company;

    if (!peRatio || !pbRatio || peRatio <= 0 || pbRatio <= 0 || price <= 0) {
      return null;
    }

    const eps = price / peRatio;
    const bvps = price / pbRatio;
    const innerProduct = 22.5 * eps * bvps;

    if (innerProduct <= 0) return null;

    const fairValue = Math.sqrt(innerProduct);
    const discountPct = ((fairValue - price) / price) * 100;
    const isUndervalued = discountPct >= 0;

    return {
      eps: parseFloat(eps.toFixed(2)),
      bvps: parseFloat(bvps.toFixed(2)),
      fairValue: parseFloat(fairValue.toFixed(2)),
      discountPct: parseFloat(discountPct.toFixed(1)),
      isUndervalued,
      currency: currency || "₺",
    };
  }, [company]);

  if (!grahamAnalysis) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-2 font-mono text-xs text-[var(--mist)]">
        <div className="flex items-center gap-2 text-[var(--paper)] font-bold">
          <Calculator className="w-4 h-4 text-[var(--brass)]" />
          <span>🧮 Benjamin Graham İçsel Değerleme (Fair Value)</span>
        </div>
        <p className="text-[11px]">
          F/K veya PD/DD çarpanı eksik veya negatif (net zarar) olduğu için Graham Adil Değerleme Modeli uygulanamıyor.
        </p>
      </div>
    );
  }

  const { eps, bvps, fairValue, discountPct, isUndervalued, currency } = grahamAnalysis;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🧮 Benjamin Graham İçsel Değerleme &amp; Adil Fiyat
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              &radic;(22.5 &times; HBK &times; DD) İskonto Modeli
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
            isUndervalued
              ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
              : "bg-[rgba(201,124,124,0.15)] text-[var(--loss)] border-[var(--loss)]"
          }`}
        >
          {isUndervalued ? `🎯 %${discountPct} İskontolu (Ucuz)` : `⚠️ %${Math.abs(discountPct)} Primli (Pahalı)`}
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Anlık Piyasa Fiyatı</span>
          <span className="font-bold text-[var(--paper)] text-sm block mt-0.5">
            {company.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--brass-dim)]">
          <span className="text-[10px] text-[var(--brass)] uppercase font-bold block">Graham Adil Değeri</span>
          <span className="font-bold text-[var(--brass)] text-sm block mt-0.5">
            {fairValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Hisse Başı Kâr (HBK)</span>
          <span className="font-bold text-[var(--paper-dim)] block mt-0.5">
            {eps.toLocaleString("tr-TR")} {currency}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Defter Değeri (DD)</span>
          <span className="font-bold text-[var(--paper-dim)] block mt-0.5">
            {bvps.toLocaleString("tr-TR")} {currency}
          </span>
        </div>
      </div>

      {/* Intrinsic Value Progress Gauge */}
      <div className="p-4 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--mist)]">Piyasa Fiyatı vs Graham Adil Değer Orantısı:</span>
          <span className="font-bold text-[var(--paper)]">
            {company.price} {currency} / {fairValue} {currency}
          </span>
        </div>

        <div className="w-full h-3 bg-[var(--ink-2)] rounded-full overflow-hidden border border-[var(--line)] flex">
          <div
            style={{
              width: `${Math.min(100, Math.max(10, Math.round((company.price / fairValue) * 100)))}%`,
            }}
            className={`h-full rounded-full transition-all duration-500 ${
              isUndervalued ? "bg-[var(--verdigris)]" : "bg-[var(--loss)]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
