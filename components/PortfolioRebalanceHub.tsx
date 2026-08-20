"use client";

import React, { useState, useMemo } from "react";
import {
  Scale,
  DollarSign,
  ArrowRightLeft,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";

interface PortfolioRebalanceHubProps {
  holdings: PortfolioAssetHolding[];
  totalValue: number;
}

export default function PortfolioRebalanceHub({
  holdings,
  totalValue,
}: PortfolioRebalanceHubProps) {
  const [dcaBudget, setDcaBudget] = useState(15000); // 15.000 TL yeni para ekleme
  const [targetWeights, setTargetWeights] = useState<Record<string, number>>(() => {
    // Varsayılan olarak mevcut ağırlıkları veya eşit dağılımı başlangıç hedefi yap
    const initial: Record<string, number> = {};
    if (holdings.length > 0) {
      const equalWeight = parseFloat((100 / holdings.length).toFixed(1));
      holdings.forEach((h) => {
        initial[h.symbol] = parseFloat(h.weightPct.toFixed(1)) || equalWeight;
      });
    }
    return initial;
  });

  const totalTargetWeight = useMemo(() => {
    return Object.values(targetWeights).reduce((a, b) => a + b, 0);
  }, [targetWeights]);

  // Rebalancing Hesabı
  const rebalancePlan = useMemo(() => {
    const newTotal = totalValue + dcaBudget;

    return holdings.map((h) => {
      const targetPct = targetWeights[h.symbol] || 0;
      const targetVal = (newTotal * targetPct) / 100;
      const diffVal = targetVal - h.totalCurrentValue;
      const price = h.currentPrice > 0 ? h.currentPrice : 1;
      const diffShares = Math.round(diffVal / price);

      return {
        ...h,
        targetPct,
        targetVal,
        diffVal,
        diffShares,
        action: diffVal > 50 ? "AL" : diffVal < -50 ? "SAT" : "TUT",
      };
    });
  }, [holdings, totalValue, dcaBudget, targetWeights]);

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 shadow-xs space-y-5">
      {/* Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Yeniden Dengeleme (Rebalance) & DCA Asistanı
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Hedef varlık ağırlıklarını belirleyin, sistem sapmaları tek tıkla al/sat lotlarına dönüştürsün.
            </p>
          </div>
        </div>

        {/* DCA Bütçe Girişi */}
        <div className="flex items-center gap-2 bg-[var(--ink)]/60 px-3 py-1.5 rounded-lg border border-[var(--line)]">
          <DollarSign className="w-4 h-4 text-[var(--brass)]" />
          <span className="text-xs text-[var(--muted)]">Maaş / Yeni Para:</span>
          <input
            type="number"
            value={dcaBudget}
            onChange={(e) => setDcaBudget(Math.max(0, Number(e.target.value)))}
            className="w-24 bg-transparent font-mono font-bold text-xs text-[var(--paper)] text-right outline-none focus:text-[var(--brass)]"
          />
          <span className="text-xs text-[var(--muted)]">₺</span>
        </div>
      </div>

      {/* Toplam Hedef Ağırlık Uyarısı */}
      <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-[var(--ink)]/30 rounded-lg border border-[var(--line)]">
        <span className="text-[var(--muted)]">Hedef Ağırlıklar Toplamı:</span>
        <span
          className={`font-mono font-bold ${
            Math.abs(totalTargetWeight - 100) < 0.5 ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          %{totalTargetWeight.toFixed(1)} / %100.0
          {Math.abs(totalTargetWeight - 100) >= 0.5 && " (Toplam %100 olmalıdır)"}
        </span>
      </div>

      {/* Rebalance Tablosu */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-[var(--muted)] border-b border-[var(--line)]/60 font-mono">
              <th className="pb-2">Varlık</th>
              <th className="pb-2 text-right">Mevcut Ağırlık</th>
              <th className="pb-2 text-right w-24">Hedef %</th>
              <th className="pb-2 text-right">Mevcut Değer</th>
              <th className="pb-2 text-right">Hedef Değer</th>
              <th className="pb-2 text-right">Fark (Tutar)</th>
              <th className="pb-2 text-right">Önerilen Talimat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]/30">
            {rebalancePlan.map((item) => (
              <tr key={item.symbol} className="hover:bg-[var(--ink)]/30 transition-colors">
                <td className="py-2.5 font-bold font-mono text-[var(--paper)]">
                  {item.symbol}
                </td>
                <td className="py-2.5 text-right font-mono text-[var(--muted)]">
                  %{item.weightPct.toFixed(1)}
                </td>
                <td className="py-2.5 text-right font-mono">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={targetWeights[item.symbol] || 0}
                    onChange={(e) =>
                      setTargetWeights((prev) => ({
                        ...prev,
                        [item.symbol]: Number(e.target.value),
                      }))
                    }
                    className="w-16 bg-[var(--ink)]/70 border border-[var(--line)] rounded px-1.5 py-0.5 text-right font-bold text-[var(--paper)] focus:border-[var(--brass)] outline-none"
                  />
                </td>
                <td className="py-2.5 text-right font-mono text-[var(--paper)]">
                  {item.totalCurrentValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                </td>
                <td className="py-2.5 text-right font-mono text-[var(--paper)]">
                  {item.targetVal.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                </td>
                <td
                  className={`py-2.5 text-right font-mono font-bold ${
                    item.diffVal > 0 ? "text-emerald-400" : item.diffVal < 0 ? "text-rose-400" : "text-[var(--muted)]"
                  }`}
                >
                  {item.diffVal > 0 ? "+" : ""}
                  {item.diffVal.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                </td>
                <td className="py-2.5 text-right font-mono">
                  {item.action === "AL" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                      <TrendingUp className="w-3 h-3" />
                      +{item.diffShares} Lot AL
                    </span>
                  )}
                  {item.action === "SAT" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold">
                      <TrendingDown className="w-3 h-3" />
                      {item.diffShares} Lot SAT
                    </span>
                  )}
                  {item.action === "TUT" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--line)]/50 text-[var(--muted)]">
                      <CheckCircle2 className="w-3 h-3" />
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
  );
}
