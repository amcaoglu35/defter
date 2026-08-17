"use client";

import React, { useMemo } from "react";
import { Grid, Layers, ShieldCheck, Info } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";
import { estimateAssetCorrelation, getCorrelationColorClass } from "@/lib/correlationService";

interface CorrelationMatrixCardProps {
  basket: Basket;
  companies: Company[];
}

export function CorrelationMatrixCard({ basket, companies }: CorrelationMatrixCardProps) {
  const symbols = useMemo(() => {
    return basket.holdings.map((h) => h.companySymbol.toUpperCase()).slice(0, 6);
  }, [basket]);

  const matrix = useMemo(() => {
    return symbols.map((symA) => {
      const compA = companies.find((c) => c.symbol.toUpperCase() === symA);
      return symbols.map((symB) => {
        const compB = companies.find((c) => c.symbol.toUpperCase() === symB);
        const corr = estimateAssetCorrelation(compA, compB);
        return {
          symA,
          symB,
          corr,
          color: getCorrelationColorClass(corr),
        };
      });
    });
  }, [symbols, companies]);

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
              -1.00 (Ters Hareket / Koruma) ile +1.00 (Birlikte Hareket / Aynı Risk)
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
                {matrix[rowIdx].map((cell, colIdx) => (
                  <td key={cell.symB} className="p-1 text-center">
                    <div
                      className={`py-1.5 px-2 rounded text-[11px] transition-transform hover:scale-105 ${cell.color}`}
                      title={`${cell.symA} vs ${cell.symB}: Korelasyon ${cell.corr}`}
                    >
                      {cell.corr.toFixed(2)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
