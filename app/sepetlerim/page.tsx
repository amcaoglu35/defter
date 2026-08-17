"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  ArrowUpRight,
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Basket, BasketHolding } from "@/lib/mockData";
import EditBasketModal from "@/components/EditBasketModal";
import ConfirmModal from "@/components/ConfirmModal";
import { exportBasketToExcel } from "@/lib/exportUtils";
import { useToast } from "@/components/ToastProvider";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface StrategyTemplate {
  name: string;
  sub: string;
  risk: "Düşük" | "Orta" | "Yüksek";
  holdings: { symbol: string; weight: number; qty: number }[];
}

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    name: "Temettü Şampiyonları",
    sub: "Yüksek verimli düzenli temettü dağıtan BIST şirketleri",
    risk: "Düşük",
    holdings: [
      { symbol: "TUPRS", weight: 30, qty: 30 },
      { symbol: "FROTO", weight: 30, qty: 10 },
      { symbol: "EREGL", weight: 20, qty: 60 },
      { symbol: "KCHOL", weight: 20, qty: 25 },
    ],
  },
  {
    name: "Enflasyon & Kur Kalkanı",
    sub: "Döviz bazlı ihracatçılar ve kıymetli maden dengesi",
    risk: "Orta",
    holdings: [
      { symbol: "ALTIN/GR", weight: 35, qty: 5 },
      { symbol: "THYAO", weight: 25, qty: 20 },
      { symbol: "SISE", weight: 20, qty: 50 },
      { symbol: "SAHOL", weight: 20, qty: 35 },
    ],
  },
  {
    name: "Büyüme & Teknoloji İhracatı",
    sub: "Yüksek kâr marjlı teknoloji ve havacılık odaklı büyüme",
    risk: "Yüksek",
    holdings: [
      { symbol: "ASELS", weight: 35, qty: 40 },
      { symbol: "MIATK", weight: 25, qty: 30 },
      { symbol: "ASTOR", weight: 20, qty: 25 },
      { symbol: "THYAO", weight: 20, qty: 15 },
    ],
  },
  {
    name: "Kıymetli Maden & Emtia Kalesi",
    sub: "Gram Altın, Gümüş ve defansif koruma varlıkları",
    risk: "Düşük",
    holdings: [
      { symbol: "ALTIN/GR", weight: 55, qty: 8 },
      { symbol: "GÜMÜŞ/GR", weight: 25, qty: 250 },
      { symbol: "EREGL", weight: 20, qty: 40 },
    ],
  },
  {
    name: "BIST 30 Lider Şirketler",
    sub: "Borsa İstanbul'un en güçlü ve likit mavi çip devleri",
    risk: "Orta",
    holdings: [
      { symbol: "THYAO", weight: 25, qty: 20 },
      { symbol: "TUPRS", weight: 25, qty: 25 },
      { symbol: "BIMAS", weight: 25, qty: 15 },
      { symbol: "GARAN", weight: 25, qty: 30 },
    ],
  },
];

