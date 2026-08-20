"use client";

import React, { useMemo } from "react";
import { ShieldCheck, Coins, AlertTriangle, CheckCircle } from "lucide-react";
import { Company } from "@/lib/mockData";

interface DividendSafetyCardProps {
  company: Company;
}

export function DividendSafetyCard({ company }: DividendSafetyCardProps) {
  const dividendSafety = useMemo(() => {
    const { dividendYield, peRatio, currency } = company;

    if (!dividendYield || dividendYield <= 0 || !peRatio || peRatio <= 0) {
      return null;
    }

    // Payout Ratio % = (Dividend Yield * P/E Ratio)
    // Example: Yield 5% * P/E 10x = 50% Payout Ratio
    const payoutRatioPct = Math.min(100, Math.round(dividendYield * peRatio));
    const coverageRatio = parseFloat((100 / (payoutRatioPct || 1)).toFixed(2));

    let safetyVerdict = "MAKUL / DENGELİ";
    let safetyColor = "var(--brass)";
    let safetyDesc = "Şirket ürettiği net kârın makul bir bölümünü dağıtıyor. Kâr saklama oranı büyüme için yeterli.";

    if (payoutRatioPct <= 55) {
      safetyVerdict = "ÇOK GÜVENLİ (Yüksek Kapsama)";
      safetyColor = "var(--verdigris)";
      safetyDesc = "Kâr dağıtım oranı %55'in altında. Olası kâr düşüşlerinde dahi temettü kesintisi riski oldukça düşük.";
    } else if (payoutRatioPct > 80) {
      safetyVerdict = "YÜKSEK BASKI / RİSKLİ";
      safetyColor = "var(--loss)";
      safetyDesc = "Şirket kârının %80'inden fazlasını temettü olarak dağıtıyor. Kârda yaşanabilecek daralmalarda temettü kesilebilir.";
    }

    return {
      payoutRatioPct,
      coverageRatio,
      safetyVerdict,
      safetyColor,
      safetyDesc,
      yield: dividendYield,
      currency: currency || "₺",
    };
  }, [company]);

  if (!dividendSafety) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 font-mono text-xs text-[var(--mist)] space-y-2">
        <div className="flex items-center gap-2 text-[var(--paper)] font-bold">
          <ShieldCheck className="w-4 h-4 text-[var(--brass)]" />
          <span>🛡️ Temettü Güvenliği &amp; Kâr Dağıtım Oranı (Payout Ratio)</span>
        </div>
        <p className="text-[11px]">
          {company.symbol} kâr payı dağıtmadığı için temettü güvenlik metriği hesaplanamıyor.
        </p>
      </div>
    );
  }

  const { payoutRatioPct, coverageRatio, safetyVerdict, safetyColor, safetyDesc, yield: divYield } = dividendSafety;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] flex items-center justify-center text-[var(--verdigris)] shadow-inner">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🛡️ Temettü Güvenliği &amp; Kâr Dağıtım Oranı (Payout Ratio)
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Seeking Alpha Dividend Safety &amp; Coverage Meter
            </p>
          </div>
        </div>

        <span
          className="px-3 py-1 rounded text-xs font-bold border"
          style={{
            color: safetyColor,
            borderColor: safetyColor,
            backgroundColor: "rgba(18,21,28,0.6)",
          }}
        >
          {safetyVerdict}
        </span>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Kâr Dağıtım Oranı (Payout Ratio)</span>
          <span className="font-bold text-[var(--paper)] text-sm block mt-0.5">
            %{payoutRatioPct}
          </span>
          <span className="text-[9px] text-[var(--mist)] block">Kârın Dağıtılan Kısmı</span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Temettü Kapsama Kat sayısı</span>
          <span className="font-bold text-[var(--brass)] text-sm block mt-0.5">
            {coverageRatio}x
          </span>
          <span className="text-[9px] text-[var(--mist)] block">Kâr / Dağıtılan Tutar</span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Anlık Temettü Verimi</span>
          <span className="font-bold text-[var(--verdigris)] text-sm block mt-0.5">
            %{divYield}
          </span>
          <span className="text-[9px] text-[var(--mist)] block">Yıllık Oran</span>
        </div>
      </div>

      {/* Visual Payout Gauge Bar */}
      <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[var(--mist)]">Kâr Dağıtım Yüzdesi Çubuğu:</span>
          <span className="font-bold text-[var(--paper)]">%{payoutRatioPct} Dağıtılıyor / %{100 - payoutRatioPct} Saklanıyor</span>
        </div>

        <div className="w-full h-3 bg-[var(--ink-2)] rounded-full overflow-hidden border border-[var(--line)] flex">
          <div
            style={{ width: `${payoutRatioPct}%`, backgroundColor: safetyColor }}
            className="h-full rounded-full transition-all duration-500"
          />
        </div>

        <p className="text-[11px] text-[var(--paper-dim)] pt-1 font-sans leading-relaxed">
          {safetyDesc}
        </p>
      </div>
    </div>
  );
}
