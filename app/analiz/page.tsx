"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  LayoutGrid,
  PieChart,
  Flame,
  Scale,
  AlertOctagon,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Coins,
  Layers,
  ArrowRightLeft,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { calculateConsolidatedPortfolio } from "@/lib/portfolioIntelligence";
import PortfolioTreemap from "@/components/PortfolioTreemap";
import PortfolioBenchmarkHub from "@/components/PortfolioBenchmarkHub";
import PortfolioXRayView from "@/components/PortfolioXRayView";
import DividendFireHub from "@/components/DividendFireHub";
import PortfolioRebalanceHub from "@/components/PortfolioRebalanceHub";
import PortfolioStressTestHub from "@/components/PortfolioStressTestHub";
import CsvImportExportModal from "@/components/CsvImportExportModal";

type ActiveTab = "benchmark" | "treemap" | "xray" | "dividends" | "rebalance" | "stress";

export default function AnalizPage() {
  const { baskets, companies } = useDefterStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("benchmark");
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Konsolide Portföy Hesaplaması
  const xray = useMemo(() => {
    return calculateConsolidatedPortfolio(baskets, companies);
  }, [baskets, companies]);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Üst Navigasyon & Başlık */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <Link
                href="/"
                className="hover:text-[var(--paper)] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Ana Sayfa
              </Link>
              <span>/</span>
              <span className="text-[var(--brass)] font-medium">Analiz & Röntgen Merkezi</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--paper)] flex items-center gap-2.5">
              <span>Portföy Zekası & Röntgen</span>
              <span className="text-xs font-mono font-normal uppercase px-2 py-0.5 rounded-full bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)]">
                PRO ANALİTİK
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              Piyasa kıyaslaması, canlı ısı haritası, sektörel röntgen, temettü projeksiyonu ve stres testleri.
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card)] border border-[var(--line)] hover:border-[var(--brass)] text-xs font-medium text-[var(--paper)] transition-all shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[var(--brass)]" />
              CSV İçe / Dışa Aktar
            </button>
            <Link
              href="/sepetlerim"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--brass)] text-[var(--ink)] text-xs font-bold hover:brightness-110 transition-all shadow-xs"
            >
              Sepetlerime Git
            </Link>
          </div>
        </div>

        {/* Konsolide Portföy Özet Şeridi */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-[var(--card)] border border-[var(--line)] rounded-xl space-y-1">
            <span className="text-xs text-[var(--muted)]">Toplam Portföy Değeri</span>
            <p className="font-serif font-bold text-xl text-[var(--paper)]">
              {xray.totalValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
            </p>
            <span className="text-[10px] text-[var(--muted)]">
              Toplam Maliyet: {xray.totalCost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
            </span>
          </div>

          <div className="p-4 bg-[var(--card)] border border-[var(--line)] rounded-xl space-y-1">
            <span className="text-xs text-[var(--muted)]">Kümülatif Net Kâr / Zarar</span>
            <p
              className={`font-serif font-bold text-xl ${
                xray.totalProfitLoss >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {xray.totalProfitLoss >= 0 ? "+" : ""}
              {xray.totalProfitLoss.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
            </p>
            <span
              className={`text-[10px] font-mono font-bold ${
                xray.totalProfitLossPct >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              ({xray.totalProfitLossPct >= 0 ? "+" : ""}
              {xray.totalProfitLossPct.toFixed(2)}%)
            </span>
          </div>

          <div className="p-4 bg-[var(--card)] border border-[var(--line)] rounded-xl space-y-1">
            <span className="text-xs text-[var(--muted)]">Çeşitlendirme Düzeyi</span>
            <p className="font-serif font-bold text-xl text-[var(--paper)] flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {xray.diversificationLevel}
            </p>
            <span className="text-[10px] text-[var(--muted)]">
              HHI: {xray.hhiScore} | {xray.assetCount} Farklı Varlık
            </span>
          </div>

          <div className="p-4 bg-[var(--card)] border border-[var(--line)] rounded-xl space-y-1">
            <span className="text-xs text-[var(--muted)]">En Büyük Pozisyon</span>
            <p className="font-serif font-bold text-xl text-[var(--paper)]">
              {xray.holdings[0]?.symbol || "—"}
            </p>
            <span className="text-[10px] text-[var(--brass)] font-mono">
              {xray.holdings[0] ? `Ağırlık: %${xray.holdings[0].weightPct.toFixed(1)}` : "Varlık Yok"}
            </span>
          </div>
        </div>

        {/* Ana Sekme Butonları */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--line)]">
          <button
            onClick={() => setActiveTab("benchmark")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "benchmark"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Piyasa Kıyaslama (Benchmark)
          </button>

          <button
            onClick={() => setActiveTab("treemap")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "treemap"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Isı Haritası (Treemap)
          </button>

          <button
            onClick={() => setActiveTab("xray")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "xray"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40"
            }`}
          >
            <PieChart className="w-4 h-4" />
            Sektörel Röntgen (X-Ray)
          </button>

          <button
            onClick={() => setActiveTab("dividends")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "dividends"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40"
            }`}
          >
            <Flame className="w-4 h-4" />
            Temettü, DRIP & FIRE
          </button>

          <button
            onClick={() => setActiveTab("rebalance")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "rebalance"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40"
            }`}
          >
            <Scale className="w-4 h-4" />
            Yeniden Dengeleme (Rebalance)
          </button>

          <button
            onClick={() => setActiveTab("stress")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "stress"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40"
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            Stres Testi (What-If)
          </button>
        </div>

        {/* Sekme İçerikleri */}
        <div className="pt-2">
          {activeTab === "benchmark" && (
            <PortfolioBenchmarkHub
              holdings={xray.holdings}
              totalValue={xray.totalValue}
              totalProfitLossPct={xray.totalProfitLossPct}
            />
          )}

          {activeTab === "treemap" && (
            <PortfolioTreemap
              holdings={xray.holdings}
              totalValue={xray.totalValue}
            />
          )}

          {activeTab === "xray" && (
            <PortfolioXRayView xray={xray} />
          )}

          {activeTab === "dividends" && (
            <DividendFireHub
              holdings={xray.holdings}
              totalValue={xray.totalValue}
            />
          )}

          {activeTab === "rebalance" && (
            <PortfolioRebalanceHub
              holdings={xray.holdings}
              totalValue={xray.totalValue}
            />
          )}

          {activeTab === "stress" && (
            <PortfolioStressTestHub
              holdings={xray.holdings}
              totalValue={xray.totalValue}
            />
          )}
        </div>
      </div>

      {/* CSV Import/Export Modal */}
      <CsvImportExportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />
    </div>
  );
}
