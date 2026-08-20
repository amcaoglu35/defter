"use client";

import React, { useMemo } from "react";
import { Target, Info } from "lucide-react";
import { Company } from "@/lib/mockData";
import { CompanyDiagnosisReport } from "@/lib/aiService";

interface AiAnalystTargetGaugeProps {
  company: Company;
  report?: CompanyDiagnosisReport | null;
}

export function AiAnalystTargetGauge({ company, report }: AiAnalystTargetGaugeProps) {
  const targetMetrics = useMemo(() => {
    const price = company.price || 0;
    const targetPrice = report?.targetPrice12M;

    if (price <= 0 || !targetPrice || targetPrice <= 0) {
      return {
        hasTarget: false,
        price,
        lowTarget: null,
        avgTarget: null,
        highTarget: null,
        upsidePct: null,
        isPositiveUpside: false,
        currency: company.currency || "₺",
      };
    }

    const avgTarget = parseFloat(targetPrice.toFixed(2));
    const lowTarget = parseFloat((targetPrice * 0.85).toFixed(2));
    const highTarget = parseFloat((targetPrice * 1.15).toFixed(2));
    const upsidePct = parseFloat((((avgTarget - price) / price) * 100).toFixed(1));
    const isPositiveUpside = upsidePct >= 0;

    return {
      hasTarget: true,
      price,
      lowTarget,
      avgTarget,
      highTarget,
      upsidePct,
      isPositiveUpside,
      currency: company.currency || "₺",
    };
  }, [company, report]);

  const { hasTarget, price, lowTarget, avgTarget, highTarget, upsidePct, isPositiveUpside, currency } = targetMetrics;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🎯 AI Analist 12 Aylık Hedef Fiyat &amp; Konsensüs İbresi
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Kurumsal Konsensüs &amp; Hedef Fiyat Takibi
            </p>
          </div>
        </div>

        {hasTarget && upsidePct !== null ? (
          <span
            className={`px-3 py-1 rounded text-xs font-bold border ${
              isPositiveUpside
                ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                : "bg-[rgba(201,124,124,0.15)] text-[var(--loss)] border-[var(--loss)]"
            }`}
          >
            {isPositiveUpside ? `+%${upsidePct} Potansiyel Prim` : `-%${Math.abs(upsidePct)} İskonto`}
          </span>
        ) : (
          <span className="px-3 py-1 rounded text-xs font-mono text-[var(--mist)] border border-[var(--line)] bg-[var(--ink-3)]">
            Analist Takibi Yok
          </span>
        )}
      </div>

      {hasTarget && lowTarget !== null && avgTarget !== null && highTarget !== null ? (
        <>
          {/* Target Price Ranges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] uppercase block">Anlık Piyasa Fiyatı</span>
              <span className="font-serif text-base font-bold text-[var(--paper)] block mt-0.5">
                {price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
              </span>
            </div>

            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
              <span className="text-[10px] text-[var(--loss)] uppercase block">En Düşük Hedef</span>
              <span className="font-serif text-base font-bold text-[var(--paper-dim)] block mt-0.5">
                {lowTarget.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
              </span>
            </div>

            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--brass)] shadow-md">
              <span className="text-[10px] text-[var(--brass)] uppercase font-bold block">12M Ortalama Hedef</span>
              <span className="font-serif text-lg font-bold text-[var(--brass)] block mt-0.5">
                {avgTarget.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
              </span>
            </div>

            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--verdigris)]">
              <span className="text-[10px] text-[var(--verdigris)] uppercase block">En Yüksek Hedef</span>
              <span className="font-serif text-base font-bold text-[var(--verdigris)] block mt-0.5">
                {highTarget.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {currency}
              </span>
            </div>
          </div>

          {/* Progress Gauge Bar */}
          <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--mist)]">Hedef Fiyata Yakınlık Çubuğu:</span>
              <span className="font-bold text-[var(--paper)]">
                %{Math.max(0, Math.min(100, Math.round(((price - lowTarget) / (highTarget - lowTarget || 1)) * 100)))} Seviyesinde
              </span>
            </div>

            <div className="w-full h-2.5 bg-[var(--ink-2)] rounded-full overflow-hidden border border-[var(--line)] flex">
              <div
                className="h-full bg-[var(--verdigris)] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(5, Math.min(100, ((price - lowTarget) / (highTarget - lowTarget || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg flex items-center gap-2.5 text-[var(--mist)] font-mono text-xs">
          <Info className="w-4 h-4 text-[var(--brass)] shrink-0" />
          <span>
            Bu şirket için kurum analist hedefi veya konsensüs fiyat tahmini henüz yayınlanmamıştır.
          </span>
        </div>
      )}
    </div>
  );
}
