"use client";

import React, { useEffect, useState, useRef } from "react";
import { Smartphone, Monitor, ZoomIn, Check, SlidersHorizontal } from "lucide-react";
import { useToast } from "./ToastProvider";

export type ViewScaleMode = "compact" | "normal" | "large" | "custom";

interface ScalePreset {
  id: ViewScaleMode;
  label: string;
  sublabel: string;
  zoom: number; // percentage e.g. 85, 100, 115
  icon: typeof Smartphone;
}

const PRESETS: ScalePreset[] = [
  {
    id: "compact",
    label: "Mobil Kompakt",
    sublabel: "Telefona tam sığdır (%85)",
    zoom: 85,
    icon: Smartphone,
  },
  {
    id: "normal",
    label: "Standart Görünüm",
    sublabel: "Varsayılan boyut (%100)",
    zoom: 100,
    icon: Monitor,
  },
  {
    id: "large",
    label: "Büyük & Rahat",
    sublabel: "Okunaklı büyük yazı (%115)",
    zoom: 115,
    icon: ZoomIn,
  },
];

export default function ViewModeToggle() {
  const [currentZoom, setCurrentZoom] = useState<number>(100);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const applyZoom = (zoomPercent: number, showFeedback: boolean = false) => {
    setCurrentZoom(zoomPercent);
    try {
      localStorage.setItem("defter_view_zoom", zoomPercent.toString());
      
      // Apply CSS zoom property to html tag
      const zoomValue = `${zoomPercent}%`;
      document.documentElement.style.zoom = zoomPercent === 100 ? "" : `${zoomPercent / 100}`;
      document.documentElement.setAttribute("data-view-zoom", zoomValue);
      
      if (showFeedback) {
        showToast(
          "Görünüm Ölçeği Güncellendi",
          `Ekran boyutu %${zoomPercent} olarak ayarlandı.`,
          "info"
        );
      }
    } catch (e) {
      console.warn("[ViewMode] Failed to save zoom setting:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("defter_view_zoom");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 70 && parsed <= 150) {
          applyZoom(parsed, false);
          return;
        }
      }
    } catch (e) {
      console.warn("[ViewMode] Load error:", e);
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Görünüm Ölçeği (%${currentZoom}) — Telefonda küçültmek / büyütmek için tıklayın`}
        className={`p-2 rounded-lg border transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
          currentZoom !== 100
            ? "border-[var(--brass)] bg-[var(--brass-glow)] text-[var(--brass)]"
            : "border-[var(--line)] hover:border-[var(--brass)] bg-[var(--ink-2)] hover:bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--brass)]"
        }`}
        aria-label="Görünüm Boyutu Ayarla"
      >
        {currentZoom < 100 ? (
          <Smartphone className="w-4 h-4 text-[var(--brass)]" />
        ) : currentZoom > 100 ? (
          <ZoomIn className="w-4 h-4 text-[var(--brass)]" />
        ) : (
          <SlidersHorizontal className="w-4 h-4 text-[var(--mist)]" />
        )}
        <span className="font-mono text-[10px] font-bold hidden sm:inline">
          %{currentZoom}
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl shadow-2xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[var(--brass)]" />
              <span className="font-serif text-xs font-bold text-[var(--paper)]">
                Ekran &amp; Mobil Görünüm
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--line)]">
              %{currentZoom}
            </span>
          </div>

          <p className="text-[11px] text-[var(--mist)] leading-relaxed">
            Telefonda ekran büyük geliyorsa <strong className="text-[var(--brass)]">%85 Kompakt</strong> moduna alarak tüm tablo ve grafikleri ekrana tam sığdırabilirsiniz.
          </p>

          {/* Presets List */}
          <div className="space-y-1.5">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = currentZoom === preset.zoom;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    applyZoom(preset.zoom, true);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[var(--brass-glow)] border border-[var(--brass)] text-[var(--paper)] font-semibold shadow-xs"
                      : "bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass-dim)] text-[var(--paper-dim)] hover:text-[var(--paper)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center ${
                        isSelected
                          ? "bg-[var(--brass)] text-[var(--ink)]"
                          : "bg-[var(--ink)] text-[var(--mist)]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs">{preset.label}</div>
                      <div className="text-[10px] font-mono text-[var(--mist)]">
                        {preset.sublabel}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[var(--brass)]" />}
                </button>
              );
            })}
          </div>

          {/* Quick Fine-Tuning Steps */}
          <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between gap-1 text-center font-mono text-[11px]">
            <span className="text-[10px] text-[var(--mist)]">Hızlı Adımlar:</span>
            <div className="flex items-center gap-1">
              {[80, 85, 90, 100, 110].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => {
                    applyZoom(z, true);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 rounded border text-[10px] cursor-pointer transition-colors ${
                    currentZoom === z
                      ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)]"
                      : "bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)] border-[var(--line)] hover:border-[var(--brass-dim)]"
                  }`}
                >
                  %{z}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
