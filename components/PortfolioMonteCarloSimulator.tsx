"use client";

import React, { useState, useMemo } from "react";
import { Dices, TrendingUp, ShieldAlert, Sparkles, Sliders, DollarSign, Calendar, HelpCircle } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { runMonteCarloSimulation, MonteCarloSimulationPoint } from "@/lib/quantEngine";
import FormulaInfoModal from "@/components/FormulaInfoModal";

interface PortfolioMonteCarloSimulatorProps {
  totalValue: number;
  totalProfitLossPct: number;
  annualizedVolatility: number;
}

export default function PortfolioMonteCarloSimulator({
  totalValue,
  totalProfitLossPct,
  annualizedVolatility,
}: PortfolioMonteCarloSimulatorProps) {
  const [horizonMonths, setHorizonMonths] = useState<number>(36);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const simulationData: MonteCarloSimulationPoint[] = useMemo(() => {
    return runMonteCarloSimulation(
      totalValue,
      Math.max(12, totalProfitLossPct),
      Math.max(15, annualizedVolatility),
      horizonMonths
    );
  }, [totalValue, totalProfitLossPct, annualizedVolatility, horizonMonths]);

  const lastPoint = simulationData[simulationData.length - 1] || {
    p5Worst: totalValue,
    p50Median: totalValue,
    p95Best: totalValue,
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-5 relative">
      {/* Başlık ve Süre Seçici */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-xs">
            <Dices className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)] flex items-center gap-2">
              <span>Monte Carlo Portföy Gelecek Simülatörü</span>
              <button
                onClick={() => setIsInfoOpen(true)}
                className="text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
                title="Formül Açıklaması & Rehber"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Geometrik Brown Hareketi ve volatilite matrisi ile portföyünüzün muhtemel gelecek patikaları.
            </p>
          </div>
        </div>

        {/* Simülasyon Vadesi Butonları */}
        <div className="flex items-center gap-1.5 bg-[var(--ink-3)] p-1 rounded-lg border border-[var(--line)] text-xs font-mono">
          <button
            onClick={() => setHorizonMonths(12)}
            className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
              horizonMonths === 12
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            1 Yıl (12 Ay)
          </button>
          <button
            onClick={() => setHorizonMonths(36)}
            className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
              horizonMonths === 36
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            3 Yıl (36 Ay)
          </button>
          <button
            onClick={() => setHorizonMonths(60)}
            className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
              horizonMonths === 60
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
          >
            5 Yıl (60 Ay)
          </button>
        </div>
      </div>

      {/* 3 Büyük Sonuç Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-3.5 bg-[var(--ink-3)] border border-rose-600/30 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-rose-400 block">
            %5 Kriz Tabanı (En Kötü Senaryo)
          </span>
          <p className="font-mono text-xl font-bold text-rose-400">
            {lastPoint.p5Worst.toLocaleString("tr-TR")} ₺
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Aşırı sert ayı piyasasında beklenen asgari bakiye
          </span>
        </div>

        <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-[var(--brass)] block">
            %50 Medyan (En Olası Gelecek)
          </span>
          <p className="font-mono text-xl font-bold text-[var(--paper)]">
            {lastPoint.p50Median.toLocaleString("tr-TR")} ₺
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Mevcut getiri/risk hızıyla beklenen merkez değer
          </span>
        </div>

        <div className="p-3.5 bg-[var(--ink-3)] border border-emerald-600/30 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 block">
            %95 Boğa Tavanı (En İyimser Senaryo)
          </span>
          <p className="font-mono text-xl font-bold text-emerald-400">
            {lastPoint.p95Best.toLocaleString("tr-TR")} ₺
          </p>
          <span className="text-[10px] font-mono text-[var(--mist)] block">
            Kuvvetli ralli döngüsünde ulaşılabilecek potansiyel
          </span>
        </div>
      </div>

      {/* Recharts Monte Carlo Güven Aralığı Alan Grafiği */}
      <div className="w-full h-80 bg-[var(--ink-3)] rounded-xl p-3 border border-[var(--line)] shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={simulationData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" opacity={0.4} />
            <XAxis
              dataKey="month"
              stroke="var(--mist)"
              fontSize={10}
              fontFamily="monospace"
              tickFormatter={(m) => `${m}. Ay`}
            />
            <YAxis
              stroke="var(--mist)"
              fontSize={10}
              fontFamily="monospace"
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k ₺`}
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
              formatter={(val: any) => [`${Number(val).toLocaleString("tr-TR")} ₺`, ""]}
              labelFormatter={(m) => `${m}. Ay Simülasyonu`}
            />
            <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
            <Area
              type="monotone"
              name="%95 Boğa Tavanı"
              dataKey="p95Best"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorBest)"
            />
            <Area
              type="monotone"
              name="%50 Medyan Beklenti"
              dataKey="p50Median"
              stroke="#C9A24B"
              strokeWidth={2.5}
              fill="none"
            />
            <Area
              type="monotone"
              name="%5 Kriz Tabanı"
              dataKey="p5Worst"
              stroke="#f43f5e"
              fillOpacity={1}
              fill="url(#colorWorst)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FORMÜL BİLGİ MODALI */}
      <FormulaInfoModal
        formulaKey={isInfoOpen ? "monteCarlo" : null}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}
