"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowDownRight, ArrowUpRight, DollarSign, Layers } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface TransactionModalProps {
  symbol: string;
  defaultPrice: number;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({
  symbol,
  defaultPrice,
  currency,
  isOpen,
  onClose,
}: TransactionModalProps) {
  const { addTransaction, baskets } = useDefterStore();
  const { showToast } = useToast();

  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState("10");
  const [price, setPrice] = useState(defaultPrice.toString());
  const [targetBasketId, setTargetBasketId] = useState(
    baskets[0]?.id || ""
  );
  const [note, setNote] = useState("");

  useEffect(() => {
    if (baskets.length > 0) {
      if (!targetBasketId || !baskets.some((b) => b.id === targetBasketId)) {
        setTargetBasketId(baskets[0].id);
      }
    }
  }, [baskets, targetBasketId]);

  if (!isOpen) return null;

  const numQty = parseFloat(quantity) || 0;
  const numPrice = parseFloat(price) || 0;
  const totalAmount = (numQty * numPrice).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBasketId || numQty <= 0 || numPrice <= 0) return;

    addTransaction(
      {
        companySymbol: symbol,
        type: type,
        quantity: numQty,
        price: numPrice,
        totalAmount: parseFloat(totalAmount),
        date: new Date().toISOString().split("T")[0],
        note: note.trim() || undefined,
      },
      targetBasketId
    );

    showToast(
      "İşlem Kaydedildi",
      `${symbol} ${type === "BUY" ? "Alış" : "Satış"} işlemi başarıyla eklendi.`,
      "success"
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Head */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[var(--paper)]">
              {symbol} İşlem Kaydı
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {baskets.length === 0 && (
          <div className="p-3 bg-[rgba(196,160,82,0.1)] border border-[var(--brass-dim)] rounded text-xs text-[var(--brass)] font-mono">
            ⚠️ İşlem kaydedebileceğiniz aktif bir sepet bulunamadı. Lütfen önce &quot;Sepetlerim&quot; sayfasından bir sepet oluşturun.
          </div>
        )}

        {/* Buy / Sell Tab Buttons */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--ink-3)] rounded-lg">
          <button
            type="button"
            onClick={() => setType("BUY")}
            className={`py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === "BUY"
                ? "bg-[var(--verdigris)] text-[var(--ink)] shadow"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Alış (BUY)</span>
          </button>

          <button
            type="button"
            onClick={() => setType("SELL")}
            className={`py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === "SELL"
                ? "bg-[var(--loss)] text-[var(--ink)] shadow"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Satış (SELL)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Basket */}
          <div>
            <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
              İlişkili Sepet <span className="text-[var(--loss)]">*</span>
            </label>
            <select
              value={targetBasketId}
              onChange={(e) => setTargetBasketId(e.target.value)}
              required
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
            >
              {baskets.length === 0 ? (
                <option value="" disabled>
                  -- Sepet Yok --
                </option>
              ) : (
                <>
                  {!targetBasketId && (
                    <option value="" disabled>
                      -- Hedef Sepet Seçin --
                    </option>
                  )}
                  {baskets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                Lot / Adet
              </label>
              <input
                type="number"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="10"
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                Birim Fiyat ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={defaultPrice.toString()}
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
              İşlem Notu (Opsiyonel)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Aylık düzenli tasarruf alımı"
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] focus:border-[var(--brass)] outline-none"
            />
          </div>

          {/* Total Preview */}
          <div className="p-3 bg-[var(--ink-3)] rounded border border-[var(--line)] flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--mist)]">Toplam Tutar:</span>
            <span className="text-base font-bold text-[var(--brass)]">
              {parseFloat(totalAmount).toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
              })}{" "}
              {currency}
            </span>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[var(--line)] py-2.5 rounded text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)]"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!targetBasketId || numQty <= 0 || numPrice <= 0}
              className="flex-1 bg-[var(--brass)] hover:bg-[#d9b35a] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--ink)] font-bold py-2.5 rounded text-xs transition-transform active:scale-95 cursor-pointer"
            >
              İşlemi Kaydet &amp; Maliyeti Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
