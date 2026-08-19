"use client";

import React, { useMemo } from "react";
import { FileText, TrendingUp, TrendingDown, Sparkles, Scale, AlertTriangle } from "lucide-react";
import {
  analyzeKapDisclosure,
  KapDisclosureInput,
  KapAnalysisResult,
} from "@/lib/kapSentimentEngine";

interface KapImpactScoreCardProps {
  disclosure: KapDisclosureInput;
}

export function KapImpactScoreCard({ disclosure }: KapImpactScoreCardProps) {
  const analysis: KapAnalysisResult = useMemo(() => {
    return analyzeKapDisclosure(disclosure);
  }, [disclosure]);

  const {
    symbol,
    categoryLabel,
    sentimentScore,
    expectedPriceImpactPct,
    relativeMaterialityPct,
    confidenceLevel,
    signal,
    impactSummary,
    keyDrivers,
  } = analysis;

  const isBullish = signal === "BULLISH";
  const isBearish = signal === "BEARISH";

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 font-mono text-xs shadow-lg hover:border-[var(--brass-dim)] transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-center text-[var(--brass)] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--paper)]">{symbol}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--ink-3)] text-[var(--mist)] border border-[var(--line)]">
                {categoryLabel}
              </span>
            </div>
            <span className="text-[10px] text-[var(--mist)]">{disclosure.publishDate}</span>
          </div>
        </div>

        {/* Signal Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span
            className={`px-3 py-1 rounded text-xs font-bold border flex items-center gap-1.5 ${
              isBullish
                ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                : isBearish
                ? "bg-[rgba(201,124,124,0.15)] text-[var(--loss)] border-[var(--loss)]"
                : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
            }`}
          >
            {isBullish ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : isBearish ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Scale className="w-3.5 h-3.5" />
            )}
            <span>
              {isBullish
                ? `YÜKSELİŞ SİNYALİ (+%${expectedPriceImpactPct})`
                : isBearish
                ? `DÜŞÜŞ RİSKİ (%${expectedPriceImpactPct})`
                : "NÖTR BİLDİRİM"}
            </span>
          </span>
        </div>
      </div>

      {/* Main Title & Summary */}
      <div className="space-y-1.5">
        <h4 className="font-serif text-sm font-bold text-[var(--paper)] leading-tight">
          {disclosure.title}
        </h4>
        <p className="text-[11px] text-[var(--mist)] leading-relaxed">{disclosure.summary}</p>
      </div>

      {/* Analytics Scoreboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Duygu Skoru */}
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-1">
          <span className="text-[10px] text-[var(--mist)] uppercase block">AI Duygu Skoru</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-base font-bold ${
                sentimentScore > 0
                  ? "text-[var(--verdigris)]"
                  : sentimentScore < 0
                  ? "text-[var(--loss)]"
                  : "text-[var(--mist)]"
              }`}
            >
              {sentimentScore > 0 ? `+${sentimentScore}` : sentimentScore}
            </span>
            <span className="text-[10px] text-[var(--mist)]">/ 1.0</span>
          </div>
        </div>

        {/* Oransal İş Büyüklüğü */}
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-1">
          <span className="text-[10px] text-[var(--mist)] uppercase block">İş Büyüklüğü / Piyasa Değeri</span>
          <span className="text-base font-bold text-[var(--brass)] block">
            {relativeMaterialityPct !== undefined ? `%${relativeMaterialityPct}` : "—"}
          </span>
        </div>

        {/* Güven Derecesi */}
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-1">
          <span className="text-[10px] text-[var(--mist)] uppercase block">NLP Güven Derecesi</span>
          <span className="text-base font-bold text-[var(--paper)] block">{confidenceLevel}</span>
        </div>
      </div>

      {/* Key Drivers Tags */}
      <div className="space-y-1.5 pt-1 border-t border-[var(--line)]">
        <span className="text-[10px] text-[var(--mist)] uppercase block flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[var(--brass)]" />
          <span>Tespit Edilen NLP Sürücüleri:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {keyDrivers.map((driver, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded bg-[var(--ink-3)] border border-[var(--line)] text-[10px] text-[var(--paper-dim)] font-mono"
            >
              {driver}
            </span>
          ))}
        </div>
      </div>

      {/* Impact Summary Note */}
      <div className="p-3 rounded-lg bg-[var(--ink-3)]/60 border border-[var(--line)] text-[11px] text-[var(--mist)] flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
        <span>{impactSummary}</span>
      </div>
    </div>
  );
}
