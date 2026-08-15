"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Calculator,
  Plus,
  Search,
  Check,
  Building2,
  Trash2,
  RefreshCw,
  X,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  SlidersHorizontal,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { IpoItem } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import ConfirmModal from "@/components/ConfirmModal";

export function parseIpoPrice(priceRange: string | undefined): number {
  if (!priceRange) return 40.0;
  const matches = priceRange.match(/\d+(?:[.,]\d+)?/g);
  if (!matches || matches.length === 0) return 40.0;
  const parsed = matches
    .map((n) => parseFloat(n.replace(",", ".")))
    .filter((n) => !isNaN(n) && n > 0);
  if (parsed.length === 0) return 40.0;
  if (parsed.length === 1) return parsed[0];
  // Range: return average of low and high bounds
  return parseFloat(((parsed[0] + parsed[1]) / 2).toFixed(2));
}

export function parseLotAmount(lotAmount?: string): number {
  if (!lotAmount) return 30000000;
  const cleanDigits = lotAmount.replace(/[^\d]/g, "");
  const val = parseInt(cleanDigits);
  if (!isNaN(val) && val > 0) return val;
  return 30000000;
}

export function parseFundSize(fundSize?: string): number {
  if (!fundSize) return 0;
  const matches = fundSize.match(/\d+(?:[.,]\d+)?/g);
  if (!matches || matches.length === 0) return 0;
  const num = parseFloat(matches[0].replace(",", "."));
  if (fundSize.toLowerCase().includes("mr") || fundSize.toLowerCase().includes("milyar")) {
    return num * 1000000000;
  }
  if (fundSize.toLowerCase().includes("mn") || fundSize.toLowerCase().includes("milyon")) {
    return num * 1000000;
  }
  return num;
}

export function getRemainingDaysBadge(ipo: IpoItem): { text: string; color: string } | null {
  if (ipo.status !== "active") return null;

  if (ipo.endDate) {
    const end = new Date(ipo.endDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { text: "Son Gün!", color: "text-[var(--loss)] border-[var(--loss)] bg-[rgba(122,46,58,0.1)]" };
    if (diffDays === 1) return { text: "1 Gün Kaldı", color: "text-[var(--brass)] border-[var(--brass)] bg-[rgba(201,162,75,0.1)]" };
    return { text: `${diffDays} Gün Kaldı`, color: "text-[var(--verdigris)] border-[var(--verdigris)] bg-[rgba(91,140,123,0.1)]" };
  }

  // Best-effort regex date parser from dateRange text (e.g. "18 - 20 Ağustos 2026")
  const numbers = ipo.dateRange.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    const endDay = parseInt(numbers[1]);
    const currentDay = new Date().getDate();
    const diff = endDay - currentDay;
    if (diff <= 0) return { text: "Son Gün!", color: "text-[var(--loss)] border-[var(--loss)] bg-[rgba(122,46,58,0.1)]" };
    if (diff > 0 && diff <= 5) return { text: `${diff} Gün Kaldı`, color: "text-[var(--brass)] border-[var(--brass)] bg-[rgba(201,162,75,0.1)]" };
  }

  return { text: "Talep Açık", color: "text-[var(--verdigris)] border-[var(--verdigris)] bg-[rgba(91,140,123,0.1)]" };
}

