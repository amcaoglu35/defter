"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Grid, Info, Loader2 } from "lucide-react";
import { Basket } from "@/lib/mockData";
import {
  selfCorrelationResult,
  getCorrelationColorClass,
  computeCorrelationFromPriceSeries,
  type CorrelationResult,
} from "@/lib/correlationService";

interface CorrelationMatrixCardProps {
  basket: Basket;
  /**
   * Opsiyonel: Dışarıdan hesaplanmış korelasyon matrisi.
   * Geçilmezse bileşen otomatik olarak /api/prices/history'den çeker.
   */
  correlationResults?: CorrelationResult[];
}

export function CorrelationMatrixCard({ basket, correlationResults: externalResults }: CorrelationMatrixCardProps) {
  const [internalResults, setInternalResults] = useState<CorrelationResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const symbols = useMemo(() => {
    return basket.holdings.map((h) => h.companySymbol.toUpperCase()).slice(0, 6);
  }, [basket]);

  // Otomatik Gerçek Tarihsel Fiyat Serisi Çekme & Pearson Hesaplama
  useEffect(() => {
    if (externalResults && externalResults.length > 0) {
      setInternalResults(externalResults);
      return;
    }

    if (symbols.length < 2) return;

    let isMounted = true;
    const fetchHistoryAndCompute = async () => {
      setIsLoading(true);
      try {
        const seriesMap = new Map<string, Array<{ date: string; close: number }>>();

        await Promise.all(
          symbols.map(async (sym) => {
            try {
              const res = await fetch(`/api/prices/history?symbol=${encodeURIComponent(sym)}&range=1y`);
              if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.history) && data.history.length > 0) {
                  seriesMap.set(sym, data.history);
                }
              }
            } catch (err) {
              console.warn(`[Correlation] ${sym} history fetch error:`, err);
            }
          })
        );

        if (!isMounted) return;

        const results: CorrelationResult[] = [];
        for (let i = 0; i < symbols.length; i++) {
          for (let j = i + 1; j < symbols.length; j++) {
            const symA = symbols[i];
            const symB = symbols[j];
            const pA = seriesMap.get(symA) || [];
            const pB = seriesMap.get(symB) || [];

            if (pA.length >= 5 && pB.length >= 5) {
              const calc = computeCorrelationFromPriceSeries(symA, symB, pA, pB);
              results.push(calc);
            }
          }
        }

        setInternalResults(results);
      } catch (err) {
        console.warn("[Correlation calculation error]:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistoryAndCompute();

    return () => {
      isMounted = false;
    };
  }, [symbols, externalResults]);

  /**
   * n×n matris oluştur.
   * - Köşegen (i === j): 1.00 (self-correlation)
   * - Üst/Alt üçgen: props'tan veya API'den gelen gerçek sonuç; yoksa "unavailable"
   */
  const matrix = useMemo(() => {
    const activeResults = externalResults || internalResults;
    const resultsMap = new Map<string, CorrelationResult>();
    if (activeResults) {
      for (const r of activeResults) {
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
  }, [symbols, externalResults, internalResults]);

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
          {isLoading && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)] animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" /> Fiyat Serisi Hesaplanıyor...
            </span>
          )}
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
      <div className="flex items-start gap-2 text-[10px] text-[var(--mist)] bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 font-mono">
        <Info className="w-4 h-4 mt-0.5 text-[var(--brass)] shrink-0" />
        <span>
          Korelasyonlar <strong>/api/prices/history</strong> üzerinden çekilen 1 yıllık gerçek günlük getiri serileri ile <strong>Pearson Formülü</strong> kullanılarak canlı hesaplanır.
        </span>
      </div>
    </div>
  );
}
