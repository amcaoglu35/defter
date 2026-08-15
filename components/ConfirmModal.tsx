"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X, Check, Info } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string | React.ReactNode;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isDestructive?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  message,
  confirmText = "Evet, Onayla",
  cancelText = "Vazgeç",
  variant,
  isDestructive,
  icon,
  isLoading = false,
}: ConfirmModalProps) {
  const content = description ?? message ?? "";
  const effectiveVariant = variant ?? (isDestructive ? "danger" : "default");
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isDanger = effectiveVariant === "danger";
  const isWarning = effectiveVariant === "warning";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className={`bg-[var(--ink-2)] border ${
          isDanger
            ? "border-[rgba(163,59,59,0.4)] shadow-[0_0_30px_rgba(163,59,59,0.15)]"
            : isWarning
            ? "border-[rgba(201,162,75,0.4)] shadow-[0_0_30px_rgba(201,162,75,0.15)]"
            : "border-[var(--line)]"
        } rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Icon */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDanger
                ? "bg-[rgba(163,59,59,0.15)] text-[var(--loss)] border border-[rgba(163,59,59,0.3)]"
                : isWarning
                ? "bg-[rgba(201,162,75,0.15)] text-[var(--brass)] border border-[rgba(201,162,75,0.3)]"
                : "bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--line)]"
            }`}
          >
            {icon ? (
              icon
            ) : isDanger ? (
              <Trash2 className="w-5 h-5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-bold text-[var(--paper)] leading-tight">
              {title}
            </h3>
            <div className="text-xs text-[var(--mist)] mt-1.5 leading-relaxed font-sans">
              {content}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 rounded transition-colors cursor-pointer shrink-0 disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-3)] border border-transparent hover:border-[var(--line)] transition-all cursor-pointer disabled:opacity-40"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDanger
                ? "bg-[var(--loss)] hover:bg-[#b84343] text-white shadow-[0_2px_8px_rgba(163,59,59,0.3)]"
                : "bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] shadow-[0_2px_8px_rgba(201,162,75,0.3)]"
            }`}
          >
            {isDanger ? <Trash2 className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            <span>{isLoading ? "İşleniyor..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