export default function HalkaArzPage() {
  const {
    ipos,
    companies,
    addIpo,
    deleteIpo,
    syncIpoToLedger,
    autoSyncNewIpos,
    isLoaded,
  } = useDefterStore();
  const { showToast } = useToast();

  const calculatorRef = useRef<HTMLDivElement>(null);
  const ceilingRef = useRef<HTMLDivElement>(null);

  const [ipoToDelete, setIpoToDelete] = useState<IpoItem | null>(null);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "upcoming" | "listed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "size_desc" | "name">("default");

  // Allocation Calculator States
  const [selectedIpoId, setSelectedIpoId] = useState<string>("");
  const [participants, setParticipants] = useState<number>(2200000); // 2.2M kişi
  const [allocationLots, setAllocationLots] = useState<number>(55000000); // Toplam lot

  // Ceiling Simulator States
  const [initialCapital, setInitialCapital] = useState<number>(2000); // 2.000 TL
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Add IPO Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newSector, setNewSector] = useState("Lojistik & Taşımacılık");
  const [newDateRange, setNewDateRange] = useState("18 - 20 Ağustos 2026");
  const [newPrice, setNewPrice] = useState("45.00 ₺");
  const [newDistribution, setNewDistribution] = useState("Bireysele Eşit Dağıtım");
  const [newBroker, setNewBroker] = useState("Vakıf Yatırım Menkul");
  const [newFundSize, setNewFundSize] = useState("1.80 Mr ₺");
  const [newStatus, setNewStatus] = useState<"active" | "upcoming" | "listed">("active");
  const [autoAddCompany, setAutoAddCompany] = useState(true);

  const resetForm = () => {
    setNewCode("");
    setNewName("");
    setNewSector("Lojistik & Taşımacılık");
    setNewDateRange("18 - 20 Ağustos 2026");
    setNewPrice("45.00 ₺");
    setNewDistribution("Bireysele Eşit Dağıtım");
    setNewBroker("Vakıf Yatırım Menkul");
    setNewFundSize("1.80 Mr ₺");
    setNewStatus("active");
    setAutoAddCompany(true);
  };

  // Sync selectedIpoId with first available IPO when list loads or changes
  useEffect(() => {
    if (ipos.length > 0) {
      if (!selectedIpoId || !ipos.some((i) => i.id === selectedIpoId)) {
        setSelectedIpoId(ipos[0].id);
      }
    }
  }, [ipos, selectedIpoId]);

  const selectedIpo = ipos.find((i) => i.id === selectedIpoId) || (ipos.length > 0 ? ipos[0] : null);

  // Sync lot pool automatically when selected IPO changes
  useEffect(() => {
    if (selectedIpo) {
      const defaultLots = parseLotAmount(selectedIpo.lotAmount);
      setAllocationLots(defaultLots);
    }
  }, [selectedIpoId, selectedIpo]);

  // Calculations for lot distribution & lottery detection
  const ipoPriceNum = selectedIpo ? parseIpoPrice(selectedIpo.priceRange) : 0;
  const rawLotsPerPerson = participants > 0 ? allocationLots / participants : 0;
  const isLottery = rawLotsPerPerson < 1.0;
  const calculatedLot = Math.floor(rawLotsPerPerson);
  const estimatedCost = (isLottery ? 1 : calculatedLot) * ipoPriceNum;

  // 10-Day Ceiling Table Data (+10% per day, accurate unrounded percentage)
  const ceilingTable = Array.from({ length: 10 }, (_, i) => {
    const day = i + 1;
    const compoundMultiplier = Math.pow(1.1, day);
    const value = Math.round(initialCapital * compoundMultiplier);
    const profit = value - initialCapital;
    const profitPercent = ((compoundMultiplier - 1) * 100).toFixed(1);

    return {
      day,
      price: (ipoPriceNum * compoundMultiplier).toFixed(2),
      value,
      profit,
      profitPercent,
    };
  });

  // Filtered & Sorted dataset
  const filteredIpos = useMemo(() => {
    const list = ipos.filter((ipo) => {
      if (statusFilter !== "all" && ipo.status !== statusFilter) return false;
      if (
        searchQuery &&
        !ipo.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ipo.sector.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === "price_asc") return parseIpoPrice(a.priceRange) - parseIpoPrice(b.priceRange);
      if (sortBy === "price_desc") return parseIpoPrice(b.priceRange) - parseIpoPrice(a.priceRange);
      if (sortBy === "size_desc") return parseFundSize(b.fundSize || b.lotAmount) - parseFundSize(a.fundSize || a.lotAmount);
      if (sortBy === "name") return a.name.localeCompare(b.name, "tr");
      return 0; // default order
    });
  }, [ipos, statusFilter, searchQuery, sortBy]);

  // Handle Add IPO with duplicate check
  const handleCreateIpo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCode.toUpperCase().trim();
    const cleanName = newName.trim();
    if (!cleanCode || !cleanName) return;

    // Check duplicate code
    const existing = ipos.find((i) => i.code.toUpperCase() === cleanCode);
    if (existing) {
      showToast(
        "Halka Arz Zaten Kayıtlı",
        `${cleanCode} koduyla kayıtlı bir halka arz zaten mevcut (${existing.name}).`,
        "error"
      );
      return;
    }

    const ipoObj: IpoItem = {
      id: `ipo-${cleanCode.toLowerCase()}`,
      code: cleanCode,
      name: cleanName,
      sector: newSector,
      status: newStatus,
      dateRange: newDateRange,
      priceRange: newPrice.includes("₺") ? newPrice : `${newPrice} ₺`,
      distributionType: newDistribution,
      leadManager: newBroker,
      fundSize: newFundSize,
      lotAmount: "30.000.000 Lot",
      ceilingStreak: newStatus === "listed" ? 1 : 0,
    };

    addIpo(ipoObj, autoAddCompany);
    setIsAddModalOpen(false);
    resetForm();

    // Reset filters so newly added IPO is immediately visible
    setStatusFilter("all");
    setSearchQuery("");
    setSelectedIpoId(ipoObj.id);

    showToast(
      "Halka Arz Eklendi",
      `${ipoObj.name} (${ipoObj.code}) halka arz kütüğüne kaydedildi ve veritabanıyla senkronize edildi.`,
      "success"
    );
  };

  // Handle Auto-Sync All IPOs
  const handleAutoSyncAll = async () => {
    setSyncingAll(true);
    const added = await autoSyncNewIpos();
    setSyncingAll(false);
    showToast(
      "Kütük Senkronizasyonu",
      added > 0
        ? `${added} yeni halka arz şirketi şirketler kütüğünüze aktarıldı!`
        : `Tüm listelenen halka arz şirketleri şirketler kütüğünüzde eksiksiz kayıtlı.`,
      "success"
    );
  };

  // Check if IPO symbol is in companies ledger
  const isCompanyInLedger = (code: string) => {
    return companies.some((c) => c.symbol.toUpperCase() === code.toUpperCase());
  };

  const handleSelectAndScroll = (id: string) => {
    setSelectedIpoId(id);
    calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTransferToSimulator = () => {
    const cost = Math.max(100, Math.round(estimatedCost));
    setInitialCapital(cost);
    showToast(
      "Tutarı Simülatöre Aktarıldı",
      `Gereken teminat tutarı (${cost.toLocaleString("tr-TR")} ₺) 10 Günlük Tavan Simülatörüne aktarıldı.`,
      "success"
    );
    ceilingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <span className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
            Sermaye Piyasası Kurulu (SPK) &amp; Borsa İstanbul
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--paper)] font-medium mt-1">
            Halka Arz Kütüğü &amp; Tavan Simülatörü
          </h1>
          <p className="text-xs font-mono text-[var(--mist)] mt-2">
            Yeni halka arzları takip edin, olası lot dağıtımını hesaplayın ve tek tıkla şirketler kütüğünüze otomatik aktarın.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoSyncAll}
            disabled={syncingAll}
            className="flex items-center gap-2 bg-[var(--ink-2)] border border-[var(--brass)] text-[var(--brass)] hover:bg-[rgba(201,162,75,0.1)] px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Sadece borsada işlem görmeye başlayan (listelenen) halka arzları şirket kütüğüne aktarır"
          >
            <RefreshCw className={`w-4 h-4 ${syncingAll ? "animate-spin" : ""}`} />
            <span>Listelenenleri Kütüğe Aktar</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--brass)] text-[var(--ink)] hover:bg-[var(--brass-light)] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Halka Arz Ekle</span>
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncResult && (
        <div className="bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] text-[var(--paper)] px-4 py-3 rounded-lg font-mono text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[var(--verdigris)]" />
            <span>{syncResult}</span>
          </div>
          <button onClick={() => setSyncResult(null)} className="text-[var(--mist)] hover:text-[var(--paper)]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Active & Upcoming IPOs Grid */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto">
            {[
              { id: "all", label: "Tümü", count: ipos.length },
              { id: "active", label: "Talep Toplananlar", count: ipos.filter((i) => i.status === "active").length },
              { id: "upcoming", label: "Yaklaşanlar", count: ipos.filter((i) => i.status === "upcoming").length },
              { id: "listed", label: "Borsada İşlem Görenler", count: ipos.filter((i) => i.status === "listed").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as "all" | "active" | "upcoming" | "listed")}
                className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                    : "text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="opacity-80 text-[10px]">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Halka arz veya kod ara..."
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-md pl-9 pr-8 py-1.5 text-xs text-[var(--paper)] placeholder-[var(--mist)] focus:outline-none focus:border-[var(--brass)] font-sans"
              />
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-[var(--mist)]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-[var(--mist)] hover:text-[var(--paper)] p-0.5"
                  title="Aramayı Temizle"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-md px-2 py-1 text-xs font-mono text-[var(--mist)]">
              <SlidersHorizontal className="w-3 h-3 text-[var(--brass)] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "default" | "price_asc" | "price_desc" | "size_desc" | "name")}
                className="bg-transparent text-[var(--paper)] outline-none text-xs cursor-pointer"
              >
                <option value="default" className="bg-[var(--ink-2)]">Varsayılan Sıra</option>
                <option value="price_asc" className="bg-[var(--ink-2)]">Fiyata Göre (Artan)</option>
                <option value="price_desc" className="bg-[var(--ink-2)]">Fiyata Göre (Azalan)</option>
                <option value="size_desc" className="bg-[var(--ink-2)]">Büyüklüğe Göre</option>
                <option value="name" className="bg-[var(--ink-2)]">Alfabetik (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-6 rounded-xl border border-[var(--line)] bg-[var(--ink-2)] space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded bg-[var(--ink-3)]" />
                  <div className="w-20 h-5 rounded bg-[var(--ink-3)]" />
                </div>
                <div className="w-3/4 h-5 rounded bg-[var(--ink-3)]" />
                <div className="w-1/2 h-3 rounded bg-[var(--ink-3)]" />
                <div className="space-y-2 pt-3 border-t border-[var(--line)]">
                  <div className="w-full h-3 rounded bg-[var(--ink-3)]" />
                  <div className="w-full h-3 rounded bg-[var(--ink-3)]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredIpos.length === 0 ? (
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-12 text-center">
            <p className="font-serif text-lg text-[var(--paper)]">Eşleşen halka arz bulunamadı.</p>
            <p className="text-xs text-[var(--mist)] mt-1 font-mono">
              Filtrenizi değiştirebilir veya &quot;Yeni Halka Arz Ekle&quot; butonuyla SPK bülteninden yeni kayıt girebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIpos.map((ipo) => {
              const isSelected = selectedIpoId === ipo.id;
              const inLedger = isCompanyInLedger(ipo.code);
              const remainingBadge = getRemainingDaysBadge(ipo);

              return (
                <div
                  key={ipo.id}
                  onClick={() => setSelectedIpoId(ipo.id)}
                  className={`p-6 rounded-xl border transition-all cursor-pointer bg-[var(--ink-2)] flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--brass)] shadow-xl bg-[rgba(201,162,75,0.04)] ring-1 ring-[var(--brass)]"
                      : "border-[var(--line)] hover:border-[var(--brass-dim)]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded border border-[var(--brass-dim)] bg-[var(--ink-3)] flex items-center justify-center font-mono font-bold text-xs text-[var(--brass)]">
                        {ipo.code.slice(0, 3)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {remainingBadge && (
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${remainingBadge.color}`}>
                            <Clock className="w-3 h-3" />
                            <span>{remainingBadge.text}</span>
                          </span>
                        )}
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                            ipo.status === "active"
                              ? "text-[var(--verdigris)] border-[var(--verdigris)] bg-[rgba(91,140,123,0.1)]"
                              : ipo.status === "upcoming"
                              ? "text-[var(--brass)] border-[var(--brass-dim)] bg-[var(--brass-glow)]"
                              : "text-[var(--paper)] border-[var(--line)] bg-[var(--ink-3)]"
                          }`}
                        >
                          {ipo.status === "active"
                            ? "Talep Toplanıyor"
                            : ipo.status === "upcoming"
                            ? "Yaklaşıyor"
                            : "İşlem Görüyor"}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--paper)] mt-3">
                      {ipo.name}
                    </h3>
                    <div className="font-mono text-xs text-[var(--brass)] mt-0.5">
                      {ipo.code} • {ipo.sector}
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-[var(--line)] space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Tarih:</span>
                        <span className="text-[var(--paper)] font-semibold">{ipo.dateRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Fiyat:</span>
                        <span className="text-[var(--paper)] font-bold">{ipo.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Büyüklük:</span>
                        <span className="text-[var(--paper-dim)]">{ipo.fundSize || ipo.lotAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--mist)]">Dağıtım:</span>
                        <span className="text-[var(--paper-dim)]">{ipo.distributionType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between font-mono text-[11px] gap-2">
                    {/* Sync to Ledger Action */}
                    {inLedger ? (
                      <span className="text-[var(--verdigris)] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Kütükte Kayıtlı</span>
                      </span>
                    ) : ipo.status === "listed" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          syncIpoToLedger(ipo);
                          showToast("Kütüğe Eklendi", `${ipo.name} (${ipo.code}) şirket kütüğüne aktarıldı.`, "success");
                        }}
                        className="bg-[var(--brass)] text-[var(--ink)] hover:bg-[var(--brass-light)] px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                        title="Şirketi kütüğe aktar"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Kütüğe Ekle</span>
                      </button>
                    ) : (
                      <span
                        className="text-[var(--mist)] opacity-70 text-[10px] italic border border-dashed border-[var(--line)] px-2 py-0.5 rounded cursor-help"
                        title="Halka arz talep süreci tamamlanıp Borsa İstanbul'da işlem görmeye başladığında kütüğe aktarılabilir."
                      >
                        İşlem Başlayınca Aktarılır
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAndScroll(ipo.id);
                        }}
                        className="text-[var(--brass)] hover:text-[var(--paper)] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Hesapla</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIpoToDelete(ipo);
                        }}
                        className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Interactive Lot Allocation Calculator */}
      <section
        ref={calculatorRef}
        className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-6"
      >
        {!selectedIpo ? (
          <div className="text-center py-12 border border-dashed border-[var(--line)] rounded-xl bg-[var(--ink-3)]">
            <Calculator className="w-10 h-10 text-[var(--mist)] mx-auto mb-3 opacity-50" />
            <p className="text-sm font-serif text-[var(--paper)] mb-1">
              Hesaplama İçin Halka Arz Seçin veya Ekleyin
            </p>
            <p className="text-xs font-mono text-[var(--mist)] mb-4">
              Kütükte aktif halka arz bulunmadığında lot ve getiri simülatörü çalıştırılamaz.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[var(--brass)] text-[var(--ink)] font-bold text-xs rounded hover:bg-[var(--brass-light)] cursor-pointer"
            >
              + Yeni Halka Arz Ekle
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
              <Calculator className="w-6 h-6 text-[var(--brass)]" />
              <div>
                <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                  Katılımcı Sayısına Göre Lot Dağıtım Hesaplayıcısı
                </h2>
                <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
                  Seçilen Halka Arz: <span className="text-[var(--brass)] font-bold">{selectedIpo.name} ({selectedIpo.code})</span> — Birim Fiyat: {selectedIpo.priceRange}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Controls */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex justify-between font-mono text-xs mb-2">
                    <span className="text-[var(--mist)] uppercase">
                      Tahmini Katılımcı Sayısı
                    </span>
                    <span className="text-[var(--brass)] font-bold text-sm">
                      {(participants / 1000000).toFixed(2)} Milyon Kişi (
                      {participants.toLocaleString("tr-TR")})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="4000000"
                    step="50000"
                    value={participants}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setParticipants(Number.isNaN(val) ? 0 : val);
                    }}
                    className="w-full accent-[var(--brass)] cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-[var(--mist)] mt-1">
                    <span>500 Bin</span>
                    <span>1.5 Milyon</span>
                    <span>2.5 Milyon</span>
                    <span>4.0 Milyon</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-[var(--mist)] uppercase mb-1.5">
                      Bireysele Ayrılan Toplam Lot
                    </label>
                    <input
                      type="number"
                      value={allocationLots}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setAllocationLots(Number.isNaN(val) ? 0 : val);
                      }}
                      className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[var(--mist)] uppercase mb-1.5">
                      Birim Halka Arz Fiyatı (₺)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={ipoPriceNum}
                      readOnly
                      className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono outline-none opacity-80"
                    />
                  </div>
                </div>

                {isLottery && (
                  <div className="p-3 bg-[rgba(201,162,75,0.1)] border border-[var(--brass-dim)] rounded-lg text-xs font-mono text-[var(--brass)] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Kura İle Dağıtım Uyarısı:</strong> Katılımcı sayısı ({participants.toLocaleString("tr-TR")}) arz edilen toplam lotu ({allocationLots.toLocaleString("tr-TR")}) aştığı için kişi başı ortalama dağıtım 1 lotun altındadır ({rawLotsPerPerson.toFixed(2)} Lot). Bu senaryoda her katılımcıya garanti hisse düşmez; dağıtım kura ile gerçekleşir.
                    </span>
                  </div>
                )}
              </div>

              {/* Big Result Display */}
              <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 flex flex-col justify-between text-center">
                <div>
                  <span className="font-mono text-[11px] text-[var(--mist)] uppercase">
                    Tahmini Kişi Başı Dağıtılacak
                  </span>
                  {isLottery ? (
                    <div className="my-2">
                      <div className="font-serif text-3xl font-bold text-[var(--brass)]">
                        &lt; 1 Lot
                      </div>
                      <span className="text-[11px] font-mono text-[var(--loss)] font-bold bg-[rgba(122,46,58,0.15)] px-2 py-0.5 rounded border border-[var(--loss)] inline-block mt-1">
                        Kura / Çekiliş Usulü
                      </span>
                    </div>
                  ) : (
                    <div className="font-serif text-4xl sm:text-5xl font-bold text-[var(--brass)] my-2">
                      {calculatedLot} <span className="text-xl font-mono">Lot</span>
                    </div>
                  )}

                  <div className="font-mono text-xs text-[var(--verdigris)] font-semibold mt-2">
                    {isLottery
                      ? `1 Lot Çıkarsa Teminat: ~${ipoPriceNum.toFixed(2)} ₺`
                      : `Gereken Teminat: ~${estimatedCost.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`}
                  </div>

                  <button
                    onClick={handleTransferToSimulator}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-[var(--brass)] hover:text-[var(--paper)] bg-[rgba(201,162,75,0.1)] border border-[var(--brass-dim)] px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    <span>Simülatöre Aktar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[11px] text-[var(--mist)] font-sans mt-4 border-t border-dashed border-[var(--line)] pt-3">
                  * SPK eşit dağıtım metodolojisine göre modellenmiştir. Nihai lot miktarı halka arz sonuç bülteninde netleşir.
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 4. 10-Day Ceiling Series Compound Profit Table */}
      <section
        ref={ceilingRef}
        className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              10 Günlük Tavan Serisi Projeksiyonu (+%10 Günlük Bileşik)
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              Halka arz sonrası her gün tavan açması durumundaki kümülatif portföy büyümesi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--mist)]">Başlangıç Portföyü:</span>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setInitialCapital(Number.isNaN(val) ? 0 : val);
              }}
              className="w-28 bg-[var(--ink-3)] border border-[var(--line)] rounded px-2.5 py-1.5 text-xs text-[var(--paper)] font-mono text-right outline-none focus:border-[var(--brass)]"
            />
            <span className="font-mono text-xs text-[var(--paper)]">₺</span>
          </div>
        </div>

        <div className="p-3 bg-[rgba(201,162,75,0.08)] border border-[var(--brass-dim)] rounded-lg text-xs font-mono text-[var(--brass)] flex items-center gap-2">
          <span>ℹ️ Bu tablo BIST&apos;in standart %10 günlük tavan/taban kuralına göre hesaplanmaktadır. Özel marj veya mevzuat değişikliklerinde güncel BIST bültenlerini teyit ediniz.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--brass)] uppercase bg-[var(--ink-3)]">
                <th className="py-3 px-3">Tavan Seansı</th>
                <th className="py-3 px-3 text-right">Tahmini Hisse Fiyatı</th>
                <th className="py-3 px-3 text-right">Portföy Tutarı</th>
                <th className="py-3 px-3 text-right">Net Kâr (₺)</th>
                <th className="py-3 px-3 text-right">Kümülatif Getiri %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-[var(--line)]">
              {ceilingTable.map((row) => (
                <tr
                  key={row.day}
                  className={`hover:bg-[rgba(201,162,75,0.04)] ${
                    row.day === 5 ? "bg-[rgba(91,140,123,0.08)] font-semibold" : ""
                  }`}
                >
                  <td className="py-3 px-3 font-semibold text-[var(--paper)]">
                    {row.day}. Gün Tavanı {row.day === 5 && "★ (Klasik Çıkış Noktası)"}
                  </td>
                  <td className="py-3 px-3 text-right text-[var(--paper-dim)]">
                    {row.price} ₺
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[var(--paper)]">
                    {row.value.toLocaleString("tr-TR")} ₺
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[var(--verdigris)]">
                    +{row.profit.toLocaleString("tr-TR")} ₺
                  </td>
                  <td className="py-3 px-3 text-right text-[var(--verdigris)] font-bold">
                    +%{row.profitPercent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Modal: Yeni Halka Arz Ekle */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--ink-2)] border border-[var(--brass)] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--brass)]" />
                <h3 className="font-serif text-xl font-semibold text-[var(--paper)]">
                  Yeni Halka Arz Kaydı Ekle
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIpo} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--mist)] mb-1">BIST Kodu *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: HOROZ"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-[var(--paper)] uppercase outline-none focus:border-[var(--brass)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--mist)] mb-1">Birim Fiyat *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 45.00 ₺"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-[var(--paper)] outline-none focus:border-[var(--brass)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--mist)] mb-1">Şirket Ünvanı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Horoz Lojistik Kargo Hizmetleri A.Ş."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-[var(--paper)] font-sans outline-none focus:border-[var(--brass)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--mist)] mb-1">Sektör</label>
                  <input
                    type="text"
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-[var(--paper)] font-sans outline-none focus:border-[var(--brass)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--mist)] mb-1">Halka Arz Durumu</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as "active" | "upcoming" | "listed")}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-[var(--paper)] outline-none focus:border-[var(--brass)]"
                  >
                    <option value="active">Talep Toplanıyor (Aktif)</option>
                    <option value="upcoming">Onaylandı (Yaklaşan)</option>
                    <option value="listed">Borsada İşlem Gören</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--mist)] mb-1">Talep Toplama Tarihleri</label>
                  <input
                    type="text"
                    value={newDateRange}
                    onChange={(e) => setNewDateRange(e.target.value)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-[var(--paper)] outline-none focus:border-[var(--brass)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--mist)] mb-1">Halka Arz Büyüklüğü</label>
                  <input
                    type="text"
                    value={newFundSize}
                    onChange={(e) => setNewFundSize(e.target.value)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2 text-[var(--paper)] outline-none focus:border-[var(--brass)]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoAddCompany}
                    onChange={(e) => setAutoAddCompany(e.target.checked)}
                    className="accent-[var(--brass)] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[var(--paper)] text-xs font-sans">
                    Bu şirketi otomatik olarak <strong>Şirketler / Portföy Kütüğüne</strong> de ekle
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-[var(--line)] rounded text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--brass)] text-[var(--ink)] font-bold rounded hover:bg-[var(--brass-light)] shadow-md cursor-pointer"
                >
                  Halka Arzı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete IPO Modal */}
      <ConfirmModal
        isOpen={!!ipoToDelete}
        onClose={() => setIpoToDelete(null)}
        onConfirm={() => {
          if (ipoToDelete) {
            deleteIpo(ipoToDelete.id);
            showToast("Kayıt Silindi", `${ipoToDelete.name} (${ipoToDelete.code}) halka arz kütüğünden silindi.`, "success");
            setIpoToDelete(null);
          }
        }}
        title="Halka Arz Kaydını Sil"
        description={
          ipoToDelete ? (
            <p>
              <strong className="text-[var(--paper)]">{ipoToDelete.name} ({ipoToDelete.code})</strong> halka arz kaydını kütükten silmek istediğinize emin misiniz?
            </p>
          ) : ""
        }
        confirmText="Kaydı Sil"
        cancelText="Vazgeç"
        variant="danger"
      />
    </div>
  );
}
