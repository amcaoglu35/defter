"use client";

import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, ShieldCheck, Flame } from "lucide-react";
import { calculateRealReturn } from "@/lib/inflationService";

interface RealReturnBadgeProps {
  nominalReturnPct: number;
  annualInflationPct?: number;
}

export function RealReturnBadge({
  nominalReturnPct,
  annualInflationPct,
}: RealReturnBadgeProps) {
  const result = useMemo(() => {
    return calculateRealReturn(nominalReturnPct, annualInflationPct);
  }, [nominalReturnPct, annualInflationPct]);

  const { realReturnPct, isRealProfit, annualInflationPct: infl, summaryText } = result;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${
        isRealProfit
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }`}
      title={summaryText}
    >
      <span className="text-[10px] text-[var(--mist)] uppercase">Reel Kazanç:</span>
      <strong className="font-bold">
        {realReturnPct >= 0 ? `+${realReturnPct}%` : `${realReturnPct}%`}
      </strong>
      <span className="text-[9px] text-[var(--mist)] opacity-80">(TÜFE %{infl} düşüldü)</span>
    </div>
  );
}
