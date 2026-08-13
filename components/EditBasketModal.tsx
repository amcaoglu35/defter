"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Sliders, Check, Sparkles, DollarSign } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Basket, Company } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import CompanyCombobox from "@/components/CompanyCombobox";

interface EditBasketModalProps {
  basket: Basket;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditBasketModal({
  basket,
  isOpen,
  onClose,
}: EditBasketModalProps) {
  const {
    companies,
    updateBasket,
    addHoldingToBasket,
    removeHoldingFromBasket,
    updateHolding,
  } = useDefterStore();
  const { showToast } = useToast();

  const [selectedAddSymbol, setSelectedAddSymbol] = useState(
    companies[0]?.symbol || ""
  );
  const [addQty, setAddQty] = useState("10");
  const [addWeight, setAddWeight] = useState("15");

  useEffect(() => {
    if (companies.length > 0) {
      if (!selectedAddSymbol || !companies.some((c) => c.symbol === selectedAddSymbol)) {
        setSelectedAddSymbol(companies[0].symbol);
      }
    }
  }, [companies, selectedAddSymbol]);

  if (!isOpen) return null;

  const currentCo = companies.find((c) => c.symbol === selectedAddSymbol);
  const parsedQty = parseFloat(addQty) || 0;
  const estimatedCost = currentCo ? parsedQty * currentCo.price : 0;

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCo || parsedQty <= 0) return;

    addHoldingToBasket(basket.id, {
      companySymbol: currentCo.symbol,
      quantity: parsedQty,
      weightPercent: parseFloat(addWeight) || 15,
      avgCost: currentCo.price,
      currentPrice: currentCo.price,
    });

    showToast(
      "Varlık Eklendi",
      `${currentCo.symbol} (${parsedQty} Lot) ${basket.name} sepetine eklendi.`,
      "success"
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Head */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[var(--paper)]">
              {basket.name} — Varlık Yönetimi
            </h3>
            <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
              Sepet içi hisse ekle, çıkar ve ağırlık yüzdelerini düzenle.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Holdings List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
              Mevcut Varlıklar ({basket.holdings.length})
            </h4>
            <span className="font-mono text-xs text-[var(--mist)]">
              Toplam Değer: {basket.totalValue.toLocaleString("tr-TR")} ₺
            </span>
          </div>

          {basket.holdings.length === 0 ? (
            <p className="text-xs text-[var(--mist)] py-4 text-center border border-dashed border-[var(--line)] rounded">
              Bu sepette henüz varlık yok. Aşağıdan arama yaparak yeni hisse ekleyebilirsiniz.
            </p>
          ) : (
            <div className="divide-y divide-dashed divide-[var(--line)] border border-[var(--line)] rounded-lg p-3 bg-[var(--ink-3)] max-h-48 overflow-y-auto">
              {basket.holdings.map((h) => (
                <div
                  key={h.companySymbol}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-[var(--paper)] text-sm">
                      {h.companySymbol}
                    </span>
                    <div className="text-[11px] text-[var(--mist)]">
                      {h.quantity} Lot • Maliyet: {h.avgCost.toFixed(2)} ₺ • Anlık: {(h.quantity * (h.currentPrice || h.avgCost)).toLocaleString("tr-TR")} ₺
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Weight Input */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[var(--mist)]">%</span>
                      <input
                        type="number"
                        value={h.weightPercent}
                        onChange={(e) =>
                          updateHolding(basket.id, h.companySymbol, {
                            weightPercent: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-14 bg-[var(--ink-2)] border border-[var(--line)] rounded px-1.5 py-1 text-right text-[var(--brass)] font-bold outline-none"
                      />
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() =>
                        removeHoldingFromBasket(basket.id, h.companySymbol)
                      }
                      className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors cursor-pointer"
                      title="Sepetten Çıkar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modern Add Holding Form with CompanyCombobox */}
        <form
          onSubmit={handleAddHolding}
          className="bg-[var(--ink-3)] border border-[var(--brass-dim)] p-4 rounded-xl space-y-4 shadow-inner"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--brass)] uppercase font-semibold">
              <Plus className="w-4 h-4" />
              <span>Sepete Yeni Şirket / Varlık Ekle</span>
            </div>
            {currentCo && (
              <span className="font-mono text-xs text-[var(--verdigris)] font-bold">
                Tutar: ~{estimatedCost.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
              </span>
            )}
          </div>

          {/* Search-as-you-type Combobox */}
          <CompanyCombobox
            companies={companies}
            selectedSymbol={selectedAddSymbol}
            onSelect={(co) => setSelectedAddSymbol(co.symbol)}
            label="Şirket / Varlık Arayın veya Seçin"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Adet (Lot)
                </label>
                {/* Quick lot increment chips */}
                <div className="flex items-center gap-1">
                  {[10, 50, 100, 500].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setAddQty(quick.toString())}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--ink-2)] hover:bg-[var(--ink)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
                    >
                      +{quick}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                min="1"
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                Hedef Portföy Ağırlığı (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={addWeight}
                onChange={(e) => setAddWeight(e.target.value)}
                className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>{selectedAddSymbol} ({addQty} Lot) Sepete Ekle</span>
          </button>
        </form>

        {/* Close */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] text-xs font-mono px-5 py-2.5 rounded cursor-pointer"
          >
            Tamamla &amp; Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
