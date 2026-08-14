"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Onayla & Sil",
  cancelText = "İptal",
  isDestructive = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isDestructive
                  ? "bg-[rgba(163,59,59,0.15)] text-[var(--loss)] border border-[rgba(163,59,59,0.3)]"
                  : "bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)]"
              }`}
            >
              {isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-mono text-[var(--paper-dim)] leading-relaxed whitespace-pre-line bg-[var(--ink-3)] p-3 rounded-lg border border-[var(--line)]">
          {message}
        </p>

        <div className="pt-2 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[var(--line)] hover:border-[var(--brass)] py-2.5 rounded-lg text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer transition-colors"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 font-bold py-2.5 rounded-lg text-xs font-mono cursor-pointer transition-all shadow ${
              isDestructive
                ? "bg-[var(--loss)] text-white hover:brightness-110"
                : "bg-[var(--brass)] text-[var(--ink)] hover:bg-[#d9b35a]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
