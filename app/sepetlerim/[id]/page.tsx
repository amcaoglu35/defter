"use client";

import React, { useState, useMemo, useId } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Plus,
  Shield,
  PieChart,
  RefreshCw,
  Trash2,
  Edit,
  Share2,
  Printer,
  Scale,
  Info,
  History,
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
  Scissors,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { BasketHolding } from "@/lib/mockData";
import EditBasketModal from "@/components/EditBasketModal";
import ShareCardModal from "@/components/ShareCardModal";
import PrintReportModal from "@/components/PrintReportModal";
import ConfirmModal from "@/components/ConfirmModal";
import DataStatusBadge from "@/components/DataStatusBadge";
import { useToast } from "@/components/ToastProvider";
import { isLiveSymbol } from "@/lib/liveSymbols";
import { exportBasketToExcel } from "@/lib/exportUtils";
import { BasketRiskMetricsCard } from "@/components/BasketRiskMetricsCard";
import { CorrelationMatrixCard } from "@/components/CorrelationMatrixCard";
import { BasketTreemap } from "@/components/BasketTreemap";
import { RealReturnBadge } from "@/components/RealReturnBadge";
import MonteCarloSimulatorModal from "@/components/MonteCarloSimulatorModal";
import RebalanceModal from "@/components/RebalanceModal";
import { StockSplitModal } from "@/components/StockSplitModal";
import { BasketDeviationAlertBar } from "@/components/BasketDeviationAlertBar";
import { BasketBenchmarkComparison } from "@/components/BasketBenchmarkComparison";
import { MarketShockSimulatorCard } from "@/components/MarketShockSimulatorCard";
import { useBasketRiskAnalytics } from "@/lib/useBasketRiskAnalytics";
import { BasketInteractiveChart, ChartPeriod } from "@/components/BasketInteractiveChart";

