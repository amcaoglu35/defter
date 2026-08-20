"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Search,
  Scale,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Wand2,
  Coins,
  ShieldAlert,
  Activity,
  HeartPulse,
} from "lucide-react";
import { Company } from "@/lib/mockData";
import { calculateValuationFormulas, ValuationMetrics } from "@/lib/quantEngine";

interface CompanyValuationLabProps {
  companies: Company[];
}

export default function CompanyValuationLab({
  companies,
}: CompanyValuationLabProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    companies[0]?.symbol || "THYAO"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCompany = useMemo(() => {
    return (
      companies.find(
        (c) => c.symbol.toUpperCase() === selectedSymbol.toUpperCase()
      ) || companies[0]
    );
  }, [companies, selectedSymbol]);

  const valuation: ValuationMetrics = useMemo(() => {
    if (!selectedCompany) {
      return calculateValuationFormulas({ symbol: "—" });
    }
    return calculateValuationFormulas({
      symbol: selectedCompany.symbol,
      price: selectedCompany.price,
      peRatio: selectedCompany.peRatio,
      pbRatio: selectedCompany.pbRatio,
      dividendYield: selectedCompany.dividendYield,
    });
  }, [selectedCompany]);

  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies.slice(0, 10);
    const q = searchQuery.toLowerCase().trim();
    return companies
      .filter(
        (c) =>
          c.symbol.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [companies, searchQuery]);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-6">
      {/* Başlık & Şirket Seçici */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Şirket Değerleme &amp; Finansal Matematik Laboratuvarı
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Graham, DCF, Piotroski 9/9, Merton İflas Olasılığı, Hurst Trendi ve DuPont ROE.
            </p>
          </div>
        </div>

        {/* Hızlı Şirket Arama & Seçim */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Hisse Değiştir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs font-mono text-[var(--paper)] outline-none focus:border-[var(--brass)] w-36 sm:w-48"
            />
            {searchQuery && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-1.5 shadow-2xl z-50 max-h-48 overflow-y-auto space-y-1">
                {filteredCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedSymbol(c.symbol);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs font-mono hover:bg-[var(--ink-3)] flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-bold text-[var(--paper)]">{c.symbol}</span>
                    <span className="text-[10px] text-[var(--mist)]">{c.price} ₺</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] font-mono text-xs font-bold text-[var(--brass)]">
            {selectedCompany?.symbol || "—"} ({selectedCompany?.price} ₺)
          </div>
        </div>
      </div>

      {/* 1. GRAHAM, DCF & PETER LYNCH DEĞERLEME KARTLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Benjamin Graham Sayısı */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Graham Sayısı</span>
            <span className="text-[10px] text-[var(--brass)]">√(22.5×EPS×BVPS)</span>
          </div>
          <p className="font-mono text-xl font-bold text-[var(--paper)]">
            {valuation.grahamNumber ? `${valuation.grahamNumber} ₺` : "—"}
          </p>
          <div className="text-[11px] font-mono">
            {valuation.grahamDiscountPct !== null && valuation.grahamDiscountPct > 0 ? (
              <span className="text-emerald-400 font-bold">
                🎯 %{valuation.grahamDiscountPct} İskontolu
              </span>
            ) : valuation.grahamDiscountPct !== null ? (
              <span className="text-amber-400 font-bold">
                ⚠️ %{Math.abs(valuation.grahamDiscountPct)} Primli
              </span>
            ) : (
              <span className="text-[var(--mist)]">Hesaplanamadı</span>
            )}
          </div>
        </div>

        {/* DCF Adil Değeri */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">DCF Adil Değeri</span>
            <span className="text-[10px] text-emerald-400">FCF / WACC</span>
          </div>
          <p className="font-mono text-xl font-bold text-emerald-400">
            {valuation.dcfFairValue ? `${valuation.dcfFairValue} ₺` : "—"}
          </p>
          <div className="text-[11px] font-mono">
            {valuation.dcfDiscountPct !== null && valuation.dcfDiscountPct > 0 ? (
              <span className="text-emerald-400 font-bold">
                💎 %{valuation.dcfDiscountPct} İskonto Potansiyeli
              </span>
            ) : valuation.dcfDiscountPct !== null ? (
              <span className="text-amber-400 font-bold">
                ⚖️ Fiyata Yakın (%{Math.abs(valuation.dcfDiscountPct)})
              </span>
            ) : (
              <span className="text-[var(--mist)]">Adil Aralıkta</span>
            )}
          </div>
        </div>

        {/* Peter Lynch PEG */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Peter Lynch PEG</span>
            <span className="text-[10px] text-cyan-400">F/K ÷ Büyüme</span>
          </div>
          <p className="font-mono text-xl font-bold text-[var(--paper)]">
            {valuation.pegRatio !== null ? valuation.pegRatio.toFixed(2) : "—"}
          </p>
          <div className="text-[11px] font-mono">
            {valuation.pegStatus === "Çok Ucuz" ? (
              <span className="text-emerald-400 font-bold">
                💎 PEG &lt; 1.0 (Çok Ucuz)
              </span>
            ) : valuation.pegStatus === "Dengeli" ? (
              <span className="text-amber-400 font-bold">
                ⚖️ 1.0 - 1.8 (Makul)
              </span>
            ) : (
              <span className="text-rose-400 font-bold">
                ⚠️ PEG &gt; 1.8 (Pahalı)
              </span>
            )}
          </div>
        </div>

        {/* Gordon Temettü Büyüme Modeli (DDM) */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Gordon DDM Değeri</span>
            <span className="text-[10px] text-amber-400">D1 / (r - g)</span>
          </div>
          <p className="font-mono text-xl font-bold text-[var(--paper)]">
            {valuation.gordanDdmValue ? `${valuation.gordanDdmValue} ₺` : "—"}
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            {valuation.gordanDdmValue ? "Temettü akışı temelli içsel değer" : "Düzenli temettü akışı yok"}
          </span>
        </div>
      </div>

      {/* 2. PIOTROSKI F-SCORE 9 KRİTERLİ BİLANÇO MATRİSİ */}
      <div className="p-5 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--brass)]" />
            <h4 className="font-serif font-bold text-sm text-[var(--paper)]">
              Piotroski F-Score (Stanford 9 Kriterli Bilanço Matrisi)
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--mist)]">Toplam Skor:</span>
            <span
              className={`px-3 py-1 rounded-lg font-mono text-sm font-bold ${
                valuation.piotroskiFScore >= 8
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : valuation.piotroskiFScore >= 5
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              }`}
            >
              {valuation.piotroskiFScore} / 9 ({valuation.piotroskiRank})
            </span>
          </div>
        </div>

        {/* 9 Kriter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
          {valuation.piotroskiDetails.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] flex items-center justify-between"
            >
              <span className="text-[var(--paper-dim)] text-[11px]">{item.criterion}</span>
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. MERTON İFLAS OLASILIĞI, HURST EXPONENT & MAGIC FORMULA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Merton İflas Modeli */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Merton İflas Olasılığı</span>
            <span className="text-[10px] text-rose-400">1 Yıllık Risk</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[var(--paper)]">
            %{valuation.mertonDefaultProbabilityPct}
          </p>
          <span className="text-[10px] font-mono text-emerald-400 block font-bold">
            {valuation.mertonDefaultProbabilityPct < 5
              ? "✅ Güvenli Bilanço (Temerrüt Riski Çok Düşük)"
              : "⚠️ İzlenmeli (Borç Riski Mevcut)"}
          </span>
        </div>

        {/* Hurst Exponent Trend */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Hurst Üssü (Fraktal Trend)</span>
            <span className="text-[10px] text-cyan-400">H: {valuation.hurstExponent}</span>
          </div>
          <p className="font-mono text-lg font-bold text-cyan-400">
            {valuation.hurstTrendType}
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Fiyat hareketlerinin kalıcı momentum gücü
          </span>
        </div>

        {/* Magic Formula */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--mist)]">Magic Formula Skoru</span>
            <span className="text-[10px] text-[var(--brass)]">{valuation.magicFormulaRank}</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[var(--brass)]">
            {valuation.magicFormulaScore} Puan
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Kazanç Verimi: %{valuation.earningsYieldPct} | ROIC: %{valuation.roicPct}
          </span>
        </div>
      </div>

      {/* 4. DUPONT 3 KADEMELİ ROE AYRIŞTIRMASI */}
      <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-2">
          <h4 className="font-serif font-bold text-sm text-[var(--paper)] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[var(--brass)]" />
            <span>DuPont 3 Kademeli Özkaynak Kârlılığı (ROE) Ayrıştırma Ağacı</span>
          </h4>
          <span className="font-mono text-xs font-bold text-[var(--brass)]">
            Toplam ROE: %{valuation.dupontRoePct}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg text-center space-y-1">
            <span className="text-[11px] font-mono text-[var(--mist)] block">1. Net Kâr Marjı</span>
            <p className="font-mono text-lg font-bold text-emerald-400">
              %{valuation.dupontNetMarginPct}
            </p>
          </div>

          <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg text-center space-y-1">
            <span className="text-[11px] font-mono text-[var(--mist)] block">2. Varlık Devir Hızı</span>
            <p className="font-mono text-lg font-bold text-cyan-400">
              {valuation.dupontAssetTurnover}x
            </p>
          </div>

          <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg text-center space-y-1">
            <span className="text-[11px] font-mono text-[var(--mist)] block">3. Finansal Kaldıraç</span>
            <p className="font-mono text-lg font-bold text-amber-400">
              {valuation.dupontLeverageMultiplier}x
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
