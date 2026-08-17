"use client";

import React, { useState } from "react";
import { Printer, Download, X, FileText, Check, Shield } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Basket } from "@/lib/mockData";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

import { exportBasketToPdf } from "@/lib/exportUtils";

interface PrintReportModalProps {
  basket?: Basket;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintReportModal({ basket, isOpen, onClose }: PrintReportModalProps) {
  useEscapeKey(isOpen, onClose);
  const { baskets, companies, userSettings } = useDefterStore();

  if (!isOpen) return null;

  const activeBasket = basket || (baskets.length > 0 ? baskets[0] : null);
  const totalPortfolioValue = baskets.reduce((acc, b) => acc + b.totalValue, 0);
  const totalPortfolioCost = baskets.reduce((acc, b) => acc + b.totalCost, 0);
  const totalPortfolioProfitPct = totalPortfolioCost > 0 
    ? Number((((totalPortfolioValue - totalPortfolioCost) / totalPortfolioCost) * 100).toFixed(1))
    : 0;

  const displayProfitPct = activeBasket ? activeBasket.totalProfitPercent : totalPortfolioProfitPct;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (activeBasket) {
      exportBasketToPdf(activeBasket, companies, userSettings?.userName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--brass)]" />
            <h3 className="font-serif text-xl font-bold text-[var(--paper)]">
              {activeBasket ? `${activeBasket.name} — Portföy Raporu` : "Genel Portföy Raporu"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Report Preview Box */}
        <div className="p-6 bg-white text-[#12151c] rounded-xl border border-gray-200 shadow-inner space-y-6 font-sans">
          {/* Report Header */}
          <div className="flex items-center justify-between border-b-2 border-[#12151c] pb-4">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#12151c]">
                DEFTER PORTFÖY RAPORU
              </h1>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Sahibi: {userSettings?.userName || "Defter Sahibi"} • Tarih: {new Date().toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                RESMİ KÜTÜK ÖZETİ
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center font-mono">
            <div>
              <div className="text-[11px] text-gray-500 uppercase">Sepet Değeri</div>
              <div className="text-lg font-bold text-gray-900">
                {activeBasket ? activeBasket.totalValue.toLocaleString("tr-TR") : totalPortfolioValue.toLocaleString("tr-TR")} ₺
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase">Kümülatif Getiri</div>
              <div className={`text-lg font-bold ${
                displayProfitPct >= 0 ? "text-emerald-700" : "text-rose-700"
              }`}>
                {displayProfitPct >= 0 ? "+" : ""}
                {displayProfitPct}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase">Varlık Sayısı</div>
              <div className="text-lg font-bold text-gray-900">
                {activeBasket ? activeBasket.holdings.length : companies.length} Adet
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          {activeBasket && activeBasket.holdings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-mono text-xs text-gray-700 uppercase font-bold tracking-wider">
                Varlık Dağılımı
              </h4>
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-600">
                    <th className="py-2">Varlık</th>
                    <th className="py-2 text-right">Adet</th>
                    <th className="py-2 text-right">Maliyet</th>
                    <th className="py-2 text-right">Anlık Değer</th>
                    <th className="py-2 text-right">Ağırlık</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeBasket.holdings.map((h) => (
                    <tr key={h.companySymbol}>
                      <td className="py-2 font-bold text-gray-900">{h.companySymbol}</td>
                      <td className="py-2 text-right">{h.quantity} Lot</td>
                      <td className="py-2 text-right">{h.avgCost.toFixed(2)} ₺</td>
                      <td className="py-2 text-right">{(h.quantity * (h.currentPrice || h.avgCost)).toLocaleString("tr-TR")} ₺</td>
                      <td className="py-2 text-right font-bold text-amber-800">%{h.weightPercent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-[10px] text-gray-400 font-mono">
              Bu rapor Defter Kişisel Portföy Kütüğü tarafından yerel olarak üretilmiştir. Yatırım tavsiyesi içermez.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] text-xs font-mono px-4 py-2.5 rounded-lg cursor-pointer"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-3)] text-xs font-mono px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Yazdır</span>
          </button>
          {activeBasket && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>PDF Raporu İndir (.pdf)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