export default function SepetDetayPage() {
  const params = useParams();
  const router = useRouter();
  const basketId = params.id as string;
  const { showToast } = useToast();

  const {
    baskets,
    companies,
    removeHoldingFromBasket,
    updateHolding,
    deleteBasket,
    isPrivacyMode,
    transactions,
    addTransaction,
  } = useDefterStore();

  const [period, setPeriod] = useState<ChartPeriod>("6A");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [monteCarloModalOpen, setMonteCarloModalOpen] = useState(false);
  const [rebalanceModalOpen, setRebalanceModalOpen] = useState(false);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [selectedSplitHolding, setSelectedSplitHolding] = useState<BasketHolding | null>(null);
  const [holdingToDelete, setHoldingToDelete] = useState<BasketHolding | null>(null);

  const basket = baskets.find((b) => b.id === basketId);

  // Real Analytics & Historical Portfolio Price Series
  const periodParam = period === "1A" ? "1m" : period === "3A" ? "3m" : period === "6A" ? "6m" : "1y";
  const { riskProfile, portfolioPriceSeries, benchmarkPriceSeries, isLoading: isAnalyticsLoading } = useBasketRiskAnalytics(basket, periodParam);

  // Dynamic Weighted Dividend Yield Calculation
  const weightedDivYield = useMemo(() => {
    if (!basket || basket.holdings.length === 0) return "0.0";
    let totalWeight = 0;
    let weightedSum = 0;
    basket.holdings.forEach((h) => {
      const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
      const yieldPct = co?.dividendYield || 0;
      const w = h.weightPercent || 1;
      weightedSum += w * yieldPct;
      totalWeight += w;
    });
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : "0.0";
  }, [basket, companies]);

  if (!basket) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl text-[var(--paper)]">Sepet bulunamadı.</h2>
        <Link href="/sepetlerim" className="text-xs font-mono text-[var(--brass)] mt-4 inline-block hover:underline">
          Sepetlerime Dön
        </Link>
      </div>
    );
  }

  const isProfitPositive = basket.totalProfitPercent >= 0;
  const netProfit = basket.totalValue - basket.totalCost;
  const isNetProfitPositive = netProfit >= 0;

  const riskBadgeClass =
    basket.riskLevel === "Düşük"
      ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] border border-[rgba(91,140,123,0.3)]"
      : basket.riskLevel === "Orta"
      ? "bg-[rgba(201,162,75,0.2)] text-[var(--brass-dim)] border border-[rgba(201,162,75,0.3)]"
      : "bg-[rgba(163,59,59,0.2)] text-[var(--loss)] border border-[rgba(163,59,59,0.3)]";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 1. Back Nav & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => router.push("/sepetlerim")}
          className="flex items-center gap-2 text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sepetlerime Dön</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportBasketToExcel(basket, companies)}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-2)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sepeti Microsoft Excel (.xlsx) olarak indir"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--verdigris)]" />
            <span>Excel İndir (.xlsx)</span>
          </button>

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

          <button
            onClick={() => setMonteCarloModalOpen(true)}
            className="border border-purple-500/30 hover:border-purple-400 text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer"
            title="1.000 Geometrik Brownian piyasa senaryosu simülasyonu"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monte Carlo</span>
          </button>

          <button
            onClick={() => setRebalanceModalOpen(true)}
            className="border border-amber-500/30 hover:border-amber-400 text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer"
            title="Ağırlık sapmalarını optimize et"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Yeniden Dengele</span>
          </button>

          <button
            onClick={() => {
              setSelectedSplitHolding(null);
              setSplitModalOpen(true);
            }}
            className="border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 bg-emerald-500/10 px-3.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer"
            title="Bedelsiz sermaye artırımı veya hisse bölünmesi maliyet düzeltici"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Bölünme Düzelt</span>
          </button>

          <Link
            href={`/orakul?basketId=${basket.id}`}
            className="border border-[var(--brass-dim)] hover:border-[var(--brass)] text-[var(--brass)] bg-[var(--brass-glow)] px-3.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Orakul AI</span>
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
            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${riskBadgeClass}`}>
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
            {isPrivacyMode ? "•••••• ₺" : `${basket.totalValue.toLocaleString("tr-TR")} ₺`}
          </div>
          <div
            className={`font-mono text-sm font-semibold mt-1 flex items-center md:justify-end gap-1 ${
              isProfitPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
            }`}
          >
            {isProfitPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPrivacyMode ? "•••••• ₺" : `${isProfitPositive ? "+" : ""}${basket.totalProfitPercent}% Toplam Kazanç`}
            </span>
          </div>
          <div className="mt-1.5 flex md:justify-end">
            <RealReturnBadge nominalReturnPct={basket.totalProfitPercent} />
          </div>
        </div>
      </div>

      {/* Target Weight Deviation Alert Bar */}
      <BasketDeviationAlertBar basket={basket} onOpenRebalanceModal={() => setRebalanceModalOpen(true)} />

      {/* 3. Performance Chart & Risk Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BasketInteractiveChart
            basket={basket}
            portfolioPriceSeries={portfolioPriceSeries}
            benchmarkPriceSeries={benchmarkPriceSeries}
            isLoading={isAnalyticsLoading}
            period={period}
            onPeriodChange={setPeriod}
          />
        </div>

        {/* Risk meter & summary info */}
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] mb-3 font-semibold">
              Risk &amp; Çeşitlendirme Dengesi
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--mist)]">Risk Derecesi</span>
                <span className="text-[var(--paper)] font-bold">{basket.riskLevel} Volatilite</span>
              </div>
              <div className="h-2 w-full bg-[var(--ink-3)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    basket.riskLevel === "Düşük"
                      ? "bg-[var(--verdigris)]"
                      : basket.riskLevel === "Orta"
                      ? "bg-[var(--brass)]"
                      : "bg-[var(--loss)]"
                  }`}
                  style={{
                    width:
                      basket.riskLevel === "Düşük"
                        ? "35%"
                        : basket.riskLevel === "Orta"
                        ? "65%"
                        : "90%",
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
                <span>Net Kâr / Zarar</span>
                <span className={`font-bold ${isNetProfitPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                  {isNetProfitPositive ? "+" : ""}
                  {netProfit.toLocaleString("tr-TR")} ₺
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ağırlıklı Temettü Verimi</span>
                <span className="text-[var(--brass)] font-bold">%{weightedDivYield} Yıllık</span>
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
                "Sepet varlık dengesi seçili risk profiline uygun olarak sermaye koruması ve sürdürülebilir büyüme sağlamaktadır."}
            </p>
          </div>
        </div>
      </div>

      {/* Quantitative Risk & Volatility Scorecard */}
      <BasketRiskMetricsCard basket={basket} riskProfile={riskProfile} />

      {/* Sepet vs BIST 100 / Altın / Dolar Benchmark Comparison */}
      <BasketBenchmarkComparison basket={basket} />

      {/* Portföy Piyasa Şoku & Kriz Stres Testi */}
      <MarketShockSimulatorCard basket={basket} />

      {/* Cross-Asset Pearson Correlation Heatmap */}
      <CorrelationMatrixCard basket={basket} />

      {/* Sectoral & Asset Class Treemap */}
      <BasketTreemap basket={basket} companies={companies} />

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
                className="bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-4 py-2 rounded cursor-pointer"
              >
                İlk Varlığı Ekle
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[1.4fr_120px_90px_95px_95px_95px_40px] gap-3 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
                <span>Varlık / Şirket</span>
                <span className="text-right">Ağırlık (Güncel / Hedef)</span>
                <span className="text-right">Adet</span>
                <span className="text-right">Ort. Maliyet</span>
                <span className="text-right">Güncel Fiyat</span>
                <span className="text-right">Getiri %</span>
                <span className="text-right">Sil</span>
              </div>

              <div className="divide-y divide-dashed divide-[var(--line)]">
                {basket.holdings.map((h, idx) => {
                  const returnPct =
                    h.avgCost > 0
                      ? (((h.currentPrice - h.avgCost) / h.avgCost) * 100).toFixed(1)
                      : "0.0";
                  const isPositive = parseFloat(returnPct) >= 0;
                  const targetW = h.targetWeightPercent ?? h.weightPercent;
                  const deviation = Math.abs(h.weightPercent - targetW);
                  const holdingKey = h.id || `${h.companySymbol}-${idx}`;

                  return (
                    <div
                      key={holdingKey}
                      className="grid grid-cols-1 md:grid-cols-[1.4fr_120px_90px_95px_95px_95px_40px] gap-3 p-4 md:px-6 md:py-4 items-center hover:bg-[rgba(201,162,75,0.03)]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/sirketler/${encodeURIComponent(h.companySymbol)}`}
                            className="font-bold text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors font-mono"
                          >
                            {h.companySymbol}
                          </Link>
                          <DataStatusBadge symbol={h.companySymbol} isLive={isLiveSymbol(h.companySymbol)} />
                          {deviation >= 5 && (
                            <span
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[rgba(201,162,75,0.15)] text-[var(--brass)] border border-[var(--brass-dim)] hidden sm:inline-block"
                              title={`Hedef sapması: %${deviation.toFixed(1)}. Rebalance önerilir.`}
                            >
                              Dengeleme
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-[var(--ink-3)] h-1.5 rounded-full overflow-hidden mt-1.5 max-w-xs">
                          <div
                            className="bg-[var(--brass)] h-full rounded-full"
                            style={{ width: `${Math.min(h.weightPercent, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <div className="font-bold text-[var(--brass)] text-sm">
                          %{h.weightPercent}
                        </div>
                        <div className="text-[10px] text-[var(--mist)]">
                          Hedef: %{targetW}
                        </div>
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
                          type="button"
                          onClick={() => setHoldingToDelete(h)}
                          className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors cursor-pointer rounded hover:bg-[rgba(163,59,59,0.1)]"
                          title="Varlığı Sepetten Çıkar (Satış kaydı oluşturur)"
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

      {/* 5. Basket Transactions History Section */}
      <section className="space-y-4 pt-4 border-t border-[var(--line)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[var(--brass)]" />
            <h2 className="font-serif text-xl text-[var(--paper)] font-medium">
              Bu Sepete Ait İşlem Geçmişi ({transactions.filter((t) => t.basketId === basket.id).length})
            </h2>
          </div>
        </div>

        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-4">
          {transactions.filter((t) => t.basketId === basket.id).length === 0 ? (
            <p className="text-xs text-[var(--mist)] font-mono py-3 text-center">
              Bu sepet için henüz kaydedilmiş bir alış/satış işlem hareketi bulunmuyor. &quot;Alış / Satış İşlemi&quot; yaptıkça geçmiş burada listelenir.
            </p>
          ) : (
            <div className="divide-y divide-dashed divide-[var(--line)]">
              {transactions
                .filter((t) => t.basketId === basket.id)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="py-2.5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          tx.type === "BUY"
                            ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)]"
                            : "bg-[rgba(163,59,59,0.15)] text-[var(--loss)]"
                        }`}
                      >
                        {tx.type === "BUY" ? "ALIŞ" : "SATIŞ"}
                      </span>
                      <span className="font-bold text-[var(--paper)]">
                        {tx.companySymbol}
                      </span>
                      <span className="text-[var(--paper-dim)]">
                        {tx.quantity} Adet @ {tx.price} ₺
                      </span>
                      {tx.note && (
                        <span className="text-[var(--mist)] italic hidden sm:inline-block">
                          ({tx.note})
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-[var(--paper)]">
                        {tx.totalAmount.toLocaleString("tr-TR")} ₺
                      </div>
                      <div className="text-[10px] text-[var(--mist)]">{tx.date}</div>
                    </div>
                  </div>
                ))}
            </div>
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
          secondaryMetric: `${basket.totalProfitPercent >= 0 ? "+" : ""}${basket.totalProfitPercent}%`,
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

      {/* Confirmation Modal for Removing a Holding with SELL transaction */}
      <ConfirmModal
        isOpen={!!holdingToDelete}
        onClose={() => setHoldingToDelete(null)}
        onConfirm={() => {
          if (!holdingToDelete) return;
          const price = holdingToDelete.currentPrice || holdingToDelete.avgCost || 0;
          const totalAmount = holdingToDelete.quantity * price;

          addTransaction(
            {
              companySymbol: holdingToDelete.companySymbol,
              type: "SELL",
              quantity: holdingToDelete.quantity,
              price: price,
              totalAmount: parseFloat(totalAmount.toFixed(2)),
              date: new Date().toISOString().split("T")[0],
              note: `${basket.name} sepetinden varlık tasfiyesi / çıkarma`,
            },
            basket.id
          );

          removeHoldingFromBasket(basket.id, holdingToDelete.id || holdingToDelete.companySymbol);

          showToast(
            "Varlık Sepetten Çıkarıldı",
            `${holdingToDelete.companySymbol} (${holdingToDelete.quantity} Lot) sepetten çıkarıldı ve ${price.toFixed(2)} ₺ fiyattan Satış işlemi olarak kütüğe işlendi.`,
            "success"
          );

          setHoldingToDelete(null);
        }}
        title="Varlığı Sepetten Çıkar"
        description={
          holdingToDelete ? (
            <div className="space-y-2">
              <p>
                <strong className="text-[var(--paper)]">{holdingToDelete.companySymbol}</strong> ({holdingToDelete.quantity} Lot) varlığını <strong className="text-[var(--paper)]">{basket.name}</strong> sepetinden çıkarmak istediğinize emin misiniz?
              </p>
              <div className="bg-[var(--ink-3)] p-2.5 rounded border border-[var(--line)] text-[11px] font-mono text-[var(--brass)]">
                ℹ️ İşlem geçmişinin ve kâr/zarar hesabının bozulmaması için bu pozisyon <strong>{(holdingToDelete.currentPrice || holdingToDelete.avgCost || 0).toFixed(2)} ₺</strong> güncel fiyattan bir <strong>SATIŞ (SELL)</strong> işlemi olarak kütüğe işlenecektir.
              </div>
            </div>
          ) : ""
        }
        confirmText="Varlığı Çıkar & Satışı Kaydet"
        cancelText="Vazgeç"
        variant="danger"
      />

      {/* Stochastic Monte Carlo Simulation Modal */}
      <MonteCarloSimulatorModal
        isOpen={monteCarloModalOpen}
        onClose={() => setMonteCarloModalOpen(false)}
        basketName={basket.name}
        initialValue={basket.totalValue}
        annualReturnPct={basket.totalProfitPercent > 0 ? Math.min(50, Math.max(15, basket.totalProfitPercent)) : 30}
        annualVolPct={riskProfile?.volatilityAnnualizedPct ?? 22}
      />

      {/* Deterministic Portfolio Rebalancing Assistant Modal */}
      <RebalanceModal
        isOpen={rebalanceModalOpen}
        onClose={() => setRebalanceModalOpen(false)}
        basket={basket}
        companies={companies}
      />

      {/* Bedelsiz & Hisse Bölünmesi Düzeltme Modalı */}
      <StockSplitModal
        isOpen={splitModalOpen}
        onClose={() => setSplitModalOpen(false)}
        basket={basket}
        initialHolding={selectedSplitHolding}
      />
    </div>
  );
}
