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
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import EditBasketModal from "@/components/EditBasketModal";
import ShareCardModal from "@/components/ShareCardModal";
import PrintReportModal from "@/components/PrintReportModal";
import DataStatusBadge from "@/components/DataStatusBadge";
import { isLiveSymbol } from "@/lib/liveSymbols";

type PeriodType = "1A" | "3A" | "6A" | "1Y";

export default function SepetDetayPage() {
  const params = useParams();
  const router = useRouter();
  const basketId = params.id as string;
  const chartUid = useId();
  const basketGradId = `basket-chart-grad-${chartUid}`;

  const { baskets, companies, removeHoldingFromBasket } = useDefterStore();

  const basket = baskets.find((b) => b.id === basketId);

  const [period, setPeriod] = useState<PeriodType>("6A");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Dynamic Weighted Dividend Yield Calculation
  const weightedDivYield = useMemo(() => {
    if (!basket || basket.holdings.length === 0) return "0.0";
    let totalWeight = 0;
    let weightedSum = 0;
    basket.holdings.forEach((h) => {
      const co = companies.find((c) => c.symbol === h.companySymbol);
      const yieldPct = co?.dividendYield || 0;
      const w = h.weightPercent || 1;
      weightedSum += w * yieldPct;
      totalWeight += w;
    });
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : "0.0";
  }, [basket, companies]);

  // Dynamic Chart Points & Date Labels based on Period
  const chartData = useMemo(() => {
    if (!basket) return { points: [], pathD: "", areaD: "", labels: [] };

    const totalVal = basket.totalValue || 100000;
    const profitPct = basket.totalProfitPercent || 0;
    const costVal = basket.totalCost || (totalVal / (1 + profitPct / 100));

    // Number of steps based on period
    let periodsCount = 6;
    let labels: string[] = [];
    const now = new Date();

    if (period === "1A") {
      periodsCount = 5;
      labels = ["30 Gün Önce", "21 Gün Önce", "14 Gün Önce", "7 Gün Önce", "Bugün"];
    } else if (period === "3A") {
      periodsCount = 6;
      labels = ["90 Gün Önce", "70 Gün", "50 Gün", "30 Gün", "15 Gün", "Bugün"];
    } else if (period === "6A") {
      periodsCount = 6;
      const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
      const currentMonthIdx = now.getMonth();
      labels = Array.from({ length: 6 }).map((_, i) => {
        const mIdx = (currentMonthIdx - 5 + i + 12) % 12;
        return i === 5 ? `${months[mIdx]} (Son)` : months[mIdx];
      });
    } else {
      periodsCount = 7;
      labels = ["12 Ay Önce", "10 Ay", "8 Ay", "6 Ay", "4 Ay", "2 Ay", "Bugün"];
    }

    // Generate realistic curve from cost basis to current value
    const baseProfitFactor = period === "1A" ? 0.3 : period === "3A" ? 0.6 : period === "6A" ? 1.0 : 1.4;
    const startVal = totalVal - (totalVal - costVal) * baseProfitFactor;

    const values: number[] = [];
    for (let i = 0; i < periodsCount; i++) {
      const progress = i / (periodsCount - 1);
      // Add subtle natural fluctuation
      const wave = Math.sin(progress * Math.PI * 1.5) * 0.08 * (1 - progress);
      const val = startVal + (totalVal - startVal) * (progress + wave);
      values.push(Math.round(val));
    }
    values[values.length - 1] = totalVal;

    const minV = Math.min(...values) * 0.95;
    const maxV = Math.max(...values) * 1.05;
    const range = maxV - minV || 1;

    const svgWidth = 500;
    const svgHeight = 120;

    const coords = values.map((v, idx) => {
      const x = (idx / (periodsCount - 1)) * svgWidth;
      const y = svgHeight - ((v - minV) / range) * (svgHeight - 20) - 10;
      return { x, y, val: v };
    });

    // Build smooth path
    let pathD = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX = (curr.x + next.x) / 2;
      pathD += ` C ${cpX},${curr.y} ${cpX},${next.y} ${next.x},${next.y}`;
    }

    const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

    return { points: coords, pathD, areaD, labels, minVal: minV, maxVal: maxV };
  }, [basket, period]);

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
            href={`/orakul?basketId=${basket.id}`}
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
            {basket.totalValue.toLocaleString("tr-TR")} ₺
          </div>
          <div
            className={`font-mono text-sm font-semibold mt-1 flex items-center md:justify-end gap-1 ${
              isProfitPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
            }`}
          >
            {isProfitPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isProfitPositive ? "+" : ""}
              {basket.totalProfitPercent}% Toplam Kazanç
            </span>
          </div>
        </div>
      </div>

      {/* 3. Performance Chart & Risk Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold">
              Sepet Performans Eğrisi (Dinamik)
            </h3>
            <div className="flex gap-1.5 font-mono text-[11px]">
              {(["1A", "3A", "6A", "1Y"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                    period === p
                      ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                      : "text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic SVG Chart */}
          <div className="h-44 w-full relative flex items-end pt-6 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
              <defs>
                <linearGradient id={basketGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor={isProfitPositive ? "#5B8C7B" : "#A33B3B"}
                    stopOpacity="0.4"
                  />
                  <stop
                    offset="100%"
                    stopColor={isProfitPositive ? "#5B8C7B" : "#A33B3B"}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>
              
              {/* Filled Area */}
              <path d={chartData.areaD} fill={`url(#${basketGradId})`} />

              {/* Stroke Line */}
              <path
                d={chartData.pathD}
                fill="none"
                stroke={isProfitPositive ? "#5B8C7B" : "#A33B3B"}
                strokeWidth="2.5"
              />

              {/* Data Points */}
              {chartData.points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === chartData.points.length - 1 ? 5 : 3.5}
                  fill={idx === chartData.points.length - 1 ? "#C9A24B" : (isProfitPositive ? "#5B8C7B" : "#A33B3B")}
                  className="transition-all"
                />
              ))}
            </svg>
          </div>

          {/* Dynamic X-Axis Date Labels */}
          <div className="flex justify-between font-mono text-[11px] text-[var(--mist)] pt-2 border-t border-dashed border-[var(--line)]">
            {chartData.labels.map((lbl, idx) => (
              <span
                key={idx}
                className={idx === chartData.labels.length - 1 ? "text-[var(--brass)] font-semibold" : ""}
              >
                {lbl}
              </span>
            ))}
          </div>
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
                            style={{ width: `${Math.min(h.weightPercent, 100)}%` }}
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
    </div>
  );
}
