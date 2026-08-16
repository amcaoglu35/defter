"use client";

import React, { useState, useMemo } from "react";
import { X, ArrowRightLeft, Coins, Calculator, Sparkles, TrendingUp } from "lucide-react";
import { useDefterStore } from "@/lib/store";

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConvertibleAsset {
  code: string;
  name: string;
  priceInTry: number;
  symbolStr: string;
  category: "currency" | "metal" | "stock";
}

export default function CurrencyConverterModal({
  isOpen,
  onClose,
}: CurrencyConverterModalProps) {
  const { companies, indices } = useDefterStore();
  const [fromCode, setFromCode] = useState<string>("USD");
  const [toCode, setToCode] = useState<string>("TRY");
  const [amount, setAmount] = useState<string>("100");

  const assets = useMemo<ConvertibleAsset[]>(() => {
    const list: ConvertibleAsset[] = [
      { code: "TRY", name: "Türk Lirası (₺)", priceInTry: 1, symbolStr: "₺", category: "currency" },
      { code: "USD", name: "Amerikan Doları ($)", priceInTry: indices["USD/TRY"]?.price || 47.88, symbolStr: "$", category: "currency" },
      { code: "EUR", name: "Euro (€)", priceInTry: indices["EUR/TRY"]?.price || 55.38, symbolStr: "€", category: "currency" },
      { code: "ALTIN_GR", name: "Gram Altın (24K)", priceInTry: indices["Gram Altın"]?.price || 4078.0, symbolStr: "Gr", category: "metal" },
      { code: "GUMUS_GR", name: "Gram Gümüş", priceInTry: indices["Gümüş/Gr"]?.price || 48.50, symbolStr: "Gr", category: "metal" },
      { code: "CEYREK", name: "Çeyrek Altın", priceInTry: (indices["Gram Altın"]?.price || 4078.0) * 1.635, symbolStr: "Adet", category: "metal" },
    ];

    // Add top 20 BIST stocks
    const topStocks = (companies || []).slice(0, 25);
    topStocks.forEach((c) => {
      list.push({
        code: c.symbol,
        name: `${c.symbol} - ${c.name}`,
        priceInTry: c.price || 100,
        symbolStr: "Lot",
        category: "stock",
      });
    });

    return list;
  }, [companies, indices]);

  if (!isOpen) return null;

  const parsedAmount = parseFloat(amount) || 0;
  const fromAsset = assets.find((a) => a.code === fromCode) || assets[1];
  const toAsset = assets.find((a) => a.code === toCode) || assets[0];

  const totalValueInTry = parsedAmount * fromAsset.priceInTry;
  const result = toAsset.priceInTry > 0 ? totalValueInTry / toAsset.priceInTry : 0;
  const formattedResult = result.toLocaleString("tr-TR", {
    minimumFractionDigits: result < 1 ? 4 : 2,
    maximumFractionDigits: result < 1 ? 4 : 2,
  });

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[var(--brass)]" />
            <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
              Canlı Kur &amp; Varlık Çevirici
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Selector Grid */}
        <div className="space-y-3 font-mono">
          <div>
            <label className="text-[11px] text-[var(--mist)] uppercase block mb-1">
              Dönüştürülecek Miktar
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Miktar girin..."
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 text-sm text-[var(--paper)] font-bold focus:border-[var(--brass)] outline-none"
              />
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg px-3 text-xs text-[var(--paper)] font-semibold focus:border-[var(--brass)] outline-none max-w-[150px]"
              >
                <optgroup label="Döviz & Kurlar">
                  {assets.filter((a) => a.category === "currency").map((a) => (
                    <option key={a.code} value={a.code}>{a.code} ({a.priceInTry.toFixed(2)} ₺)</option>
                  ))}
                </optgroup>
                <optgroup label="Kıymetli Madenler">
                  {assets.filter((a) => a.category === "metal").map((a) => (
                    <option key={a.code} value={a.code}>{a.code} ({a.priceInTry.toFixed(2)} ₺)</option>
                  ))}
                </optgroup>
                <optgroup label="BIST Hisseleri">
                  {assets.filter((a) => a.category === "stock").map((a) => (
                    <option key={a.code} value={a.code}>{a.code} ({a.priceInTry.toFixed(2)} ₺)</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwap}
              title="Varlıkları Değiştir"
              className="p-2 rounded-full bg-[var(--ink-3)] hover:bg-[var(--brass)] text-[var(--brass)] hover:text-[var(--ink)] border border-[var(--line)] hover:border-[var(--brass)] transition-all cursor-pointer shadow active:scale-90"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Target Asset Selector */}
          <div>
            <label className="text-[11px] text-[var(--mist)] uppercase block mb-1">
              Hedef Varlık Cinsi
            </label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 text-xs text-[var(--paper)] font-semibold focus:border-[var(--brass)] outline-none"
            >
              <optgroup label="Döviz & Kurlar">
                {assets.filter((a) => a.category === "currency").map((a) => (
                  <option key={a.code} value={a.code}>{a.name}</option>
                ))}
              </optgroup>
              <optgroup label="Kıymetli Madenler">
                {assets.filter((a) => a.category === "metal").map((a) => (
                  <option key={a.code} value={a.code}>{a.name}</option>
                ))}
              </optgroup>
              <optgroup label="BIST Hisseleri">
                {assets.filter((a) => a.category === "stock").map((a) => (
                  <option key={a.code} value={a.code}>{a.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl space-y-1.5 font-mono text-center">
          <span className="text-[11px] text-[var(--mist)] uppercase tracking-wider block">
            Canlı Piyasa Karşılığı
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[var(--verdigris)]">
            {formattedResult} <span className="text-lg text-[var(--paper)]">{toAsset.symbolStr}</span>
          </div>
          <div className="text-[11px] text-[var(--mist)]">
            1 {fromAsset.code} = {(fromAsset.priceInTry / (toAsset.priceInTry || 1)).toFixed(4)} {toAsset.code}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 justify-center font-mono text-[10px]">
          {["100 USD", "1000 EUR", "10 Gr Altın", "100 Lot THYAO"].map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (idx === 0) { setAmount("100"); setFromCode("USD"); setToCode("TRY"); }
                if (idx === 1) { setAmount("1000"); setFromCode("EUR"); setToCode("TRY"); }
                if (idx === 2) { setAmount("10"); setFromCode("ALTIN_GR"); setToCode("TRY"); }
                if (idx === 3) { setAmount("100"); setFromCode("THYAO"); setToCode("TRY"); }
              }}
              className="px-2.5 py-1 rounded bg-[var(--ink)] hover:bg-[var(--brass)] text-[var(--mist)] hover:text-[var(--ink)] border border-[var(--line)] transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[var(--line)] text-center">
          <p className="text-[10px] text-[var(--mist)] font-mono">
            Borsa İstanbul, Google Finance ve TCMB resmi seans verileriyle hesaplanır.
          </p>
        </div>
      </div>
    </div>
  );
}
