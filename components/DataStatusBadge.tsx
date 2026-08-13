import React from "react";

interface DataStatusBadgeProps {
  symbol: string;
  isLive?: boolean;
  className?: string;
}

const TEFAS_FUNDS = new Set(["AFT", "TTE", "MAC", "TI1", "YAY", "AFO", "TJB", "IPB"]);

export default function DataStatusBadge({ symbol, isLive = false, className = "" }: DataStatusBadgeProps) {
  if (isLive) return null;

  if (TEFAS_FUNDS.has(symbol.toUpperCase())) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--line)] bg-[var(--ink-3)] text-[var(--mist)] ${className}`}
        title="TEFAS fon fiyatları manuel/günlük olarak güncellenmektedir."
      >
        🏛️ TEFAS (Manuel)
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--line)] bg-[var(--ink-3)] text-[var(--mist)] ${className}`}
      title="Bu varlık canlı fiyat akışına dahil değildir, gösterilen rakam örnektir."
    >
      📌 Statik Veri
    </span>
  );
}
