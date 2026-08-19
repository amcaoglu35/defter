"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { TrendingUp, Trophy, Activity, Award, AlertCircle, Loader2 } from "lucide-react";
import { Basket } from "@/lib/mockData";

interface BasketBenchmarkComparisonProps {
  basket: Basket;
}

type BenchmarkType = "BIST100" | "ALTIN" | "USD";
type PeriodType = "1A" | "3A" | "6A" | "1Y";

const BENCHMARK_LABELS: Record<BenchmarkType, string> = {
  BIST100: "BIST 100 Endeksi",
  ALTIN: "Gram Altın (TL)",
  USD: "USD / TRY Kuru",
};

// Yahoo Finance sembol eşlemeleri (liveSymbols.ts ile tutarlı)
const BENCHMARK_YAHOO_SYMBOLS: Record<BenchmarkType, string> = {
  BIST100: "XU100.IS",
  ALTIN: "GC=F",   // Ons altın spot — /api/prices/history'de USD/TRY ile çarpılır
  USD: "USDTRY=X",
};

interface HistoryPoint {
  date: string;
  close: number;
}

interface BenchmarkState {
  loading: boolean;
  error: string | null;
  returnPct: number | null;
  chartPoints: Array<{ date: string; closeNorm: number }>;
}

const EMPTY_BENCHMARK: BenchmarkState = {
  loading: false,
  error: null,
  returnPct: null,
  chartPoints: [],
};

/**
 * Gerçek tarihsel fiyat serisini çeker ve normalize edilmiş
 * (100 = başlangıç) return serisi döndürür.
 */
async function fetchBenchmarkHistory(
  symbol: string,
  period: PeriodType
): Promise<{ returnPct: number; chartPoints: Array<{ date: string; closeNorm: number }> }> {
  const res = await fetch(
    `/api/prices/history?symbol=${encodeURIComponent(symbol)}&period=${period}`
  );

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(
      (json as { error?: string }).error || `HTTP ${res.status}`
    );
  }

  const json = (await res.json()) as {
    success: boolean;
    data?: HistoryPoint[];
    error?: string;
  };

  if (!json.success || !json.data || json.data.length < 2) {
    throw new Error(json.error || "Yeterli veri yok");
  }

  const data = json.data;
  const firstClose = data[0].close;
  if (firstClose <= 0) throw new Error("Geçersiz fiyat verisi");

  const lastClose = data[data.length - 1].close;
  const returnPct = ((lastClose - firstClose) / firstClose) * 100;

  // Normalize: başlangıç = 0%, kullanıcıya % kazanç/kayıp göster
  const chartPoints = data.map((p) => ({
    date: p.date,
    closeNorm: parseFloat((((p.close - firstClose) / firstClose) * 100).toFixed(2)),
  }));

  return { returnPct: parseFloat(returnPct.toFixed(2)), chartPoints };
}

/**
 * Portföyün tarihsel değer serisini tutarlı tarih eksenine sığdırır.
 * Şu an basket.totalProfitPercent tek nokta olduğundan,
 * gerçek equity curve gelene kadar portfolyo için flat proxy kullanılır.
 * Bu durum kullanıcıya açıkça gösterilir.
 */
function buildPortfolioSeries(
  totalProfitPct: number,
  benchmarkPoints: Array<{ date: string; closeNorm: number }>
): Array<{ date: string; closeNorm: number }> {
  if (benchmarkPoints.length < 2) return [];
  // Portföyün zaman serisi henüz yok; başlangıç ve bitiş noktaları lineer interpolasyon
  const n = benchmarkPoints.length;
  return benchmarkPoints.map((p, i) => ({
    date: p.date,
    closeNorm: parseFloat(((totalProfitPct * i) / (n - 1)).toFixed(2)),
  }));
}

