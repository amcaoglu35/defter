"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  CheckCircle2,
  Loader2,
  Calculator,
  ShieldCheck,
  Dices,
  Sparkles,
  Search,
} from "lucide-react";

interface OrakulLiveAnalysisRadarProps {
  symbol?: string;
  onComplete?: () => void;
  minDurationMs?: number;
}

const ANALYSIS_STEPS = [
  {
    icon: Search,
    title: "Canlı Piyasa & Bilanço Kütüğü Taranıyor",
    desc: "F/K, PD/DD, temettü akışı ve sektör ortalamaları çekiliyor...",
  },
  {
    icon: Calculator,
    title: "Benjamin Graham & DCF Nakit Akımları Hesaplanıyor",
    desc: "İçsel adil değer ve güvenlik marjı (Margin of Safety) indirgeniyor...",
  },
  {
    icon: ShieldCheck,
    title: "Stanford Piotroski 9/9 & Merton İflas Modeli Test Ediliyor",
    desc: "Bilanço sağlığı, nakit üretimi ve temerrüt olasılığı analiz ediliyor...",
  },
  {
    icon: Dices,
    title: "Monte Carlo 1.000 Patika & Hurst Fraktal Trendi Koşuluyor",
    desc: "Kriz tabanı (%5), medyan beklenti (%50) ve boğa tavanı (%95) simüle ediliyor...",
  },
  {
    icon: Sparkles,
    title: "Orakul AI (Gemini 2.5 Flash) Sentez & Nihai Karar Raporu Yazılıyor",
    desc: "Boğa vs Ayı ikili tezi, makro stres testi ve kanıt zinciri derleniyor...",
  },
];

export default function OrakulLiveAnalysisRadar({
  symbol = "VARLIK",
  minDurationMs = 3200,
}: OrakulLiveAnalysisRadarProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const stepDuration = minDurationMs / ANALYSIS_STEPS.length;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [minDurationMs]);

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
              <span>Orakul Derin Kantitatif Analiz Motoru</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                18 MODEL AKTİF
              </span>
            </h4>
            <p className="text-xs font-mono text-[var(--mist)]">
              {symbol.toUpperCase()} için tüm ekonometri algoritmaları ve yapay zeka aynı anda çalışıyor...
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[var(--brass)] bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)]">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>İşlem Adımı: {currentStep + 1} / {ANALYSIS_STEPS.length}</span>
        </div>
      </div>

      {/* 5 Canlı Düşünme & Tarama Adımı */}
      <div className="space-y-3 font-mono">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isPending = idx > currentStep;
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
                    <span className="hidden sm:inline">Hesaplanıyor...</span>
                  </span>
                )}
                {isPending && (
                  <span className="text-[var(--mist)] text-xs opacity-50">Sırada</span>
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
              width: `${((currentStep + 1) / ANALYSIS_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
