"use client";

import React, { useMemo } from "react";
import { X, Scale, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";
import { computePortfolioRebalancing } from "@/lib/rebalanceEngine";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface RebalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  basket: Basket;
  companies: Company[];
}

export default function RebalanceModal({
  isOpen,
  onClose,
  basket,
  companies,
}: RebalanceModalProps) {
  useEscapeKey(isOpen, onClose);

  const rebalanceData = useMemo(() => {
    return computePortfolioRebalancing(basket, companies);
  }, [basket, companies]);

  if (!isOpen) return null;

  const { recommendations, totalCurrentValue, isRebalanceNeeded } = rebalanceData;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
                  Portföy Yeniden Dengeleme Asistanı
                </h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isRebalanceNeeded
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {isRebalanceNeeded ? "⚠️ Dengeleme Önerilir" : "✅ Portföy Dengede"}
                </span>
              </div>
              <p className="text-xs font-mono text-[var(--mist)]">
                Hedeflenen varlık ağırlıkları ile cari piyasa değerleri arasındaki sapma optimizasyonu
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

        {/* Orders Table */}
        <div className="space-y-3">
          <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-xl overflow-hidden">
            <table className="w-full font-mono text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--line)] text-[10px] text-[var(--mist)] uppercase tracking-wider bg-[var(--ink)]">
                  <th className="p-3">Varlık</th>
                  <th className="p-3 text-right">Mevcut / Hedef %</th>
                  <th className="p-3 text-right">Sapma (Drift)</th>
                  <th className="p-3 text-center">Önerilen İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {recommendations.map((rec) => (
                  <tr key={rec.symbol} className="hover:bg-[var(--ink-2)] transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[var(--paper)]">{rec.symbol}</div>
                      <div className="text-[10px] text-[var(--mist)] truncate max-w-[120px]">{rec.name}</div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="text-[var(--paper)] font-semibold">%{rec.currentWeightPct}</div>
                      <div className="text-[10px] text-[var(--mist)]">Hedef: %{rec.targetWeightPct}</div>
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-bold ${
                          rec.driftPct > 2
                            ? "text-rose-400"
                            : rec.driftPct < -2
                            ? "text-emerald-400"
                            : "text-[var(--mist)]"
                        }`}
                      >
                        {rec.driftPct > 0 ? `+${rec.driftPct}%` : `${rec.driftPct}%`}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {rec.action === "AL" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                          +{rec.suggestedLots} Lot AL (~{Math.abs(rec.differenceValue).toLocaleString("tr-TR")} ₺)
                        </span>
                      ) : rec.action === "SAT" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                          -{rec.suggestedLots} Lot SAT (~{Math.abs(rec.differenceValue).toLocaleString("tr-TR")} ₺)
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--mist)] opacity-70">
                          Dengede
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="text-xs font-mono text-[var(--mist)] bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
          <span>
            Önerilen alım-satım işlemleri tamamlandığında portföy risk dağılımınız hedeflediğiniz orijinal katsayılara geri dönecektir.
          </span>
        </div>
      </div>
    </div>
  );
}
