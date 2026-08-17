"use client";

import React from "react";
import { TrendingUp, TrendingDown, Scale, Sparkles, Swords } from "lucide-react";
import { CompanyDiagnosisReport } from "@/lib/aiService";

interface AiBullBearDebateCardProps {
  report?: CompanyDiagnosisReport | null;
  companySymbol?: string;
}

export function AiBullBearDebateCard({ report, companySymbol = "BIST" }: AiBullBearDebateCardProps) {
  const bullCase = report?.bullCase || {
    catalyst: "İhracat gelirlerinde %25 büyüme & güçlü kâr marjları",
    targetUpside: "+35% Yükseliş Potansiyeli",
    coreThesis:
      "Şirket güçlü pazar payı, yüksek özkaynak kârlılığı (ROE) ve ucuz F/K çarpanlarıyla orta vadeli boğa rallisi adayları arasındadır.",
  };

  const bearCase = report?.bearCase || {
    keyRisk: "Girdi maliyetlerindeki enflasyonist baskı & döviz riski",
    downsideRisk: "-15% Düzeltme Riski",
    coreThesis:
      "Kısa vadeli işletme sermayesi ihtiyacı ve yüksek borçluluk çarpanları, olası piyasa türbülansında marj baskısı oluşturabilir.",
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🤼 FinGPT Boğa vs Ayı Yapay Zeka Münazara Kartı
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              {companySymbol} İçin Karşıt Görüşlü Çift AI Ajanı Tez Analizi
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[var(--brass)] bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-0.5 rounded font-bold">
          Dual-Agent Debate Engine
        </span>
      </div>

      {/* 2-Column Debate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bull Case (Green) */}
        <div className="p-4 bg-[var(--ink-3)] rounded-xl border border-[rgba(91,140,123,0.4)] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[rgba(91,140,123,0.2)] pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--verdigris)]" />
              <span className="font-serif text-sm font-bold text-[var(--verdigris)]">
                🟢 İyimser Boğa Ajanı (Bull Thesis)
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)]">
              {bullCase.targetUpside}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--mist)] uppercase font-semibold block">Ana Katalizör:</span>
            <span className="text-[var(--paper)] font-bold text-[11px] block mt-0.5">{bullCase.catalyst}</span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--mist)] uppercase font-semibold block">Boğa Yatırım Tezi:</span>
            <p className="text-[var(--paper-dim)] font-sans text-xs mt-1 leading-relaxed">{bullCase.coreThesis}</p>
          </div>
        </div>

        {/* Bear Case (Red) */}
        <div className="p-4 bg-[var(--ink-3)] rounded-xl border border-[rgba(201,124,124,0.4)] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[rgba(201,124,124,0.2)] pb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[var(--loss)]" />
              <span className="font-serif text-sm font-bold text-[var(--loss)]">
                🔴 Kötümser Ayı Ajanı (Bear Thesis)
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(201,124,124,0.15)] text-[var(--loss)] border border-[var(--loss)]">
              {bearCase.downsideRisk}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--mist)] uppercase font-semibold block">Kritik Risk Faktörü:</span>
            <span className="text-[var(--paper)] font-bold text-[11px] block mt-0.5">{bearCase.keyRisk}</span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--mist)] uppercase font-semibold block">Ayı Yatırım Tezi:</span>
            <p className="text-[var(--paper-dim)] font-sans text-xs mt-1 leading-relaxed">{bearCase.coreThesis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
