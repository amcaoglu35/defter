"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: "success" | "error" | "info" | "warning") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (title: string, message?: string, type: "success" | "error" | "info" | "warning" = "success") => {
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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-xl border backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in ${
              toast.type === "error"
                ? "bg-[var(--ink-2)] border-[var(--loss)] text-[var(--paper)]"
                : toast.type === "info"
                ? "bg-[var(--ink-2)] border-[var(--line)] text-[var(--paper)]"
                : toast.type === "warning"
                ? "bg-[var(--ink-2)] border-[var(--brass-dim)] text-[var(--paper)]"
                : "bg-[var(--ink-2)] border-[var(--verdigris)] text-[var(--paper)]"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-[var(--loss)] shrink-0 mt-0.5" />
            ) : toast.type === "info" ? (
              <Info className="w-5 h-5 text-[var(--mist)] shrink-0 mt-0.5" />
            ) : toast.type === "warning" ? (
              <AlertCircle className="w-5 h-5 text-[var(--brass)] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[var(--verdigris)] shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <h4 className="text-xs font-mono font-bold text-[var(--paper)]">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-[var(--mist)] mt-0.5 font-sans leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--mist)] hover:text-[var(--paper)] p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
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
