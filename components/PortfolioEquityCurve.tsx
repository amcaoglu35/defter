"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LineChart, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";
import { getSymbolTicker } from "@/lib/liveSymbols";
import { HistoricalPricePoint } from "@/lib/riskEngine";

interface PortfolioEquityCurveProps {
  baskets: Basket[];
  companies: Company[];
  totalPortfolioValue: number;
  totalDailyChangePct: number;
  currencySymbol?: string;
  exchangeRate?: number; // 1 for TRY, usdRate for USD, eurRate for EUR
}

export default function PortfolioEquityCurve({
  baskets,
  companies,
  totalPortfolioValue,
  totalDailyChangePct,
  currencySymbol = "₺",
  exchangeRate = 1,
}: PortfolioEquityCurveProps) {
  const [period, setPeriod] = useState<"1A" | "3A" | "6A" | "1Y">("3A");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [holdingHistories, setHoldingHistories] = useState<Map<string, HistoricalPricePoint[]>>(new Map());

  // Aggregate holdings across all active baskets
  const combinedHoldings = useMemo(() => {
    const map = new Map<string, number>(); // symbol -> total quantity
    for (const b of baskets) {
      for (const h of b.holdings) {
        const sym = h.companySymbol.toUpperCase();
        const qty = h.quantity ?? 0;
        if (qty > 0) {
          map.set(sym, (map.get(sym) ?? 0) + qty);
        }
      }
    }
    return Array.from(map.entries()).map(([symbol, quantity]) => ({ symbol, quantity }));
  }, [baskets]);

  // Fetch real historical price series for all holdings in parallel
  useEffect(() => {
    if (combinedHoldings.length === 0) {
      setLoading(false);
      setHoldingHistories(new Map());
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function fetchHistories() {
      try {
        const periodParam = period === "1A" ? "1m" : period === "3A" ? "3m" : period === "6A" ? "6m" : "1y";

        const results = await Promise.allSettled(
          combinedHoldings.map(async (item) => {
            const ticker = getSymbolTicker(item.symbol);
            const url = `/api/prices/history?symbol=${encodeURIComponent(ticker)}&period=${periodParam}`;
            const res = await fetch(url);
            if (!res.ok) return { symbol: item.symbol, data: [] };
            const json = (await res.json()) as { success: boolean; data?: HistoricalPricePoint[] };
            return { symbol: item.symbol, data: json.success && json.data ? json.data : [] };
          })
        );

        if (!isMounted) return;

        const newMap = new Map<string, HistoricalPricePoint[]>();
        for (const r of results) {
          if (r.status === "fulfilled") {
            newMap.set(r.value.symbol, r.value.data);
          }
        }
        setHoldingHistories(newMap);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Tarihsel fiyat verileri çekilemedi");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHistories();

    return () => {
      isMounted = false;
    };
  }, [combinedHoldings, period]);

  // Calculate real daily portfolio value series
  const chartData = useMemo(() => {
    if (combinedHoldings.length === 0 || holdingHistories.size === 0) return [];

    // Common dates from available histories
    const dateValueMap = new Map<string, number>();

    for (const { symbol, quantity } of combinedHoldings) {
      const history = holdingHistories.get(symbol);
      if (!history || history.length === 0) continue;

      for (const pt of history) {
        const val = quantity * pt.close;
        dateValueMap.set(pt.date, (dateValueMap.get(pt.date) ?? 0) + val);
      }
    }

    if (dateValueMap.size === 0) return [];

    // Sort by date ascending
    const sortedDates = Array.from(dateValueMap.keys()).sort();
    return sortedDates.map((dateStr) => {
      const totalTl = dateValueMap.get(dateStr) ?? 0;
      const converted = exchangeRate > 0 ? totalTl / exchangeRate : totalTl;
      const formattedDate = new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      });

      return {
        date: formattedDate,
        rawDate: dateStr,
        value: Math.round(converted),
      };
    });
  }, [combinedHoldings, holdingHistories, exchangeRate]);

  const { startValue, currentValue, changePct, isPositive, peakVal } = useMemo(() => {
    if (chartData.length === 0) {
      return { startValue: 0, currentValue: 0, changePct: 0, isPositive: true, peakVal: 0 };
    }
    const start = chartData[0].value;
    const end = chartData[chartData.length - 1].value;
    const pct = start > 0 ? ((end - start) / start) * 100 : 0;
    const max = Math.max(...chartData.map((p) => p.value));

    return {
      startValue: start,
      currentValue: end,
      changePct: Number(pct.toFixed(2)),
      isPositive: pct >= 0,
      peakVal: max,
    };
  }, [chartData]);

  if (totalPortfolioValue <= 0 || baskets.length === 0 || combinedHoldings.length === 0) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 text-center space-y-3 font-mono">
        <LineChart className="w-8 h-8 text-[var(--brass)] mx-auto opacity-60" />
        <h4 className="font-serif text-base font-bold text-[var(--paper)]">
          Portföy Değer Zaman Serisi (Equity Curve)
        </h4>
        <p className="text-xs text-[var(--mist)] max-w-md mx-auto font-sans">
          Sepetlerinize varlık eklediğinizde portföyünüzün gerçek tarihsel zaman serisi grafiği canlı fiyat verileriyle burada çizilir.
        </p>
      </div>
    );
  }

  const strokeColor = isPositive ? "var(--verdigris)" : "var(--loss)";
  const gradientId = `equityGrad-${isPositive ? "pos" : "neg"}`;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 shadow-xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--paper)] flex items-center gap-2">
              <span>📈 Portföy Değer Zaman Serisi (Equity Curve)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--brass-dim)]">
                📌 Canlı Fiyat Geçmişi
              </span>
            </h3>
            <p className="text-xs text-[var(--mist)]">
              Gerçek BIST &amp; Küresel Piyasa Kapanış Verileriyle Ağırlıklı Değer Hesabı
            </p>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 text-xs self-start sm:self-center">
          {(["1A", "3A", "6A", "1Y"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-xs border transition-all cursor-pointer font-bold ${
                period === p
                  ? "bg-[var(--brass-glow)] border-[var(--brass)] text-[var(--brass)] shadow-sm"
                  : "bg-[var(--ink-3)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Başı</span>
          <span className="font-bold text-[var(--paper)] block mt-0.5">
            {loading ? "..." : `${startValue.toLocaleString("tr-TR")} ${currencySymbol}`}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Sonu (Bugün)</span>
          <span className="font-bold text-[var(--paper)] block mt-0.5">
            {loading ? "..." : `${currentValue.toLocaleString("tr-TR")} ${currencySymbol}`}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Getirisi</span>
          <span
            className={`font-bold block mt-0.5 ${
              isPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
            }`}
          >
            {loading ? "..." : `${isPositive ? "+" : ""}${changePct}%`}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Zirve Tavan</span>
          <span className="font-bold text-[var(--brass)] block mt-0.5">
            {loading ? "..." : `${peakVal.toLocaleString("tr-TR")} ${currencySymbol}`}
          </span>
        </div>
      </div>

      {/* Chart State Loading / Content / Empty */}
      {loading ? (
        <div className="w-full h-64 sm:h-72 flex flex-col items-center justify-center bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-2 text-[var(--mist)]">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--brass)]" />
          <span className="text-xs font-mono">BIST &amp; Küresel Fiyat Geçmişi Yükleniyor...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="w-full h-64 sm:h-72 flex flex-col items-center justify-center bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-2 text-center p-4 text-[var(--mist)]">
          <AlertCircle className="w-6 h-6 text-[var(--brass)] opacity-70" />
          <span className="text-xs font-mono font-bold text-[var(--paper)]">
            Seçili Dönem İçin Veri Yok
          </span>
          <p className="text-[11px] text-[var(--mist)] max-w-sm">
            Kütüğünüzdeki varlıkların BIST/KAP veya Yahoo Finance fiyat geçmişi bulunamadı.
          </p>
        </div>
      ) : (
        <div className="w-full h-64 sm:h-72 pt-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                stroke="var(--mist)"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "var(--line)" }}
                minTickGap={25}
              />

              <YAxis
                stroke="var(--mist)"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "var(--line)" }}
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v: number) =>
                  v >= 1000000
                    ? `${(v / 1000000).toFixed(1)}M`
                    : v >= 1000
                    ? `${(v / 1000).toFixed(0)}k`
                    : String(v)
                }
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ink-3)",
                  borderColor: "var(--brass-dim)",
                  borderRadius: "0.5rem",
                  color: "var(--paper)",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                }}
                formatter={(value: unknown) => [
                  `${Number(value).toLocaleString("tr-TR")} ${currencySymbol}`,
                  "Portföy Değeri",
                ] as [string, string]}
                labelFormatter={(label: unknown) => `Tarih: ${String(label)}`}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer Audit Badge */}
      <div className="flex items-center justify-between text-[10px] text-[var(--mist)] pt-1 border-t border-[var(--line)]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--brass)]" />
          <span>BIST &amp; Küresel Kapanış Fiyatlarıyla Gerçek Zamanlı Hesaplanmıştır</span>
        </div>
        <span>{chartData.length} Veri Noktası</span>
      </div>
    </div>
  );
}
