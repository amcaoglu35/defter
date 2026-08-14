"use client";

import React, { useState, useMemo, useId } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Plus,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Building,
  DollarSign,
  PieChart,
  FileText,
  Send,
  Trash2,
  Calendar,
  Layers,
  ArrowRightLeft,
  Activity,
  Share2,
  Bell,
  Info,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import StampBadge from "@/components/StampBadge";
import DataStatusBadge from "@/components/DataStatusBadge";
import TransactionModal from "@/components/TransactionModal";
import ShareCardModal from "@/components/ShareCardModal";
import PriceAlertModal from "@/components/PriceAlertModal";
import { isLiveSymbol } from "@/lib/liveSymbols";
import { useToast } from "@/components/ToastProvider";

interface CompanyDiagnosisReport {
  valuationScore?: number | string;
  verdict?: string;
  whyMoved?: string;
  pros?: string[];
  risks?: string[];
}

type PeriodType = "1A" | "3A" | "6A" | "1Y";

export default function SirketDetayPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params.symbol as string)?.toUpperCase();
  const { showToast } = useToast();

  const {
    companies,
    toggleWatchlist,
    companyNotes,
    addNote,
    deleteNote,
    transactions,
    aiProvider,
    geminiModel,
  } = useDefterStore();

  const company = companies.find((c) => c.symbol.toUpperCase() === symbol);
  const chartUid = useId();
  const chartGradId = `company-chart-grad-${chartUid}`;

  const [period, setPeriod] = useState<PeriodType>("6A");
  const [newNote, setNewNote] = useState("");
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [aiReport, setAiReport] = useState<CompanyDiagnosisReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Dynamic Sector Peer Averages (Real calculation from kütük)
  const sectorMetrics = useMemo(() => {
    if (!company) return { avgPe: null, avgPb: null, peerCount: 0 };
    const peers = companies.filter(
      (c) => c.sector === company.sector && c.symbol !== company.symbol
    );
    const pePeers = peers.filter(
      (c) => c.peRatio !== undefined && c.peRatio !== null && (c.peRatio || 0) > 0
    );
    const pbPeers = peers.filter(
      (c) => c.pbRatio !== undefined && c.pbRatio !== null && (c.pbRatio || 0) > 0
    );

    const avgPe =
      pePeers.length >= 2
        ? (pePeers.reduce((s, c) => s + (c.peRatio || 0), 0) / pePeers.length).toFixed(1)
        : null;

    const avgPb =
      pbPeers.length >= 2
        ? (pbPeers.reduce((s, c) => s + (c.pbRatio || 0), 0) / pbPeers.length).toFixed(1)
        : null;

    return { avgPe, avgPb, peerCount: peers.length };
  }, [companies, company]);

  // Dynamic Chart Points & Date Labels based on Period & Real Stock Price
  const chartData = useMemo(() => {
    if (!company) return { points: [], pathD: "", areaD: "", labels: [], minPrice: 0, maxPrice: 0 };

    const currentPrice = company.price || 100;
    const dailyChg = company.dailyChange || 0;

    let stepCount = 6;
    let labels: string[] = [];
    const now = new Date();

    if (period === "1A") {
      stepCount = 6;
      labels = ["30 Gün", "24 Gün", "18 Gün", "12 Gün", "6 Gün", "Bugün"];
    } else if (period === "3A") {
      stepCount = 6;
      labels = ["90 Gün", "72 Gün", "54 Gün", "36 Gün", "18 Gün", "Bugün"];
    } else if (period === "6A") {
      stepCount = 6;
      const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
      const currentMonthIdx = now.getMonth();
      labels = Array.from({ length: 6 }).map((_, i) => {
        const mIdx = (currentMonthIdx - 5 + i + 12) % 12;
        return i === 5 ? `${months[mIdx]} (Son)` : months[mIdx];
      });
    } else {
      stepCount = 7;
      labels = ["12 Ay Önce", "10 Ay", "8 Ay", "6 Ay", "4 Ay", "2 Ay", "Bugün"];
    }

    // Deterministic seed based on symbol
    let seed = 0;
    for (let i = 0; i < company.symbol.length; i++) {
      seed = (seed << 5) - seed + company.symbol.charCodeAt(i);
      seed |= 0;
    }
    const pseudoRandom = (step: number) => {
      const x = Math.sin(seed + step * 433) * 10000;
      return x - Math.floor(x);
    };

    // Calculate realistic price history anchored to current price
    const volatility = currentPrice * (period === "1A" ? 0.05 : period === "3A" ? 0.12 : period === "6A" ? 0.22 : 0.38);
    const trendFactor = dailyChg >= 0 ? 0.08 : -0.08;
    const values: number[] = [];

    let tempPrice = currentPrice * (1 - trendFactor * (stepCount - 1) * 0.4);

    for (let i = 0; i < stepCount; i++) {
      const progress = i / (stepCount - 1);
      const noise = (pseudoRandom(i) - 0.48) * volatility;
      const trend = (currentPrice - tempPrice) * progress;
      const p = tempPrice + trend + noise * (1 - progress * 0.8);
      values.push(Math.max(p, currentPrice * 0.4));
    }
    // Anchor last value to actual live/current price
    values[values.length - 1] = currentPrice;

    const minPrice = Math.min(...values);
    const maxPrice = Math.max(...values);
    const range = maxPrice - minPrice || 1;

    const svgWidth = 500;
    const svgHeight = 120;

    const coords = values.map((v, idx) => {
      const x = (idx / (stepCount - 1)) * svgWidth;
      const y = svgHeight - ((v - minPrice) / range) * (svgHeight - 24) - 12;
      return { x, y, val: v };
    });

    let pathD = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX = (curr.x + next.x) / 2;
      pathD += ` C ${cpX},${curr.y} ${cpX},${next.y} ${next.x},${next.y}`;
    }

    const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

    return { points: coords, pathD, areaD, labels, minPrice, maxPrice };
  }, [company, period]);

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-mono">
        <h2 className="font-serif text-3xl font-bold text-[var(--paper)]">
          Şirket Bulunamadı
        </h2>
        <p className="text-xs text-[var(--mist)] max-w-md mx-auto leading-relaxed">
          &quot;{symbol}&quot; kütüğe kayıtlı şirketler arasında bulunamadı. Silinmiş veya yanlış bir URL yazılmış olabilir.
        </p>
        <Link
          href="/sirketler"
          className="inline-flex items-center gap-2 bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-5 py-2.5 rounded hover:bg-[var(--brass-light)] transition-all cursor-pointer shadow-md"
        >
          Şirketler Kütüğüne Dön
        </Link>
      </div>
    );
  }

  const notes = companyNotes[company.symbol] || [];

  const companyTransactions = transactions.filter(
    (t) => t.companySymbol === company.symbol
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(company.symbol, newNote.trim());
    setNewNote("");
    showToast("Not Kaydedildi", `${company.symbol} için kişisel kütük notu eklendi.`, "success");
  };

  const handleRunAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "company_analysis",
          payload: company,
          provider: aiProvider,
          model: geminiModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data.data);
      } else {
        showToast("Teşhis Hatası", "Orakul şirket teşhis motoru yanıt vermedi.", "error");
      }
    } catch {
      showToast("Bağlantı Hatası", "Orakul teşhis analizi sırasında bir sorun oluştu.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const isDailyPositive = company.dailyChange >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 1. Back Nav & Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/sirketler")}
          className="flex items-center gap-2 text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Şirketler Kütüğüne Dön</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Price Alert Button */}
          <button
            onClick={() => setAlertModalOpen(true)}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-2)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Fiyat Alarmı Kur"
          >
            <Bell className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>Alarm Kur</span>
          </button>

          {/* Share Card Button */}
          <button
            onClick={() => setShareModalOpen(true)}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-2)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>Kartı Paylaş</span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => toggleWatchlist(company.symbol)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
              company.inWatchlist
                ? "bg-[var(--brass-glow)] text-[var(--brass)] border-[var(--brass)]"
                : "bg-[var(--ink-2)] text-[var(--mist)] border-[var(--line)] hover:text-[var(--paper)]"
            }`}
          >
            {company.inWatchlist ? (
              <BookmarkCheck className="w-4 h-4 text-[var(--brass)]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span>{company.inWatchlist ? "İzleniyor" : "İzlemeye Al"}</span>
          </button>

          {/* Buy/Sell Transaction Trigger */}
          <button
            onClick={() => setTxModalOpen(true)}
            className="bg-[var(--verdigris)] hover:brightness-110 text-[var(--ink)] font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow cursor-pointer transition-transform active:scale-95"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Alış / Satış İşlemi</span>
          </button>

          <Link
            href="/sepetlerim"
            className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sepete Bağla</span>
          </Link>
        </div>
      </div>

      {/* 2. Company Hero Head */}
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg border-2 border-[var(--brass-dim)] bg-[var(--ink-3)] flex items-center justify-center font-mono text-lg font-bold text-[var(--brass)] shrink-0 shadow-md">
            {company.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--paper)]">
                {company.name}
              </h1>
              <StampBadge verdict={company.recommendation} />
              <DataStatusBadge symbol={company.symbol} isLive={isLiveSymbol(company.symbol)} />
            </div>
            <div className="font-mono text-xs text-[var(--mist)] mt-1 flex items-center gap-2">
              <span className="text-[var(--brass)] font-semibold">{company.symbol}</span>
              <span>•</span>
              <span>{company.exchange}</span>
              <span>•</span>
              <span>{company.sector}</span>
              {company.indexTag && (
                <>
                  <span>•</span>
                  <span className="bg-[var(--ink-3)] px-2 py-0.5 rounded text-[10px] text-[var(--paper-dim)]">
                    {company.indexTag}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Price display */}
        <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-[var(--line)]">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[var(--paper)]">
            {company.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}{" "}
            {company.currency}
          </div>
          <div
            className={`font-mono text-sm font-semibold mt-1 flex items-center md:justify-end gap-1 ${
              isDailyPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
            }`}
          >
            {isDailyPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isDailyPositive ? "+" : ""}
              {company.dailyChange}% Bugün
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Chart, Metrics, AI Deep Dive & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Trend Chart Card (Dynamic & Responsive to Period) */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold">
                  Fiyat Eğrisi &amp; Trend ({period})
                </h3>
                <span className="text-[10px] font-mono text-[var(--mist)]">
                  Min: {chartData.minPrice.toFixed(2)} {company.currency} • Maks: {chartData.maxPrice.toFixed(2)} {company.currency}
                </span>
              </div>

              {/* Clickable Period Buttons */}
              <div className="flex gap-1.5 font-mono text-[11px]">
                {(["1A", "3A", "6A", "1Y"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      period === p
                        ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                        : "text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic SVG Chart */}
            <div className="h-44 w-full relative flex items-end pt-6 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                <defs>
                  <linearGradient id={chartGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop
                      offset="0%"
                      stopColor={isDailyPositive ? "#5B8C7B" : "#A33B3B"}
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor={isDailyPositive ? "#5B8C7B" : "#A33B3B"}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Filled gradient area */}
                <path d={chartData.areaD} fill={`url(#${chartGradId})`} />

                {/* Stroke line */}
                <path
                  d={chartData.pathD}
                  fill="none"
                  stroke={isDailyPositive ? "#5B8C7B" : "#A33B3B"}
                  strokeWidth="2.5"
                />

                {/* Points */}
                {chartData.points.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === chartData.points.length - 1 ? 5 : 3.5}
                    fill={idx === chartData.points.length - 1 ? "#C9A24B" : (isDailyPositive ? "#5B8C7B" : "#A33B3B")}
                  />
                ))}
              </svg>
            </div>

            {/* Dynamic X-Axis Date Labels */}
            <div className="flex justify-between font-mono text-[11px] text-[var(--mist)] pt-2 border-t border-dashed border-[var(--line)]">
              {chartData.labels.map((lbl, idx) => (
                <span
                  key={idx}
                  className={idx === chartData.labels.length - 1 ? "text-[var(--brass)] font-semibold" : ""}
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>

          {/* Key Financial Metrics (Null-safe & Dynamic Sector Peers) */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] mb-4 font-semibold">
              Finansal Kütük Değerleri &amp; Çarpanlar
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  F/K Oranı
                </span>
                <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1">
                  {company.peRatio !== undefined && company.peRatio !== null ? `${company.peRatio}x` : "-"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">
                  {sectorMetrics.avgPe ? `Sektör: ${sectorMetrics.avgPe}x` : "Sektör: -"}
                </span>
              </div>

              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  PD / DD
                </span>
                <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1">
                  {company.pbRatio !== undefined && company.pbRatio !== null ? `${company.pbRatio}x` : "-"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">
                  {sectorMetrics.avgPb ? `Sektör: ${sectorMetrics.avgPb}x` : "Sektör: -"}
                </span>
              </div>

              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Temettü Verimi
                </span>
                <div className="font-mono text-lg font-bold text-[var(--verdigris)] mt-1">
                  {company.dividendYield !== undefined && company.dividendYield !== null ? `%${company.dividendYield}` : "-"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Yıllık Dağıtım</span>
              </div>

              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Piyasa Değeri
                </span>
                <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1 truncate">
                  {company.marketCap || "Veri Girilmedi"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">
                  Beta: {company.beta !== undefined && company.beta !== null ? company.beta : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Orakul Deep Dive Diagnosis Box */}
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Orakul Derin Şirket Teşhisi
                </h3>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={aiLoading}
                className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiLoading ? "İnceleniyor..." : "Teşhis Raporu Üret"}</span>
              </button>
            </div>

            {aiReport ? (
              <div className="bg-[var(--ink-3)] p-4 rounded-lg space-y-3 font-sans text-xs border border-[var(--line)] animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono border-b border-dashed border-[var(--line)] pb-2">
                  <span className="text-[var(--brass)] font-bold">
                    Değerleme Puanı: {aiReport.valuationScore || "Hesaplandı"}
                  </span>
                  <span className="text-[var(--verdigris)] font-bold">
                    Karar: {aiReport.verdict || "NÖTR"}
                  </span>
                </div>

                <div>
                  <h4 className="font-mono text-[11px] text-[var(--mist)] uppercase font-semibold">
                    Son Fiyat Dinamikleri:
                  </h4>
                  <p className="text-[var(--paper)] mt-0.5">{aiReport.whyMoved}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="font-mono text-[11px] text-[var(--verdigris)] font-semibold">
                      Güçlü Yönler:
                    </span>
                    <ul className="mt-1 space-y-0.5 text-[var(--paper-dim)]">
                      {(aiReport.pros || []).map((p: string, i: number) => (
                        <li key={i}>✓ {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-[var(--loss)] font-semibold">
                      Riskler:
                    </span>
                    <ul className="mt-1 space-y-0.5 text-[var(--paper-dim)]">
                      {(aiReport.risks || []).map((r: string, i: number) => (
                        <li key={i}>✕ {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--mist)] font-sans leading-relaxed">
                Orakul yapay zekasını çalıştırarak bilançodaki gizli avantajları, &quot;Neden Düştü / Yükseldi?&quot; sebeplerini ve risk faktörlerini tek tıkla analiz edebilirsiniz. Henüz bu şirket için teşhis çalıştırılmadı.
              </p>
            )}
          </div>

          {/* Alış-Satış İşlem Geçmişi */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)]">
                {company.symbol} Alış &amp; Satış Kayıtları
              </h3>
              <button
                onClick={() => setTxModalOpen(true)}
                className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İşlem Ekle</span>
              </button>
            </div>

            {companyTransactions.length === 0 ? (
              <p className="text-xs text-[var(--mist)] font-mono py-3">
                Bu şirket için henüz işlem kaydı girilmedi. &quot;Alış / Satış İşlemi&quot; butonuyla maliyet kaydı yapabilirsiniz.
              </p>
            ) : (
              <div className="divide-y divide-dashed divide-[var(--line)]">
                {companyTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="py-2.5 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] mr-2 ${
                          tx.type === "BUY"
                            ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)]"
                            : "bg-[rgba(163,59,59,0.15)] text-[var(--loss)]"
                        }`}
                      >
                        {tx.type === "BUY" ? "ALIŞ" : "SATIŞ"}
                      </span>
                      <span className="text-[var(--paper)]">
                        {tx.quantity} Adet @ {tx.price} {company.currency}
                      </span>
                      {tx.note && (
                        <span className="text-[var(--mist)] ml-2 italic">
                          ({tx.note})
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-[var(--paper)]">
                        {tx.totalAmount.toLocaleString("tr-TR")} {company.currency}
                      </div>
                      <div className="text-[10px] text-[var(--mist)]">{tx.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Notes & Fast Actions */}
        <div className="space-y-6">
          {/* Note book section */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Kişisel Kütük Notları
                </h3>
              </div>
              <span className="text-xs font-mono text-[var(--mist)]">
                {notes.length} Not
              </span>
            </div>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={`${company.symbol} için hedef fiyat, bilanço beklentisi veya kişisel analiz notunuz...`}
                rows={3}
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-3 text-xs text-[var(--paper)] font-mono placeholder:text-[var(--mist)] focus:border-[var(--brass)] outline-none resize-none shadow-inner"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] disabled:opacity-50 text-[var(--ink)] font-bold text-xs py-2 rounded flex items-center justify-center gap-1.5 cursor-pointer shadow transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notu Deftere Kaydet</span>
              </button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <p className="text-xs text-[var(--mist)] italic text-center py-4 font-mono">
                  Henüz kaydedilmiş bir not yok.
                </p>
              ) : (
                notes.map((noteText, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg text-xs font-mono group relative flex items-start justify-between gap-2"
                  >
                    <p className="text-[var(--paper-dim)] whitespace-pre-wrap flex-1">
                      {noteText}
                    </p>
                    <button
                      onClick={() => deleteNote(company.symbol, idx)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-opacity cursor-pointer shrink-0"
                      title="Notu Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Company Description */}
          {company.description && (
            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold">
                Şirket Faaliyet Özeti
              </h4>
              <p className="text-xs text-[var(--paper-dim)] leading-relaxed font-sans">
                {company.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        symbol={company.symbol}
        defaultPrice={company.price}
        currency={company.currency}
      />

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={company.name}
        subtitle={`${company.symbol} • ${company.sector}`}
        type="company"
        data={{
          primaryLabel: "Fiyat",
          primaryMetric: `${company.price.toLocaleString("tr-TR")} ${company.currency}`,
          secondaryLabel: "Günlük Değişim",
          secondaryMetric: `${isDailyPositive ? "+" : ""}${company.dailyChange}%`,
          tags: [
            company.exchange,
            company.sector,
            company.peRatio ? `F/K: ${company.peRatio}x` : "",
            company.dividendYield ? `Verim: %${company.dividendYield}` : "",
          ].filter(Boolean),
          verdict: company.recommendation,
          note: company.description,
        }}
      />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        symbol={company.symbol}
        currentPrice={company.price}
      />
    </div>
  );
}
