"use client";

import React, { useEffect, useState } from "react";
import { Download, X, PlusSquare } from "lucide-react";
import { useToast } from "./ToastProvider";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  });
  const [isStandalone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS standalone detection
      window.navigator.standalone === true
    );
  });
  const { showToast } = useToast();

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem("defter_pwa_dismissed") === "true";

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isDismissed && !isStandalone) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If iOS and not standalone and not dismissed, show banner
    if (isIos && !isStandalone && !isDismissed) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, [isIos, isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        showToast("Uygulama Yüklendi", "Defter ana ekranınıza başarıyla eklendi.", "success");
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      showToast(
        "iPhone / iPad'e Yükleme",
        "Alt menüdeki 'Paylaş' (📤) butonuna basıp 'Ana Ekrana Ekle' seçeneğini seçin.",
        "info"
      );
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem("defter_pwa_dismissed", "true");
    } catch (e) {
      console.warn(e);
    }
  };

  if (isStandalone || !showBanner) return null;

  return (
    <aside
      aria-label="Uygulama Yükleme Bildirimi"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-[var(--ink-2)] border border-[var(--brass)] rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 font-sans"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--brass)] text-[var(--ink)] flex items-center justify-center shrink-0 font-serif font-bold text-base shadow">
          D
        </div>
        <div className="flex-1">
          <h4 className="font-serif font-bold text-xs text-[var(--paper)] flex items-center gap-1.5">
            <span>Defter&apos;i Telefona Yükle</span>
            <span className="text-[9px] font-mono font-bold bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)] px-1.5 py-0.2 rounded">
              PWA
            </span>
          </h4>
          <p className="text-[11px] text-[var(--mist)] mt-0.5 leading-relaxed">
            {isIos
              ? "Safari'de Paylaş (📤) simgesine dokunup 'Ana Ekrana Ekle' seçerek tam ekran uygulama olarak kullanın."
              : "Tarayıcı çubuğu olmadan tam ekran mobil uygulama deneyimi için ana ekranınıza ekleyin."}
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={handleInstallClick}
              className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
            >
              {isIos ? <PlusSquare className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isIos ? "Nasıl Yüklenir?" : "Ana Ekrana Ekle"}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="text-[11px] font-mono text-[var(--mist)] hover:text-[var(--paper)] px-2 py-1 cursor-pointer"
            >
              Daha Sonra
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-[var(--mist)] hover:text-[var(--paper)] p-1 -mr-1 -mt-1 cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
