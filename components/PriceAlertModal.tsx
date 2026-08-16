"use client";

import React, { useState } from "react";
import { Bell, X, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { isLiveSymbol } from "@/lib/liveSymbols";

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: "ABOVE" | "BELOW";
  createdAt: string;
  active: boolean;
}

interface PriceAlertModalProps {
  symbol?: string;
  currentPrice?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PriceAlertModal({
  symbol = "THYAO",
  currentPrice = 328.5,
  isOpen,
  onClose,
}: PriceAlertModalProps) {
  const { showToast } = useToast();
  const isLive = isLiveSymbol(symbol);

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("defter_price_alerts");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [targetPriceInput, setTargetPriceInput] = useState((currentPrice * 1.05).toFixed(2));
  const [condition, setCondition] = useState<"ABOVE" | "BELOW">("ABOVE");

  if (!isOpen) return null;

  const saveAlerts = (newAlerts: PriceAlert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem("defter_price_alerts", JSON.stringify(newAlerts));
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLive) {
      showToast(
        "Alarm Kurulamadı",
        "Bu varlık canlı piyasa fiyat akışında yer almadığı için alarm oluşturulamaz.",
        "error"
      );
      return;
    }

    const price = parseFloat(targetPriceInput);
    if (!price || price <= 0) return;

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol,
      targetPrice: price,
      condition,
      createdAt: new Date().toISOString().split("T")[0],
      active: true,
    };

    const updated = [newAlert, ...alerts];
    saveAlerts(updated);

    showToast(
      "Fiyat Alarmı Kuruldu",
      `${symbol} için ${price} ₺ ${condition === "ABOVE" ? "üzerine çıkınca" : "altına inince"}, Defter tarayıcınızda açıkken uygulama içi bildirim alacaksınız.`,
      "success"
    );
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    saveAlerts(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--brass)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--paper)]">
              Fiyat Alarmı &amp; Takip
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Static Warning Banner if symbol is not live */}
        {!isLive && (
          <div className="p-3 bg-[rgba(163,59,59,0.15)] border border-[var(--loss)] rounded-xl text-xs font-mono text-[var(--loss)] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              ⚠️ Bu varlık canlı fiyat akışında yer almamaktadır. Fiyatlar otomatik güncellenmediği için bu varlığa alarm kurulamaz.
            </span>
          </div>
        )}

        {/* Current Asset Info */}
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex items-center justify-between font-mono text-xs">
          <div>
            <span className="font-bold text-[var(--paper)] text-sm">{symbol}</span>
            <span className="text-[var(--mist)] block text-[11px]">
              {isLive ? "Anlık Canlı Fiyat" : "Statik Kütük Fiyatı"}
            </span>
          </div>
          <div className="text-right">
            <span className="font-bold text-[var(--brass)] text-sm">{currentPrice.toFixed(2)} ₺</span>
          </div>
        </div>

        {/* New Alert Form */}
        <form onSubmit={handleAddAlert} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!isLive}
              onClick={() => setCondition("ABOVE")}
              className={`py-2 rounded-lg text-xs font-mono transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                condition === "ABOVE"
                  ? "bg-[var(--verdigris)] text-[var(--ink)] font-bold shadow"
                  : "bg-[var(--ink-3)] text-[var(--mist)] border border-[var(--line)]"
              }`}
            >
              ▲ Üzerine Çıkınca
            </button>
            <button
              type="button"
              disabled={!isLive}
              onClick={() => setCondition("BELOW")}
              className={`py-2 rounded-lg text-xs font-mono transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                condition === "BELOW"
                  ? "bg-[var(--loss)] text-[var(--ink)] font-bold shadow"
                  : "bg-[var(--ink-3)] text-[var(--mist)] border border-[var(--line)]"
              }`}
            >
              ▼ Altına İnince
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
              Hedef Tetikleme Fiyatı (₺)
            </label>
            <input
              type="number"
              step="any"
              required
              disabled={!isLive}
              value={targetPriceInput}
              onChange={(e) => setTargetPriceInput(e.target.value)}
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] focus:border-[var(--brass)] rounded-lg p-2.5 text-xs text-[var(--paper)] font-mono outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={!isLive}
            className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
          >
            <Bell className="w-4 h-4" />
            <span>{isLive ? "Alarmı Kur" : "Canlı Akış Yok (Alarm Kurulamaz)"}</span>
          </button>

          <p className="text-[10px] font-mono text-[var(--mist)] text-center pt-1 leading-relaxed">
            💡 Fiyat alarmları, Defter tarayıcınızda açıkken canlı veri akışında tetiklenir ve uygulama içi bildirim olarak iletilir.
          </p>
        </form>

        {/* Active Alerts List */}
        <div className="space-y-2 pt-2 border-t border-dashed border-[var(--line)]">
          <h4 className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
            Kayıtlı Alarmlarım ({alerts.length})
          </h4>

          {alerts.length === 0 ? (
            <p className="text-xs text-[var(--mist)] font-mono py-2 text-center">
              Henüz aktif bir alarmınız yok.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-2 rounded bg-[var(--ink-3)] border border-[var(--line)] text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--paper)]">{a.symbol}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        a.condition === "ABOVE"
                          ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)]"
                          : "bg-[rgba(201,124,124,0.2)] text-[var(--loss)]"
                      }`}
                    >
                      {a.condition === "ABOVE" ? "≥" : "≤"} {a.targetPrice} ₺
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(a.id)}
                    className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
