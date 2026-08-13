"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, ArrowLeft, Check, Layers, Building2, TrendingUp, ShieldCheck, Compass } from "lucide-react";
import Link from "next/link";

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const STEPS = [
  {
    icon: Compass,
    title: "Defter'e Hoş Geldiniz",
    subtitle: "Yeni Nesil Varlık & Portföy Yönetim Kütüğü",
    desc: "Defter, Borsa İstanbul, Kıymetli Madenler, Fonlar ve Döviz varlıklarınızı tek bir güvenli, estetik ve yapay zeka destekli platformda takip etmenizi sağlar.",
    badge: "1. ADIM",
  },
  {
    icon: Layers,
    title: "Akıllı Yatırım Sepetleri",
    subtitle: "Stratejik Portföy Bölümleme",
    desc: "Varlıklarınızı Temettü Şampiyonları, Büyüme veya Enflasyon Kalkanı gibi akıllı tematik sepetlere ayırarak kümülatif getiri ve risk dengenizi yönetin.",
    badge: "2. ADIM",
  },
  {
    icon: Sparkles,
    title: "Orakul Yapay Zeka Danışmanı",
    subtitle: "30 Saniyede Bilanço & Değer Tuzağı Radarı",
    desc: "Orakul AI ile 80 sayfalık bilançoları 3 cümleye indirin, düşük F/K tuzaklarını saptayın ve portföyünüze geçmişe dönük zaman makinesi simülasyonları uygulayın.",
    badge: "3. ADIM",
  },
  {
    icon: ShieldCheck,
    title: "Gizlilik & Çevrimdışı Güvenlik",
    subtitle: "Verileriniz Sadece Sizin Cihazınızda",
    desc: "Defter, gizlilik odaklı mimarisiyle verilerinizi yerel kütüğünüzde güvenle saklar. Dilediğinizde tek tıkla şifreli bulut senkronizasyonu başlatabilirsiniz.",
    badge: "4. ADIM",
  },
];

export default function OnboardingModal({ forceOpen, onClose }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
      return;
    }

    const hasSeen = localStorage.getItem("defter_onboarding_completed");
    if (!hasSeen) {
      // First time visitor delay slightly for smooth entrance
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleComplete = () => {
    localStorage.setItem("defter_onboarding_completed", "true");
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass)] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--brass-glow)] rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-[var(--brass)] uppercase tracking-widest border border-[var(--brass-dim)] px-2 py-0.5 rounded-xs bg-[var(--brass-glow)]">
            {step.badge}
          </span>
          <button
            onClick={handleComplete}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center space-y-3 py-2">
          <div className="w-16 h-16 rounded-2xl bg-[var(--ink-3)] border border-[var(--brass-dim)] mx-auto flex items-center justify-center text-[var(--brass)] shadow-inner">
            <StepIcon className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[var(--paper)]">
            {step.title}
          </h2>
          <p className="font-mono text-xs text-[var(--brass)] font-semibold uppercase tracking-wider">
            {step.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-[var(--mist)] leading-relaxed max-w-md mx-auto font-sans">
            {step.desc}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentStep
                  ? "w-8 bg-[var(--brass)]"
                  : "w-2 bg-[var(--line)] hover:bg-[var(--mist)]"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] text-xs font-mono px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] px-2 py-2"
            >
              Turu Atla
            </button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow transition-transform active:scale-95 ml-auto"
            >
              <span>İleri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="bg-[var(--verdigris)] hover:bg-[#4f7d6e] text-[var(--ink)] font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow transition-transform active:scale-95 ml-auto"
            >
              <Check className="w-4 h-4" />
              <span>Kullanmaya Başla</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
