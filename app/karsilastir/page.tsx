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
import DataStatusBadge from "@/components/DataStatusBadge";
import { isLiveSymbol } from "@/lib/liveSymbols";
import { HealthRadarChart } from "@/components/HealthRadarChart";
import { calculateCompanyHealth } from "@/lib/healthScore";

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
    const next = selectedSymbols.filter((s) => s.toUpperCase() !== sym.toUpperCase());
    setSelectedSymbols(next);
    router.replace(`/karsilastir?semboller=${next.join(",")}`);
  };

  // Compute best values for highlight
  const bestPe = useMemo(() => {
    const pes = selectedCompanies.map((c) => c.peRatio).filter((pe): pe is number => pe !== undefined && pe > 0);
    return pes.length > 0 ? Math.min(...pes) : null;
  }, [selectedCompanies]);

  const bestPb = useMemo(() => {
    const pbs = selectedCompanies.map((c) => c.pbRatio).filter((pb): pb is number => pb !== undefined && pb > 0);
    return pbs.length > 0 ? Math.min(...pbs) : null;
  }, [selectedCompanies]);

  const bestDividend = useMemo(() => {
    const divs = selectedCompanies.map((c) => c.dividendYield).filter((d): d is number => d !== undefined && d > 0);
    return divs.length > 0 ? Math.max(...divs) : null;
  }, [selectedCompanies]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/sirketler"
              className="text-[var(--mist)] hover:text-[var(--paper)] transition-colors p-1 -ml-1 rounded"
              title="Şirketler Listesine Dön"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)]">
              <Scale className="w-4 h-4" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[var(--paper)]">
              Şirket &amp; Varlık Karşılaştırma
            </h1>
          </div>
          <p className="text-xs font-mono text-[var(--mist)] pl-7">
            Seçtiğiniz varlıkların çarpanlarını, temettü verimlerini, radar sağlık boyutlarını ve finansal performanslarını yan yana inceleyin.
          </p>
        </div>

        {/* Selected Badges & Add Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedSymbols.map((sym) => (
            <span
              key={sym}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--ink-2)] border border-[var(--brass-dim)] text-xs font-mono font-bold text-[var(--paper)] shadow"
            >
              <span>{sym}</span>
              <button
                type="button"
                onClick={() => handleRemoveSymbol(sym)}
                className="text-[var(--mist)] hover:text-[var(--loss)] p-0.5 rounded cursor-pointer transition-colors"
                title="Kaldır"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedSymbols.length < 4 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-bold font-mono transition-all shadow active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Varlık Ekle ({selectedSymbols.length}/4)</span>
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--mist)] absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Şirket, fon veya emtia ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg pl-8 pr-2 py-1.5 text-xs font-mono text-[var(--paper)] outline-none focus:border-[var(--brass)]"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-xs">
                    {availableCompanies.length === 0 ? (
                      <div className="p-2 text-center text-[var(--mist)] text-[11px]">Sonuç bulunamadı</div>
                    ) : (
                      availableCompanies.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleAddSymbol(c.symbol)}
                          className="w-full text-left p-2 hover:bg-[var(--ink-3)] flex items-center justify-between transition-colors cursor-pointer rounded"
                        >
                          <div>
                            <span className="font-bold text-[var(--paper)] block">{c.symbol}</span>
                            <span className="text-[10px] text-[var(--mist)]">{c.name}</span>
                          </div>
                          <span className="text-[10px] text-[var(--brass)]">{formatPrice(c.price, c.currency)}</span>
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
          <h3 className="font-serif text-xl text-[var(--paper)] font-medium">Karşılaştırılacak Varlık Seçilmedi</h3>
          <p className="text-xs font-mono text-[var(--mist)] max-w-md mx-auto">
            Yukarıdaki &quot;Varlık Ekle&quot; butonuyla veya şirket detay sayfalarındaki &quot;Karşılaştır&quot; bağlantısıyla listeye en fazla 4 varlık ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Radar Dimension Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedCompanies.map((c, idx) => {
              const health = calculateCompanyHealth(c);
              const radarData = [
                { subject: "Değerleme", score: health.dimensions.valuation, fullMark: 100 },
                { subject: "Kârlılık", score: health.dimensions.profitability, fullMark: 100 },
                { subject: "Borçluluk", score: health.dimensions.leverage, fullMark: 100 },
                { subject: "Büyüme", score: health.dimensions.growth, fullMark: 100 },
                { subject: "Verim", score: health.dimensions.efficiency, fullMark: 100 },
              ];
              const colors = ["#10b981", "#38bdf8", "#f59e0b", "#a855f7"];
              return (
                <div
                  key={c.id}
                  className="bg-[var(--ink-2)] border border-[var(--line)] rounded-2xl p-4 flex flex-col items-center shadow-lg"
                >
                  <div className="flex items-center justify-between w-full mb-1 border-b border-[var(--line)] pb-2">
                    <span className="font-serif font-bold text-sm text-[var(--paper)]">{c.symbol}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(201,162,75,0.15)] text-[var(--brass)] border border-[var(--brass-dim)]">
                      Skor: {health.overallScore}/100
                    </span>
                  </div>
                  <HealthRadarChart data={radarData} color={colors[idx % colors.length]} />
                </div>
              );
            })}
          </div>

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
                          <div className="mt-1">
                            <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                          </div>
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
