"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  Calculator,
  Plus,
  Search,
  Check,
  Building2,
  Trash2,
  RefreshCw,
  X,
  ExternalLink,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { IpoItem } from "@/lib/mockData";

export default function HalkaArzPage() {
  const {
    ipos,
    companies,
    addIpo,
    deleteIpo,
    syncIpoToLedger,
    autoSyncNewIpos,
  } = useDefterStore();

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "upcoming" | "listed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Allocation Calculator States
  const [selectedIpoId, setSelectedIpoId] = useState<string>(ipos[0]?.id || "ipo-horoz");
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

  const selectedIpo = ipos.find((i) => i.id === selectedIpoId) || ipos[0] || {
    id: "default",
    code: "HOROZ",
    name: "Horoz Lojistik Kargo Hizmetleri",
    sector: "Lojistik",
    status: "active",
    dateRange: "29 - 31 Mayıs 2026",
    priceRange: "55.00 ₺",
    distributionType: "Bireysele Eşit Dağıtım",
    leadManager: "QNB Finans Yatırım",
    lotAmount: "24.600.000 Lot",
    fundSize: "1.35 Mr ₺",
  };

  // Calculations for lot distribution
  const ipoPriceNum =
    parseFloat(selectedIpo.priceRange.replace(/[^\d.]/g, "")) || 42.5;
  const calculatedLot = Math.max(
    1,
    Math.floor(allocationLots / Math.max(1, participants))
  );
  const estimatedCost = calculatedLot * ipoPriceNum;

  // 10-Day Ceiling Table Data (+10% per day)
  const ceilingTable = Array.from({ length: 10 }, (_, i) => {
    const day = i + 1;
    const compoundMultiplier = Math.pow(1.1, day);
    const value = Math.round(initialCapital * compoundMultiplier);
    const profit = value - initialCapital;
    const profitPercent = ((profit / initialCapital) * 100).toFixed(1);

    return {
      day,
      price: (ipoPriceNum * compoundMultiplier).toFixed(2),
      value,
      profit,
      profitPercent,
    };
  });

  // Filtered dataset
  const filteredIpos = useMemo(() => {
    return ipos.filter((ipo) => {
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
  }, [ipos, statusFilter, searchQuery]);

  // Handle Add IPO
  const handleCreateIpo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const ipoObj: IpoItem = {
      id: `ipo-${newCode.toLowerCase()}`,
      code: newCode.toUpperCase().trim(),
      name: newName.trim(),
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

    // Reset Form
    setNewCode("");
    setNewName("");
    setSyncResult(`${ipoObj.name} (${ipoObj.code}) halka arz kütüğüne başarıyla kaydedildi!`);
    setTimeout(() => setSyncResult(null), 4000);
  };

  // Handle Auto-Sync All IPOs
  const handleAutoSyncAll = async () => {
    setSyncingAll(true);
    const added = await autoSyncNewIpos();
    setSyncingAll(false);
    setSyncResult(
      added > 0
        ? `Tebrikler! ${added} yeni halka arz şirketi otomatik olarak şirketler kütüğünüze aktarıldı!`
        : `Tüm halka arz şirketleri zaten şirketler kütüğünüzde eksiksiz kayıtlı.`
    );
    setTimeout(() => setSyncResult(null), 5000);
  };

  // Check if IPO symbol is in companies ledger
  const isCompanyInLedger = (code: string) => {
    return companies.some((c) => c.symbol.toUpperCase() === code.toUpperCase());
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
            className="flex items-center gap-2 bg-[var(--ink-2)] border border-[var(--brass)] text-[var(--brass)] hover:bg-[rgba(201,162,75,0.1)] px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            title="Tüm halka arzları şirketler kütüğüne otomatik senkronize eder"
          >
            <RefreshCw className={`w-4 h-4 ${syncingAll ? "animate-spin" : ""}`} />
            <span>Kütükle Otomatik Eşle</span>
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
                onClick={() => setStatusFilter(tab.id as any)}
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

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Halka arz veya kod ara..."
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-md pl-9 pr-3 py-1.5 text-xs text-[var(--paper)] placeholder-[var(--mist)] focus:outline-none focus:border-[var(--brass)] font-sans"
            />
            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-[var(--mist)]" />
          </div>
        </div>

        {/* IPO Cards Grid */}
        {filteredIpos.length === 0 ? (
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
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          syncIpoToLedger(ipo);
                        }}
                        className="bg-[var(--brass)] text-[var(--ink)] hover:bg-[var(--brass-light)] px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                        title="Şirketi kütüğe aktar"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Kütüğe Ekle</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-[var(--brass)] font-semibold flex items-center gap-1">
                        <span>Hesapla</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`${ipo.name} (${ipo.code}) halka arz kaydını silmek istiyor musunuz?`)) {
                            deleteIpo(ipo.id);
                          }
                        }}
                        className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors"
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
      <section className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
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
                onChange={(e) => setParticipants(parseInt(e.target.value))}
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
                  onChange={(e) => setAllocationLots(parseInt(e.target.value) || 1000000)}
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
          </div>

          {/* Big Result Display */}
          <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 flex flex-col justify-between text-center">
            <div>
              <span className="font-mono text-[11px] text-[var(--mist)] uppercase">
                Tahmini Kişi Başı Dağıtılacak
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-[var(--brass)] my-2">
                {calculatedLot} <span className="text-xl font-mono">Lot</span>
              </div>
              <div className="font-mono text-xs text-[var(--verdigris)] font-semibold">
                Gereken Teminat: ~{estimatedCost.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
              </div>
            </div>

            <p className="text-[11px] text-[var(--mist)] font-sans mt-4 border-t border-dashed border-[var(--line)] pt-3">
              * SPK eşit dağıtım metodolojisine göre modellenmiştir. Nihai lot miktarı halka arz sonuç bülteninde netleşir.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 10-Day Ceiling Series Compound Profit Table */}
      <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6">
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
              onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 1000)}
              className="w-28 bg-[var(--ink-3)] border border-[var(--line)] rounded px-2.5 py-1.5 text-xs text-[var(--paper)] font-mono text-right outline-none focus:border-[var(--brass)]"
            />
            <span className="font-mono text-xs text-[var(--paper)]">₺</span>
          </div>
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
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--mist)] hover:text-[var(--paper)] p-1"
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
                    onChange={(e) => setNewStatus(e.target.value as any)}
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[var(--line)] rounded text-[var(--mist)] hover:text-[var(--paper)]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--brass)] text-[var(--ink)] font-bold rounded hover:bg-[var(--brass-light)] shadow-md"
                >
                  Halka Arzı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
