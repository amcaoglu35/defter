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
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Company } from "@/lib/mockData";
import StampBadge from "@/components/StampBadge";
import DataStatusBadge from "@/components/DataStatusBadge";
import Sparkline, { generateSparklineData } from "@/components/Sparkline";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/ToastProvider";
import { isLiveSymbol } from "@/lib/liveSymbols";

export const currencyForExchange = (exchange: string): string => {
  if (exchange === "ABD") return "$";
  if (exchange === "Avrupa") return "€";
  return "₺";
};

export default function SirketlerPage() {
  const { companies, addCompany, deleteCompany, toggleWatchlist, transactions, baskets } =
    useDefterStore();
  const { showToast } = useToast();

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

  // Confirm delete modal state
  const [companyToDelete, setCompanyToDelete] = useState<{ symbol: string; name: string; warningMsg: string } | null>(null);

  // Reset filter pill and page when switching asset tabs
  const handleAssetTabChange = (tab: "hisse" | "maden" | "fon" | "doviz") => {
    setAssetTab(tab);
    setFilterPill("all");
    setCurrentPage(1);
  };

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
  
  // Optional Financial Metrics Inputs
  const [newPeRatio, setNewPeRatio] = useState("");
  const [newPbRatio, setNewPbRatio] = useState("");
  const [newDividendYield, setNewDividendYield] = useState("");
  const [newMarketCap, setNewMarketCap] = useState("");
  const [newBeta, setNewBeta] = useState("");

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
        if (filterPill === "bist30" && c.indexTag !== "BIST 30") return false;
        if (filterPill === "bist100" && c.indexTag !== "BIST 100" && c.indexTag !== "BIST 30") return false;
        if (filterPill === "us" && c.exchange !== "ABD") return false;
        if (filterPill === "eu" && c.exchange !== "Avrupa") return false;
        if (filterPill === "highDividend" && (!c.dividendYield || c.dividendYield < 3.0)) return false;
        if (filterPill === "lowPe" && (!c.peRatio || c.peRatio > 10.0)) return false;
        if (filterPill === "gold" && !c.symbol?.includes("ALTIN") && !["CEYREK", "TAM", "ATA"].includes(c.symbol)) return false;
        if (filterPill === "metals" && !c.symbol?.includes("GÜMÜŞ") && !c.symbol?.includes("PLATIN")) return false;
        if (filterPill === "commodities" && !["BRENT", "BAKIR", "DOGALGAZ"].includes(c.symbol)) return false;
        if (filterPill === "tefas" && c.exchange === "BIST") return false;
        if (filterPill === "etf" && c.exchange !== "ABD") return false;
        if (filterPill === "tl" && !c.symbol?.includes("/TRY")) return false;
        if (filterPill === "cross" && c.symbol?.includes("/TRY")) return false;
      }

      return true;
    });
  }, [companies, assetTab, subTab, searchQuery, filterPill]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredCompanies.length / pageSize) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCompanies.slice(start, start + pageSize);
  }, [filteredCompanies, currentPage, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 1. Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <span className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
            Sermaye Kütüğü
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--paper)] font-medium mt-1">
            Şirketler, Emtia &amp; Varlıklar
          </h1>
          <p className="text-xs text-[var(--mist)] mt-1 font-mono">
            Toplam {companies.length} kayıtlı enstrüman • Canlı fiyatlar ve finansal çarpanlar
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {selectedSymbols.length > 0 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              className="bg-[var(--ink-3)] border border-[var(--brass)] text-[var(--brass)] font-mono text-xs px-3.5 py-2.5 rounded flex items-center gap-2 shadow cursor-pointer transition-all hover:bg-[var(--ink)]"
            >
              <Scale className="w-4 h-4" />
              <span>Karşılaştır ({selectedSymbols.length}/3)</span>
            </button>
          )}

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-4 py-2.5 rounded flex items-center gap-1.5 shadow transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Varlık Ekle</span>
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Sembol, şirket veya sektör ara (Örn: THYAO, Tüpraş, Savunma)..."
            className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-[var(--paper)] outline-none focus:border-[var(--brass)] placeholder:text-[var(--mist)]"
          />
        </div>

        {/* Sub tab toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSubTab("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              subTab === "all"
                ? "bg-[var(--ink-3)] text-[var(--paper)] border border-[var(--line)] font-bold"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            Tüm Kütük ({companies.length})
          </button>

          <button
            onClick={() => {
              setSubTab("watchlist");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === "watchlist"
                ? "bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)] font-bold"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>İzleme Listesi ({companies.filter((c) => c.inWatchlist).length})</span>
          </button>
        </div>
      </div>

      {/* 4. Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {filterPillOptions.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setFilterPill(p.id);
              setCurrentPage(1);
            }}
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
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl overflow-hidden shadow-lg">
        <div className="hidden md:grid grid-cols-[36px_1.5fr_100px_90px_100px_90px_80px_100px_70px] gap-3 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] items-center">
          <span>Seç</span>
          <span>Şirket / Varlık</span>
          <span className="text-right">Fiyat</span>
          <span className="text-right">Günlük %</span>
          <span className="text-center">7G Trend</span>
          <span className="text-right">F/K</span>
          <span className="text-right">Temettü</span>
          <span className="text-center">Karar</span>
          <span className="text-right">İşlem</span>
        </div>

        <div className="divide-y divide-dashed divide-[var(--line)]">
          {paginatedCompanies.length === 0 ? (
            <div className="py-16 text-center text-xs font-mono text-[var(--mist)]">
              Arama kriterlerine uygun varlık bulunamadı.
            </div>
          ) : (
            paginatedCompanies.map((c) => {
              const isSelected = selectedSymbols.includes(c.symbol);
              const isDailyPos = c.dailyChange >= 0;
              const sparkData = generateSparklineData(c.price, c.dailyChange, c.symbol);

              return (
                <div
                  key={c.id}
                  className={`grid grid-cols-2 md:grid-cols-[36px_1.5fr_100px_90px_100px_90px_80px_100px_70px] gap-3 p-4 md:px-6 md:py-3.5 items-center hover:bg-[rgba(201,162,75,0.03)] transition-colors ${
                    isSelected ? "bg-[rgba(201,162,75,0.06)]" : ""
                  }`}
                >
                  {/* Select Checkbox (Desktop) */}
                  <div className="hidden md:flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(c.symbol)}
                      className="accent-[var(--brass)] cursor-pointer w-4 h-4"
                    />
                  </div>

                  {/* Company Name & Symbol */}
                  <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                    <div className="w-8 h-8 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-xs font-bold text-[var(--brass)] shrink-0">
                      {c.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                          href={`/sirketler/${c.symbol}`}
                          className="font-bold text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors font-mono"
                        >
                          {c.name}
                        </Link>
                        <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                      </div>
                      <div className="text-[11px] text-[var(--mist)] font-mono">
                        {c.symbol} • {c.sector}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-left md:text-right font-mono text-sm font-semibold text-[var(--paper)]">
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

                  {/* 7-Day Sparkline */}
                  <div className="hidden md:flex justify-center">
                    <Sparkline data={sparkData} width={75} height={24} />
                  </div>

                  {/* PE */}
                  <div className="hidden md:block text-right font-mono text-xs text-[var(--mist)]">
                    {c.peRatio !== undefined && c.peRatio !== null ? `${c.peRatio}x` : "-"}
                  </div>

                  {/* Dividend */}
                  <div className="hidden md:block text-right font-mono text-xs text-[var(--paper-dim)]">
                    {c.dividendYield !== undefined && c.dividendYield !== null ? `%${c.dividendYield}` : "-"}
                  </div>

                  {/* Stamp Verdict */}
                  <div className="hidden md:flex justify-center">
                    <StampBadge verdict={c.recommendation} />
                  </div>

                  {/* Action buttons */}
                  <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-dashed border-[var(--line)]">
                    <button
                      onClick={() => toggleWatchlist(c.symbol)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        c.inWatchlist
                          ? "text-[var(--brass)] bg-[var(--brass-glow)]"
                          : "text-[var(--mist)] hover:text-[var(--paper)]"
                      }`}
                      title={c.inWatchlist ? "İzleme Listesinde" : "İzlemeye Al"}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-[var(--ink-2)] border border-[var(--line)] text-[var(--paper)] disabled:opacity-40 cursor-pointer"
              >
                Önceki
              </button>

              <span className="text-[var(--brass)] font-bold">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

              {/* Symbol & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                    Sembol / Kod <span className="text-[var(--loss)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="Örn: PGSUS"
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
                    placeholder="Örn: Pegasus Hava Taşımacılığı"
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
                        href={`/sirketler/${co.symbol}`}
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
    </div>
  );
}
