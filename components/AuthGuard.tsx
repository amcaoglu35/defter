"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(true);
  const [error, setError] = useState(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    return Boolean(urlParams.get("auth_error"));
  });
  const [errorMessage, setErrorMessage] = useState(() => {
    if (typeof window === "undefined") return "";
    const urlParams = new URLSearchParams(window.location.search);
    const authError = urlParams.get("auth_error");
    const attemptedEmail = urlParams.get("email");
    if (authError === "unauthorized_email") {
      return attemptedEmail
        ? `🚫 Yetkisiz Erişim: "${attemptedEmail}" bu kasanın yetkili sahibi olarak tanımlanmamıştır.`
        : "🚫 Bu hesap bu kasanın yetkili sahibi olarak tanımlanmamıştır.";
    }
    if (authError) {
      return "Kimlik doğrulama işlemi tamamlanamadı. Lütfen tekrar deneyin.";
    }
    return "";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);

  useEffect(() => {
    // 1. Clean URL search parameters if OAuth redirect error was present
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("auth_error")) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // 2. Check server httpOnly cookie session
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

  const handleOAuthLogin = async (provider: "google" | "github") => {
    if (!isSupabaseConfigured || !supabase) {
      setError(true);
      setErrorMessage("Supabase bağlantısı henüz yapılandırılmamış.");
      return;
    }

    setOauthLoading(provider);
    setError(false);
    setErrorMessage("");

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (signInError) {
        setError(true);
        setErrorMessage(signInError.message || "OAuth sağlayıcısına bağlanırken hata oluştu.");
        setOauthLoading(null);
      }
    } catch {
      setError(true);
      setErrorMessage("Giriş bağlantısı başlatılamadı.");
      setOauthLoading(null);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
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
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("defter_auth_success"));
        }
      } else {
        setError(true);
        setErrorMessage(data.error || "Hatalı şifre. Lütfen tekrar deneyin.");
      }
    } catch {
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
          Kasa güvenliği denetleniyor...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl p-8 shadow-2xl relative overflow-hidden space-y-6 animate-in fade-in zoom-in-95">
          {/* Ambient light glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--brass-glow)] rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-[var(--brass)] bg-[var(--ink-3)] text-[var(--brass)] shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--paper)]">
              Defter Koruması
            </h1>
            <p className="font-sans text-xs text-[var(--mist)] max-w-xs mx-auto">
              Bu portföy platformu tek kullanıcılı olarak kilitlenmiştir. Yalnızca yetkili sahip erişebilir.
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="p-3.5 bg-[rgba(163,59,59,0.15)] border border-[var(--loss)] rounded-xl text-xs font-mono text-[var(--loss)] flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Primary Action: Google & GitHub Whitelist OAuth */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={Boolean(oauthLoading)}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
                />
              </svg>
              <span>
                {oauthLoading === "google"
                  ? "Google ile Bağlanıyor..."
                  : "Google ile Giriş Yap (Whitelist)"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin("github")}
              disabled={Boolean(oauthLoading)}
              className="w-full bg-[#24292e] hover:bg-[#2f363d] text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-md transition-all active:scale-[0.98] border border-[var(--line)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>
                {oauthLoading === "github"
                  ? "GitHub ile Bağlanıyor..."
                  : "GitHub ile Giriş Yap"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[var(--line)] w-full" />
            <span className="bg-[var(--ink-2)] px-3 text-[10px] font-mono text-[var(--mist)] uppercase tracking-wider shrink-0">
              Veya Alternatif
            </span>
          </div>

          {/* Secondary Action: Master Password Accordion */}
          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="w-full py-2.5 text-xs font-mono text-[var(--brass)] hover:text-[var(--paper)] border border-dashed border-[var(--brass-dim)] hover:border-[var(--brass)] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Kasa Anahtar Şifresi ile Giriş</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-3 pt-1">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] mb-1.5">
                  Kasa Erişim Şifresi
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
                    placeholder="Kasa şifresi (varsayılan: defter2026)"
                    autoFocus
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg px-3.5 py-2.5 pr-10 text-xs text-[var(--paper)] placeholder-[var(--mist)] focus:outline-none focus:border-[var(--brass)] font-mono transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[var(--mist)] hover:text-[var(--paper)] p-0.5 transition-colors cursor-pointer"
                    title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] cursor-pointer shadow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="font-mono text-xs animate-pulse">Açılıyor...</span>
                ) : (
                  <>
                    <span>Şifre ile Kasayı Aç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Info */}
          <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-[11px] font-mono text-[var(--mist)]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--verdigris)]" />
              Tekil Kullanıcı Güvenli Kasa
            </span>
            <span className="text-[10px] text-[var(--brass)]">Defter v3.0</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
