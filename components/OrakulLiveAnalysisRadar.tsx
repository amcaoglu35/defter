"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  CheckCircle2,
  Loader2,
  Calculator,
  Sparkles,
  Search,
} from "lucide-react";

interface OrakulLiveAnalysisRadarProps {
  symbol?: string;
  onComplete?: () => void;
  minDurationMs?: number;
  currentStep?: number;
}

const ANALYSIS_STEPS = [
  {
    icon: Search,
    title: "Aşama 1: Finansal Veri & Bilanço Doğrulaması",
    desc: "Fiyat çarpanları, kârlılık metrikleri ve sektör ortalamaları derleniyor...",
  },
  {
    icon: Calculator,
    title: "Aşama 2: Deterministik Değerleme & Risk Modelleri",
    desc: "Graham içsel değeri, sektörel DCF, Gordon DDM ve Piotroski sağlık testi hesaplanıyor...",
  },
  {
    icon: Sparkles,
    title: "Aşama 3: Orakul AI Sentez & Karar Raporu",
    desc: "Boğa vs Ayı ikili tezi, makro stres senaryoları ve kanıt zinciri oluşturuluyor...",
  },
];

export default function OrakulLiveAnalysisRadar({
  symbol = "VARLIK",
  minDurationMs = 2600,
  currentStep: controlledStep,
  onComplete,
}: OrakulLiveAnalysisRadarProps) {
  const [internalStep, setInternalStep] = useState<number>(0);
  const activeStep = controlledStep !== undefined ? controlledStep : internalStep;

  useEffect(() => {
    if (controlledStep !== undefined) return;

    const stepDuration = minDurationMs / ANALYSIS_STEPS.length;
    const interval = setInterval(() => {
      setInternalStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        if (onComplete) onComplete();
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [minDurationMs, controlledStep, onComplete]);

  return (
    <div className="p-6 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Üst Radar Başlığı */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-md">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[var(--paper)] flex items-center gap-2">
              <span>Orakul Analiz &amp; Değerleme Süreci</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                3 AŞAMALI RAPORLAMA
              </span>
            </h4>
            <p className="text-xs font-mono text-[var(--mist)]">
              {symbol.toUpperCase()} için temel değerleme modelleri ve yapay zeka sentezleniyor...
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[var(--brass)] bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)]">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Aşama: {Math.min(activeStep + 1, ANALYSIS_STEPS.length)} / {ANALYSIS_STEPS.length}</span>
        </div>
      </div>

      {/* 3 Canlı Aşama */}
      <div className="space-y-3 font-mono">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          const isPending = idx > activeStep;
          const Icon = step.icon;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                isCurrent
                  ? "bg-[var(--ink-3)] border-[var(--brass)] shadow-md ring-1 ring-[var(--brass)]/30"
                  : isDone
                  ? "bg-[var(--ink-3)]/60 border-emerald-600/30 text-[var(--paper-dim)]"
                  : "bg-[var(--ink-3)]/20 border-transparent opacity-40"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? "bg-[var(--brass)] text-[var(--ink)] shadow-sm"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-[var(--ink)] text-[var(--mist)] border border-[var(--line)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold ${
                      isCurrent
                        ? "text-[var(--paper)]"
                        : isDone
                        ? "text-emerald-300"
                        : "text-[var(--mist)]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-[var(--mist)] line-clamp-1">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {isDone && (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Tamamlandı</span>
                  </span>
                )}
                {isCurrent && (
                  <span className="flex items-center gap-1.5 text-[var(--brass)] text-xs font-bold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">İşleniyor...</span>
                  </span>
                )}
                {isPending && (
                  <span className="text-[var(--mist)] text-xs opacity-50">Hazırlanıyor</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* İlerleme Çubuğu */}
      <div className="space-y-1.5 pt-1">
        <div className="w-full bg-[var(--ink)] h-2 rounded-full overflow-hidden border border-[var(--line)]">
          <div
            className="bg-gradient-to-r from-[var(--brass)] to-emerald-400 h-full transition-all duration-500 rounded-full"
            style={{
              width: `${((activeStep + 1) / ANALYSIS_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
