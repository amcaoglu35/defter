"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  Sparkles,
  TrendingUp,
  Plus,
  Shield,
  PieChart,
  RefreshCw,
  Trash2,
  Edit,
  Share2,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import EditBasketModal from "@/components/EditBasketModal";
import ShareCardModal from "@/components/ShareCardModal";
import PrintReportModal from "@/components/PrintReportModal";
import DataStatusBadge from "@/components/DataStatusBadge";
import { isLiveSymbol } from "@/lib/liveSymbols";
import { Printer } from "lucide-react";

export default function SepetDetayPage() {
  const params = useParams();
  const router = useRouter();
  const basketId = params.id as string;

  const { baskets, removeHoldingFromBasket } = useDefterStore();

  const basket =
    baskets.find((b) => b.id === basketId);

  const [period, setPeriod] = useState<"1A" | "3A" | "6A" | "1Y">("6A");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  if (!basket) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl">Sepet bulunamadı.</h2>
        <Link href="/sepetlerim" className="text-xs font-mono text-[var(--brass)] mt-4 inline-block">
          Sepetlerime Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 1. Back Nav & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/sepetlerim")}
          className="flex items-center gap-2 text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sepetlerime Dön</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPrintModalOpen(true)}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-2)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="PDF / Yazdır"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>PDF Rapor</span>
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-2)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>Kart Oluştur</span>
          </button>

          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow cursor-pointer transition-transform active:scale-95"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Varlıkları Yönet &amp; Ağırlık Düzenle</span>
          </button>

          <Link
            href="/orakul"
            className="border border-[var(--brass-dim)] hover:border-[var(--brass)] text-[var(--brass)] bg-[var(--brass-glow)] px-3.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Orakul Rebalance</span>
          </Link>
        </div>
      </div>

      {/* 2. Basket Hero Summary */}
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--paper)]">
              {basket.name}
            </h1>
            <span
              className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase ${
                basket.riskColor === "low"
                  ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)]"
                  : "bg-[rgba(201,162,75,0.2)] text-[var(--brass-dim)]"
              }`}
            >
              {basket.riskLevel} Risk
            </span>
          </div>
          <p className="font-mono text-xs text-[var(--mist)] mt-1">
            {basket.subtitle} • {basket.holdings.length} Varlık
          </p>
        </div>

        {/* Value and return */}
        <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-[var(--line)]">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[var(--paper)]">
            {basket.totalValue.toLocaleString("tr-TR")} ₺
          </div>
          <div className="font-mono text-sm font-semibold text-[var(--verdigris)] mt-1 flex items-center md:justify-end gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>+{basket.totalProfitPercent}% Toplam Kazanç</span>
          </div>
        </div>
      </div>

      {/* 3. Performance Chart & Risk Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)]">
              Sepet Performans Eğrisi
            </h3>
            <div className="flex gap-1.5 font-mono text-[11px]">
              {(["1A", "3A", "6A", "1Y"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    period === p
                      ? "bg-[var(--brass)] text-[var(--ink)] font-bold"
                      : "text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-44 w-full relative flex items-end pt-6 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
              <defs>
                <linearGradient id="basket-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5B8C7B" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#5B8C7B" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 Q100,60 200,65 T400,25 T500,10 L500,120 L0,120 Z"
                fill="url(#basket-grad)"
              />
              <path
                d="M0,80 Q100,60 200,65 T400,25 T500,10"
                fill="none"
                stroke="#5B8C7B"
                strokeWidth="2.5"
              />
              <circle cx="0" cy="80" r="4" fill="#5B8C7B" />
              <circle cx="200" cy="65" r="4" fill="#5B8C7B" />
              <circle cx="400" cy="25" r="4" fill="#5B8C7B" />
              <circle cx="500" cy="10" r="5" fill="#C9A24B" />
            </svg>
          </div>
          <div className="flex justify-between font-mono text-[11px] text-[var(--mist)] pt-2 border-t border-dashed border-[var(--line)]">
            <span>Ocak</span>
            <span>Şubat</span>
            <span>Mart</span>
            <span>Nisan</span>
            <span>Mayıs</span>
            <span className="text-[var(--brass)] font-semibold">Haziran (Son Değer)</span>
          </div>
        </div>

        {/* Risk meter & summary info */}
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] mb-3">
              Risk &amp; Çeşitlendirme Dengesi
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--mist)]">Risk Derecesi</span>
                <span className="text-[var(--verdigris)] font-bold">{basket.riskLevel} Volatilite</span>
              </div>
              <div className="h-2 w-full bg-[var(--ink-3)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--verdigris)] to-[var(--brass)] rounded-full"
                  style={{
                    width:
                      basket.riskLevel === "Düşük"
                        ? "35%"
                        : basket.riskLevel === "Orta"
                        ? "60%"
                        : "85%",
                  }}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3 font-mono text-xs text-[var(--mist)]">
              <div className="flex justify-between border-b border-dashed border-[var(--line)] pb-2">
                <span>Maliyet Tabanı</span>
                <span className="text-[var(--paper)]">{basket.totalCost.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[var(--line)] pb-2">
                <span>Net Kâr</span>
                <span className="text-[var(--verdigris)] font-bold">
                  +{(basket.totalValue - basket.totalCost).toLocaleString("tr-TR")} ₺
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tahmini Temettü Verimi</span>
                <span className="text-[var(--brass)] font-bold">%5.4 Yıllık</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] p-4 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-serif text-[var(--brass)] font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Orakul AI Sepet Notu</span>
            </div>
            <p className="text-xs text-[var(--paper)] leading-relaxed font-sans">
              {basket.aiNote ||
                "Sepet dengesi mevcut makroekonomik koşullarda yüksek koruma ve istikrarlı nakit getirisi sağlamaktadır."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Holdings Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
            Sepet İçi Varlıklar &amp; Ağırlıklar ({basket.holdings.length})
          </h2>

          <button
            onClick={() => setEditModalOpen(true)}
            className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Varlık Ekle / Düzenle</span>
          </button>
        </div>

        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg overflow-hidden">
          {basket.holdings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-xs font-mono text-[var(--mist)] mb-3">
                Bu sepette henüz varlık bulunmuyor.
              </p>
              <button
                onClick={() => setEditModalOpen(true)}
                className="bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-4 py-2 rounded"
              >
                İlk Varlığı Ekle
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[1.5fr_100px_100px_100px_100px_110px_40px] gap-4 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
                <span>Varlık / Şirket</span>
                <span className="text-right">Ağırlık %</span>
                <span className="text-right">Adet</span>
                <span className="text-right">Ort. Maliyet</span>
                <span className="text-right">Güncel Fiyat</span>
                <span className="text-right">Getiri %</span>
                <span className="text-right">Sil</span>
              </div>

              <div className="divide-y divide-dashed divide-[var(--line)]">
                {basket.holdings.map((h) => {
                  const returnPct =
                    h.avgCost > 0
                      ? (((h.currentPrice - h.avgCost) / h.avgCost) * 100).toFixed(1)
                      : "0.0";
                  const isPositive = parseFloat(returnPct) >= 0;

                  return (
                    <div
                      key={h.companySymbol}
                      className="grid grid-cols-1 md:grid-cols-[1.5fr_100px_100px_100px_100px_110px_40px] gap-3 md:gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[rgba(201,162,75,0.03)]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/sirketler/${h.companySymbol}`}
                            className="font-bold text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors font-mono"
                          >
                            {h.companySymbol}
                          </Link>
                          <DataStatusBadge symbol={h.companySymbol} isLive={isLiveSymbol(h.companySymbol)} />
                        </div>
                        <div className="w-full bg-[var(--ink-3)] h-1.5 rounded-full overflow-hidden mt-1.5 max-w-xs">
                          <div
                            className="bg-[var(--brass)] h-full rounded-full"
                            style={{ width: `${h.weightPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right font-mono text-sm font-bold text-[var(--brass)]">
                        %{h.weightPercent}
                      </div>

                      <div className="text-right font-mono text-xs text-[var(--paper)]">
                        {h.quantity} Lot
                      </div>

                      <div className="text-right font-mono text-xs text-[var(--mist)]">
                        {h.avgCost.toFixed(2)} ₺
                      </div>

                      <div className="text-right font-mono text-xs font-semibold text-[var(--paper)]">
                        {h.currentPrice.toFixed(2)} ₺
                      </div>

                      <div
                        className={`text-right font-mono text-xs font-bold ${
                          isPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {returnPct}%
                      </div>

                      <div className="text-right">
                        <button
                          onClick={() =>
                            removeHoldingFromBasket(basket.id, h.companySymbol)
                          }
                          className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors cursor-pointer"
                          title="Varlığı Sepetten Çıkar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Edit Basket Modal */}
      <EditBasketModal
        basket={basket}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />

      {/* Share Story Card Modal */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={basket.name}
        subtitle={`${basket.riskLevel} Risk • ${basket.holdings.length} Varlık`}
        type="basket"
        data={{
          primaryLabel: "Sepet Değeri",
          primaryMetric: `${basket.totalValue.toLocaleString("tr-TR")} ₺`,
          secondaryLabel: "Kümülatif Kâr",
          secondaryMetric: `+${basket.totalProfitPercent}%`,
          tags: basket.holdings.map((h) => `${h.companySymbol} (%${h.weightPercent})`),
          note: basket.subtitle,
        }}
      />

      {/* Print Report PDF Modal */}
      <PrintReportModal
        basket={basket}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
