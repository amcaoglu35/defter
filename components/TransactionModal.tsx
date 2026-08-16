"use client";

import React, { useState } from "react";
import { X, ArrowDownRight, ArrowUpRight, AlertTriangle, Info } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import Confetti from "@/components/Confetti";

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
  const [confettiActive, setConfettiActive] = useState(false);

  // Sync targetBasketId during render if baskets change or target is missing
  if (baskets.length > 0 && (!targetBasketId || !baskets.some((b) => b.id === targetBasketId))) {
    setTargetBasketId(baskets[0].id);
  }

  if (!isOpen) return null;

  const numQty = parseFloat(quantity) || 0;
  const numPrice = parseFloat(price) || 0;
  const totalAmount = (numQty * numPrice).toFixed(2);

  // Available lots validation for SELL
  const selectedBasket = baskets.find((b) => b.id === targetBasketId);
  const existingHolding = selectedBasket?.holdings.find(
    (h) => h.companySymbol === symbol
  );
  const availableLots = existingHolding ? existingHolding.quantity : 0;
  const isSellingTooMuch = type === "SELL" && numQty > availableLots;
  const isSellingWithNoHolding = type === "SELL" && availableLots <= 0;

  const isFormInvalid =
    !targetBasketId ||
    numQty <= 0 ||
    numPrice <= 0 ||
    isSellingTooMuch ||
    isSellingWithNoHolding;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    const result = addTransaction(
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

    if (!result.success) {
      showToast("İşlem Reddedildi", result.error || "İşlem kaydedilemedi.", "error");
      return;
    }

    setConfettiActive(true);

    showToast(
      "İşlem Kaydedildi",
      `${symbol} ${type === "BUY" ? "Alış" : "Satış"} işlemi (${numQty} adet) başarıyla işlendi.`,
      "success"
    );

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <Confetti active={confettiActive} />
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
                  {baskets.map((b) => {
                    const h = b.holdings.find((holding) => holding.companySymbol === symbol);
                    return (
                      <option key={b.id} value={b.id}>
                        {b.name} {h ? `(${h.quantity} lot mevcut)` : "(Bu varlık yok)"}
                      </option>
                    );
                  })}
                </>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-[var(--mist)] uppercase">
                  Lot / Adet
                </label>
                {/* Quick lot increment chips */}
                <div className="flex items-center gap-1">
                  {type === "SELL" && availableLots > 0 ? (
                    <button
                      type="button"
                      onClick={() => setQuantity(availableLots.toString())}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)] cursor-pointer"
                      title="Tümünü Sat"
                    >
                      Tümü ({availableLots})
                    </button>
                  ) : (
                    [10, 50, 100].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setQuantity((prev) => ((parseFloat(prev) || 0) + quick).toString())}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
                      >
                        +{quick}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <input
                type="number"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="10"
                className={`w-full bg-[var(--ink-3)] border rounded p-2.5 text-xs text-[var(--paper)] font-mono outline-none ${
                  isSellingTooMuch || isSellingWithNoHolding
                    ? "border-[var(--loss)] focus:border-[var(--loss)] text-[var(--loss)]"
                    : "border-[var(--line)] focus:border-[var(--brass)]"
                }`}
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

          {/* Sell Warning / Holding Feedback Box */}
          {type === "SELL" && (
            <div className="animate-in fade-in">
              {isSellingWithNoHolding ? (
                <div className="p-2.5 bg-[rgba(163,59,59,0.12)] border border-[var(--loss)] rounded-lg text-xs font-mono text-[var(--loss)] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Seçili sepette elinizde hiç <strong>{symbol}</strong> lotu bulunmuyor. Satış işlemi yapamazsınız.
                  </span>
                </div>
              ) : isSellingTooMuch ? (
                <div className="p-2.5 bg-[rgba(163,59,59,0.12)] border border-[var(--loss)] rounded-lg text-xs font-mono text-[var(--loss)] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Elinizde bu sepette sadece <strong>{availableLots} lot</strong> var. {numQty} lot satamazsınız.
                  </span>
                </div>
              ) : (
                <div className="p-2.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg text-xs font-mono text-[var(--paper-dim)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[var(--mist)]">
                    <Info className="w-3.5 h-3.5 text-[var(--brass)]" />
                    Mevcut Varlık:
                  </span>
                  <span className="text-[var(--brass)] font-semibold">
                    {availableLots} lot &rarr; Kalan: {availableLots - numQty} lot
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
              İşlem Notu (Opsiyonel)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Kâr realizasyonu veya düzenli alım"
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
              className="flex-1 border border-[var(--line)] py-2.5 rounded text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isFormInvalid}
              className="flex-1 bg-[var(--brass)] hover:bg-[#d9b35a] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--ink)] font-bold py-2.5 rounded text-xs transition-transform active:scale-95 cursor-pointer shadow"
            >
              {type === "BUY" ? "Alış İşlemini Kaydet" : "Satış İşlemini Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
