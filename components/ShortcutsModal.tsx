"use client";

import React, { useEffect, useState } from "react";
import { X, Command, Search, Plus, Sparkles, Moon, HelpCircle } from "lucide-react";

interface ShortcutItem {
  keys: string[];
  description: string;
  category: "Gezinme" | "İşlemler" | "Görünüm";
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ["Ctrl", "K"], description: "Hızlı Komut Paleti & Arama Aç", category: "Gezinme" },
  { keys: ["Ctrl", "N"], description: "Yeni Varlık veya Sepet Oluştur", category: "İşlemler" },
  { keys: ["Ctrl", "Shift", "P"], description: "Portföy / Sepet Raporunu Yazdır", category: "İşlemler" },
  { keys: ["Shift", "?"], description: "Klavye Kısayolları Kılavuzunu Göster", category: "Görünüm" },
  { keys: ["Esc"], description: "Açık Modalları ve Pencereleri Kapat", category: "Gezinme" },
];

export default function ShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts on Shift + ?
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-[var(--brass)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--paper)]">
              Klavye Kısayolları
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {SHORTCUTS.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)]"
            >
              <span className="text-[var(--paper-dim)] font-sans text-xs">
                {sc.description}
              </span>
              <div className="flex items-center gap-1">
                {sc.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-1 rounded bg-[var(--ink)] border border-[var(--line)] text-[11px] font-bold text-[var(--brass)] shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg cursor-pointer transition-all"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
