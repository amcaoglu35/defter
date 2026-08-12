"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Building,
  Layers,
  Sparkles,
  TrendingUp,
  Settings,
  Calendar,
  X,
  ArrowRight,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { companies, baskets, refreshPrices } = useDefterStore();

  // Keyboard shortcut listener (Ctrl+K, Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.symbol.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredBaskets = baskets.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Bar */}
        <div className="p-4 border-b border-[var(--line)] flex items-center gap-3 bg-[var(--ink)]">
          <Search className="w-5 h-5 text-[var(--brass)]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Şirket, sepet, araç veya kısayol ara..."
            className="w-full bg-transparent text-sm text-[var(--paper)] placeholder-[var(--mist)] outline-none font-sans"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 text-xs font-mono border border-[var(--line)] rounded"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 font-sans text-xs">
          {/* Quick Actions */}
          {!query && (
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-[var(--mist)] px-2">
                Hızlı Komutlar
              </div>
              <button
                onClick={() => navigateTo("/orakul")}
                className="w-full p-2.5 rounded-lg flex items-center justify-between hover:bg-[var(--ink-3)] text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--brass)]" />
                  <span className="text-[var(--paper)] group-hover:text-[var(--brass)]">
                    Orakul AI Pusulasını Aç
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--mist)]" />
              </button>

              <button
                onClick={() => {
                  refreshPrices();
                  setIsOpen(false);
                }}
                className="w-full p-2.5 rounded-lg flex items-center justify-between hover:bg-[var(--ink-3)] text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-[var(--verdigris)]" />
                  <span className="text-[var(--paper)] group-hover:text-[var(--verdigris)]">
                    Canlı Piyasa Fiyatlarını Güncelle
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--mist)]">SENKRON</span>
              </button>

              <button
                onClick={() => navigateTo("/halka-arz")}
                className="w-full p-2.5 rounded-lg flex items-center justify-between hover:bg-[var(--ink-3)] text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[var(--brass)]" />
                  <span className="text-[var(--paper)] group-hover:text-[var(--brass)]">
                    Halka Arz &amp; Tavan Hesaplayıcı
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--mist)]" />
              </button>
            </div>
          )}

          {/* Companies */}
          {filteredCompanies.length > 0 && (
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-[var(--mist)] px-2">
                Şirketler &amp; Varlıklar ({filteredCompanies.length})
              </div>
              {filteredCompanies.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigateTo(`/sirketler/${c.symbol}`)}
                  className="w-full p-2 rounded-lg flex items-center justify-between hover:bg-[var(--ink-3)] text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded bg-[var(--ink-2)] border border-[var(--line)] flex items-center justify-center font-mono font-bold text-xs text-[var(--brass)]">
                      {c.symbol.slice(0, 3)}
                    </span>
                    <div>
                      <div className="font-semibold text-[var(--paper)] group-hover:text-[var(--brass)]">
                        {c.name}
                      </div>
                      <div className="font-mono text-[10px] text-[var(--mist)]">
                        {c.symbol} • {c.sector}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold text-[var(--paper)]">
                      {c.price} {c.currency}
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        c.dailyChange >= 0
                          ? "text-[var(--verdigris)]"
                          : "text-[var(--loss)]"
                      }`}
                    >
                      {c.dailyChange >= 0 ? "+" : ""}
                      {c.dailyChange}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Baskets */}
          {filteredBaskets.length > 0 && (
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-[var(--mist)] px-2">
                Sepetler ({filteredBaskets.length})
              </div>
              {filteredBaskets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => navigateTo(`/sepetlerim/${b.id}`)}
                  className="w-full p-2 rounded-lg flex items-center justify-between hover:bg-[var(--ink-3)] text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-[var(--brass)]" />
                    <div>
                      <div className="font-semibold text-[var(--paper)] group-hover:text-[var(--brass)]">
                        {b.name}
                      </div>
                      <div className="font-mono text-[10px] text-[var(--mist)]">
                        {b.holdings.length} Varlık • {b.riskLevel} Risk
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono font-bold text-[var(--paper)]">
                    {b.totalValue.toLocaleString("tr-TR")} ₺
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--line)] bg-[var(--ink)] flex items-center justify-between font-mono text-[11px] text-[var(--mist)]">
          <span>Klavye: ↑ ↓ Gezin • Enter Seç</span>
          <span className="text-[var(--brass)]">Defter Kütük Arama</span>
        </div>
      </div>
    </div>
  );
}
