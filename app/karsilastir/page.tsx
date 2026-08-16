"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRightLeft,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Search,
  Check,
  Zap,
  Building,
  Scale,
  Sparkles,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Company } from "@/lib/mockData";

function formatPrice(val?: number, cur?: string) {
  if (val === undefined || val === null) return "—";
  return `${val.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${cur || "₺"}`;
}

function KarsilastirContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { companies } = useDefterStore();

  // Read initial symbols from URL search parameters (e.g. ?semboller=THYAO,PGSUS)
  const initialSymbolsParam = searchParams.get("semboller") || "";
  const initialSelected = useMemo(() => {
    if (!initialSymbolsParam) return ["THYAO", "PGSUS"];
    return initialSymbolsParam
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0)
      .slice(0, 4);
  }, [initialSymbolsParam]);

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync with companies list
  const selectedCompanies: Company[] = useMemo(() => {
    return selectedSymbols
      .map((sym) => companies.find((c) => c.symbol.toUpperCase() === sym.toUpperCase()))
      .filter(Boolean) as Company[];
  }, [selectedSymbols, companies]);

  // Available peers to add (not yet selected)
  const availableCompanies = useMemo(() => {
    if (!searchQuery.trim()) {
      return companies.filter((c) => !selectedSymbols.includes(c.symbol.toUpperCase())).slice(0, 8);
    }
    const q = searchQuery.toLowerCase().trim();
    return companies
      .filter(
        (c) =>
          !selectedSymbols.includes(c.symbol.toUpperCase()) &&
          (c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [companies, selectedSymbols, searchQuery]);

  const handleAddSymbol = (sym: string) => {
    if (selectedSymbols.length >= 4) return;
    const next = Array.from(new Set([...selectedSymbols, sym.toUpperCase()]));
    setSelectedSymbols(next);
    setSearchQuery("");
    setIsSearchOpen(false);
    router.replace(`/karsilastir?semboller=${next.join(",")}`);
  };

  const handleRemoveSymbol = (sym: string) => {
    const next = selectedSymbols.filter((s) => s !== sym.toUpperCase());
    setSelectedSymbols(next);
    router.replace(`/karsilastir?semboller=${next.join(",")}`);
  };

  // Metric analysis helpers for smart highlighting
  const bestPe = useMemo(() => {
    const valid = selectedCompanies.map((c) => c.peRatio).filter((pe): pe is number => pe !== undefined && pe > 0);
    return valid.length > 0 ? Math.min(...valid) : null;
  }, [selectedCompanies]);

  const bestPb = useMemo(() => {
    const valid = selectedCompanies.map((c) => c.pbRatio).filter((pb): pb is number => pb !== undefined && pb > 0);
    return valid.length > 0 ? Math.min(...valid) : null;
  }, [selectedCompanies]);

  const bestDividend = useMemo(() => {
    const valid = selectedCompanies.map((c) => c.dividendYield).filter((d): d is number => d !== undefined && d > 0);
    return valid.length > 0 ? Math.max(...valid) : null;
  }, [selectedCompanies]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <Link
            href="/sirketler"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--mist)] hover:text-[var(--brass)] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Şirketler Listesine Dön</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--paper)] font-medium flex items-center gap-3">
            <Scale className="w-8 h-8 text-[var(--brass)]" />
            <span>Şirket &amp; Varlık Karşılaştırma</span>
          </h1>
          <p className="text-xs font-mono text-[var(--mist)] mt-1.5">
            Yan yana temel değerleme çarpanları, kârlılık rasyoları, temettü verimi ve piyasa performansı kıyaslaması.
          </p>
        </div>

        {/* Selected Counter & Add Button */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--mist)]">
            Seçili: <strong className="text-[var(--paper)]">{selectedCompanies.length}/4</strong> Şirket
          </span>

          {selectedCompanies.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Şirket Ekle</span>
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-3 shadow-2xl z-50 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--mist)] absolute left-2.5 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Sembol veya şirket ara..."
                      autoFocus
                      className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 pl-8 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto divide-y divide-[var(--line)] font-mono text-xs">
                    {availableCompanies.length === 0 ? (
                      <div className="py-3 text-center text-[var(--mist)] text-[11px]">Şirket bulunamadı.</div>
                    ) : (
                      availableCompanies.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleAddSymbol(c.symbol)}
                          className="w-full text-left p-2 hover:bg-[var(--ink-3)] flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div>
                            <span className="font-bold text-[var(--paper)]">{c.symbol}</span>
                            <span className="text-[10px] text-[var(--mist)] block truncate max-w-[140px]">{c.name}</span>
                          </div>
                          <span className="text-[11px] text-[var(--brass)]">{formatPrice(c.price, c.currency)}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedCompanies.length === 0 ? (
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-2xl p-12 text-center space-y-4">
          <ArrowRightLeft className="w-12 h-12 text-[var(--mist)] mx-auto opacity-50" />
          <h3 className="font-serif text-xl text-[var(--paper)] font-medium">Karşılaştırılacak Şirket Seçilmedi</h3>
          <p className="text-xs font-mono text-[var(--mist)] max-w-md mx-auto">
            Yukarıdaki &quot;Şirket Ekle&quot; butonuyla veya şirket detay sayfalarındaki &quot;Karşılaştır&quot; bağlantısıyla listeye en fazla 4 şirket ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--ink-3)]">
                  <th className="p-4 w-48 text-[var(--mist)] uppercase text-[11px] font-semibold">
                    Karşılaştırma Kriteri
                  </th>
                  {selectedCompanies.map((c) => (
                    <th key={c.id} className="p-4 min-w-[220px] max-w-[280px]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg font-bold text-[var(--paper)]">{c.symbol}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ink)] text-[var(--brass)] border border-[var(--line)]">
                              {c.exchange}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--mist)] block truncate font-sans">{c.name}</span>
                          <span className="text-[10px] text-[var(--verdigris)] block mt-0.5">{c.sector}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSymbol(c.symbol)}
                          className="text-[var(--mist)] hover:text-[var(--loss)] p-1 rounded transition-colors cursor-pointer"
                          title="Listeden Kaldır"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--line)]">
                {/* 1. Güncel Fiyat & Değişim */}
                <tr className="hover:bg-[var(--ink-3)]/30">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    Canlı Fiyat &amp; Değişim
                  </td>
                  {selectedCompanies.map((c) => (
                    <td key={c.id} className="p-4">
                      <div className="text-base font-bold text-[var(--paper)]">
                        {formatPrice(c.price, c.currency)}
                      </div>
                      <div className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${
                        (c.dailyChange || 0) >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                      }`}>
                        {(c.dailyChange || 0) >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{(c.dailyChange || 0) >= 0 ? `+${c.dailyChange}%` : `${c.dailyChange}%`}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. Fiyat / Kazanç (F/K) */}
                <tr className="hover:bg-[var(--ink-3)]/30">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    F/K Oranı (P/E)
                  </td>
                  {selectedCompanies.map((c) => {
                    const isBest = bestPe !== null && c.peRatio === bestPe;
                    return (
                      <td key={c.id} className="p-4">
                        <span className={`text-sm font-bold ${isBest ? "text-[var(--verdigris)] bg-[rgba(91,140,123,0.15)] px-2 py-0.5 rounded border border-[var(--verdigris)]" : "text-[var(--paper)]"}`}>
                          {c.peRatio !== undefined ? `${c.peRatio}x` : "—"}
                        </span>
                        {isBest && <span className="text-[10px] text-[var(--verdigris)] block mt-1">★ En Düşük F/K</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* 3. Piyasa Değeri / Defter Değeri (PD/DD) */}
                <tr className="hover:bg-[var(--ink-3)]/30">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    PD / DD Oranı (P/B)
                  </td>
                  {selectedCompanies.map((c) => {
                    const isBest = bestPb !== null && c.pbRatio === bestPb;
                    return (
                      <td key={c.id} className="p-4">
                        <span className={`text-sm font-bold ${isBest ? "text-[var(--verdigris)] bg-[rgba(91,140,123,0.15)] px-2 py-0.5 rounded border border-[var(--verdigris)]" : "text-[var(--paper)]"}`}>
                          {c.pbRatio !== undefined ? `${c.pbRatio}x` : "—"}
                        </span>
                        {isBest && <span className="text-[10px] text-[var(--verdigris)] block mt-1">★ En Düşük PD/DD</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* 4. Temettü Verimi */}
                <tr className="hover:bg-[var(--ink-3)]/30">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    Temettü Verimi
                  </td>
                  {selectedCompanies.map((c) => {
                    const isBest = bestDividend !== null && c.dividendYield === bestDividend;
                    return (
                      <td key={c.id} className="p-4">
                        <span className={`text-sm font-bold ${isBest ? "text-[var(--verdigris)] bg-[rgba(91,140,123,0.15)] px-2 py-0.5 rounded border border-[var(--verdigris)]" : "text-[var(--paper)]"}`}>
                          {c.dividendYield !== undefined && c.dividendYield > 0 ? `%${c.dividendYield}` : "—"}
                        </span>
                        {isBest && <span className="text-[10px] text-[var(--verdigris)] block mt-1">★ En Yüksek Temettü</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* 5. Piyasa Değeri & Beta */}
                <tr className="hover:bg-[var(--ink-3)]/30">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    Piyasa Değeri &amp; Beta
                  </td>
                  {selectedCompanies.map((c) => (
                    <td key={c.id} className="p-4 space-y-1">
                      <div className="font-bold text-[var(--paper)]">{c.marketCap || "—"}</div>
                      <div className="text-[11px] text-[var(--mist)]">Beta: <strong className="text-[var(--paper)]">{c.beta ?? "1.00"}</strong></div>
                    </td>
                  ))}
                </tr>

                {/* 6. Hisse Başı Kâr (HBK) & Sermaye */}
                <tr className="hover:bg-[var(--ink-3)]/30">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    HBK &amp; Dolaşım
                  </td>
                  {selectedCompanies.map((c) => (
                    <td key={c.id} className="p-4 space-y-1">
                      <div className="font-bold text-[var(--brass)]">{c.eps ? `${c.eps} ₺` : "—"}</div>
                      <div className="text-[10px] text-[var(--mist)]">{c.sharesOutstanding || "Dolaşım Belirtilmedi"}</div>
                    </td>
                  ))}
                </tr>

                {/* 7. Kârlılık & Marjlar */}
                <tr className="hover:bg-[var(--ink-3)]/30">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    ROE &amp; Faaliyet Marjı
                  </td>
                  {selectedCompanies.map((c) => (
                    <td key={c.id} className="p-4 space-y-1">
                      <div className="text-[11px] text-[var(--mist)]">
                        ROE: <strong className="text-[var(--paper)]">{c.returnOnEquity !== undefined ? `%${c.returnOnEquity}` : "—"}</strong>
                      </div>
                      <div className="text-[11px] text-[var(--mist)]">
                        Faaliyet Marjı: <strong className="text-[var(--paper)]">{c.operatingMargin !== undefined ? `%${c.operatingMargin}` : "—"}</strong>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 8. Detay & Aksiyon */}
                <tr className="bg-[var(--ink-3)]/50">
                  <td className="p-4 font-semibold text-[var(--mist)] uppercase text-[11px]">
                    Detaylı İnceleme
                  </td>
                  {selectedCompanies.map((c) => (
                    <td key={c.id} className="p-4">
                      <Link
                        href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brass)] hover:text-[var(--paper)] hover:underline"
                      >
                        <span>Şirket Sayfası</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KarsilastirPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-8 text-center font-mono text-xs text-[var(--mist)]">Yükleniyor...</div>}>
      <KarsilastirContent />
    </Suspense>
  );
}
