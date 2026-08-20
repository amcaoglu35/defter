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

            {/* 🏛️ 4 ANA MERKEZ SEKMELERİ (KUSURSUZ SADELEŞME) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Portföy & Röntgen */}
              <button
                onClick={() => setActiveHub("portfolio")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  activeHub === "portfolio"
                    ? "bg-[var(--ink-2)] border-[var(--brass)] shadow-md ring-1 ring-[var(--brass)]"
                    : "bg-[var(--ink-2)]/60 border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--mist)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase
                    className={`w-4 h-4 ${
                      activeHub === "portfolio" ? "text-[var(--brass)]" : "text-[var(--mist)]"
                    }`}
                  />
                  <span className="font-serif font-bold text-sm text-[var(--paper)]">
                    1. Portföy &amp; Röntgen
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[var(--mist)] line-clamp-1">
                  Piyasa Kıyaslama, Isı Haritası &amp; Sektörler
                </p>
              </button>

              {/* 2. Quant & Risk Lab */}
              <button
                onClick={() => setActiveHub("quant")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  activeHub === "quant"
                    ? "bg-[var(--ink-2)] border-[var(--brass)] shadow-md ring-1 ring-[var(--brass)]"
                    : "bg-[var(--ink-2)]/60 border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--mist)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award
                    className={`w-4 h-4 ${
                      activeHub === "quant" ? "text-[var(--brass)]" : "text-[var(--mist)]"
                    }`}
                  />
                  <span className="font-serif font-bold text-sm text-[var(--paper)]">
                    2. Quant &amp; Risk Lab
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[var(--mist)] line-clamp-1">
                  Sharpe, VaR, Markowitz MPT &amp; Korelasyon
                </p>
              </button>

              {/* 3. Strateji & Dengeleme */}
              <button
                onClick={() => setActiveHub("strategy")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  activeHub === "strategy"
                    ? "bg-[var(--ink-2)] border-[var(--brass)] shadow-md ring-1 ring-[var(--brass)]"
                    : "bg-[var(--ink-2)]/60 border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--mist)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass
                    className={`w-4 h-4 ${
                      activeHub === "strategy" ? "text-[var(--brass)]" : "text-[var(--mist)]"
                    }`}
                  />
                  <span className="font-serif font-bold text-sm text-[var(--paper)]">
                    3. Strateji &amp; Dengeleme
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[var(--mist)] line-clamp-1">
                  Rebalance DCA, Model Radar &amp; Stres Testi
                </p>
              </button>

              {/* 4. Değerleme & Temettü */}
              <button
                onClick={() => setActiveHub("valuation")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  activeHub === "valuation"
                    ? "bg-[var(--ink-2)] border-[var(--brass)] shadow-md ring-1 ring-[var(--brass)]"
                    : "bg-[var(--ink-2)]/60 border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--mist)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calculator
                    className={`w-4 h-4 ${
                      activeHub === "valuation" ? "text-[var(--brass)]" : "text-[var(--mist)]"
                    }`}
                  />
                  <span className="font-serif font-bold text-sm text-[var(--paper)]">
                    4. Değerleme &amp; Temettü
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[var(--mist)] line-clamp-1">
                  Graham, DCF, Magic Formula &amp; FIRE Simülatörü
                </p>
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
