"use client";

import React, { useState, useEffect } from "react";
import { Lock, KeyRound, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check server httpOnly cookie session
    fetch("/api/auth")
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError(true);
      setErrorMessage("Lütfen şifrenizi girin.");
      return;
    }

    setIsSubmitting(true);
    setError(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setError(false);
      } else {
        setError(true);
        setErrorMessage(data.error || "Hatalı şifre. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      setError(true);
      setErrorMessage("Sunucu bağlantı hatası oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center">
        <div className="font-mono text-xs text-[var(--mist)] animate-pulse">
          Kasa açılıyor...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle brass ambient light */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--brass-glow)] rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[var(--brass-dim)] bg-[var(--ink-3)] text-[var(--brass)] mb-4 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-semibold text-2xl text-[var(--paper)]">
              Defter Koruması
            </h1>
            <p className="font-sans text-xs text-[var(--mist)] mt-2">
              Bu platform kişisel kullanım için şifrelenmiştir. Lütfen kasa anahtarınızı girin.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] mb-2">
                Erişim Şifresi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  disabled={isSubmitting}
                  placeholder="Şifrenizi girin..."
                  autoFocus
                  className={`w-full bg-[var(--ink-3)] border ${
                    error ? "border-[var(--loss)]" : "border-[var(--line)]"
                  } rounded-md px-4 py-3 pr-10 text-sm text-[var(--paper)] placeholder-[var(--mist)] focus:outline-none focus:border-[var(--brass)] font-mono transition-colors disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-[var(--mist)] hover:text-[var(--paper)] p-0.5 transition-colors cursor-pointer"
                  title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-[var(--loss)] text-xs mt-1.5 font-mono">
                  {errorMessage || "Hatalı şifre. Lütfen tekrar deneyin."}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-semibold text-sm py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="font-mono text-xs animate-pulse">Doğrulanıyor...</span>
              ) : (
                <>
                  <span>Kasaya Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--line)] flex items-center justify-between text-[11px] font-mono text-[var(--mist)]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--verdigris)]" />
              Tekil Kullanıcı Güvenli Oturum
            </span>
            <span className="text-[10px] text-[var(--brass)]">Defter v3.0</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
