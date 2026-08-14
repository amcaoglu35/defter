import React from "react";
import { MOCK_COMPANIES } from "@/lib/mockData";

interface DataStatusBadgeProps {
  symbol: string;
  isLive?: boolean;
  className?: string;
}

// Dynamically derive BIST TEFAS fund symbols from canonical ledger data
const TEFAS_FUNDS = new Set(
  MOCK_COMPANIES.filter(
    (c) =>
      (c.assetClass === "fon" || c.sector?.includes("Fon")) &&
      c.exchange === "BIST"
  ).map((c) => c.symbol.toUpperCase())
);

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
