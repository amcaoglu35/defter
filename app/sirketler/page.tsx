"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Bookmark,
  BookmarkCheck,
  Scale,
  X,
  Trash2,
  Globe,
  Sparkles,
  RefreshCw,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { useDefterStore, inferAssetClass } from "@/lib/store";
import { Company } from "@/lib/mockData";
import StampBadge from "@/components/StampBadge";
import DataStatusBadge from "@/components/DataStatusBadge";
import MarketStatusBadge from "@/components/MarketStatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/ToastProvider";
import { isLiveSymbol } from "@/lib/liveSymbols";
import Sparkline from "@/components/Sparkline";
import GlobalAssetSearchModal from "@/components/GlobalAssetSearchModal";
import { StockScreenerBuilder } from "@/components/StockScreenerBuilder";
import { SlidersHorizontal } from "lucide-react";

export const currencyForExchange = (exchange: string): string => {
  if (exchange === "ABD") return "$";
  if (exchange === "Avrupa") return "€";
  return "₺";
};

export default function SirketlerPage() {
  const { companies, addCompany, deleteCompany, toggleWatchlist, transactions, baskets } =
    useDefterStore();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Local Reactive State (Immediate 0ms response on click) ---
  const [assetTab, setAssetTabState] = useState<"hisse" | "maden" | "fon" | "doviz">(() => {
    return (searchParams.get("tab") as "hisse" | "maden" | "fon" | "doviz") || "hisse";
  });
  const [subTab, setSubTabState] = useState<"all" | "watchlist">(() => {
    return (searchParams.get("sub") as "all" | "watchlist") || "all";
  });
  const [searchQuery, setSearchQueryState] = useState<string>(() => {
    return searchParams.get("q") || "";
  });
  const [filterPill, setFilterPillState] = useState<string>(() => {
    return searchParams.get("filter") || "all";
  });
  const [currentPage, setCurrentPageState] = useState<number>(() => {
    return Number(searchParams.get("page") || "1") || 1;
  });
  const [pageSize] = useState<number>(30);

  // Sync state changes with URL shallowly
  const syncUrl = useCallback(
    (updates: {
      tab?: string;
      sub?: string;
      q?: string;
      filter?: string;
      page?: number;
    }) => {
      try {
        const nextTab = updates.tab !== undefined ? updates.tab : assetTab;
        const nextSub = updates.sub !== undefined ? updates.sub : subTab;
        const nextQ = updates.q !== undefined ? updates.q : searchQuery;
        const nextFilter = updates.filter !== undefined ? updates.filter : filterPill;
        const nextPage = updates.page !== undefined ? updates.page : currentPage;

        const params = new URLSearchParams();
        if (nextTab && nextTab !== "hisse") params.set("tab", nextTab);
        if (nextSub && nextSub !== "all") params.set("sub", nextSub);
        if (nextQ) params.set("q", nextQ);
        if (nextFilter && nextFilter !== "all") params.set("filter", nextFilter);
        if (nextPage && nextPage > 1) params.set("page", String(nextPage));

        const url = `/sirketler${params.toString() ? `?${params.toString()}` : ""}`;
        window.history.replaceState(null, "", url);
      } catch {}
    },
    [assetTab, subTab, searchQuery, filterPill, currentPage]
  );

  const handleAssetTabChange = (tab: "hisse" | "maden" | "fon" | "doviz") => {
    setAssetTabState(tab);
    setFilterPillState("all");
    setCurrentPageState(1);
    syncUrl({ tab, filter: "all", page: 1, q: "" });
  };

  const handleSubTabChange = (sub: "all" | "watchlist") => {
    setSubTabState(sub);
    setCurrentPageState(1);
    syncUrl({ sub, page: 1 });
  };

  const handleSearchChange = (q: string) => {
    setSearchQueryState(q);
    setCurrentPageState(1);
    syncUrl({ q, page: 1 });
  };

  const handleFilterPillChange = (filter: string) => {
    setFilterPillState(filter);
    setCurrentPageState(1);
    syncUrl({ filter, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPageState(page);
    syncUrl({ page });
  };

  // Selection for comparison
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);

  // Confirm delete modal state
  const [companyToDelete, setCompanyToDelete] = useState<{ symbol: string; name: string; warningMsg: string } | null>(null);

  // Dynamic filter pill options per asset tab
  const filterPillOptions = useMemo(() => {
    switch (assetTab) {
      case "hisse":
        return [
          { id: "all", label: "Tümü" },
          { id: "bist30", label: "BIST 30" },
          { id: "bist100", label: "BIST 100" },
          { id: "volumeSpike", label: "⚡ Hacim Liderleri (>1.3x)" },
          { id: "athNear", label: "🎯 Zirvesine Yakın (<%15)" },
          { id: "athDiscount", label: "📉 52H İskontolu (>%20)" },
          { id: "us", label: "ABD Borsası" },
          { id: "eu", label: "Avrupa" },
          { id: "highDividend", label: "Yüksek Temettü (>%2.5)" },
          { id: "lowPe", label: "Düşük F/K (<12x)" },
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
          { id: "tefas", label: "TEFAS Yatırım Fonları" },
          { id: "etf", label: "Küresel ETF Fonları" },
        ];
      case "doviz":
        return [
          { id: "all", label: "Tümü" },
          { id: "tl", label: "TL Kurları (USD/TRY, EUR/TRY)" },
          { id: "cross", label: "Çapraz Pariteler (EUR/USD, GBP/USD)" },
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
  const [newMadenKategori, setNewMadenKategori] = useState<"altin" | "gumus_platin" | "enerji_sanayi">("altin");
  const [newExchange, setNewExchange] = useState<"BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz">("BIST");
  const [newRecommendation, setNewRecommendation] = useState<"AL" | "SAT" | "TUT" | "NÖTR">("AL");
  
  // Optional Financial Metrics Inputs
  const [newPeRatio, setNewPeRatio] = useState("");
  const [newPbRatio, setNewPbRatio] = useState("");
  const [newDividendYield, setNewDividendYield] = useState("");
  const [newMarketCap, setNewMarketCap] = useState("");
  const [newBeta, setNewBeta] = useState("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Global Asset Search Modal State
  const [globalSearchModalOpen, setGlobalSearchModalOpen] = useState(false);
  const [globalSearchInitial, setGlobalSearchInitial] = useState("");

  const handleAutoFillFromYahoo = async () => {
    const sym = newSymbol.trim().toUpperCase();
    if (!sym) {
      showToast("Sembol Girin", "Lütfen önce bir sembol (örn: NVDA, ASML, THYAO, MAC) yazın.", "warning");
      return;
    }
    setIsAutoFilling(true);
    try {
      const res = await fetch(`/api/prices/lookup?symbol=${encodeURIComponent(sym)}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.name) setNewName(d.name);
        if (d.sector) setNewSector(d.sector);
        if (d.price) setNewPrice(String(d.price));
        if (d.exchange) setNewExchange(d.exchange);
        if (d.assetClass) setNewAssetClass(d.assetClass);
        if (d.peRatio) setNewPeRatio(String(d.peRatio));
        if (d.pbRatio) setNewPbRatio(String(d.pbRatio));
        if (d.dividendYield) setNewDividendYield(String(d.dividendYield));
        if (d.marketCap) setNewMarketCap(d.marketCap);
        if (d.beta) setNewBeta(String(d.beta));
        if (d.recommendation) setNewRecommendation(d.recommendation);
        showToast("Otomatik Dolduruldu", `${sym} için canlı piyasa verileri başarıyla aktarıldı.`, "success");
      } else {
        showToast("Bulunamadı", "Varlık için canlı veri bulunamadı. Lütfen manuel giriniz.", "warning");
      }
    } catch {
      showToast("Hata", "Canlı veri servisine bağlanılamadı.", "error");
    } finally {
      setIsAutoFilling(false);
    }
  };

  const toggleSelect = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
    } else {
      if (selectedSymbols.length >= 3) {
        showToast("Karşılaştırma Sınırı", "Aynı anda en fazla 3 şirket karşılaştırılabilir.", "warning");
        return;
      }
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSymbol = newSymbol.trim().toUpperCase();
    const cleanName = newName.trim();
    const parsedPrice = parseFloat(newPrice);

    if (!cleanSymbol || !cleanName || isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast("Eksik Bilgi", "Lütfen sembol, isim ve geçerli bir fiyat girin.", "warning");
      return;
    }

    // Duplicate Check
    const exists = companies.some((c) => c.symbol.toUpperCase() === cleanSymbol);
    if (exists) {
      showToast("Zaten Kayıtlı", `${cleanSymbol} sembolü kütükte zaten mevcut.`, "warning");
      return;
    }

    const pe = newPeRatio ? parseFloat(newPeRatio) : undefined;
    const pb = newPbRatio ? parseFloat(newPbRatio) : undefined;
    const divYield = newDividendYield ? parseFloat(newDividendYield) : undefined;
    const betaVal = newBeta ? parseFloat(newBeta) : undefined;

    const co: Company = {
      id: cleanSymbol.toLowerCase(),
      symbol: cleanSymbol,
      name: cleanName,
      sector: newSector,
      exchange: newExchange,
      assetClass: newAssetClass,
      madenKategori: newAssetClass === "maden" ? newMadenKategori : undefined,
      indexTag: newExchange === "BIST" ? "BIST 100" : newExchange === "ABD" ? "S&P 500" : "DAX 40",
      price: parsedPrice,
      currency: currencyForExchange(newExchange),
      dailyChange: 0.0,
      peRatio: pe,
      pbRatio: pb,
      dividendYield: divYield,
      marketCap: newMarketCap.trim() || undefined,
      beta: betaVal,
      recommendation: newRecommendation,
      inWatchlist: true,
      description: "Kütüğe manuel olarak kaydedilen yatırım varlığı.",
      metrics: [
        ...(pe ? [{ label: "F/K Oranı", value: `${pe}x` }] : []),
        ...(pb ? [{ label: "PD/DD", value: `${pb}` }] : []),
      ],
    };

    addCompany(co);
    showToast("Varlık Eklendi", `${cleanSymbol} (${cleanName}) kütüğe başarıyla kaydedildi.`, "success");

    // Reset form
    setNewSymbol("");
    setNewName("");
    setNewPrice("");
    setNewMadenKategori("altin");
    setNewPeRatio("");
    setNewPbRatio("");
    setNewDividendYield("");
    setNewMarketCap("");
    setNewBeta("");
    setAddModalOpen(false);
  };

  const handleRequestDelete = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const relatedTxCount = transactions.filter((t) => t.companySymbol === symbol).length;
    const relatedBasketsCount = baskets.filter((b) =>
      b.holdings.some((h) => h.companySymbol === symbol)
    ).length;

    let warningMsg = `${symbol} varlığını kütükten silmek istediğinize emin misiniz?`;
    if (relatedTxCount > 0 || relatedBasketsCount > 0) {
      warningMsg = `⚠️ DİKKAT: ${symbol} şirketine ait ${relatedTxCount} adet işlem kaydı ve ${relatedBasketsCount} adet sepet pozisyonu bulunmaktadır!\n\nBu varlığı silmeniz durumunda ilgili sepetler ve portföy hesaplamaları etkilenebilir.`;
    }

    setCompanyToDelete({
      symbol,
      name: companies.find((c) => c.symbol === symbol)?.name || symbol,
      warningMsg,
    });
  };

  const handleConfirmDelete = () => {
    if (!companyToDelete) return;
    const sym = companyToDelete.symbol;
    deleteCompany(sym);
    setSelectedSymbols(selectedSymbols.filter((s) => s !== sym));
    showToast("Varlık Silindi", `${sym} kütükten kaldırıldı.`, "info");
    setCompanyToDelete(null);
  };

  // Filtered dataset
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const currentAssetClass = inferAssetClass(c);

      if (currentAssetClass !== assetTab) return false;

      if (subTab === "watchlist" && !c.inWatchlist) return false;

      if (
        searchQuery &&
        !c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.sector.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (filterPill !== "all") {
        if (filterPill === "bist30" && !c.indexTag?.includes("BIST 30")) return false;
        if (filterPill === "bist100" && !c.indexTag?.includes("BIST 100") && !c.indexTag?.includes("BIST 30")) return false;
        if (filterPill === "volumeSpike" && (!c.volumeRatio || c.volumeRatio < 1.25)) return false;
        if (filterPill === "athNear" && (c.athDiscountPct === undefined || c.athDiscountPct > 15.0)) return false;
        if (filterPill === "athDiscount" && (c.athDiscountPct === undefined || c.athDiscountPct < 20.0)) return false;
        if (filterPill === "us" && c.exchange !== "ABD") return false;
        if (filterPill === "eu" && c.exchange !== "Avrupa") return false;
        if (filterPill === "highDividend" && (!c.dividendYield || c.dividendYield < 2.5)) return false;
        if (filterPill === "lowPe" && (!c.peRatio || c.peRatio <= 0 || c.peRatio > 12.5)) return false;
        if (filterPill === "gold" && c.madenKategori !== "altin" && !c.symbol.includes("ALTIN") && !c.name.toLowerCase().includes("altın")) return false;
        if (filterPill === "metals" && c.madenKategori !== "gumus_platin" && !c.symbol.includes("GÜMÜŞ") && !c.symbol.includes("PLATIN")) return false;
        if (filterPill === "commodities" && c.madenKategori !== "enerji_sanayi" && c.exchange !== "Emtia") return false;
        if (filterPill === "tefas" && c.indexTag !== "TEFAS" && !c.sector?.includes("Fon")) return false;
        if (filterPill === "etf" && c.exchange !== "ABD" && c.indexTag !== "ETF" && !c.sector?.includes("ETF")) return false;
        if (filterPill === "tl" && !c.symbol?.includes("TRY") && !c.symbol?.includes("USD") && !c.symbol?.includes("EUR")) return false;
        if (filterPill === "cross" && c.symbol?.includes("TRY")) return false;
      }

      return true;
    });
  }, [companies, assetTab, subTab, searchQuery, filterPill]);

  // Tab-specific counts (Strictly counts only assets belonging to the currently active assetTab)
  const assetTabCompanies = useMemo(() => {
    return companies.filter((c) => inferAssetClass(c) === assetTab);
  }, [companies, assetTab]);

  const assetTabTotalCount = assetTabCompanies.length;
  const assetTabWatchlistCount = useMemo(() => {
    return assetTabCompanies.filter((c) => c.inWatchlist).length;
  }, [assetTabCompanies]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredCompanies.length / pageSize) || 1;

  // Clamp currentPage safely in useEffect when filtered dataset shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCompanies.slice(start, start + pageSize);
  }, [filteredCompanies, currentPage, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[var(--paper)]">
              Şirket &amp; Varlık Kütüğü
            </h1>
            <MarketStatusBadge />
          </div>
          <p className="font-mono text-xs text-[var(--mist)] mt-1">
            BIST 100, ABD/Avrupa Hisseleri, Kıymetli Madenler, TEFAS Fonları ve Döviz Kurları
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedSymbols.length > 0 && (
            <div className="flex items-center gap-2 bg-[var(--ink-2)] border border-[var(--brass-dim)] px-3 py-1.5 rounded text-xs font-mono">
              <span className="text-[var(--brass)] font-bold">{selectedSymbols.length}/3 Seçildi</span>
              <button
                onClick={() => setCompareModalOpen(true)}
                className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Karşılaştır</span>
              </button>
              <button
                onClick={() => setSelectedSymbols([])}
                className="text-[var(--mist)] hover:text-[var(--paper)] transition-colors cursor-pointer"
                title="Seçimi Temizle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setGlobalSearchInitial("");
              setGlobalSearchModalOpen(true);
            }}
            className="bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--brass)] text-[var(--brass)] hover:text-[var(--paper)] font-mono text-xs px-3.5 py-2.5 rounded flex items-center gap-2 shadow cursor-pointer transition-all active:scale-95"
          >
            <Globe className="w-4 h-4 text-[var(--brass)]" />
            <span>Global Varlık Ara &amp; Ekle</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-4 py-2.5 rounded flex items-center gap-1.5 shadow transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manuel Varlık Ekle</span>
          </button>
        </div>
      </div>

      {/* 2. Asset Class Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-4">
        {[
          { id: "hisse", label: "Hisse Senetleri" },
          { id: "maden", label: "Kıymetli Maden & Emtia" },
          { id: "fon", label: "Yatırım Fonları (TEFAS / ETF)" },
          { id: "doviz", label: "Döviz Kurları & Pariteler" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleAssetTabChange(tab.id as typeof assetTab)}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
              assetTab === tab.id
                ? "bg-[var(--brass)] text-[var(--ink)] shadow-md"
                : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[var(--ink-2)] border border-[var(--line)] p-4 rounded-xl">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--mist)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Sembol, şirket veya sektör ara (Örn: THYAO, Tüpraş, Savunma)..."
            className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-[var(--paper)] outline-none focus:border-[var(--brass)] placeholder:text-[var(--mist)]"
          />
        </div>

        {/* Sub tab toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubTabChange("all")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              subTab === "all"
                ? "bg-[var(--ink-3)] text-[var(--paper)] border border-[var(--line)] font-bold"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            Tüm Kütük ({assetTabTotalCount})
          </button>

          <button
            onClick={() => handleSubTabChange("watchlist")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === "watchlist"
                ? "bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)] font-bold"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>İzleme Listesi ({assetTabWatchlistCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScreenerOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
              isScreenerOpen
                ? "bg-[var(--brass)] text-[var(--ink)] border-[var(--brass)] font-bold shadow-md"
                : "bg-[var(--ink-3)] text-[var(--brass)] border-[var(--brass-dim)] hover:text-[var(--paper)]"
            }`}
            title="Çok kriterli kesin hisse ve varlık tarayıcısını aç"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isScreenerOpen ? "Filtreyi Kapat" : "Gelişmiş Filtre"}</span>
          </button>
        </div>
      </div>

      {/* 3.5. Expandable Multi-criteria Screener Panel */}
      {isScreenerOpen && (
        <StockScreenerBuilder
          companies={companies}
          onClose={() => setIsScreenerOpen(false)}
        />
      )}

      {/* 4. Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {filterPillOptions.map((p) => (
          <button
            key={p.id}
            onClick={() => handleFilterPillChange(p.id)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              filterPill === p.id
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 5. Company Table */}
      <div className="@container bg-[var(--ink-2)] border border-[var(--line)] rounded-xl overflow-hidden shadow-lg">
        {/* Dynamic Desktop Header (Container Query: visible when container >= 800px) */}
        <div className="hidden @[800px]:grid grid-cols-[36px_1.5fr_100px_90px_100px_110px_100px_90px_70px] gap-3 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] items-center">
          <span>Seç</span>
          <span>Şirket / Varlık</span>
          <span className="text-right">Fiyat</span>
          <span className="text-right">Günlük %</span>
          <span className="text-center hidden md:block">52H Koridor</span>
          <span className="text-right">
            {assetTab === "hisse"
              ? "F/K"
              : assetTab === "maden"
              ? "Kategori"
              : assetTab === "fon"
              ? "1Y Getiri"
              : "Birim"}
          </span>
          <span className="text-right">
            {assetTab === "hisse"
              ? "Temettü"
              : assetTab === "maden"
              ? "Birim / Tip"
              : assetTab === "fon"
              ? "Masraf Oranı"
              : "Kur Türü"}
          </span>
          <span className="text-center">Karar</span>
          <span className="text-right">İşlem</span>
        </div>

        <div className="divide-y divide-dashed divide-[var(--line)]">
          {paginatedCompanies.length === 0 ? (
            <div className="py-16 text-center text-xs font-mono text-[var(--mist)] space-y-4">
              <p>Yerel kütükte arama kriterlerine uygun varlık bulunamadı.</p>
              {searchQuery && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setGlobalSearchInitial(searchQuery);
                      setGlobalSearchModalOpen(true);
                    }}
                    className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow cursor-pointer transition-all active:scale-95"
                  >
                    <Globe className="w-4 h-4" />
                    <span>&quot;{searchQuery}&quot; için Yahoo Finance &amp; Dünya Borsalarında Ara ve Ekle</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            paginatedCompanies.map((c) => {
              const isSelected = selectedSymbols.includes(c.symbol);
              const isDailyPos = c.dailyChange >= 0;

              return (
                <div
                  key={c.id}
                  className={`p-4 @[800px]:px-6 @[800px]:py-3.5 hover:bg-[rgba(201,162,75,0.03)] transition-colors ${
                    isSelected ? "bg-[rgba(201,162,75,0.06)]" : ""
                  }`}
                >
                  {/* Desktop Multi-column Grid View (Container >= 800px) */}
                  <div className="hidden @[800px]:grid grid-cols-[36px_1.5fr_100px_90px_100px_110px_100px_90px_70px] gap-3 items-center">
                    {/* Select Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(c.symbol)}
                        className="accent-[var(--brass)] cursor-pointer w-4 h-4"
                      />
                    </div>

                    {/* Company Name & Symbol */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-xs font-bold text-[var(--brass)] shrink-0">
                        {c.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                            className="font-bold text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors font-mono"
                          >
                            {c.name}
                          </Link>
                          <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                          {c.volumeRatio && c.volumeRatio >= 1.4 && (
                            <span className="font-mono text-[9px] bg-[rgba(201,162,75,0.2)] text-[var(--brass)] border border-[var(--brass)] px-1.5 py-0.2 rounded font-bold">
                              ⚡ Hacim +%{Math.round((c.volumeRatio - 1) * 100)}
                            </span>
                          )}
                          {c.athDiscountPct !== undefined && c.athDiscountPct <= 5 && (
                            <span className="font-mono text-[9px] bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] border border-[var(--verdigris)] px-1.5 py-0.2 rounded font-bold">
                              🎯 Zirvede
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--mist)] font-mono flex items-center gap-1.5 flex-wrap">
                          <span>{c.symbol} • {c.sector}</span>
                          {c.high52 && (
                            <span className="text-[10px] text-[var(--mist)] opacity-80">
                              (52H Zirve: {c.high52} ₺)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right font-mono text-sm font-semibold text-[var(--paper)]">
                      {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                    </div>

                    {/* Daily % */}
                    <div
                      className={`text-right font-mono text-sm font-semibold ${
                        isDailyPos ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                      }`}
                    >
                      {isDailyPos ? "+" : ""}
                      {c.dailyChange}%
                    </div>

                    {/* 7-Day Trend Sparkline & 52-Week Range Position */}
                    <div className="flex flex-col items-center justify-center gap-1 w-[90px]">
                      <Sparkline
                        data={c.priceHistory ? c.priceHistory.map((p) => p.close) : undefined}
                        width={70}
                        height={20}
                      />
                      {c.high52 && c.low52 && c.high52 > c.low52 ? (
                        <div className="w-full space-y-0.5">
                          <div className="w-full h-1 bg-[var(--ink-3)] rounded-full overflow-hidden border border-[var(--line)] flex">
                            <div
                              className={`h-full ${isDailyPos ? "bg-[var(--verdigris)]" : "bg-[var(--loss)]"}`}
                              style={{
                                width: `${Math.max(5, Math.min(100, ((c.price - c.low52) / (c.high52 - c.low52)) * 100))}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--mist)] opacity-50">—</span>
                      )}
                    </div>

                    {/* Dynamic Col 5: F/K (Fix: > 0 check to prevent 0x) */}
                    <div className="text-right font-mono text-xs text-[var(--mist)]">
                      {assetTab === "hisse"
                        ? (c.peRatio !== undefined && c.peRatio !== null && c.peRatio > 0 ? `${c.peRatio}x` : "—")
                        : assetTab === "maden"
                        ? (c.madenKategori === "altin" ? "Altın Grubu" : c.madenKategori === "gumus_platin" ? "Kıymetli Metal" : "Enerji / Emtia")
                        : assetTab === "fon"
                        ? (c.oneYearReturn !== undefined ? `%${c.oneYearReturn}` : "—")
                        : (c.symbol.split("/")[0] || c.currency)}
                    </div>

                    {/* Dynamic Col 6: Temettü */}
                    <div className="text-right font-mono text-xs text-[var(--paper-dim)]">
                      {assetTab === "hisse"
                        ? (c.dividendYield !== undefined && c.dividendYield !== null && c.dividendYield > 0 ? `%${c.dividendYield}` : "—")
                        : assetTab === "maden"
                        ? (c.symbol.includes("/GR") ? "Gram" : c.symbol.includes("ONS") ? "Ons" : c.symbol.includes("OIL") || c.symbol.includes("BRENT") ? "Varil" : "Spot")
                        : assetTab === "fon"
                        ? (c.expenseRatio !== undefined ? `%${c.expenseRatio}` : "—")
                        : (c.symbol.includes("/TRY") ? "TL Kuru" : "Çapraz Kur")}
                    </div>

                    {/* Stamp Verdict */}
                    <div className="flex justify-center">
                      <StampBadge verdict={c.recommendation} />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleWatchlist(c.symbol)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          c.inWatchlist
                            ? "text-[var(--brass)] bg-[var(--brass-glow)]"
                            : "text-[var(--mist)] hover:text-[var(--paper)]"
                        }`}
                        title={c.inWatchlist ? "İzleme Listesinde" : "İzlemeye Al"}
                      >
                        {c.inWatchlist ? (
                          <BookmarkCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => handleRequestDelete(c.symbol, e)}
                        className="p-1.5 text-[var(--mist)] hover:text-[var(--loss)] transition-colors cursor-pointer"
                        title="Varlığı Kütükten Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Enriched Responsive Card View (Container < 800px) */}
                  <div className="@[800px]:hidden space-y-3">
                    {/* Top Row: Symbol & Name & Price */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(c.symbol)}
                          className="accent-[var(--brass)] cursor-pointer w-4 h-4 shrink-0"
                        />
                        <div className="w-7 h-7 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-xs font-bold text-[var(--brass)] shrink-0">
                          {c.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                              className="font-bold text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors font-mono"
                            >
                              {c.name}
                            </Link>
                            <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                          </div>
                          <div className="text-[10px] text-[var(--mist)] font-mono">
                            {c.symbol} • {c.sector}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono shrink-0">
                        <div className="text-sm font-semibold text-[var(--paper)]">
                          {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                        </div>
                        <div
                          className={`text-xs font-bold ${
                            isDailyPos ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                          }`}
                        >
                          {isDailyPos ? "+" : ""}
                          {c.dailyChange}%
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Verdict, Key Metric & Quick Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-dashed border-[var(--line)] font-mono text-[11px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StampBadge verdict={c.recommendation} />

                        {assetTab === "hisse" && (
                          <>
                            {c.peRatio && c.peRatio > 0 ? (
                              <span className="text-[var(--mist)]">
                                F/K: <strong className="text-[var(--paper)]">{c.peRatio}x</strong>
                              </span>
                            ) : null}
                            {c.dividendYield && c.dividendYield > 0 ? (
                              <span className="text-[var(--mist)]">
                                Tem: <strong className="text-[var(--verdigris)]">%{c.dividendYield}</strong>
                              </span>
                            ) : null}
                          </>
                        )}
                        {assetTab === "maden" && (
                          <span className="text-[var(--mist)]">
                            {c.madenKategori === "altin" ? "Altın" : c.madenKategori === "gumus_platin" ? "Metal" : "Emtia"}
                          </span>
                        )}
                        {assetTab === "fon" && (
                          <>
                            <span className="text-[var(--mist)]">
                              {c.exchange === "BIST" ? "TEFAS" : "ETF"}
                            </span>
                            {c.oneYearReturn !== undefined && (
                              <span className="text-[var(--mist)]">
                                1Y: <strong className="text-[var(--verdigris)]">%{c.oneYearReturn}</strong>
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleWatchlist(c.symbol)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            c.inWatchlist
                              ? "text-[var(--brass)] bg-[var(--brass-glow)]"
                              : "text-[var(--mist)] hover:text-[var(--paper)]"
                          }`}
                          title={c.inWatchlist ? "İzleme Listesinde" : "İzlemeye Al"}
                        >
                          {c.inWatchlist ? (
                            <BookmarkCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={(e) => handleRequestDelete(c.symbol, e)}
                          className="p-1.5 text-[var(--mist)] hover:text-[var(--loss)] transition-colors cursor-pointer"
                          title="Varlığı Kütükten Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                          className="text-[var(--brass)] hover:underline flex items-center gap-0.5 text-xs font-mono ml-1"
                        >
                          <span>İncele</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--line)] bg-[var(--ink-3)] font-mono text-xs">
            <span className="text-[var(--mist)]">
              Toplam {filteredCompanies.length} kayıttan {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredCompanies.length)} gösteriliyor
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className="px-3 py-1 rounded bg-[var(--ink-2)] border border-[var(--line)] text-[var(--paper)] disabled:opacity-40 cursor-pointer"
              >
                Önceki
              </button>

              <span className="text-[var(--brass)] font-bold">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className="px-3 py-1 rounded bg-[var(--ink-2)] border border-[var(--line)] text-[var(--paper)] disabled:opacity-40 cursor-pointer"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Add Company Modal (With Optional Financial Metrics) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[var(--paper)]">
                  Kütüğe Yeni Varlık Ekle
                </h3>
                <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
                  BIST, döviz, emtia veya fon tanımlayın.
                </p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-4">
              {/* Asset Class Selector */}
              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                  Varlık Tipi
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["hisse", "maden", "fon", "doviz"] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setNewAssetClass(cls)}
                      className={`py-1.5 text-xs font-mono rounded border capitalize transition-all cursor-pointer ${
                        newAssetClass === cls
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)]"
                          : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exchange / Market Selector */}
              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                  Borsa / Pazar &amp; Para Birimi
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(
                    [
                      { id: "BIST", label: "BIST (₺)" },
                      { id: "ABD", label: "ABD ($)" },
                      { id: "Avrupa", label: "Avrupa (€)" },
                      { id: "Emtia", label: "Emtia (₺)" },
                      { id: "Döviz", label: "Döviz (₺)" },
                    ] as const
                  ).map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setNewExchange(ex.id)}
                      className={`py-1.5 text-[11px] font-mono rounded border transition-all cursor-pointer ${
                        newExchange === ex.id
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)]"
                          : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
                      }`}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Global Search Shortcut Banner */}
              <div className="p-3 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--brass)] shrink-0" />
                  <span className="text-[11px] text-[var(--paper-dim)]">
                    Tüm verileri otomatik çekmek ister misiniz?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAddModalOpen(false);
                    setGlobalSearchModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded bg-[var(--brass)] text-[var(--ink)] font-bold text-[10px] uppercase font-mono hover:bg-[#d9b35a] transition-all cursor-pointer shrink-0"
                >
                  Global Arama Aç
                </button>
              </div>

              {/* Symbol & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-[var(--mist)] uppercase">
                      Sembol / Kod <span className="text-[var(--loss)]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFillFromYahoo}
                      disabled={isAutoFilling || !newSymbol.trim()}
                      className="text-[10px] font-mono text-[var(--brass)] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      {isAutoFilling ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      <span>Canlı Veri Çek</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="Örn: NVDA, ASML, THYAO, MAC"
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono uppercase focus:border-[var(--brass)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Varlık / Şirket Adı <span className="text-[var(--loss)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Örn: Nvidia Corporation"
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] focus:border-[var(--brass)] outline-none"
                  />
                </div>
              </div>

              {/* Sector & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Sektör / Kategori
                  </label>
                  <input
                    type="text"
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    placeholder="Örn: Havacılık & Taşımacılık"
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Güncel Fiyat ({currencyForExchange(newExchange)}) <span className="text-[var(--loss)]">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="245.50"
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
                  />
                </div>
              </div>

              {/* Maden / Emtia Category (for maden) */}
              {newAssetClass === "maden" && (
                <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-2">
                  <label className="block text-[11px] font-mono text-[var(--brass)] uppercase font-semibold">
                    Maden / Emtia Alt Kategorisi
                  </label>
                  <select
                    value={newMadenKategori}
                    onChange={(e) => setNewMadenKategori(e.target.value as "altin" | "gumus_platin" | "enerji_sanayi")}
                    className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)] cursor-pointer"
                  >
                    <option value="altin">Altın Çeşitleri (Gram, Çeyrek, Ata, vb.)</option>
                    <option value="gumus_platin">Gümüş, Platin &amp; Paladyum</option>
                    <option value="enerji_sanayi">Enerji &amp; Sanayi Emtiası (Petrol, Gaz, Bakır)</option>
                  </select>
                </div>
              )}

              {/* Optional Financial Metrics (for stocks) */}
              {newAssetClass === "hisse" && (
                <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-3">
                  <div className="text-[11px] font-mono text-[var(--brass)] uppercase font-semibold">
                    Opsiyonel Finansal Çarpanlar (Boş Bırakılabilir)
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-[var(--mist)] uppercase mb-0.5">
                        F/K Oranı
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newPeRatio}
                        onChange={(e) => setNewPeRatio(e.target.value)}
                        placeholder="Örn: 8.5"
                        className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-1.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[var(--mist)] uppercase mb-0.5">
                        PD / DD
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newPbRatio}
                        onChange={(e) => setNewPbRatio(e.target.value)}
                        placeholder="Örn: 1.4"
                        className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-1.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[var(--mist)] uppercase mb-0.5">
                        Temettü Verimi %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newDividendYield}
                        onChange={(e) => setNewDividendYield(e.target.value)}
                        placeholder="Örn: 4.2"
                        className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-1.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[var(--mist)] uppercase mb-0.5">
                        Beta
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={newBeta}
                        onChange={(e) => setNewBeta(e.target.value)}
                        placeholder="Örn: 1.10"
                        className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-1.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 border border-[var(--line)] py-2.5 rounded text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold py-2.5 rounded text-xs cursor-pointer shadow transition-all active:scale-95"
                >
                  Kütüğe Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Compare Modal (Up to 3 companies) */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--brass)]" />
                <h3 className="font-serif text-xl font-bold text-[var(--paper)]">
                  Varlık Karşılaştırma Analizi ({selectedSymbols.length}/3)
                </h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedSymbols.map((sym) => {
                const co = companies.find((c) => c.symbol === sym);
                if (!co) return null;

                return (
                  <div
                    key={co.symbol}
                    className="p-5 rounded-xl bg-[var(--ink-3)] border border-[var(--line)] space-y-4 relative font-mono"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[var(--paper)]">
                          {co.name}
                        </h4>
                        <span className="text-xs text-[var(--brass)] font-semibold">
                          {co.symbol} • {co.sector}
                        </span>
                      </div>
                      <StampBadge verdict={co.recommendation} />
                    </div>

                    <div className="border-t border-dashed border-[var(--line)] pt-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Fiyat:</span>
                        <span className="font-bold text-[var(--paper)]">
                          {co.price.toLocaleString("tr-TR")} {co.currency}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Günlük %:</span>
                        <span className={co.dailyChange >= 0 ? "text-[var(--verdigris)] font-bold" : "text-[var(--loss)] font-bold"}>
                          {co.dailyChange >= 0 ? "+" : ""}{co.dailyChange}%
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">F/K Oranı:</span>
                        <span className="text-[var(--paper)]">{co.peRatio ? `${co.peRatio}x` : "-"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">PD / DD:</span>
                        <span className="text-[var(--paper)]">{co.pbRatio ? `${co.pbRatio}x` : "-"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Temettü Verimi:</span>
                        <span className="text-[var(--verdigris)] font-bold">
                          {co.dividendYield ? `%${co.dividendYield}` : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Piyasa Değeri:</span>
                        <span className="text-[var(--paper)]">{co.marketCap || "-"}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/sirketler/${encodeURIComponent(co.symbol)}`}
                        className="w-full bg-[var(--ink-2)] hover:bg-[var(--ink)] border border-[var(--line)] text-[var(--brass)] py-2 rounded text-xs flex items-center justify-center gap-1"
                      >
                        <span>Detaylı Kütüğe Git</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 8. Confirm Delete Modal */}
      {companyToDelete && (
        <ConfirmModal
          isOpen={Boolean(companyToDelete)}
          onClose={() => setCompanyToDelete(null)}
          onConfirm={handleConfirmDelete}
          title={`${companyToDelete.symbol} Siliniyor`}
          message={companyToDelete.warningMsg}
          confirmText="Evet, Kütükten Sil"
          cancelText="Vazgeç"
          isDestructive={true}
        />
      )}

      {/* 9. Global Asset Live Search Modal */}
      <GlobalAssetSearchModal
        isOpen={globalSearchModalOpen}
        onClose={() => setGlobalSearchModalOpen(false)}
        initialQuery={globalSearchInitial}
      />
    </div>
  );
}
