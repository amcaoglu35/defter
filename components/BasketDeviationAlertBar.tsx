"use client";

import React, { useMemo } from "react";
import { Scale, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Basket } from "@/lib/mockData";

interface BasketDeviationAlertBarProps {
  basket: Basket;
  onOpenRebalanceModal?: () => void;
}

export function BasketDeviationAlertBar({ basket, onOpenRebalanceModal }: BasketDeviationAlertBarProps) {
  const deviationAnalysis = useMemo(() => {
    if (!basket.holdings || basket.holdings.length === 0) {
      return { totalDeviation: 0, status: "IDEAL", color: "var(--verdigris)", text: "Sepet henüz boş." };
    }

    let deviationSum = 0;
    basket.holdings.forEach((h) => {
      const targetW = h.targetWeightPercent ?? h.weightPercent;
      deviationSum += Math.abs(h.weightPercent - targetW);
    });

    const totalDeviation = parseFloat(deviationSum.toFixed(1));

    if (totalDeviation < 3) {
      return {
        totalDeviation,
        status: "IDEAL",
        color: "var(--verdigris)",
        badge: "🟢 AĞIRLIKLAR DENGELİ",
        text: "Tüm varlıklar hedef ağırlık sınırlarında. Yeniden dengeleme gerekmiyor.",
      };
    } else if (totalDeviation < 10) {
      return {
        totalDeviation,
        status: "HAFİF SAPMA",
        color: "var(--brass)",
        badge: "🟡 HAFİF SAPMA",
        text: `Portföyde %${totalDeviation} oranında ağırlık kayması var. Takip edilebilir.`,
      };
    } else {
      return {
        totalDeviation,
        status: "YÜKSEK SAPMA",
        color: "var(--loss)",
        badge: "🔴 REBALANCE GEREKLİ",
        text: `Portföyde %${totalDeviation} yüksek ağırlık sapması tespit edildi! Yeniden dengeleme yapılması önerilir.`,
      };
    }
  }, [basket]);

  const { totalDeviation, status, color, badge, text } = deviationAnalysis;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs shadow-md">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border"
          style={{
            borderColor: color,
            color: color,
            backgroundColor: "rgba(18,21,28,0.6)",
          }}
        >
          <Scale className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--paper)]">Hedef Ağırlık Sapma Göstergesi:</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded border"
              style={{
                borderColor: color,
                color: color,
                backgroundColor: "rgba(18,21,28,0.6)",
              }}
            >
              {badge}
            </span>
          </div>
          <p className="text-[11px] text-[var(--mist)] mt-0.5">{text}</p>
        </div>
      </div>

      {onOpenRebalanceModal && totalDeviation >= 3 && (
        <button
          onClick={onOpenRebalanceModal}
          className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer shadow"
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Yeniden Dengele</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
