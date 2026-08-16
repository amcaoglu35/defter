"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Shield,
  Sparkles,
  Layers,
  ChevronRight,
  PieChart,
  Calendar,
  PlusCircle,
  Eye,
  Coffee,
  RefreshCw,
  ArrowRight,
  Flame,
  Coins,
  Target,
  Award,
  Gem,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import StampBadge from "@/components/StampBadge";
import DataStatusBadge from "@/components/DataStatusBadge";
import LiveKapFeed from "@/components/LiveKapFeed";
import MonthlyDividendTimeline from "@/components/MonthlyDividendTimeline";
import CompoundGrowthWidget from "@/components/CompoundGrowthWidget";
import { isLiveSymbol } from "@/lib/liveSymbols";
import { DailyBriefingResult } from "@/lib/aiService";
import { calculatePortfolioHealthScore } from "@/lib/healthScore";
import { useToast } from "@/components/ToastProvider";

export default function HomePage() {
  const { companies, baskets, ipos, dividends, indices, aiProvider, geminiModel } = useDefterStore();
  const { showToast } = useToast();

  // 1. Market Movers & Radar Metrics
  const [marketRadarTab, setMarketRadarTab] = useState<"movers" | "dividends" | "value" | "analysts">("movers");

  const topGainers = useMemo(() => {
    return [...companies]
      .filter((c) => c.dailyChange > 0)
      .sort((a, b) => b.dailyChange - a.dailyChange)
      .slice(0, 5);
  }, [companies]);

  const topLosers = useMemo(() => {
    return [...companies]
      .filter((c) => c.dailyChange < 0)
      .sort((a, b) => a.dailyChange - b.dailyChange)
      .slice(0, 5);
  }, [companies]);

  const topDividends = useMemo(() => {
    return [...companies]
      .filter((c) => (c.dividendYield ?? 0) > 0)
      .sort((a, b) => (b.dividendYield ?? 0) - (a.dividendYield ?? 0))
      .slice(0, 5);
  }, [companies]);

  const topValuePE = useMemo(() => {
    return [...companies]
      .filter((c) => (c.peRatio ?? 0) > 0 && (c.peRatio ?? 0) < 25)
      .sort((a, b) => (a.peRatio ?? 0) - (b.peRatio ?? 0))
      .slice(0, 5);
  }, [companies]);

  const topAnalystUpside = useMemo(() => {
    return [...companies]
      .filter((c) => (c.targetUpsidePct ?? 0) > 0)
      .sort((a, b) => (b.targetUpsidePct ?? 0) - (a.targetUpsidePct ?? 0))
      .slice(0, 5);
  }, [companies]);

  const featuredCompanies = useMemo(() => {
    return [...companies]
      .sort((a, b) => Math.abs(b.dailyChange) - Math.abs(a.dailyChange))
      .slice(0, 6);
  }, [companies]);

  const activeIpos = ipos.filter((ipo) => ipo.status !== "listed");
  const watchlistCompanies = companies.filter((c) => c.inWatchlist);

  // 2. Portfolio Value & Profit
  const totalPortfolioValue = baskets.reduce((sum, b) => sum + b.totalValue, 0);
  const totalCost = baskets.reduce((sum, b) => sum + b.totalCost, 0);
  const totalProfit = totalPortfolioValue - totalCost;
  const isProfitPositive = totalProfit >= 0;
  const profitPercent = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : "0.0";

  // 3. Genuine Weighted Daily Change Percentage
  const totalDailyChangePct = useMemo(() => {
    if (totalPortfolioValue <= 0 || baskets.length === 0) return 0;
    const totalChange = baskets.reduce((sum, b) => {
      const basketChange = b.holdings.reduce((s, h) => {
        const company = companies.find((c) => c.symbol === h.companySymbol);
        return s + (company?.dailyChange || 0) * (h.weightPercent / 100);
      }, 0);
      return sum + basketChange * (b.totalValue / totalPortfolioValue);
    }, 0);
    return parseFloat(totalChange.toFixed(2));
  }, [baskets, companies, totalPortfolioValue]);

  // Aggregate holdings summary with real weights & daily returns
  const holdingsSummary = useMemo(() => {
    const map = new Map<string, { symbol: string; dailyChange: number; weight: number }>();
    for (const b of baskets) {
      for (const h of b.holdings) {
        const co = companies.find((c) => c.symbol === h.companySymbol);
        const existing = map.get(h.companySymbol);
        const weight = h.weightPercent * (b.totalValue / (totalPortfolioValue || 1));
        if (existing) {
          existing.weight += weight;
        } else {
          map.set(h.companySymbol, {
            symbol: h.companySymbol,
            dailyChange: co?.dailyChange ?? 0,
            weight,
          });
        }
      }
    }
    return Array.from(map.values());
  }, [baskets, companies, totalPortfolioValue]);

  // 4. Real Portfolio Health Score Calculation
  const healthScore = useMemo(() => {
    return calculatePortfolioHealthScore(baskets, companies);
  }, [baskets, companies]);

  // 5. Holdings & Live Ratios
  const allHoldingsSymbols = baskets.flatMap((b) => b.holdings.map((h) => h.companySymbol));
  const totalHoldingsCount = allHoldingsSymbols.length;
  const liveHoldingsCount = allHoldingsSymbols.filter(isLiveSymbol).length;
  const liveRatioPct = totalHoldingsCount > 0 ? Math.round((liveHoldingsCount / totalHoldingsCount) * 100) : 100;
  const staticRatioPct = 100 - liveRatioPct;

  const totalAnnualDividends = dividends.reduce(
    (acc, d) => acc + (d.totalEstimatedPayout || 0),
    0
  );

  // 6. Daily Briefing state with localStorage cache
  const [dailyBrief, setDailyBrief] = useState<DailyBriefingResult | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);

  const loadDailyBrief = async (forceRefresh: boolean = false) => {
    if (companies.length === 0) return;
    const todayKey = new Date().toISOString().split("T")[0];

    // 1. Check local storage daily cache if not forcing refresh
    if (!forceRefresh && typeof window !== "undefined") {
      try {
        const cachedStr = localStorage.getItem("defter_daily_brief");
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          if (cached?.date === todayKey && cached?.data) {
            setDailyBrief(cached.data);
            setBriefError(null);
            return;
          }
        }
      } catch {}
    }

    setBriefLoading(true);
    setBriefError(null);
    try {
      const bistDailyChange = indices?.["BIST 100"]?.dailyChange ?? 0;
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily_brief",
          payload: {
            totalValue: totalPortfolioValue,
            totalProfit,
            dailyChangePct: totalDailyChangePct,
            bistDailyChangePct: bistDailyChange,
            basketsCount: baskets.length,
            holdingsSummary,
          },
          provider: aiProvider,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDailyBrief(data.data);
        setBriefError(null);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "defter_daily_brief",
              JSON.stringify({ date: todayKey, data: data.data })
            );
          } catch {}
        }
      } else {
        setBriefError("Orakul günlük brifingi şu anda alınamadı.");
        showToast("Günlük Brifing Alınamadı", "Orakul sunucusu yanıt vermedi.", "error");
      }
    } catch {
      setBriefError("Orakul günlük brifingine bağlanılamadı.");
      showToast("Bağlantı Hatası", "Orakul günlük brifingi yüklenirken bir sorun oluştu.", "error");
    } finally {
      setBriefLoading(false);
    }
  };

  // Safe useEffect triggered only when company & basket data is properly loaded
  useEffect(() => {
    if (companies.length > 0 && baskets.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Asenkron günlük brifing veri çekme işlemi, meşru useEffect kullanımı
      loadDailyBrief();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies.length, baskets.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-10 border-b border-[var(--line)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--brass)] tracking-widest uppercase mb-4 bg-[var(--brass-glow)] px-3 py-1 rounded-xs border border-[var(--brass-dim)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kişisel Sermaye Kütüğü</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--paper)] leading-[1.15]">
            Yatırımlarını sabırla yaz, <br />
            <em className="text-[var(--brass)] italic font-serif">akılla büyüt.</em>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[var(--mist)] leading-relaxed max-w-2xl">
            BIST, altın, kıymetli madenler ve küresel piyasalardaki varlıklarını tek bir
            kişisel defterde topla. Orakul yapay zekasıyla portföyünü dengede tut.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              href="/sirketler"
              className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-semibold text-sm px-6 py-3 rounded-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Kütüğü İncele &amp; Varlık Ekle</span>
            </Link>

            <Link
              href="/orakul"
              className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] hover:text-[var(--brass)] bg-[var(--ink-2)] text-sm px-5 py-3 rounded-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[var(--brass)]" />
              <span>Orakul AI Pusulası</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Top Summary KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Toplam Değer */}
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-5 hover:border-[var(--brass-dim)] transition-colors">
          <div className="flex items-center justify-between text-[var(--mist)] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Toplam Portföy Değeri</span>
            <PieChart className="w-4 h-4 text-[var(--brass)]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[var(--paper)] font-semibold">
            {totalPortfolioValue.toLocaleString("tr-TR")} ₺
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 font-mono text-xs">
            <div
              className={`flex items-center gap-1 font-semibold ${
                totalDailyChangePct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
              }`}
            >
              {totalDailyChangePct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>Bugün: {totalDailyChangePct >= 0 ? "+" : ""}%{totalDailyChangePct.toFixed(2)}</span>
            </div>
            <span className="text-[var(--mist)] opacity-40">•</span>
            <div
              className={`${
                isProfitPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
              }`}
            >
              <span>
                {isProfitPositive ? "+" : ""}
                {totalProfit.toLocaleString("tr-TR")} ₺ ({isProfitPositive ? "+" : ""}%{profitPercent}) Net Kâr
              </span>
            </div>
          </div>
          {totalHoldingsCount > 0 && (
            <div className="mt-3.5 flex items-center justify-between text-[11px] font-mono border-t border-dashed border-[var(--line)] pt-2">
              <span className="text-[var(--verdigris)]">⚡ %{liveRatioPct} Canlı Fiyat</span>
              {staticRatioPct > 0 && (
                <span className="text-[var(--mist)]">📌 %{staticRatioPct} Statik</span>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Portföy Sağlık Skoru (Dinamik & Gerçekçi) */}
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-5 hover:border-[var(--brass-dim)] transition-colors">
          <div className="flex items-center justify-between text-[var(--mist)] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Orakul Sağlık Skoru</span>
            <Shield
              className={`w-4 h-4 ${
                healthScore.verdictColor === "verdigris"
                  ? "text-[var(--verdigris)]"
                  : healthScore.verdictColor === "brass"
                  ? "text-[var(--brass)]"
                  : "text-[var(--loss)]"
              }`}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl text-[var(--paper)] font-semibold">
              {healthScore.score}
            </span>
            <span className="font-mono text-xs text-[var(--mist)]">/ 100</span>
          </div>
          <div
            className={`mt-2 text-xs font-mono font-medium truncate ${
              healthScore.verdictColor === "verdigris"
                ? "text-[var(--verdigris)]"
                : healthScore.verdictColor === "brass"
                ? "text-[var(--brass)]"
                : "text-[var(--loss)]"
            }`}
            title={healthScore.label}
          >
            {healthScore.label}
          </div>
        </div>

        {/* Card 3: Yıllık Temettü Beklentisi */}
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-5 hover:border-[var(--brass-dim)] transition-colors">
          <div className="flex items-center justify-between text-[var(--mist)] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Yıllık Temettü Akışı</span>
            <Calendar className="w-4 h-4 text-[var(--brass)]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[var(--paper)] font-semibold">
            {totalAnnualDividends.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
          </div>
          <div className="mt-2 text-xs font-mono text-[var(--mist)]">
            Hesaplanan Net Dağıtım
          </div>
        </div>

        {/* Card 4: Aktif Sepetler */}
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-5 hover:border-[var(--brass-dim)] transition-colors">
          <div className="flex items-center justify-between text-[var(--mist)] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Aktif Sepetler</span>
            <Layers className="w-4 h-4 text-[var(--mist)]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[var(--paper)] font-semibold">
            {baskets.length} Sepet
          </div>
          <div className="mt-2 text-xs font-mono text-[var(--mist)]">
            {companies.length} Varlık Kütükte
          </div>
        </div>
      </section>

      {/* 2.5 Orakul Günlük Kapanış Brifingi Card (With Skeleton Loader) */}
      {briefLoading && !dailyBrief && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 relative overflow-hidden shadow-xl animate-pulse">
          <div className="flex items-center gap-3 border-b border-dashed border-[var(--line)] pb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--ink-3)] shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-[var(--ink-3)] rounded w-1/4" />
              <div className="h-5 bg-[var(--ink-3)] rounded w-1/2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-[var(--ink-3)] rounded w-full" />
            <div className="h-4 bg-[var(--ink-3)] rounded w-3/4" />
          </div>
        </section>
      )}

      {!dailyBrief && briefError && !briefLoading && (
        <section className="bg-[var(--ink-2)] border border-dashed border-[var(--line)] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Coffee className="w-5 h-5 text-[var(--mist)]" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-[var(--paper)]">
                Orakul Günlük Kapanış Brifingi
              </h4>
              <p className="text-xs text-[var(--mist)] font-sans mt-0.5">
                {briefError}
              </p>
            </div>
          </div>
          <button
            onClick={() => loadDailyBrief(true)}
            className="px-3.5 py-1.5 rounded bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--line)] text-xs font-mono text-[var(--brass)] flex items-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tekrar Dene</span>
          </button>
        </section>
      )}

      {dailyBrief && (
        <section className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-6 relative overflow-hidden shadow-xl animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[var(--brass)] bg-[var(--ink-3)] flex items-center justify-center text-[var(--brass)] shadow-inner">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-[var(--brass)] uppercase font-bold tracking-wider">
                    {dailyBrief.date} • Akşam Kapanış Brifingi
                  </span>
                  {dailyBrief.hasBistData !== false && (
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold border ${
                        (dailyBrief.portfolioDayChangePct ?? 0) >= (dailyBrief.bistDayChangePct ?? 0)
                          ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                          : "bg-[rgba(122,46,58,0.15)] text-[var(--loss)] border-[var(--loss)]"
                      }`}
                    >
                      Alfa Getiri: {(dailyBrief.portfolioDayChangePct ?? 0) >= (dailyBrief.bistDayChangePct ?? 0) ? "+" : ""}
                      {((dailyBrief.portfolioDayChangePct ?? 0) - (dailyBrief.bistDayChangePct ?? 0)).toFixed(2)}%
                    </span>
                  )}
                  {dailyBrief.topWinner && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--ink-3)] text-[var(--verdigris)] border border-[rgba(91,140,123,0.3)]">
                      ▲ {dailyBrief.topWinner.symbol} +%{dailyBrief.topWinner.changePct}
                    </span>
                  )}
                  {dailyBrief.topLoser && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--ink-3)] text-[var(--loss)] border border-[rgba(217,83,79,0.3)]">
                      ▼ {dailyBrief.topLoser.symbol} %{dailyBrief.topLoser.changePct}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--paper)] mt-0.5">
                  {dailyBrief.greeting}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadDailyBrief(true)}
                disabled={briefLoading}
                className="text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] px-3 py-1.5 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${briefLoading ? "animate-spin" : ""}`} />
                <span>Yenile</span>
              </button>

              <Link
                href="/orakul"
                className="text-xs font-mono text-[var(--brass)] hover:text-[var(--paper)] px-3 py-1.5 rounded border border-[var(--brass-dim)] bg-[var(--brass-glow)] flex items-center gap-1.5 transition-colors"
              >
                <span>Tüm Orakul Analizleri</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-center">
            <p className="font-serif text-sm sm:text-base text-[var(--paper)] leading-relaxed">
              {dailyBrief.executiveSummary}
            </p>

            <div className="p-3.5 bg-[var(--ink-3)] border border-[rgba(91,140,123,0.3)] rounded-lg text-xs font-sans space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--verdigris)] font-bold block">
                🎯 Yarın İçin Taktiksel Pusula
              </span>
              <p className="text-[var(--paper-dim)]">{dailyBrief.tacticalTip}</p>
            </div>
          </div>
        </section>
      )}

      {/* 3. Favorites / Quick Watchlist Strip (with DataStatusBadge) */}
      <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--brass)]" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--mist)]">
              Hızlı İzleme Şeridi ({watchlistCompanies.length})
            </h3>
          </div>
          <Link
            href="/sirketler"
            className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1"
          >
            <span>Tümünü Gör</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {watchlistCompanies.length === 0 ? (
          <p className="text-xs font-mono text-[var(--mist)] py-2">
            İzleme listeniz boş. Şirketler sayfasından varlıkları izlemeye alabilirsiniz.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {watchlistCompanies.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                className="bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass-dim)] p-3 rounded flex flex-col justify-between transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-xs text-[var(--paper)] group-hover:text-[var(--brass)]">
                      {c.symbol}
                    </span>
                    <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                  </div>
                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      c.dailyChange >= 0
                        ? "text-[var(--verdigris)]"
                        : "text-[var(--loss)]"
                    }`}
                  >
                    {c.dailyChange >= 0 ? "+" : ""}
                    {c.dailyChange}%
                  </span>
                </div>
                <div className="font-mono text-xs text-[var(--mist)] mt-2">
                  {c.price} {c.currency}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3.5 Market Pulse Radar & Leaders (Interactive 4-Dimension Explorer) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--line)] pb-3">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Günün Piyasa Nabzı &amp; Liderleri</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[var(--paper)] font-medium mt-1">
              Piyasa Radarı &amp; Öne Çıkan Varlıklar
            </h2>
          </div>

          {/* Quick Radar Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {[
              { key: "movers", label: "🏆 Yükselen & Düşen", icon: TrendingUp },
              { key: "dividends", label: "💰 Temettü Liderleri", icon: Coins },
              { key: "value", label: "💎 Düşük F/K & Değer", icon: Gem },
              { key: "analysts", label: "🎯 Hedef Potansiyel", icon: Target },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = marketRadarTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMarketRadarTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[var(--brass-glow)] border-[var(--brass)] text-[var(--brass)] font-bold shadow-sm"
                      : "bg-[var(--ink-2)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Movers (En Çok Yükselenler & En Çok Düşenler) */}
        {marketRadarTab === "movers" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
            {/* Kolon 1: En Çok Yükselenler */}
            <div className="bg-[var(--ink-2)] border border-[rgba(91,140,123,0.3)] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] flex items-center justify-center font-bold text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--verdigris)]">
                    🟢 Günün En Çok Yükselenleri
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[var(--mist)]">
                  BIST &amp; Kütük Liderleri
                </span>
              </div>

              <div className="divide-y divide-dashed divide-[var(--line)]">
                {topGainers.map((c, idx) => (
                  <Link
                    key={c.id}
                    href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                    className="py-2.5 flex items-center justify-between hover:bg-[rgba(91,140,123,0.04)] px-2 rounded transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[var(--mist)] w-4 text-center">
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded border border-[rgba(91,140,123,0.3)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--paper)] group-hover:text-[var(--brass)] shrink-0">
                        {c.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-xs text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors">
                            {c.name}
                          </span>
                          <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                        </div>
                        <span className="text-[10px] text-[var(--mist)] font-mono">
                          {c.symbol} • {c.sector}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-mono text-xs font-semibold text-[var(--paper)]">
                          {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                        </div>
                        <div className="font-mono text-xs font-bold text-[var(--verdigris)]">
                          +{c.dailyChange}%
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--mist)] group-hover:text-[var(--brass)] transition-colors hidden sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Kolon 2: En Çok Düşenler */}
            <div className="bg-[var(--ink-2)] border border-[rgba(201,124,124,0.3)] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[rgba(201,124,124,0.2)] text-[var(--loss)] flex items-center justify-center font-bold text-xs">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--loss)]">
                    🔴 Günün En Çok Düşenleri
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[var(--mist)]">
                  Düzeltme &amp; Fırsat Radarı
                </span>
              </div>

              <div className="divide-y divide-dashed divide-[var(--line)]">
                {topLosers.map((c, idx) => (
                  <Link
                    key={c.id}
                    href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                    className="py-2.5 flex items-center justify-between hover:bg-[rgba(201,124,124,0.04)] px-2 rounded transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[var(--mist)] w-4 text-center">
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded border border-[rgba(201,124,124,0.3)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--paper)] group-hover:text-[var(--loss)] shrink-0">
                        {c.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-xs text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors">
                            {c.name}
                          </span>
                          <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                        </div>
                        <span className="text-[10px] text-[var(--mist)] font-mono">
                          {c.symbol} • {c.sector}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-mono text-xs font-semibold text-[var(--paper)]">
                          {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                        </div>
                        <div className="font-mono text-xs font-bold text-[var(--loss)]">
                          {c.dailyChange}%
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--mist)] group-hover:text-[var(--brass)] transition-colors hidden sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dividends (Temettü Şampiyonları) */}
        {marketRadarTab === "dividends" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-2 bg-[var(--ink-2)] border border-[rgba(201,162,75,0.3)] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[rgba(201,162,75,0.2)] text-[var(--brass)] flex items-center justify-center font-bold text-xs">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--brass)]">
                    💰 En Yüksek Temettü Verimi Sunan Şirketler
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[var(--mist)]">Nakit Akışı Odaklı</span>
              </div>

              <div className="divide-y divide-dashed divide-[var(--line)]">
                {topDividends.map((c, idx) => (
                  <Link
                    key={c.id}
                    href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                    className="py-2.5 flex items-center justify-between hover:bg-[rgba(201,162,75,0.04)] px-2 rounded transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[var(--brass)] w-4 text-center">
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded border border-[rgba(201,162,75,0.3)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--paper)] group-hover:text-[var(--brass)] shrink-0">
                        {c.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-xs text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors">
                            {c.name}
                          </span>
                          <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                        </div>
                        <span className="text-[10px] text-[var(--mist)] font-mono">
                          {c.symbol} • F/K: {c.peRatio ? `${c.peRatio}x` : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-[var(--brass)]">
                          %{c.dividendYield} Temettü Verimi
                        </div>
                        <div className="font-mono text-[11px] text-[var(--paper-dim)]">
                          {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--mist)] group-hover:text-[var(--brass)] transition-colors hidden sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--brass)] font-mono text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>Bileşik Getiri Kuralı</span>
                </div>
                <p className="text-xs text-[var(--paper-dim)] leading-relaxed font-sans">
                  Yüksek temettü verimine sahip hisseler, piyasa dalgalanmalarında nakit akışı yaratarak güçlü bir defans kalkanı oluşturur. Temettü ödemelerini otomatik olarak yeniden yatırarak bileşik büyüme hızlandırılabilir.
                </p>
              </div>
              <Link
                href="/orakul?category=strategy&tab=wizard"
                className="w-full py-2.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)] font-mono text-xs font-bold text-center hover:text-[var(--paper)] transition-colors"
              >
                🧙‍♂️ Temettü Sepeti Oluştur
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Deep Value (Düşük F/K & Çarpan) */}
        {marketRadarTab === "value" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-2 bg-[var(--ink-2)] border border-[rgba(91,140,123,0.3)] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] flex items-center justify-center font-bold text-xs">
                    <Gem className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--verdigris)]">
                    💎 Derin Değerleme (En Düşük Fiyat/Kazanç Çarpanı)
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[var(--mist)]">Kârlılık &amp; İskonto</span>
              </div>

              <div className="divide-y divide-dashed divide-[var(--line)]">
                {topValuePE.map((c, idx) => (
                  <Link
                    key={c.id}
                    href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                    className="py-2.5 flex items-center justify-between hover:bg-[rgba(91,140,123,0.04)] px-2 rounded transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[var(--verdigris)] w-4 text-center">
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded border border-[rgba(91,140,123,0.3)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--paper)] group-hover:text-[var(--brass)] shrink-0">
                        {c.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-xs text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors">
                            {c.name}
                          </span>
                          <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                        </div>
                        <span className="text-[10px] text-[var(--mist)] font-mono">
                          {c.symbol} • PD/DD: {c.pbRatio ? `${c.pbRatio}x` : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-[var(--verdigris)]">
                          F/K: {c.peRatio}x
                        </div>
                        <div className="font-mono text-[11px] text-[var(--paper-dim)]">
                          {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--mist)] group-hover:text-[var(--brass)] transition-colors hidden sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--verdigris)] font-mono text-xs font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Güvenlik Marjı (Graham Prensibi)</span>
                </div>
                <p className="text-xs text-[var(--paper-dim)] leading-relaxed font-sans">
                  Düşük Fiyat/Kazanç (F/K) çarpanına sahip hisseler, kârına oranla piyasa tarafından makul fiyatlanmış şirketleri temsil eder. Sektörel ortalamaların altındaki F/K çarpanı güvenli bir giriş kapısı sunabilir.
                </p>
              </div>
              <Link
                href="/sirketler"
                className="w-full py-2.5 rounded bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] text-[var(--verdigris)] font-mono text-xs font-bold text-center hover:bg-[rgba(91,140,123,0.25)] transition-colors"
              >
                Tüm Değerleme Tablosunu Gör
              </Link>
            </div>
          </div>
        )}

        {/* Tab 4: Analyst Targets (Hedef Potansiyeli) */}
        {marketRadarTab === "analysts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-2 bg-[var(--ink-2)] border border-[rgba(201,162,75,0.3)] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[rgba(201,162,75,0.2)] text-[var(--brass)] flex items-center justify-center font-bold text-xs">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--brass)]">
                    🎯 Analist Hedef Potansiyeli En Yüksek Şirketler
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[var(--mist)]">12 Aylık Konsensüs Primi</span>
              </div>

              <div className="divide-y divide-dashed divide-[var(--line)]">
                {topAnalystUpside.map((c, idx) => (
                  <Link
                    key={c.id}
                    href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                    className="py-2.5 flex items-center justify-between hover:bg-[rgba(201,162,75,0.04)] px-2 rounded transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[var(--brass)] w-4 text-center">
                        #{idx + 1}
                      </span>
                      <div className="w-8 h-8 rounded border border-[rgba(201,162,75,0.3)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--paper)] group-hover:text-[var(--brass)] shrink-0">
                        {c.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-xs text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors">
                            {c.name}
                          </span>
                          <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                        </div>
                        <span className="text-[10px] text-[var(--mist)] font-mono">
                          {c.symbol} • Hedef: {c.targetMeanPrice?.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-[var(--verdigris)]">
                          +%{c.targetUpsidePct} Potansiyel
                        </div>
                        <div className="font-mono text-[11px] text-[var(--paper-dim)]">
                          {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--mist)] group-hover:text-[var(--brass)] transition-colors hidden sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--brass)] font-mono text-xs font-bold">
                  <Target className="w-4 h-4" />
                  <span>Kurumsal Konsensüs</span>
                </div>
                <p className="text-xs text-[var(--paper-dim)] leading-relaxed font-sans">
                  Aracı kurum ve yatırım bankası analistlerinin yayımladığı 12 aylık hedef fiyatların ortalaması ile anlık fiyat arasındaki fark potansiyel yukarı marjı gösterir.
                </p>
              </div>
              <Link
                href="/orakul"
                className="w-full py-2.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)] font-mono text-xs font-bold text-center hover:text-[var(--paper)] transition-colors"
              >
                Orakul Şirket Teşhisini Aç
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 3.8 Live KAP Disclosures Feed */}
      <LiveKapFeed
        symbols={
          watchlistCompanies.length > 0
            ? watchlistCompanies.map((c) => c.symbol)
            : ["THYAO", "EREGL", "TUPRS", "ASELS", "KCHOL"]
        }
      />

      {/* 4. Company Ledger Section (Featured & Mobile Responsive) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-[var(--line)] pb-4">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Günün Öne Çıkanları</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--paper)] font-medium mt-1">
              En Yüksek Hareketlilik Gösteren Varlıklar
            </h2>
          </div>
          <Link
            href="/sirketler"
            className="text-sm font-medium text-[var(--brass)] hover:text-[var(--paper)] flex items-center gap-1.5 transition-colors"
          >
            <span>Tüm Kütüğü Aç ({companies.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.5fr_110px_100px_90px_90px_110px_90px] gap-4 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
            <span>Şirket / Varlık</span>
            <span className="text-right">Fiyat</span>
            <span className="text-right">Günlük %</span>
            <span className="text-right">F/K</span>
            <span className="text-right">Temettü</span>
            <span className="text-center">Orakul Kararı</span>
            <span className="text-right">İşlem</span>
          </div>

          <div className="divide-y divide-dashed divide-[var(--line)]">
            {featuredCompanies.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-2 md:grid-cols-[1.5fr_110px_100px_90px_90px_110px_90px] gap-3 md:gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[rgba(201,162,75,0.04)] transition-colors"
              >
                {/* Symbol & Name */}
                <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                  <div className="w-9 h-9 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-xs font-bold text-[var(--brass)] shrink-0">
                    {c.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                        className="font-medium text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors"
                      >
                        {c.name}
                      </Link>
                      <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                    </div>
                    <div className="text-xs text-[var(--mist)] font-mono">
                      {c.symbol} • {c.sector}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-left md:text-right font-mono text-sm font-semibold text-[var(--paper)]">
                  {c.price.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  {c.currency}
                </div>

                {/* Daily Change */}
                <div
                  className={`text-right font-mono text-sm font-semibold ${
                    c.dailyChange >= 0
                      ? "text-[var(--verdigris)]"
                      : "text-[var(--loss)]"
                  }`}
                >
                  {c.dailyChange >= 0 ? "+" : ""}
                  {c.dailyChange}%
                </div>

                {/* Secondary data columns (hidden on mobile, visible on desktop) */}
                <div className="hidden md:block text-right font-mono text-xs text-[var(--mist)]">
                  {c.peRatio ? `${c.peRatio}x` : "-"}
                </div>

                <div className="hidden md:block text-right font-mono text-xs text-[var(--paper-dim)]">
                  {c.dividendYield ? `%${c.dividendYield}` : "-"}
                </div>

                {/* Verdict Stamp */}
                <div className="hidden md:flex justify-center">
                  <StampBadge verdict={c.recommendation} />
                </div>

                {/* Action Link */}
                <div className="col-span-2 md:col-span-1 flex justify-end md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-dashed border-[var(--line)]">
                  <Link
                    href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--brass)] hover:underline"
                  >
                    <span>İncele</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.8 Monthly Dividend Timeline */}
      <MonthlyDividendTimeline />

      {/* 5. Baskets & IPOs Dual Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="font-serif text-xl text-[var(--paper)] font-medium">
              Aktif Sepetler &amp; Portföy Dağılımı ({baskets.length})
            </h3>
            <Link
              href="/sepetlerim"
              className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1"
            >
              <span>Sepetlerime Git</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {baskets.length === 0 ? (
            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-8 text-center space-y-3">
              <Layers className="w-8 h-8 text-[var(--brass)] mx-auto opacity-70" />
              <h4 className="font-serif text-lg font-bold text-[var(--paper)]">
                Henüz Bir Sepetiniz Bulunmuyor
              </h4>
              <p className="text-xs text-[var(--mist)] max-w-md mx-auto font-sans">
                Yatırımlarınızı hedeflerinize göre gruplamak ve Orakul ile optimize etmek için ilk sepetinizi oluşturun.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/orakul?category=strategy&tab=wizard"
                  className="px-4 py-2 rounded bg-[var(--brass)] text-[var(--ink)] font-bold text-xs font-mono hover:bg-[#d9b35a] transition-all shadow cursor-pointer"
                >
                  🧙‍♂️ Sepet Sihirbazı ile Başla
                </Link>
                <Link
                  href="/sepetlerim"
                  className="px-4 py-2 rounded bg-[var(--ink-3)] text-[var(--paper)] text-xs font-mono border border-[var(--line)] hover:border-[var(--brass)] transition-colors cursor-pointer"
                >
                  Manuel Sepet Oluştur
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {baskets.slice(0, 6).map((basket) => {
                const isBasketProfit = basket.totalProfitPercent >= 0;

                return (
                  <Link
                    key={basket.id}
                    href={`/sepetlerim/${basket.id}`}
                    className="ticket-card p-5 block group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-[var(--ink)] group-hover:text-[var(--brass-dim)] transition-colors">
                          {basket.name}
                        </h4>
                        <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--brass-dim)] mt-0.5">
                          {basket.subtitle}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase ${
                          basket.riskColor === "low"
                            ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)]"
                            : basket.riskColor === "high"
                            ? "bg-[rgba(163,59,59,0.2)] text-[var(--loss)]"
                            : "bg-[rgba(201,162,75,0.2)] text-[var(--brass-dim)]"
                        }`}
                      >
                        {basket.riskLevel} Risk
                      </span>
                    </div>

                    <div className="border-t border-dashed border-[rgba(18,21,28,0.25)] my-4 pt-3 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[rgba(18,21,28,0.6)]">
                          Sepet Değeri
                        </div>
                        <div className="font-mono font-bold text-base text-[var(--ink)]">
                          {basket.totalValue.toLocaleString("tr-TR")} ₺
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-[rgba(18,21,28,0.6)]">
                          Toplam Getiri
                        </div>
                        <div
                          className={`font-mono font-bold text-sm ${
                            isBasketProfit ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                          }`}
                        >
                          {isBasketProfit ? "+" : ""}
                          {basket.totalProfitPercent}%
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {basket.holdings.map((h) => (
                        <span
                          key={h.companySymbol}
                          className="font-mono text-[10px] bg-[rgba(18,21,28,0.08)] px-2 py-0.5 rounded-full font-medium text-[var(--ink)]"
                        >
                          {h.companySymbol} %{h.weightPercent}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {baskets.length > 6 && (
            <div className="pt-2 text-center">
              <Link
                href="/sepetlerim"
                className="inline-flex items-center gap-1 text-xs font-mono text-[var(--brass)] hover:underline"
              >
                <span>+{baskets.length - 6} sepet daha görüntüle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="font-serif text-xl text-[var(--paper)] font-medium">
              Halka Arz Takibi
            </h3>
            <Link
              href="/halka-arz"
              className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1"
            >
              <span>Tümü</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-4 space-y-3">
            {activeIpos.length === 0 ? (
              <div className="text-center py-6 text-xs font-mono text-[var(--mist)] space-y-1">
                <p>Şu anda talep toplayan veya yaklaşan halka arz bulunmuyor.</p>
                <Link href="/halka-arz" className="text-[var(--brass)] hover:underline inline-block mt-1">
                  Geçmiş Halka Arzları Gör →
                </Link>
              </div>
            ) : (
              activeIpos.slice(0, 5).map((ipo) => (
                <div
                  key={ipo.id}
                  className="p-3 rounded bg-[var(--ink-3)] border border-[var(--line)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-sm font-semibold text-[var(--paper)]">
                        {ipo.name}
                      </h5>
                      <span className="font-mono text-xs text-[var(--brass)]">
                        {ipo.code} • {ipo.sector}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-xs font-bold ${
                        ipo.status === "active"
                          ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] border border-[var(--verdigris)]"
                          : "bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)]"
                      }`}
                    >
                      {ipo.status === "active" ? "Talep Toplanıyor" : "Yaklaşıyor"}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-dashed border-[var(--line)] flex items-center justify-between text-xs font-mono text-[var(--mist)]">
                    <span>{ipo.dateRange}</span>
                    <span className="text-[var(--paper)] font-semibold">
                      {ipo.priceRange}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. Interactive Compound Growth & FIRE Simulator */}
      <CompoundGrowthWidget />
    </div>
  );
}
