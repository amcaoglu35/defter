"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ColorType,
  CandlestickData,
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  HistogramData,
  Time,
} from "lightweight-charts";
import { BarChart3, TrendingUp } from "lucide-react";

export interface ChartHistoryPoint {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface TradingViewChartProps {
  data: ChartHistoryPoint[];
  symbol: string;
  currency?: string;
  period: "1A" | "3A" | "6A" | "1Y";
  onPeriodChange: (p: "1A" | "3A" | "6A" | "1Y") => void;
  loading?: boolean;
}

export function TradingViewChart({
  data,
  symbol,
  currency = "₺",
  period,
  onPeriodChange,
  loading = false,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [chartType, setChartType] = useState<"area" | "candle">("area");
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    price: number;
    change?: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const isPositive = data.length >= 2 && data[data.length - 1].close >= data[0].close;
    const accentColor = isPositive ? "#10b981" : "#ef4444";
    const topGradient = isPositive ? "rgba(16, 185, 129, 0.28)" : "rgba(239, 68, 68, 0.28)";

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 320,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(51, 65, 85, 0.4)", style: 2 },
        horzLines: { color: "rgba(51, 65, 85, 0.4)", style: 2 },
      },
      crosshair: {
        vertLine: { color: "#c5a059", width: 1, style: 3, labelBackgroundColor: "#1e293b" },
        horzLine: { color: "#c5a059", width: 1, style: 3, labelBackgroundColor: "#1e293b" },
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#334155",
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
    });

    chartRef.current = chart;

    if (chartType === "area") {
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: accentColor,
        topColor: topGradient,
        bottomColor: "rgba(15, 23, 42, 0.0)",
        lineWidth: 2,
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
      });

      const areaData = data.map((d) => ({
        time: d.date as Time,
        value: d.close,
      }));

      areaSeries.setData(areaData);
    } else {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderUpColor: "#10b981",
        borderDownColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
      });

      const candleData: CandlestickData<Time>[] = data
        .filter((d) => d.open != null && d.high != null && d.low != null)
        .map((d) => ({
          time: d.date as Time,
          open: d.open!,
          high: d.high!,
          low: d.low!,
          close: d.close,
        }));

      if (candleData.length > 0) {
        candleSeries.setData(candleData);
      }
    }

    // Add Volume series if available
    const hasVolume = data.some((d) => d.volume && d.volume > 0);
    if (hasVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: "rgba(100, 116, 139, 0.35)",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "", // overlay on separate invisible scale
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData: HistogramData<Time>[] = data
        .filter((d) => d.volume != null)
        .map((d) => ({
          time: d.date as Time,
          value: d.volume!,
          color: (d.open != null ? d.close >= d.open : isPositive)
            ? "rgba(16, 185, 129, 0.3)"
            : "rgba(239, 68, 68, 0.3)",
        }));

      volumeSeries.setData(volumeData);
    }

    chart.timeScale().fitContent();

    // Crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setHoveredPoint(null);
        return;
      }
      const rawTime = param.time as string;
      const point = data.find((d) => d.date === rawTime);
      if (point) {
        const base = data[0].close;
        const change = base > 0 ? ((point.close - base) / base) * 100 : 0;
        setHoveredPoint({
          date: point.date,
          price: point.close,
          change: Number(change.toFixed(2)),
        });
      }
    });

    // Resize observer
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, chartType]);

  const periods: Array<"1A" | "3A" | "6A" | "1Y"> = ["1A", "3A", "6A", "1Y"];

  const latestPrice = data && data.length > 0 ? data[data.length - 1].close : 0;
  const firstPrice = data && data.length > 0 ? data[0].close : 0;
  const overallChange = firstPrice > 0 ? ((latestPrice - firstPrice) / firstPrice) * 100 : 0;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-[var(--paper)]">
                {hoveredPoint ? `${hoveredPoint.price.toLocaleString("tr-TR")} ${currency}` : `${latestPrice.toLocaleString("tr-TR")} ${currency}`}
              </span>
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  (hoveredPoint?.change ?? overallChange) >= 0
                    ? "bg-[rgba(16,185,129,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)]/30"
                    : "bg-[rgba(239,68,68,0.15)] text-[var(--loss)] border border-[var(--loss)]/30"
                }`}
              >
                {(hoveredPoint?.change ?? overallChange) >= 0 ? "+" : ""}
                {(hoveredPoint?.change ?? overallChange).toFixed(2)}%
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--mist)] block">
              {hoveredPoint ? `Tarih: ${hoveredPoint.date}` : `Dönem: ${period} Değişimi (${symbol})`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-[var(--ink-3)] p-0.5 rounded-lg border border-[var(--line)]">
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                chartType === "area"
                  ? "bg-[var(--brass)] text-[var(--ink)] shadow"
                  : "text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
              title="Alan Grafiği"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartType("candle")}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                chartType === "candle"
                  ? "bg-[var(--brass)] text-[var(--ink)] shadow"
                  : "text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
              title="Mum (Candlestick) Grafiği"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-[var(--ink-3)] p-1 rounded-lg border border-[var(--line)]">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  period === p
                    ? "bg-[var(--brass)] text-[var(--ink)] shadow"
                    : "text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[var(--ink-2)]/70 backdrop-blur-[2px] flex items-center justify-center font-mono text-xs text-[var(--brass)] animate-pulse">
            Grafik verileri yükleniyor...
          </div>
        )}
        <div ref={containerRef} className="w-full h-[320px]" />
      </div>

      {/* TradingView Lightweight Charts Apache 2.0 Attribution Notice */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--mist)] border-t border-dashed border-[var(--line)] pt-2">
        <span>Canlı piyasa ve geçmiş fiyat verileri</span>
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--brass)] transition-colors hover:underline"
        >
          Powered by TradingView Lightweight Charts™
        </a>
      </div>
    </div>
  );
}
