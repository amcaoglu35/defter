"use client";

import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  ShieldAlert,
  Percent,
  Activity,
  Award,
  Zap,
  Info,
  Sliders,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { PortfolioAssetHolding } from "@/lib/portfolioIntelligence";
import {
  calculatePortfolioRiskMetrics,
  generateEfficientFrontier,
} from "@/lib/quantEngine";

interface PortfolioQuantLabProps {
  holdings: PortfolioAssetHolding[];
  totalValue: number;
  totalProfitLossPct: number;
}

export default function PortfolioQuantLab({
  holdings,
  totalValue,
  totalProfitLossPct,
}: PortfolioQuantLabProps) {
  const [riskFreeRate, setRiskFreeRate] = useState<number>(42.0); // TCMB Mevduat/Faiz Oranı (%)

  const quantAssets = useMemo(() => {
    return holdings.map((h) => ({
      symbol: h.symbol,
      name: h.name,
      category: h.category,
      sector: h.sector,
      totalCurrentValue: h.totalCurrentValue,
      weightPct: h.weightPct,
      unrealizedProfitLossPct: h.unrealizedProfitLossPct,
      currency: h.currency,
      dailyChangePct: h.change24h,
    }));
  }, [holdings]);

  const riskMetrics = useMemo(() => {
    return calculatePortfolioRiskMetrics(
      quantAssets,
      totalValue,
      totalProfitLossPct,
      28.5,
      riskFreeRate
    );
  }, [quantAssets, totalValue, totalProfitLossPct, riskFreeRate]);

  const frontierPoints = useMemo(() => {
    return generateEfficientFrontier(
      quantAssets,
      riskMetrics.annualizedVolatility,
      Math.max(10, totalProfitLossPct)
    );
  }, [quantAssets, riskMetrics.annualizedVolatility, totalProfitLossPct]);

  return (
    <div className="space-y-6">
      {/* 1. ÜST RİSK & METRİK ŞERİDİ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Sharpe Oranı */}
        <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--mist)]">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[var(--brass)]" />
              Sharpe Rasyosu
            </span>
            <span className="text-[10px] text-[var(--mist)]">Rf: %{riskFreeRate}</span>
          </div>
          <p
            className={`font-serif font-bold text-2xl ${
              riskMetrics.sharpeRatio >= 1.0
                ? "text-emerald-400"
                : riskMetrics.sharpeRatio >= 0
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {riskMetrics.sharpeRatio.toFixed(2)}
          </p>
          <span className="text-[11px] font-mono text-[var(--mist)] block">
            {riskMetrics.sharpeRatio >= 1.5
              ? "💎 Mükemmel Risk-Getiri Verimi"
              : riskMetrics.sharpeRatio >= 0.5
              ? "⚖️ Dengeli Getiri / Risk"
              : "⚠️ Faiz Altı / Yüksek Volatilite"}
          </span>
        </div>

        {/* Sortino Oranı */}
        <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--mist)]">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Sortino Rasyosu</span>
          </div>
          <p
            className={`font-serif font-bold text-2xl ${
              riskMetrics.sortinoRatio >= 1.0
                ? "text-emerald-400"
                : riskMetrics.sortinoRatio >= 0
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {riskMetrics.sortinoRatio.toFixed(2)}
          </p>
          <span className="text-[11px] font-mono text-[var(--mist)] block">
            Zarar Yönlü Dalgalanma Koruması
          </span>
        </div>

        {/* Portföy Betası */}
        <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--mist)]">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Portföy Betası (β)</span>
          </div>
          <p className="font-serif font-bold text-2xl text-[var(--paper)]">
            {riskMetrics.portfolioBeta.toFixed(2)}
          </p>
          <span className="text-[11px] font-mono text-[var(--mist)] block">
            {riskMetrics.portfolioBeta > 1.15
              ? "🔥 BIST'ten Daha Agresif / Hareketli"
              : riskMetrics.portfolioBeta < 0.85
              ? "🛡️ Defansif / Piyasa Altı Salınım"
              : "⚖️ BIST 100 ile Birebir Paralel"}
          </span>
        </div>

        {/* Jensen Alfası */}
        <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--mist)]">
            <Percent className="w-4 h-4 text-emerald-400" />
            <span>Jensen Alfası (α)</span>
          </div>
          <p
            className={`font-serif font-bold text-2xl ${
              riskMetrics.jensenAlpha >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {riskMetrics.jensenAlpha >= 0 ? "+" : ""}
            {riskMetrics.jensenAlpha.toFixed(2)}%
          </p>
          <span className="text-[11px] font-mono text-[var(--mist)] block">
            Piyasa Modeli Üzeri Net Katma Değer
          </span>
        </div>
      </div>

      {/* 2. KUYRUK RİSKİ & VaR (VALUE AT RISK) PANELİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 30 Günlük VaR */}
        <div className="p-5 bg-[var(--ink-2)] border border-rose-600/30 rounded-xl space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold">30 Günlük %95 VaR (Riske Maruz Değer)</span>
          </div>
          <p className="font-mono text-2xl font-bold text-rose-400">
            -{riskMetrics.var95MonthlyAmount.toLocaleString("tr-TR")} ₺
          </p>
          <p className="text-[11px] font-mono text-[var(--mist)] leading-relaxed">
            Normal piyasa koşullarında %95 güven düzeyinde önümüzdeki 1 ayda görebileceğiniz tahmini maksimum kayıp (%{riskMetrics.var95MonthlyPct}).
          </p>
        </div>

        {/* CVaR (Kriz Durumu) */}
        <div className="p-5 bg-[var(--ink-2)] border border-amber-600/30 rounded-xl space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Activity className="w-4 h-4" />
            <span className="font-bold">CVaR (Kriz Beklenen Kaybı)</span>
          </div>
          <p className="font-mono text-2xl font-bold text-amber-400">
            -{riskMetrics.cvar95MonthlyAmount.toLocaleString("tr-TR")} ₺
          </p>
          <p className="text-[11px] font-mono text-[var(--mist)] leading-relaxed">
            Piyasada %5'lik aşırı sert kriz/şok dalgası oluştuğunda katlanılacak ortalama kuyruk kaybı.
          </p>
        </div>

        {/* Çeşitlendirme Volatilite Kazancı */}
        <div className="p-5 bg-[var(--ink-2)] border border-emerald-600/30 rounded-xl space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Award className="w-4 h-4" />
            <span className="font-bold">Çeşitlendirme Kalkanı</span>
          </div>
          <p className="font-mono text-2xl font-bold text-emerald-400">
            -%{riskMetrics.diversificationBenefitPct}
          </p>
          <p className="text-[11px] font-mono text-[var(--mist)] leading-relaxed">
            Farklı varlık sınıflarınız sayesinde portföy volatilitesinin tek bir hisseye kıyasla ne kadar sönümlendiği.
          </p>
        </div>
      </div>

      {/* 3. MARKOWITZ ETKİN SINIR (EFFICIENT FRONTIER) GRAFİĞİ */}
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-3">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-[var(--paper)] flex items-center gap-2">
              <span>Markowitz Etkin Sınır Eğrisi (MPT)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)]">
                NOBEL EKONOMİ MODELİ
              </span>
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              Risk (Standart Sapma) eksenine karşı beklenen getiri haritası ve portföyünüzün optimal verimdeki konumu.
            </p>
          </div>

          {/* Risksiz Faiz Oranı Ayarı */}
          <div className="flex items-center gap-2 bg-[var(--ink-3)] px-3 py-1.5 rounded-lg border border-[var(--line)] text-xs font-mono">
            <Sliders className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span className="text-[var(--mist)]">Risksiz Faiz:</span>
            <input
              type="number"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(Number(e.target.value) || 0)}
              className="w-12 bg-transparent text-right font-bold text-[var(--paper)] outline-none focus:text-[var(--brass)]"
            />
            <span className="text-[var(--mist)]">%</span>
          </div>
        </div>

        {/* Scatter Chart */}
        <div className="w-full h-80 bg-[var(--ink-3)] rounded-xl p-3 border border-[var(--line)] shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" opacity={0.4} />
              <XAxis
                type="number"
                dataKey="risk"
                name="Risk (Standart Sapma)"
                unit="%"
                stroke="var(--mist)"
                fontSize={10}
                fontFamily="monospace"
              />
              <YAxis
                type="number"
                dataKey="returnRate"
                name="Beklenen Getiri"
                unit="%"
                stroke="var(--mist)"
                fontSize={10}
                fontFamily="monospace"
              />
              <ZAxis range={[60, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "var(--ink-2)",
                  borderColor: "var(--brass-dim)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--paper)",
                  fontFamily: "monospace",
                }}
                formatter={(val: any, name: any) => [
                  `%${val}`,
                  name === "risk" ? "Risk (Volatilite)" : "Beklenen Getiri",
                ]}
              />
              <Scatter data={frontierPoints} fill="#C9A24B">
                {frontierPoints.map((entry, index) => {
                  if (entry.isCurrent) {
                    return <Cell key={`cell-${index}`} fill="#10b981" stroke="#fff" strokeWidth={2} />;
                  }
                  if (entry.isMaxSharpe) {
                    return <Cell key={`cell-${index}`} fill="#C9A24B" stroke="#f59e0b" strokeWidth={2} />;
                  }
                  if (entry.isMinVariance) {
                    return <Cell key={`cell-${index}`} fill="#38bdf8" stroke="#0284c7" strokeWidth={2} />;
                  }
                  return <Cell key={`cell-${index}`} fill="#64748b" opacity={0.6} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Lejant & İpuçları */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-[var(--line)]">
          <div className="flex items-center gap-3 flex-wrap text-[11px] text-[var(--mist)]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-white" />
              <strong className="text-[var(--paper)]">Mevcut Portföyünüz</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--brass)] inline-block" />
              Maksimum Sharpe (Teğet Portföy)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
              Minimum Varyans (En Düşük Risk)
            </span>
          </div>
          <span className="text-[10px] text-[var(--brass)]">
            Etkin sınırın sol üst köşesine yakın olmak maksimum getiri-minimum risk demektir.
          </span>
        </div>
      </div>
    </div>
  );
}
