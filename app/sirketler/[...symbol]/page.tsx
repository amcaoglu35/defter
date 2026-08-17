"use client";

import React, { useState, useEffect, useMemo, useId } from "react";
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
  FileText,
  Send,
  Trash2,
  Layers,
  ArrowRightLeft,
  Activity,
  Share2,
  Bell,
  Info,
  Zap,
  Target,
  BarChart2,
  Flame,
  Newspaper,
  ExternalLink,
  Coins,
  Building,
  Clock,
  Users,
  Globe,
  Calendar,
  Briefcase,
  ChevronDown,
  ChevronUp,
  UserCheck,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  History,
  Check,
  Edit,
  X,
} from "lucide-react";
import { useDefterStore, calculateNetPositionMetrics, Transaction } from "@/lib/store";
import StampBadge from "@/components/StampBadge";
import DataStatusBadge from "@/components/DataStatusBadge";
import TransactionModal from "@/components/TransactionModal";
import ShareCardModal from "@/components/ShareCardModal";
import PriceAlertModal from "@/components/PriceAlertModal";
import PeerComparisonMatrix from "@/components/PeerComparisonMatrix";
import ConfirmModal from "@/components/ConfirmModal";
import { isLiveSymbol } from "@/lib/liveSymbols";
import { useToast } from "@/components/ToastProvider";
import { DeepCompanyData } from "@/app/api/prices/deep/route";
import { TradingViewChart } from "@/components/TradingViewChart";

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
  const rawSymbol = Array.isArray(params?.symbol)
    ? params.symbol.join("/")
    : (params?.symbol as string) || "";
  const symbol = decodeURIComponent(rawSymbol).toUpperCase();
  const { showToast } = useToast();

  const {
    companies,
    toggleWatchlist,
    companyNotes,
    addNote,
    updateNote,
    deleteNote,
    transactions,
    deleteTransaction,
    baskets,
    aiProvider,
    geminiModel,
    userSettings,
    triggeredAlerts,
    clearTriggeredAlerts,
  } = useDefterStore();

  const company = companies.find((c) => c.symbol.toUpperCase() === symbol);
  const chartUid = useId();
  const chartGradId = `company-chart-grad-${chartUid}`;

  const [period, setPeriod] = useState<PeriodType>("6A");
  const [newNote, setNewNote] = useState("");
  const [noteIndexToDelete, setNoteIndexToDelete] = useState<number | null>(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [isAlertHistoryOpen, setIsAlertHistoryOpen] = useState(false);
  const [aiReport, setAiReport] = useState<CompanyDiagnosisReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Live Historical Chart, News, KAP & Deep Analytics State
  const [historyData, setHistoryData] = useState<{ date: string; close: number }[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [newsItems, setNewsItems] = useState<{ id: string; title: string; link: string; publisher: string; timeAgo: string }[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [kapDisclosures, setKapDisclosures] = useState<{ id: string; title: string; disclosureType: string; publishDate: string; timeAgo: string; kapUrl: string }[]>([]);
  const [kapLoading, setKapLoading] = useState(false);
  const [deepData, setDeepData] = useState<DeepCompanyData | null>(null);
  const [deepLoading, setDeepLoading] = useState(false);
  const [showDeepAnalytics, setShowDeepAnalytics] = useState(false);
  const [tefasData, setTefasData] = useState<{
    code: string;
    price: number;
    date: string;
    totalValue?: number;
    sharesCount?: number;
    investorCount?: number;
    dailyChangePct?: number;
  } | null>(null);
  const [tefasLoading, setTefasLoading] = useState(false);

  // Reset state when navigating between companies without full page reload
  const [prevSymbol, setPrevSymbol] = useState(symbol);
  if (symbol !== prevSymbol) {
    setPrevSymbol(symbol);
    setAiReport(null);
    setNewNote("");
    setPeriod("6A");
    setAiLoading(false);
    setHistoryData(null);
    setNewsItems([]);
    setKapDisclosures([]);
    setDeepData(null);
    setDeepLoading(false);
    setShowDeepAnalytics(false);
    setTefasData(null);
    setTefasLoading(false);
  }

  // Fetch Deep Corporate Fundamentals, Fund Data & Insider Data (auto for funds/ETFs or on demand)
  useEffect(() => {
    if (!company || !isLiveSymbol(company.symbol)) return;
    if (!showDeepAnalytics && company.assetClass !== "fon") return;
    if (deepData) return;

    let isCancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Asenkron derin temel analiz veri çekme
    setDeepLoading(true);

    fetch(`/api/prices/deep?symbol=${encodeURIComponent(company.symbol)}`)
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.success && res.data) {
          setDeepData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setDeepLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [company, showDeepAnalytics, deepData]);

  // Fetch Live TEFAS Fund Data (for Turkish Investment Funds)
  useEffect(() => {
    if (!company) return;
    if (company.assetClass !== "fon" && company.indexTag !== "TEFAS") return;

    let isCancelled = false;
    setTefasLoading(true);

    fetch(`/api/prices/tefas?code=${encodeURIComponent(company.symbol)}`)
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.success && res.data) {
          setTefasData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setTefasLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [company]);

  // Fetch Live Historical Candlesticks / Close Series
  useEffect(() => {
    if (!company) return;
    let isCancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Asenkron fiyat geçmişi veri çekme yan etkisi
    setHistoryLoading(true);

    fetch(`/api/prices/history?symbol=${encodeURIComponent(company.symbol)}&period=${period}`)
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.success && Array.isArray(res.data) && res.data.length >= 2) {
          setHistoryData(res.data);
        } else if (!isCancelled) {
          setHistoryData(null);
        }
      })
      .catch(() => {
        if (!isCancelled) setHistoryData(null);
      })
      .finally(() => {
        if (!isCancelled) setHistoryLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [company, period]);

  // Fetch Live Google News & Yahoo Finance Feed
  useEffect(() => {
    if (!company) return;
    let isCancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Asenkron haber akışı veri çekme yan etkisi
    setNewsLoading(true);

    fetch(`/api/prices/news?symbol=${encodeURIComponent(company.symbol)}&name=${encodeURIComponent(company.name)}`)
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.success && Array.isArray(res.data)) {
          setNewsItems(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setNewsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [company]);

  // Fetch Official KAP (Kamuyu Aydınlatma Platformu) Disclosures
  useEffect(() => {
    if (!company) return;
    let isCancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Asenkron KAP veri çekme
    setKapLoading(true);

    fetch(`/api/prices/kap?symbol=${encodeURIComponent(company.symbol)}`)
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.success && Array.isArray(res.data)) {
          setKapDisclosures(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setKapLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [company]);

  // Dynamic Sector Peer Averages & Peer List (Real calculation from kütük)
  const { sectorMetrics, peerList } = useMemo(() => {
    if (!company) return { sectorMetrics: { avgPe: null, avgPb: null, peerCount: 0 }, peerList: [] };
    const peers = companies.filter(
      (c) => c.sector === company.sector && c.symbol.toUpperCase() !== company.symbol.toUpperCase()
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

    return {
      sectorMetrics: { avgPe, avgPb, peerCount: peers.length },
      peerList: peers.slice(0, 5),
    };
  }, [companies, company]);

  // Dynamic Chart Points & Date Labels (Uses 100% Real Live History if available, else smooth calibrated curve)
  const chartData = useMemo(() => {
    if (!company) return { points: [], pathD: "", areaD: "", labels: [], minPrice: 0, maxPrice: 0, isLive: false };

    const svgWidth = 500;
    const svgHeight = 120;

    // IF REAL HISTORICAL DATA IS AVAILABLE
    if (historyData && historyData.length >= 2) {
      const values = historyData.map((d) => d.close);
      const minPrice = Math.min(...values);
      const maxPrice = Math.max(...values);
      const range = maxPrice - minPrice || 1;

      const coords = values.map((v, idx) => {
        const x = (idx / (values.length - 1)) * svgWidth;
        const y = svgHeight - ((v - minPrice) / range) * (svgHeight - 24) - 12;
        return { x, y, val: v, date: historyData[idx].date };
      });

      let pathD = `M ${coords[0].x},${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const curr = coords[i];
        const next = coords[i + 1];
        const cpX = (curr.x + next.x) / 2;
        pathD += ` C ${cpX},${curr.y} ${cpX},${next.y} ${next.x},${next.y}`;
      }

      const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

      // Generate 5-6 date labels evenly spaced
      const labelIndices = [0, Math.floor(historyData.length * 0.25), Math.floor(historyData.length * 0.5), Math.floor(historyData.length * 0.75), historyData.length - 1];
      const labels = labelIndices.map((idx) => {
        const d = historyData[idx];
        if (!d) return "";
        try {
          const dt = new Date(d.date);
          return dt.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
        } catch {
          return d.date;
        }
      });

      return { points: coords, pathD, areaD, labels, minPrice, maxPrice, isLive: true };
    }

    // FALLBACK CALIBRATED CURVE
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

    const betaFactor = company.beta && company.beta > 0 ? company.beta : 1.0;
    const volatility = currentPrice * (period === "1A" ? 0.04 : period === "3A" ? 0.09 : period === "6A" ? 0.16 : 0.28) * betaFactor;
    
    let startPrice = currentPrice;
    if (period === "1Y" && company.oneYearReturn !== undefined && company.oneYearReturn !== null) {
      startPrice = currentPrice / (1 + (company.oneYearReturn / 100));
    } else {
      const trendFactor = (dailyChg >= 0 ? 0.06 : -0.06) * (period === "1A" ? 0.5 : period === "3A" ? 1.0 : 1.5);
      startPrice = currentPrice * (1 - trendFactor);
    }

    const values: number[] = [];
    for (let i = 0; i < stepCount; i++) {
      const progress = i / (stepCount - 1);
      const noise = (pseudoRandom(i) - 0.5) * volatility * (1 - progress * 0.75);
      const trend = startPrice + (currentPrice - startPrice) * progress;
      const p = Math.max(trend + noise, currentPrice * 0.15);
      values.push(p);
    }
    values[values.length - 1] = currentPrice;

    const minPrice = Math.min(...values);
    const maxPrice = Math.max(...values);
    const range = maxPrice - minPrice || 1;

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

    return { points: coords, pathD, areaD, labels, minPrice, maxPrice, isLive: false };
  }, [company, period, historyData]);

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

  const companyTriggeredAlerts = useMemo(() => {
    if (!company || !Array.isArray(triggeredAlerts)) return [];
    return triggeredAlerts.filter(
      (a) => a.symbol.toUpperCase() === company.symbol.toUpperCase()
    );
  }, [company, triggeredAlerts]);

  // User's Position & Net Profit Metrics (Commission & BSMV)
  const positionMetrics = useMemo(() => {
    if (!company || companyTransactions.length === 0) return null;
    let buyQty = 0;
    let buyCost = 0;
    let sellQty = 0;

    for (const tx of companyTransactions) {
      if (tx.type === "BUY") {
        buyQty += tx.quantity;
        buyCost += tx.totalAmount;
      } else if (tx.type === "SELL") {
        sellQty += tx.quantity;
      }
    }

    const currentQty = Math.max(0, buyQty - sellQty);
    if (currentQty <= 0) return null;

    const avgCost = buyQty > 0 ? buyCost / buyQty : company.price;
    return calculateNetPositionMetrics(
      currentQty,
      avgCost,
      company.price,
      userSettings?.commissionRate ?? 0.15,
      userSettings?.bsmvRate ?? 5
    );
  }, [company, companyTransactions, userSettings]);

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

          {/* Triggered Alert History Button */}
          <button
            onClick={() => setIsAlertHistoryOpen(true)}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-2)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer relative"
            title="Tetiklenen Alarm Geçmişi"
          >
            <History className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>Alarm Geçmişi</span>
            {companyTriggeredAlerts.length > 0 && (
              <span className="bg-[var(--brass)] text-[var(--ink)] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {companyTriggeredAlerts.length}
              </span>
            )}
          </button>

          {/* Compare Link */}
          <Link
            href={`/karsilastir?semboller=${company.symbol}`}
            className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] bg-[var(--ink-2)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Diğer Şirketlerle Karşılaştır"
          >
            <Scale className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>Karşılaştır</span>
          </Link>

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
          {/* TradingView Lightweight Charts (Interactive Canvas, Candlestick & Area) */}
          <TradingViewChart
            data={historyData || []}
            symbol={company.symbol}
            currency={company.currency}
            period={period}
            onPeriodChange={setPeriod}
            loading={historyLoading}
          />

          {/* Google / Yahoo Finance Live Market & Likidity Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Canlı Piyasa &amp; Likidite Göstergeleri
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isLiveSymbol(company.symbol) ? (
                  <span className="font-mono text-[10px] text-[var(--brass)] uppercase bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-0.5 rounded font-bold">
                    Yahoo Finance / Canlı Veri
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-[var(--mist)] uppercase bg-[var(--ink-3)] border border-[var(--line)] px-2 py-0.5 rounded font-medium">
                    Tahmini Gösterge (Örnek Veri)
                  </span>
                )}
                <DataStatusBadge symbol={company.symbol} isLive={isLiveSymbol(company.symbol)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 52-Week Range Bar */}
              {(() => {
                const high52 = company.high52 || Number((company.price * 1.22).toFixed(2));
                const low52 = company.low52 || Number((company.price * 0.72).toFixed(2));
                const athDiscount = high52 > 0 ? (((high52 - company.price) / high52) * 100).toFixed(1) : "0.0";
                const rangePct = high52 > low52 ? Math.min(100, Math.max(0, ((company.price - low52) / (high52 - low52)) * 100)) : 50;

                return (
                  <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[var(--mist)] uppercase flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-[var(--brass)]" />
                        <span>52 Haftalık Zirve &amp; Dip</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-[var(--brass)]">
                        {parseFloat(athDiscount) <= 5
                          ? "🎯 Zirvesine Çok Yakın"
                          : `-%${athDiscount} İskontolu`}
                      </span>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-1">
                      <div className="relative w-full h-2 bg-[var(--ink)] rounded-full overflow-hidden border border-[var(--line)]">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--loss)] via-[var(--brass)] to-[var(--verdigris)] rounded-full"
                          style={{ width: `${rangePct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[var(--mist)] pt-0.5">
                        <span>52H Dip: {low52.toLocaleString("tr-TR")} {company.currency}</span>
                        <span className="font-bold text-[var(--paper)]">Şimdi: {company.price.toLocaleString("tr-TR")}</span>
                        <span>52H Zirve: {high52.toLocaleString("tr-TR")} {company.currency}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Day Range & Open Price */}
              {(() => {
                const dayHigh = company.dayHigh || Number((company.price * 1.018).toFixed(2));
                const dayLow = company.dayLow || Number((company.price * 0.985).toFixed(2));
                const openPrice = company.openPrice || Number((company.price / (1 + (company.dailyChange || 0) / 100)).toFixed(2));
                const dayRangePct = dayHigh > dayLow ? Math.min(100, Math.max(0, ((company.price - dayLow) / (dayHigh - dayLow)) * 100)) : 50;

                return (
                  <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[var(--mist)] uppercase flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[var(--verdigris)]" />
                        <span>Günün İşlem Aralığı (Spread)</span>
                      </span>
                      <span className="font-mono text-xs text-[var(--mist)]">
                        Açılış: <strong className="text-[var(--paper)]">{openPrice.toLocaleString("tr-TR")} {company.currency}</strong>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="relative w-full h-2 bg-[var(--ink)] rounded-full overflow-hidden border border-[var(--line)]">
                        <div
                          className="h-full bg-[var(--verdigris)] rounded-full"
                          style={{ width: `${dayRangePct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] text-[var(--mist)] pt-0.5">
                        <span>Gün En Düşük: {dayLow.toLocaleString("tr-TR")}</span>
                        <span>Gün En Yüksek: {dayHigh.toLocaleString("tr-TR")}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Volume & Spike Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-dashed border-[var(--line)] font-mono text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-[var(--mist)] text-[11px] uppercase block">Günlük Hacim:</span>
                  <span className="font-bold text-[var(--paper)]">
                    {company.volume ? `${(company.volume / 1000).toFixed(0)} Bin Lot` : "Canlı Akışta"}
                  </span>
                </div>
                {company.avgVolume && (
                  <div>
                    <span className="text-[var(--mist)] text-[11px] uppercase block">3 Aylık Ort. Hacim:</span>
                    <span className="text-[var(--paper-dim)]">
                      {(company.avgVolume / 1000).toFixed(0)} Bin Lot
                    </span>
                  </div>
                )}
              </div>

              {company.volumeRatio && company.volumeRatio >= 1.4 ? (
                <div className="inline-flex items-center gap-1.5 bg-[rgba(201,162,75,0.15)] text-[var(--brass)] border border-[var(--brass)] px-3 py-1 rounded font-bold">
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                  <span>⚡ %{Math.round((company.volumeRatio - 1) * 100)} Hacim Patlaması &amp; Para Girişi</span>
                </div>
              ) : (
                <div className="text-[11px] text-[var(--mist)]">
                  Hacim / Likidite Durumu: <strong className="text-[var(--verdigris)]">Normal &amp; Dengeli</strong>
                </div>
              )}
            </div>
          </div>

          {/* Key Financial Metrics or Fund Analytics (AssetClass-Adaptive) */}
          {company.assetClass === "fon" ? (
            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold">
                    Fon Kütük Değerleri &amp; Portföy Analizi
                  </h3>
                  {tefasData ? (
                    <span className="text-[10px] font-mono text-[var(--verdigris)] bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] px-1.5 py-0.5 rounded font-bold">
                      🏛️ TEFAS Canlı Veri ({tefasData.date})
                    </span>
                  ) : deepData?.fundData ? (
                    <span className="text-[10px] font-mono text-[var(--verdigris)] bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] px-1.5 py-0.5 rounded font-bold">
                      Canlı ETF Verisi
                    </span>
                  ) : tefasLoading ? (
                    <span className="text-[10px] font-mono text-[var(--mist)] animate-pulse">
                      TEFAS taranıyor...
                    </span>
                  ) : null}
                </div>
                {company.riskLevel && (
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[var(--ink-3)] border border-[var(--line)] text-[var(--brass)]">
                    Risk Değeri: <strong>{company.riskLevel}/7</strong>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    {tefasData?.dailyChangePct !== undefined ? "Günlük / 1Y Getiri" : "1 Yıllık Getiri"}
                  </span>
                  <div className={`font-mono text-lg font-bold mt-1 ${
                    (tefasData?.dailyChangePct ?? deepData?.fundData?.annualReturns?.oneYear ?? company.oneYearReturn ?? 0) >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                  }`}>
                    {tefasData?.dailyChangePct !== undefined
                      ? `%${tefasData.dailyChangePct >= 0 ? "+" : ""}${tefasData.dailyChangePct}`
                      : deepData?.fundData?.annualReturns?.oneYear !== undefined
                      ? `%${deepData.fundData.annualReturns.oneYear}`
                      : (company.oneYearReturn !== undefined ? `%${company.oneYearReturn}` : "-")}
                  </div>
                  <span className="text-[10px] text-[var(--mist)]">
                    {tefasData?.dailyChangePct !== undefined
                      ? (company.oneYearReturn ? `1Y: %${company.oneYearReturn}` : "TEFAS Günlük Kapanış")
                      : deepData?.fundData?.annualReturns?.threeYear !== undefined
                      ? `3Y Getiri: %${deepData.fundData.annualReturns.threeYear}`
                      : (company.threeYearReturn ? `3Y Getiri: %${company.threeYearReturn}` : "Yıllık Nominal")}
                  </span>
                </div>

                <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    {tefasData?.investorCount ? "Yatırımcı Sayısı" : "Yönetim Gideri"}
                  </span>
                  <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1">
                    {tefasData?.investorCount
                      ? `${tefasData.investorCount.toLocaleString("tr-TR")} kişi`
                      : deepData?.fundData?.expenseRatio !== undefined
                      ? `%${deepData.fundData.expenseRatio}`
                      : (company.expenseRatio !== undefined ? `%${company.expenseRatio}` : "-")}
                  </div>
                  <span className="text-[10px] text-[var(--mist)]">
                    {tefasData?.investorCount
                      ? (company.expenseRatio ? `TER: %${company.expenseRatio}` : "Aktif Hissedar")
                      : "Yıllık Masraf Oranı (TER)"}
                  </span>
                </div>

                <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    Fon Büyüklüğü (AUM)
                  </span>
                  <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1 truncate">
                    {tefasData?.totalValue
                      ? `${(tefasData.totalValue / 1e9).toFixed(2)} Mr ₺`
                      : company.aum || (deepData?.fundData?.cashPosition !== undefined ? `Nakit: %${deepData.fundData.cashPosition}` : "—")}
                  </div>
                  <span className="text-[10px] text-[var(--mist)]">
                    {tefasData?.sharesCount
                      ? `${(tefasData.sharesCount / 1e6).toFixed(2)} Mn Pay`
                      : deepData?.fundData?.categoryName || "Toplam Net Varlık"}
                  </span>
                </div>

                <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    Yönetici Kurum / Aile
                  </span>
                  <div className="font-mono text-sm font-bold text-[var(--paper)] mt-1 truncate">
                    {deepData?.fundData?.fundFamily || company.fundManager || company.exchange}
                  </div>
                  <span className="text-[10px] text-[var(--mist)] truncate block">
                    {company.fundType || deepData?.fundData?.categoryName || "Portföy Fonu"}
                  </span>
                </div>
              </div>

              {/* Top Holdings / En Büyük Pozisyonlar (Live ETF Holdings with fallback) */}
              {deepData?.fundData?.topHoldings && deepData.fundData.topHoldings.length > 0 ? (
                <div className="pt-3 border-t border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--mist)] uppercase tracking-wider block font-semibold">
                      Canlı En Yüksek Ağırlıklı Pozisyonlar (Top 10 Holdings)
                    </span>
                    <span className="text-[10px] font-mono text-[var(--brass)]">Yahoo Finance Live</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {deepData.fundData.topHoldings.map((h, idx) => (
                      <div
                        key={idx}
                        className="bg-[var(--ink-3)] border border-[var(--line)] p-2 rounded text-xs font-mono flex items-center justify-between"
                      >
                        <div className="truncate pr-1">
                          <span className="font-bold text-[var(--paper)]">{h.symbol || h.holdingName}</span>
                          {h.symbol && h.holdingName && (
                            <span className="text-[10px] text-[var(--mist)] block truncate">{h.holdingName}</span>
                          )}
                        </div>
                        <span className="text-[var(--verdigris)] font-bold shrink-0">
                          {h.holdingPercent ? `%${h.holdingPercent}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : company.topHoldings && company.topHoldings.length > 0 ? (
                <div className="pt-3 border-t border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase tracking-wider block mb-2">
                    En Yüksek Ağırlıklı Pozisyonlar (Top Holdings)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {company.topHoldings.map((h, idx) => (
                      <span
                        key={idx}
                        className="bg-[var(--ink-3)] border border-[var(--line)] px-3 py-1.5 rounded text-xs font-mono text-[var(--paper)] font-semibold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold">
                Finansal Kütük Değerleri &amp; Temel Çarpanlar
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
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

                <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
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

                <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    Temettü Verimi
                  </span>
                  <div className="font-mono text-lg font-bold text-[var(--verdigris)] mt-1">
                    {company.dividendYield !== undefined && company.dividendYield !== null ? `%${company.dividendYield}` : "-"}
                  </div>
                  <span className="text-[10px] text-[var(--mist)]">Yıllık Dağıtım</span>
                </div>

                <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
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

                <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    HBK (Hisse Başı Kâr)
                  </span>
                  <div className="font-mono text-lg font-bold text-[var(--brass)] mt-1">
                    {company.eps !== undefined && company.eps !== null ? `${company.eps} ₺` : "—"}
                  </div>
                  <span className="text-[10px] text-[var(--mist)]">12 Aylık Net EPS</span>
                </div>

                <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    Ödenmiş Sermaye
                  </span>
                  <div className="font-mono text-sm font-bold text-[var(--paper)] mt-1.5 truncate">
                    {company.sharesOutstanding || "—"}
                  </div>
                  <span className="text-[10px] text-[var(--mist)]">Dolaşımdaki Lot</span>
                </div>
              </div>

              {/* Advanced Multiples (defaultKeyStatistics) if available */}
              {deepData?.keyStatistics && (
                <div className="pt-3 border-t border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[var(--mist)] uppercase tracking-wider block font-semibold">
                      İleriye Dönük Değerleme Çarpanları &amp; Likidite Rasyoları
                    </span>
                    <span className="text-[10px] font-mono text-[var(--brass)]">Canlı Değerleme</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                    {deepData.keyStatistics.forwardPE !== undefined && (
                      <div className="bg-[var(--ink-3)] p-2.5 rounded border border-[var(--line)] flex justify-between items-center">
                        <span className="text-[var(--mist)]">Forward F/K:</span>
                        <span className="font-bold text-[var(--paper)]">{deepData.keyStatistics.forwardPE}x</span>
                      </div>
                    )}
                    {deepData.keyStatistics.pegRatio !== undefined && (
                      <div className="bg-[var(--ink-3)] p-2.5 rounded border border-[var(--line)] flex justify-between items-center">
                        <span className="text-[var(--mist)]">PEG Oranı:</span>
                        <span className="font-bold text-[var(--paper)]">{deepData.keyStatistics.pegRatio}</span>
                      </div>
                    )}
                    {deepData.keyStatistics.priceToSales !== undefined && (
                      <div className="bg-[var(--ink-3)] p-2.5 rounded border border-[var(--line)] flex justify-between items-center">
                        <span className="text-[var(--mist)]">Fiyat / Satış (P/S):</span>
                        <span className="font-bold text-[var(--paper)]">{deepData.keyStatistics.priceToSales}x</span>
                      </div>
                    )}
                    {deepData.keyStatistics.enterpriseToEbitda !== undefined && (
                      <div className="bg-[var(--ink-3)] p-2.5 rounded border border-[var(--line)] flex justify-between items-center">
                        <span className="text-[var(--mist)]">FD / FAVÖK:</span>
                        <span className="font-bold text-[var(--paper)]">{deepData.keyStatistics.enterpriseToEbitda}x</span>
                      </div>
                    )}
                    {deepData.keyStatistics.shortRatio !== undefined && (
                      <div className="bg-[var(--ink-3)] p-2.5 rounded border border-[var(--line)] flex justify-between items-center">
                        <span className="text-[var(--mist)]">Short Ratio:</span>
                        <span className="font-bold text-[var(--brass)]">{deepData.keyStatistics.shortRatio} gün</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Metrics from Kütük (Renders company.metrics) */}
              {company.metrics && company.metrics.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--line)]">
                  <span className="text-[11px] font-mono text-[var(--mist)] uppercase tracking-wider block mb-2.5">
                    Ek Finansal Rasyolar &amp; Sektör Kıyaslamaları
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {company.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-[var(--ink-3)] border border-[var(--line)] p-2.5 rounded-lg flex items-center justify-between font-mono text-xs"
                      >
                        <span className="text-[var(--mist)]">{m.label}:</span>
                        <div className="text-right">
                          <span className="font-bold text-[var(--paper)]">{m.value}</span>
                          {m.peerAvg && (
                            <span className="text-[10px] text-[var(--mist)] block">
                              Sektör: {m.peerAvg}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Financial Highlights (Bilanço & Kârlılık Dinamikleri) */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Bilanço &amp; Kârlılık Dinamikleri
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[var(--brass)] bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-0.5 rounded font-bold">
                12 Aylık Finansal Özet
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Toplam Hasılat (Ciro)
                </span>
                <div className="font-mono text-base font-bold text-[var(--paper)] mt-1 truncate">
                  {company.totalRevenue || "—"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Yıllık Satışlar</span>
              </div>

              <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Yıllık Net Kâr
                </span>
                <div className="font-mono text-base font-bold text-[var(--verdigris)] mt-1 truncate">
                  {company.netIncome || "—"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Dönem Net Kârı</span>
              </div>

              <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Özsermaye Kârlılığı (ROE)
                </span>
                <div className="font-mono text-base font-bold text-[var(--paper)] mt-1">
                  {company.returnOnEquity !== undefined ? `%${company.returnOnEquity}` : "—"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Sermaye Verimi</span>
              </div>

              <div className="bg-[var(--ink-3)] p-3 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Faaliyet Kâr Marjı
                </span>
                <div className="font-mono text-base font-bold text-[var(--paper)] mt-1">
                  {company.operatingMargin !== undefined ? `%${company.operatingMargin}` : "—"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Operasyonel Marj</span>
              </div>
            </div>

            {/* Future Analyst EPS Expectations (earningsTrend) */}
            {deepData?.earningsTrend && (
              <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-[var(--brass)]" />
                  <span className="text-[var(--mist)]">
                    Analist EPS Beklentisi ({deepData.earningsTrend.period}):
                  </span>
                  <span className="font-bold text-[var(--paper)]">
                    {deepData.earningsTrend.epsEstimateAvg !== undefined ? `${deepData.earningsTrend.epsEstimateAvg} ${company.currency}` : "—"}
                  </span>
                </div>
                {deepData.earningsTrend.epsGrowthPercent !== undefined && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[var(--mist)]">Beklenen Büyüme:</span>
                    <span className={`font-bold ${deepData.earningsTrend.epsGrowthPercent >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                      %{deepData.earningsTrend.epsGrowthPercent}
                    </span>
                    {deepData.earningsTrend.numberOfAnalysts && (
                      <span className="text-[10px] text-[var(--mist)]">({deepData.earningsTrend.numberOfAnalysts} Analist)</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sektörel Rakip Kıyaslama Radarı (Peer Comparison Matrix) */}
          <PeerComparisonMatrix currentCompany={company} allCompanies={companies} />

          {/* Live Google News & Official KAP Disclosures Feed Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  {company.symbol} Canlı Şirket Haberleri &amp; KAP Akışı
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {newsLoading || kapLoading ? (
                  <span className="font-mono text-[10px] text-[var(--mist)] animate-pulse">
                    Akış taranıyor...
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-[var(--verdigris)] bg-[rgba(91,140,123,0.15)] border border-[var(--verdigris)] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--verdigris)] animate-pulse"></span>
                    Google Haberler &amp; Yahoo
                  </span>
                )}
              </div>
            </div>

            {/* Official KAP (Kamuyu Aydınlatma Platformu) Section */}
            {kapDisclosures.length > 0 && (
              <div className="space-y-2 pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[var(--brass)] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏛️ Resmi KAP Bildirimleri</span>
                  </span>
                  <a
                    href={`https://www.kap.org.tr/tr/sirket-bilgileri/ozet/${company.symbol}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-[var(--mist)] hover:text-[var(--brass)] flex items-center gap-1"
                  >
                    <span>KAP Sayfası</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-2">
                  {kapDisclosures.map((k) => (
                    <a
                      key={k.id}
                      href={k.kapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-[var(--ink-3)] hover:bg-[rgba(201,162,75,0.08)] border border-[var(--brass-dim)]/50 hover:border-[var(--brass)] rounded-lg transition-all group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--mist)] mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[var(--brass)] font-bold bg-[var(--brass-glow)] px-1.5 py-0.5 rounded text-[10px]">
                            {k.disclosureType}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[var(--mist)]" />
                            {k.timeAgo}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--mist)] group-hover:text-[var(--brass)] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h4 className="text-xs font-semibold text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors line-clamp-2 leading-relaxed">
                        {k.title}
                      </h4>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Financial News Stream */}
            {newsItems.length > 0 ? (
              <div className="space-y-2">
                {kapDisclosures.length > 0 && (
                  <span className="font-mono text-[11px] font-bold text-[var(--mist)] uppercase tracking-wider block pt-2 border-t border-dashed border-[var(--line)]">
                    Piyasa &amp; Basın Haberleri
                  </span>
                )}
                <div className="space-y-2.5">
                  {newsItems.map((n) => (
                    <a
                      key={n.id}
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-[var(--ink-3)] hover:bg-[rgba(201,162,75,0.05)] border border-[var(--line)] hover:border-[var(--brass-dim)] rounded-lg transition-all group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--mist)] mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[var(--brass)] font-semibold">{n.publisher}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[var(--mist)]" />
                            {n.timeAgo}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--mist)] group-hover:text-[var(--brass)] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h4 className="text-xs font-semibold text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors line-clamp-2 leading-relaxed">
                        {n.title}
                      </h4>
                    </a>
                  ))}
                </div>
              </div>
            ) : !newsLoading && kapDisclosures.length === 0 ? (
              <div className="py-6 text-center text-xs font-mono text-[var(--mist)] space-y-2">
                <p>Bu şirket için güncel haber bulunamadı.</p>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(company.symbol + " " + company.name + " hisse haberleri")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--brass)] hover:underline"
                >
                  <span>Google&apos;da Ara</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : null}
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

          {/* Yahoo Finance Deep Fundamentals & Insider Trading Card */}
          {isLiveSymbol(company.symbol) && (
            <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)]/70 rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[var(--brass)]" />
                  <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                    İçeriden İşlemler &amp; Derin Şirket Verileri
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[var(--brass)] bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-0.5 rounded font-bold">
                    Yahoo Finance • QuoteSummary
                  </span>
                  <button
                    onClick={() => setShowDeepAnalytics((prev) => !prev)}
                    className="font-mono text-xs text-[var(--brass)] hover:text-[var(--paper)] bg-[var(--ink-3)] border border-[var(--line)] px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{showDeepAnalytics ? "Gizle" : "Detaylı Analiz Göster"}</span>
                    {showDeepAnalytics ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {!showDeepAnalytics ? (
                <p className="text-xs text-[var(--mist)] font-mono leading-relaxed">
                  Yönetici/büyük ortakların içeriden hisse alım-satım kayıtları (Insider Trading), kurumsal ortaklık yüzdeleri, 4 aylık analist görüş dağılım trendi ve tarihsel gelir tablosu verilerini görüntülemek için &quot;Detaylı Analiz Göster&quot; butonuna tıklayın.
                </p>
              ) : deepLoading ? (
                <div className="py-8 text-center text-xs font-mono text-[var(--mist)] space-y-2 animate-pulse">
                  <div className="w-5 h-5 border-2 border-[var(--brass)] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Yahoo Finance derinlemesine kurumsal veriler taranıyor...</p>
                </div>
              ) : !deepData || (
                !deepData.insiderTransactions?.length &&
                !deepData.majorHoldersBreakdown &&
                !deepData.recommendationTrend?.length &&
                !deepData.incomeStatementHistory?.length &&
                !deepData.upgradeDowngradeHistory?.length
              ) ? (
                <p className="text-xs text-[var(--mist)] font-mono py-4 text-center">
                  Bu varlık için ek kurumsal/içeriden işlem detayı bulunamadı.
                </p>
              ) : (
                <div className="space-y-6 pt-1 animate-in fade-in">
                  {/* 1. Major Holders Breakdown */}
                  {deepData.majorHoldersBreakdown && (
                    <div className="space-y-2.5">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold flex items-center gap-1.5">
                        <PieChart className="w-3.5 h-3.5" />
                        <span>Ortaklık Yapısı &amp; Kurumsal Sahiplik</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {deepData.majorHoldersBreakdown.insidersPercentHeld !== undefined && (
                          <div className="bg-[var(--ink-3)] p-3 rounded-lg border border-[var(--line)]">
                            <span className="text-[10px] font-mono text-[var(--mist)] uppercase block">İçeriden / Yönetim Payı</span>
                            <div className="font-mono text-lg font-bold text-[var(--brass)] mt-1">
                              %{deepData.majorHoldersBreakdown.insidersPercentHeld}
                            </div>
                            <span className="text-[10px] text-[var(--mist)]">Büyük Ortaklar</span>
                          </div>
                        )}
                        {deepData.majorHoldersBreakdown.institutionsPercentHeld !== undefined && (
                          <div className="bg-[var(--ink-3)] p-3 rounded-lg border border-[var(--line)]">
                            <span className="text-[10px] font-mono text-[var(--mist)] uppercase block">Kurumsal Fon Payı</span>
                            <div className="font-mono text-lg font-bold text-[var(--verdigris)] mt-1">
                              %{deepData.majorHoldersBreakdown.institutionsPercentHeld}
                            </div>
                            <span className="text-[10px] text-[var(--mist)]">Yatırım Fonları</span>
                          </div>
                        )}
                        {deepData.majorHoldersBreakdown.institutionsCount !== undefined && (
                          <div className="bg-[var(--ink-3)] p-3 rounded-lg border border-[var(--line)]">
                            <span className="text-[10px] font-mono text-[var(--mist)] uppercase block">Kurumsal Yatırımcı</span>
                            <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1">
                              {deepData.majorHoldersBreakdown.institutionsCount} Kurum
                            </div>
                            <span className="text-[10px] text-[var(--mist)]">Hissedar Fon Sayısı</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. Insider Transactions */}
                  {deepData.insiderTransactions && deepData.insiderTransactions.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-dashed border-[var(--line)]">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>İçeriden İşlemler (Yönetici &amp; Büyük Ortak Alım-Satımları)</span>
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs">
                          <thead>
                            <tr className="border-b border-[var(--line)] text-[var(--mist)] text-[10px] uppercase">
                              <th className="pb-2">Yetkili / Filer</th>
                              <th className="pb-2">İlişki / Unvan</th>
                              <th className="pb-2">İşlem</th>
                              <th className="pb-2 text-right">Lot Miktarı</th>
                              <th className="pb-2 text-right">Tarih</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--line)]/50">
                            {deepData.insiderTransactions.map((tx, idx) => {
                              const isBuy = tx.transactionText?.toLowerCase().includes("buy") || tx.transactionText?.toLowerCase().includes("purchase") || tx.transactionText?.toLowerCase().includes("alış");
                              const isSell = tx.transactionText?.toLowerCase().includes("sale") || tx.transactionText?.toLowerCase().includes("sell") || tx.transactionText?.toLowerCase().includes("satış");

                              return (
                                <tr key={idx} className="hover:bg-[var(--ink-3)]/50">
                                  <td className="py-2 text-[var(--paper)] font-bold">{tx.filerName || "—"}</td>
                                  <td className="py-2 text-[var(--mist)]">{tx.filerRelation || "Yönetim / Ortak"}</td>
                                  <td className="py-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      isBuy
                                        ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)]"
                                        : isSell
                                        ? "bg-[rgba(163,59,59,0.15)] text-[var(--loss)]"
                                        : "bg-[var(--ink-3)] text-[var(--paper)]"
                                    }`}>
                                      {tx.transactionText || (isBuy ? "ALIŞ" : isSell ? "SATIŞ" : "İŞLEM")}
                                    </span>
                                  </td>
                                  <td className="py-2 text-right text-[var(--paper)] font-semibold">
                                    {tx.shares ? tx.shares.toLocaleString("tr-TR") : "—"}
                                  </td>
                                  <td className="py-2 text-right text-[var(--mist)] text-[11px]">
                                    {tx.date || "—"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 3. Recommendation Trend */}
                  {deepData.recommendationTrend && deepData.recommendationTrend.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-dashed border-[var(--line)]">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Analist Tavsiye Dağılım Trendi (Son 4 Dönem)</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 font-mono text-xs">
                        {deepData.recommendationTrend.map((t, idx) => {
                          const total = (t.strongBuy || 0) + (t.buy || 0) + (t.hold || 0) + (t.sell || 0) + (t.strongSell || 0);
                          const periodLabel = t.period === "0m" ? "Cari Ay" : t.period === "-1m" ? "1 Ay Önce" : t.period === "-2m" ? "2 Ay Önce" : `${t.period}`;

                          return (
                            <div key={idx} className="bg-[var(--ink-3)] p-3 rounded-lg border border-[var(--line)] space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-[var(--paper)]">{periodLabel}</span>
                                <span className="text-[var(--mist)]">{total} Analist</span>
                              </div>
                              <div className="w-full h-2 rounded-full overflow-hidden flex bg-[var(--ink)]">
                                {t.strongBuy ? <div style={{ width: `${(t.strongBuy / total) * 100}%` }} className="bg-[#2e7d32]" title={`Güçlü Al: ${t.strongBuy}`} /> : null}
                                {t.buy ? <div style={{ width: `${(t.buy / total) * 100}%` }} className="bg-[var(--verdigris)]" title={`Al: ${t.buy}`} /> : null}
                                {t.hold ? <div style={{ width: `${(t.hold / total) * 100}%` }} className="bg-[var(--brass)]" title={`Tut: ${t.hold}`} /> : null}
                                {t.sell ? <div style={{ width: `${(t.sell / total) * 100}%` }} className="bg-[var(--loss)]" title={`Sat: ${t.sell}`} /> : null}
                                {t.strongSell ? <div style={{ width: `${(t.strongSell / total) * 100}%` }} className="bg-[#b71c1c]" title={`Güçlü Sat: ${t.strongSell}`} /> : null}
                              </div>
                              <div className="flex justify-between text-[10px] text-[var(--mist)] pt-0.5">
                                <span className="text-[var(--verdigris)]">Al: {(t.strongBuy || 0) + (t.buy || 0)}</span>
                                <span className="text-[var(--brass)]">Tut: {t.hold || 0}</span>
                                <span className="text-[var(--loss)]">Sat: {(t.sell || 0) + (t.strongSell || 0)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. Income Statement History */}
                  {deepData.incomeStatementHistory && deepData.incomeStatementHistory.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-dashed border-[var(--line)]">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Tarihsel Gelir Tablosu &amp; Yıllık Büyüme Trendi</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                        {deepData.incomeStatementHistory.map((inc, idx) => (
                          <div key={idx} className="bg-[var(--ink-3)] p-3 rounded-lg border border-[var(--line)] space-y-1.5">
                            <div className="text-[11px] font-bold text-[var(--brass)] border-b border-[var(--line)] pb-1">
                              Dönem Sonu: {inc.endDate || `Dönem ${idx + 1}`}
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[var(--mist)]">Toplam Ciro:</span>
                              <span className="font-bold text-[var(--paper)]">
                                {inc.totalRevenue ? `${(inc.totalRevenue / 1e9).toFixed(2)} Mr ${company.currency}` : "—"}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[var(--mist)]">Faaliyet Kârı:</span>
                              <span className="font-bold text-[var(--paper)]">
                                {inc.operatingIncome ? `${(inc.operatingIncome / 1e9).toFixed(2)} Mr ${company.currency}` : "—"}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[var(--mist)]">Net Dönem Kârı:</span>
                              <span className="font-bold text-[var(--verdigris)]">
                                {inc.netIncome ? `${(inc.netIncome / 1e9).toFixed(2)} Mr ${company.currency}` : "—"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Upgrade / Downgrade History */}
                  {deepData.upgradeDowngradeHistory && deepData.upgradeDowngradeHistory.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-dashed border-[var(--line)]">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Analist Not Değişimleri (Upgrade / Downgrade)</span>
                      </h4>
                      <div className="space-y-1.5">
                        {deepData.upgradeDowngradeHistory.map((ud, idx) => (
                          <div key={idx} className="p-2.5 bg-[var(--ink-3)] rounded border border-[var(--line)] flex items-center justify-between font-mono text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[var(--paper)]">{ud.firm || "Aracı Kurum"}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ink)] text-[var(--brass)] border border-[var(--line)]">
                                {ud.action || "Tavsiye"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[var(--mist)]">
                                {ud.fromGrade ? `${ud.fromGrade} → ` : ""}<strong className="text-[var(--verdigris)]">{ud.toGrade}</strong>
                              </span>
                              {ud.date && <span className="text-[10px] text-[var(--mist)]">({ud.date})</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Alış-Satış İşlem Geçmişi & Net Getiri Hesaplayıcı */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold">
                  {company.symbol} Alış &amp; Satış Kayıtları &amp; Net Getiri
                </h3>
                <span className="text-[10px] font-mono text-[var(--mist)]">
                  Kişisel maliyet takibi ve komisyon sonrası net getiri
                </span>
              </div>
              <button
                onClick={() => setTxModalOpen(true)}
                className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-all shadow active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İşlem Ekle</span>
              </button>
            </div>

            {/* Net Return Calculator Summary Box if user has active position */}
            {positionMetrics && (
              <div className="p-4 bg-[var(--ink-3)] rounded-xl border border-[var(--brass-dim)]/60 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                  <span className="text-xs font-bold text-[var(--brass)] flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Pozisyon &amp; Net Kâr Özeti</span>
                  </span>
                  <span className="text-[10px] text-[var(--mist)]">
                    Komisyon: %{positionMetrics.commissionRateUsed} + BSMV
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--mist)] uppercase block">Toplam Maliyet</span>
                    <div className="font-bold text-[var(--paper)] mt-0.5">
                      {positionMetrics.grossCost.toLocaleString("tr-TR")} {company.currency}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--mist)] uppercase block">Güncel Değer</span>
                    <div className="font-bold text-[var(--paper)] mt-0.5">
                      {positionMetrics.grossValue.toLocaleString("tr-TR")} {company.currency}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--mist)] uppercase block">Brüt Kâr/Zarar</span>
                    <div className={`font-bold mt-0.5 ${positionMetrics.grossProfit >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                      {positionMetrics.grossProfit >= 0 ? "+" : ""}{positionMetrics.grossProfit.toLocaleString("tr-TR")} {company.currency}
                      <span className="text-[10px] ml-1">({positionMetrics.grossProfitPercent >= 0 ? "+" : ""}{positionMetrics.grossProfitPercent}%)</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--mist)] uppercase block">Tahmini Net Kâr</span>
                    <div className={`font-bold mt-0.5 text-sm ${positionMetrics.netProfit >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                      {positionMetrics.netProfit >= 0 ? "+" : ""}{positionMetrics.netProfit.toLocaleString("tr-TR")} {company.currency}
                      <span className="text-[10px] ml-1">({positionMetrics.netProfitPercent >= 0 ? "+" : ""}{positionMetrics.netProfitPercent}%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-[var(--mist)]">
                  <div>
                    <span>Tahmini Komisyon &amp; BSMV Kesintisi: </span>
                    <strong className="text-[var(--paper)]">{positionMetrics.totalCommissionAndTaxes.toLocaleString("tr-TR")} {company.currency}</strong>
                    <span> (Alış: {positionMetrics.estimatedBuyCommission} ₺ + Satış: {positionMetrics.estimatedSellCommission} ₺)</span>
                  </div>
                  <span className="italic">
                    * Tahmini veridir, aracı kurum komisyonunu yansıtır.
                  </span>
                </div>
              </div>
            )}

            {companyTransactions.length === 0 ? (
              <p className="text-xs text-[var(--mist)] font-mono py-3 text-center">
                Bu şirket için henüz işlem kaydı girilmedi. &quot;İşlem Ekle&quot; butonuyla portföyünüze maliyet kaydı yapabilirsiniz.
              </p>
            ) : (
              <div className="divide-y divide-dashed divide-[var(--line)]">
                {companyTransactions.map((tx) => {
                  const targetBasket = tx.basketId ? baskets.find((b) => b.id === tx.basketId) : null;
                  return (
                    <div
                      key={tx.id}
                      className="py-2.5 flex items-center justify-between text-xs font-mono group hover:bg-[rgba(201,162,75,0.02)] px-1 rounded transition-colors"
                    >
                      <div className="flex items-center flex-wrap gap-1.5 flex-1 pr-2">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
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
                        {targetBasket && (
                          <span className="text-[10px] bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--line)] px-1.5 py-0.5 rounded">
                            {targetBasket.name}
                          </span>
                        )}
                        {tx.note && (
                          <span className="text-[var(--mist)] italic">
                            ({tx.note})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-bold text-[var(--paper)]">
                            {tx.totalAmount.toLocaleString("tr-TR")} {company.currency}
                          </div>
                          <div className="text-[10px] text-[var(--mist)]">{tx.date}</div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingTx(tx);
                              setTxModalOpen(true);
                            }}
                            className="text-[var(--mist)] hover:text-[var(--brass)] p-1 cursor-pointer transition-colors"
                            title="İşlemi Düzenle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTxToDelete(tx)}
                            className="text-[var(--mist)] hover:text-[var(--loss)] p-1 cursor-pointer transition-colors"
                            title="İşlemi Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sektördeki Benzer Şirketler (Peers) & Hızlı Karşılaştırma Kartı */}
          {peerList.length > 0 && (
            <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[var(--brass)]" />
                  <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                    Sektördeki Benzer Şirketler ({company.sector})
                  </h3>
                </div>
                <Link
                  href={`/karsilastir?semboller=${company.symbol},${peerList.map((p) => p.symbol).join(",")}`}
                  className="font-mono text-xs text-[var(--brass)] hover:underline flex items-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Hepsini Karşılaştır</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {peerList.map((peer) => {
                  const peerPositive = (peer.dailyChange || 0) >= 0;
                  return (
                    <div
                      key={peer.id}
                      className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass-dim)] rounded-xl flex items-center justify-between transition-all group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/sirketler/${encodeURIComponent(peer.symbol)}`}
                            className="font-serif font-bold text-sm text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors"
                          >
                            {peer.symbol}
                          </Link>
                          <span className="text-[10px] px-1 py-0.2 rounded bg-[var(--ink)] text-[var(--mist)] border border-[var(--line)]">
                            {peer.exchange}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--mist)] truncate max-w-[150px] font-sans">
                          {peer.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--mist)]">
                          {peer.peRatio && <span>F/K: <strong className="text-[var(--paper)]">{peer.peRatio}x</strong></span>}
                          {peer.pbRatio && <span>PD/DD: <strong className="text-[var(--paper)]">{peer.pbRatio}x</strong></span>}
                        </div>
                      </div>

                      <div className="text-right space-y-1.5">
                        <div className="font-bold text-sm text-[var(--paper)]">
                          {peer.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {peer.currency}
                        </div>
                        <div className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                          peerPositive ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                        }`}>
                          {peerPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{peerPositive ? `+${peer.dailyChange}%` : `${peer.dailyChange}%`}</span>
                        </div>
                        <Link
                          href={`/karsilastir?semboller=${company.symbol},${peer.symbol}`}
                          className="inline-flex items-center gap-1 text-[10px] text-[var(--brass)] hover:underline"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Kıyasla</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sektörel Emsal Kıyaslama Radarı (Peer Comparison Matrix) */}
          <PeerComparisonMatrix currentCompany={company} allCompanies={companies} />
        </div>

        {/* Right 1 Col: Analyst Targets, Calendar, Profile, Notes & Actions */}
        <div className="space-y-6">
          {/* 1. Analyst Consensus & 12M Price Target Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)]/70 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Piyasa Analist Konsensüsü
                </h3>
              </div>
              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                company.targetMeanPrice && (company.recommendationKey === "strong_buy" || company.recommendationKey === "buy")
                  ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] border border-[var(--verdigris)]"
                  : company.targetMeanPrice && company.recommendationKey === "hold"
                  ? "bg-[rgba(201,162,75,0.2)] text-[var(--brass)] border border-[var(--brass)]"
                  : company.targetMeanPrice && (company.recommendationKey === "sell" || company.recommendationKey === "strong_sell")
                  ? "bg-[rgba(163,59,59,0.2)] text-[var(--loss)] border border-[var(--loss)]"
                  : company.targetMeanPrice
                  ? "bg-[var(--ink-3)] text-[var(--paper)] border border-[var(--line)]"
                  : "bg-[var(--ink-3)] text-[var(--mist)] border border-[var(--line)]"
              }`}>
                {company.targetMeanPrice
                  ? company.recommendationKey === "strong_buy"
                    ? "GÜÇLÜ AL"
                    : company.recommendationKey === "buy"
                    ? "AL"
                    : company.recommendationKey === "hold"
                    ? "TUT"
                    : company.recommendationKey === "sell"
                    ? "SAT"
                    : "KONSENSÜS"
                  : "VERİ YOK"}
              </span>
            </div>

            {company.targetMeanPrice && company.targetMeanPrice > 0 ? (
              <div className="bg-[var(--ink-3)] p-4 rounded-lg border border-[var(--line)] space-y-3 font-mono">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--mist)] uppercase block">
                      12 Aylık Ortalama Hedef
                    </span>
                    <div className="text-2xl font-bold text-[var(--paper)] mt-0.5">
                      {company.targetMeanPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {company.currency}
                    </div>
                  </div>

                  {company.targetUpsidePct !== undefined && company.targetUpsidePct !== null && (
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">
                        Potansiyel Getiri
                      </span>
                      <div className={`text-lg font-bold mt-0.5 ${company.targetUpsidePct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                        {company.targetUpsidePct >= 0 ? `+${company.targetUpsidePct}%` : `${company.targetUpsidePct}%`}
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Price Range Slider */}
                {(company.targetLowPrice || company.targetHighPrice) && (
                  <div className="space-y-1.5 pt-2 border-t border-[var(--line)]/60">
                    <div className="flex justify-between text-[10px] text-[var(--mist)]">
                      <span>En Düşük: {company.targetLowPrice ? `${company.targetLowPrice} ${company.currency}` : "—"}</span>
                      <span>En Yüksek: {company.targetHighPrice ? `${company.targetHighPrice} ${company.currency}` : "—"}</span>
                    </div>
                    {company.targetUpsidePct !== undefined && company.targetUpsidePct !== null && (
                      <div className="w-full bg-[var(--ink)] h-2 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--brass)] to-[var(--verdigris)] rounded-full"
                          style={{ width: `${Math.min(100, Math.max(10, Math.abs(company.targetUpsidePct) * 2))}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-[var(--mist)] text-center pt-1 border-t border-dashed border-[var(--line)]/50">
                  {company.numberOfAnalystOpinions
                    ? `${company.numberOfAnalystOpinions} Aracı Kurum & Banka Analisti`
                    : "Piyasa Konsensüs Tahmini"}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--ink-3)] p-5 rounded-lg border border-[var(--line)] text-center space-y-2 font-mono">
                <Info className="w-5 h-5 text-[var(--mist)] mx-auto opacity-75" />
                <p className="text-xs text-[var(--paper)] font-semibold">
                  Analist Hedef Fiyatı Bulunmuyor
                </p>
                <p className="text-[11px] text-[var(--mist)] leading-relaxed">
                  Bu şirket için kurum analist konsensüs hedef fiyatı veya getiri projeksiyonu verisi mevcut değildir.
                </p>
              </div>
            )}
          </div>

          {/* 2. Corporate Calendar & Events Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Şirket Takvimi &amp; Temettü
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[var(--mist)]">Borsa İstanbul</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 bg-[var(--ink-3)] rounded border border-[var(--line)] flex items-center justify-between">
                <span className="text-[var(--mist)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--brass)]" />
                  Gelecek Bilanço Tarihi:
                </span>
                <span className="font-bold text-[var(--paper)]">
                  {company.nextEarningsDate || "Dönem Sonu Açıklanacak"}
                </span>
              </div>

              <div className="p-3 bg-[var(--ink-3)] rounded border border-[var(--line)] flex items-center justify-between">
                <span className="text-[var(--mist)] flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[var(--verdigris)]" />
                  Temettü Hak Ediş Tarihi:
                </span>
                <span className="font-bold text-[var(--verdigris)]">
                  {company.exDividendDate || (company.dividendYield ? "Tarih Belirtilmedi" : "Temettü Yok")}
                </span>
              </div>

              {company.dividendRate && (
                <div className="p-3 bg-[var(--ink-3)] rounded border border-[var(--line)] flex items-center justify-between">
                  <span className="text-[var(--mist)]">Hisse Başı Temettü Tutarı:</span>
                  <span className="font-bold text-[var(--brass)]">
                    {company.dividendRate} ₺ / Lot
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Corporate Profile & Management Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  Şirket Kurumsal Künyesi
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[var(--mist)]">{company.exchange}</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[var(--ink-3)] rounded border border-[var(--line)]">
                <span className="text-[var(--mist)] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--brass)]" />
                  Genel Müdür / CEO:
                </span>
                <span className="font-bold text-[var(--paper)] truncate max-w-[150px]">
                  {company.ceo || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[var(--ink-3)] rounded border border-[var(--line)]">
                <span className="text-[var(--mist)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[var(--brass)]" />
                  Çalışan Sayısı:
                </span>
                <span className="font-bold text-[var(--paper)]">
                  {company.fullTimeEmployees ? `${company.fullTimeEmployees.toLocaleString("tr-TR")} kişi` : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[var(--ink-3)] rounded border border-[var(--line)]">
                <span className="text-[var(--mist)] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[var(--brass)]" />
                  Resmi Web Sitesi:
                </span>
                <a
                  href={company.website || `https://www.google.com/finance/quote/${company.symbol}:BIST`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--brass)] hover:underline flex items-center gap-1"
                >
                  <span>Ziyaret Et</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* 4. Note book section */}
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
                    {editingNoteIndex === idx ? (
                      <div className="flex-1 flex flex-col gap-2">
                        <textarea
                          value={editingNoteText}
                          onChange={(e) => setEditingNoteText(e.target.value)}
                          rows={3}
                          className="w-full bg-[var(--ink-2)] border border-[var(--brass)] rounded p-2 text-xs text-[var(--paper)] font-mono resize-none outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (editingNoteText.trim()) {
                                updateNote(company.symbol, idx, editingNoteText.trim());
                                showToast("Not Güncellendi", `${company.symbol} için yatırım notu güncellendi.`, "success");
                                setEditingNoteIndex(null);
                              }
                            }}
                            disabled={!editingNoteText.trim()}
                            className="text-[10px] bg-[var(--brass)] text-[var(--ink)] font-bold px-2 py-1 rounded disabled:opacity-40 cursor-pointer"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={() => setEditingNoteIndex(null)}
                            className="text-[10px] text-[var(--mist)] px-2 py-1 cursor-pointer hover:text-[var(--paper)]"
                          >
                            Vazgeç
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[var(--paper-dim)] whitespace-pre-wrap flex-1">
                          {noteText}
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => {
                              setEditingNoteIndex(idx);
                              setEditingNoteText(noteText);
                            }}
                            className="text-[var(--mist)] hover:text-[var(--brass)] p-1 transition-colors cursor-pointer"
                            title="Notu Düzenle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setNoteIndexToDelete(idx)}
                            className="text-[var(--mist)] hover:text-[var(--loss)] p-1 transition-colors cursor-pointer"
                            title="Notu Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
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
        onClose={() => {
          setTxModalOpen(false);
          setEditingTx(null);
        }}
        symbol={company.symbol}
        defaultPrice={company.price}
        currency={company.currency}
        editingTransaction={editingTx}
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
          secondaryMetric: `${company.dailyChange >= 0 ? "+" : ""}${company.dailyChange}%`,
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

      {/* Triggered Alerts History Drawer */}
      {isAlertHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 font-sans">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[var(--brass)]" />
                <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                  {company.symbol} Alarm Geçmişi
                </h3>
              </div>
              <button
                onClick={() => setIsAlertHistoryOpen(false)}
                className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {companyTriggeredAlerts.length === 0 ? (
              <p className="text-xs font-mono text-[var(--mist)] py-6 text-center italic">
                Bu hisse için henüz tetiklenmiş bir alarm kaydı bulunmuyor.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {companyTriggeredAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-2.5 rounded bg-[var(--ink-3)] border border-[var(--line)] text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[var(--paper)]">{alt.symbol}</span>
                      <span className="text-[10px] text-[var(--verdigris)]">
                        Hedef: {alt.targetPrice} ₺ ({alt.condition === "ABOVE" ? "≥" : "≤"})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--mist)]">
                      <span>Tetiklenme Fiyatı: <strong className="text-[var(--brass)]">{alt.triggeredPrice} ₺</strong></span>
                      <span>{alt.triggeredAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-[var(--line)]">
              {companyTriggeredAlerts.length > 0 && (
                <button
                  onClick={() => {
                    clearTriggeredAlerts(company.symbol);
                    showToast("Geçmiş Temizlendi", `${company.symbol} için tüm alarm kayıtları silindi.`, "success");
                  }}
                  className="text-xs font-mono text-[var(--loss)] hover:underline cursor-pointer"
                >
                  Geçmişi Temizle
                </button>
              )}
              <button
                onClick={() => setIsAlertHistoryOpen(false)}
                className="bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--line)] text-[var(--paper)] px-4 py-2 rounded text-xs font-mono transition-colors ml-auto cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={txToDelete !== null}
        onClose={() => setTxToDelete(null)}
        onConfirm={() => {
          if (txToDelete) {
            deleteTransaction(txToDelete.id);
            showToast("İşlem Silindi", `${company.symbol} işlem kaydı portföyden silindi.`, "info");
            setTxToDelete(null);
          }
        }}
        title="İşlem Kaydını Sil"
        description={
          txToDelete
            ? `${txToDelete.type === "BUY" ? "Alış" : "Satış"} işlemini (${txToDelete.quantity} adet @ ${txToDelete.price} ${company.currency}) silmek istediğinize emin misiniz? Bu, pozisyon maliyet hesaplamanızı etkileyecektir.`
            : ""
        }
        confirmText="Evet, Sil"
        isDestructive
      />

      {/* Note Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={noteIndexToDelete !== null}
        onClose={() => setNoteIndexToDelete(null)}
        onConfirm={() => {
          if (noteIndexToDelete !== null && company) {
            deleteNote(company.symbol, noteIndexToDelete);
            setNoteIndexToDelete(null);
            showToast("Not Silindi", `${company.symbol} için yatırım notu kaldırıldı.`, "info");
          }
        }}
        title="Notu Sil"
        description="Bu yatırım notunu kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        isDestructive
      />
    </div>
  );
}
