"use client";

import React, { useRef, useState } from "react";
import { X, Download, Copy, Check, Sparkles, Share2, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import StampBadge from "./StampBadge";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  type: "basket" | "company";
  data: {
    primaryMetric: string;
    primaryLabel: string;
    secondaryMetric: string;
    secondaryLabel: string;
    tags: string[];
    note?: string;
    verdict?: "AL" | "SAT" | "TUT" | "NÖTR";
  };
}

export default function ShareCardModal({
  isOpen,
  onClose,
  title,
  subtitle,
  type,
  data,
}: ShareCardModalProps) {
  useEscapeKey(isOpen, onClose);
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const textToCopy = `📜 Defter Yatırım Karnesi:\n${title} (${subtitle})\n${data.primaryLabel}: ${data.primaryMetric}\n${data.secondaryLabel}: ${data.secondaryMetric}\nEtiketler: ${data.tags.join(", ")}\n#DefterFinans #BIST #Yatırım`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `Defter-Yatirim-Karti-${title.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Görsel indirilirken hata oluştu:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[var(--brass)]" />
            <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
              Paylaşılabilir Yatırım Kartı
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Card Widget */}
        <div
          ref={cardRef}
          className="ticket-card p-6 rounded-lg relative overflow-hidden shadow-2xl select-none"
        >
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between border-b border-dashed border-[rgba(18,21,28,0.25)] pb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-xl text-[var(--ink)] tracking-tight">
                Defter
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--brass-dim)] font-bold">
                KÜTÜK v1.2
              </span>
            </div>
            {data.verdict && <StampBadge verdict={data.verdict} />}
          </div>

          {/* Title & Info */}
          <div className="my-4">
            <h2 className="font-serif font-bold text-2xl text-[var(--ink)]">
              {title}
            </h2>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--brass-dim)] mt-0.5 font-bold">
              {subtitle}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-dashed border-[rgba(18,21,28,0.25)] my-3 font-mono">
            <div>
              <span className="text-[10px] text-[rgba(18,21,28,0.6)] uppercase">
                {data.primaryLabel}
              </span>
              <div className="font-bold text-xl text-[var(--ink)]">
                {data.primaryMetric}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[rgba(18,21,28,0.6)] uppercase">
                {data.secondaryLabel}
              </span>
              <div className="font-bold text-xl text-[var(--verdigris)]">
                {data.secondaryMetric}
              </div>
            </div>
          </div>

          {/* Tag Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {data.tags.map((t, idx) => (
              <span
                key={idx}
                className="font-mono text-[10px] bg-[rgba(18,21,28,0.08)] px-2 py-0.5 rounded font-bold text-[var(--ink)]"
              >
                {t}
              </span>
            ))}
          </div>

          {data.note && (
            <p className="text-[11px] text-[rgba(18,21,28,0.7)] mt-3 italic font-sans border-t border-dashed border-[rgba(18,21,28,0.15)] pt-2">
              &quot;{data.note}&quot;
            </p>
          )}

          {/* Bottom Stamp */}
          <div className="mt-4 pt-2 flex items-center justify-between text-[10px] font-mono text-[rgba(18,21,28,0.5)]">
            <span>Kişisel Sermaye Kütüğü</span>
            <span className="font-bold text-[var(--brass-dim)]">Orakul Onaylı</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold py-2.5 px-3 rounded-lg text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Hazırlanıyor...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Görsel İndir</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyText}
            className="flex-1 bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] py-2.5 px-3 rounded-lg text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[var(--verdigris)]" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[var(--brass)]" />
                <span>Özeti Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="bg-[var(--ink-3)] border border-[var(--line)] text-[var(--paper-dim)] hover:text-[var(--paper)] font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
