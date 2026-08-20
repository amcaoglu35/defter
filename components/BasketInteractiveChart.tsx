"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
} from "lucide-react";
import { Basket } from "@/lib/mockData";
import { HistoricalPricePoint } from "@/lib/riskEngine";
import { useDefterStore } from "@/lib/store";

export type ChartPeriod = "1A" | "3A" | "6A" | "1Y";

interface BasketInteractiveChartProps {
  basket: Basket;
  portfolioPriceSeries: HistoricalPricePoint[];
  benchmarkPriceSeries: HistoricalPricePoint[];
  isLoading: boolean;
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
}

export function BasketInteractiveChart({
  basket,
  portfolioPriceSeries,
  benchmarkPriceSeries,
  isLoading,
  period,
  onPeriodChange,
}: BasketInteractiveChartProps) {
  const { isPrivacyMode } = useDefterStore();
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [activePoint, setActivePoint] = useState<{
    date: string;
    value: number;
    returnPct: number;
    benchmarkReturnPct?: number;
  } | null>(null);

  // Recharts için birleşik ve normalize edilmiş veri seti
  const formattedData = useMemo(() => {
    if (!portfolioPriceSeries || portfolioPriceSeries.length < 2) return [];

    const totalVal = basket.totalValue || 0;
    const initialPortfolioClose = portfolioPriceSeries[0]?.close || 100;
    const lastPortfolioClose = portfolioPriceSeries[portfolioPriceSeries.length - 1]?.close || 100;
    const valueScale = lastPortfolioClose > 0 ? totalVal / lastPortfolioClose : 1;

    const initialBenchClose = benchmarkPriceSeries[0]?.close || 1;

    return portfolioPriceSeries.map((pt, idx) => {
      const portValue = Math.round(pt.close * valueScale);
      const portReturnPct = initialPortfolioClose > 0
        ? Number((((pt.close - initialPortfolioClose) / initialPortfolioClose) * 100).toFixed(2))
        : 0;

      // Eşleşen benchmark noktası
      const benchPt = benchmarkPriceSeries.find((b) => b.date === pt.date) || benchmarkPriceSeries[idx];
      let benchReturnPct: number | undefined = undefined;
      if (benchPt && initialBenchClose > 0) {
        benchReturnPct = Number((((benchPt.close - initialBenchClose) / initialBenchClose) * 100).toFixed(2));
      }

      const d = new Date(pt.date);
      const formattedDate = isNaN(d.getTime())
        ? pt.date
        : d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });

      return {
        rawDate: pt.date,
        displayDate: formattedDate,
        fullDate: isNaN(d.getTime()) ? pt.date : d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
        value: portValue,
        returnPct: portReturnPct,
        benchmarkReturnPct: benchReturnPct,
      };
    });
  }, [portfolioPriceSeries, benchmarkPriceSeries, basket.totalValue]);

  // Dönem Sonu İstatistikleri
  const stats = useMemo(() => {
    if (formattedData.length < 2) {
      return {
        periodReturn: basket.totalProfitPercent,
        minVal: basket.totalValue,
        maxVal: basket.totalValue,
        startVal: basket.totalValue,
        currentVal: basket.totalValue,
      };
    }

    const start = formattedData[0].value;
    const current = formattedData[formattedData.length - 1].value;
    const periodReturn = Number((((current - start) / (start || 1)) * 100).toFixed(2));

    const allValues = formattedData.map((d) => d.value);
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);

    return {
      periodReturn,
      minVal,
      maxVal,
      startVal: start,
      currentVal: current,
    };
  }, [formattedData, basket]);

  const isPositive = (activePoint?.returnPct ?? stats.periodReturn) >= 0;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[var(--paper)]">
              Sepet Performans &amp; Değer Eğrisi
            </h3>
            <span
              className="inline-flex items-center gap-1 font-mono text-[10px] bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--brass-dim)] px-2 py-0.5 rounded"
              title="Grafik, sepetinizdeki varlıkların BIST ve küresel piyasalardaki gerçek kapanış fiyat geçmişini yansıtır."
            >
              <Sparkles className="w-3 h-3 text-[var(--brass)]" />
              <span>Canlı Piyasa Ağırlıklı</span>
            </span>
          </div>

          {/* Interactive Dynamic Value readout */}
          <div className="flex items-baseline gap-3 mt-1.5 font-mono">
            <span className="text-2xl font-bold text-[var(--paper)]">
              {isPrivacyMode
                ? "•••••• ₺"
                : `${(activePoint ? activePoint.value : stats.currentVal).toLocaleString("tr-TR")} ₺`}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                isPositive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>
                {isPositive ? "+" : ""}
                {activePoint ? activePoint.returnPct : stats.periodReturn}%
              </span>
            </span>
            <span className="text-[11px] text-[var(--mist)]">
              {activePoint ? activePoint.date : `${period} Dönem Getirisi`}
            </span>
          </div>
        </div>

        {/* Right Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Benchmark Toggle Button */}
          <button
            type="button"
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
              showBenchmark
                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold"
                : "bg-[var(--ink-3)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
            title="BIST 100 Endeksini grafiğe ekle/kaldır"
          >
            <span className={`w-2 h-2 rounded-full ${showBenchmark ? "bg-cyan-400" : "bg-zinc-600"}`} />
            <span>BIST 100 Kıyası</span>
          </button>

          {/* Period Selector */}
          <div className="flex gap-1 bg-[var(--ink-3)] p-1 rounded-lg border border-[var(--line)] font-mono text-xs">
            {(["1A", "3A", "6A", "1Y"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  period === p
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                    : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-2)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 sm:h-72 w-full relative">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-[var(--mist)] font-mono text-xs bg-[var(--ink-3)]/30 rounded-xl">
            <div className="w-6 h-6 border-2 border-[var(--brass)] border-t-transparent rounded-full animate-spin" />
            <span>Sepet Tarihsel Fiyat Verileri Hesaplanıyor...</span>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--mist)] font-mono text-xs text-center p-6 bg-[var(--ink-3)]/30 rounded-xl border border-dashed border-[var(--line)]">
            <Layers className="w-8 h-8 text-[var(--brass)]/50 mb-2" />
            <span className="font-bold text-[var(--paper)]">Grafik Verisi Bekleniyor</span>
            <p className="text-[11px] text-[var(--mist)] max-w-sm mt-1">
              Sepetinizdeki varlıkların geçmiş fiyatları çekilerek ağırlıklı getiri eğrisi oluşturulacaktır.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onMouseMove={(e: any) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  const data = e.activePayload[0].payload;
                  setActivePoint({
                    date: data.fullDate,
                    value: data.value,
                    returnPct: data.returnPct,
                    benchmarkReturnPct: data.benchmarkReturnPct,
                  });
                }
              }}
              onMouseLeave={() => setActivePoint(null)}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  const data = e.activePayload[0].payload;
                  setActivePoint({
                    date: data.fullDate,
                    value: data.value,
                    returnPct: data.returnPct,
                    benchmarkReturnPct: data.benchmarkReturnPct,
                  });
                }
              }}
            >
              <defs>
                <linearGradient id="basketAreaGradient" x1="0" y1="0" x2="0" y2="100%">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "#5B8C7B" : "#C97C7C"}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "#5B8C7B" : "#C97C7C"}
                    stopOpacity={0.0}
                  />
                </linearGradient>
                <linearGradient id="benchAreaGradient" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />

              <XAxis
                dataKey="displayDate"
                stroke="var(--mist)"
                tick={{ fontSize: 10, fontFamily: "monospace", fill: "var(--mist)" }}
                axisLine={false}
                tickLine={false}
                minTickGap={25}
              />

              <YAxis
                stroke="var(--mist)"
                tick={{ fontSize: 10, fontFamily: "monospace", fill: "var(--mist)" }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 100", "dataMax + 100"]}
                tickFormatter={(val) => isPrivacyMode ? "••••" : `${(val / 1000).toFixed(0)}k ₺`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-[var(--ink-3)] border border-[var(--brass-dim)] shadow-2xl font-mono text-xs space-y-1.5">
                        <div className="text-[11px] text-[var(--mist)] font-sans border-b border-[var(--line)] pb-1">
                          📅 {d.fullDate}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[var(--paper)] font-bold">Sepet Değeri:</span>
                          <span className="text-[var(--brass)] font-bold">
                            {isPrivacyMode ? "•••••• ₺" : `${d.value.toLocaleString("tr-TR")} ₺`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[var(--mist)]">Dönem Getirisi:</span>
                          <span className={d.returnPct >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            %{d.returnPct >= 0 ? `+${d.returnPct}` : d.returnPct}
                          </span>
                        </div>
                        {d.benchmarkReturnPct !== undefined && showBenchmark && (
                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--line)]">
                            <span className="text-cyan-400">BIST 100:</span>
                            <span className="text-cyan-300 font-bold">
                              %{d.benchmarkReturnPct >= 0 ? `+${d.benchmarkReturnPct}` : d.benchmarkReturnPct}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* BIST 100 Karşılaştırma Çizgisi */}
              {showBenchmark && (
                <Area
                  type="monotone"
                  dataKey="benchmarkReturnPct"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#benchAreaGradient)"
                  name="BIST 100"
                />
              )}

              {/* Sepet Ana Değer Eğrisi */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#5B8C7B" : "#C97C7C"}
                strokeWidth={2.5}
                fill="url(#basketAreaGradient)"
                name="Sepet Değeri"
                activeDot={{ r: 6, fill: "#C9A24B", stroke: "var(--ink)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* KPI Stats Bar (Min, Max, Return) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[var(--line)] font-mono text-xs">
        <div className="p-2.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Başı Değer</span>
          <span className="text-xs font-bold text-[var(--paper)]">
            {isPrivacyMode ? "•••••• ₺" : `${stats.startVal.toLocaleString("tr-TR")} ₺`}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">En Yüksek (Zirve)</span>
          <span className="text-xs font-bold text-emerald-400">
            {isPrivacyMode ? "•••••• ₺" : `${stats.maxVal.toLocaleString("tr-TR")} ₺`}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">En Düşük (Dip)</span>
          <span className="text-xs font-bold text-rose-400">
            {isPrivacyMode ? "•••••• ₺" : `${stats.minVal.toLocaleString("tr-TR")} ₺`}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--mist)] uppercase block">Dönem Getirisi</span>
          <span className={`text-xs font-bold ${stats.periodReturn >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            %{stats.periodReturn >= 0 ? `+${stats.periodReturn}` : stats.periodReturn}
          </span>
        </div>
      </div>
    </div>
  );
}
