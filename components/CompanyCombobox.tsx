"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Sparkles, TrendingUp, TrendingDown, X } from "lucide-react";
import { Company } from "@/lib/mockData";

interface CompanyComboboxProps {
  companies: Company[];
  selectedSymbol: string;
  onSelect: (company: Company) => void;
  label?: string;
  placeholder?: string;
}

export default function CompanyCombobox({
  companies,
  selectedSymbol,
  onSelect,
  label = "Şirket / Varlık Seçin",
  placeholder = "Sembol veya şirket adı ile arayın (örn: THYAO, Altın, Froto)...",
}: CompanyComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"ALL" | "BIST30" | "DIVIDEND" | "COMMODITY" | "WATCHLIST">("ALL");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCompany = companies.find((c) => c.symbol === selectedSymbol) || companies[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter companies based on search and category
  const filteredCompanies = companies.filter((c) => {
    // Category filter
    if (activeCategory === "WATCHLIST" && !c.inWatchlist) return false;
    if (activeCategory === "BIST30" && c.indexTag !== "BIST 30") return false;
    if (activeCategory === "DIVIDEND" && (!c.dividendYield || c.dividendYield < 3.0)) return false;
    if (activeCategory === "COMMODITY" && c.assetClass !== "maden" && c.exchange !== "Emtia") return false;

    // Search query filter (symbol, name, sector)
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      c.symbol.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q)
    );
  });

  const handleSelectCompany = (company: Company) => {
    onSelect(company);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-mono text-[var(--mist)] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Selected Company Trigger Button */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className="w-full bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--brass)] rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-all shadow-inner group"
      >
        {selectedCompany ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[var(--ink-3)] border border-[var(--brass-dim)] flex items-center justify-center font-mono font-bold text-xs text-[var(--brass)] shrink-0">
              {selectedCompany.symbol.slice(0, 4)}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[var(--paper)]">
                  {selectedCompany.symbol}
                </span>
                <span className="text-[10px] font-mono text-[var(--mist)]">
                  • {selectedCompany.sector}
                </span>
              </div>
              <div className="text-[11px] text-[var(--mist)] truncate max-w-[200px] sm:max-w-[260px]">
                {selectedCompany.name}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-xs text-[var(--mist)] font-mono">Şirket seçin...</span>
        )}

        <div className="flex items-center gap-2">
          {selectedCompany && (
            <div className="text-right font-mono text-xs">
              <span className="font-bold text-[var(--paper)] block">
                {selectedCompany.price.toFixed(2)} {selectedCompany.currency}
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  selectedCompany.dailyChange >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                }`}
              >
                {selectedCompany.dailyChange >= 0 ? "+" : ""}
                {selectedCompany.dailyChange}%
              </span>
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[var(--mist)] group-hover:text-[var(--brass)] transition-transform ${
              isOpen ? "rotate-180 text-[var(--brass)]" : ""
            }`}
          />
        </div>
      </div>

      {/* Modern Search-as-you-type Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          {/* Search Input */}
          <div className="p-3 border-b border-[var(--line)] bg-[var(--ink-3)] flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--brass)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs text-[var(--paper)] font-mono placeholder:text-[var(--mist)] outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-[var(--mist)] hover:text-[var(--paper)] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="px-3 py-2 bg-[var(--ink)] border-b border-[var(--line)] flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "Tümü" },
              { id: "BIST30", label: "BIST 30" },
              { id: "DIVIDEND", label: "Temettü" },
              { id: "COMMODITY", label: "Altın/Emtia" },
              { id: "WATCHLIST", label: "İzlemedekiler" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                    : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Company Results List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-dashed divide-[var(--line)]">
            {filteredCompanies.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[var(--mist)]">
                &quot;{search}&quot; ile eşleşen varlık bulunamadı.
              </div>
            ) : (
              filteredCompanies.map((co) => {
                const isSelected = co.symbol === selectedSymbol;
                return (
                  <div
                    key={co.symbol}
                    onClick={() => handleSelectCompany(co)}
                    className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[rgba(201,162,75,0.1)] text-[var(--brass)]"
                        : "hover:bg-[rgba(201,162,75,0.05)] text-[var(--paper)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono font-bold text-[11px] text-[var(--paper)]">
                        {co.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs">{co.symbol}</span>
                          <span className="text-[10px] font-mono text-[var(--mist)]">
                            • {co.sector}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--mist)] truncate max-w-[200px]">
                          {co.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-right shrink-0">
                      <div>
                        <span className="text-xs font-bold block">
                          {co.price.toFixed(2)} {co.currency}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            co.dailyChange >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                          }`}
                        >
                          {co.dailyChange >= 0 ? "+" : ""}
                          {co.dailyChange}%
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[var(--brass)]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
