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
  Calculator,
  Target,
  Award,
  FileText,
  Briefcase,
  Compass,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { calculateConsolidatedPortfolio } from "@/lib/portfolioIntelligence";
import PortfolioTreemap from "@/components/PortfolioTreemap";
import PortfolioBenchmarkHub from "@/components/PortfolioBenchmarkHub";
import PortfolioXRayView from "@/components/PortfolioXRayView";
import DividendFireHub from "@/components/DividendFireHub";
import PortfolioRebalanceHub from "@/components/PortfolioRebalanceHub";
import PortfolioStressTestHub from "@/components/PortfolioStressTestHub";
import PortfolioQuantLab from "@/components/PortfolioQuantLab";
import PortfolioModelTargetHub from "@/components/PortfolioModelTargetHub";
import PortfolioMacroStressRadar from "@/components/PortfolioMacroStressRadar";
import CompanyValuationLab from "@/components/CompanyValuationLab";
import PortfolioAiCheckupModal from "@/components/PortfolioAiCheckupModal";
import PortfolioExecutivePdfExport from "@/components/PortfolioExecutivePdfExport";
import CsvImportExportModal from "@/components/CsvImportExportModal";

type MainHub = "portfolio" | "quant" | "strategy" | "valuation";

export default function AnalizPage() {
  const { baskets, companies } = useDefterStore();
  const [activeHub, setActiveHub] = useState<MainHub>("portfolio");
  const [portfolioSubTab, setPortfolioSubTab] = useState<"benchmark" | "treemap" | "xray">("benchmark");
  const [strategySubTab, setStrategySubTab] = useState<"rebalance" | "macro" | "model" | "stress">("rebalance");
  const [valuationSubTab, setValuationSubTab] = useState<"valuation" | "dividends">("valuation");

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isAiCheckupOpen, setIsAiCheckupOpen] = useState(false);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);

  // Konsolide Portföy Hesaplaması
  const xray = useMemo(() => {
    return calculateConsolidatedPortfolio(baskets, companies);
  }, [baskets, companies]);

  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Üst Navigasyon & Başlık */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--mist)] font-mono">
              <Link
                href="/"
                className="hover:text-[var(--paper)] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Ana Sayfa
              </Link>
              <span>/</span>
              <span className="text-[var(--brass)] font-medium">Analiz &amp; Röntgen Merkezi</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--paper)] flex items-center gap-2.5">
              <span>Portföy Zekası &amp; Röntgen</span>
              <span className="text-xs font-mono font-normal uppercase px-2.5 py-0.5 rounded-full bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)]">
                PRO QUANT &amp; ANALİTİK
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--mist)] font-mono">
              Piyasa kıyaslaması, Sharpe/VaR risk laboratuvarı, korelasyon matrisi, Graham/DCF değerleme ve stres testleri.
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Orakul AI Check-Up Butonu */}
            <button
              onClick={() => setIsAiCheckupOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-xs font-mono font-bold text-[var(--brass)] hover:brightness-110 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Orakul AI Check-Up</span>
            </button>

            {/* PDF Bülten İndir Butonu */}
            <button
              onClick={() => setIsPdfExportOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--brass)] text-xs font-mono text-[var(--paper)] transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[var(--brass)]" />
              <span>Bülten (PDF)</span>
            </button>

            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--brass)] text-xs font-mono text-[var(--paper)] transition-all shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[var(--brass)]" />
              <span>CSV</span>
            </button>

            <Link
              href="/sepetlerim"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-bold font-mono transition-all shadow-sm active:scale-95"
            >
              Sepetlerime Git
            </Link>
          </div>
        </div>

        {/* Boş Portföy Kontrolü */}
        {xray.holdings.length === 0 ? (
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-2xl p-8 sm:p-12 text-center space-y-5 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] mx-auto shadow-md">
              <PieChart className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-serif font-bold text-xl text-[var(--paper)]">
                Portföy Zekası İçin Varlık Bulunamadı
              </h3>
              <p className="text-xs sm:text-sm text-[var(--mist)] font-mono leading-relaxed">
                Piyasa kıyaslaması, Sharpe/VaR risk laboratuvarı, korelasyon matrisi ve stres testlerinin çalışabilmesi için en az bir sepet veya pozisyon oluşturmalısınız.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/sepetlerim"
                className="px-5 py-2.5 rounded-xl bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-bold font-mono transition-all shadow-md active:scale-95"
              >
                🧺 Hemen Sepet Oluştur
              </Link>
              <Link
                href="/sirketler"
                className="px-5 py-2.5 rounded-xl bg-[var(--ink-3)] hover:bg-[var(--ink-2)] border border-[var(--line)] text-[var(--paper)] text-xs font-mono transition-all active:scale-95"
              >
                🏢 Şirketler Kütüğünü İncele
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Konsolide Portföy Özet Şeridi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
                <span className="text-xs font-mono text-[var(--mist)]">Toplam Portföy Değeri</span>
                <p className="font-serif font-bold text-xl text-[var(--paper)]">
                  {xray.totalValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                </p>
                <span className="text-[11px] font-mono text-[var(--mist)] block">
                  Maliyet: {xray.totalCost.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                </span>
              </div>

              <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
                <span className="text-xs font-mono text-[var(--mist)]">Net Kâr / Zarar</span>
                <p
                  className={`font-serif font-bold text-xl ${
                    xray.totalProfitLoss >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {xray.totalProfitLoss >= 0 ? "+" : ""}
                  {xray.totalProfitLoss.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                </p>
                <span
                  className={`text-[11px] font-mono font-bold block ${
                    xray.totalProfitLossPct >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  ({xray.totalProfitLossPct >= 0 ? "+" : ""}
                  {xray.totalProfitLossPct.toFixed(2)}%)
                </span>
              </div>

              <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
                <span className="text-xs font-mono text-[var(--mist)]">Çeşitlendirme</span>
                <p className="font-serif font-bold text-xl text-[var(--paper)] flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>{xray.diversificationLevel}</span>
                </p>
                <span className="text-[11px] font-mono text-[var(--mist)] block">
                  HHI: {xray.hhiScore} • {xray.assetCount} Varlık
                </span>
              </div>

              <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
                <span className="text-xs font-mono text-[var(--mist)]">En Büyük Pozisyon</span>
                <p className="font-serif font-bold text-xl text-[var(--paper)]">
                  {xray.holdings[0]?.symbol || "—"}
                </p>
                <span className="text-[11px] font-mono text-[var(--brass)] block font-bold">
                  {xray.holdings[0] ? `Ağırlık: %${xray.holdings[0].weightPct.toFixed(1)}` : "Varlık Yok"}
                </span>
              </div>
            </div>

            {/* 🏛️ 4 ANA MERKEZ SEKMELERİ (SON DERECE BELİRGİN & PREMIUM KUTULAR) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. Portföy & Röntgen */}
              <button
                onClick={() => setActiveHub("portfolio")}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                  activeHub === "portfolio"
                    ? "bg-gradient-to-b from-[var(--ink-3)] to-[var(--ink-2)] border-[var(--brass)] shadow-xl shadow-[var(--brass)]/10 ring-2 ring-[var(--brass)]/20"
                    : "bg-[var(--ink-2)] border-[var(--line)] hover:border-[var(--brass-dim)] hover:bg-[var(--ink-3)] text-[var(--mist)] hover:-translate-y-0.5 shadow-sm"
                }`}
              >
                {activeHub === "portfolio" && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--brass)]/10 rounded-bl-full pointer-events-none" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeHub === "portfolio"
                        ? "bg-[var(--brass)] text-[var(--ink)] shadow-md font-bold"
                        : "bg-[var(--ink-3)] text-[var(--paper-dim)] border border-[var(--line)] group-hover:text-[var(--brass)] group-hover:border-[var(--brass-dim)]"
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>
                  {activeHub === "portfolio" ? (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)] font-mono text-[10px] font-bold tracking-wider">
                      SEÇİLİ
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--mist)] opacity-60">01</span>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <span
                    className={`font-serif font-bold text-base block ${
                      activeHub === "portfolio" ? "text-[var(--brass)]" : "text-[var(--paper)]"
                    }`}
                  >
                    1. Portföy &amp; Röntgen
                  </span>
                  <p className="text-xs font-mono text-[var(--paper-dim)] line-clamp-1">
                    Benchmark, Treemap Isı Haritası &amp; Sektörler
                  </p>
                </div>
              </button>

              {/* 2. Quant & Risk Lab */}
              <button
                onClick={() => setActiveHub("quant")}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                  activeHub === "quant"
                    ? "bg-gradient-to-b from-[var(--ink-3)] to-[var(--ink-2)] border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/20"
                    : "bg-[var(--ink-2)] border-[var(--line)] hover:border-cyan-500/40 hover:bg-[var(--ink-3)] text-[var(--mist)] hover:-translate-y-0.5 shadow-sm"
                }`}
              >
                {activeHub === "quant" && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-bl-full pointer-events-none" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeHub === "quant"
                        ? "bg-cyan-400 text-[var(--ink)] shadow-md font-bold"
                        : "bg-[var(--ink-3)] text-[var(--paper-dim)] border border-[var(--line)] group-hover:text-cyan-400 group-hover:border-cyan-500/40"
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  {activeHub === "quant" ? (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold tracking-wider">
                      SEÇİLİ
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--mist)] opacity-60">02</span>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <span
                    className={`font-serif font-bold text-base block ${
                      activeHub === "quant" ? "text-cyan-300" : "text-[var(--paper)]"
                    }`}
                  >
                    2. Quant &amp; Risk Lab
                  </span>
                  <p className="text-xs font-mono text-[var(--paper-dim)] line-clamp-1">
                    Monte Carlo 1000, Sharpe, VaR &amp; Omega
                  </p>
                </div>
              </button>

              {/* 3. Strateji & Dengeleme */}
              <button
                onClick={() => setActiveHub("strategy")}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                  activeHub === "strategy"
                    ? "bg-gradient-to-b from-[var(--ink-3)] to-[var(--ink-2)] border-emerald-400 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-400/20"
                    : "bg-[var(--ink-2)] border-[var(--line)] hover:border-emerald-500/40 hover:bg-[var(--ink-3)] text-[var(--mist)] hover:-translate-y-0.5 shadow-sm"
                }`}
              >
                {activeHub === "strategy" && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/10 rounded-bl-full pointer-events-none" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeHub === "strategy"
                        ? "bg-emerald-400 text-[var(--ink)] shadow-md font-bold"
                        : "bg-[var(--ink-3)] text-[var(--paper-dim)] border border-[var(--line)] group-hover:text-emerald-400 group-hover:border-emerald-500/40"
                    }`}
                  >
                    <Compass className="w-5 h-5" />
                  </div>
                  {activeHub === "strategy" ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold tracking-wider">
                      SEÇİLİ
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--mist)] opacity-60">03</span>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <span
                    className={`font-serif font-bold text-base block ${
                      activeHub === "strategy" ? "text-emerald-300" : "text-[var(--paper)]"
                    }`}
                  >
                    3. Strateji &amp; Dengeleme
                  </span>
                  <p className="text-xs font-mono text-[var(--paper-dim)] line-clamp-1">
                    Fama-French, Makro Elastikiyet &amp; Rebalance
                  </p>
                </div>
              </button>

              {/* 4. Değerleme & Temettü */}
              <button
                onClick={() => setActiveHub("valuation")}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                  activeHub === "valuation"
                    ? "bg-gradient-to-b from-[var(--ink-3)] to-[var(--ink-2)] border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/20"
                    : "bg-[var(--ink-2)] border-[var(--line)] hover:border-amber-500/40 hover:bg-[var(--ink-3)] text-[var(--mist)] hover:-translate-y-0.5 shadow-sm"
                }`}
              >
                {activeHub === "valuation" && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/10 rounded-bl-full pointer-events-none" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeHub === "valuation"
                        ? "bg-amber-400 text-[var(--ink)] shadow-md font-bold"
                        : "bg-[var(--ink-3)] text-[var(--paper-dim)] border border-[var(--line)] group-hover:text-amber-400 group-hover:border-amber-500/40"
                    }`}
                  >
                    <Calculator className="w-5 h-5" />
                  </div>
                  {activeHub === "valuation" ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold tracking-wider">
                      SEÇİLİ
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--mist)] opacity-60">04</span>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <span
                    className={`font-serif font-bold text-base block ${
                      activeHub === "valuation" ? "text-amber-300" : "text-[var(--paper)]"
                    }`}
                  >
                    4. Değerleme &amp; Temettü
                  </span>
                  <p className="text-xs font-mono text-[var(--paper-dim)] line-clamp-1">
                    Piotroski 9/9, Merton İflas, Graham &amp; DCF
                  </p>
                </div>
              </button>
            </div>

            {/* SEÇİLEN MERKEZİN İÇERİĞİ */}
            <div className="pt-2">
              {/* 1. PORTFÖY & RÖNTGEN MERKEZİ */}
              {activeHub === "portfolio" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto">
                    <button
                      onClick={() => setPortfolioSubTab("benchmark")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        portfolioSubTab === "benchmark"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Piyasa Kıyaslama (Benchmark)
                    </button>
                    <button
                      onClick={() => setPortfolioSubTab("treemap")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        portfolioSubTab === "treemap"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Canlı Isı Haritası (Treemap)
                    </button>
                    <button
                      onClick={() => setPortfolioSubTab("xray")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        portfolioSubTab === "xray"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Sektörel Röntgen (X-Ray)
                    </button>
                  </div>

                  {portfolioSubTab === "benchmark" && (
                    <PortfolioBenchmarkHub
                      holdings={xray.holdings}
                      totalValue={xray.totalValue}
                      totalProfitLossPct={xray.totalProfitLossPct}
                    />
                  )}
                  {portfolioSubTab === "treemap" && (
                    <PortfolioTreemap holdings={xray.holdings} totalValue={xray.totalValue} />
                  )}
                  {portfolioSubTab === "xray" && <PortfolioXRayView xray={xray} />}
                </div>
              )}

              {/* 2. QUANT & RISK LABORATUVARI (Sharpe, VaR, MPT, Korelasyon) */}
              {activeHub === "quant" && (
                <PortfolioQuantLab
                  holdings={xray.holdings}
                  totalValue={xray.totalValue}
                  totalProfitLossPct={xray.totalProfitLossPct}
                />
              )}

              {/* 3. STRATEJİ & DENGELEME MERKEZİ */}
              {activeHub === "strategy" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto">
                    <button
                      onClick={() => setStrategySubTab("rebalance")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        strategySubTab === "rebalance"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Yeniden Dengeleme &amp; DCA
                    </button>
                    <button
                      onClick={() => setStrategySubTab("macro")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        strategySubTab === "macro"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Makro Duyarlılık &amp; Fama-French
                    </button>
                    <button
                      onClick={() => setStrategySubTab("model")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        strategySubTab === "model"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Hedef Model Portföy Radarı
                    </button>
                    <button
                      onClick={() => setStrategySubTab("stress")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        strategySubTab === "stress"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Kriz Stres Testi (What-If)
                    </button>
                  </div>

                  {strategySubTab === "rebalance" && (
                    <PortfolioRebalanceHub
                      holdings={xray.holdings}
                      totalValue={xray.totalValue}
                    />
                  )}
                  {strategySubTab === "macro" && (
                    <PortfolioMacroStressRadar
                      holdings={xray.holdings}
                      portfolioBeta={1.05}
                    />
                  )}
                  {strategySubTab === "model" && (
                    <PortfolioModelTargetHub holdings={xray.holdings} />
                  )}
                  {strategySubTab === "stress" && (
                    <PortfolioStressTestHub
                      holdings={xray.holdings}
                      totalValue={xray.totalValue}
                    />
                  )}
                </div>
              )}

              {/* 4. DEĞERLEME & TEMETTÜ MERKEZİ */}
              {activeHub === "valuation" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto">
                    <button
                      onClick={() => setValuationSubTab("valuation")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        valuationSubTab === "valuation"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Değerleme &amp; Finans Laboratuvarı (Graham, DCF, Magic Formula)
                    </button>
                    <button
                      onClick={() => setValuationSubTab("dividends")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        valuationSubTab === "dividends"
                          ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-sm"
                          : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                      }`}
                    >
                      Temettü Projeksiyonu &amp; FIRE Simülatörü
                    </button>
                  </div>

                  {valuationSubTab === "valuation" && (
                    <CompanyValuationLab companies={companies} />
                  )}
                  {valuationSubTab === "dividends" && (
                    <DividendFireHub
                      holdings={xray.holdings}
                      totalValue={xray.totalValue}
                    />
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Orakul AI Check-Up Modalı */}
      <PortfolioAiCheckupModal
        isOpen={isAiCheckupOpen}
        onClose={() => setIsAiCheckupOpen(false)}
        xray={xray}
      />

      {/* PDF / Bülten Dışa Aktarma Modalı */}
      <PortfolioExecutivePdfExport
        isOpen={isPdfExportOpen}
        onClose={() => setIsPdfExportOpen(false)}
        xray={xray}
      />

      {/* CSV Import/Export Modal */}
      <CsvImportExportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />
    </div>
  );
}
