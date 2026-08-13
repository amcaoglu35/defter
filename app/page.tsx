"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowUpRight,
  Shield,
  Sparkles,
  Layers,
  ChevronRight,
  PieChart,
  Calendar,
  PlusCircle,
  Eye,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import StampBadge from "@/components/StampBadge";
import { isLiveSymbol } from "@/lib/liveSymbols";

export default function HomePage() {
  const { companies, baskets, ipos, dividends } = useDefterStore();

  const featuredCompanies = companies.slice(0, 6);
  const activeIpos = ipos.filter((ipo) => ipo.status !== "listed");
  const watchlistCompanies = companies.filter((c) => c.inWatchlist);

  const totalPortfolioValue = baskets.reduce((sum, b) => sum + b.totalValue, 0);
  const totalCost = baskets.reduce((sum, b) => sum + b.totalCost, 0);
  const totalProfit = totalPortfolioValue - totalCost;
  const profitPercent = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : "0.0";

  const allHoldingsSymbols = baskets.flatMap((b) => b.holdings.map((h) => h.companySymbol));
  const totalHoldingsCount = allHoldingsSymbols.length;
  const liveHoldingsCount = allHoldingsSymbols.filter(isLiveSymbol).length;
  const liveRatioPct = totalHoldingsCount > 0 ? Math.round((liveHoldingsCount / totalHoldingsCount) * 100) : 100;
  const staticRatioPct = 100 - liveRatioPct;

  const totalAnnualDividends = dividends.reduce(
    (acc, d) => acc + (d.totalEstimatedPayout || 0),
    0
  );

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
          <div className="flex items-center gap-1.5 mt-2 font-mono text-xs text-[var(--verdigris)]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{totalProfit.toLocaleString("tr-TR")} ₺ (%{profitPercent}) Net Kâr</span>
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

        {/* Card 2: Portföy Sağlık Skoru */}
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-5 hover:border-[var(--brass-dim)] transition-colors">
          <div className="flex items-center justify-between text-[var(--mist)] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Orakul Sağlık Skoru</span>
            <Shield className="w-4 h-4 text-[var(--verdigris)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl text-[var(--paper)] font-semibold">
              88
            </span>
            <span className="font-mono text-xs text-[var(--mist)]">/ 100</span>
          </div>
          <div className="mt-2 text-xs font-mono text-[var(--brass)]">
            Dengeli &amp; Yüksek Likidite
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

      {/* 3. Favorites / Quick Watchlist Strip */}
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
                href={`/sirketler/${c.symbol}`}
                className="bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass-dim)] p-3 rounded flex flex-col justify-between transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[var(--paper)] group-hover:text-[var(--brass)]">
                    {c.symbol}
                  </span>
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

      {/* 4. Company Ledger Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-[var(--line)] pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider">
              Kütük Özeti
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--paper)] font-medium mt-1">
              Öne Çıkan Şirketler &amp; Varlıklar
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
          <div className="hidden md:grid grid-cols-[1.5fr_100px_100px_90px_90px_110px_90px] gap-4 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink-3)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
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
                className="grid grid-cols-1 md:grid-cols-[1.5fr_100px_100px_90px_90px_110px_90px] gap-3 md:gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[rgba(201,162,75,0.04)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded border border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-xs font-bold text-[var(--brass)] shrink-0">
                    {c.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <Link
                      href={`/sirketler/${c.symbol}`}
                      className="font-medium text-sm text-[var(--paper)] hover:text-[var(--brass)] transition-colors"
                    >
                      {c.name}
                    </Link>
                    <div className="text-xs text-[var(--mist)] font-mono">
                      {c.symbol} • {c.sector}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-sm font-semibold text-[var(--paper)]">
                  {c.price.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  {c.currency}
                </div>

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

                <div className="text-right font-mono text-xs text-[var(--mist)]">
                  {c.peRatio ? `${c.peRatio}x` : "-"}
                </div>

                <div className="text-right font-mono text-xs text-[var(--paper-dim)]">
                  {c.dividendYield ? `%${c.dividendYield}` : "-"}
                </div>

                <div className="text-center">
                  <StampBadge verdict={c.recommendation} />
                </div>

                <div className="text-right">
                  <Link
                    href={`/sirketler/${c.symbol}`}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {baskets.map((basket) => (
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
                    <div className="font-mono font-bold text-sm text-[var(--verdigris)]">
                      +{basket.totalProfitPercent}%
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
            ))}
          </div>
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
            {activeIpos.map((ipo) => (
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
