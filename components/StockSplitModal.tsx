"use client";

import React, { useState } from "react";
import {
  Scissors,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  TrendingUp,
  Percent,
} from "lucide-react";
import { Basket, BasketHolding } from "@/lib/mockData";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface StockSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  basket: Basket;
  initialHolding?: BasketHolding | null;
}

export function StockSplitModal({
  isOpen,
  onClose,
  basket,
  initialHolding,
}: StockSplitModalProps) {
  const { updateHolding } = useDefterStore();
  const { showToast } = useToast();

  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    initialHolding?.companySymbol || basket.holdings[0]?.companySymbol || ""
  );
  const [splitRatio, setSplitRatio] = useState<string>("100"); // %100 Bedelsiz (1'e 2)

  if (!isOpen) return null;

  const currentHolding = basket.holdings.find(
    (h) => h.companySymbol.toUpperCase() === selectedSymbol.toUpperCase()
  );

  const ratioNum = parseFloat(splitRatio) || 0;
  // %100 bedelsiz = çarpan 2.0 (1 + 100/100)
  const multiplier = 1 + ratioNum / 100;

  const currentQty = currentHolding ? currentHolding.quantity : 0;
  const currentCost = currentHolding ? currentHolding.avgCost : 0;

  const newQty = Math.round(currentQty * multiplier);
  const newCost = multiplier > 0 ? parseFloat((currentCost / multiplier).toFixed(2)) : currentCost;

  const handleApplySplit = () => {
    if (!currentHolding || multiplier <= 0 || currentQty <= 0) {
      showToast("Geçersiz bölünme oranı veya varlık bulunamadı.", "error");
      return;
    }

    const holdingId = currentHolding.id || currentHolding.companySymbol;
    updateHolding(basket.id, holdingId, {
      quantity: newQty,
      avgCost: newCost,
    });

    showToast(
      "Bölünme Başarıyla Uygulandı",
      `${selectedSymbol} için %${ratioNum} bölünme/bedelsiz uygulandı. Yeni Adet: ${newQty}, Yeni Maliyet: ${newCost.toFixed(2)} ₺`,
      "success"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        {/* Modal Başlık */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--line)] bg-[var(--ink-3)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                Bölünme &amp; Bedelsiz Düzeltme Aracı
              </h3>
              <p className="text-[11px] font-mono text-[var(--mist)]">
                Sermaye Artırımı / Stock Split Maliyet Dengeleyici
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-2)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal İçerik */}
        <div className="p-6 space-y-5">
          {/* Varlık Seçimi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[var(--mist)]">
              Düzeltilecek Varlık / Hisse:
            </label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-3)] border border-[var(--line)] text-sm font-mono text-[var(--paper)] focus:outline-none focus:border-[var(--brass)]"
            >
              {basket.holdings.map((h) => (
                <option key={h.companySymbol} value={h.companySymbol}>
                  {h.companySymbol} — Mevcut: {h.quantity} Adet ({h.avgCost.toFixed(2)} ₺)
                </option>
              ))}
            </select>
          </div>

          {/* Bedelsiz / Bölünme Oranı */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-[var(--mist)]">
                Bedelsiz Oranı (%):
              </label>
              <span className="text-[10px] font-mono text-[var(--brass)]">
                Örn: %100 (1&apos;e 2), %300 (1&apos;e 4)
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={splitRatio}
                onChange={(e) => setSplitRatio(e.target.value)}
                placeholder="100"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-3)] border border-[var(--line)] text-sm font-mono text-[var(--paper)] focus:outline-none focus:border-[var(--brass)] pl-9"
              />
              <Percent className="w-4 h-4 text-[var(--mist)] absolute left-3 top-3" />
            </div>

            {/* Hazır Oran Butonları */}
            <div className="flex items-center gap-1.5 pt-1">
              {["50", "100", "200", "300", "500"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSplitRatio(r)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    splitRatio === r
                      ? "bg-[var(--brass)] text-[var(--ink)] font-bold"
                      : "bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                  }`}
                >
                  %{r}
                </button>
              ))}
            </div>
          </div>

          {/* Canlı Simülasyon Kartı */}
          {currentHolding && (
            <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-3 font-mono">
              <span className="text-[10px] text-[var(--brass)] uppercase font-bold tracking-wider block">
                ⚡ Otomatik Maliyet &amp; Adet Simülasyonu
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Adet Karşılaştırması */}
                <div className="p-2.5 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-1">
                  <span className="text-[10px] text-[var(--mist)] block">Toplam Lot / Adet</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--mist)] line-through">{currentQty}</span>
                    <ArrowRight className="w-3 h-3 text-[var(--verdigris)]" />
                    <span className="font-bold text-[var(--paper)] text-sm">{newQty}</span>
                  </div>
                </div>

                {/* Ortalama Maliyet Karşılaştırması */}
                <div className="p-2.5 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-1">
                  <span className="text-[10px] text-[var(--mist)] block">Birim Ortalama Maliyet</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--mist)] line-through">{currentCost.toFixed(2)} ₺</span>
                    <ArrowRight className="w-3 h-3 text-[var(--verdigris)]" />
                    <span className="font-bold text-[var(--verdigris)] text-sm">{newCost.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-[var(--mist)] leading-relaxed">
                ℹ️ Toplam portföy sermayeniz ({(currentQty * currentCost).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺) korunur, sadece birim maliyetiniz ve hisse adediniz bölünme oranına göre matematiksel olarak güncellenir.
              </p>
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[var(--ink-3)] hover:bg-[var(--ink-2)] border border-[var(--line)] text-xs font-mono text-[var(--mist)] transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleApplySplit}
              className="px-5 py-2.5 rounded-xl bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-bold font-mono transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              <span>Bölünmeyi Uygula</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
