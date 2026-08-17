"use client";

import React, { useState, useMemo } from "react";
import { Calculator, ShieldCheck, TrendingUp, DollarSign, Target, Award } from "lucide-react";

export function IpoStrategyCalculator() {
  const [lotCount, setLotCount] = useState<number>(25);
  const [ipoPrice, setIpoPrice] = useState<number>(45.0);

  const initialInvestment = lotCount * ipoPrice;

  // Compute 10-day ceiling progression (+10% compounded daily)
  const ceilingDays = useMemo(() => {
    const list: Array<{
      day: number;
      price: number;
      totalValue: number;
      totalProfit: number;
      profitPct: number;
      lotsToSellToRecoverCapital: number;
      remainingFreeLots: number;
    }> = [];

    let currentPrice = ipoPrice;

    for (let day = 1; day <= 10; day++) {
      currentPrice = Number((currentPrice * 1.10).toFixed(2));
      const totalVal = Math.round(currentPrice * lotCount);
      const profit = totalVal - initialInvestment;
      const profitPct = Number(((profit / initialInvestment) * 100).toFixed(1));

      // How many shares must be sold to recover the original 100% investment?
      const lotsToRecover = Math.min(lotCount, Math.ceil(initialInvestment / currentPrice));
      const freeLots = Math.max(0, lotCount - lotsToRecover);

      list.push({
        day,
        price: currentPrice,
        totalValue: totalVal,
        totalProfit: profit,
        profitPct,
        lotsToSellToRecoverCapital: lotsToRecover,
        remainingFreeLots: freeLots,
      });
    }

    return list;
  }, [lotCount, ipoPrice, initialInvestment]);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-5 sm:p-6 space-y-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Halka Arz Maliyet Sıfırlama &amp; Kâr Realizasyon Stratejisi
            </h3>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Ana parayı cebe koyup kalan hisseleri &quot;sıfır maliyetle&quot; ömür boyu taşıma simülatörü
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-[var(--brass)] bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)] self-start sm:self-center">
          Yatırılan Ana Para: <strong>{initialInvestment.toLocaleString("tr-TR")} ₺</strong>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[var(--mist)]">
            <span>Dağıtılan Lot Miktarı:</span>
            <span className="font-bold text-[var(--paper)]">{lotCount} Lot</span>
          </div>
          <input
            type="number"
            min={1}
            max={1000}
            value={lotCount}
            onChange={(e) => setLotCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--brass)] font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[var(--mist)]">
            <span>Halka Arz Fiyatı:</span>
            <span className="font-bold text-[var(--paper)]">{ipoPrice} ₺</span>
          </div>
          <input
            type="number"
            min={1}
            step={0.5}
            value={ipoPrice}
            onChange={(e) => setIpoPrice(Math.max(0.1, parseFloat(e.target.value) || 1))}
            className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--brass)] font-mono"
          />
        </div>
      </div>

      {/* Tavan Strategy Table */}
      <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-xl overflow-x-auto">
        <table className="w-full font-mono text-xs text-left">
          <thead>
            <tr className="border-b border-[var(--line)] text-[10px] text-[var(--mist)] uppercase tracking-wider bg-[var(--ink)]">
              <th className="p-3">Tavan Günü</th>
              <th className="p-3 text-right">Hisse Fiyatı</th>
              <th className="p-3 text-right">Toplam Değer</th>
              <th className="p-3 text-right">Net Kâr (%)</th>
              <th className="p-3 text-center">🎯 Maliyet Sıfırlama (Ana Para İadesi)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {ceilingDays.map((c) => (
              <tr key={c.day} className="hover:bg-[var(--ink-2)] transition-colors">
                <td className="p-3 font-bold text-[var(--paper)]">
                  {c.day}. Tavan (+%{Math.round(c.profitPct)})
                </td>
                <td className="p-3 text-right text-[var(--paper)]">
                  {c.price} ₺
                </td>
                <td className="p-3 text-right text-[var(--brass)] font-semibold">
                  {c.totalValue.toLocaleString("tr-TR")} ₺
                </td>
                <td className="p-3 text-right font-bold text-[var(--verdigris)]">
                  +{c.totalProfit.toLocaleString("tr-TR")} ₺
                </td>
                <td className="p-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[rgba(201,162,75,0.12)] text-[var(--brass)] border border-[var(--brass-dim)] text-[11px]">
                    <strong>{c.lotsToSellToRecoverCapital} Lot</strong> sat → <strong>{c.remainingFreeLots} Lot</strong> bedavaya kalsın!
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Strategic Note */}
      <div className="text-xs font-mono text-[var(--mist)] bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
        <span>
          <strong>Maliyet Sıfırlama Kuralı:</strong> Örneğin 5. veya 6. tavanda tablodaki önerilen lot miktarını sattığınızda, cebinizden çıkan anaparanın %100&apos;ünü nakit olarak geri alırsınız. Kalan bedava lotlar ise portföyünüzde sıfır riskle sonsuza kadar büyümeye devam eder.
        </span>
      </div>
    </div>
  );
}
