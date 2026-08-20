"use client";

import React, { useMemo } from "react";
import { Network, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";
import { calculateCorrelationMatrix } from "@/lib/quantEngine";

interface PortfolioCorrelationMatrixProps {
  holdings: PortfolioAssetHolding[];
}

export default function PortfolioCorrelationMatrix({
  holdings,
}: PortfolioCorrelationMatrixProps) {
  const quantAssets = useMemo(() => {
    return holdings.map((h) => ({
      symbol: h.symbol,
      name: h.name,
      category: h.category,
      sector: h.sector,
      totalCurrentValue: h.totalCurrentValue,
      weightPct: h.weightPct,
      unrealizedProfitLossPct: h.unrealizedProfitLossPct,
      currency: h.currency,
      dailyChangePct: h.change24h,
    }));
  }, [holdings]);

  const { symbols, matrix, averageCorrelation, isPseudoDiversified } = useMemo(() => {
    return calculateCorrelationMatrix(quantAssets);
  }, [quantAssets]);

  if (symbols.length < 2) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-8 text-center space-y-3 shadow-sm">
        <Network className="w-10 h-10 text-[var(--mist)] mx-auto opacity-40" />
        <p className="text-sm font-mono text-[var(--paper)]">
          Korelasyon matrisinin hesaplanabilmesi için portföyünüzde en az 2 farklı varlık bulunmalıdır.
        </p>
      </div>
    );
  }

  // Korelasyon rengi belirleyici (-1.0 ile +1.0)
  const getCorrCellColor = (val: number, isDiagonal: boolean) => {
    if (isDiagonal) return "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]";
    if (val >= 0.8) return "bg-rose-950/70 border-rose-600/40 text-rose-300 font-bold";
    if (val >= 0.6) return "bg-amber-950/60 border-amber-600/30 text-amber-300";
    if (val >= 0.3) return "bg-yellow-950/30 border-yellow-700/20 text-yellow-200/90";
    if (val >= 0.0) return "bg-slate-900/60 border-slate-700/30 text-[var(--paper-dim)]";
    return "bg-emerald-950/60 border-emerald-600/40 text-emerald-300 font-bold"; // Negatif korelasyon (Kalkan)
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-5">
      {/* Başlık & Çeşitlendirme Durumu */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Varlık Korelasyon Isı Matrisi (Pearson $r$)
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Varlıkların birlikte hareket etme katsayıları ($-1.00$ ile $+1.00$ arası).
            </p>
          </div>
        </div>

        {/* Ortalama Korelasyon Rozeti */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] text-right">
            <span className="text-[10px] font-mono text-[var(--mist)] block">Ortalama Portföy Korelasyonu</span>
            <span
              className={`font-mono text-sm font-bold ${
                averageCorrelation > 0.7
                  ? "text-rose-400"
                  : averageCorrelation > 0.4
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {averageCorrelation > 0 ? "+" : ""}
              {averageCorrelation.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Sahte Çeşitlendirme / Sağlık Uyarısı */}
      {isPseudoDiversified ? (
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-600/30 flex items-start gap-3 text-xs font-mono text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <strong className="font-bold block text-rose-200">
              ⚠️ Yüksek Korelasyon Uyarısı (Sahte Çeşitlendirme Tuzağı)
            </strong>
            Portföyünüzdeki hisselerin korelasyonu çok yüksek (%{Math.round(averageCorrelation * 100)}). Şirketler farklı olsa da piyasa düşüşlerinde neredeyse aynı oranda birlikte değer kaybedebilirler. Altın veya döviz varlıkları eklemek korelasyonu düşürür.
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-600/20 flex items-center gap-2.5 text-xs font-mono text-emerald-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            Portföyünüzün korelasyon dengesi sağlıklı. Farklı sektörler ve varlık sınıfları birbirini dengeleyerek riski dağıtıyor.
          </span>
        </div>
      )}

      {/* İnteraktif Isı Tablosu */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-[var(--mist)] border-b border-[var(--line)]">
                Varlık
              </th>
              {symbols.map((sym) => (
                <th
                  key={sym}
                  className="p-2 text-center text-[var(--paper)] font-bold border-b border-[var(--line)]"
                >
                  {sym}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {symbols.map((rowSym, rowIdx) => (
              <tr key={rowSym} className="hover:bg-[var(--ink-3)]/40 transition-colors">
                <td className="p-2 font-bold text-[var(--paper)] border-r border-[var(--line)]">
                  {rowSym}
                </td>
                {symbols.map((colSym, colIdx) => {
                  const val = matrix[rowIdx]?.[colIdx] ?? (rowIdx === colIdx ? 1 : 0);
                  const isDiag = rowIdx === colIdx;
                  return (
                    <td key={colSym} className="p-1 text-center">
                      <div
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all ${getCorrCellColor(
                          val,
                          isDiag
                        )}`}
                        title={`${rowSym} & ${colSym}: Korelasyon ${val}`}
                      >
                        {isDiag ? "1.00" : (val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Renk Skalası Lejandı */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--mist)] pt-2 border-t border-[var(--line)]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-700 inline-block" />
            &lt; 0.00 (Zıt / Kalkan)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block" />
            0.00 - 0.30 (Bağımsız)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-700 inline-block" />
            0.30 - 0.70 (Orta Korele)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-700 inline-block" />
            &gt; 0.70 (Aynı Yönde / Yüksek Risk)
          </span>
        </div>
        <span className="text-[var(--brass)]">
          İdeal Çeşitlendirme: &lt; +0.40
        </span>
      </div>
    </div>
  );
}
