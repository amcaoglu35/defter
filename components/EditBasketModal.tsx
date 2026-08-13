"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Sliders, Check } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Basket } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";

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

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const co = companies.find((c) => c.symbol === selectedAddSymbol);
    if (!co) return;

    addHoldingToBasket(basket.id, {
      companySymbol: co.symbol,
      quantity: parseFloat(addQty) || 10,
      weightPercent: parseFloat(addWeight) || 15,
      avgCost: co.price,
      currentPrice: co.price,
    });

    showToast(
      "Varlık Eklendi",
      `${co.symbol} (${parseFloat(addQty) || 10} Lot) ${basket.name} sepetine eklendi.`,
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
          <h4 className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
            Mevcut Varlıklar ({basket.holdings.length})
          </h4>

          {basket.holdings.length === 0 ? (
            <p className="text-xs text-[var(--mist)] py-4 text-center border border-dashed border-[var(--line)] rounded">
              Bu sepette henüz varlık yok. Aşağıdan yeni hisse ekleyebilirsiniz.
            </p>
          ) : (
            <div className="divide-y divide-dashed divide-[var(--line)] border border-[var(--line)] rounded-lg p-3 bg-[var(--ink-3)]">
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
                      {h.quantity} Lot • Maliyet: {h.avgCost.toFixed(2)} ₺
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
                      className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors"
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

        {/* Add Holding Form */}
        <form
          onSubmit={handleAddHolding}
          className="bg-[var(--ink-3)] border border-[var(--line)] p-4 rounded-lg space-y-3"
        >
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--brass)] uppercase font-semibold">
            <Plus className="w-4 h-4" />
            <span>Sepete Yeni Şirket Ekle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                Şirket / Varlık
              </label>
              <select
                value={selectedAddSymbol}
                onChange={(e) => setSelectedAddSymbol(e.target.value)}
                className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none"
              >
                {companies.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.symbol} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                Adet (Lot)
              </label>
              <input
                type="number"
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                Ağırlık (%)
              </label>
              <input
                type="number"
                value={addWeight}
                onChange={(e) => setAddWeight(e.target.value)}
                className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2 rounded flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sepete Ekle</span>
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
