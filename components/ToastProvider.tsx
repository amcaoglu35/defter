"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (title: string, message?: string, type: "success" | "error" | "info" = "success") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-lg border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 ${
              t.type === "error"
                ? "bg-[var(--ink-2)] border-[var(--loss)] text-[var(--loss)]"
                : t.type === "info"
                ? "bg-[var(--ink-2)] border-[var(--brass-dim)] text-[var(--brass)]"
                : "bg-[var(--ink-2)] border-[var(--verdigris)] text-[var(--paper)]"
            }`}
          >
            {t.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-[var(--loss)] shrink-0 mt-0.5" />
            ) : t.type === "info" ? (
              <Info className="w-5 h-5 text-[var(--brass)] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[var(--verdigris)] shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--paper)]">
                {t.title}
              </h4>
              {t.message && (
                <p className="text-xs text-[var(--mist)] mt-0.5 font-sans leading-relaxed">
                  {t.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
