"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function getBistMarketStatus(): {
  isOpen: boolean;
  statusText: string;
  subText: string;
  nextEvent: string;
} {
  // Istanbul is UTC+3 with no DST changes
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istanbulTime = new Date(utc + 3600000 * 3);

  const day = istanbulTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = istanbulTime.getHours();
  const minutes = istanbulTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // BIST regular trading hours: Monday (1) to Friday (5), 10:00 (600) to 18:05 (1085)
  const isWeekday = day >= 1 && day <= 5;
  const isPreMarket = isWeekday && totalMinutes >= 580 && totalMinutes < 600; // 09:40 - 10:00
  const isTradingOpen = isWeekday && totalMinutes >= 600 && totalMinutes <= 1085; // 10:00 - 18:05
  const isClosingSession = isWeekday && totalMinutes > 1085 && totalMinutes <= 1090; // 18:05 - 18:10

  if (isTradingOpen) {
    const remainingMinutes = 1085 - totalMinutes;
    const remHours = Math.floor(remainingMinutes / 60);
    const remMins = remainingMinutes % 60;
    return {
      isOpen: true,
      statusText: "BIST Seansı Açık",
      subText: "Canlı İşlem Seansı",
      nextEvent: `Kapanışa ${remHours > 0 ? `${remHours} sa ` : ""}${remMins} dk kaldı`,
    };
  }

  if (isPreMarket) {
    return {
      isOpen: false,
      statusText: "Açılış Seansı",
      subText: "Fiyat Belirleme",
      nextEvent: "Sürekli müzayede 10:00'da başlayacak",
    };
  }

  if (isClosingSession) {
    return {
      isOpen: false,
      statusText: "Kapanış Marjı",
      subText: "Gün Sonu Eşleşme",
      nextEvent: "Seans 18:10'da tamamen kapanıyor",
    };
  }

  if (!isWeekday) {
    return {
      isOpen: false,
      statusText: "Hafta Sonu Kapalı",
      subText: "Kapanış Kütüğü",
      nextEvent: "Pazartesi 10:00'da açılacak",
    };
  }

  // Weekday outside hours
  if (totalMinutes < 600) {
    return {
      isOpen: false,
      statusText: "Piyasa Henüz Açılmadı",
      subText: "Kapanış Fiyatları",
      nextEvent: "Bugün 10:00'da açılacak",
    };
  } else {
    return {
      isOpen: false,
      statusText: "BIST Seansı Kapandı",
      subText: "Resmi Kapanış",
      nextEvent: "Yarın 10:00'da açılacak",
    };
  }
}

export default function MarketStatusBadge({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState(getBistMarketStatus);
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setStatus(getBistMarketStatus());
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 3600000 * 3);
      setTimeStr(
        ist.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${
          status.isOpen
            ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
            : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
        }`}
        title={`${status.statusText} • ${status.nextEvent} (İstanbul: ${timeStr})`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status.isOpen ? "bg-[var(--verdigris)] animate-pulse" : "bg-[var(--mist)]"
          }`}
        />
        <span>{status.isOpen ? "BIST AÇIK" : "BIST KAPALI"}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
        status.isOpen
          ? "bg-[rgba(91,140,123,0.12)] text-[var(--verdigris)] border-[var(--verdigris)] shadow-[0_0_12px_rgba(91,140,123,0.15)]"
          : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
      }`}
      title={`${status.statusText} • ${status.nextEvent}`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          status.isOpen ? "bg-[var(--verdigris)] animate-ping" : "bg-[var(--mist)]"
        }`}
      />
      <div className="flex items-center gap-1.5">
        <span className="font-bold">{status.statusText}</span>
        <span className="text-[10px] text-[var(--mist)] hidden lg:inline">
          ({status.nextEvent})
        </span>
        {timeStr && (
          <span className="text-[10px] opacity-75 font-mono hidden xl:inline">
            • {timeStr}
          </span>
        )}
      </div>
    </div>
  );
}
