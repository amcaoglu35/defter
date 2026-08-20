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
  Wand2,
  Coins,
  ShieldAlert,
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
              Graham Sayısı, DCF Adil Değeri, Magic Formula, DuPont ROE ve Beneish Makyaj Dedektörü.
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

        {/* DCF (İndirgenmiş Nakit) Adil Değeri */}
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

      {/* 2. JOEL GREENBLATT SIHİRLİ FORMÜLÜ (MAGIC FORMULA) & BENISHE MANİPÜLASYON SKORU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Magic Formula Kartı */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[var(--paper)]">
              <Wand2 className="w-4 h-4 text-[var(--brass)]" />
              <span>Joel Greenblatt Sihirli Formülü (Magic Formula)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[var(--brass-glow)] text-[var(--brass)] font-mono text-xs font-bold">
              {valuation.magicFormulaRank} ({valuation.magicFormulaScore} Puan)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] block">1. Kazanç Verimi (EBIT / EV)</span>
              <span className="font-bold text-emerald-400 text-base">%{valuation.earningsYieldPct}</span>
              <span className="text-[9px] text-[var(--mist)] block">Firma değerine göre kâr</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] block">2. Sermaye Kârlılığı (ROIC)</span>
              <span className="font-bold text-cyan-400 text-base">%{valuation.roicPct}</span>
              <span className="text-[9px] text-[var(--mist)] block">Yatırılan sermayenin verimi</span>
            </div>
          </div>
        </div>

        {/* Beneish M-Score & Muhasebe Hilesi Dedektörü */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[var(--paper)]">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Beneish M-Score (Bilanço Makyaj Dedektörü)</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                valuation.beneishStatus === "Temiz Bilanço"
                  ? "bg-emerald-950/40 text-emerald-300 border border-emerald-600/30"
                  : "bg-rose-950/40 text-rose-300 border border-rose-600/30"
              }`}
            >
              {valuation.beneishStatus}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <span className="text-[var(--mist)]">Hesaplanan M-Skoru:</span>
            <span className="font-bold text-[var(--paper)]">{valuation.beneishMScore}</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--mist)] leading-relaxed">
            -1.78 eşiğinin altındaki skorlar bilançonun hilesiz ve organik faaliyetlerle üretildiğini gösterir.
          </p>
        </div>
      </div>

      {/* 3. DUPONT 3 KADEMELİ ROE AYRIŞTIRMASI */}
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
            <span className="text-[11px] font-mono text-[var(--mist)] block">1. Net Kâr Marjı (Fiyatlama Gücü)</span>
            <p className="font-mono text-lg font-bold text-emerald-400">
              %{valuation.dupontNetMarginPct}
            </p>
            <span className="text-[10px] font-mono text-[var(--mist)]">Her 100 ₺ cironun net kârı</span>
          </div>

          <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg text-center space-y-1">
            <span className="text-[11px] font-mono text-[var(--mist)] block">2. Varlık Devir Hızı (Operasyonel Hız)</span>
            <p className="font-mono text-lg font-bold text-cyan-400">
              {valuation.dupontAssetTurnover}x
            </p>
            <span className="text-[10px] font-mono text-[var(--mist)]">Varlıkların ciroya dönüşüm hızı</span>
          </div>

          <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg text-center space-y-1">
            <span className="text-[11px] font-mono text-[var(--mist)] block">3. Finansal Kaldıraç (Borç Çarpanı)</span>
            <p className="font-mono text-lg font-bold text-amber-400">
              {valuation.dupontLeverageMultiplier}x
            </p>
            <span className="text-[10px] font-mono text-[var(--mist)]">Toplam Varlıklar / Özkaynak</span>
          </div>
        </div>
      </div>

      {/* 4. ALTMAN Z-SCORE, EVA & KELLY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Altman Z-Score */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1.5">
          <span className="text-xs font-mono text-[var(--mist)]">Altman Z-Score (İflas Eşiği)</span>
          <p className="font-mono text-xl font-bold text-[var(--paper)]">
            {valuation.altmanZScore || "—"}
          </p>
          <span
            className={`text-xs font-mono font-bold block ${
              valuation.altmanZone === "Güvenli Bölge"
                ? "text-emerald-400"
                : valuation.altmanZone === "Gri / İzleme Bölgesi"
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {valuation.altmanZone}
          </span>
        </div>

        {/* FCF Yield */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1.5">
          <span className="text-xs font-mono text-[var(--mist)]">Serbest Nakit Akımı (FCF) Verimi</span>
          <p className="font-mono text-xl font-bold text-emerald-400">
            %{valuation.fcfYieldPct || "—"}
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Piyasa değerine oranla kasada kalan saf nakit
          </span>
        </div>

        {/* Kelly Kriteri */}
        <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-1.5">
          <span className="text-xs font-mono text-[var(--mist)]">Kelly Kriteri Optimal Portföy Payı</span>
          <p className="font-mono text-xl font-bold text-[var(--brass)]">
            %{valuation.kellySuggestedPct} Tavan
          </p>
          <span className="text-[10px] font-mono text-emerald-400 block font-bold">
            ✅ Güvenli risk-getiri bütçe sınırı
          </span>
        </div>
      </div>
    </div>
  );
}
