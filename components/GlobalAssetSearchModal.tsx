"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Plus,
  Check,
  Globe,
  TrendingUp,
  TrendingDown,
  Loader2,
  X,
  ExternalLink,
  Shield,
  Sparkles,
  Building2,
  PieChart,
} from "lucide-react";
import { Company } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import { useDefterStore } from "@/lib/store";

interface SearchResultItem {
  symbol: string;
  cleanSymbol: string;
  name: string;
  exchange: "BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz";
  exchangeDisplay: string;
  quoteType: string;
  sector?: string;
  currency: string;
  assetClass: "hisse" | "fon" | "maden" | "doviz";
}

interface GlobalAssetSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function GlobalAssetSearchModal({
  isOpen,
  onClose,
  initialQuery = "",
}: GlobalAssetSearchModalProps) {
  const { companies, addCompany } = useDefterStore();
  const { showToast } = useToast();

  const [query, setQuery] = useState(initialQuery);
  const [marketFilter, setMarketFilter] = useState<"all" | "ABD" | "BIST" | "Avrupa" | "fon">("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResultItem | null>(null);
  const [lookupData, setLookupData] = useState<Partial<Company> | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef<boolean>(true);

  // Debounced search
  const performSearch = useCallback(async (searchTxt: string) => {
    const q = searchTxt.trim();
    if (!q || q.length < 1) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/prices/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (isMountedRef.current && json.success && Array.isArray(json.results)) {
        setResults(json.results);
      } else if (isMountedRef.current) {
        setResults([]);
      }
    } catch {
      if (isMountedRef.current) setResults([]);
    } finally {
      if (isMountedRef.current) setIsSearching(false);
    }
  }, []);

  // Sync initial query
  useEffect(() => {
    isMountedRef.current = true;
    if (isOpen) {
      setQuery(initialQuery);
      if (initialQuery.trim().length > 0) {
        performSearch(initialQuery);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSelectedResult(null);
      setLookupData(null);
      setResults([]);
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [isOpen, initialQuery, performSearch]);

  // Handle Query Change with debounce
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, isOpen, performSearch]);

  // Handle selecting a search result for detailed lookup
  const handleSelectResult = async (item: SearchResultItem) => {
    setSelectedResult(item);
    setIsLookupLoading(true);
    setLookupData(null);

    try {
      const res = await fetch(`/api/prices/lookup?symbol=${encodeURIComponent(item.symbol)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLookupData(json.data);
      } else {
        showToast("Veri Alınamadı", "Varlık detayları çekilemedi.", "warning");
      }
    } catch {
      showToast("Hata", "Canlı finansal verilere ulaşılamadı.", "error");
    } finally {
      setIsLookupLoading(false);
    }
  };

  // Add Company to local store / database
  const handleAddSelectedCompany = () => {
    if (!selectedResult) return;

    const sym = selectedResult.cleanSymbol.toUpperCase();
    const isAlreadyAdded = companies.some((c) => c.symbol.toUpperCase() === sym);

    if (isAlreadyAdded) {
      showToast("Zaten Ekli", `${sym} sembolü kütüğünüzde zaten kayıtlı.`, "info");
      return;
    }

    setIsSaving(true);

    const baseCo: Company = {
      id: sym.toLowerCase().replace(/[^a-z0-9]/g, ""),
      symbol: sym,
      name: lookupData?.name || selectedResult.name,
      sector: lookupData?.sector || selectedResult.sector || "Genel",
      exchange: selectedResult.exchange,
      assetClass: selectedResult.assetClass,
      indexTag:
        selectedResult.exchange === "BIST"
          ? "BIST 100"
          : selectedResult.exchange === "Avrupa"
          ? "Avrupa"
          : selectedResult.assetClass === "fon"
          ? "ETF"
          : "S&P 500",
      price: lookupData?.price || 100,
      currency: lookupData?.currency || selectedResult.currency,
      dailyChange: lookupData?.dailyChange || 0,
      peRatio: lookupData?.peRatio,
      pbRatio: lookupData?.pbRatio,
      dividendYield: lookupData?.dividendYield,
      marketCap: lookupData?.marketCap,
      beta: lookupData?.beta,
      high52: lookupData?.high52,
      low52: lookupData?.low52,
      targetMeanPrice: lookupData?.targetMeanPrice,
      targetHighPrice: lookupData?.targetHighPrice,
      targetLowPrice: lookupData?.targetLowPrice,
      targetUpsidePct: lookupData?.targetUpsidePct,
      recommendation: lookupData?.recommendation || "AL",
      inWatchlist: true,
      description: lookupData?.description || `${sym} kayıtlı yatırım varlığı.`,
      metrics: lookupData?.metrics || [
        ...(lookupData?.peRatio ? [{ label: "F/K Oranı", value: `${lookupData.peRatio}x` }] : []),
        ...(lookupData?.pbRatio ? [{ label: "PD/DD", value: `${lookupData.pbRatio}` }] : []),
      ],
      ceo: lookupData?.ceo,
      fullTimeEmployees: lookupData?.fullTimeEmployees,
      website: lookupData?.website,
      city: lookupData?.city,
    };

    addCompany(baseCo);
    setIsSaving(false);
    showToast(
      "Kütüğe Eklendi",
      `${sym} (${baseCo.name}) başarıyla kütüğe aktarıldı. Canlı fiyatlar otomatik güncellenecek.`,
      "success"
    );
  };

  // Quick 1-click add from list item
  const handleQuickAdd = async (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    const sym = item.cleanSymbol.toUpperCase();
    if (companies.some((c) => c.symbol.toUpperCase() === sym)) {
      showToast("Zaten Ekli", `${sym} kütükte mevcut.`, "info");
      return;
    }

    try {
      showToast("İçe Aktarılıyor", `${sym} için canlı veriler çekiliyor...`, "info");
      const res = await fetch(`/api/prices/lookup?symbol=${encodeURIComponent(item.symbol)}`);
      const json = await res.json();
      const data: Partial<Company> = json.success && json.data ? json.data : {};

      const baseCo: Company = {
        id: sym.toLowerCase().replace(/[^a-z0-9]/g, ""),
        symbol: sym,
        name: data.name || item.name,
        sector: data.sector || item.sector || "Genel",
        exchange: item.exchange,
        assetClass: item.assetClass,
        indexTag:
          item.exchange === "BIST"
            ? "BIST 100"
            : item.exchange === "Avrupa"
            ? "Avrupa"
            : item.assetClass === "fon"
            ? "ETF"
            : "S&P 500",
        price: data.price || 100,
        currency: data.currency || item.currency,
        dailyChange: data.dailyChange || 0,
        peRatio: data.peRatio,
        pbRatio: data.pbRatio,
        dividendYield: data.dividendYield,
        marketCap: data.marketCap,
        beta: data.beta,
        high52: data.high52,
        low52: data.low52,
        targetMeanPrice: data.targetMeanPrice,
        targetHighPrice: data.targetHighPrice,
        targetLowPrice: data.targetLowPrice,
        targetUpsidePct: data.targetUpsidePct,
        recommendation: data.recommendation || "AL",
        inWatchlist: true,
        description: data.description || `${sym} kayıtlı yatırım varlığı.`,
        metrics: data.metrics || [],
      };

      addCompany(baseCo);
      showToast("Kütüğe Eklendi", `${sym} (${baseCo.name}) kütüğe başarıyla aktarıldı.`, "success");
    } catch {
      showToast("Hata", `${sym} eklenirken bir problem oluştu.`, "error");
    }
  };

  if (!isOpen) return null;

  const filteredResults = results.filter((r) => {
    if (marketFilter === "all") return true;
    if (marketFilter === "fon") return r.assetClass === "fon";
    return r.exchange === marketFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--line)] pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-[var(--brass)]" />
              <span className="font-mono text-xs uppercase text-[var(--brass)] font-semibold tracking-wider">
                Global Varlık &amp; Ticker Arama Motoru
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--paper)]">
              Dünya Borsalarından Şirket &amp; Varlık Ekle
            </h3>
            <p className="text-xs text-[var(--mist)] font-sans mt-0.5">
              NASDAQ, NYSE, XETRA (Almanya), Euronext (Fransa), BIST veya TEFAS&apos;tan istediğiniz hisse senedi veya ETF&apos;i arayın ve tek tıkla canlı verileriyle kütüğe aktarın.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1.5 rounded-lg hover:bg-[var(--ink-3)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="space-y-2 shrink-0">
          <div className="relative">
            <Search className="w-5 h-5 text-[var(--brass)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sembol veya şirket adı yazın (Örn: NVDA, ASML, SAP, PLTR, MC.PA, THYAO, TUPRS, MAC)..."
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] focus:border-[var(--brass)] rounded-xl pl-11 pr-10 py-3 text-sm text-[var(--paper)] font-mono outline-none shadow-inner transition-all placeholder:text-[var(--mist)]"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-[var(--brass)] absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <span className="text-[var(--mist)] text-[10px] uppercase mr-1">Filtrele:</span>
            {([
              { id: "all", label: "Tüm Borsalar" },
              { id: "ABD", label: "🇺🇸 ABD (NASDAQ/NYSE)" },
              { id: "BIST", label: "🇹🇷 Borsa İstanbul" },
              { id: "Avrupa", label: "🇪🇺 Avrupa (DAX/CAC)" },
              { id: "fon", label: "📊 ETF & Fonlar" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMarketFilter(tab.id)}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                  marketFilter === tab.id
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)] shadow-sm"
                    : "bg-[var(--ink-3)] text-[var(--paper-dim)] border-[var(--line)] hover:border-[var(--brass-dim)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area: Two Column Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto flex-1 min-h-[300px] pr-1">
          {/* Left Column: Results List (5 cols) */}
          <div className="lg:col-span-5 space-y-2 overflow-y-auto max-h-[440px] pr-1">
            {filteredResults.length === 0 && !isSearching && query.trim().length > 0 && (
              <div className="p-8 text-center bg-[var(--ink-3)] border border-dashed border-[var(--line)] rounded-xl space-y-2">
                <Search className="w-8 h-8 text-[var(--mist)] mx-auto opacity-40" />
                <p className="text-xs text-[var(--mist)] font-mono">
                  &ldquo;{query}&rdquo; için global arama sonucu bulunamadı.
                </p>
                <p className="text-[11px] text-[var(--mist)]">
                  Farklı bir ticker (örn. SAP.DE, MC.PA, ASML) veya İngilizce şirket ismi deneyebilirsiniz.
                </p>
              </div>
            )}

            {filteredResults.length === 0 && query.trim().length === 0 && (
              <div className="p-6 text-center bg-[var(--ink-3)]/60 border border-[var(--line)] rounded-xl space-y-3 font-mono text-xs">
                <Sparkles className="w-6 h-6 text-[var(--brass)] mx-auto animate-pulse" />
                <p className="text-[var(--paper)] font-bold">Popüler Global Varlıkları Deneyin</p>
                <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                  {["NVDA", "ASML", "PLTR", "ARM", "SAP.DE", "MC.PA", "TUPRS", "MAC"].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => setQuery(sym)}
                      className="px-2.5 py-1 bg-[var(--ink-2)] hover:bg-[var(--ink)] border border-[var(--line)] hover:border-[var(--brass)] rounded text-[11px] text-[var(--brass)] cursor-pointer transition-all"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredResults.map((item) => {
              const isAdded = companies.some(
                (c) => c.symbol.toUpperCase() === item.cleanSymbol.toUpperCase()
              );
              const isSelected = selectedResult?.symbol === item.symbol;

              return (
                <div
                  key={item.symbol}
                  onClick={() => handleSelectResult(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[var(--ink-3)] border-[var(--brass)] shadow-lg"
                      : "bg-[var(--ink-3)]/60 border-[var(--line)] hover:border-[var(--brass-dim)] hover:bg-[var(--ink-3)]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[var(--paper)]">
                        {item.cleanSymbol}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--ink-2)] border border-[var(--line)] text-[var(--brass)] uppercase font-semibold">
                        {item.exchangeDisplay}
                      </span>
                      <span className="text-[10px] text-[var(--mist)] font-mono">{item.currency}</span>
                    </div>
                    <p className="text-xs text-[var(--paper-dim)] truncate font-sans mt-0.5">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-[var(--mist)] font-mono block mt-0.5 truncate">
                      {item.sector}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isAdded ? (
                      <span className="font-mono text-[10px] px-2 py-1 rounded bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)] flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3" /> Ekli
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        className="p-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--brass)] hover:text-[var(--ink)] text-[var(--brass)] border border-[var(--line)] hover:border-[var(--brass)] transition-all cursor-pointer"
                        title="Hemen Kütüğe Ekle"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Asset Live Preview Card (7 cols) */}
          <div className="lg:col-span-7 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl p-5 overflow-y-auto max-h-[440px] flex flex-col justify-between">
            {selectedResult ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-dashed border-[var(--line)] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-xl text-[var(--paper)]">
                        {lookupData?.name || selectedResult.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-[var(--brass)] mt-0.5 font-semibold">
                      <span>{selectedResult.cleanSymbol}</span>
                      <span>•</span>
                      <span>{selectedResult.exchangeDisplay}</span>
                      <span>•</span>
                      <span className="text-[var(--paper-dim)]">{lookupData?.sector || selectedResult.sector}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xl font-bold text-[var(--paper)]">
                      {isLookupLoading ? (
                        <span className="text-xs text-[var(--mist)] animate-pulse">Fiyat çekiliyor...</span>
                      ) : lookupData?.price ? (
                        `${lookupData.price.toLocaleString("tr-TR")} ${lookupData.currency}`
                      ) : (
                        "—"
                      )}
                    </div>
                    {lookupData?.dailyChange != null && (
                      <span
                        className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                          lookupData.dailyChange >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                        }`}
                      >
                        {lookupData.dailyChange >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {lookupData.dailyChange >= 0 ? "+" : ""}
                        {lookupData.dailyChange}%
                      </span>
                    )}
                  </div>
                </div>

                {isLookupLoading ? (
                  <div className="py-12 text-center space-y-2 font-mono text-xs text-[var(--mist)]">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--brass)] mx-auto" />
                    <p>Yahoo Finance &amp; Borsalardan Canlı Finansal Veriler Çekiliyor...</p>
                  </div>
                ) : (
                  <>
                    {/* Live Fundamental Multiples Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                      <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                        <span className="text-[9px] text-[var(--mist)] uppercase block">F/K Oranı (P/E)</span>
                        <span className="font-bold text-[var(--paper)]">
                          {lookupData?.peRatio ? `${lookupData.peRatio}x` : "—"}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                        <span className="text-[9px] text-[var(--mist)] uppercase block">PD / DD (P/B)</span>
                        <span className="font-bold text-[var(--paper)]">
                          {lookupData?.pbRatio ? `${lookupData.pbRatio}x` : "—"}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                        <span className="text-[9px] text-[var(--mist)] uppercase block">Temettü Verimi</span>
                        <span className="font-bold text-[var(--verdigris)]">
                          {lookupData?.dividendYield ? `%${lookupData.dividendYield}` : "—"}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                        <span className="text-[9px] text-[var(--mist)] uppercase block">Piyasa Değeri</span>
                        <span className="font-bold text-[var(--paper)] truncate block">
                          {lookupData?.marketCap || "—"}
                        </span>
                      </div>
                    </div>

                    {/* 52-Week Range Bar */}
                    {lookupData?.high52 && lookupData?.low52 && lookupData?.price && (
                      <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg space-y-1 font-mono text-xs">
                        <div className="flex justify-between text-[10px] text-[var(--mist)]">
                          <span>52H Dip: {lookupData.low52} {lookupData.currency}</span>
                          <span className="text-[var(--brass)] font-semibold">52 Haftalık Fiyat Aralığı</span>
                          <span>52H Zirve: {lookupData.high52} {lookupData.currency}</span>
                        </div>
                        <div className="w-full bg-[var(--ink)] h-2 rounded-full overflow-hidden relative">
                          <div
                            className="bg-[var(--brass)] h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  5,
                                  ((lookupData.price - lookupData.low52) /
                                    (lookupData.high52 - lookupData.low52)) *
                                    100
                                )
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Analyst 12M Target */}
                    {lookupData?.targetMeanPrice && (
                      <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg flex items-center justify-between font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-[var(--mist)] uppercase block">
                            12 Aylık Analist Konsensüs Hedefi
                          </span>
                          <span className="font-bold text-sm text-[var(--paper)]">
                            {lookupData.targetMeanPrice} {lookupData.currency}
                          </span>
                        </div>
                        {lookupData.targetUpsidePct != null && (
                          <div className="text-right">
                            <span className="text-[10px] text-[var(--mist)] uppercase block">
                              Potansiyel Getiri
                            </span>
                            <span
                              className={`font-bold text-sm ${
                                lookupData.targetUpsidePct >= 0
                                  ? "text-[var(--verdigris)]"
                                  : "text-[var(--loss)]"
                              }`}
                            >
                              {lookupData.targetUpsidePct >= 0 ? "+" : ""}
                              %{lookupData.targetUpsidePct}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Description snippet */}
                    {lookupData?.description && (
                      <p className="text-xs text-[var(--paper-dim)] line-clamp-3 leading-relaxed font-sans bg-[var(--ink-2)]/50 p-2.5 rounded border border-[var(--line)]">
                        {lookupData.description}
                      </p>
                    )}
                  </>
                )}

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
                  <button
                    onClick={handleAddSelectedCompany}
                    disabled={
                      isSaving ||
                      isLookupLoading ||
                      companies.some(
                        (c) => c.symbol.toUpperCase() === selectedResult.cleanSymbol.toUpperCase()
                      )
                    }
                    className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                  >
                    {companies.some(
                      (c) => c.symbol.toUpperCase() === selectedResult.cleanSymbol.toUpperCase()
                    ) ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Bu Şirket Kütükte Zaten Kayıtlı</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{selectedResult.cleanSymbol} Varlığını Kütüğe Aktar (1-Tıkla)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 font-mono text-xs text-[var(--mist)]">
                <Building2 className="w-10 h-10 opacity-30 text-[var(--brass)]" />
                <p className="text-[var(--paper)] font-medium">Sol listeden bir varlık seçin</p>
                <p className="text-[11px] max-w-xs leading-relaxed">
                  Şirketin canlı piyasa fiyatı, F/K, PD/DD, temettü verimi ve analist hedefleri burada görüntülenecek ve kütüğünüze kaydedilecektir.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
