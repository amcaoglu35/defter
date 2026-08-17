"use client";

import React, { useState } from "react";
import { Lock, Unlock, Shield, X, KeyRound, CheckCircle2 } from "lucide-react";
import { encryptVaultData, decryptVaultData } from "@/lib/privacyVault";
import { useToast } from "@/components/ToastProvider";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface PrivacyPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVaultLocked: boolean;
  onUnlockSuccess: () => void;
  onLockSuccess: () => void;
}

export default function PrivacyPinModal({
  isOpen,
  onClose,
  isVaultLocked,
  onUnlockSuccess,
  onLockSuccess,
}: PrivacyPinModalProps) {
  useEscapeKey(isOpen, onClose);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      showToast("Geçersiz PIN", "PIN en az 4 haneli olmalıdır.", "error");
      return;
    }

    setLoading(true);
    try {
      if (isVaultLocked) {
        // Unlock action
        const storedCipher = localStorage.getItem("defter_vault_lock_test");
        if (storedCipher) {
          await decryptVaultData(storedCipher, pin);
        }
        showToast("Kasa Açıldı", "Portföy gizlilik kilidi başarıyla açıldı.", "success");
        onUnlockSuccess();
        onClose();
      } else {
        // Lock action
        const testCipher = await encryptVaultData("defter_unlocked_payload", pin);
        localStorage.setItem("defter_vault_lock_test", testCipher);
        showToast("Kasa Kilitlendi", "Portföy bakiyeleri AES-256 ile şifrelendi.", "success");
        onLockSuccess();
        onClose();
      }
    } catch (err) {
      showToast("Hatalı PIN", "Girdiğiniz PIN şifresi hatalı veya doğrulanamadı.", "error");
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
              {isVaultLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                {isVaultLocked ? "Gizlilik Kasasını Aç" : "Portföyü Kilitle (PIN)"}
              </h3>
              <p className="text-[10px] font-mono text-[var(--mist)]">
                AES-GCM 256-Bit Yerel Şifreleme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-3)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="block text-[var(--mist)] text-[11px]">
              {isVaultLocked ? "4-6 Haneli Kasa PIN Kodunuz:" : "Yeni Kasa PIN Kodu Belirleyin:"}
            </label>
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-center text-lg tracking-widest text-[var(--paper)] outline-none focus:border-[var(--brass)] font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full py-2.5 bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs rounded transition-all shadow cursor-pointer disabled:opacity-50"
          >
            {loading ? "İşleniyor..." : isVaultLocked ? "Kilidi Aç" : "Portföyü Kilitle & Şifrele"}
          </button>
        </form>
      </div>
    </div>
  );
}
