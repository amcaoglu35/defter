"use client";

import React, { useState } from "react";
import {
  Zap,
  TrendingUp,
  Shield,
  Activity,
  Compass,
  Award,
  BarChart3,
  Waves,
  PieChart,
  Target,
  HelpCircle,
} from "lucide-react";
import { RiskMetrics } from "@/lib/quantEngine";
import FormulaInfoModal from "@/components/FormulaInfoModal";

interface PortfolioAdvancedQuantHubProps {
  metrics?: RiskMetrics;
}

export default function PortfolioAdvancedQuantHub({
  metrics,
}: PortfolioAdvancedQuantHubProps) {
  const [activeFormulaKey, setActiveFormulaKey] = useState<string | null>(null);

  const safeMetrics = {
    omegaRatio: Number(metrics?.omegaRatio ?? 1.0),
    treynorRatio: Number(metrics?.treynorRatio ?? 0),
    informationRatio: Number(metrics?.informationRatio ?? 0),
    gainToPainRatio: Number(metrics?.gainToPainRatio ?? 1.0),
    mSquaredPct: Number(metrics?.mSquaredPct ?? 0),
    upMarketCapturePct: Number(metrics?.upMarketCapturePct ?? 100),
    downMarketCapturePct: Number(metrics?.downMarketCapturePct ?? 100),
    shannonEntropyPct: Number(metrics?.shannonEntropyPct ?? 0),
    maxDrawdownPct: Number(metrics?.maxDrawdownPct ?? 0),
    recoveryDays: Number(metrics?.recoveryDays ?? 0),
    kRatio: Number(metrics?.kRatio ?? 1.0),
    skewness: Number(metrics?.skewness ?? 0),
    kurtosis: Number(metrics?.kurtosis ?? 3.0),
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-6">
      {/* Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)] flex items-center gap-2">
              <span>Hedge Fon &amp; İleri Quant Metrikleri</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)]">
                WALL STREET MODELLERİ
              </span>
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Omega, Treynor, Modigliani M², Up/Down Capture ve Shannon Entropi katsayıları.
            </p>
          </div>
        </div>
      </div>

      {/* 1. ÜST GRİD: OMEGA, TREYNOR, INFORMATION RATIO, GAIN-TO-PAIN */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Omega Rasyosu */}
        <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1 relative">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--mist)]">
            <span>Omega Rasyosu (Ω)</span>
            <button
              onClick={() => setActiveFormulaKey("omega")}
              className="text-[var(--mist)] hover:text-cyan-400 cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p
            className={`font-serif font-bold text-xl ${
              safeMetrics.omegaRatio >= 1.5
                ? "text-emerald-400"
                : safeMetrics.omegaRatio >= 1.0
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {safeMetrics.omegaRatio.toFixed(2)}
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            {safeMetrics.omegaRatio >= 1.5 ? "💎 Asimetrik Kazanç Üstünlüğü" : "⚖️ Normal Kazanç Dağılımı"}
          </span>
        </div>

        {/* Treynor Oranı */}
        <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1 relative">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--mist)]">
            <span>Treynor Oranı</span>
            <button
              onClick={() => setActiveFormulaKey("treynor")}
              className="text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-serif font-bold text-xl text-[var(--paper)]">
            {safeMetrics.treynorRatio.toFixed(2)}
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Sistematik Piyasa Riski Başına Alfa
          </span>
        </div>

        {/* Information Ratio (IR) */}
        <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1 relative">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--mist)]">
            <span>Bilgi Oranı (IR)</span>
            <button
              onClick={() => setActiveFormulaKey("treynor")}
              className="text-[var(--mist)] hover:text-emerald-400 cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p
            className={`font-serif font-bold text-xl ${
              safeMetrics.informationRatio > 0.5 ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {safeMetrics.informationRatio.toFixed(2)}
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            {safeMetrics.informationRatio > 0.75 ? "🏆 Üstün Fon Yöneticisi Kalitesi" : "⚖️ Piyasa Ortalaması Takibi"}
          </span>
        </div>

        {/* Gain-to-Pain Ratio */}
        <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1 relative">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--mist)]">
            <span>Gain-to-Pain Oranı</span>
            <button
              onClick={() => setActiveFormulaKey("omega")}
              className="text-[var(--mist)] hover:text-amber-400 cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-serif font-bold text-xl text-emerald-400">
            {safeMetrics.gainToPainRatio.toFixed(2)}
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Her 1 ₺ Acıya Karşı Net Kâr
          </span>
        </div>
      </div>

      {/* 2. ORTA GRİD: MODIGLIANI M², K-RATIO, UP/DOWN CAPTURE, SHANNON ENTROPİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Modigliani-Modigliani (M²) */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Modigliani M² Getirisi</span>
            <button
              onClick={() => setActiveFormulaKey("mSquared")}
              className="text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="font-mono text-2xl font-bold text-emerald-400">
            %{safeMetrics.mSquaredPct.toFixed(2)}
          </p>
          <p className="text-[11px] font-mono text-[var(--mist)] leading-relaxed">
            Portföyünüz BIST 100 ile aynı riskte olsaydı üreteceği saf kümülatif getiri.
          </p>
        </div>

        {/* Up / Down Market Capture Oranları */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Boğa &amp; Ayı Yakalama</span>
            <button
              onClick={() => setActiveFormulaKey("upDownCapture")}
              className="text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-400 block">Up-Capture (Boğa)</span>
              <span className="text-lg font-bold text-emerald-400">%{safeMetrics.upMarketCapturePct.toFixed(0)}</span>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-[10px] text-rose-400 block">Down-Capture (Ayı)</span>
              <span className="text-lg font-bold text-rose-400">%{safeMetrics.downMarketCapturePct.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Shannon Entropisi Çeşitlendirme */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Shannon Entropisi</span>
            <button
              onClick={() => setActiveFormulaKey("shannon")}
              className="text-[var(--mist)] hover:text-cyan-400 cursor-pointer"
              title="Formül Açıklaması & Rehber"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="font-mono text-2xl font-bold text-cyan-400">
            %{safeMetrics.shannonEntropyPct.toFixed(1)}
          </p>
          <p className="text-[11px] font-mono text-[var(--mist)] leading-relaxed">
            Claude Shannon bilgi teorisine göre portföyün homojen dağılım mükemmelliği.
          </p>
        </div>
      </div>

      {/* 3. ALT GRİD: SUALTI (UNDERWATER DRAWDOWN), TOPARLANMA & KUYRUK RİSKİ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between">
          <div>
            <span className="text-[var(--mist)] block text-[10px]">Tarihsel Max Çöküş (MDD)</span>
            <span className="text-rose-400 font-bold text-base">-%{safeMetrics.maxDrawdownPct.toFixed(1)}</span>
          </div>
          <div className="text-right">
            <span className="text-[var(--mist)] block text-[10px]">Tahmini Toparlanma</span>
            <span className="text-[var(--paper)] font-bold text-base">{safeMetrics.recoveryDays} Gün</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between">
          <div>
            <span className="text-[var(--mist)] block text-[10px]">K-Ratio (Büyüme Pürüzsüzlüğü)</span>
            <span className="text-emerald-400 font-bold text-base">{safeMetrics.kRatio.toFixed(2)}</span>
          </div>
          <div className="text-right text-[10px] text-[var(--mist)]">
            Merdiven Gibi Düzenli Artış
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between">
          <div>
            <span className="text-[var(--mist)] block text-[10px]">Çarpıklık &amp; Basıklık (Tail Risk)</span>
            <span className="text-[var(--brass)] font-bold text-sm">
              S: {safeMetrics.skewness.toFixed(2)} | K: {safeMetrics.kurtosis.toFixed(2)}
            </span>
          </div>
          <div className="text-right text-[10px] text-[var(--mist)]">
            Kara Kuğu Riski: Düşük
          </div>
        </div>
      </div>

      {/* FORMÜL BİLGİ MODALI */}
      <FormulaInfoModal
        formulaKey={activeFormulaKey}
        onClose={() => setActiveFormulaKey(null)}
      />
    </div>
  );
}
