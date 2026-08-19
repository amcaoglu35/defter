"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const navigateTo = (path: string) => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
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

  // Build a flat list of all navigable items for keyboard control
  const quickActions = !query
    ? [
        { type: "action" as const, label: "Orakul AI Pusulasını Aç", path: "/orakul" },
        { type: "action" as const, label: "Canlı Piyasa Fiyatlarını Güncelle", path: null },
        { type: "action" as const, label: "Halka Arz & Tavan Hesaplayıcı", path: "/halka-arz" },
      ]
    : [];

  const flatItems = [
    ...quickActions,
    ...filteredCompanies.slice(0, 5).map((c) => ({
      type: "company" as const,
      label: c.name,
      path: `/sirketler/${encodeURIComponent(c.symbol)}`,
    })),
    ...filteredBaskets.map((b) => ({
      type: "basket" as const,
      label: b.name,
      path: `/sepetlerim/${b.id}`,
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
        const item = flatItems[selectedIndex];
        if (item.type === "action" && item.label.includes("Fiyat")) {
          refreshPrices();
          setIsOpen(false);
        } else if (item.path) {
          navigateTo(item.path);
        }
      }
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const el = listRef.current.querySelector(`[data-idx="${selectedIndex}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const isSelected = (offset: number) => selectedIndex === offset;

  if (!isOpen) return null;

  let globalIdx = 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-[var(--line)] flex items-center gap-3 bg-[var(--ink)]">
          <Search className="w-5 h-5 text-[var(--brass)]" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Şirket, sepet, araç veya kısayol ara..."
            className="w-full bg-transparent text-sm text-[var(--paper)] placeholder-[var(--mist)] outline-none font-sans"
            aria-label="Komut paleti arama"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 text-xs font-mono border border-[var(--line)] rounded cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-96 overflow-y-auto p-3 space-y-4 font-sans text-xs"
          role="listbox"
        >
          {/* Quick Actions */}
          {!query && (
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-[var(--mist)] px-2">
                Hızlı Komutlar
              </div>

              {/* Orakul */}
              {(() => {
                const idx = globalIdx++;
                return (
                  <button
                    data-idx={idx}
                    onClick={() => navigateTo("/orakul")}
                    className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left group cursor-pointer transition-colors ${
                      isSelected(idx) ? "bg-[var(--ink-3)] text-[var(--brass)]" : "hover:bg-[var(--ink-3)]"
                    }`}
                    role="option"
                    aria-selected={isSelected(idx)}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[var(--brass)]" />
                      <span className={`group-hover:text-[var(--brass)] ${isSelected(idx) ? "text-[var(--brass)]" : "text-[var(--paper)]"}`}>
                        Orakul AI Pusulasını Aç
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--mist)]" />
                  </button>
                );
              })()}

              {/* Refresh prices */}
              {(() => {
                const idx = globalIdx++;
                return (
                  <button
                    data-idx={idx}
                    onClick={() => {
                      refreshPrices();
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left group cursor-pointer transition-colors ${
                      isSelected(idx) ? "bg-[var(--ink-3)] text-[var(--verdigris)]" : "hover:bg-[var(--ink-3)]"
                    }`}
                    role="option"
                    aria-selected={isSelected(idx)}
                  >
                    <div className="flex items-center gap-2.5">
                      <RefreshCw className="w-4 h-4 text-[var(--verdigris)]" />
                      <span className={`group-hover:text-[var(--verdigris)] ${isSelected(idx) ? "text-[var(--verdigris)]" : "text-[var(--paper)]"}`}>
                        Canlı Piyasa Fiyatlarını Güncelle
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--mist)]">SENKRON</span>
                  </button>
                );
              })()}

              {/* Halka Arz */}
              {(() => {
                const idx = globalIdx++;
                return (
                  <button
                    data-idx={idx}
                    onClick={() => navigateTo("/halka-arz")}
                    className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left group cursor-pointer transition-colors ${
                      isSelected(idx) ? "bg-[var(--ink-3)] text-[var(--brass)]" : "hover:bg-[var(--ink-3)]"
                    }`}
                    role="option"
                    aria-selected={isSelected(idx)}
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-[var(--brass)]" />
                      <span className={`group-hover:text-[var(--brass)] ${isSelected(idx) ? "text-[var(--brass)]" : "text-[var(--paper)]"}`}>
                        Halka Arz &amp; Tavan Hesaplayıcı
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--mist)]" />
                  </button>
                );
              })()}
            </div>
          )}

          {/* Companies */}
          {filteredCompanies.length > 0 && (
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-[var(--mist)] px-2">
                Şirketler &amp; Varlıklar ({filteredCompanies.length})
              </div>
              {filteredCompanies.slice(0, 5).map((c) => {
                const idx = globalIdx++;
                return (
                  <button
                    key={c.id}
                    data-idx={idx}
                    onClick={() => navigateTo(`/sirketler/${encodeURIComponent(c.symbol)}`)}
                    className={`w-full p-2 rounded-lg flex items-center justify-between text-left group cursor-pointer transition-colors ${
                      isSelected(idx) ? "bg-[var(--ink-3)]" : "hover:bg-[var(--ink-3)]"
                    }`}
                    role="option"
                    aria-selected={isSelected(idx)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded border flex items-center justify-center font-mono font-bold text-xs text-[var(--brass)] transition-colors ${
                        isSelected(idx) ? "bg-[var(--ink)] border-[var(--brass-dim)]" : "bg-[var(--ink-2)] border-[var(--line)]"
                      }`}>
                        {c.symbol.slice(0, 3)}
                      </span>
                      <div>
                        <div className={`font-semibold group-hover:text-[var(--brass)] ${isSelected(idx) ? "text-[var(--brass)]" : "text-[var(--paper)]"}`}>
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
                );
              })}
            </div>
          )}

          {/* Baskets */}
          {filteredBaskets.length > 0 && (
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-[var(--mist)] px-2">
                Sepetler ({filteredBaskets.length})
              </div>
              {filteredBaskets.map((b) => {
                const idx = globalIdx++;
                return (
                  <button
                    key={b.id}
                    data-idx={idx}
                    onClick={() => navigateTo(`/sepetlerim/${b.id}`)}
                    className={`w-full p-2 rounded-lg flex items-center justify-between text-left group cursor-pointer transition-colors ${
                      isSelected(idx) ? "bg-[var(--ink-3)]" : "hover:bg-[var(--ink-3)]"
                    }`}
                    role="option"
                    aria-selected={isSelected(idx)}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className={`w-4 h-4 ${isSelected(idx) ? "text-[var(--brass)]" : "text-[var(--brass)]"}`} />
                      <div>
                        <div className={`font-semibold group-hover:text-[var(--brass)] ${isSelected(idx) ? "text-[var(--brass)]" : "text-[var(--paper)]"}`}>
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
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {query && filteredCompanies.length === 0 && filteredBaskets.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
              <Search className="w-8 h-8 text-[var(--mist)] opacity-40" />
              <div>
                <div className="text-sm font-semibold text-[var(--paper-dim)]">Sonuç bulunamadı</div>
                <div className="text-xs font-mono text-[var(--mist)] mt-0.5">
                  &ldquo;{query}&rdquo; için eşleşen şirket veya sepet yok
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--line)] bg-[var(--ink)] flex items-center justify-between font-mono text-[11px] text-[var(--mist)]">
          <span>↑ ↓ Gezin &nbsp;•&nbsp; Enter Seç &nbsp;•&nbsp; ESC Kapat</span>
          <span className="text-[var(--brass)]">Defter Kütük Arama</span>
        </div>
      </div>
    </div>
  );
}
