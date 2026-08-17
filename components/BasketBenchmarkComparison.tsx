"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Trophy, Activity, Award } from "lucide-react";
import { Basket } from "@/lib/mockData";

interface BasketBenchmarkComparisonProps {
  basket: Basket;
}

type BenchmarkType = "BIST100" | "ALTIN" | "USD";
type PeriodType = "1A" | "3A" | "6A" | "1Y";

const BENCHMARK_NAMES: Record<BenchmarkType, string> = {
  BIST100: "BIST 100 Endeksi",
  ALTIN: "Gram Altın (TL)",
  USD: "USD / TRY Kuru",
};

const BENCHMARK_RETURNS: Record<PeriodType, Record<BenchmarkType, number>> = {
  "1A": { BIST100: 3.2, ALTIN: 4.8, USD: 1.5 },
  "3A": { BIST100: 8.5, ALTIN: 12.4, USD: 4.2 },
  "6A": { BIST100: 16.8, ALTIN: 24.5, USD: 9.8 },
  "1Y": { BIST100: 38.5, ALTIN: 52.0, USD: 22.4 },
};

export function BasketBenchmarkComparison({ basket }: BasketBenchmarkComparisonProps) {
  const [benchmark, setBenchmark] = useState<BenchmarkType>("BIST100");
  const [period, setPeriod] = useState<PeriodType>("6A");

  const comparisonData = useMemo(() => {
    const totalProfitPct = basket.totalProfitPercent || 0;
    const benchReturnPct = BENCHMARK_RETURNS[period][benchmark];

    // Generate step points for the chart
    let pointsCount = 6;
    if (period === "1A") pointsCount = 5;
    else if (period === "1Y") pointsCount = 7;

    const data = [];
    for (let i = 0; i < pointsCount; i++) {
      const progress = i / (pointsCount - 1);
      const ease = progress * progress * (3 - 2 * progress); // smoothstep

      const basketVal = parseFloat((totalProfitPct * ease).toFixed(1));
      const benchVal = parseFloat((benchReturnPct * ease).toFixed(1));

      data.push({
        label: i === pointsCount - 1 ? "Bugün" : `${i + 1}. Dönem`,
        [basket.name]: basketVal,
        [BENCHMARK_NAMES[benchmark]]: benchVal,
      });
    }

    const alphaPct = parseFloat((totalProfitPct - benchReturnPct).toFixed(1));
    const isBeatingBenchmark = alphaPct >= 0;

    return {
      chartData: data,
      alphaPct,
      isBeatingBenchmark,
      benchReturnPct,
      basketReturnPct: totalProfitPct,
    };
  }, [basket, benchmark, period]);

  const { chartData, alphaPct, isBeatingBenchmark, benchReturnPct, basketReturnPct } = comparisonData;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              📈 Sepet vs Gösterge Kıyaslaması (Benchmark Performance &amp; Alpha)
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Sepetinizin BIST 100, Altın veya Dolar Karşısındaki Alfa Başarısı
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Benchmark Selector */}
          <select
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value as BenchmarkType)}
            className="bg-[var(--ink-3)] border border-[var(--brass-dim)] text-[var(--paper)] text-xs font-mono px-3 py-1.5 rounded cursor-pointer focus:outline-none"
          >
            <option value="BIST100">🏛️ BIST 100</option>
            <option value="ALTIN">🥇 Gram Altın</option>
            <option value="USD">💵 USD / TRY</option>
          </select>

          {/* Period Selector */}
          <div className="flex gap-1 bg-[var(--ink-3)] p-1 rounded border border-[var(--line)]">
            {(["1A", "3A", "6A", "1Y"] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                  period === p
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                    : "text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alpha Verdict Banner */}
      <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Award className={`w-5 h-5 ${isBeatingBenchmark ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`} />
          <div>
            <span className="text-[11px] text-[var(--paper)] font-bold block">
              {isBeatingBenchmark
                ? `🚀 Piyasayı Yendi! Alfa (Excess Return): +%${alphaPct}`
                : `⚠️ Endeksin Gerisinde Kaldı: %${alphaPct}`}
            </span>
            <span className="text-[10px] text-[var(--mist)] block">
              Sepet Getirisi: %{basketReturnPct} | {BENCHMARK_NAMES[benchmark]} Getirisi: %{benchReturnPct}
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded text-xs font-bold border ${
            isBeatingBenchmark
              ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
              : "bg-[rgba(201,124,124,0.15)] text-[var(--loss)] border-[var(--loss)]"
          }`}
        >
          {isBeatingBenchmark ? `+%${alphaPct} Pozitif Alfa` : `-%${Math.abs(alphaPct)} Negatif Alfa`}
        </span>
      </div>

      {/* Recharts Dual Comparison Line Chart */}
      <div className="w-full h-60 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis dataKey="label" stroke="var(--mist)" fontSize={10} />
            <YAxis stroke="var(--mist)" fontSize={10} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--ink-3)",
                borderColor: "var(--line)",
                borderRadius: "0.5rem",
                fontSize: "12px",
                color: "var(--paper)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)" }} />
            <Line
              type="monotone"
              dataKey={basket.name}
              stroke="var(--verdigris)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--verdigris)" }}
            />
            <Line
              type="monotone"
              dataKey={BENCHMARK_NAMES[benchmark]}
              stroke="var(--brass)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: "var(--brass)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
