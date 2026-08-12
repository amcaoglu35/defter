"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Bookmark,
  BookmarkCheck,
  Scale,
  X,
  Trash2,
  Filter,
  Check,
  Building2,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Company } from "@/lib/mockData";
import StampBadge from "@/components/StampBadge";

export default function SirketlerPage() {
  const { companies, addCompany, deleteCompany, toggleWatchlist } =
    useDefterStore();

  const [assetTab, setAssetTab] = useState<"hisse" | "maden" | "fon" | "doviz">("hisse");
  const [subTab, setSubTab] = useState<"all" | "watchlist">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPill, setFilterPill] = useState<string>("all");

  // Pagination (30 items per page by default)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);

  // Selection for comparison
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Reset filter pill and page when switching asset tabs
  const handleAssetTabChange = (tab: "hisse" | "maden" | "fon" | "doviz") => {
    setAssetTab(tab);
    setFilterPill("all");
    setCurrentPage(1);
  };

  // Reset page when search or subtab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [subTab, searchQuery, filterPill]);

  // Dynamic filter pill options per asset tab
  const filterPillOptions = useMemo(() => {
    switch (assetTab) {
      case "hisse":
        return [
          { id: "all", label: "Tümü" },
          { id: "bist30", label: "BIST 30" },
          { id: "bist100", label: "BIST 100" },
          { id: "us", label: "ABD Borsası" },
          { id: "eu", label: "Avrupa" },
          { id: "highDividend", label: "Yüksek Temettü (>%3)" },
          { id: "lowPe", label: "Düşük F/K (<10x)" },
        ];
      case "maden":
        return [
          { id: "all", label: "Tümü" },
          { id: "gold", label: "Altın Çeşitleri (Gram, Çeyrek, Ata)" },
          { id: "metals", label: "Gümüş & Platin" },
          { id: "commodities", label: "Enerji & Sanayi Emtiası" },
        ];
      case "fon":
        return [
          { id: "all", label: "Tümü" },
          { id: "tefas", label: "TEFAS Yerli / Yabancı Hisse" },
          { id: "etf", label: "Küresel Borsa Yatırım Fonu (ETF)" },
        ];
      case "doviz":
        return [
          { id: "all", label: "Tümü" },
          { id: "tl", label: "TL Kurları" },
          { id: "cross", label: "Çapraz Pariteler" },
        ];
    }
  }, [assetTab]);

  // Add Company Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newName, setNewName] = useState("");
  const [newSector, setNewSector] = useState("Sanayi & Üretim");
  const [newPrice, setNewPrice] = useState("");
  const [newAssetClass, setNewAssetClass] = useState<"hisse" | "maden" | "fon" | "doviz">("hisse");
  const [newExchange, setNewExchange] = useState<"BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz">("BIST");
  const [newRecommendation, setNewRecommendation] = useState<"AL" | "SAT" | "TUT" | "NÖTR">("AL");

  const toggleSelect = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
    } else {
      if (selectedSymbols.length >= 3) {
        alert("En fazla 3 şirket aynı anda karşılaştırılabilir.");
        return;
      }
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newName || !newPrice) return;

    const co: Company = {
      id: newSymbol.toLowerCase(),
      symbol: newSymbol.toUpperCase(),
      name: newName,
      sector: newSector,
      exchange: newExchange,
      assetClass: newAssetClass,
      indexTag: newExchange === "BIST" ? "BIST 100" : "S&P 500",
      price: parseFloat(newPrice) || 100,
      currency: newExchange === "ABD" ? "$" : "₺",
      dailyChange: 0.0,
      peRatio: 9.5,
      pbRatio: 1.8,
      dividendYield: 3.2,
      marketCap: "50 Mr ₺",
      beta: 1.05,
      recommendation: newRecommendation,
      inWatchlist: true,
      description: "Kütüğe manuel olarak kaydedilen yatırım varlığı.",
      metrics: [
        { label: "F/K Oranı", value: "9.5x", peerAvg: "11.2x" },
        { label: "PD/DD", value: "1.80", peerAvg: "2.10" },
      ],
    };

    addCompany(co);
    setNewSymbol("");
    setNewName("");
    setNewPrice("");
    setAddModalOpen(false);
  };

  const handleDelete = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`${symbol} varlığını kütükten silmek istediğinize emin misiniz?`)) {
      deleteCompany(symbol);
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
    }
  };

  // Filtered dataset
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      // 1. Resolve asset class with fallback
      const currentAssetClass =
        c.assetClass ||
        (c.exchange === "Emtia" ||
        c.symbol?.includes("ALTIN") ||
        c.symbol?.includes("GÜMÜŞ") ||
        c.symbol?.includes("PLATIN") ||
        ["CEYREK", "TAM", "ATA", "BRENT", "BAKIR"].includes(c.symbol)
          ? "maden"
          : c.exchange === "Döviz" ||
            c.symbol?.includes("/TRY") ||
            c.symbol?.includes("/USD")
          ? "doviz"
          : c.sector?.includes("Fon") ||
            ["AFT", "TTE", "MAC", "QQQ", "SPY", "GLD"].includes(c.symbol)
          ? "fon"
          : "hisse");

      if (currentAssetClass !== assetTab) return false;

      // 2. Sub tab
      if (subTab === "watchlist" && !c.inWatchlist) return false;

      // 3. Search query
      if (
        searchQuery &&
        !c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.sector.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 4. Dynamic filter pill
      if (filterPill !== "all") {
        if (filterPill === "bist30" && c.indexTag !== "BIST 30") return false;
        if (filterPill === "bist100" && !["BIST 30", "BIST 100"].includes(c.indexTag || "")) return false;
        if (filterPill === "us" && c.exchange !== "ABD") return false;
        if (filterPill === "eu" && c.exchange !== "Avrupa") return false;
        if (filterPill === "highDividend" && (!c.dividendYield || c.dividendYield < 3.0)) return false;
        if (filterPill === "lowPe" && (!c.peRatio || c.peRatio > 10.0)) return false;
        if (filterPill === "gold" && !["ALTIN/GR", "CEYREK", "TAM", "ATA"].includes(c.symbol)) return false;
        if (filterPill === "metals" && !["GÜMÜŞ/GR", "PLATIN/GR"].includes(c.symbol)) return false;
        if (filterPill === "commodities" && !["BRENT", "BAKIR"].includes(c.symbol)) return false;
        if (filterPill === "tefas" && !["AFT", "TTE", "MAC"].includes(c.symbol)) return false;
        if (filterPill === "etf" && !["QQQ", "SPY", "GLD"].includes(c.symbol)) return false;
        if (filterPill === "tl" && !c.symbol.endsWith("/TRY")) return false;
        if (filterPill === "cross" && c.symbol.endsWith("/TRY")) return false;
      }

      return true;
    });
  }, [companies, assetTab, subTab, searchQuery, filterPill]);

  const totalCount = filteredCompanies.length;
  const totalPages = pageSize === 0 ? 1 : Math.ceil(totalCount / pageSize) || 1;

  const paginatedCompanies = useMemo(() => {
    if (pageSize === 0) return filteredCompanies;
    const start = (currentPage - 1) * pageSize;
    return filteredCompanies.slice(start, start + pageSize);
  }, [filteredCompanies, currentPage, pageSize]);

  const comparedCompanies = companies.filter((c) =>
    selectedSymbols.includes(c.symbol)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <span className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
            Portföy Kütüğü
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--paper)] font-medium mt-1">
            Şirketler &amp; Varlık Listesi
          </h1>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-semibold text-sm px-4 py-2.5 rounded-sm flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Varlık Ekle</span>
        </button>
      </div>

      {/* 2. Asset Class Tabs */}
      <div className="flex gap-2 border-b border-[var(--line)] overflow-x-auto pb-[1px]">
        {[
          { id: "hisse", label: "Hisse Senetleri", count: companies.filter((c) => c.assetClass === "hisse").length },
          { id: "maden", label: "Kıymetli Madenler & Emtia", count: companies.filter((c) => c.assetClass === "maden").length },
          { id: "fon", label: "Yatırım Fonları & ETF", count: companies.filter((c) => c.assetClass === "fon").length },
          { id: "doviz", label: "Döviz Kurları & Parite", count: companies.filter((c) => c.assetClass === "doviz").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleAssetTabChange(tab.id as any)}
            className={`px-5 py-3 text-sm font-semibold rounded-t-md transition-all cursor-pointer whitespace-nowrap border-t border-x flex items-center gap-2 ${
              assetTab === tab.id
                ? "bg-[var(--ink)] text-[var(--brass)] border-[var(--line)] border-b-transparent relative z-10"
                : "bg-[var(--ink-2)] text-[var(--mist)] border-transparent hover:text-[var(--paper)]"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
              assetTab === tab.id
                ? "bg-[rgba(201,162,75,0.15)] text-[var(--brass)]"
                : "bg-[var(--ink-3)] text-[var(--mist)]"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Sub Tabs & Toolbar */}
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-6 border-b border-[var(--line)] pb-3">
          <button
            onClick={() => setSubTab("all")}
            className={`font-mono text-xs uppercase tracking-wider pb-1 transition-colors cursor-pointer border-b-2 ${
              subTab === "all"
                ? "border-[var(--brass)] text-[var(--brass)] font-bold"
                : "border-transparent text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            Kütük ({companies.filter((c) => c.assetClass === assetTab).length})
          </button>
          <button
            onClick={() => setSubTab("watchlist")}
            className={`font-mono text-xs uppercase tracking-wider pb-1 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              subTab === "watchlist"
                ? "border-[var(--brass)] text-[var(--brass)] font-bold"
                : "border-transparent text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>İzleme Listem ({companies.filter((c) => c.inWatchlist && c.assetClass === assetTab).length})</span>
          </button>
        </div>

        {/* Search & Filter pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Şirket adı, sembol veya sektör ara..."
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-md pl-10 pr-4 py-2 text-sm text-[var(--paper)] placeholder-[var(--mist)] focus:outline-none focus:border-[var(--brass)] font-sans"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[var(--mist)]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-[var(--mist)] hover:text-[var(--paper)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-[var(--mist)] uppercase tracking-wider mr-1">
              Filtre:
            </span>
            {filterPillOptions.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterPill(pill.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                  filterPill === pill.id
                    ? "bg-[var(--brass)] text-[var(--ink)] border-[var(--brass)] font-semibold shadow-sm"
                    : "border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Ledger Table */}
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-[30px_1.5fr_100px_100px_90px_90px_110px_90px_40px] gap-4 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
          <span>Seç</span>
          <span>Varlık / Şirket</span>
          <span className="text-right">Fiyat</span>
          <span className="text-right">Günlük %</span>
          <span className="text-right">F/K</span>
          <span className="text-right">Temettü</span>
          <span className="text-center">Karar Mührü</span>
          <span className="text-right">İzleme</span>
          <span className="text-right">Sil</span>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full border border-dashed border-[var(--brass-dim)] text-[var(--brass)] font-serif italic text-2xl mx-auto flex items-center justify-center mb-3">
              ∅
            </div>
            <h3 className="font-serif text-lg text-[var(--paper)] font-medium">
              Eşleşen Varlık Bulunamadı
            </h3>
            <p className="text-xs text-[var(--mist)] mt-1 max-w-sm mx-auto">
              Arama kriterlerinizi değiştirin veya &quot;Yeni Varlık Ekle&quot; butonuyla kütüğe yeni kayıt ekleyin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dashed divide-[var(--line)]">
            {paginatedCompanies.map((c) => {
              const isSelected = selectedSymbols.includes(c.symbol);

              return (
                <div
                  key={c.id}
                  className={`grid grid-cols-1 md:grid-cols-[30px_1.5fr_100px_100px_90px_90px_110px_90px_40px] gap-3 md:gap-4 p-4 md:px-6 md:py-3.5 items-center transition-colors ${
                    isSelected
                      ? "bg-[rgba(201,162,75,0.08)]"
                      : "hover:bg-[rgba(201,162,75,0.04)]"
                  }`}
                >
                  {/* Select Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(c.symbol)}
                      className="accent-[var(--brass)] w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* Company Mark & Symbol */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-xs font-bold text-[var(--brass)] shrink-0">
                      {c.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <Link
                        href={`/sirketler/${c.symbol}`}
                        className="font-medium text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors"
                      >
                        {c.name}
                      </Link>
                      <div className="text-xs text-[var(--mist)] font-mono">
                        {c.symbol} • {c.sector}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right font-mono text-sm font-semibold text-[var(--paper)]">
                    {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}{" "}
                    {c.currency}
                  </div>

                  {/* Daily Change */}
                  <div
                    className={`text-right font-mono text-sm font-semibold ${
                      c.dailyChange >= 0
                        ? "text-[var(--verdigris)]"
                        : "text-[var(--loss)]"
                    }`}
                  >
                    {c.dailyChange >= 0 ? "+" : ""}
                    {c.dailyChange}%
                  </div>

                  {/* F/K */}
                  <div className="text-right font-mono text-xs text-[var(--mist)]">
                    {c.peRatio ? `${c.peRatio}x` : "-"}
                  </div>

                  {/* Dividend */}
                  <div className="text-right font-mono text-xs text-[var(--paper-dim)]">
                    {c.dividendYield ? `%${c.dividendYield}` : "-"}
                  </div>

                  {/* Stamp Badge */}
                  <div className="text-center">
                    <StampBadge verdict={c.recommendation} />
                  </div>

                  {/* Watchlist toggle */}
                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(c.symbol);
                      }}
                      className={`p-1.5 rounded border transition-colors cursor-pointer ${
                        c.inWatchlist
                          ? "border-[var(--brass)] text-[var(--brass)] bg-[var(--brass-glow)]"
                          : "border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                      }`}
                      title={c.inWatchlist ? "İzleme listesinden çıkar" : "İzleme listesine ekle"}
                    >
                      {c.inWatchlist ? (
                        <BookmarkCheck className="w-4 h-4 text-[var(--brass)]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Delete button */}
                  <div className="text-right">
                    <button
                      onClick={(e) => handleDelete(c.symbol, e)}
                      className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors"
                      title="Kütükten Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4.1 Pagination Controls Bar */}
        {totalCount > 0 && (
          <div className="px-6 py-4 border-t border-[var(--line)] bg-[var(--ink-3)] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="text-[var(--mist)]">
              Toplam <span className="text-[var(--brass)] font-bold">{totalCount}</span> varlıktan{" "}
              <span className="text-[var(--paper)] font-semibold">
                {pageSize === 0
                  ? `1 - ${totalCount}`
                  : `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                      currentPage * pageSize,
                      totalCount
                    )}`}
              </span>{" "}
              arası listeleniyor (Sayfa {currentPage} / {totalPages})
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Page size selector */}
              <div className="flex items-center gap-1.5 mr-2 text-[var(--mist)]">
                <span className="text-[10px] uppercase tracking-wider">Sayfa Başı:</span>
                {[30, 60, 100, 0].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      pageSize === size
                        ? "bg-[var(--brass)] text-[var(--ink)]"
                        : "text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-2)] border border-[var(--line)]"
                    }`}
                  >
                    {size === 0 ? "Tümü" : size}
                  </button>
                ))}
              </div>

              {/* Page numbers navigation */}
              {pageSize !== 0 && totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="İlk Sayfa"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Önceki Sayfa"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - currentPage) <= 1
                    )
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      return (
                        <React.Fragment key={p}>
                          {prev && p - prev > 1 && (
                            <span className="text-[var(--mist)] px-1">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(p)}
                            className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                              currentPage === p
                                ? "bg-[var(--brass)] text-[var(--ink)]"
                                : "border border-[var(--line)] bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)]"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Sonraki Sayfa"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Son Sayfa"
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. Floating Compare Bar */}
      {selectedSymbols.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--paper)] text-[var(--ink)] px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-5 animate-in fade-in slide-in-from-bottom-4">
          <div className="font-mono text-xs font-bold flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--brass-dim)]" />
            <span>{selectedSymbols.length} Varlık Seçildi ({selectedSymbols.join(", ")})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="bg-[var(--ink)] text-[var(--brass)] hover:bg-[var(--ink-2)] text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-colors"
            >
              Karşılaştır
            </button>
            <button
              onClick={() => setSelectedSymbols([])}
              className="text-[var(--ink)] opacity-60 hover:opacity-100 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Compare Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--brass)]" />
                <h3 className="font-serif text-xl font-semibold text-[var(--paper)]">
                  Şirket Karşılaştırma Matrisi
                </h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 rounded-full border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--brass)] uppercase">
                  <th className="py-3 px-2 font-sans font-normal">Metrik</th>
                  {comparedCompanies.map((c) => (
                    <th key={c.id} className="py-3 px-2 text-right">
                      {c.symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-[var(--line)]">
                <tr>
                  <td className="py-3 px-2 text-[var(--mist)] font-sans">Şirket Adı</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-2 text-right text-[var(--paper)] font-sans font-medium">
                      {c.name}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--mist)] font-sans">Fiyat</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-2 text-right font-bold text-[var(--paper)]">
                      {c.price} {c.currency}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--mist)] font-sans">F/K Oranı</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-2 text-right text-[var(--paper)]">
                      {c.peRatio ? `${c.peRatio}x` : "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--mist)] font-sans">PD/DD</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-2 text-right text-[var(--paper)]">
                      {c.pbRatio ? `${c.pbRatio}x` : "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--mist)] font-sans">Temettü Verimi</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-2 text-right text-[var(--verdigris)]">
                      {c.dividendYield ? `%${c.dividendYield}` : "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--mist)] font-sans">Piyasa Değeri</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-2 text-right text-[var(--paper)]">
                      {c.marketCap ?? "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--mist)] font-sans">Orakul Tavsiyesi</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-2 text-right">
                      <StampBadge verdict={c.recommendation} />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Add Company Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-5">
              <h3 className="font-serif text-lg font-semibold text-[var(--paper)]">
                Kütüğe Yeni Varlık Kaydet
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-[var(--mist)] hover:text-[var(--paper)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Varlık Sınıfı
                  </label>
                  <select
                    value={newAssetClass}
                    onChange={(e) => setNewAssetClass(e.target.value as any)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] outline-none"
                  >
                    <option value="hisse">Hisse Senedi</option>
                    <option value="maden">Kıymetli Maden</option>
                    <option value="fon">Yatırım Fonu</option>
                    <option value="doviz">Döviz Kuru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Borsa / Pazar
                  </label>
                  <select
                    value={newExchange}
                    onChange={(e) => setNewExchange(e.target.value as any)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] outline-none"
                  >
                    <option value="BIST">Borsa İstanbul (BIST)</option>
                    <option value="ABD">ABD (NASDAQ/NYSE)</option>
                    <option value="Avrupa">Avrupa</option>
                    <option value="Emtia">Emtia / Maden</option>
                    <option value="Döviz">Serbest Piyasa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                  Hisse / Varlık Sembolü
                </label>
                <input
                  type="text"
                  required
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="Örn: PGSUS, SISE, KRDMD"
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-sm text-[var(--paper)] font-mono uppercase focus:border-[var(--brass)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                  Şirket / Varlık Tam Adı
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Örn: Pegasus Hava Taşımacılığı"
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-sm text-[var(--paper)] focus:border-[var(--brass)] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Sektör
                  </label>
                  <input
                    type="text"
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-sm text-[var(--paper)] focus:border-[var(--brass)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Fiyat ({newExchange === "ABD" ? "$" : "₺"})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="245.50"
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-sm text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 border border-[var(--line)] py-2.5 rounded text-sm text-[var(--mist)] hover:text-[var(--paper)]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[var(--brass)] text-[var(--ink)] font-bold py-2.5 rounded text-sm hover:bg-[#d9b35a]"
                >
                  Kütüğe Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
