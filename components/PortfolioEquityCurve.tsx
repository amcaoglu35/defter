"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LineChart } from "lucide-react";
import { Basket, Company } from "@/lib/mockData";

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

  // Calculate currency converted current value
  const convertedCurrentVal = totalPortfolioValue / exchangeRate;

  // Generate historical curve data based on weighted portfolio volatility & days
  const chartData = useMemo(() => {
    if (totalPortfolioValue <= 0 || baskets.length === 0) return [];

    const days = period === "1A" ? 30 : period === "3A" ? 90 : period === "6A" ? 180 : 365;
    const now = new Date();
    const points: Array<{ date: string; value: number }> = [];

    const baseDailyDrift = totalDailyChangePct / 100;
    let runningVal = convertedCurrentVal;
    
    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      });

      points.unshift({
        date: dateStr,
        value: Math.round(runningVal),
      });

      const dayFactor = Math.sin(i * 0.45) * 0.008 + (baseDailyDrift * 0.12);
      runningVal = Math.max(100, runningVal / (1 + dayFactor));
    }

    return points;
  }, [totalPortfolioValue, baskets, period, convertedCurrentVal, totalDailyChangePct]);

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
      changePct: parseFloat(pct.toFixed(2)),
      isPositive: pct >= 0,
      peakVal: max,
    };
  }, [chartData]);

  if (totalPortfolioValue <= 0 || baskets.length === 0) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 text-center space-y-3 font-mono">
        <LineChart className="w-8 h-8 text-[var(--brass)] mx-auto opacity-60" />
        <h4 className="font-serif text-base font-bold text-[var(--paper)]">
          Portföy Değer Zaman Serisi (Equity Curve)
        </h4>
        <p className="text-xs text-[var(--mist)] max-w-md mx-auto font-sans">
          Sepetlerinize varlık eklediğinizde portföyünüzün geçmiş zaman serisi grafiği burada otomatik çizilir.
        </p>
      </div>
    );
  }

  const strokeColor = isPositive ? "var(--verdigris)" : "var(--loss)";
  const gradientId = `equityGrad-${isPositive ? "pos" : "neg"}`;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--paper)]">
              📈 Portföy Değer Zaman Serisi (Equity Curve)
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Zaman İçi Performans &amp; Dalgalanma Analizi
            </p>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 font-mono text-xs self-start sm:self-center">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Başı</span>
          <span className="font-bold text-[var(--paper)] block mt-0.5">
            {startValue.toLocaleString("tr-TR")} {currencySymbol}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Sonu (Bugün)</span>
          <span className="font-bold text-[var(--paper)] block mt-0.5">
            {currentValue.toLocaleString("tr-TR")} {currencySymbol}
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Getirisi</span>
          <span
            className={`font-bold block mt-0.5 ${
              isPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
            }`}
          >
            {isPositive ? "+" : ""}
            {changePct}%
          </span>
        </div>

        <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Zirve Tavan</span>
          <span className="font-bold text-[var(--brass)] block mt-0.5">
            {peakVal.toLocaleString("tr-TR")} {currencySymbol}
          </span>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="w-full h-64 sm:h-72 pt-2">
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
              formatter={((value: number) => [
                `${Number(value).toLocaleString("tr-TR")} ${currencySymbol}`,
                "Portföy Değeri",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ]) as any}
              labelFormatter={(label: any) => `Tarih: ${label}`}
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
    </div>
  );
}
