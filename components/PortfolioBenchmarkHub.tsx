"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import {
  TrendingUp,
  Trophy,
  Activity,
  Award,
  AlertCircle,
  Loader2,
  ShieldAlert,
  Zap,
  Percent,
} from "lucide-react";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";

interface PortfolioBenchmarkHubProps {
  holdings: PortfolioAssetHolding[];
  totalValue: number;
  totalProfitLossPct: number;
}

type BenchmarkType = "BIST100" | "SP500" | "ALTIN" | "USD";
type PeriodType = "1A" | "3A" | "6A" | "1Y";

const BENCHMARK_CONFIG: Record<
  BenchmarkType,
  { label: string; symbol: string; color: string }
> = {
  BIST100: { label: "BIST 100", symbol: "XU100.IS", color: "#10b981" },
  SP500: { label: "S&P 500 ($)", symbol: "^GSPC", color: "#3b82f6" },
  ALTIN: { label: "Gram Altın", symbol: "GC=F", color: "#f59e0b" },
  USD: { label: "USD / TRY", symbol: "USDTRY=X", color: "#06b6d4" },
};

export default function PortfolioBenchmarkHub({
  holdings,
  totalValue,
  totalProfitLossPct,
}: PortfolioBenchmarkHubProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("3A");
  const [activeBenchmarks, setActiveBenchmarks] = useState<Record<BenchmarkType, boolean>>({
    BIST100: true,
    SP500: false,
    ALTIN: true,
    USD: false,
  });

  const [loading, setLoading] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<
    Record<BenchmarkType, Array<{ date: string; closeNorm: number }>>
  >({
    BIST100: [],
    SP500: [],
    ALTIN: [],
    USD: [],
  });

  const [benchmarkReturns, setBenchmarkReturns] = useState<
    Record<BenchmarkType, number | null>
  >({
    BIST100: null,
    SP500: null,
    ALTIN: null,
    USD: null,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadBenchmarks() {
      setLoading(true);
      const keys: BenchmarkType[] = ["BIST100", "SP500", "ALTIN", "USD"];
      const newSeries: Record<BenchmarkType, Array<{ date: string; closeNorm: number }>> = {
        BIST100: [],
        SP500: [],
        ALTIN: [],
        USD: [],
      };
      const newReturns: Record<BenchmarkType, number | null> = {
        BIST100: null,
        SP500: null,
        ALTIN: null,
        USD: null,
      };

      await Promise.all(
        keys.map(async (key) => {
          try {
            const sym = BENCHMARK_CONFIG[key].symbol;
            const res = await fetch(
              `/api/prices/history?symbol=${encodeURIComponent(sym)}&period=${selectedPeriod}`
            );
            if (!res.ok) return;
            const json = await res.json();
            if (json.success && json.data && json.data.length >= 2) {
              const data = json.data;
              const first = data[0].close;
              const last = data[data.length - 1].close;
              if (first > 0) {
                newReturns[key] = parseFloat((((last - first) / first) * 100).toFixed(2));
                newSeries[key] = data.map((p: any) => ({
                  date: p.date,
                  closeNorm: parseFloat((((p.close - first) / first) * 100).toFixed(2)),
                }));
              }
            }
          } catch {
            // Sessizce yutulur
          }
        })
      );

      if (isMounted) {
        setBenchmarkData(newSeries);
        setBenchmarkReturns(newReturns);
        setLoading(false);
      }
    }

    loadBenchmarks();
    return () => {
      isMounted = false;
    };
  }, [selectedPeriod]);

  // Birleştirilmiş Çizgi Grafik Verisi (Gerçek API Serileri)
  const chartData = useMemo(() => {
    // Referans tarih serisi olarak BIST 100 veya ALTIN serisini al
    const refSeries = benchmarkData.BIST100.length > 0 ? benchmarkData.BIST100 : benchmarkData.ALTIN;
    if (refSeries.length === 0) return [];

    return refSeries.map((item, idx) => {
      const point: any = {
        date: item.date,
        "Portföy Getirisi": parseFloat(totalProfitLossPct.toFixed(2)),
      };

      if (activeBenchmarks.BIST100 && benchmarkData.BIST100[idx]) {
        point["BIST 100"] = benchmarkData.BIST100[idx].closeNorm;
      }
      if (activeBenchmarks.SP500 && benchmarkData.SP500[idx]) {
        point["S&P 500"] = benchmarkData.SP500[idx].closeNorm;
      }
      if (activeBenchmarks.ALTIN && benchmarkData.ALTIN[idx]) {
        point["Gram Altın"] = benchmarkData.ALTIN[idx].closeNorm;
      }
      if (activeBenchmarks.USD && benchmarkData.USD[idx]) {
        point["USD / TRY"] = benchmarkData.USD[idx].closeNorm;
      }

      return point;
    });
  }, [benchmarkData, activeBenchmarks, totalProfitLossPct]);

  // Alpha (BIST'e göre ekstra getiri)
  const bistReturn = benchmarkReturns.BIST100 || 0;
  const alpha = totalProfitLossPct - bistReturn;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-5">
      {/* Başlık & Kontroller */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Piyasa Kıyaslama Motoru (Benchmark Hub)
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Portföyünüzün getirisini BIST 100, S&amp;P 500, Altın ve Dolar ile yarıştırın.
            </p>
          </div>
        </div>

        {/* Periyot Seçici */}
        <div className="flex items-center gap-1 bg-[var(--ink-3)] p-1 rounded-lg border border-[var(--line)]">
          {(["1A", "3A", "6A", "1Y"] as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all font-mono font-medium cursor-pointer ${
                selectedPeriod === p
                  ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                  : "text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark Aç/Kapa Butonları */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-[var(--mist)] mr-1">Karşılaştır:</span>
        {(Object.keys(BENCHMARK_CONFIG) as BenchmarkType[]).map((key) => {
          const cfg = BENCHMARK_CONFIG[key];
          const active = activeBenchmarks[key];
          const ret = benchmarkReturns[key];
          return (
            <button
              key={key}
              onClick={() =>
                setActiveBenchmarks((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                active
                  ? "bg-[var(--ink-3)] border-[var(--brass)] text-[var(--paper)] font-bold shadow-xs"
                  : "bg-[var(--ink)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
              <span>{cfg.label}</span>
              {ret !== null && (
                <span
                  className={`text-[10px] font-bold ${
                    ret >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  ({ret >= 0 ? "+" : ""}
                  {ret}%)
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Çizgi Grafik */}
      <div className="w-full h-72 sm:h-80 bg-[var(--ink-3)] rounded-xl p-3 border border-[var(--line)] relative shadow-inner">
        {loading && (
          <div className="absolute inset-0 bg-[var(--ink)]/70 backdrop-blur-xs flex items-center justify-center z-10 rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--brass)]" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="var(--mist)"
              fontSize={10}
              fontFamily="monospace"
              tickFormatter={(d) => d.slice(5)}
            />
            <YAxis
              stroke="var(--mist)"
              fontSize={10}
              fontFamily="monospace"
              tickFormatter={(v) => `%${v}`}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--ink-2)",
                borderColor: "var(--brass-dim)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--paper)",
                fontFamily: "monospace",
              }}
              formatter={(val: any) => [`%${val}`, ""]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px", fontFamily: "monospace" }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="Portföy Getirisi"
              stroke="var(--brass)"
              strokeWidth={3}
              dot={false}
            />
            {activeBenchmarks.BIST100 && (
              <Line
                type="monotone"
                dataKey="BIST 100"
                stroke={BENCHMARK_CONFIG.BIST100.color}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            )}
            {activeBenchmarks.SP500 && (
              <Line
                type="monotone"
                dataKey="S&P 500"
                stroke={BENCHMARK_CONFIG.SP500.color}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            )}
            {activeBenchmarks.ALTIN && (
              <Line
                type="monotone"
                dataKey="Gram Altın"
                stroke={BENCHMARK_CONFIG.ALTIN.color}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            )}
            {activeBenchmarks.USD && (
              <Line
                type="monotone"
                dataKey="USD / TRY"
                stroke={BENCHMARK_CONFIG.USD.color}
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk & Alpha Metrik Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 bg-[var(--ink)]/50 border border-[var(--line)] rounded-lg">
          <div className="flex items-center gap-1.5 text-[var(--muted)] text-xs mb-1">
            <Zap className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>Alfa (vs BIST)</span>
          </div>
          <p
            className={`font-mono text-base font-bold ${
              alpha >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {alpha >= 0 ? "+" : ""}
            {alpha.toFixed(2)}%
          </p>
          <span className="text-[10px] text-[var(--muted)]">Piyasaya karşı net fark</span>
        </div>

        <div className="p-3 bg-[var(--ink)]/50 border border-[var(--line)] rounded-lg">
          <div className="flex items-center gap-1.5 text-[var(--muted)] text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>BIST 100 ({selectedPeriod})</span>
          </div>
          <p
            className={`font-mono text-base font-bold ${
              (benchmarkReturns.BIST100 || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {(benchmarkReturns.BIST100 || 0) >= 0 ? "+" : ""}
            {(benchmarkReturns.BIST100 || 0).toFixed(2)}%
          </p>
          <span className="text-[10px] text-[var(--muted)]">Borsa İstanbul Endeksi</span>
        </div>

        <div className="p-3 bg-[var(--ink)]/50 border border-[var(--line)] rounded-lg">
          <div className="flex items-center gap-1.5 text-[var(--muted)] text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Gram Altın ({selectedPeriod})</span>
          </div>
          <p
            className={`font-mono text-base font-bold ${
              (benchmarkReturns.ALTIN || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {(benchmarkReturns.ALTIN || 0) >= 0 ? "+" : ""}
            {(benchmarkReturns.ALTIN || 0).toFixed(2)}%
          </p>
          <span className="text-[10px] text-[var(--muted)]">Ons / Gram Altın Değişimi</span>
        </div>

        <div className="p-3 bg-[var(--ink)]/50 border border-[var(--line)] rounded-lg">
          <div className="flex items-center gap-1.5 text-[var(--muted)] text-xs mb-1">
            <Percent className="w-3.5 h-3.5 text-cyan-400" />
            <span>USD / TRY ({selectedPeriod})</span>
          </div>
          <p
            className={`font-mono text-base font-bold ${
              (benchmarkReturns.USD || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {(benchmarkReturns.USD || 0) >= 0 ? "+" : ""}
            {(benchmarkReturns.USD || 0).toFixed(2)}%
          </p>
          <span className="text-[10px] text-[var(--muted)]">Dolar / TL Kuru Değişimi</span>
        </div>
      </div>
    </div>
  );
}
