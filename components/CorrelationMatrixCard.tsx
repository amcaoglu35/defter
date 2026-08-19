"use client";

import React, { useMemo } from "react";
import { Grid, Info } from "lucide-react";
import { Basket } from "@/lib/mockData";
import {
  selfCorrelationResult,
  getCorrelationColorClass,
  type CorrelationResult,
} from "@/lib/correlationService";

interface CorrelationMatrixCardProps {
  basket: Basket;
  /**
   * Opsiyonel: Dışarıdan hesaplanmış korelasyon matrisi.
   * Geçilmezse tüm çiftler "Veri Yok" olarak gösterilir.
   * Phase 4'te buradaki prop üst component'tan sağlanacak.
   */
  correlationResults?: CorrelationResult[];
}

export function CorrelationMatrixCard({ basket, correlationResults }: CorrelationMatrixCardProps) {
  const symbols = useMemo(() => {
    return basket.holdings.map((h) => h.companySymbol.toUpperCase()).slice(0, 6);
  }, [basket]);

  /**
   * n×n matris oluştur.
   * - Köşegen (i === j): 1.00 (self-correlation)
   * - Üst/Alt üçgen: props'tan gelen gerçek sonuç; yoksa "unavailable"
   */
  const matrix = useMemo(() => {
    const resultsMap = new Map<string, CorrelationResult>();
    if (correlationResults) {
      for (const r of correlationResults) {
        resultsMap.set(`${r.symbolA}:${r.symbolB}`, r);
        resultsMap.set(`${r.symbolB}:${r.symbolA}`, r);
      }
    }

    return symbols.map((symA) =>
      symbols.map((symB) => {
        if (symA === symB) return selfCorrelationResult(symA);
        const key = `${symA}:${symB}`;
        if (resultsMap.has(key)) return resultsMap.get(key)!;
        return {
          symbolA: symA,
          symbolB: symB,
          correlation: null,
          status: "unavailable" as const,
          dataPoints: 0,
          colorClass: "bg-[var(--ink-3)] text-[var(--mist)]",
        } satisfies CorrelationResult;
      })
    );
  }, [symbols, correlationResults]);

  if (symbols.length < 2) return null;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Varlıklar Arası Korelasyon Isı Haritası
            </h3>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              -1.00 (Ters Hareket / Koruma) ile +1.00 (Birlikte Hareket / Aynı Risk) — Gerçek Pearson
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 inline-block" /> Düşük (Çeşitlenmiş)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 inline-block" /> Yüksek (Aynı Risk)
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-[10px] text-[var(--mist)] font-normal">Varlık</th>
              {symbols.map((s) => (
                <th key={s} className="p-2 text-center text-[11px] font-bold text-[var(--paper)]">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {symbols.map((symRow, rowIdx) => (
              <tr key={symRow} className="border-t border-[var(--line)]/50">
                <td className="p-2 font-bold text-[var(--paper)] text-[11px] whitespace-nowrap">
                  {symRow}
                </td>
                {matrix[rowIdx].map((cell) => (
                  <td key={cell.symbolB} className="p-1 text-center">
                    <div
                      className={`py-1.5 px-2 rounded text-[11px] transition-transform hover:scale-105 ${getCorrelationColorClass(cell.correlation)}`}
                      title={
                        cell.correlation !== null
                          ? `${cell.symbolA} vs ${cell.symbolB}: ${cell.correlation.toFixed(2)} (${cell.dataPoints} gün)`
                          : `${cell.symbolA} vs ${cell.symbolB}: Veri Yok`
                      }
                    >
                      {cell.correlation !== null ? cell.correlation.toFixed(2) : "—"}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data availability note */}
      <div className="flex items-start gap-2 text-[9px] text-[var(--mist)] bg-[var(--ink-3)] border border-[var(--line)] rounded p-2">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          Korelasyonlar gerçek tarihsel günlük return serilerinden Pearson yöntemiyle hesaplanır.
          Veri yoksa <strong>—</strong> gösterilir; sektör tahmini kullanılmaz. (Faz 4&apos;te etkin)
        </span>
      </div>
    </div>
  );
}
