"use client";

import React, { useState, useMemo } from "react";
import { X, FileText, DollarSign, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { calculateForeignStockTax } from "@/lib/foreignTaxService";
import { useDefterStore } from "@/lib/store";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface ForeignTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForeignTaxModal({ isOpen, onClose }: ForeignTaxModalProps) {
  useEscapeKey(isOpen, onClose);
  const { indices } = useDefterStore();

  const [grossDividendUsd, setGrossDividendUsd] = useState<number>(2500);
  const usdRate = indices["USD/TRY"]?.price || 47.88;

  const taxResult = useMemo(() => {
    return calculateForeignStockTax(grossDividendUsd, usdRate);
  }, [grossDividendUsd, usdRate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
                Yabancı Hisse &amp; Eurobond Vergi Asistanı
              </h3>
              <p className="text-xs font-mono text-[var(--mist)]">
                GVK 86. Madde Beyanname Haddi &amp; W-8BEN Çifte Vergilendirme Modeli
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

        {/* Inputs */}
        <div className="space-y-3 font-mono text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[var(--mist)]">
              <span>Yıllık Brüt Yabancı Temettü Geliri ($):</span>
              <span className="font-bold text-[var(--brass)]">${grossDividendUsd.toLocaleString("en-US")}</span>
            </div>
            <input
              type="number"
              min={0}
              step={100}
              value={grossDividendUsd}
              onChange={(e) => setGrossDividendUsd(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--brass)] font-mono"
            />
          </div>

          <div className="flex justify-between text-[11px] text-[var(--mist)] pt-1">
            <span>Uygulanan Canlı Kur: <strong>1 $ = {usdRate.toFixed(2)} ₺</strong></span>
            <span>2026 Beyan Sınırı: <strong>{taxResult.declarationThresholdTry.toLocaleString("tr-TR")} ₺</strong></span>
          </div>
        </div>

        {/* 3 Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
              ABD Stopajı (%20)
            </span>
            <div className="text-base font-bold text-[var(--paper)]">
              ${taxResult.usWithholdingTaxUsd}
            </div>
            <span className="text-[10px] text-[var(--mist)]">
              ~{taxResult.foreignTaxCreditTry.toLocaleString("tr-TR")} ₺
            </span>
          </div>

          <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
              Beyan Durumu
            </span>
            <div className={`text-base font-bold ${taxResult.isDeclarationRequired ? "text-amber-400" : "text-emerald-400"}`}>
              {taxResult.isDeclarationRequired ? "Beyan Gerekir" : "İstisna / Muaf"}
            </div>
            <span className="text-[10px] text-[var(--mist)]">
              {taxResult.isDeclarationRequired ? "Sınır Aşıldı" : "Sınır Altı"}
            </span>
          </div>

          <div className="bg-[rgba(201,162,75,0.06)] border border-[var(--brass-dim)] rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-[var(--brass)] uppercase tracking-wider block">
              Ödenecek Ek Vergi
            </span>
            <div className="text-base font-bold text-[var(--brass)]">
              {taxResult.netPayableTaxTry.toLocaleString("tr-TR")} ₺
            </div>
            <span className="text-[10px] text-[var(--mist)]">
              Mahsup Sonrası
            </span>
          </div>
        </div>

        {/* Note */}
        <div className="text-xs font-mono text-[var(--mist)] bg-[var(--ink-3)]/60 border border-[var(--line)] p-3 rounded-lg flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
          <span>{taxResult.taxSummary}</span>
        </div>
      </div>
    </div>
  );
}
