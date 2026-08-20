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
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Coins,
  Flame,
  TrendingUp,
  Calendar,
  Sparkles,
  RefreshCw,
  Calculator,
  Award,
} from "lucide-react";
import {
  PortfolioAssetHolding,
  calculateFireMetrics,
  calculateDripProjection,
} from "@/lib/portfolioIntelligence";

interface DividendFireHubProps {
  holdings: PortfolioAssetHolding[];
  totalValue: number;
}

export default function DividendFireHub({
  holdings,
  totalValue,
}: DividendFireHubProps) {
  const [activeTab, setActiveTab] = useState<"fire" | "drip" | "calendar">("fire");

  // FIRE Parametreleri
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000); // 40.000 TL / ay
  const [monthlySavings, setMonthlySavings] = useState(25000); // 25.000 TL / ay
  const [expectedReturn, setExpectedReturn] = useState(7); // %7 reel getiri

  // DRIP Parametreleri
  const [dripYield, setDripYield] = useState(6);
  const [dripYears, setDripYears] = useState(15);

  // Temettü Veren Varlıklar
  const dividendHoldings = useMemo(() => {
    return holdings
      .filter((h) => (h.dividendYield || 0) > 0)
      .map((h) => {
        const estAnnualDiv =
          h.totalCurrentValue * ((h.dividendYield || 0) / 100);
        return {
          ...h,
          estAnnualDiv,
        };
      })
      .sort((a, b) => b.estAnnualDiv - a.estAnnualDiv);
  }, [holdings]);

  const totalAnnualDividends = useMemo(() => {
    return dividendHoldings.reduce((acc, h) => acc + h.estAnnualDiv, 0);
  }, [dividendHoldings]);

  const portfolioDividendYield = totalValue > 0 ? (totalAnnualDividends / totalValue) * 100 : 0;

  // FIRE Hesaplaması
  const fireMetrics = useMemo(() => {
    return calculateFireMetrics({
      currentPortfolioValue: totalValue,
      monthlyExpenses,
      monthlySavings,
      expectedRealReturnRate: expectedReturn,
      safeWithdrawalRate: 4,
    });
  }, [totalValue, monthlyExpenses, monthlySavings, expectedReturn]);

  // DRIP Projeksiyonu
  const dripData = useMemo(() => {
    return calculateDripProjection({
      initialInvestment: totalValue > 0 ? totalValue : 100000,
      annualDividendYield: dripYield,
      annualCapitalGrowth: 8,
      annualDividendGrowth: 6,
      years: dripYears,
    });
  }, [totalValue, dripYield, dripYears]);

  // Aylık Tahmini Temettü Dağılımı (Örnek Projeksiyon)
  const monthlyDivTimeline = [
    { month: "Oca", amount: totalAnnualDividends * 0.02 },
    { month: "Şub", amount: totalAnnualDividends * 0.04 },
    { month: "Mar", amount: totalAnnualDividends * 0.18 }, // BIST temettü yoğun ayı
    { month: "Nis", amount: totalAnnualDividends * 0.28 }, // BIST temettü zirve ayı
    { month: "May", amount: totalAnnualDividends * 0.22 },
    { month: "Haz", amount: totalAnnualDividends * 0.08 },
    { month: "Tem", amount: totalAnnualDividends * 0.04 },
    { month: "Ağu", amount: totalAnnualDividends * 0.03 },
    { month: "Eyl", amount: totalAnnualDividends * 0.05 },
    { month: "Eki", amount: totalAnnualDividends * 0.02 },
    { month: "Kas", amount: totalAnnualDividends * 0.02 },
    { month: "Ara", amount: totalAnnualDividends * 0.02 },
  ];

  return (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-xl p-5 shadow-xs space-y-5">
      {/* Başlık & Sekmeler */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[var(--paper)]">
              Temettü, DRIP & Finansal Özgürlük (FIRE)
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Pasif gelir takvimi, bileşik kartopu simülatörü ve emeklilik hedefi.
            </p>
          </div>
        </div>

        {/* Sekme Butonları */}
        <div className="flex items-center gap-1 bg-[var(--ink)]/60 p-1 rounded-lg border border-[var(--line)]">
          <button
            onClick={() => setActiveTab("fire")}
            className={`text-xs px-3 py-1.5 rounded-md transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === "fire"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)]"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            FIRE Simülatörü
          </button>
          <button
            onClick={() => setActiveTab("drip")}
            className={`text-xs px-3 py-1.5 rounded-md transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === "drip"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)]"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            DRIP Kartopu
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`text-xs px-3 py-1.5 rounded-md transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === "calendar"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--paper)]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Temettü Akışı
          </button>
        </div>
      </div>

      {/* 1. FIRE SİMÜLATÖRÜ */}
      {activeTab === "fire" && (
        <div className="space-y-5">
          {/* Metrik Özet Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[var(--ink)]/40 border border-[var(--line)] rounded-lg">
              <span className="text-xs text-[var(--muted)] block mb-1">Hedef FIRE Rakamı (4%)</span>
              <p className="font-mono text-base font-bold text-[var(--paper)]">
                {fireMetrics.targetFireNumber.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
              </p>
              <span className="text-[10px] text-[var(--muted)]">Finansal bağımsızlık eşiği</span>
            </div>

            <div className="p-3 bg-[var(--ink)]/40 border border-[var(--line)] rounded-lg">
              <span className="text-xs text-[var(--muted)] block mb-1">İlerleme Oranı</span>
              <p className="font-mono text-base font-bold text-emerald-400">
                %{fireMetrics.progressPct.toFixed(1)}
              </p>
              <span className="text-[10px] text-[var(--muted)]">Hedefe ulaşılan kısım</span>
            </div>

            <div className="p-3 bg-[var(--ink)]/40 border border-[var(--line)] rounded-lg">
              <span className="text-xs text-[var(--muted)] block mb-1">Emekliliğe Kalan Süre</span>
              <p className="font-mono text-base font-bold text-amber-400">
                {fireMetrics.yearsToFire > 50 ? "> 50 Yıl" : `${fireMetrics.yearsToFire} Yıl`}
              </p>
              <span className="text-[10px] text-[var(--muted)]">({fireMetrics.monthsToFire} Ay)</span>
            </div>

            <div className="p-3 bg-[var(--ink)]/40 border border-[var(--line)] rounded-lg">
              <span className="text-xs text-[var(--muted)] block mb-1">Mevcut Güvenli Pasif Gelir</span>
              <p className="font-mono text-base font-bold text-[var(--brass)]">
                {fireMetrics.monthlySafeIncome.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺ / ay
              </p>
              <span className="text-[10px] text-[var(--muted)]">Anapara erimeden çekilebilir</span>
            </div>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--paper)] font-medium">FIRE İlerleme Durumu</span>
              <span className="text-emerald-400 font-bold">%{fireMetrics.progressPct.toFixed(1)}</span>
            </div>
            <div className="w-full h-3 bg-[var(--ink)] rounded-full overflow-hidden border border-[var(--line)] p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${fireMetrics.progressPct}%` }}
              />
            </div>
          </div>

          {/* İnteraktif Simülatör Kaydırıcıları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[var(--ink)]/30 border border-[var(--line)] rounded-xl">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Aylık Hedef Harcama:</span>
                <span className="font-mono font-bold text-[var(--paper)]">
                  {monthlyExpenses.toLocaleString("tr-TR")} ₺
                </span>
              </div>
              <input
                type="range"
                min={15000}
                max={200000}
                step={5000}
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full accent-[var(--brass)] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Aylık Yeni Tasarruf / Ekleme:</span>
                <span className="font-mono font-bold text-[var(--paper)]">
                  {monthlySavings.toLocaleString("tr-TR")} ₺
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={150000}
                step={2500}
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full accent-[var(--brass)] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Beklenen Yıllık Reel Getiri:</span>
                <span className="font-mono font-bold text-[var(--paper)]">%{expectedReturn}</span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full accent-[var(--brass)] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. DRIP KARTOPU SİMÜLATÖRÜ */}
      {activeTab === "drip" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <p className="text-[var(--muted)] max-w-xl">
              Temettüleri nakit çekmeyip aynı hisselere geri yatırdığınızda oluşan <strong>Bileşik Kartopu Etkisi</strong>.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-[var(--muted)]">Kartopu Çarpanı:</span>
                <span className="text-emerald-400 font-bold text-sm">{dripData.multiplier}x Katı</span>
              </div>
            </div>
          </div>

          <div className="w-full h-72 bg-[var(--ink)]/40 rounded-lg p-2 border border-[var(--line)]/60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dripData.projection} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" opacity={0.4} />
                <XAxis dataKey="year" stroke="var(--muted)" fontSize={10} />
                <YAxis
                  stroke="var(--muted)"
                  fontSize={10}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k ₺`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString("tr-TR")} ₺`, ""]}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--line)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="withDrip"
                  name="DRIP İle (Temettü Geri Yatırımı)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="withoutDrip"
                  name="DRIP Olmadan (Nakit Çekim)"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. TEMETTÜ AKIŞI & TAKVİMİ */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[var(--ink)]/40 border border-[var(--line)] rounded-lg">
              <span className="text-xs text-[var(--muted)] block mb-1">Tahmini Yıllık Temettü</span>
              <p className="font-mono text-base font-bold text-emerald-400">
                {totalAnnualDividends.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
              </p>
            </div>
            <div className="p-3 bg-[var(--ink)]/40 border border-[var(--line)] rounded-lg">
              <span className="text-xs text-[var(--muted)] block mb-1">Aylık Ortalama Temettü</span>
              <p className="font-mono text-base font-bold text-[var(--paper)]">
                {(totalAnnualDividends / 12).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺ / ay
              </p>
            </div>
            <div className="p-3 bg-[var(--ink)]/40 border border-[var(--line)] rounded-lg">
              <span className="text-xs text-[var(--muted)] block mb-1">Portföy Temettü Verimi</span>
              <p className="font-mono text-base font-bold text-[var(--brass)]">
                %{portfolioDividendYield.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="w-full h-64 bg-[var(--ink)]/40 rounded-lg p-2 border border-[var(--line)]/60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDivTimeline} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted)" fontSize={11} />
                <YAxis
                  stroke="var(--muted)"
                  fontSize={10}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺`, "Tahmini Temettü"]}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--line)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
