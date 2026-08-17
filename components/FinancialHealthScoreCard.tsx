"use client";

import React, { useMemo, useState } from "react";
import { ShieldCheck, ShieldAlert, Activity, CheckCircle2, XCircle, ChevronDown, ChevronUp, Award, Layers } from "lucide-react";
import { Company } from "@/lib/mockData";
import { evaluateComprehensiveHealth } from "@/lib/financialHealthScores";

interface FinancialHealthScoreCardProps {
  company: Company;
}

export function FinancialHealthScoreCard({ company }: FinancialHealthScoreCardProps) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  const health = useMemo(() => {
    return evaluateComprehensiveHealth(company);
  }, [company]);

  const { piotroski, altman, overallRating } = health;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                Bilanço Kalitesi &amp; Mali Güvenlik Modeli
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)]">
                Finansal Not: {overallRating}
              </span>
            </div>
            <p className="text-[10px] font-mono text-[var(--mist)]">
              Piotroski F-Score (9 Kriter) ve Altman Z-Score İflas/Sağlamlık Analizi
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBreakdownOpen((prev) => !prev)}
          className="flex items-center gap-1 text-xs font-mono text-[var(--brass)] hover:underline cursor-pointer self-start sm:self-center"
        >
          <span>{isBreakdownOpen ? "Kriterleri Gizle" : "9 Kriteri İncele"}</span>
          {isBreakdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Dual Scores Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
        {/* 1. Piotroski F-Score */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--mist)]">Piotroski F-Skoru (0-9)</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                piotroski.totalScore >= 7
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : piotroski.totalScore >= 5
                  ? "bg-[var(--brass-glow)] text-[var(--brass)] border-[var(--brass-dim)]"
                  : "bg-rose-500/15 text-rose-300 border-rose-500/30"
              }`}
            >
              {piotroski.grade}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--paper)]">
              {piotroski.totalScore}
            </span>
            <span className="text-xs text-[var(--mist)]">/ 9 Puan</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[var(--ink)] rounded-full overflow-hidden">
            <div
              className={`h-full ${
                piotroski.totalScore >= 7
                  ? "bg-emerald-400"
                  : piotroski.totalScore >= 5
                  ? "bg-[var(--brass)]"
                  : "bg-rose-400"
              }`}
              style={{ width: `${(piotroski.totalScore / 9) * 100}%` }}
            />
          </div>
        </div>

        {/* 2. Altman Z-Score */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--mist)]">Altman Z-Skoru (İflas Riski)</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${altman.zoneColor}`}>
              {altman.zone}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--paper)]">
              {altman.zScore}
            </span>
            <span className="text-[10px] text-[var(--mist)]">
              İflas Olasılığı: <strong className="text-[var(--paper)]">{altman.bankruptcyRisk}</strong>
            </span>
          </div>
          <p className="text-[11px] text-[var(--mist)] truncate">
            {altman.summary}
          </p>
        </div>
      </div>

      {/* Expanded 9 Criteria Breakdown */}
      {isBreakdownOpen && (
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-xl p-4 space-y-3 font-mono text-xs animate-in fade-in">
          <h4 className="text-[11px] uppercase tracking-wider text-[var(--brass)] font-bold">
            Piotroski 9 Maddelik Bilanço Karnesi
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(["Kârlılık", "Kaldıraç & Likidite", "Faaliyet Verimliliği"] as const).map((cat) => (
              <div key={cat} className="space-y-2 bg-[var(--ink-2)] p-3 rounded-lg border border-[var(--line)]">
                <div className="text-[11px] font-bold text-[var(--paper)] border-b border-[var(--line)] pb-1">
                  {cat}
                </div>
                <div className="space-y-1.5">
                  {piotroski.breakdown
                    .filter((item) => item.category === cat)
                    .map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        {item.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className={`text-[11px] ${item.passed ? "text-[var(--paper)]" : "text-[var(--mist)] line-through"}`}>
                            {item.criterion}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