export default function SepetlerimPage() {
  const { baskets, createBasket, deleteBasket, dividends, companies, isPrivacyMode } = useDefterStore();
  const { showToast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingBasket, setEditingBasket] = useState<Basket | null>(null);
  const [basketToDelete, setBasketToDelete] = useState<Basket | null>(null);

  useEscapeKey(createModalOpen, () => setCreateModalOpen(false));

  // Form state
  const [basketName, setBasketName] = useState("");
  const [basketSubtitle, setBasketSubtitle] = useState("");
  const [riskLevel, setRiskLevel] = useState<"Düşük" | "Orta" | "Yüksek">("Düşük");
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);

  const handleSelectTemplate = (tpl: StrategyTemplate) => {
    setSelectedTemplate(tpl);
    setBasketName(tpl.name);
    setBasketSubtitle(tpl.sub);
    setRiskLevel(tpl.risk);
  };

  const handleCreateBasket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basketName) return;

    let initialHoldings: BasketHolding[] = [];

    if (selectedTemplate && selectedTemplate.holdings.length > 0) {
      initialHoldings = selectedTemplate.holdings.map((h) => {
        const co = companies.find((c) => c.symbol === h.symbol);
        const price = co ? co.price : 100;
        return {
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `h-${h.symbol}-${Date.now()}`,
          companySymbol: h.symbol,
          weightPercent: h.weight,
          targetWeightPercent: h.weight,
          quantity: h.qty,
          avgCost: price,
          currentPrice: price,
        };
      });
    }

    const newBasket: Basket = {
      id: basketName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4),
      name: basketName,
      subtitle: basketSubtitle || "Kişisel Özel Portföy",
      riskLevel: riskLevel,
      riskColor: riskLevel === "Düşük" ? "low" : riskLevel === "Orta" ? "mid" : "high",
      totalValue: 0,
      totalCost: 0,
      dailyChange: 0.0,
      totalProfitPercent: 0.0,
      description: basketSubtitle || "Yeni oluşturulan yatırım sepeti.",
      holdings: initialHoldings,
    };

    createBasket(newBasket);
    showToast("Sepet Oluşturuldu", `"${newBasket.name}" başarıyla kütüğe eklendi.`, "success");
    setBasketName("");
    setBasketSubtitle("");
    setSelectedTemplate(null);
    setCreateModalOpen(false);
  };

  // Portfolio Totals
  const totalValue = baskets.reduce((acc, b) => acc + b.totalValue, 0);
  const totalCost = baskets.reduce((acc, b) => acc + b.totalCost, 0);
  const totalProfit = totalValue - totalCost;
  const isProfitPositive = totalProfit >= 0;
  const profitPercent =
    totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : "0.0";

  const totalDividends = dividends.reduce(
    (acc, d) => acc + (d.totalEstimatedPayout || 0),
    0
  );

  const handleExportAllBaskets = () => {
    if (baskets.length === 0) return;
    baskets.forEach((b) => exportBasketToExcel(b, companies));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* 1. Page Head */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <span className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
            Portföy Yönetimi
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--paper)] font-medium mt-1">
            Sepetlerim &amp; Temettü Takvimi
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {baskets.length > 0 && (
            <button
              onClick={handleExportAllBaskets}
              title="Tüm sepetleri Excel / CSV olarak indir"
              className="bg-[var(--ink-2)] hover:bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--paper)] font-mono text-xs px-3.5 py-2.5 rounded-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[var(--verdigris)]" />
              <span className="hidden sm:inline">Excel/CSV İndir</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedTemplate(null);
              setBasketName("");
              setBasketSubtitle("");
              setCreateModalOpen(true);
            }}
            className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-semibold text-sm px-4 py-2.5 rounded-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Sepet Oluştur</span>
          </button>
        </div>
      </div>

      {/* 2. Combined Summary Strip */}
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] mb-1">
            Toplam Sepet Değeri
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[var(--paper)]">
            {isPrivacyMode ? "•••••• ₺" : `${totalValue.toLocaleString("tr-TR")} ₺`}
          </div>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] mb-1">
            Kümülatif Getiri
          </div>
          <div
            className={`font-serif text-2xl sm:text-3xl font-bold flex items-center gap-1.5 ${
              isProfitPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
            }`}
          >
            {isProfitPositive ? <TrendingUp className="w-6 h-6 shrink-0" /> : <TrendingDown className="w-6 h-6 shrink-0" />}
            <span>
              {isPrivacyMode
                ? "•••••• ₺"
                : `${isProfitPositive ? "+" : ""}${totalProfit.toLocaleString("tr-TR")} ₺ (${isProfitPositive ? "+" : ""}%${profitPercent})`}
            </span>
          </div>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] mb-1">
            Yıllık Beklenen Temettü (Portföy)
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[var(--brass)]">
            {totalDividends.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
          </div>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] mb-1">
            Aktif Sepet Sayısı
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[var(--paper)]">
            {baskets.length} Adet
          </div>
        </div>
      </div>

      {/* 3. Basket Ticket Cards Grid */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
          Kayıtlı Yatırım Sepetleri ({baskets.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {baskets.map((basket) => {
            const isBasketPositive = basket.totalProfitPercent >= 0;
            const riskBadgeClass =
              basket.riskLevel === "Düşük"
                ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] border border-[rgba(91,140,123,0.3)]"
                : basket.riskLevel === "Orta"
                ? "bg-[rgba(201,162,75,0.2)] text-[var(--brass-dim)] border border-[rgba(201,162,75,0.3)]"
                : "bg-[rgba(163,59,59,0.2)] text-[var(--loss)] border border-[rgba(163,59,59,0.3)]";

            return (
              <div
                key={basket.id}
                className="ticket-card p-6 block group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/sepetlerim/${basket.id}`}
                        className="font-serif font-bold text-xl text-[var(--ink)] group-hover:text-[var(--brass-dim)] transition-colors hover:underline block"
                      >
                        {basket.name}
                      </Link>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--brass-dim)] mt-0.5">
                        {basket.subtitle}
                      </p>
                    </div>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${riskBadgeClass}`}>
                      {basket.riskLevel} Risk
                    </span>
                  </div>

                  <div className="border-t border-dashed border-[rgba(18,21,28,0.25)] my-4 pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[rgba(18,21,28,0.6)]">
                        Mevcut Değer
                      </div>
                      <div className="font-mono font-bold text-lg text-[var(--ink)]">
                        {basket.totalValue.toLocaleString("tr-TR")} ₺
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[rgba(18,21,28,0.6)]">
                        Net Kazanç
                      </div>
                      <div
                        className={`font-mono font-bold text-sm ${
                          isBasketPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                        }`}
                      >
                        {isBasketPositive ? "+" : ""}
                        {basket.totalProfitPercent}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mt-3">
                    <div className="text-[10px] font-mono text-[rgba(18,21,28,0.5)] uppercase tracking-wider">
                      Varlık Ağırlıkları ({basket.holdings.length} Varlık)
                    </div>
                    {basket.holdings.length === 0 ? (
                      <div className="text-xs text-[rgba(18,21,28,0.5)] italic py-1 font-mono">
                        Sepet henüz boş.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {basket.holdings.map((h) => (
                          <span
                            key={h.companySymbol}
                            className="font-mono text-xs bg-[rgba(18,21,28,0.08)] px-2.5 py-1 rounded-full font-medium text-[var(--ink)]"
                          >
                            {h.companySymbol} %{h.weightPercent}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons at bottom of ticket */}
                <div className="pt-4 mt-4 border-t border-dashed border-[rgba(18,21,28,0.15)] flex items-center justify-between">
                  <Link
                    href={`/sepetlerim/${basket.id}`}
                    className="font-mono text-xs font-bold text-[var(--ink)] hover:text-[var(--brass-dim)] flex items-center gap-1"
                  >
                    <span>Detayları Aç</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingBasket(basket)}
                      className="p-1 text-[var(--ink)] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                      title="Sepeti Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setBasketToDelete(basket)}
                      className="p-1 text-[var(--loss)] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                      title="Sepeti Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Basket Dashed Card */}
          <button
            onClick={() => {
              setSelectedTemplate(null);
              setBasketName("");
              setBasketSubtitle("");
              setCreateModalOpen(true);
            }}
            className="border-2 border-dashed border-[var(--line)] hover:border-[var(--brass-dim)] rounded-lg min-h-[240px] flex flex-col items-center justify-center p-6 text-[var(--mist)] hover:text-[var(--paper)] transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full border border-[var(--line)] group-hover:border-[var(--brass)] flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-[var(--brass)]" />
            </div>
            <span className="font-serif text-lg font-medium text-[var(--paper)]">
              Yeni Sepet Tasarla
            </span>
            <span className="text-xs text-[var(--mist)] mt-1 font-mono">
              Hedef varlık ve ağırlıkları belirle
            </span>
          </button>
        </div>
      </section>

      {/* 4. Dynamic Dividend Calendar Section */}
      <section className="space-y-4 pt-4 border-t border-[var(--line)]">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
              Nakit Akışı Motoru
            </span>
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium mt-1">
              Portföy Temettü Takvimi
            </h2>
          </div>
        </div>

        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-[110px_1.5fr_110px_110px_140px_100px] gap-4 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
            <span>Tarih</span>
            <span>Şirket</span>
            <span className="text-right">Hisse Başı (Net)</span>
            <span className="text-right">Portföy Adedi</span>
            <span className="text-right">Tahmini Toplam</span>
            <span className="text-right">Durum</span>
          </div>

          <div className="divide-y divide-dashed divide-[var(--line)]">
            {dividends.map((div) => {
              const isOwned = (div.ownedLots || 0) > 0;

              return (
                <div
                  key={div.id}
                  className={`grid grid-cols-1 md:grid-cols-[110px_1.5fr_110px_110px_140px_100px] gap-3 md:gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[rgba(201,162,75,0.03)] ${
                    !isOwned ? "opacity-75" : ""
                  }`}
                >
                  <div className="font-mono text-xs text-[var(--brass)] font-semibold">
                    {(() => {
                      if (!div.paymentDate || div.paymentDate === "Açıklanmadı") return "Açıklanmadı";
                      const d = new Date(div.paymentDate);
                      return !isNaN(d.getTime())
                        ? d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
                        : div.paymentDate;
                    })()}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-xs font-bold text-[var(--brass)] shrink-0">
                      {div.companySymbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-[var(--paper)]">
                        {div.companyName}
                      </div>
                      <div className="text-xs text-[var(--mist)] font-mono">
                        {div.companySymbol} • Verim: %{div.yieldPercent}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-sm text-[var(--paper)]">
                    {div.netAmountPerShare.toFixed(2)} ₺
                  </div>

                  <div className="text-right font-mono text-xs">
                    {isOwned ? (
                      <span className="text-[var(--brass)] font-bold">{div.ownedLots} Lot</span>
                    ) : (
                      <span className="text-[var(--mist)] italic">0 Lot</span>
                    )}
                  </div>

                  <div className="text-right font-mono text-sm font-bold">
                    {isOwned ? (
                      <span className="text-[var(--verdigris)]">
                        {(div.totalEstimatedPayout || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                      </span>
                    ) : (
                      <span className="text-[var(--mist)]">0.00 ₺</span>
                    )}
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        div.status === "Ödendi"
                          ? "text-[var(--verdigris)] border-[var(--verdigris)] bg-[rgba(91,140,123,0.1)]"
                          : "text-[var(--brass)] border-[var(--brass-dim)] bg-[var(--brass-glow)]"
                      }`}
                    >
                      {div.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Create Basket Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[var(--paper)]">
                  Yeni Yatırım Sepeti Tanımla
                </h3>
                <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
                  Hazır strateji şablonlarından seçebilir veya sıfırdan oluşturabilirsiniz.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smart Strategy Template Chips */}
            <div>
              <label className="block text-[11px] font-mono text-[var(--brass)] uppercase mb-2 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tek Tıkla Hazır Strateji Şablonları</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STRATEGY_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate?.name === tpl.name;
                  return (
                    <button
                      key={tpl.name}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`px-2.5 py-1.5 rounded-md border text-[11px] font-mono transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)] shadow-md"
                          : "bg-[var(--ink-3)] hover:bg-[var(--ink)] border-[var(--line)] text-[var(--paper-dim)] hover:text-[var(--brass)]"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {tpl.name}
                    </button>
                  );
                })}
              </div>

              {/* Template Preview Chips */}
              {selectedTemplate && (
                <div className="mt-3 p-3 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-lg space-y-1.5">
                  <div className="text-[10px] font-mono text-[var(--brass)] uppercase font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Şablon Varlıkları &amp; Hedef Ağırlıkları ({selectedTemplate.holdings.length} Varlık)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.holdings.map((h) => (
                      <span
                        key={h.symbol}
                        className="font-mono text-xs bg-[var(--ink-2)] border border-[var(--line)] px-2 py-0.5 rounded text-[var(--paper)]"
                      >
                        {h.symbol} %{h.weight} ({h.qty} Lot)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleCreateBasket} className="space-y-4 pt-2 border-t border-dashed border-[var(--line)]">
              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                  Sepet Adı
                </label>
                <input
                  type="text"
                  required
                  value={basketName}
                  onChange={(e) => setBasketName(e.target.value)}
                  placeholder="Örn: BIST Temettü Kalesi"
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                  Kısa Açıklama / Strateji Hedefi
                </label>
                <input
                  type="text"
                  value={basketSubtitle}
                  onChange={(e) => setBasketSubtitle(e.target.value)}
                  placeholder="Örn: Düzenli nakit akışı ve bileşik büyüme"
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--mist)] uppercase mb-1">
                  Risk Seviyesi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Düşük", "Orta", "Yüksek"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setRiskLevel(lvl)}
                      className={`py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        riskLevel === lvl
                          ? "border-[var(--brass)] bg-[var(--brass)] text-[var(--ink)] font-bold shadow-md"
                          : "border-[var(--line)] text-[var(--mist)] bg-[var(--ink-3)] hover:text-[var(--paper)]"
                      }`}
                    >
                      {lvl} Risk
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 border border-[var(--line)] py-2.5 rounded-lg text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={!basketName.trim()}
                  className="flex-1 bg-[var(--brass)] text-[var(--ink)] font-bold py-2.5 rounded-lg text-xs hover:bg-[#d9b35a] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow transition-opacity"
                >
                  Sepeti Kaydet &amp; Başla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Basket Modal */}
      {editingBasket && (
        <EditBasketModal
          basket={editingBasket}
          isOpen={Boolean(editingBasket)}
          onClose={() => setEditingBasket(null)}
        />
      )}

      {/* 7. Confirm Delete Basket Modal */}
      <ConfirmModal
        isOpen={!!basketToDelete}
        onClose={() => setBasketToDelete(null)}
        onConfirm={() => {
          if (basketToDelete) {
            showToast(
              "Sepet Silindi",
              `"${basketToDelete.name}" sepeti kütükten kaldırıldı.`,
              "success"
            );
            deleteBasket(basketToDelete.id);
            setBasketToDelete(null);
          }
        }}
        title="Sepeti Sil"
        description={
          basketToDelete ? (
            <div className="space-y-1">
              <p>
                <strong className="text-[var(--paper)]">&quot;{basketToDelete.name}&quot;</strong> sepetini kütükten tamamen silmek istediğinize emin misiniz?
              </p>
              <p className="text-[11px] text-[var(--mist)]">
                Bu sepette kayıtlı {basketToDelete.holdings.length} adet varlık pozisyonu kaldırılacaktır.
              </p>
            </div>
          ) : ""
        }
        confirmText="Sepeti Kalıcı Olarak Sil"
        cancelText="Vazgeç"
        variant="danger"
      />
    </div>
  );
}