export function BasketBenchmarkComparison({ basket }: BasketBenchmarkComparisonProps) {
  const [benchmark, setBenchmark] = useState<BenchmarkType>("BIST100");
  const [period, setPeriod] = useState<PeriodType>("6A");
  const [benchState, setBenchState] = useState<BenchmarkState>(EMPTY_BENCHMARK);

  const fetchBenchmark = useCallback(
    async (bm: BenchmarkType, p: PeriodType) => {
      setBenchState({ loading: true, error: null, returnPct: null, chartPoints: [] });
      try {
        const symbol = BENCHMARK_YAHOO_SYMBOLS[bm];
        const result = await fetchBenchmarkHistory(symbol, p);
        setBenchState({
          loading: false,
          error: null,
          returnPct: result.returnPct,
          chartPoints: result.chartPoints,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Veri alınamadı";
        setBenchState({ loading: false, error: message, returnPct: null, chartPoints: [] });
      }
    },
    []
  );

  useEffect(() => {
    fetchBenchmark(benchmark, period);
  }, [benchmark, period, fetchBenchmark]);

  const comparisonData = useMemo(() => {
    const totalProfitPct = basket.totalProfitPercent ?? 0;
    const { returnPct: benchReturnPct, chartPoints } = benchState;

    if (benchReturnPct === null || chartPoints.length < 2) {
      return null;
    }

    const portfolioSeries = buildPortfolioSeries(totalProfitPct, chartPoints);
    const alphaPct = parseFloat((totalProfitPct - benchReturnPct).toFixed(2));

    // Recharts için birleşik veri seti
    const chartData = portfolioSeries.map((p, i) => ({
      date: p.date,
      [basket.name]: p.closeNorm,
      [BENCHMARK_LABELS[benchmark]]: chartPoints[i]?.closeNorm ?? 0,
    }));

    return {
      chartData,
      alphaPct,
      isBeatingBenchmark: alphaPct >= 0,
      benchReturnPct,
      basketReturnPct: totalProfitPct,
    };
  }, [basket, benchmark, benchState]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const renderDataQualityWarning = () => (
    <div className="mt-2 flex items-start gap-2 text-[10px] text-[var(--mist)] bg-[var(--ink-3)] border border-[var(--line)] rounded p-2">
      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
      <span>
        <span className="font-semibold text-amber-300">Dikkat:</span>{" "}
        Portföy getiri serisi henüz zaman bazlı değil. Sepet getirisi ({(basket.totalProfitPercent ?? 0).toFixed(1)}%),
        alış tarihinden bugüne kadar doğrusal hesaplanmaktadır. Gerçek equity curve için
        işlem geçmişine dayalı günlük portföy değerlemesi gereklidir (Faz 3).
      </span>
    </div>
  );

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
              📈 Sepet vs Gösterge Kıyaslaması
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Gerçek piyasa verisi — {BENCHMARK_LABELS[benchmark]}
            </p>
          </div>
        </div>

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

      {/* Loading State */}
      {benchState.loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-[var(--mist)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{BENCHMARK_LABELS[benchmark]} gerçek verisi yükleniyor…</span>
        </div>
      )}

      {/* Error State — açık ve kullanıcıya görünen */}
      {!benchState.loading && benchState.error && (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <AlertCircle className="w-6 h-6 text-amber-400" />
          <div>
            <p className="text-[var(--paper)] font-semibold text-sm">
              Benchmark Verisi Alınamadı
            </p>
            <p className="text-[10px] text-[var(--mist)] mt-1">
              {benchState.error}
            </p>
            <p className="text-[10px] text-[var(--mist)] mt-1">
              Kaynak: {BENCHMARK_YAHOO_SYMBOLS[benchmark]} (Yahoo Finance)
            </p>
          </div>
          <button
            onClick={() => fetchBenchmark(benchmark, period)}
            className="text-[10px] underline text-[var(--brass)] hover:text-[var(--paper)] cursor-pointer transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Başarılı Karşılaştırma */}
      {!benchState.loading && !benchState.error && comparisonData && (
        <>
          {/* Alpha Verdict Banner */}
          <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Award
                className={`w-5 h-5 ${
                  comparisonData.isBeatingBenchmark
                    ? "text-[var(--verdigris)]"
                    : "text-[var(--loss)]"
                }`}
              />
              <div>
                <span className="text-[11px] text-[var(--paper)] font-bold block">
                  {comparisonData.isBeatingBenchmark
                    ? `🚀 Piyasayı Yendi! Alfa (Excess Return): +%${comparisonData.alphaPct}`
                    : `⚠️ Endeksin Gerisinde Kaldı: %${comparisonData.alphaPct}`}
                </span>
                <span className="text-[10px] text-[var(--mist)] block">
                  Sepet Getirisi: %{comparisonData.basketReturnPct.toFixed(1)} &nbsp;|&nbsp;{" "}
                  {BENCHMARK_LABELS[benchmark]} ({period}): %{comparisonData.benchReturnPct.toFixed(1)}
                  &nbsp;— Gerçek Piyasa Verisi
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded text-xs font-bold border ${
                comparisonData.isBeatingBenchmark
                  ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                  : "bg-[rgba(201,124,124,0.15)] text-[var(--loss)] border-[var(--loss)]"
              }`}
            >
              {comparisonData.isBeatingBenchmark
                ? `+%${comparisonData.alphaPct} Pozitif Alfa`
                : `%${comparisonData.alphaPct} Negatif Alfa`}
            </span>
          </div>

          {/* Recharts Dual Line Chart */}
          <div className="w-full h-60 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--mist)"
                  fontSize={9}
                  tickFormatter={(d: string | number | undefined): string => {
                    const s = String(d ?? "");
                    const parts = s.split("-");
                    return parts.length >= 2 ? `${parts[2]}.${parts[1]}` : s;
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="var(--mist)"
                  fontSize={10}
                  unit="%"
                  tickFormatter={(v: number) => v.toFixed(0)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--ink-3)",
                    borderColor: "var(--line)",
                    borderRadius: "0.5rem",
                    fontSize: "11px",
                    color: "var(--paper)",
                  }}
                  formatter={(value: unknown, name: unknown) => [
                    `%${Number(value).toFixed(2)}`,
                    String(name),
                  ] as [string, string]}
                  labelFormatter={(label: unknown) => `Tarih: ${String(label)}`}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)" }} />
                <Line
                  type="monotone"
                  dataKey={basket.name}
                  stroke="var(--verdigris)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey={BENCHMARK_LABELS[benchmark]}
                  stroke="var(--brass)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Veri kalitesi uyarısı — portföy serisi henüz gerçek değil */}
          {renderDataQualityWarning()}

          {/* Kaynak bilgisi */}
          <div className="flex items-center gap-1.5 text-[9px] text-[var(--mist)] pt-1">
            <Activity className="w-3 h-3 text-[var(--verdigris)]" />
            <span>
              Benchmark kaynağı: {BENCHMARK_YAHOO_SYMBOLS[benchmark]} (Yahoo Finance) &nbsp;·&nbsp; {period} dönem &nbsp;·&nbsp; Statik veri değil
            </span>
          </div>
        </>
      )}
    </div>
  );
}
