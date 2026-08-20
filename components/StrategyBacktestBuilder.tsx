"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Hourglass,
  Play,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  RefreshCw,
  Award,
  Shield,
  Zap,
  Info,
  Calendar,
  Layers,
} from "lucide-react";
import { Company } from "@/lib/mockData";
import {
  StrategyBacktestResult,
  PRESET_STRATEGIES,
  TradingStrategy,
} from "@/lib/strategyBacktestEngine";
import CompanyCombobox from "@/components/CompanyCombobox";
import { useToast } from "@/components/ToastProvider";

interface StrategyBacktestBuilderProps {
  initialSymbol?: string;
  companies?: Company[];
  onClose?: () => void;
}

export function StrategyBacktestBuilder({
  initialSymbol = "THYAO",
  companies = [],
  onClose,
}: StrategyBacktestBuilderProps) {
  const { showToast } = useToast();
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [selectedStrategyKey, setSelectedStrategyKey] = useState<string>("rsi_mean_reversion");
  const [periodMonths, setPeriodMonths] = useState<number>(12);
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<StrategyBacktestResult | null>(null);

  const handleRunBacktest = async () => {
    if (!selectedSymbol) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai-tools/strategy-backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: selectedSymbol,
          strategyKey: selectedStrategyKey,
          periodMonths,
          initialCapital,
        }),
      });

      if (!res.ok) {
        throw new Error("Backtest simülasyonu çalıştırılamadı");
      }

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
        if (!json.data.isDataSufficient) {
          showToast(
            "Yetersiz Veri",
            json.data.warningMessage || "Bu sembol için yeterli tarihsel veri bulunamadı.",
            "warning"
          );
        } else {
          showToast(
            "Backtest Tamamlandı",
            `${selectedSymbol} üzerinde ${PRESET_STRATEGIES[selectedStrategyKey]?.name || "Strateji"} başarıyla simüle edildi.`,
            "success"
          );
        }
      }
    } catch (err) {
      showToast(
        "Hata",
        err instanceof Error ? err.message : "Backtest çalıştırılırken bir hata oluştu",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount once
  useEffect(() => {
    handleRunBacktest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-6 font-mono text-xs shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-[var(--paper)]">
                ⏳ Kural Bazlı Strateji Backtest Laboratuvarı
              </h3>
              <span className="font-mono text-[10px] text-[var(--brass)] bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-0.5 rounded font-bold">
                Authentic Quant Engine
              </span>
            </div>
            <p className="text-[11px] text-[var(--mist)] mt-0.5">
              RSI, SMA Kesişimleri, Bollinger &amp; MACD kurallarını gerçek tarihsel BIST/Global verilerinde simüle edin
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--mist)] hover:text-[var(--paper)] text-sm p-1 rounded cursor-pointer self-end sm:self-auto"
          >
            ✕ Kapat
          </button>
        )}
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[var(--ink-3)] rounded-xl border border-[var(--line)]">
        {/* 1. Symbol Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[var(--mist)] uppercase tracking-wider font-semibold block">
            Varlık / Şirket:
          </label>
          <input
            type="text"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
            placeholder="Örn: THYAO, ASELS, AAPL"
            className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--paper)] uppercase outline-none focus:border-[var(--brass)]"
          />
        </div>

        {/* 2. Strategy Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[var(--mist)] uppercase tracking-wider font-semibold block">
            Kural Stratejisi:
          </label>
          <select
            value={selectedStrategyKey}
            onChange={(e) => setSelectedStrategyKey(e.target.value)}
            className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--paper)] outline-none focus:border-[var(--brass)]"
          >
            {Object.entries(PRESET_STRATEGIES).map(([key, strat]) => (
              <option key={key} value={key}>
                {strat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Period Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[var(--mist)] uppercase tracking-wider font-semibold block">
            Geriye Dönük Dönem:
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: "3A", val: 3 },
              { label: "6A", val: 6 },
              { label: "1Y", val: 12 },
              { label: "2Y", val: 24 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setPeriodMonths(p.val)}
                className={`py-2 rounded text-xs font-mono transition-all cursor-pointer ${
                  periodMonths === p.val
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                    : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Run Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleRunBacktest}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Hesaplanıyor..." : "Simülasyonu Çalıştır"}</span>
          </button>
        </div>
      </div>

      {/* Strategy Description Badge */}
      <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[rgba(201,162,75,0.2)] flex items-start gap-2.5 text-[11px] font-sans text-[var(--paper-dim)]">
        <Info className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[var(--brass)] font-mono block">
            {PRESET_STRATEGIES[selectedStrategyKey]?.name}:
          </span>
          <span>{PRESET_STRATEGIES[selectedStrategyKey]?.description}</span>
          <div className="mt-1 font-mono text-[10px] text-[var(--mist)]">
            Stop-Loss: %{PRESET_STRATEGIES[selectedStrategyKey]?.stopLossPct ?? "Yok"} | Kâr Al: +%{PRESET_STRATEGIES[selectedStrategyKey]?.takeProfitPct ?? "Yok"}
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && result.isDataSufficient && (
        <div className="space-y-6 animate-in fade-in">
          {/* Performance KPI Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {/* 1. Strateji Getirisi */}
            <div className="p-3 bg-[var(--ink-3)] rounded-xl border border-[var(--brass)] shadow-md col-span-2 sm:col-span-2">
              <span className="text-[10px] text-[var(--brass)] uppercase font-bold block">Strateji Toplam Getiri</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`font-serif text-xl font-bold ${
                    result.totalReturnPct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                  }`}
                >
                  %{result.totalReturnPct >= 0 ? "+" : ""}
                  {result.totalReturnPct}
                </span>
                <span className="text-[10px] text-[var(--mist)]">
                  ({result.initialCapital.toLocaleString("tr-TR")} ₺ → {result.finalCapital.toLocaleString("tr-TR")} ₺)
                </span>
              </div>
            </div>

            {/* 2. Buy & Hold Benchmark */}
            <div className="p-3 bg-[var(--ink-3)] rounded-xl border border-[var(--line)] col-span-2 sm:col-span-2">
              <span className="text-[10px] text-[var(--mist)] uppercase block">Al &amp; Tut (Buy &amp; Hold)</span>
              <span
                className={`font-serif text-xl font-bold block mt-1 ${
                  result.benchmarkReturnPct >= 0 ? "text-[var(--paper)]" : "text-[var(--loss)]"
                }`}
              >
                %{result.benchmarkReturnPct >= 0 ? "+" : ""}
                {result.benchmarkReturnPct}
              </span>
            </div>

            {/* 3. Alpha */}
            <div className="p-3 bg-[var(--ink-3)] rounded-xl border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] uppercase block">Alfa (Fark)</span>
              <span
                className={`font-serif text-base font-bold block mt-1 ${
                  result.alphaPct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                }`}
              >
                %{result.alphaPct >= 0 ? "+" : ""}
                {result.alphaPct}
              </span>
            </div>

            {/* 4. Win Rate */}
            <div className="p-3 bg-[var(--ink-3)] rounded-xl border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] uppercase block">Kazanma Oranı</span>
              <span className="font-serif text-base font-bold text-[var(--paper)] block mt-1">
                %{result.winRatePct}
              </span>
              <span className="text-[9px] text-[var(--mist)]">
                {result.winningTrades}K / {result.losingTrades}Z
              </span>
            </div>

            {/* 5. Max Drawdown */}
            <div className="p-3 bg-[var(--ink-3)] rounded-xl border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] uppercase block">Maks. Drawdown</span>
              <span className="font-serif text-base font-bold text-[var(--loss)] block mt-1">
                -%{result.maxDrawdownPct}
              </span>
            </div>

            {/* 6. Sharpe */}
            <div className="p-3 bg-[var(--ink-3)] rounded-xl border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] uppercase block">Sharpe Oranı</span>
              <span className="font-serif text-base font-bold text-[var(--paper)] block mt-1">
                {result.sharpeRatio}
              </span>
              <span className="text-[9px] text-[var(--mist)]">rf=%35 TR</span>
            </div>
          </div>

          {/* Equity Curve Line Chart */}
          <div className="p-5 bg-[var(--ink-3)] rounded-xl border border-[var(--line)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <h4 className="font-serif text-sm font-bold text-[var(--paper)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--brass)]" />
                <span>Portföy Büyüme Eğrisi: Strateji vs Al &amp; Tut</span>
              </h4>
              <span className="text-[10px] text-[var(--mist)]">
                {result.startDate} — {result.endDate}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.equityCurve}>
                  <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--mist)"
                    fontSize={10}
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis
                    stroke="var(--mist)"
                    fontSize={10}
                    domain={["auto", "auto"]}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--ink-2)",
                      borderColor: "var(--line)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                    formatter={(value: unknown) => [
                      `${Number(value).toLocaleString("tr-TR")} ₺`,
                      "",
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line
                    type="monotone"
                    name="Kural Stratejisi"
                    dataKey="equity"
                    stroke="#c9a24b"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    name="Al ve Tut (Buy & Hold)"
                    dataKey="benchmarkEquity"
                    stroke="#8a909a"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Completed Trades Log Table */}
          <div className="p-4 bg-[var(--ink-3)] rounded-xl border border-[var(--line)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <h4 className="font-serif text-sm font-bold text-[var(--paper)]">
                📋 Gerçekleşen İşlem Günlüğü ({result.totalTrades} İşlem)
              </h4>
              <span className="text-[10px] text-[var(--mist)]">
                Kâr Faktörü: <strong className="text-[var(--paper)]">{result.profitFactor}</strong>
              </span>
            </div>

            {result.tradeLog.length === 0 ? (
              <div className="p-6 text-center text-[var(--mist)] font-sans text-xs">
                Seçilen dönemde strateji kurallarına uyan bir alım/satım sinyali oluşmadı.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-60 scrollbar-thin">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-[var(--mist)] text-[10px] uppercase">
                      <th className="py-2 px-2">Giriş Tarihi</th>
                      <th className="py-2 px-2">Çıkış Tarihi</th>
                      <th className="py-2 px-2">Süre</th>
                      <th className="py-2 px-2">Giriş Fiyatı</th>
                      <th className="py-2 px-2">Çıkış Fiyatı</th>
                      <th className="py-2 px-2">Çıkış Sebebi</th>
                      <th className="py-2 px-2 text-right">Getiri (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {result.tradeLog.map((t) => (
                      <tr key={t.id} className="hover:bg-[var(--ink-2)] transition-colors">
                        <td className="py-2 px-2 text-[var(--paper)]">{t.entryDate}</td>
                        <td className="py-2 px-2 text-[var(--paper-dim)]">{t.exitDate}</td>
                        <td className="py-2 px-2 text-[var(--mist)]">{t.durationDays} Gün</td>
                        <td className="py-2 px-2">{t.entryPrice.toFixed(2)} ₺</td>
                        <td className="py-2 px-2">{t.exitPrice.toFixed(2)} ₺</td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                              t.exitReason === "TAKE_PROFIT"
                                ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                                : t.exitReason === "STOP_LOSS"
                                ? "bg-[rgba(163,59,59,0.15)] text-[var(--loss)] border-[var(--loss)]"
                                : "bg-[var(--ink-2)] text-[var(--mist)] border-[var(--line)]"
                            }`}
                          >
                            {t.exitReason}
                          </span>
                        </td>
                        <td
                          className={`py-2 px-2 text-right font-bold ${
                            t.returnPct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                          }`}
                        >
                          %{t.returnPct >= 0 ? "+" : ""}
                          {t.returnPct}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {result && !result.isDataSufficient && (
        <div className="p-6 bg-[rgba(163,59,59,0.1)] border border-[rgba(163,59,59,0.3)] rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--loss)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-sm text-[var(--paper)]">
              Yetersiz Tarihsel Veri
            </h4>
            <p className="font-sans text-xs text-[var(--paper-dim)] leading-relaxed">
              {result.warningMessage || "Bu varlık için yeterli gün kapanışı bulunamadı. Lütfen daha likit bir hisse senedi seçin."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
