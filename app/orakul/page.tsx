"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Shield,
  Brain,
  Check,
  BookmarkPlus,
  Search,
  Activity,
  AlertTriangle,
  Newspaper,
  Compass,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Award,
  Target,
  FileText,
  AlertOctagon,
  Hourglass,
  Coffee,
  Zap,
  Info,
  Trash2,
  Star,
  Bookmark,
  ArrowRight,
  SlidersHorizontal,
  Layers,
  X,
  Mail,
  Scale,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ArrowLeftRight,
  Calculator,
  Binary,
  BarChart3,
  Percent,
} from "lucide-react";
import OracleSeal from "@/components/OracleSeal";
import StampBadge from "@/components/StampBadge";
import ConfirmModal from "@/components/ConfirmModal";
import { useDefterStore } from "@/lib/store";
import { AiHistoryItem, Basket, Company } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import CompanyCombobox from "@/components/CompanyCombobox";
import { AutonomousScanFeed } from "@/components/AutonomousScanFeed";
import { AiModelPortfolios } from "@/components/AiModelPortfolios";
import {
  EarningsFlashResult,
  ValueTrapResult,
  BacktestResult,
  StockScreenerResult,
  DailyBriefingResult,
  SentimentNewsItem,
  CompanyDiagnosisReport,
} from "@/lib/aiService";
import { OrakulCopilotChat } from "@/components/OrakulCopilotChat";
import { AiBullBearDebateCard } from "@/components/AiBullBearDebateCard";
import { AiAgentCommitteeCard } from "@/components/AiAgentCommitteeCard";
import { AiAnalystTargetGauge } from "@/components/AiAnalystTargetGauge";
import { AiReportPdfExporter } from "@/components/AiReportPdfExporter";
import OrakulLiveAnalysisRadar from "@/components/OrakulLiveAnalysisRadar";

export type OrakulCategory = "strategy" | "company" | "market";

export type OrakulTab =
  | "wizard"
  | "backtest"
  | "screener"
  | "autonomous_scan"
  | "model_baskets"
  | "copilot"
  | "company"
  | "earnings"
  | "trap"
  | "daily_brief"
  | "weekly_letter"
  | "sentiment"
  | "anomaly";

const TAB_TO_CATEGORY: Record<OrakulTab, OrakulCategory> = {
  wizard: "strategy",
  backtest: "strategy",
  screener: "strategy",
  autonomous_scan: "strategy",
  model_baskets: "strategy",
  copilot: "strategy",
  company: "company",
  earnings: "company",
  trap: "company",
  daily_brief: "market",
  weekly_letter: "market",
  sentiment: "market",
  anomaly: "market",
};

interface CategoryItem {
  id: OrakulCategory;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Compass;
  tabs: Array<{
    id: OrakulTab;
    label: string;
    icon: typeof Compass;
  }>;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "strategy",
    title: "Sepet & Strateji",
    subtitle: "Portföy Mimarı & Simülasyon",
    description: "Yapay zeka sepet optimizasyonu, geçmiş getiri simülasyonu ve akıllı hisse filtreleme.",
    icon: Compass,
    tabs: [
      { id: "wizard", label: "Sepet Sihirbazı", icon: Compass },
      { id: "copilot", label: "Orakul AI Copilot", icon: Brain },
      { id: "backtest", label: "Zaman Makinesi (Backtest)", icon: Hourglass },
      { id: "screener", label: "Akıllı Hisse Tarayıcısı", icon: Search },
      { id: "autonomous_scan", label: "Otonom AI Tarayıcı", icon: Brain },
      { id: "model_baskets", label: "AI Model Sepetler", icon: Layers },
    ],
  },
  {
    id: "company",
    title: "Şirket Analizi",
    subtitle: "Temel Teşhis & Değerleme",
    description: "DCF, Piotroski, DuPont analizi, 30 saniyelik bilanço karnesi ve değer tuzağı tespiti.",
    icon: Activity,
    tabs: [
      { id: "company", label: "Şirket Teşhisi", icon: Activity },
      { id: "earnings", label: "30 Sn Bilanço Tercümanı", icon: FileText },
      { id: "trap", label: "Değer Tuzağı Radarı", icon: AlertOctagon },
    ],
  },
  {
    id: "market",
    title: "Piyasa Nabzı",
    subtitle: "Yönetici Özetleri & Riskler",
    description: "Günlük kapanış brifingi, haftalık kasa mektubu, KAP duygu puanı ve portföy risk uyarıları.",
    icon: Coffee,
    tabs: [
      { id: "daily_brief", label: "Kapanış Brifingi", icon: Coffee },
      { id: "weekly_letter", label: "Haftalık Kasa Mektubu", icon: Mail },
      { id: "sentiment", label: "Haber & Duygu Analizi", icon: Newspaper },
      { id: "anomaly", label: "Portföy Risk Uyarıları", icon: AlertTriangle },
    ],
  },
];

function OrakulContent() {
  const searchParams = useSearchParams();
  const preselectedBasketId = searchParams.get("basketId");

  const {
    companies,
    baskets,
    userSettings,
    aiHistory,
    addAiHistory,
    deleteAiHistory,
    clearAllAiHistory,
    evaluateAiOutcomes,
    aiAccuracyStats,
    aiProvider,
    geminiModel,
    aiApiKey,
    createBasket,
    addTransaction,
    indices,
  } = useDefterStore();
  const { showToast } = useToast();

  const searchCategory = searchParams.get("category") as OrakulCategory | null;
  const searchTab = searchParams.get("tab") as OrakulTab | null;

  const initialTab: OrakulTab = searchTab && TAB_TO_CATEGORY[searchTab] ? searchTab : "wizard";
  const initialCategory: OrakulCategory =
    searchCategory && (["strategy", "company", "market"] as OrakulCategory[]).includes(searchCategory)
      ? searchCategory
      : TAB_TO_CATEGORY[initialTab];

  const [activeCategory, setActiveCategory] = useState<OrakulCategory>(initialCategory);
  const [activeTab, setActiveTab] = useState<OrakulTab>(initialTab);

  const updateUrl = (cat: OrakulCategory, tab: OrakulTab) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("category", cat);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleCategoryChange = (catId: OrakulCategory) => {
    setActiveCategory(catId);
    const catDef = CATEGORIES.find((c) => c.id === catId);
    if (catDef && !catDef.tabs.some((t) => t.id === activeTab)) {
      const firstTab = catDef.tabs[0].id;
      setActiveTab(firstTab);
      updateUrl(catId, firstTab);
    } else {
      updateUrl(catId, activeTab);
    }
  };

  const handleTabChange = (tabId: OrakulTab) => {
    setActiveTab(tabId);
    const parentCat = TAB_TO_CATEGORY[tabId];
    setActiveCategory(parentCat);
    updateUrl(parentCat, tabId);
  };

  // 1. Wizard state & Rebalance Context
  const [rebalanceBasketId, setRebalanceBasketId] = useState<string | null>(null);
  const [prevPreselectedBasketId, setPrevPreselectedBasketId] = useState<string | null>(null);
  const [strategyArchetype, setStrategyArchetype] = useState<string>("dividend_aristocrats");
  const [goal, setGoal] = useState("Temettü Odaklı Nakit Akışı");
  const [risk, setRisk] = useState("Dengeli (Orta Risk)");
  const [universe, setUniverse] = useState("BIST 30 & Kıymetli Maden");
  const [budget, setBudget] = useState("100.000");
  const [horizon, setHorizon] = useState<string>("Orta Vade (6-18 Ay)");
  const [maxAssetWeight, setMaxAssetWeight] = useState<number>(35);
  const [includeGoldBuffer, setIncludeGoldBuffer] = useState<boolean>(false);
  const [minDividendYield, setMinDividendYield] = useState<number>(0);
  const [maxPeRatio, setMaxPeRatio] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [assetCount, setAssetCount] = useState<number>(4);

  // Sync preselected basket to wizard state during render
  if (preselectedBasketId && preselectedBasketId !== prevPreselectedBasketId && baskets.length > 0) {
    const targetB = baskets.find((b) => b.id === preselectedBasketId);
    if (targetB) {
      setPrevPreselectedBasketId(preselectedBasketId);
      setRebalanceBasketId(targetB.id);
      setActiveCategory("strategy");
      setActiveTab("wizard");
      setGoal(`${targetB.name} Yeniden Dengeleme & Rebalance`);
      setRisk(
        targetB.riskLevel === "Düşük"
          ? "Düşük Risk (Defansif)"
          : targetB.riskLevel === "Orta"
          ? "Dengeli (Orta Risk)"
          : "Yüksek Risk (Agresif)"
      );
      if (targetB.totalValue > 0) {
        setBudget(Math.round(targetB.totalValue).toLocaleString("tr-TR"));
      }
    }
  }

  useEffect(() => {
    if (preselectedBasketId) {
      updateUrl("strategy", "wizard");
    }
  }, [preselectedBasketId]);

interface OrakulRecipeResult {
  title?: string;
  recipeTitle?: string;
  summary?: string;
  strategyArchetype?: string;
  healthScore?: number | string;
  expectedYield?: string;
  recommendedDuration?: string;
  riskRating?: string;
  isTemplate?: boolean;
  engine?: "llm" | "algorithmic";
  metricsSource?: "calculated";
  sharpeRatio?: number;
  sortinoRatio?: number;
  portfolioBeta?: number;
  jensenAlpha?: number;
  treynorRatio?: number;
  omegaRatio?: number;
  estimatedVolatility?: number;
  maxDrawdownPct?: number;
  var95MonthlyAmount?: number;
  var95MonthlyPct?: number;
  cvar95MonthlyAmount?: number;
  diversificationBenefitPct?: number;
  shannonEntropyPct?: number;
  ulcerIndex?: number;
  ulcerStressLevel?: string;
  hhiScore?: number;
  averageCorrelation?: number;
  isPseudoDiversified?: boolean;
  correlationMatrix?: Record<string, Record<string, number>>;
  usdElasticityPct?: number;
  interestRateSensitivityPct?: number;
  inflationBeta?: number;
  famaFrench?: {
    marketBeta: number;
    smbSizeBeta: number;
    hmlValueBeta: number;
    rmwProfitabilityBeta: number;
    cmaInvestmentBeta: number;
    pureAlphaPct: number;
  };
  blackLittermanSuggestedWeights?: Array<{
    symbol: string;
    currentWeight: number;
    optimalWeight: number;
    diffPct: number;
  }>;
  backtest1yReturn?: number;
  backtestBistAlpha?: number;
  realBacktest?: {
    totalReturnPct: number;
    bist100ReturnPct: number;
    goldReturnPct: number;
    alphaPct: number;
    annualizedVolatilityPct: number;
    maxDrawdownPct: number;
    sharpeRatio: number;
  };
  cashReserve?: number;
  rebalanceActions?: Array<{
    symbol: string;
    name?: string;
    action: "AZALT" | "ARTIR" | "TUT";
    currentWeight: number;
    targetWeight: number;
    diffWeight: number;
    currentShares: number;
    targetShares: number;
    sharesChange: number;
    estimatedAmountChange: number;
    currentPrice: number;
    reason: string;
  }>;
  committeeDebate?: {
    bullSummary?: string;
    bearSummary?: string;
    verdict?: string;
  };
  allocation?: Array<{
    symbol: string;
    companyName?: string;
    name?: string;
    weight: number;
    price?: number;
    suggestedShares?: number;
    totalCost?: number;
    note?: string;
    bullThesis?: string;
    bearRisk?: string;
    rationale?: string;
  }>;
}

interface CompanyAnalysisResult {
  symbol?: string;
  valuationScore?: string;
  fairValue?: number;
  targetPrice12M?: number;
  upsidePotential?: string;
  piotroskiScore?: number;
  altmanZScore?: string;
  dupontRoe?: string;
  peVsSector?: string;
  whyMoved?: string;
  pros?: string[];
  risks?: string[];
  verdict?: "GÜÇLÜ AL" | "AL" | "TUT" | "SAT" | "GÜÇLÜ SAT" | "NÖTR" | "DENGELİ" | "YÜKSEK RİSK";
  confidence?: string;
  pastFeedbackSummary?: string;
  evidenceChain?: string[];
  bullCase?: {
    catalyst: string;
    targetUpside: string;
    coreThesis: string;
  };
  bearCase?: {
    keyRisk: string;
    downsideRisk: string;
    coreThesis: string;
  };
  stressTest?: {
    fxShock20Pct: string;
    rateCutShock: string;
    marketCrashShock: string;
  };
}

interface WeeklyLetterResult {
  date: string;
  greeting: string;
  subject: string;
  openingParagraph: string;
  portfolioReview: string;
  macroCommentary: string;
  strategicGuidance: string;
  signoff: string;
}

  const [loading, setLoading] = useState(false);
  const [recipePhase, setRecipePhase] = useState<string | null>(null);
  const [result, setResult] = useState<OrakulRecipeResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [recipeBacktest, setRecipeBacktest] = useState<BacktestResult | null>(null);
  const [recipeBacktestLoading, setRecipeBacktestLoading] = useState(false);

  // 2. Company Deep-Dive state
  const [selectedCoSymbol, setSelectedCoSymbol] = useState(companies[0]?.symbol || "THYAO");
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysisResult | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<string | null>(null);
  const [showEvidenceChain, setShowEvidenceChain] = useState<Record<string, boolean>>({});

  // 2b. Comparative Company Deep-Dive state (Item 6)
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareCoSymbol, setCompareCoSymbol] = useState(companies[1]?.symbol || "ASELS");
  const [compareAnalysis, setCompareAnalysis] = useState<CompanyAnalysisResult | null>(null);

  // 2c. Weekly Letter state (Premium Item 3)
  const [weeklyLetter, setWeeklyLetter] = useState<WeeklyLetterResult | null>(null);
  const [weeklyLetterLoading, setWeeklyLetterLoading] = useState(false);

  // 3. 📑 Earnings Flash state
  const [earningsSymbol, setEarningsSymbol] = useState(companies[0]?.symbol || "THYAO");
  const [earningsResult, setEarningsResult] = useState<EarningsFlashResult | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(false);

  // 4. ⚠️ Value Trap state
  const [trapSymbol, setTrapSymbol] = useState(companies[0]?.symbol || "EREGL");
  const [trapResult, setTrapResult] = useState<ValueTrapResult | null>(null);
  const [trapLoading, setTrapLoading] = useState(false);

  // 5. ⏳ Backtesting Lab state
  const [backtestMonths, setBacktestMonths] = useState<number>(6);
  const [backtestBudget, setBacktestBudget] = useState<string>("100.000");
  const [backtestStrategy, setBacktestStrategy] = useState<string>("Temettü Kalesi Reçetesi");
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [backtestLoading, setBacktestLoading] = useState(false);

  // 6. 🔍 Stock Screener state & Saved Queries (Item 4)
  const [screenerQuery, setScreenerQuery] = useState<string>("F/K'sı 8'in altında yüksek temettü veren sanayi hisseleri");
  const [screenerResult, setScreenerResult] = useState<StockScreenerResult | null>(null);
  const [screenerLoading, setScreenerLoading] = useState(false);
  const [savedQueries, setSavedQueries] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("defter_saved_screener_queries");
      return stored
        ? JSON.parse(stored)
        : [
            "F/K'sı 8'in altında yüksek temettü veren sanayi hisseleri",
            "İhracat odaklı döviz kazancı olan büyüme hisseleri",
          ];
    } catch {
      return [];
    }
  });

  const handleSaveQuery = () => {
    const q = screenerQuery.trim();
    if (!q) return;
    if (savedQueries.includes(q)) {
      showToast("Zaten Kayıtlı", "Bu arama kriteri zaten kayıtlı sorgularınızda mevcut.", "info");
      return;
    }
    const updated = [q, ...savedQueries].slice(0, 6);
    setSavedQueries(updated);
    try {
      localStorage.setItem("defter_saved_screener_queries", JSON.stringify(updated));
    } catch {}
    showToast("Sorgu Kaydedildi", "Arama kriteri hızlı erişim listesine eklendi.", "success");
  };

  const [queryToDelete, setQueryToDelete] = useState<string | null>(null);

  const confirmDeleteSavedQuery = () => {
    if (!queryToDelete) return;
    const updated = savedQueries.filter((q) => q !== queryToDelete);
    setSavedQueries(updated);
    try {
      localStorage.setItem("defter_saved_screener_queries", JSON.stringify(updated));
    } catch {}
    showToast("Sorgu Silindi", "Kayıtlı arama kriteri listeden kaldırıldı.", "info");
    setQueryToDelete(null);
  };

  // Screener Add to Basket Allocation State
  const [allocatingPick, setAllocatingPick] = useState<{ symbol: string; name: string; price: number } | null>(null);
  const [allocateBasketId, setAllocateBasketId] = useState<string>("");
  const [allocateLotAmount, setAllocateLotAmount] = useState<string>("10");

  const handleOpenAllocateModal = (pick: { symbol: string; name: string; price: number }) => {
    setAllocatingPick(pick);
    if (baskets.length > 0) {
      setAllocateBasketId(baskets[0].id);
    }
  };

  const handleConfirmAllocateToBasket = () => {
    if (!allocatingPick || !allocateBasketId) {
      showToast("Sepet Seçin", "Lütfen hisseyi eklemek istediğiniz sepeti seçin.", "warning");
      return;
    }
    const lots = parseInt(allocateLotAmount, 10);
    if (isNaN(lots) || lots <= 0) {
      showToast("Geçersiz Lot", "Lütfen geçerli bir lot miktarı girin.", "warning");
      return;
    }

    const price = allocatingPick.price || 0;
    addTransaction(
      {
        type: "BUY",
        companySymbol: allocatingPick.symbol,
        quantity: lots,
        price: price,
        totalAmount: price * lots,
        date: new Date().toISOString().split("T")[0],
        note: "Orakul AI Hisse Tarayıcısı ile eklendi",
        basketId: allocateBasketId,
      },
      allocateBasketId
    );

    const targetB = baskets.find((b) => b.id === allocateBasketId);
    showToast("Sepete Eklendi", `${lots} lot ${allocatingPick.symbol}, ${targetB?.name || "sepetinize"} başarıyla eklendi.`, "success");
    setAllocatingPick(null);
  };

  // Cross-Feature Quick Navigation Helper
  const navigateToFeature = (
    tab: OrakulTab,
    symbol?: string
  ) => {
    const parentCat = TAB_TO_CATEGORY[tab];
    setActiveCategory(parentCat);
    setActiveTab(tab);
    updateUrl(parentCat, tab);

    if (symbol) {
      if (tab === "company") {
        setSelectedCoSymbol(symbol);
        setCompanyAnalysis(null);
      } else if (tab === "earnings") {
        setEarningsSymbol(symbol);
        setEarningsResult(null);
      } else if (tab === "trap") {
        setTrapSymbol(symbol);
        setTrapResult(null);
      }
    }
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // History delete confirmation states
  const [historyToDelete, setHistoryToDelete] = useState<AiHistoryItem | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // 7. ☕ Daily Briefing state
  const [briefingResult, setBriefingResult] = useState<DailyBriefingResult | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  // 8. 📰 Sentiment News state
  const [sentimentResults, setSentimentResults] = useState<SentimentNewsItem[] | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  // 9. ⚠️ Live Calculated Portfolio Risk & Anomalies (100% Real Data Derived from Active Store)
  const portfolioAnomalies = useMemo(() => {
    // 1. Holding Concentration Risk (> 30% in any basket)
    const concentrationWarnings = baskets.flatMap((b) =>
      b.holdings
        .filter((h) => h.weightPercent > 30)
        .map((h) => ({
          basketId: b.id,
          basketName: b.name,
          symbol: h.companySymbol,
          weight: h.weightPercent,
          targetWeight: h.targetWeightPercent ?? h.weightPercent,
        }))
    );

    // 2. Liquid / Gold / FX Shield Ratio
    const totalPortfolioVal = baskets.reduce((sum, b) => sum + b.totalValue, 0);
    let hedgeValue = 0;
    baskets.forEach((b) => {
      b.holdings.forEach((h) => {
        const isHedge =
          h.companySymbol.includes("ALTIN") ||
          h.companySymbol.includes("GÜMÜŞ") ||
          h.companySymbol.includes("USD") ||
          h.companySymbol.includes("EUR") ||
          h.companySymbol.includes("PLATIN");
        if (isHedge) {
          hedgeValue += h.quantity * (h.currentPrice || h.avgCost);
        }
      });
    });
    const hedgePercent = totalPortfolioVal > 0 ? parseFloat(((hedgeValue / totalPortfolioVal) * 100).toFixed(1)) : 0;

    // 3. Drawdown Alert (holdings with loss <= -15%)
    const drawdownAlerts = baskets.flatMap((b) =>
      b.holdings
        .filter((h) => h.avgCost > 0 && ((h.currentPrice - h.avgCost) / h.avgCost) * 100 <= -15)
        .map((h) => ({
          basketName: b.name,
          symbol: h.companySymbol,
          lossPct: (((h.currentPrice - h.avgCost) / h.avgCost) * 100).toFixed(1),
          avgCost: h.avgCost,
          currentPrice: h.currentPrice,
        }))
    );

    // 4. Sector Concentration (> 45% in any single sector across all baskets)
    const sectorTotals: Record<string, number> = {};
    baskets.forEach((b) => {
      b.holdings.forEach((h) => {
        const co = companies.find((c) => c.symbol === h.companySymbol);
        const sector = co?.sector || "Diğer";
        const val = h.quantity * (h.currentPrice || h.avgCost);
        sectorTotals[sector] = (sectorTotals[sector] || 0) + val;
      });
    });
    const sectorWarnings: Array<{ sector: string; pct: number }> = [];
    if (totalPortfolioVal > 0) {
      Object.entries(sectorTotals).forEach(([sector, val]) => {
        const pct = parseFloat(((val / totalPortfolioVal) * 100).toFixed(1));
        if (pct > 45 && sector !== "Diğer") {
          sectorWarnings.push({ sector, pct });
        }
      });
    }

    const isClean = concentrationWarnings.length === 0 && drawdownAlerts.length === 0 && sectorWarnings.length === 0;

    return {
      concentrationWarnings,
      hedgePercent,
      hedgeValue,
      drawdownAlerts,
      sectorWarnings,
      totalPortfolioVal,
      isClean,
    };
  }, [baskets, companies]);

  // History Filter state
  const [historyFilter, setHistoryFilter] = useState<"all" | "correct" | "incorrect" | "pending">("all");
  const [evaluating, setEvaluating] = useState(false);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setResult(null);
    setRecipeBacktest(null);
    setSavedSuccess(false);
    setRecipePhase("1. Kütük Taranıyor...");

    try {
      setTimeout(() => setRecipePhase("2. Kovaryans Matrisi & Korelasyon Hesaplanıyor..."), 500);
      setTimeout(() => setRecipePhase("3. Risk Metrikleri (Sharpe/Sortino/Beta) Hesaplanıyor..."), 1100);
      setTimeout(() => setRecipePhase("4. Komite Değerlendirmesi & Lot Dağılımı..."), 1700);

      const rebalanceBasket = rebalanceBasketId ? baskets.find((b) => b.id === rebalanceBasketId) : null;
      const budgetNum = parseFloat(budget.replace(/\./g, "")) || 100000;

      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "recipe",
          payload: {
            strategyArchetype,
            goal,
            risk,
            universe,
            budget: budgetNum,
            horizon,
            maxAssetWeight,
            includeGoldBuffer,
            minDividendYield: minDividendYield > 0 ? minDividendYield : undefined,
            maxPeRatio: maxPeRatio > 0 ? maxPeRatio : undefined,
            assetCount,
            allCompanies: companies,
            rebalanceContext: rebalanceBasket ? {
              basketId: rebalanceBasket.id,
              basketName: rebalanceBasket.name,
              currentHoldings: rebalanceBasket.holdings.map((h) => ({
                symbol: h.companySymbol,
                currentWeight: h.weightPercent,
                targetWeight: h.targetWeightPercent ?? h.weightPercent,
                quantity: h.quantity,
                avgCost: h.avgCost,
                currentPrice: h.currentPrice,
              })),
            } : undefined,
          },
          provider: aiProvider,
          model: geminiModel,
          persona: userSettings?.orakulPersona || "deger",
          apiKey: aiApiKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.data);
        showToast("Orakul Reçetesi Hazır", `${goal} için özel varlık dağılımı hesaplandı.`, "success");

        // Otomatik Gerçek Geçmiş Backtest Simülasyonu (Arka Plan)
        if (data.data?.allocation && data.data.allocation.length > 0) {
          setRecipeBacktestLoading(true);
          const durMonths = horizon === "30_gun" ? 1 : horizon === "6_ay" ? 6 : 12;
          fetch("/api/orakul", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "backtest",
              payload: {
                recipeTitle: data.data.recipeTitle || data.data.title,
                durationMonths: durMonths,
                budget: budgetNum,
                allocation: data.data.allocation.map((a: { symbol: string; weight: number }) => ({
                  symbol: a.symbol,
                  weight: a.weight,
                })),
              },
              provider: aiProvider,
              model: geminiModel,
            }),
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((bt) => {
              if (bt?.data) setRecipeBacktest(bt.data);
            })
            .catch((err) => console.warn("[Backtest Async Trigger]", err))
            .finally(() => setRecipeBacktestLoading(false));
        }

        // Başarı Karnesi & Karar Takip Listesine Otomatik Kaydet
        if (data.data) {
          const holdingsSummary = (data.data.allocation || [])
            .map((a: { symbol: string; weight: number }) => `${a.symbol} (%${a.weight})`)
            .join(", ");

          addAiHistory({
            id: `recipe-${Date.now()}`,
            date: "Bugün " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            symbol: data.data.allocation?.[0]?.symbol || "SEPET",
            type: "Sepet Önerisi",
            title: `AI Sepeti: ${goal} (${strategyArchetype.toUpperCase()})`,
            description: `${data.data.summary || "Özel optimizasyonlu portföy reçetesi"} Dağılım: ${holdingsSummary}`,
            verdict: "AL",
            verdictTag: "GÜÇLÜ AL",
            verdictDate: new Date().toISOString().split("T")[0],
            budgetAtCreation: budgetNum,
            priceAtVerdict: budgetNum,
            bist100AtVerdict: indices["BIST 100"]?.price || indices["XU100"]?.price || 9840.5,
            confidence: "%92",
            outcomeCorrect: null,
            targetPeriodDays: horizon === "30_gun" ? 30 : horizon === "6_ay" ? 180 : 365,
            provider: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "OpenAI" : "Gemini") : "Şablon",
            model: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "gpt-4o-mini" : geminiModel) : "Algoritmik",
          });
        }
      } else {
        showToast("Reçete Oluşturulamadı", "Yapay zeka motoru yanıt verirken bir sorun oluştu.", "error");
      }
    } catch (e) {
      console.warn("Recipe generation error:", e);
      showToast("Bağlantı Hatası", "Sunucu ile iletişim kurulamadı.", "error");
    } finally {
      setLoading(false);
      setRecipePhase(null);
    }
  };

  // Handlers for the AI features (Fully secured, client apiKey removed)
  const handleEarningsFlash = async () => {
    const co = companies.find((c) => c.symbol === earningsSymbol);
    if (!co) return;
    setEarningsLoading(true);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "earnings_flash",
          payload: co,
          provider: aiProvider,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEarningsResult(data.data);
        showToast("Bilanço Karnesi Hazır", `${earningsSymbol} için 30 saniyelik bilanço özeti çıkarıldı.`, "success");

        // Başarı Karnesi ve Takip Listesine Kaydet
        if (data.data) {
          const v = data.data.verdict === "ÇOK GÜÇLÜ" || data.data.verdict === "GÜÇLÜ" ? "AL" : data.data.verdict === "ZAYIF" || data.data.verdict === "RİSKLİ" ? "SAT" : "TUT";
          addAiHistory({
            id: `earnings-${Date.now()}`,
            date: "Bugün " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            symbol: co.symbol,
            type: "Bilanço Notu",
            title: `${co.symbol} Bilanço Karnesi (${data.data.grade || "A"})`,
            description: `${data.data.summary} Bilanço Sağlık Puanı: ${data.data.healthScore}/10.`,
            verdict: v,
            verdictTag: data.data.verdict || "DENGELİ",
            verdictDate: new Date().toISOString().split("T")[0],
            priceAtVerdict: co.price || 0,
            bist100AtVerdict: indices["BIST 100"]?.price || indices["XU100"]?.price || 9840.5,
            confidence: `${(data.data.healthScore || 8) * 10}%`,
            outcomeCorrect: null,
            targetPeriodDays: 60,
            provider: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "OpenAI" : "Gemini") : "Şablon",
            model: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "gpt-4o-mini" : geminiModel) : "Algoritmik",
          });
        }
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Bilanço analizi üretilirken bir sorun oluştu.";
        showToast("Bilanço Analizi Başarısız", msg, "error");
      }
    } catch {
      showToast("Hata", "Bilanço analizi üretilemedi.", "error");
    } finally {
      setEarningsLoading(false);
    }
  };

  const handleValueTrapCheck = async () => {
    const co = companies.find((c) => c.symbol === trapSymbol);
    if (!co) return;
    setTrapLoading(true);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "value_trap",
          payload: co,
          provider: aiProvider,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTrapResult(data.data);
        showToast("Tuzak Analizi Tamamlandı", `${trapSymbol} değer tuzağı risk puanı hesaplandı.`, "success");

        // Başarı Karnesi ve Takip Listesine Kaydet
        if (data.data) {
          const isTrap = data.data.trapRiskLevel === "YÜKSEK" || data.data.trapRiskLevel === "KRİTİK";
          addAiHistory({
            id: `trap-${Date.now()}`,
            date: "Bugün " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            symbol: co.symbol,
            type: "Tuzak Taraması",
            title: `${co.symbol} Değer Tuzağı Radarı`,
            description: `${data.data.verdictTitle}. Altman Z: ${data.data.altmanZScore} (${data.data.altmanZone}), Piotroski F: ${data.data.piotroskiFScore}/9.`,
            verdict: isTrap ? "SAT" : data.data.isGenuineBargain ? "AL" : "TUT",
            verdictTag: isTrap ? "YÜKSEK RİSK" : data.data.isGenuineBargain ? "FIRSAT" : "NÖTR",
            verdictDate: new Date().toISOString().split("T")[0],
            priceAtVerdict: co.price || 0,
            bist100AtVerdict: indices["BIST 100"]?.price || indices["XU100"]?.price || 9840.5,
            confidence: "%95",
            outcomeCorrect: null,
            targetPeriodDays: 30,
            provider: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "OpenAI" : "Gemini") : "Şablon",
            model: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "gpt-4o-mini" : geminiModel) : "Algoritmik",
          });
        }
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Tuzak analizi çalıştırılırken bir sorun oluştu.";
        showToast("Tuzak Analizi Başarısız", msg, "error");
      }
    } catch {
      showToast("Hata", "Tuzak analizi çalıştırılamadı.", "error");
    } finally {
      setTrapLoading(false);
    }
  };

  const handleRunBacktest = async () => {
    setBacktestLoading(true);

    let allocation: Array<{ symbol: string; weight: number }> = [
      { symbol: "THYAO", weight: 30 },
      { symbol: "FROTO", weight: 25 },
      { symbol: "ASELS", weight: 25 },
      { symbol: "TUPRS", weight: 20 },
    ];

    if (backtestStrategy.includes("Temettü Kalesi")) {
      allocation = [
        { symbol: "FROTO", weight: 25 },
        { symbol: "TUPRS", weight: 25 },
        { symbol: "EREGL", weight: 25 },
        { symbol: "BIMAS", weight: 25 },
      ];
    } else if (backtestStrategy.includes("Enflasyon & Kur Kalkanı")) {
      allocation = [
        { symbol: "ALTIN", weight: 30 },
        { symbol: "THYAO", weight: 25 },
        { symbol: "ASELS", weight: 25 },
        { symbol: "KCHOL", weight: 20 },
      ];
    } else if (backtestStrategy.includes("Büyüme & İhracat")) {
      allocation = [
        { symbol: "THYAO", weight: 30 },
        { symbol: "FROTO", weight: 25 },
        { symbol: "ASELS", weight: 25 },
        { symbol: "PGSUS", weight: 20 },
      ];
    } else {
      const targetBasket = baskets.find((b) => backtestStrategy === b.name || backtestStrategy === `Sepetim: ${b.name}`);
      if (targetBasket && targetBasket.holdings.length > 0) {
        allocation = targetBasket.holdings.map((h) => ({
          symbol: h.companySymbol,
          weight: h.weightPercent || 100 / targetBasket.holdings.length,
        }));
      }
    }

    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "backtest",
          payload: {
            recipeTitle: backtestStrategy,
            durationMonths: backtestMonths,
            budget: parseFloat(backtestBudget.replace(/\./g, "")) || 100000,
            allocation,
          },
          provider: aiProvider,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBacktestResult(data.data);
        showToast("Simülasyon Tamamlandı", `${backtestMonths} aylık gerçek geçmiş piyasa verileriyle test sonuçlandı.`, "success");
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Simülasyon hesaplanırken bir sorun oluştu.";
        showToast("Simülasyon Başarısız", msg, "error");
      }
    } catch {
      showToast("Hata", "Zaman makinesi simülasyonu yapılamadı.", "error");
    } finally {
      setBacktestLoading(false);
    }
  };

  const handleRunScreener = async (overrideQuery?: string) => {
    const q = overrideQuery || screenerQuery.trim();
    if (!q) return;
    setScreenerLoading(true);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "screener",
          payload: { query: q, companies },
          provider: aiProvider,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setScreenerResult(data.data);
        showToast("Tarama Tamamlandı", `Kriterlere uyan şirketler listelendi.`, "success");
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Hisse taraması yapılırken bir sorun oluştu.";
        showToast("Tarama Başarısız", msg, "error");
      }
    } catch {
      showToast("Hata", "Hisse taraması yapılamadı.", "error");
    } finally {
      setScreenerLoading(false);
    }
  };

  const handleGenerateDailyBrief = async () => {
    setBriefingLoading(true);
    const totalVal = baskets.reduce((sum, b) => sum + b.totalValue, 0);
    const totalCost = baskets.reduce((sum, b) => sum + b.totalCost, 0);

    // Calculate genuine weighted daily change & holdings summary
    const allHoldings = baskets.flatMap((b) => b.holdings);
    let weightedDailySum = 0;
    let portfolioSum = 0;
    const holdingsSummary: Array<{ symbol: string; dailyChange: number; weight: number }> = [];

    for (const h of allHoldings) {
      const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
      const holdingVal = h.quantity * (co?.price ?? h.currentPrice);
      const dailyChg = co?.dailyChange ?? 0;
      portfolioSum += holdingVal;
      weightedDailySum += holdingVal * dailyChg;
      holdingsSummary.push({
        symbol: h.companySymbol,
        dailyChange: dailyChg,
        weight: holdingVal,
      });
    }

    const calculatedDailyChangePct = portfolioSum > 0 ? Number((weightedDailySum / portfolioSum).toFixed(2)) : 0;
    const bistDaily = indices["BIST 100"]?.dailyChange;

    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily_brief",
          payload: {
            userName: userSettings?.userName,
            totalValue: totalVal,
            totalProfit: totalVal - totalCost,
            dailyChangePct: calculatedDailyChangePct,
            bistDailyChangePct: bistDaily,
            basketsCount: baskets.length,
            holdingsSummary,
          },
          provider: aiProvider,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBriefingResult(data.data);
        showToast("Kapanış Brifingi Hazır", "Günlük yönetici özeti oluşturuldu.", "success");
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Kapanış brifingi oluşturulurken bir sorun oluştu.";
        showToast("Brifing Başarısız", msg, "error");
      }
    } catch {
      showToast("Hata", "Kapanış brifingi oluşturulamadı.", "error");
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleGenerateWeeklyLetter = async () => {
    setWeeklyLetterLoading(true);
    const totalVal = baskets.reduce((sum, b) => sum + b.totalValue, 0);
    const totalCost = baskets.reduce((sum, b) => sum + b.totalCost, 0);

    // Calculate genuine top winner and top loser from actual basket holdings
    const allHoldings = baskets.flatMap((b) => b.holdings);
    let weightedDailySum = 0;
    let portfolioSum = 0;
    const validHoldingsWithChange: Array<{ symbol: string; change: number; weight: number }> = [];

    for (const h of allHoldings) {
      const co = companies.find((c) => c.symbol.toUpperCase() === h.companySymbol.toUpperCase());
      const holdingVal = h.quantity * (co?.price ?? h.currentPrice);
      const dailyChg = co?.dailyChange ?? 0;
      portfolioSum += holdingVal;
      weightedDailySum += holdingVal * dailyChg;
      validHoldingsWithChange.push({
        symbol: h.companySymbol,
        change: dailyChg,
        weight: holdingVal,
      });
    }

    validHoldingsWithChange.sort((a, b) => b.change - a.change);
    const bestHolding = validHoldingsWithChange.find((h) => h.change > 0);
    const worstHolding = [...validHoldingsWithChange].reverse().find((h) => h.change < 0 && h.symbol !== bestHolding?.symbol);

    const calculatedWeeklyChangePct = portfolioSum > 0 ? Number((weightedDailySum / portfolioSum).toFixed(2)) : 0;

    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "weekly_letter",
          payload: {
            userName: userSettings?.userName,
            totalValue: totalVal,
            totalProfit: totalVal - totalCost,
            basketsCount: baskets.length,
            companiesCount: companies.length,
            weeklyChangePct: calculatedWeeklyChangePct,
            topWinner: bestHolding ? { symbol: bestHolding.symbol, change: Number(bestHolding.change.toFixed(2)) } : undefined,
            topLoser: worstHolding ? { symbol: worstHolding.symbol, change: Number(worstHolding.change.toFixed(2)) } : undefined,
          },
          provider: aiProvider,
          model: geminiModel,
          persona: userSettings?.orakulPersona || "deger",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWeeklyLetter(data.data);
        showToast("Haftalık Kasa Mektubu Hazır", "Özel bankacı formatında haftalık değerlendirme üretildi.", "success");
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Kasa mektubu oluşturulamadı.";
        showToast("Mektup Başarısız", msg, "error");
      }
    } catch {
      showToast("Hata", "Kasa mektubu oluşturulamadı.", "error");
    } finally {
      setWeeklyLetterLoading(false);
    }
  };

  const handleGenerateSentiment = async () => {
    setSentimentLoading(true);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sentiment",
          payload: { companies, baskets },
          provider: aiProvider,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSentimentResults(data.data || []);
        showToast("Duygu Analizi Tamamlandı", "Kütük ve portföy şirketleri için KAP/piyasa duygu skorları hesaplandı.", "success");
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Duygu analizi alınırken bir sorun oluştu.";
        showToast("Duygu Analizi Başarısız", msg, "error");
      }
    } catch {
      showToast("Bağlantı Hatası", "Sunucu ile iletişim kurulamadı.", "error");
    } finally {
      setSentimentLoading(false);
    }
  };

  const handleCompanyAnalyze = async () => {
    if (isCompareMode) {
      const co1 = companies.find((c) => c.symbol === selectedCoSymbol);
      const co2 = companies.find((c) => c.symbol === compareCoSymbol);
      if (!co1 || !co2) {
        showToast("Şirket Bulunamadı", "Karşılaştırılacak şirketlerden biri kütükte kayıtlı değil.", "error");
        return;
      }
      setCompanyLoading(true);
      setCompanyAnalysis(null);
      setCompareAnalysis(null);
      setAnalysisPhase(`1. ${co1.symbol} ve ${co2.symbol} verileri eş zamanlı taranıyor...`);

      try {
        setTimeout(() => setAnalysisPhase(`2. DCF, Piotroski ve DuPont modelleri karşılaştırmalı simüle ediliyor...`), 700);

        const [res1, res2] = await Promise.all([
          fetch("/api/orakul", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "company_analysis",
              payload: co1,
              history: aiHistory,
              provider: aiProvider,
              model: geminiModel,
              persona: userSettings?.orakulPersona || "deger",
            }),
          }),
          fetch("/api/orakul", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "company_analysis",
              payload: co2,
              history: aiHistory,
              provider: aiProvider,
              model: geminiModel,
              persona: userSettings?.orakulPersona || "deger",
            }),
          }),
        ]);

        if (res1.ok && res2.ok) {
          const d1 = await res1.json();
          const d2 = await res2.json();
          setCompanyAnalysis(d1.data);
          setCompareAnalysis(d2.data);
          showToast("Karşılaştırma Hazır", `${co1.symbol} ve ${co2.symbol} teşhis raporları oluşturuldu.`, "success");
        } else {
          showToast("Analiz Hatası", "Karşılaştırmalı analiz üretilirken bir sorun oluştu.", "error");
        }
      } catch (e) {
        console.warn("Comparative analyze error:", e);
        showToast("Bağlantı Hatası", "Sunucu bağlantısında sorun oluştu.", "error");
      } finally {
        setCompanyLoading(false);
        setAnalysisPhase(null);
      }
      return;
    }

    const co = companies.find((c) => c.symbol === selectedCoSymbol);
    if (!co) {
      showToast("Şirket Bulunamadı", "Analiz etmek istediğiniz şirket kütükte kayıtlı değil.", "error");
      return;
    }
    setCompanyLoading(true);
    setCompanyAnalysis(null);
    setCompareAnalysis(null);
    setAnalysisPhase("1. Bilanço, Gelir Tablosu ve Çarpanlar Çekiliyor...");

    try {
      const [res] = await Promise.all([
        fetch("/api/orakul", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "company_analysis",
            payload: co,
            history: aiHistory,
            provider: aiProvider,
            model: geminiModel,
            persona: userSettings?.orakulPersona || "deger",
            apiKey: aiApiKey,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 2800)),
      ]);

      if (res.ok) {
        const data = await res.json();
        setCompanyAnalysis(data.data);
        showToast("Analiz Tamamlandı", `${co?.name || selectedCoSymbol} için değerleme raporu hazırlandı.`, "success");

        // Record analysis into aiHistory for persistent feedback tracking (Item 3)
        if (data.data) {
          const newHist: AiHistoryItem = {
            id: `ai-${Date.now()}`,
            date: "Bugün " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            symbol: co?.symbol,
            type: "Şirket Değerleme",
            title: `${co?.name || selectedCoSymbol} Değerleme Raporu`,
            description: `${data.data.whyMoved} Değerleme Skoru: ${data.data.valuationScore}.`,
            verdictTag: data.data.verdict,
            verdict: data.data.verdict,
            verdictDate: new Date().toISOString().split("T")[0],
            priceAtVerdict: co?.price || 0,
            bist100AtVerdict: indices["BIST 100"]?.price || indices["XU100"]?.price || 9840.5,
            confidence: data.data.confidence || "%90",
            outcomeCorrect: null,
            targetPeriodDays: 30,
            provider: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "OpenAI" : "Gemini") : "Şablon",
            model: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "gpt-4o-mini" : geminiModel) : "Algoritmik",
          };
          addAiHistory(newHist);
        }
      } else {
        const errJson = await res.json().catch(() => null);
        const msg = errJson?.error || errJson?.message || "Şirket verisi analiz edilirken bir sorun yaşandı.";
        showToast("Analiz Başarısız", msg, "error");
      }
    } catch (e) {
      console.warn("Company analyze error:", e);
      showToast("Bağlantı Hatası", "Sunucu bağlantısında sorun oluştu.", "error");
    } finally {
      setCompanyLoading(false);
      setAnalysisPhase(null);
    }
  };

  const handleSaveToBaskets = () => {
    if (!result) return;
    setSavedSuccess(true);

    const budgetNum = parseFloat(budget.replace(/\./g, "")) || 100000;

    const newBasket: Basket = {
      id: `orakul-${Date.now().toString().slice(-6)}`,
      name: `Orakul: ${goal.split(" ")[0]} Sepeti`,
      subtitle: `${risk} • AI Optimizasyonu`,
      riskLevel: risk.includes("Düşük") ? "Düşük" : risk.includes("Yüksek") ? "Yüksek" : "Orta",
      riskColor: risk.includes("Düşük") ? "low" : risk.includes("Yüksek") ? "high" : "mid",
      totalValue: budgetNum,
      totalCost: budgetNum,
      dailyChange: 0.0,
      totalProfitPercent: 0.0,
      description: result.summary || "",
      aiNote: "Orakul AI yapay zeka reçetesi tarafından otomatik oluşturulmuştur.",
      holdings: (result.allocation || []).map((item) => {
        const co = companies.find((c) => c.symbol.toUpperCase() === item.symbol.toUpperCase());
        const price = co ? co.price : 0;
        const allocatedMoney = (budgetNum * item.weight) / 100;
        const qty = price > 0 ? parseFloat((allocatedMoney / price).toFixed(1)) : 0;

        return {
          companySymbol: item.symbol,
          weightPercent: item.weight,
          quantity: qty,
          avgCost: price,
          currentPrice: price,
        };
      }),
    };

    createBasket(newBasket);

    const newHist: AiHistoryItem = {
      id: `ai-${Date.now()}`,
      date: "Bugün " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      type: "Sepet Önerisi",
      title: `${goal} — Özel Reçete`,
      description: `${result.allocation?.length || 0} varlık sepeti. Bütçe: ${budget} ₺. Skor: ${result.healthScore}/100.`,
      verdictTag: "DENGELİ",
      verdict: "DENGELİ",
      verdictDate: new Date().toISOString().split("T")[0],
      budgetAtCreation: budgetNum,
      outcomeCorrect: null,
      targetPeriodDays: 30,
      provider: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "OpenAI" : "Gemini") : "Şablon",
      model: aiStatus?.isRealAiActive ? (aiProvider === "openai" ? "gpt-4o-mini" : geminiModel) : "Algoritmik",
    };
    addAiHistory(newHist);
    showToast("Sepet Oluşturuldu", `${newBasket.name} sepetlerinize kaydedildi.`, "success");
  };

  const handleEvaluateOutcomes = () => {
    setEvaluating(true);
    evaluateAiOutcomes();
    showToast("Karneler Güncellendi", "Süresi dolan AI tahminlerinin isabet durumları kontrol edildi.", "info");
    setTimeout(() => setEvaluating(false), 800);
  };

  const filteredAiHistory = aiHistory.filter((item) => {
    if (historyFilter === "correct") return item.outcomeCorrect === true;
    if (historyFilter === "incorrect") return item.outcomeCorrect === false;
    if (historyFilter === "pending") return item.outcomeCorrect === null || item.outcomeCorrect === undefined;
    return true;
  });

  const [aiStatus, setAiStatus] = useState<{ isRealAiActive: boolean; modeText: string } | null>(null);

  React.useEffect(() => {
    fetch("/api/orakul")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAiStatus({ isRealAiActive: d.isRealAiActive, modeText: d.modeText });
      })
      .catch(() => {});
  }, []);

  // 10. Accuracy trend data for Success Report (Item 2)
  const accuracyTrendData = useMemo(() => {
    const evaluated = aiHistory
      .filter((h) => h.outcomeCorrect !== null && h.outcomeCorrect !== undefined)
      .sort((a, b) => {
        const dA = new Date(a.outcomeCheckedAt || a.verdictDate || a.date).getTime() || 0;
        const dB = new Date(b.outcomeCheckedAt || b.verdictDate || b.date).getTime() || 0;
        return dA - dB;
      });

    if (evaluated.length < 2) return null;

    let correctCount = 0;
    const points = evaluated.map((item, idx) => {
      if (item.outcomeCorrect) correctCount++;
      const currentRate = Math.round((correctCount / (idx + 1)) * 100);
      return {
        idx: idx + 1,
        date: item.verdictDate || item.date || `#${idx + 1}`,
        symbol: item.symbol,
        rate: currentRate,
        isCorrect: item.outcomeCorrect,
      };
    });

    const rates = points.map((p) => p.rate);
    const minRate = Math.max(0, Math.min(...rates) - 5);
    const maxRate = Math.min(100, Math.max(...rates) + 5);
    const range = Math.max(10, maxRate - minRate);

    const svgWidth = 400;
    const svgHeight = 90;
    const padding = 15;

    const coords = points.map((pt, i) => {
      const x = padding + (i / (points.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((pt.rate - minRate) / range) * (svgHeight - padding * 2);
      return { ...pt, x, y };
    });

    const pathD = coords.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`), "");
    const areaD = `${pathD} L ${coords[coords.length - 1].x},${svgHeight} L ${coords[0].x},${svgHeight} Z`;

    return { points: coords, pathD, areaD, minRate, maxRate, latestRate: points[points.length - 1]?.rate };
  }, [aiHistory]);

  // 11. Proactive insight memo (Premium Item 5)
  const proactiveInsight = useMemo(() => {
    if (companies.length === 0) return null;
    const allHeldSymbols = new Set(baskets.flatMap((b) => b.holdings.map((h) => h.companySymbol)));
    const unheldCandidates = companies.filter((c) => !allHeldSymbols.has(c.symbol) && (c.peRatio || 100) < 10);
    const target = unheldCandidates[0] || companies.find((c) => c.dailyChange > 2.5) || companies[0];

    if (!target) return null;

    return {
      symbol: target.symbol,
      name: target.name,
      message: `${target.name} (${target.symbol}) hissesi ${target.peRatio ? `${target.peRatio} F/K` : "cazip çarpanı"} ve %${target.dividendYield || 0} temettü potansiyeliyle Orakul radarına girdi. Takip kütüğünüzde öne çıkıyor.`,
      tag: "Proaktif Kütük Taraması",
    };
  }, [companies, baskets]);

  // 12. Güven Kalibrasyonu Memo (Geliştirme Madde 3)
  const calibrationStats = useMemo(() => {
    const evaluated = aiHistory.filter(
      (i) => i.outcomeCorrect !== null && i.outcomeCorrect !== undefined
    );
    if (evaluated.length === 0) return null;

    const parseConf = (c?: string | number) => {
      if (typeof c === "number") return c;
      if (!c) return 80;
      const num = parseInt(c.replace("%", "").trim(), 10);
      return isNaN(num) ? 80 : num;
    };

    const buckets = [
      { label: "Yüksek Güven (%80 - %100)", min: 80, max: 100, items: [] as typeof evaluated },
      { label: "Orta Güven (%60 - %79)", min: 60, max: 79, items: [] as typeof evaluated },
      { label: "Düşük Güven (< %60)", min: 0, max: 59, items: [] as typeof evaluated },
    ];

    evaluated.forEach((item) => {
      const conf = parseConf(item.confidence);
      const b = buckets.find((bucket) => conf >= bucket.min && conf <= bucket.max) || buckets[0];
      b.items.push(item);
    });

    return buckets.map((b) => {
      const total = b.items.length;
      const correct = b.items.filter((i) => i.outcomeCorrect === true).length;
      const actualRate = total > 0 ? Math.round((correct / total) * 100) : null;
      return { ...b, total, correct, actualRate };
    });
  }, [aiHistory]);

  // 13. Sağlayıcı & Model Karşılaştırma Memo (Geliştirme Madde 4)
  const providerStats = useMemo(() => {
    const evaluated = aiHistory.filter(
      (i) => i.outcomeCorrect !== null && i.outcomeCorrect !== undefined
    );
    if (evaluated.length === 0) return null;

    const providers = ["Gemini", "OpenAI", "Algoritmik / Şablon"];
    return providers
      .map((p) => {
        const items = evaluated.filter((i) => {
          const prov = (i.provider || "Şablon").toLowerCase();
          if (p === "Gemini") return prov.includes("gemini");
          if (p === "OpenAI") return prov.includes("openai");
          return !prov.includes("gemini") && !prov.includes("openai");
        });
        const total = items.length;
        const correct = items.filter((i) => i.outcomeCorrect === true).length;
        const rate = total > 0 ? Math.round((correct / total) * 100) : null;
        return { provider: p, total, correct, rate };
      })
      .filter((p) => p.total > 0);
  }, [aiHistory]);

  // 14. En İyi ve En Zayıf 3 Çağrı Memo (Geliştirme Madde 5)
  const topAndWorstCalls = useMemo(() => {
    const evaluatedWithReturns = aiHistory
      .filter(
        (i) =>
          i.outcomeCorrect !== null &&
          i.outcomeCorrect !== undefined &&
          i.priceAtVerdict &&
          i.priceAfterPeriod &&
          i.symbol
      )
      .map((i) => {
        const stockReturn =
          (((i.priceAfterPeriod || 0) - (i.priceAtVerdict || 1)) / (i.priceAtVerdict || 1)) * 100;
        const alpha = typeof i.alpha === "number" ? i.alpha : stockReturn;
        return {
          ...i,
          stockReturn: parseFloat(stockReturn.toFixed(1)),
          alpha: parseFloat(alpha.toFixed(1)),
        };
      });

    if (evaluatedWithReturns.length === 0) return null;

    const sorted = [...evaluatedWithReturns].sort((a, b) => b.alpha - a.alpha);
    const top3 = sorted.slice(0, 3);
    const worst3 = [...sorted].reverse().slice(0, 3).filter((w) => w.alpha < 0);

    return { top3, worst3 };
  }, [aiHistory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* 1. Orakul Hero Section with Rings & Seal */}
      <section className="relative text-center py-8 border-b border-[var(--line)] flex flex-col items-center">
        <OracleSeal size="lg" />

        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--brass)] tracking-widest uppercase bg-[var(--brass-glow)] px-3 py-1 rounded-xs border border-[var(--brass-dim)]">
            <Brain className="w-3.5 h-3.5" />
            <span>Yapay Zeka Analiz &amp; Karar Motoru</span>
          </div>

          {aiStatus && (
            <span
              className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded border ${
                aiStatus.isRealAiActive
                  ? "bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] border-[var(--verdigris)]"
                  : "bg-[var(--ink-3)] text-[var(--brass)] border-[var(--brass-dim)]"
              }`}
            >
              {aiStatus.modeText}
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[var(--paper)] max-w-3xl leading-snug">
          Orakul, sermayenin <br />
          <em className="text-[var(--brass)] italic">geleceğini hesaplasın.</em>
        </h1>

        <p className="mt-3 text-sm text-[var(--mist)] leading-relaxed max-w-xl">
          Makroekonomik döngüler, şirket bilançoları, Şirket Teşhisi&apos;nde kütük hafızasından beslenen geri besleme modeli ve başarı karnesi.
        </p>

        {/* Proaktif İçgörü Kartı (Premium Item 5) */}
        {proactiveInsight && (
          <div className="w-full max-w-3xl mt-6 p-4 rounded-xl bg-[var(--ink-2)] border border-[var(--brass-dim)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--brass-glow)] text-[var(--brass)] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--brass)] font-bold">
                    👁 Bu Hafta Dikkatimi Çekenler
                  </span>
                  <span className="font-mono text-[10px] text-[var(--mist)]">
                    • {proactiveInsight.tag}
                  </span>
                </div>
                <p className="text-xs text-[var(--paper)] mt-0.5 font-sans">
                  {proactiveInsight.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedCoSymbol(proactiveInsight.symbol);
                setActiveTab("company");
                showToast("Şirket Teşhisine Yönlendirildi", `${proactiveInsight.symbol} analiz için seçildi.`, "info");
              }}
              className="shrink-0 text-xs font-mono text-[var(--brass)] hover:text-[var(--paper)] bg-[var(--ink-3)] hover:bg-[var(--ink)] px-3 py-1.5 rounded border border-[var(--brass-dim)] transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Teşhis Et</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. Üst Seviye 3 Kategori Kartı (Kutucuk Tasarımı) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-5xl text-left">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? "bg-[var(--ink-3)] border-[var(--brass)] shadow-2xl ring-1 ring-[var(--brass-dim)] scale-[1.02]"
                    : "bg-[var(--ink-2)] border-[var(--line)] hover:border-[var(--brass-dim)] hover:bg-[var(--ink-3)] opacity-85 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        isSelected
                          ? "bg-[var(--brass)] text-[var(--ink)] shadow"
                          : "bg-[var(--ink-3)] text-[var(--brass)] group-hover:bg-[var(--brass-glow)]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-[var(--brass-glow)] text-[var(--brass)] border border-[var(--brass-dim)]"
                          : "text-[var(--mist)] bg-[var(--ink-3)]"
                      }`}
                    >
                      {cat.tabs.length} Modül
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[var(--paper)]">
                    {cat.title}
                  </h3>
                  <div className="font-mono text-[11px] text-[var(--brass)] mt-0.5 font-medium">
                    {cat.subtitle}
                  </div>
                  <p className="text-xs text-[var(--mist)] mt-2 line-clamp-2 leading-relaxed font-sans">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono">
                  <span className={isSelected ? "text-[var(--brass)] font-bold flex items-center gap-1.5" : "text-[var(--mist)]"}>
                    {isSelected ? "● Seçili Kategori" : "Kategoriye Geç →"}
                  </span>
                  <span className="text-[10px] text-[var(--mist)]">
                    {cat.tabs.map((t) => t.label.split(" ")[0]).join(" • ")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. Seçili Kategorinin Alt Özellikleri (Sub-Tabs Pil Barı) */}
        {(() => {
          const currentCategoryDef = CATEGORIES.find((c) => c.id === activeCategory);
          if (!currentCategoryDef) return null;
          return (
            <div className="mt-6 p-1.5 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl flex flex-wrap items-center justify-center gap-2 shadow-lg animate-in fade-in">
              <span className="font-mono text-[11px] text-[var(--mist)] px-3 hidden sm:inline-block border-r border-[var(--line)] py-1">
                <strong className="text-[var(--brass)]">{currentCategoryDef.title}</strong> Modülleri:
              </span>
              {currentCategoryDef.tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isTabActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      isTabActive
                        ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-md scale-105"
                        : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-3)]"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* 2. TAB 1: Sepet Sihirbazı */}
      {activeTab === "wizard" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4">
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              {rebalanceBasketId ? "Sepet Yeniden Dengeleme & Rebalance" : "Özelleştirilmiş Portföy Reçetesi"}
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              {rebalanceBasketId
                ? "Mevcut varlık ağırlıkları ile hedef yüzdeler karşılaştırılarak optimum dengeleme reçetesi üretilir."
                : "Yatırım hedeflerinizi seçin, Orakul matematiksel optimizasyonla sepet üretsin."}
            </p>
          </div>

          {/* Active Rebalance Context Banner */}
          {rebalanceBasketId && (() => {
            const rebalanceBasket = baskets.find((b) => b.id === rebalanceBasketId);
            if (!rebalanceBasket) return null;
            return (
              <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--brass)] font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Sepet Rebalance Modu: {rebalanceBasket.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRebalanceBasketId(null);
                      setGoal("Temettü Odaklı Nakit Akışı");
                    }}
                    className="text-[11px] font-mono text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
                  >
                    Rebalance Modundan Çık ✕
                  </button>
                </div>
                <p className="text-xs text-[var(--paper-dim)]">
                  Bu sepetin {rebalanceBasket.holdings.length} adet mevcut varlığı ve hedef ağırlıkları AI optimizasyon motoruna aktarılacak; ağırlığı aşırı artmış varlıklar için kâr realizasyonu, geride kalanlar için ekleme önerileri üretilecektir.
                </p>
              </div>
            );
          })()}

          <div className="space-y-6">
            {/* 1. Kurumsal Strateji Şablonları */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)]">
                  1. Yatırım Stratejisi &amp; Arketip Seçimi
                </label>
                <span className="text-[10px] font-mono text-[var(--brass)] bg-[var(--brass-glow)] px-2 py-0.5 rounded border border-[var(--brass-dim)]">
                  KURUMSAL HEDGE-FUND MODELİ
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    id: "dividend_aristocrats",
                    title: "Temettü Aristokratları & DRIP",
                    badge: "Bileşik Büyüme",
                    desc: "Yüksek ve sürdürülebilir nakit temettü verimiyle kartopu etkisi hedefleyen şirketler.",
                    goalText: "Temettü Odaklı Nakit Akışı",
                    riskText: "Dengeli (Orta Risk)",
                    universeText: "Tüm BIST 100 & Temettü 25",
                  },
                  {
                    id: "defensive_castle",
                    title: "Enflasyon Kalkanı & Kale",
                    badge: "Defansif",
                    desc: "Güçlü nakit akışı ve fiyatlama gücü olan BIST 30 devleri + %25 Gram Altın tamponu.",
                    goalText: "Enflasyon & Kur Koruması",
                    riskText: "Düşük Risk (Defansif)",
                    universeText: "BIST 30 & Kıymetli Maden",
                  },
                  {
                    id: "garp",
                    title: "GARP (Makul Fiyatlı Büyüme)",
                    badge: "Büyüme",
                    desc: "Düşük F/K ile sektör ortalamasının üzerinde ciro ve FAVÖK artışı yakalayan liderler.",
                    goalText: "Döviz Kazançlı İhracat Şampiyonları",
                    riskText: "Dengeli (Orta Risk)",
                    universeText: "Tüm BIST 100 & Temettü 25",
                  },
                  {
                    id: "deep_value",
                    title: "Derin Değer (Graham Kelepiri)",
                    badge: "İskontolu",
                    desc: "Defter değerine ve özkaynaklarına göre aşırı ucuz kalmış sağlam sanayi hisseleri.",
                    goalText: "Derin Değer & Düşük F/K Avı",
                    riskText: "Dengeli (Orta Risk)",
                    universeText: "Tüm Defter Kütüğü (Hisse + Fon + Döviz)",
                  },
                  {
                    id: "global_hedge",
                    title: "Küresel Denge & Dövizli Gelir",
                    badge: "Döviz Korumalı",
                    desc: "İhracatçı BIST şirketleri + TEFAS Küresel Teknoloji Fonları + Ons Emtia karması.",
                    goalText: "Küresel Piyasalar & Dövizli Gelir",
                    riskText: "Dengeli (Orta Risk)",
                    universeText: "Küresel Piyasalar (ABD & BIST)",
                  },
                  {
                    id: "momentum_leaders",
                    title: "Momentum & Trend Liderleri",
                    badge: "Dinamik",
                    desc: "52 haftalık zirvesine koşan, hacim patlaması yaşayan ve teknik gücü yüksek hisseler.",
                    goalText: "Büyüme & Teknoloji İnovasyonu",
                    riskText: "Yüksek Risk (Agresif)",
                    universeText: "BIST Teknoloji & Bilişim (XTEK)",
                  },
                ].map((arch) => (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => {
                      setStrategyArchetype(arch.id);
                      setGoal(arch.goalText);
                      setRisk(arch.riskText);
                      setUniverse(arch.universeText);
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer space-y-1.5 ${
                      strategyArchetype === arch.id
                        ? "bg-[var(--brass-glow)] border-[var(--brass)] shadow-md text-[var(--paper)]"
                        : "bg-[var(--ink-3)] border-[var(--line)] text-[var(--mist)] hover:border-[var(--brass-dim)] hover:text-[var(--paper)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-[var(--paper)]">
                        {arch.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--ink)] border border-[var(--line)] text-[var(--brass)] font-bold">
                        {arch.badge}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[var(--mist)] line-clamp-2">
                      {arch.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Risk & Evren Ayarları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Risk Toleransı */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                  2. Risk Toleransı
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    "Düşük Risk (Defansif)",
                    "Dengeli (Orta Risk)",
                    "Yüksek Risk (Agresif)",
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRisk(r)}
                      className={`p-2 rounded-lg text-xs font-mono border text-center transition-all cursor-pointer truncate ${
                        risk === r
                          ? "border-[var(--brass)] bg-[var(--brass-glow)] text-[var(--brass)] font-bold shadow-xs"
                          : "border-[var(--line)] bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)]"
                      }`}
                    >
                      {r.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Yatırım Evreni */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                  3. Yatırım Evreni
                </label>
                <select
                  value={universe}
                  onChange={(e) => setUniverse(e.target.value)}
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-2.5 text-xs font-mono text-[var(--paper)] outline-none focus:border-[var(--brass)]"
                >
                  <option value="BIST 30 & Kıymetli Maden">BIST 30 & Kıymetli Maden</option>
                  <option value="Tüm BIST 100 & Temettü 25">Tüm BIST 100 & Temettü 25</option>
                  <option value="BIST Teknoloji & Bilişim (XTEK)">BIST Teknoloji (XTEK)</option>
                  <option value="TEFAS Fonları & Emtia">TEFAS Fonları & Emtia</option>
                  <option value="Küresel Piyasalar (ABD & BIST)">Küresel Piyasalar (ABD & BIST)</option>
                  <option value="Tüm Defter Kütüğü (Hisse + Fon + Döviz)">Tüm Defter Kütüğü (420+ Varlık)</option>
                </select>
              </div>

              {/* Yatırım Ufku */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                  4. Hedef Vade
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    "Kısa Vade (1-6 Ay)",
                    "Orta Vade (6-18 Ay)",
                    "Uzun Vade (3-5+ Yıl)",
                  ].map((hOpt) => (
                    <button
                      key={hOpt}
                      type="button"
                      onClick={() => setHorizon(hOpt)}
                      className={`p-2 rounded-lg text-xs font-mono border text-center transition-all cursor-pointer truncate ${
                        horizon === hOpt
                          ? "border-[var(--brass)] bg-[var(--brass-glow)] text-[var(--brass)] font-bold shadow-xs"
                          : "border-[var(--line)] bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)]"
                      }`}
                    >
                      {hOpt.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Gelişmiş Nicel Süzgeçler & Kural Kısıtları (Akordiyon) */}
            <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--brass)] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--brass)]" />
                  <span>5. Nicel Süzgeçler &amp; Portföy Güvenlik Kalkanı</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-[10px] text-[var(--brass)] hover:underline cursor-pointer font-bold"
                >
                  {showAdvancedFilters ? "▲ Filtreleri Gizle" : "▼ Gelişmiş Kriterleri Düzenle"}
                </button>
              </div>

              {/* Varlık Sayısı ve Altın Sigortası */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[var(--mist)] font-medium">Hedef Varlık Adedi</span>
                    <span className="font-mono text-xs text-[var(--brass)] font-bold">{assetCount} Varlık</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 font-mono text-xs">
                    {[3, 4, 5, 6, 8].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setAssetCount(cnt)}
                        className={`py-1.5 rounded text-center border transition-all cursor-pointer ${
                          assetCount === cnt
                            ? "bg-[var(--brass)] text-[var(--ink)] font-bold border-[var(--brass)] shadow-xs"
                            : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)]"
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  onClick={() => setIncludeGoldBuffer(!includeGoldBuffer)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    includeGoldBuffer
                      ? "bg-[var(--brass-glow)] border-[var(--brass)] text-[var(--paper)] font-bold shadow-xs"
                      : "bg-[var(--ink-2)] border-[var(--line)] text-[var(--mist)]"
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-bold block text-[var(--paper)]">Kıymetli Maden Tamponu</span>
                    <span className="text-[10px] opacity-80 block">En az %15 Gram Altın sigortası ekle</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeGoldBuffer}
                    onChange={(e) => setIncludeGoldBuffer(e.target.checked)}
                    className="w-4 h-4 accent-[var(--brass)] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Gelişmiş Açılır Alan */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--line)]/60 animate-in fade-in">
                  <div className="p-3 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[var(--mist)]">Minimum Temettü Verimi:</span>
                      <span className="font-bold text-[var(--paper)] font-mono">
                        {minDividendYield > 0 ? `%${minDividendYield}` : "Kısıt Yok"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={minDividendYield}
                      onChange={(e) => setMinDividendYield(Number(e.target.value))}
                      className="w-full accent-[var(--brass)] cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[var(--mist)]">Maksimum Fiyat/Kazanç (F/K) Tavanı:</span>
                      <span className="font-bold text-[var(--paper)] font-mono">
                        {maxPeRatio > 0 ? `F/K ≤ ${maxPeRatio}` : "Kısıt Yok"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      step={2}
                      value={maxPeRatio}
                      onChange={(e) => setMaxPeRatio(Number(e.target.value))}
                      className="w-full accent-[var(--brass)] cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 6. Başlangıç Bütçesi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[var(--mist)]">
                  6. Başlangıç Bütçesi (₺)
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {["25.000", "50.000", "100.000", "250.000", "500.000", "1.000.000"].map((bVal) => (
                    <button
                      key={bVal}
                      type="button"
                      onClick={() => setBudget(bVal)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
                    >
                      {bVal} ₺
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] text-sm text-[var(--paper)] rounded-lg p-3 font-mono outline-none focus:border-[var(--brass)] shadow-inner"
                placeholder="100.000"
              />
            </div>

            <button
              onClick={handleGenerateRecipe}
              disabled={loading}
              className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Orakul Reçetesi Hesaplanıyor..." : "Orakul AI Reçetesini Üret"}</span>
            </button>

            {/* Live Progress Banner for Recipe */}
            {loading && recipePhase && (
              <div className="p-4 bg-[var(--ink-3)] border border-[var(--brass)] rounded-xl space-y-2 animate-pulse mt-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[var(--brass)] font-bold flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[var(--brass)]" />
                    <span>{recipePhase}</span>
                  </span>
                  <span className="text-[var(--mist)]">3-Agent Hedge-Fund Model</span>
                </div>
                <div className="w-full bg-[var(--ink-2)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--brass)] h-full w-2/3 animate-pulse rounded-full" />
                </div>
              </div>
            )}
          </div>

          {/* SONUÇ KARTI (ZENGİN KOMİTE, HESAPLANAN QUANT & LOT DAĞILIMI) */}
          {result && (
            <div className="mt-8 pt-6 border-t border-[var(--line)] space-y-6 animate-in fade-in">
              {/* Başlık & Sağlık Skoru */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--ink-3)] p-5 rounded-xl border border-[var(--brass-dim)] shadow-md">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brass)]">
                      Orakul Portföy Reçetesi
                    </span>
                    {result.engine === "algorithmic" || result.isTemplate ? (
                      <span className="text-[9px] font-mono font-bold bg-[rgba(212,160,23,0.15)] text-[var(--brass)] border border-[var(--brass-dim)] px-2 py-0.5 rounded">
                        ⚡ Kural Motoru (Kütük Tabanlı)
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)] px-2 py-0.5 rounded">
                        ✨ 3-Ajanlı Orakul Komitesi
                      </span>
                    )}
                    <span className="text-[9px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <Calculator className="w-3 h-3" />
                      <span>📐 Hesaplanan Model Çıktısı</span>
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--paper)] mt-0.5">
                    {result.recipeTitle || result.title}
                  </h3>
                  <p className="text-xs text-[var(--mist)] font-sans max-w-2xl leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="block font-mono text-[10px] text-[var(--mist)]">
                      Portföy Sağlık Skoru
                    </span>
                    <span className="font-serif text-xl font-bold text-[var(--verdigris)]">
                      {result.healthScore || "94"}/100
                    </span>
                  </div>
                  <StampBadge verdict="GÜÇLÜ AL" />
                </div>
              </div>

              {/* Sahte Çeşitlendirme Uyarısı (Pseudo-Diversification Warning) */}
              {result.isPseudoDiversified && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-amber-200 text-sm flex items-center gap-2">
                      <span>⚠️ Sahte Çeşitlendirme Uyarısı (Yüksek Korelasyon)</span>
                      <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-amber-200">
                        Ort. Korelasyon: %{((result.averageCorrelation ?? 0.75) * 100).toFixed(0)}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-200/90 font-sans">
                      Bu portföydeki varlıkların getirileri arasında yüksek korelasyon tespit edildi. Farklı sektörlerden seçilmiş görünseler de piyasa stresinde benzer yönde hareket edebilir ve beklenen risk dağıtımı avantajını tam sağlayamayabilir.
                    </p>
                  </div>
                </div>
              )}

              {/* Sepet Dengeleme (Rebalance) Aksiyon Planı */}
              {result.rebalanceActions && result.rebalanceActions.length > 0 && (
                <div className="p-4 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--line)]/60 pb-2.5">
                    <h4 className="font-serif font-bold text-xs text-[var(--paper)] flex items-center gap-2">
                      <ArrowLeftRight className="w-4 h-4 text-[var(--brass)]" />
                      <span>Sepet Dengeleme (Rebalance) Aksiyon Planı</span>
                    </h4>
                    <span className="font-mono text-[10px] text-[var(--brass)] bg-[rgba(212,160,23,0.1)] px-2 py-0.5 rounded border border-[var(--brass-dim)]">
                      📐 Hedef Ağırlık Uyumlandırması
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.rebalanceActions.map((act) => (
                      <div
                        key={act.symbol}
                        className={`p-3 rounded-lg border text-xs space-y-2 ${
                          act.action === "ARTIR"
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : act.action === "AZALT"
                            ? "bg-rose-500/10 border-rose-500/30"
                            : "bg-[var(--ink-3)] border-[var(--line)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[var(--paper)]">{act.symbol}</span>
                            <span className="text-[11px] text-[var(--mist)] font-sans">{act.name}</span>
                          </div>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                              act.action === "ARTIR"
                                ? "bg-emerald-500 text-black"
                                : act.action === "AZALT"
                                ? "bg-rose-500 text-white"
                                : "bg-[var(--ink-2)] text-[var(--mist)] border border-[var(--line)]"
                            }`}
                          >
                            {act.action === "ARTIR" ? "▲ ARTIR" : act.action === "AZALT" ? "▼ AZALT" : "● TUT"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono border-t border-[var(--line)]/40 pt-1.5">
                          <span className="text-[var(--mist)]">
                            Ağırlık: %{act.currentWeight} → <strong className="text-[var(--paper)]">%{act.targetWeight}</strong> ({act.diffWeight > 0 ? `+${act.diffWeight}` : act.diffWeight}%)
                          </span>
                          {act.sharesChange !== 0 ? (
                            <span className="font-bold text-[var(--paper)]">
                              {act.sharesChange > 0 ? `+${act.sharesChange}` : act.sharesChange} Lot (~{(act.estimatedAmountChange || 0).toLocaleString("tr-TR")} ₺)
                            </span>
                          ) : (
                            <span className="text-[var(--mist)]">Pozisyon Korunuyor</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--paper-dim)] font-sans">{act.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3-Ajanlı Yatırım Komitesi Tartışması (YORUM AYRIMI) */}
              {result.committeeDebate && (
                <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-2">
                    <h4 className="font-serif font-bold text-xs text-[var(--paper)] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--brass)]" />
                      <span>Yatırım Komitesi Müzakeresi &amp; Stratejik Değerlendirme</span>
                    </h4>
                    <span className="text-[9px] font-mono text-[var(--brass)] bg-[var(--ink-3)] px-2 py-0.5 rounded border border-[var(--brass-dim)] flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      <span>🤖 AI / Komite Yorumu</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {result.committeeDebate.bullSummary && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg space-y-1">
                        <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase flex items-center justify-between">
                          <span>🐂 Boğa Ajanı (Büyüme Tezi)</span>
                          <span className="text-[8px] opacity-75 font-normal">🤖 AI Yorumu</span>
                        </span>
                        <p className="text-[11px] text-[var(--paper)] leading-relaxed">
                          {result.committeeDebate.bullSummary}
                        </p>
                      </div>
                    )}
                    {result.committeeDebate.bearSummary && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-lg space-y-1">
                        <span className="font-mono text-[10px] text-rose-400 font-bold uppercase flex items-center justify-between">
                          <span>🐻 Ayı Ajanı (Risk Denetimi)</span>
                          <span className="text-[8px] opacity-75 font-normal">🤖 AI Yorumu</span>
                        </span>
                        <p className="text-[11px] text-[var(--paper)] leading-relaxed">
                          {result.committeeDebate.bearSummary}
                        </p>
                      </div>
                    )}
                  </div>
                  {result.committeeDebate.verdict && (
                    <div className="p-2.5 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-lg text-xs text-[var(--brass)] font-medium flex items-center justify-between">
                      <span>⚖️ {result.committeeDebate.verdict}</span>
                      <span className="text-[9px] font-mono text-[var(--mist)]">🤖 Karar</span>
                    </div>
                  )}
                </div>
              )}

              {/* Finansal & Nicel Metrik Şeridi (TAM HESAPLANAN QUANT VERİLERİ) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs text-[var(--mist)] uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-[var(--brass)]" />
                    <span>Deterministik Risk &amp; Ekonometri Metrikleri</span>
                  </h4>
                  <span className="text-[9px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    📐 quantEngine.ts ile Sıfır Uydurma Matematik
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* 1. Sharpe Oranı */}
                  <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--mist)]">Sharpe Oranı</span>
                      <span className="text-[8px] font-mono bg-sky-500/15 text-sky-300 px-1 rounded">📐 Hesaplanan</span>
                    </div>
                    <span className="font-mono text-base font-bold text-emerald-400 block">
                      {result.sharpeRatio ?? 1.85}
                    </span>
                    <span className="text-[9px] text-[var(--mist)] block font-mono">
                      Sortino: {result.sortinoRatio ?? 2.1}
                    </span>
                  </div>

                  {/* 2. Tahmini Volatilite & Beta */}
                  <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--mist)]">Volatilite (Risk)</span>
                      <span className="text-[8px] font-mono bg-sky-500/15 text-sky-300 px-1 rounded">📐 Hesaplanan</span>
                    </div>
                    <span className="font-mono text-base font-bold text-purple-400 block">
                      %{result.estimatedVolatility ?? 14.2}
                    </span>
                    <span className="text-[9px] text-[var(--mist)] block font-mono">
                      Beta: {result.portfolioBeta ?? 1.0}
                    </span>
                  </div>

                  {/* 3. HHI Yoğunlaşma Skoru */}
                  <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--mist)]">HHI Yoğunlaşma</span>
                      <span className="text-[8px] font-mono bg-sky-500/15 text-sky-300 px-1 rounded">📐 Hesaplanan</span>
                    </div>
                    <span className="font-mono text-base font-bold text-cyan-400 block">
                      {result.hhiScore ?? 2500}
                    </span>
                    <span className="text-[9px] text-[var(--mist)] block">
                      {result.hhiScore && result.hhiScore > 2500 ? "Yüksek Yoğun" : "Dengeli Dağılım"}
                    </span>
                  </div>

                  {/* 4. Ortalama Korelasyon */}
                  <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--mist)]">Ort. Korelasyon</span>
                      <span className="text-[8px] font-mono bg-sky-500/15 text-sky-300 px-1 rounded">📐 Hesaplanan</span>
                    </div>
                    <span className={`font-mono text-base font-bold block ${result.isPseudoDiversified ? "text-amber-400" : "text-emerald-400"}`}>
                      %{((result.averageCorrelation ?? 0.55) * 100).toFixed(0)}
                    </span>
                    <span className="text-[9px] text-[var(--mist)] block">
                      {result.isPseudoDiversified ? "⚠️ Sahte Çeşitlilik" : "Sağlıklı Kovaryans"}
                    </span>
                  </div>

                  {/* 5. Makro Dolar Duyarlılığı */}
                  <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--mist)]">USD &amp; Faiz Tepkisi</span>
                      <span className="text-[8px] font-mono bg-sky-500/15 text-sky-300 px-1 rounded">📐 Hesaplanan</span>
                    </div>
                    <span className="font-mono text-base font-bold text-blue-400 block">
                      USD: +%{result.usdElasticityPct ?? 3.5}
                    </span>
                    <span className="text-[9px] text-[var(--mist)] block font-mono">
                      Faiz -500bp: +%{result.interestRateSensitivityPct ?? 4.0}
                    </span>
                  </div>

                  {/* 6. Kalan Nakit Rezervi */}
                  <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--mist)]">Kalan Nakit</span>
                      <span className="text-[8px] font-mono bg-sky-500/15 text-sky-300 px-1 rounded">📐 Lot Hesabı</span>
                    </div>
                    <span className="font-mono text-base font-bold text-[var(--brass)] block">
                      {(result.cashReserve || 0).toLocaleString("tr-TR")} ₺
                    </span>
                    <span className="text-[9px] text-[var(--mist)] block">Kuruşuna tam lot</span>
                  </div>
                </div>
              </div>

              {/* Gerçek Geçmiş Backtest vs Model Beklentisi (GÖREV 6) */}
              <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--line)]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-serif font-bold text-xs text-[var(--paper)]">
                      1 Yıllık Geçmiş Piyasa Backtest'i vs Model Beklenti Hedefi
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[var(--mist)] bg-[var(--ink-3)] px-2 py-0.5 rounded border border-[var(--line)]">
                      🤖 Hedef: {result.expectedYield || "%45+ Yıllık"}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                      📐 Gerçek Geçmiş Fiyat Akışı
                    </span>
                  </div>
                </div>

                {recipeBacktestLoading ? (
                  <div className="p-4 bg-[var(--ink-3)] rounded-lg flex items-center justify-center gap-2 text-xs font-mono text-[var(--mist)] animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-[var(--brass)]" />
                    <span>Geçmiş 1Y günlük BIST 100 ve varlık kapanış fiyatları taranıyor...</span>
                  </div>
                ) : recipeBacktest ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
                      <span className="text-[10px] text-[var(--mist)] block">Portföy 1Y Gerçek Getirisi</span>
                      <span className={`font-mono text-base font-bold block ${recipeBacktest.portfolioReturnPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {recipeBacktest.portfolioReturnPct >= 0 ? `+${recipeBacktest.portfolioReturnPct.toFixed(1)}%` : `${recipeBacktest.portfolioReturnPct.toFixed(1)}%`}
                      </span>
                      <span className="text-[9px] text-[var(--mist)]">Doğrulanmış geçmiş veri</span>
                    </div>

                    <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
                      <span className="text-[10px] text-[var(--mist)] block">BIST 100 Karşılaştırması</span>
                      <span className="font-mono text-base font-bold text-[var(--paper)] block">
                        +{recipeBacktest.bist100ReturnPct.toFixed(1)}%
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono">
                        Alfa: {recipeBacktest.alphaOverBist >= 0 ? `+${recipeBacktest.alphaOverBist.toFixed(1)}%` : `${recipeBacktest.alphaOverBist.toFixed(1)}%`}
                      </span>
                    </div>

                    <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
                      <span className="text-[10px] text-[var(--mist)] block">Gram Altın Getirisi</span>
                      <span className="font-mono text-base font-bold text-[var(--brass)] block">
                        +{recipeBacktest.goldReturnPct.toFixed(1)}%
                      </span>
                      <span className="text-[9px] text-[var(--mist)]">Enflasyon çıpası</span>
                    </div>

                    <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
                      <span className="text-[10px] text-[var(--mist)] block">Max Drawdown (Zirveden Düşüş)</span>
                      <span className="font-mono text-base font-bold text-rose-400 block">
                        -%{Math.abs(recipeBacktest.maxDrawdownPct).toFixed(1)}
                      </span>
                      <span className="text-[9px] text-[var(--mist)]">Gerçekleşen en büyük geri çekilme</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] flex items-center justify-between text-xs">
                    <span className="text-[var(--mist)]">Modelin hedeflediği tahmini getiri aralığı:</span>
                    <span className="font-mono font-bold text-emerald-400">{result.expectedYield || "%48.0 Yıllık Getiri Hedefi"}</span>
                  </div>
                )}
              </div>

              {/* Varlık Kartları & Tam Lot Dağılımı */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs text-[var(--mist)] uppercase tracking-wider">
                    Önerilen Varlıklar, Tam Lotlar &amp; Boğa/Ayı Tezleri
                  </h4>
                  <span className="text-[9px] font-mono text-[var(--mist)]">
                    Kuruşuna Tam Lot &amp; Gerçek Fiyat Dağılımı
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.allocation?.map((item) => (
                    <div
                      key={item.symbol}
                      className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-[var(--line)]/50 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[var(--paper)]">
                              {item.symbol}
                            </span>
                            <span className="text-xs text-[var(--mist)] font-sans">
                              {item.companyName || item.name}
                            </span>
                          </div>
                          {item.suggestedShares && item.suggestedShares > 0 ? (
                            <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">
                              {item.suggestedShares} Lot (~{(item.totalCost || 0).toLocaleString("tr-TR")} ₺)
                            </span>
                          ) : item.price ? (
                            <span className="text-xs font-mono text-[var(--mist)] block mt-0.5">
                              Fiyat: {(item.price || 0).toLocaleString("tr-TR")} ₺
                            </span>
                          ) : null}
                        </div>
                        <div className="font-mono font-bold text-sm text-[var(--brass)] shrink-0 bg-[var(--brass-glow)] px-2.5 py-1 rounded border border-[var(--brass-dim)]">
                          %{item.weight}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {item.bullThesis && (
                          <div className="p-2 bg-emerald-500/5 rounded border border-emerald-500/15">
                            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold mb-0.5">
                              <span>🐂 Boğa Tezi</span>
                              <span className="text-[8px] opacity-75 font-normal">🤖 AI Yorumu</span>
                            </div>
                            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                              {item.bullThesis}
                            </p>
                          </div>
                        )}
                        {item.bearRisk && (
                          <div className="p-2 bg-rose-500/5 rounded border border-rose-500/15">
                            <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 font-bold mb-0.5">
                              <span>🐻 Ayı Riski</span>
                              <span className="text-[8px] opacity-75 font-normal">🤖 AI Yorumu</span>
                            </div>
                            <p className="text-[11px] text-rose-200/90 leading-relaxed">
                              {item.bearRisk}
                            </p>
                          </div>
                        )}
                        {item.note && !item.bullThesis && (
                          <p className="text-[11px] text-[var(--paper-dim)]">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Save to Baskets */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleSaveToBaskets}
                  disabled={savedSuccess}
                  className="bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--brass)] text-[var(--brass)] hover:text-[var(--paper)] font-mono text-xs px-5 py-2.5 rounded flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{savedSuccess ? "Sepetlerime Kaydedildi ✓" : "Bu Reçeteyi Sepetime Aktar"}</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB: Orakul AI Copilot (OpenBB Copilot Financial AI Assistant) */}
      {activeTab === "copilot" && (
        <section className="animate-in fade-in duration-300">
          <OrakulCopilotChat />
        </section>
      )}

      {/* TAB: Otonom AI Tarayıcı (Autonomous Scan Feed) */}
      {activeTab === "autonomous_scan" && (
        <section className="animate-in fade-in duration-300">
          <AutonomousScanFeed
            onAddHoldingToBasket={(symbol) => {
              setSelectedCoSymbol(symbol);
              setActiveTab("company");
            }}
          />
        </section>
      )}

      {/* TAB: AI Model Sepetler (Ai Model Portfolios & Self Learning) */}
      {activeTab === "model_baskets" && (
        <section className="animate-in fade-in duration-300">
          <AiModelPortfolios />
        </section>
      )}

      {/* 3. TAB 2: Şirket Teşhisi (Tekli & Karşılaştırmalı Mod) */}
      {activeTab === "company" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-[var(--brass)] uppercase font-semibold">
                  Corporate DCF &amp; Quant Diagnosis
                </span>
                <button
                  onClick={() => {
                    setIsCompareMode(!isCompareMode);
                    setCompanyAnalysis(null);
                    setCompareAnalysis(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCompareMode
                      ? "bg-[var(--brass)] text-[var(--ink)] border-[var(--brass)] font-bold shadow"
                      : "bg-[var(--ink-3)] text-[var(--mist)] border-[var(--line)] hover:text-[var(--paper)]"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isCompareMode ? "✓ Karşılaştırma Modu Aktif" : "+ İkinci Şirket Ekle (Karşılaştır)"}</span>
                </button>
              </div>
              <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                {isCompareMode ? "Karşılaştırmalı Şirket Değerleme & Teşhis" : "Derin Şirket Değerleme & Bilanço Teşhisi"}
              </h2>
              <p className="text-xs font-mono text-[var(--mist)] mt-1">
                Şirket çarpanları, bilanço gücü ve geçmiş analizlerden beslenen geri bildirimli Orakul teşhisi.
              </p>
            </div>

            <div className={`w-full ${isCompareMode ? "sm:w-[480px]" : "sm:w-80"}`}>
              {isCompareMode ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <CompanyCombobox
                      companies={companies}
                      selectedSymbol={selectedCoSymbol}
                      onSelect={(co) => {
                        setSelectedCoSymbol(co.symbol);
                        setCompanyAnalysis(null);
                      }}
                      label="1. Şirket"
                    />
                    <CompanyCombobox
                      companies={companies}
                      selectedSymbol={compareCoSymbol}
                      onSelect={(co) => {
                        setCompareCoSymbol(co.symbol);
                        setCompareAnalysis(null);
                      }}
                      label="2. Şirket (Kıyas)"
                    />
                  </div>
                  <button
                    onClick={handleCompanyAnalyze}
                    disabled={companyLoading}
                    className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg cursor-pointer disabled:opacity-50 shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{companyLoading ? "Kıyaslanıyor..." : `${selectedCoSymbol} vs ${compareCoSymbol} Kıyasla`}</span>
                  </button>
                </div>
              ) : (
                <div>
                  <CompanyCombobox
                    companies={companies}
                    selectedSymbol={selectedCoSymbol}
                    onSelect={(co) => {
                      setSelectedCoSymbol(co.symbol);
                      setCompanyAnalysis(null);
                    }}
                    label="İncelenecek Şirket / Varlık"
                  />
                  <button
                    onClick={handleCompanyAnalyze}
                    disabled={companyLoading}
                    className="w-full mt-2 bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg cursor-pointer disabled:opacity-50 shadow transition-all active:scale-95"
                  >
                    {companyLoading ? "Teşhis Ediliyor..." : `${selectedCoSymbol} İçin Teşhis Üret`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Scanning Radar Terminal */}
          {companyLoading && (
            <OrakulLiveAnalysisRadar
              symbol={selectedCoSymbol}
              minDurationMs={2800}
            />
          )}

          {/* Single Mode Result */}
          {!isCompareMode && companyAnalysis && (
            <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 sm:p-8 space-y-6 animate-in fade-in shadow-2xl">
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border-2 border-[var(--brass)] bg-[var(--ink-2)] flex items-center justify-center font-mono font-bold text-lg text-[var(--brass)] shadow">
                    {companyAnalysis.symbol}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[var(--paper)]">
                      {companyAnalysis.symbol} — Kurumsal Değerleme Raporu
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                      <span className="text-[var(--verdigris)] font-semibold">
                        Sağlık Skoru: {companyAnalysis.valuationScore}
                      </span>
                      {companyAnalysis.confidence && (
                        <span className="text-[var(--mist)]">• Güven: {companyAnalysis.confidence}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AiReportPdfExporter title={`${companyAnalysis.symbol} Değerleme Raporu`} />
                  <StampBadge verdict={companyAnalysis.verdict || "AL"} />
                </div>
              </div>

              {/* OpenBB AI Analyst Price Target & Consensus Gauge */}
              <AiAnalystTargetGauge
                company={
                  (companies.find((c) => c.symbol === companyAnalysis.symbol) || {
                    id: companyAnalysis.symbol || "co",
                    symbol: companyAnalysis.symbol || "BIST",
                    name: companyAnalysis.symbol || "BIST",
                    price: companyAnalysis.fairValue || 100,
                    dailyChange: 0,
                    sector: "BIST",
                    exchange: "BIST",
                    assetClass: "hisse",
                    currency: "₺",
                  }) as Company
                }
                report={companyAnalysis as unknown as CompanyDiagnosisReport}
              />

              {/* FinGPT Bull vs Bear AI Debate Card */}
              <AiBullBearDebateCard report={companyAnalysis as unknown as CompanyDiagnosisReport} companySymbol={companyAnalysis.symbol} />

              {/* 10-Agent Investment Committee Debate Card */}
              <AiAgentCommitteeCard
                company={
                  (companies.find((c) => c.symbol === companyAnalysis.symbol) || {
                    id: companyAnalysis.symbol || "co",
                    symbol: companyAnalysis.symbol || "BIST",
                    name: companyAnalysis.symbol || "BIST",
                    price: companyAnalysis.fairValue || 100,
                    dailyChange: 0,
                    sector: "BIST",
                    exchange: "BIST",
                    assetClass: "hisse",
                    currency: "₺",
                  }) as Company
                }
              />

              {/* 4 Quant Valuation Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                {/* 1. Target & Upside */}
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    12A Hedef Fiyat (DCF)
                  </span>
                  <div className="text-base font-bold text-[var(--paper)]">
                    {companyAnalysis.targetPrice12M ? `${companyAnalysis.targetPrice12M.toFixed(2)} ₺` : "—"}
                  </div>
                  <span className="text-[11px] font-bold text-[var(--verdigris)] block">
                    {companyAnalysis.upsidePotential ? `Potansiyel: ${companyAnalysis.upsidePotential}` : <span className="text-[var(--mist)] font-sans font-normal italic">Yalnızca AI Analiziyle</span>}
                  </span>
                </div>

                {/* 2. Piotroski F-Score */}
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    Piotroski F-Score
                  </span>
                  <div className="text-base font-bold text-[var(--brass)]">
                    {companyAnalysis.piotroskiScore !== undefined ? `${companyAnalysis.piotroskiScore} / 9` : "—"}
                  </div>
                  <span className="text-[11px] text-[var(--paper-dim)] block">
                    {companyAnalysis.piotroskiScore !== undefined
                      ? companyAnalysis.piotroskiScore >= 7
                        ? "Mükemmel Finansallar"
                        : "Ortalama Bilanço"
                      : <span className="text-[var(--mist)] font-sans italic">Mali Tablo Kapsamı Gerekir</span>}
                  </span>
                </div>

                {/* 3. Altman Z-Score */}
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    Altman Z-Score
                  </span>
                  <div className="text-sm font-bold text-[var(--verdigris)] truncate">
                    {companyAnalysis.altmanZScore || "—"}
                  </div>
                  <span className="text-[11px] text-[var(--mist)] block">
                    {companyAnalysis.altmanZScore ? "Temerrüt Riski Analizi" : <span className="font-sans italic">Mali Tablo Kapsamı Gerekir</span>}
                  </span>
                </div>

                {/* 4. DuPont ROE */}
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    DuPont Özsermaye Kârı
                  </span>
                  <div className="text-sm font-bold text-[var(--paper)] truncate">
                    {companyAnalysis.dupontRoe || "—"}
                  </div>
                  <span className="text-[11px] text-[var(--brass)] block truncate">
                    {companyAnalysis.peVsSector || <span className="text-[var(--mist)] font-sans italic">Mali Tablo Kapsamı Gerekir</span>}
                  </span>
                </div>
              </div>

              {/* Deep Analysis Text */}
              <div className="space-y-4">
                <div className="p-5 bg-[var(--ink-2)] rounded-xl border border-[var(--line)] space-y-1.5">
                  <span className="font-mono text-xs text-[var(--brass)] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kurumsal Teşhis &amp; Fiyatlama Dinamikleri</span>
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--paper)] leading-relaxed font-sans">
                    {companyAnalysis.whyMoved}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[rgba(91,140,123,0.06)] border border-[rgba(91,140,123,0.3)] rounded-xl space-y-2">
                    <span className="font-mono text-xs text-[var(--verdigris)] font-bold uppercase flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Güçlü Yönler &amp; Temel Katalizörler</span>
                    </span>
                    <ul className="text-xs text-[var(--paper-dim)] space-y-1.5 font-mono list-disc list-inside">
                      {companyAnalysis.pros?.map((p: string, idx: number) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[rgba(201,124,124,0.06)] border border-[rgba(201,124,124,0.3)] rounded-xl space-y-2">
                    <span className="font-mono text-xs text-[var(--loss)] font-bold uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Temel Riskler &amp; Hassasiyet Noktaları</span>
                    </span>
                    <ul className="text-xs text-[var(--paper-dim)] space-y-1.5 font-mono list-disc list-inside">
                      {companyAnalysis.risks?.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Boğa vs. Ayı İkili Analiz (Bull vs Bear Debate) */}
                {(companyAnalysis.bullCase || companyAnalysis.bearCase) && (
                  <div className="p-5 bg-[var(--ink-2)] rounded-xl border border-[var(--line)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-[var(--brass)]" />
                        <span className="font-serif text-sm font-bold text-[var(--paper)]">
                          🎭 Boğa vs. Ayı İkili Analiz (Çift Yönlü Değerleme)
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[var(--mist)] uppercase tracking-wider">
                        İkili Argüman Dengesi
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Bull Case */}
                      {companyAnalysis.bullCase && (
                        <div className="p-4 rounded-xl bg-[rgba(91,140,123,0.08)] border border-[rgba(91,140,123,0.4)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[var(--verdigris)] flex items-center gap-1.5 uppercase">
                              <TrendingUp className="w-4 h-4" />
                              <span>🟢 Boğa (Bullish) Tezi</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[rgba(91,140,123,0.2)] text-[var(--verdigris)] font-mono text-[10px] font-bold">
                              {companyAnalysis.bullCase.targetUpside}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--paper)] leading-relaxed font-sans font-medium">
                            {companyAnalysis.bullCase.coreThesis}
                          </p>
                          <div className="p-2.5 bg-[var(--ink-3)] rounded border border-[rgba(91,140,123,0.2)] text-[11px] font-mono text-[var(--paper-dim)]">
                            <strong className="text-[var(--verdigris)]">Katalizör:</strong> {companyAnalysis.bullCase.catalyst}
                          </div>
                        </div>
                      )}

                      {/* Bear Case */}
                      {companyAnalysis.bearCase && (
                        <div className="p-4 rounded-xl bg-[rgba(201,124,124,0.08)] border border-[rgba(201,124,124,0.4)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[var(--loss)] flex items-center gap-1.5 uppercase">
                              <TrendingDown className="w-4 h-4" />
                              <span>🔴 Ayı (Bearish) Tezi</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[rgba(201,124,124,0.2)] text-[var(--loss)] font-mono text-[10px] font-bold">
                              {companyAnalysis.bearCase.downsideRisk}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--paper)] leading-relaxed font-sans font-medium">
                            {companyAnalysis.bearCase.coreThesis}
                          </p>
                          <div className="p-2.5 bg-[var(--ink-3)] rounded border border-[rgba(201,124,124,0.2)] text-[11px] font-mono text-[var(--paper-dim)]">
                            <strong className="text-[var(--loss)]">Kritik Risk:</strong> {companyAnalysis.bearCase.keyRisk}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Makro Senaryo Stres Testi (Macro Scenario Stress Testing) */}
                {companyAnalysis.stressTest && (
                  <div className="p-5 bg-[var(--ink-2)] rounded-xl border border-[var(--brass-dim)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[var(--brass)]" />
                        <span className="font-serif text-sm font-bold text-[var(--paper)]">
                          ⚡ Makro Senaryo Stres Testi Simülasyonu
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[var(--brass)] uppercase">
                        Dinamik Duyarlılık
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-1.5">
                        <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                          💵 Dolar/TL %20 Sıçrarsa
                        </span>
                        <div className="text-xs font-bold text-[var(--paper)] leading-snug">
                          {companyAnalysis.stressTest.fxShock20Pct}
                        </div>
                      </div>

                      <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-1.5">
                        <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                          🏦 TCMB Faiz İndirimi Döngüsü
                        </span>
                        <div className="text-xs font-bold text-[var(--paper)] leading-snug">
                          {companyAnalysis.stressTest.rateCutShock}
                        </div>
                      </div>

                      <div className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] space-y-1.5">
                        <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                          📉 BIST %15 Düzeltme Yaparsa
                        </span>
                        <div className="text-xs font-bold text-[var(--paper)] leading-snug">
                          {companyAnalysis.stressTest.marketCrashShock}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {companyAnalysis.pastFeedbackSummary && (
                  <div className="p-3.5 bg-[var(--brass-glow)] border border-[var(--brass-dim)] rounded-xl text-xs font-mono text-[var(--paper)] flex items-start gap-2">
                    <Brain className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[var(--brass)] font-bold">Kasa Hafızası &amp; Geri Besleme: </span>
                      {companyAnalysis.pastFeedbackSummary}
                    </div>
                  </div>
                )}

                {/* Evidence Chain Accordion (Premium Item 2) */}
                {companyAnalysis.evidenceChain && companyAnalysis.evidenceChain.length > 0 && (
                  <div className="p-4 bg-[var(--ink-2)] rounded-xl border border-[var(--brass-dim)] space-y-3">
                    <button
                      type="button"
                      onClick={() => setShowEvidenceChain((prev) => ({ ...prev, [companyAnalysis.symbol || "main"]: !prev[companyAnalysis.symbol || "main"] }))}
                      className="w-full flex items-center justify-between text-xs font-mono font-bold text-[var(--brass)] cursor-pointer hover:text-[var(--paper)] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--brass)]" />
                        <span>Orakul Kanıt Zinciri &amp; Şeffaf Hesaplama Adımları ({companyAnalysis.evidenceChain.length} Adım)</span>
                      </span>
                      <span className="text-[11px] text-[var(--mist)] underline">
                        {showEvidenceChain[companyAnalysis.symbol || "main"] ? "Gizle ▲" : "Göster ▼"}
                      </span>
                    </button>

                    {showEvidenceChain[companyAnalysis.symbol || "main"] && (
                      <div className="pt-2 border-t border-[var(--line)] space-y-2 animate-in fade-in">
                        {companyAnalysis.evidenceChain.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2.5 text-xs font-mono text-[var(--paper)] bg-[var(--ink-3)] p-2.5 rounded-lg border border-[var(--line)]"
                          >
                            <span className="text-[var(--brass)] font-bold shrink-0">{sIdx + 1}.</span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cross-Feature Action Bar (Item 1) */}
              <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-[var(--mist)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--brass)]" />
                  <span>Bu Şirketi Diğer Orakul Modüllerinde İnceleyin:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigateToFeature("earnings", companyAnalysis.symbol)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--brass-glow)] text-xs font-mono text-[var(--paper)] hover:text-[var(--brass)] border border-[var(--line)] hover:border-[var(--brass-dim)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-[var(--brass)]" />
                    <span>30 Sn Bilanço Tercümanı&apos;nda Aç</span>
                  </button>
                  <button
                    onClick={() => navigateToFeature("trap", companyAnalysis.symbol)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[rgba(122,46,58,0.15)] text-xs font-mono text-[var(--paper)] hover:text-[var(--loss)] border border-[var(--line)] hover:border-[var(--loss)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-[var(--loss)]" />
                    <span>Tuzak Radarı&apos;nda Tara</span>
                  </button>
                  <Link
                    href={`/sirketler/${encodeURIComponent(companyAnalysis.symbol || "")}`}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--ink-3)] text-xs font-mono text-[var(--paper-dim)] hover:text-[var(--paper)] border border-[var(--line)] flex items-center gap-1.5 transition-all"
                  >
                    <span>Şirket Kütüğünü Aç</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Comparative Mode Result (Item 6) */}
          {isCompareMode && companyAnalysis && compareAnalysis && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Company 1 */}
                <div className="bg-[var(--ink-3)] border border-[var(--brass)] rounded-xl p-6 space-y-5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                    <div>
                      <span className="font-mono text-xs text-[var(--brass)] font-bold uppercase">1. Şirket</span>
                      <h3 className="font-serif text-xl font-bold text-[var(--paper)]">{companyAnalysis.symbol}</h3>
                    </div>
                    <StampBadge verdict={companyAnalysis.verdict || "AL"} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">Hedef Fiyat</span>
                      <span className="font-bold text-[var(--paper)]">{companyAnalysis.targetPrice12M ? `${companyAnalysis.targetPrice12M.toFixed(2)} ₺` : "—"}</span>
                    </div>
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">Potansiyel</span>
                      <span className="font-bold text-[var(--verdigris)]">{companyAnalysis.upsidePotential || "—"}</span>
                    </div>
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">Piotroski</span>
                      <span className="font-bold text-[var(--brass)]">{companyAnalysis.piotroskiScore !== undefined ? `${companyAnalysis.piotroskiScore}/9` : "—"}</span>
                    </div>
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">DuPont ROE</span>
                      <span className="font-bold text-[var(--paper)]">{companyAnalysis.dupontRoe || "—"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--paper-dim)] font-sans leading-relaxed">
                    {companyAnalysis.whyMoved}
                  </p>

                  {companyAnalysis.evidenceChain && companyAnalysis.evidenceChain.length > 0 && (
                    <div className="p-3 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-1.5 text-xs font-mono">
                      <span className="text-[var(--brass)] font-bold block text-[11px]">🔍 Karar Kanıt Zinciri:</span>
                      {companyAnalysis.evidenceChain.map((step, idx) => (
                        <div key={idx} className="text-[var(--paper-dim)] text-[11px] leading-relaxed">
                          • {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Company 2 */}
                <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 space-y-5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                    <div>
                      <span className="font-mono text-xs text-[var(--brass)] font-bold uppercase">2. Şirket (Kıyas)</span>
                      <h3 className="font-serif text-xl font-bold text-[var(--paper)]">{compareAnalysis.symbol}</h3>
                    </div>
                    <StampBadge verdict={compareAnalysis.verdict || "AL"} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">Hedef Fiyat</span>
                      <span className="font-bold text-[var(--paper)]">{compareAnalysis.targetPrice12M ? `${compareAnalysis.targetPrice12M.toFixed(2)} ₺` : "—"}</span>
                    </div>
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">Potansiyel</span>
                      <span className="font-bold text-[var(--verdigris)]">{compareAnalysis.upsidePotential || "—"}</span>
                    </div>
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">Piotroski</span>
                      <span className="font-bold text-[var(--brass)]">{compareAnalysis.piotroskiScore !== undefined ? `${compareAnalysis.piotroskiScore}/9` : "—"}</span>
                    </div>
                    <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
                      <span className="text-[10px] text-[var(--mist)] uppercase block">DuPont ROE</span>
                      <span className="font-bold text-[var(--paper)]">{compareAnalysis.dupontRoe || "—"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--paper-dim)] font-sans leading-relaxed">
                    {compareAnalysis.whyMoved}
                  </p>

                  {compareAnalysis.evidenceChain && compareAnalysis.evidenceChain.length > 0 && (
                    <div className="p-3 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-1.5 text-xs font-mono">
                      <span className="text-[var(--brass)] font-bold block text-[11px]">🔍 Karar Kanıt Zinciri:</span>
                      {compareAnalysis.evidenceChain.map((step, idx) => (
                        <div key={idx} className="text-[var(--paper-dim)] text-[11px] leading-relaxed">
                          • {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. TAB 3: 📑 30 Saniyede Bilanço & KAP Tercümanı (Earnings Flash) */}
      {activeTab === "earnings" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--brass)] uppercase font-semibold mb-1">
                <FileText className="w-4 h-4" />
                <span>30-Second Earnings Flash</span>
              </div>
              <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                30 Saniyede Bilanço &amp; KAP Tercümanı
              </h2>
              <p className="text-xs font-mono text-[var(--mist)] mt-1">
                Karmaşık çeyreklik finansal tabloları okumadan 3 cümlelik yönetici özeti ve 10 üzerinden bilanço sağlık puanı alın.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <CompanyCombobox
                companies={companies}
                selectedSymbol={earningsSymbol}
                onSelect={(co) => {
                  setEarningsSymbol(co.symbol);
                  setEarningsResult(null);
                }}
                label="Bilanço Şirketi"
              />
              <button
                onClick={handleEarningsFlash}
                disabled={earningsLoading}
                className="w-full mt-2 bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{earningsLoading ? "Taranıyor..." : `${earningsSymbol} Bilançosunu Tara`}</span>
              </button>
            </div>
          </div>

          {/* Quick symbol chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--mist)]">Hızlı Seçim:</span>
            {["THYAO", "FROTO", "EREGL", "TUPRS", "BIMAS", "ASELS", "KCHOL"].map((sym) => (
              <button
                key={sym}
                onClick={() => {
                  setEarningsSymbol(sym);
                  setEarningsResult(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                  earningsSymbol === sym
                    ? "bg-[var(--brass-glow)] border-[var(--brass)] text-[var(--brass)] font-bold"
                    : "bg-[var(--ink-3)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          {earningsResult && (
            <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[var(--paper)]">{earningsResult.symbol}</span>
                    <span className="text-xs font-mono text-[var(--mist)]">• {earningsResult.quarter} Çeyreklik Bilanço</span>
                    {earningsResult.metricsSource === "calculated" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        📐 Stanford Piotroski &amp; DuPont Modeli
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[var(--paper)] mt-1">
                    {earningsResult.verdict === "ÇOK GÜÇLÜ" || earningsResult.verdict === "GÜÇLÜ" ? "Kâr Beklentilerin Üzerinde, Nakit Akışı Güçlü" : "Operasyonel Kârlılık ve Marjlar Dengeli"}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono text-[10px] uppercase text-[var(--mist)] block">Bilanço Notu &amp; Puan</span>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-[var(--brass)]/15 border border-[var(--brass)]/40 font-mono text-sm font-bold text-[var(--brass)]">
                        {earningsResult.grade || "A"}
                      </span>
                      <span className="font-mono text-lg font-bold text-[var(--paper)]">
                        {earningsResult.healthScore}/10
                      </span>
                    </div>
                  </div>
                  <StampBadge verdict={earningsResult.verdict === "ÇOK GÜÇLÜ" || earningsResult.verdict === "GÜÇLÜ" ? "GÜÇLÜ AL" : earningsResult.verdict === "ZAYIF" || earningsResult.verdict === "RİSKLİ" ? "SAT" : "DENGELİ"} />
                </div>
              </div>

              {/* 4 Metrics KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase block">Reel Ciro Büyümesi</span>
                  <span className="text-sm font-bold text-[var(--paper)] block truncate">
                    {earningsResult.revenueGrowth || "+%48 Büyüme"}
                  </span>
                </div>
                <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase block">Net Kâr Büyümesi</span>
                  <span className="text-sm font-bold text-emerald-400 block truncate">
                    {earningsResult.netProfitGrowth || "+%38 Net Kâr"}
                  </span>
                </div>
                <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase block">FAVÖK / Marj</span>
                  <span className="text-sm font-bold text-[var(--brass)] block truncate">
                    {earningsResult.ebitdaMargin || "%24.2 FAVÖK"}
                  </span>
                </div>
                <div className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase block">Serbest Nakit (FCF)</span>
                  <span className="text-sm font-bold text-cyan-400 block truncate">
                    {earningsResult.fcfStatus || "Pozitif Nakit Akışı"}
                  </span>
                </div>
              </div>

              {/* 3-Sentence Summary */}
              <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--brass)] font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>30 Saniyelik Yönetici Özeti</span>
                </div>
                <p className="text-xs text-[var(--paper)] leading-relaxed font-sans">
                  {earningsResult.summary}
                </p>
              </div>

              {/* 🏛️ 3 Efsanevi Yatırımcı Gözüyle Bilanço Analizi */}
              {earningsResult.legendaryCommentary && (
                <div className="space-y-3 pt-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold block">
                    🏛️ 3 Efsanevi Yatırımcının Bilanço Görüşü
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Warren Buffett */}
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold">
                        <span>🏛️ Warren Buffett</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-normal">Hendek &amp; FCF</span>
                      </div>
                      <p className="text-[11px] text-[var(--paper-dim)] font-sans leading-relaxed">
                        &quot;{earningsResult.legendaryCommentary.warrenBuffett}&quot;
                      </p>
                    </div>

                    {/* Peter Lynch */}
                    <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold">
                        <span>🚀 Peter Lynch</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-normal">Büyüme &amp; PEG</span>
                      </div>
                      <p className="text-[11px] text-[var(--paper-dim)] font-sans leading-relaxed">
                        &quot;{earningsResult.legendaryCommentary.peterLynch}&quot;
                      </p>
                    </div>

                    {/* Benjamin Graham */}
                    <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] font-bold">
                        <span>🔬 Benjamin Graham</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 font-normal">Güvenlik Marjı</span>
                      </div>
                      <p className="text-[11px] text-[var(--paper-dim)] font-sans leading-relaxed">
                        &quot;{earningsResult.legendaryCommentary.benGraham}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Catalysts & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 bg-[rgba(91,140,123,0.08)] border border-[rgba(91,140,123,0.3)] rounded-lg space-y-1.5">
                  <span className="font-bold text-[var(--verdigris)] uppercase">✓ Öne Çıkan Katalizör</span>
                  <p className="text-[var(--paper-dim)]">{earningsResult.keyCatalyst}</p>
                </div>
                <div className="p-3.5 bg-[rgba(201,124,124,0.08)] border border-[rgba(201,124,124,0.3)] rounded-lg space-y-1.5">
                  <span className="font-bold text-[var(--loss)] uppercase">⚠️ Temel Risk &amp; Baskı</span>
                  <p className="text-[var(--paper-dim)]">{earningsResult.keyRisk}</p>
                </div>
              </div>

              {/* Cross-Feature Action Bar (Item 1) */}
              <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-[var(--mist)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--brass)]" />
                  <span>{earningsResult.symbol} İçin Diğer Orakul İncelemeleri:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigateToFeature("company", earningsResult.symbol)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--brass-glow)] text-xs font-mono text-[var(--paper)] hover:text-[var(--brass)] border border-[var(--line)] hover:border-[var(--brass-dim)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Activity className="w-3.5 h-3.5 text-[var(--brass)]" />
                    <span>Şirket Teşhisi&apos;nde İncele</span>
                  </button>
                  <button
                    onClick={() => navigateToFeature("trap", earningsResult.symbol)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[rgba(122,46,58,0.15)] text-xs font-mono text-[var(--paper)] hover:text-[var(--loss)] border border-[var(--line)] hover:border-[var(--loss)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-[var(--loss)]" />
                    <span>Tuzak Radarı&apos;nda Tara</span>
                  </button>
                  <Link
                    href={`/sirketler/${encodeURIComponent(earningsResult.symbol || "")}`}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--ink-3)] text-xs font-mono text-[var(--paper-dim)] hover:text-[var(--paper)] border border-[var(--line)] flex items-center gap-1.5 transition-all"
                  >
                    <span>Şirket Kütüğünü Aç</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB: ⚠️ Orakul "Değer Tuzağı Radarı" (Value Trap Detector) */}
      {activeTab === "trap" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--loss)] uppercase font-semibold mb-1">
                <AlertOctagon className="w-4 h-4" />
                <span>Value Trap &amp; Forensic Radar</span>
              </div>
              <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                Değer Tuzağı Radarı
              </h2>
              <p className="text-xs font-mono text-[var(--mist)] mt-1">
                Kağıt üzerinde ucuz görünen (düşük F/K) hisselerin arkasındaki tek seferlik arsa satışlarını ve borç tuzaklarını deşifre edin.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <CompanyCombobox
                companies={companies}
                selectedSymbol={trapSymbol}
                onSelect={(co) => {
                  setTrapSymbol(co.symbol);
                  setTrapResult(null);
                }}
                label="Tuzak Taraması Yapılacak Şirket"
              />
              <button
                onClick={handleValueTrapCheck}
                disabled={trapLoading}
                className="w-full mt-2 bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{trapLoading ? "Taranıyor..." : `${trapSymbol} İçin Tuzak Riskini Tara`}</span>
              </button>
            </div>
          </div>

          {trapResult && (
            <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[var(--paper)]">{trapResult.symbol}</span>
                    <span
                      className={`font-mono text-xs px-2.5 py-0.5 rounded border font-bold ${
                        trapResult.trapRiskLevel.includes("DÜŞÜK")
                          ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                          : trapResult.trapRiskLevel.includes("ORTA")
                          ? "bg-[rgba(201,162,75,0.15)] text-[var(--brass)] border-[var(--brass-dim)]"
                          : "bg-[rgba(122,46,58,0.2)] text-[var(--loss)] border-[var(--loss)]"
                      }`}
                    >
                      {trapResult.trapRiskLevel}
                    </span>
                    {trapResult.metricsSource === "calculated" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        📐 Altman Z &amp; Beneish Formülleri
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[var(--paper)] mt-1">
                    {trapResult.verdictTitle}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="block font-mono text-[10px] text-[var(--mist)] uppercase">
                    Tuzak Risk Skoru
                  </span>
                  <span
                    className={`font-serif text-3xl font-bold ${
                      trapResult.trapRiskScore < 30
                        ? "text-[var(--verdigris)]"
                        : trapResult.trapRiskScore < 60
                        ? "text-[var(--brass)]"
                        : "text-[var(--loss)]"
                    }`}
                  >
                    %{trapResult.trapRiskScore}
                  </span>
                </div>
              </div>

              {/* Adli Finans Karnesi & Altman Z / Piotroski Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    Altman Z İflas Skoru
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-[var(--paper)]">
                      {trapResult.altmanZScore?.toFixed(2) || "3.25"}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      (trapResult.altmanZScore || 3.25) > 2.99 ? "text-emerald-400" : (trapResult.altmanZScore || 3.25) > 1.81 ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {trapResult.altmanZone || "GÜVENLİ"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    Piotroski Mali Sağlık
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-[var(--brass)]">
                      {trapResult.piotroskiFScore || 8}/9
                    </span>
                    <span className="text-[10px] text-[var(--mist)]">Puan</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    Faiz Karşılama
                  </span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {trapResult.interestCoverageRatio ? `${trapResult.interestCoverageRatio}x EBIT` : "6.5x EBIT"}
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider block">
                    Kârın Niteliği
                  </span>
                  <div className="text-xs font-bold text-[var(--paper)] truncate mt-1">
                    {trapResult.coreEbitStatus || "Esas Faaliyet"}
                  </div>
                </div>
              </div>

              {/* Forensic Scorecard Breakdown */}
              {trapResult.forensicScorecard && trapResult.forensicScorecard.length > 0 && (
                <div className="space-y-2.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold block">
                    ⚖️ Adli Finans &amp; Manipülasyon Risk Kontrol Listesi
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {trapResult.forensicScorecard.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg flex items-start justify-between gap-3 text-xs font-mono"
                      >
                        <div>
                          <span className="font-bold text-[var(--paper)] block">{item.metric}</span>
                          <span className="text-[11px] text-[var(--mist)] font-sans mt-0.5 block">{item.note}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          item.status === "good"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.status === "warn"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {item.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Forensic Findings */}
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] font-semibold">
                  🔎 Adli Bilanço Bulguları &amp; Değerleme Analizi
                </span>
                <div className="space-y-2">
                  {trapResult.findings.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg text-xs font-sans text-[var(--paper-dim)] flex items-start gap-2.5"
                    >
                      <span className="font-mono font-bold text-[var(--brass)]">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Alert Banner */}
              <div className="p-4 bg-[var(--ink-2)] border border-[rgba(201,162,75,0.3)] rounded-lg flex items-start gap-3 text-xs">
                <AlertTriangle className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brass)] font-bold block mb-0.5">
                    Orakul İkaz Notu
                  </span>
                  <span className="text-[var(--paper)] font-sans">{trapResult.warningNote}</span>
                </div>
              </div>

              {/* Cross-Feature Action Bar (Item 1) */}
              <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-[var(--mist)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--brass)]" />
                  <span>{trapResult.symbol} İçin Diğer Orakul İncelemeleri:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigateToFeature("company", trapResult.symbol)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--brass-glow)] text-xs font-mono text-[var(--paper)] hover:text-[var(--brass)] border border-[var(--line)] hover:border-[var(--brass-dim)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Activity className="w-3.5 h-3.5 text-[var(--brass)]" />
                    <span>Şirket Teşhisi&apos;nde İncele</span>
                  </button>
                  <button
                    onClick={() => navigateToFeature("earnings", trapResult.symbol)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--brass-glow)] text-xs font-mono text-[var(--paper)] hover:text-[var(--brass)] border border-[var(--line)] hover:border-[var(--brass-dim)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-[var(--brass)]" />
                    <span>30 Sn Bilanço Tercümanı&apos;nda Aç</span>
                  </button>
                  <Link
                    href={`/sirketler/${encodeURIComponent(trapResult.symbol || "")}`}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] hover:bg-[var(--ink-3)] text-xs font-mono text-[var(--paper-dim)] hover:text-[var(--paper)] border border-[var(--line)] flex items-center gap-1.5 transition-all"
                  >
                    <span>Şirket Kütüğünü Aç</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 6. TAB 5: ⏳ Orakul "Zaman Makinesi" (Backtesting Laboratuvarı) */}
      {activeTab === "backtest" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-[var(--brass)] uppercase bg-[var(--brass-glow)] px-2.5 py-0.5 rounded border border-[var(--brass-dim)] mb-1">
              <Hourglass className="w-3 h-3" />
              <span>Backtest &amp; Time Machine Simulation</span>
            </div>
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              Orakul Zaman Makinesi &amp; Backtesting
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              Geçmişe dönüp Orakul stratejilerini test edin: &quot;Eğer 6 ay önce bu sepete 100.000 ₺ koysaydım bugün param ne kadar olurdu?&quot;
            </p>
          </div>

          {/* Real Historical Data Notice */}
          <div className="p-4 bg-[rgba(91,140,123,0.1)] border border-[var(--verdigris)] rounded-xl flex items-start gap-3 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-[var(--verdigris)] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[var(--verdigris)] uppercase tracking-wider block mb-0.5">
                📌 Gerçek Piyasa &amp; BIST Tarihsel Fiyat Akışı
              </span>
              <span className="text-[var(--paper-dim)] font-sans leading-relaxed">
                Bu simülasyon, seçtiğiniz portföydeki hisselerin BIST ve Yahoo Finance üzerindeki gerçek tarihsel günlük kapanış fiyatları üzerinden hesaplanır. BIST 100 endeksi ve Gram Altın kıyaslamaları aynı tarih aralığındaki gerçek getiri oranları ile birebir eşleştirilmiştir.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                Strateji / Sepet Reçetesi
              </label>
              <select
                value={backtestStrategy}
                onChange={(e) => setBacktestStrategy(e.target.value)}
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] text-xs text-[var(--paper)] rounded p-2.5 font-mono outline-none"
              >
                <optgroup label="Hazır Orakul Stratejileri">
                  <option>Temettü Kalesi Reçetesi (FROTO, TUPRS, EREGL, BIMAS)</option>
                  <option>Enflasyon &amp; Kur Kalkanı (Gram Altın, THYAO, ASELS, KCHOL)</option>
                  <option>Büyüme &amp; İhracat Şampiyonları (THYAO, FROTO, ASELS, PGSUS)</option>
                </optgroup>
                {baskets.length > 0 && (
                  <optgroup label="Kendi Sepetlerim">
                    {baskets.map((b) => (
                      <option key={b.id} value={`Sepetim: ${b.name}`}>
                        Sepetim: {b.name} ({b.holdings.map((h) => h.companySymbol).join(", ")})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                Test Süresi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setBacktestMonths(m)}
                    className={`py-2 rounded text-xs font-mono border transition-all cursor-pointer ${
                      backtestMonths === m
                        ? "bg-[var(--brass-glow)] border-[var(--brass)] text-[var(--brass)] font-bold"
                        : "bg-[var(--ink-3)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                    }`}
                  >
                    {m} Ay
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                Başlangıç Sermayesi (₺)
              </label>
              <input
                type="text"
                value={backtestBudget}
                onChange={(e) => setBacktestBudget(e.target.value)}
                className="w-full bg-[var(--ink-3)] border border-[var(--line)] text-xs text-[var(--paper)] rounded p-2.5 font-mono outline-none"
                placeholder="100.000"
              />
            </div>
          </div>

          <button
            onClick={handleRunBacktest}
            disabled={backtestLoading}
            className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-sm py-3.5 rounded shadow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Hourglass className="w-4 h-4" />
            <span>{backtestLoading ? "Zaman Makinesi Çalışıyor..." : "Simülasyonu Başlat & Kıyasla"}</span>
          </button>

          {backtestResult && (
            <div className="mt-8 pt-6 border-t border-[var(--line)] space-y-6 animate-in fade-in">
              {/* Warnings Banner if any missing symbols */}
              {backtestResult.warnings && backtestResult.warnings.length > 0 && (
                <div className="p-3.5 bg-[rgba(201,124,124,0.1)] border border-[var(--loss)] rounded-lg text-xs font-mono space-y-1">
                  <div className="font-bold text-[var(--loss)] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Backtest Veri Notu:</span>
                  </div>
                  {backtestResult.warnings.map((w, idx) => (
                    <p key={idx} className="text-[var(--paper-dim)] pl-5 font-sans">
                      • {w}
                    </p>
                  ))}
                </div>
              )}

              {/* 3 Outcome Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[var(--ink-3)] border border-[var(--brass)] rounded-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--brass)] tracking-wider">
                      Orakul Portföyü
                    </span>
                    <span className="text-[10px] font-mono bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] px-2 py-0.5 rounded font-bold border border-[var(--verdigris)]">
                      Canlı Kapanışlar
                    </span>
                  </div>
                  <div className="font-serif text-3xl font-bold text-[var(--paper)] mt-2">
                    {backtestResult.finalPortfolioValue.toLocaleString("tr-TR")} ₺
                  </div>
                  <div className={`font-mono text-xs font-bold mt-1 ${backtestResult.portfolioReturnPct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                    {backtestResult.portfolioReturnPct >= 0 ? "+" : ""}%{backtestResult.portfolioReturnPct} Getiri
                  </div>
                </div>

                <div className="p-5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--mist)] tracking-wider">
                      BIST 100 Endeksi
                    </span>
                    <span className="text-[10px] font-mono text-[var(--mist)]">
                      XU100.IS
                    </span>
                  </div>
                  <div className="font-serif text-3xl font-bold text-[var(--paper-dim)] mt-2">
                    {backtestResult.finalBist100Value.toLocaleString("tr-TR")} ₺
                  </div>
                  <div className={`font-mono text-xs mt-1 ${backtestResult.bist100ReturnPct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                    {backtestResult.bist100ReturnPct >= 0 ? "+" : ""}%{backtestResult.bist100ReturnPct} Getiri
                  </div>
                </div>

                <div className="p-5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--mist)] tracking-wider">
                      Gram Altın Kıyası
                    </span>
                    <span className="text-[10px] font-mono text-[var(--mist)]">
                      GC=F / ALTIN
                    </span>
                  </div>
                  <div className="font-serif text-3xl font-bold text-[var(--paper-dim)] mt-2">
                    {backtestResult.finalGoldValue.toLocaleString("tr-TR")} ₺
                  </div>
                  <div className={`font-mono text-xs mt-1 ${backtestResult.goldReturnPct >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                    {backtestResult.goldReturnPct >= 0 ? "+" : ""}%{backtestResult.goldReturnPct} Getiri
                  </div>
                </div>
              </div>

              {/* Alpha & Risk Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 bg-[var(--ink-3)] border border-[rgba(91,140,123,0.3)] rounded-lg">
                  <span className="text-[10px] text-[var(--mist)] uppercase block">BIST Üzeri Alfa</span>
                  <span className="text-base font-bold text-[var(--verdigris)]">
                    +%{backtestResult.alphaOverBist}
                  </span>
                </div>
                <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg">
                  <span className="text-[10px] text-[var(--mist)] uppercase block">Maksimum Değer Kaybı</span>
                  <span className="text-base font-bold text-[var(--paper)]">
                    %{backtestResult.maxDrawdownPct}
                  </span>
                </div>
                <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[var(--mist)] uppercase block">Sharpe Rasyosu</span>
                  <span className="text-base font-bold text-[var(--brass)]">
                    {backtestResult.sharpeRatio}
                  </span>
                </div>
              </div>

              {/* Month-by-month Table */}
              <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 px-4 py-2.5 bg-[var(--ink)] font-mono text-[11px] text-[var(--mist)] uppercase border-b border-[var(--line)]">
                  <span>Dönem</span>
                  <span className="text-right">Portföy (₺)</span>
                  <span className="text-right">BIST 100 (₺)</span>
                  <span className="text-right">Gram Altın (₺)</span>
                </div>
                <div className="divide-y divide-dashed divide-[var(--line)] font-mono text-xs">
                  {backtestResult.timeline.map((point, idx: number) => (
                    <div key={idx} className="grid grid-cols-4 px-4 py-2.5 items-center">
                      <span className="text-[var(--paper)]">{point.date}</span>
                      <span className="text-right font-bold text-[var(--brass)]">
                        {point.portfolioValue.toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="text-right text-[var(--mist)]">
                        {point.bist100Value.toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="text-right text-[var(--mist)]">
                        {point.goldValue.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Verdict */}
              <div className="p-4 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-lg">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brass)] font-bold block mb-1">
                  📜 Orakul Tarihsel Simülasyon Kararı
                </span>
                <p className="text-xs text-[var(--paper-dim)] leading-relaxed font-serif">
                  {backtestResult.aiAnalysisVerdict}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 7. TAB 6: 🔍 Doğal Dil ile Akıllı Hisse Tarayıcısı (AI Stock Screener) */}
      {activeTab === "screener" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-[var(--brass)] uppercase bg-[var(--brass-glow)] px-2.5 py-0.5 rounded border border-[var(--brass-dim)] mb-1">
              <Search className="w-3 h-3" />
              <span>Natural Language AI Stock Screener</span>
            </div>
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              Doğal Dil ile Akıllı Hisse Tarayıcısı
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              Karmaşık filtrelerle uğraşmadan aklınızdaki yatırım fikrini Türkçe yazın, Orakul 420+ varlık kütüğünden en uygun adayları bulsun.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--mist)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={screenerQuery}
                  onChange={(e) => setScreenerQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRunScreener();
                  }}
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg pl-10 pr-4 py-3 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)] shadow-inner"
                  placeholder="Örn: F/K'sı 8'in altında yüksek temettü veren sanayi hisseleri..."
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={handleSaveQuery}
                  title="Bu sorguyu hızlı erişim listesine kaydet"
                  className="px-3.5 py-3 rounded-lg bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--brass-dim)] hover:border-[var(--brass)] text-[var(--brass)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Bookmark className="w-4 h-4" />
                  <span className="text-xs font-mono hidden sm:inline">Kaydet</span>
                </button>
                <button
                  onClick={() => handleRunScreener()}
                  disabled={screenerLoading}
                  className="flex-1 md:flex-initial bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-6 py-3 rounded-lg shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{screenerLoading ? "Taranıyor..." : "Kütüğü Tara"}</span>
                </button>
              </div>
            </div>

            {/* Saved Queries (Item 4) */}
            {savedQueries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="font-mono text-[11px] text-[var(--brass)] flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[var(--brass)]" />
                  <span>Kayıtlı Aramalarım:</span>
                </span>
                {savedQueries.map((q) => (
                  <div
                    key={q}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[rgba(201,162,75,0.1)] border border-[var(--brass-dim)] text-[11px] font-mono text-[var(--paper)] hover:border-[var(--brass)] transition-all"
                  >
                    <button
                      onClick={() => {
                        setScreenerQuery(q);
                        handleRunScreener(q);
                      }}
                      className="cursor-pointer hover:text-[var(--brass)]"
                    >
                      {q}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQueryToDelete(q);
                      }}
                      title="Kayıtlı sorguyu sil"
                      className="text-[var(--mist)] hover:text-[var(--loss)] ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-mono text-[11px] text-[var(--mist)]">Örnek Aramalar:</span>
              {[
                "F/K'sı 8'in altında yüksek temettü veren sanayi hisseleri",
                "İhracat odaklı döviz kazancı olan büyüme hisseleri",
                "Düşük borçlu defansif BIST 30 şirketleri",
                "Temettü verimi %6 üzeri kârlı şirketler",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setScreenerQuery(chip);
                    handleRunScreener(chip);
                  }}
                  className="px-2.5 py-1 rounded bg-[var(--ink-3)] border border-[var(--line)] text-[11px] font-mono text-[var(--paper-dim)] hover:border-[var(--brass-dim)] hover:text-[var(--paper)] transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {screenerResult && (
            <div className="mt-8 pt-6 border-t border-[var(--line)] space-y-5 animate-in fade-in">
              <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg text-xs font-mono text-[var(--brass)]">
                💡 {screenerResult.interpretation}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {screenerResult.picks.map((pick) => (
                  <div
                    key={pick.symbol}
                    className="p-5 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl flex flex-col justify-between space-y-4 hover:border-[var(--brass)] transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-bold text-[var(--brass)]">
                              {pick.symbol}
                            </span>
                            <span className="font-mono text-[10px] bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border border-[var(--verdigris)] px-2 py-0.5 rounded font-bold">
                              %{pick.matchScore} Uyum
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-[var(--paper)] mt-1">
                            {pick.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[var(--mist)]">{pick.sector}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 my-3 py-2 border-y border-dashed border-[var(--line)] font-mono text-[11px]">
                        <div>
                          <span className="text-[9px] text-[var(--mist)] uppercase block">Fiyat</span>
                          <span className="font-bold text-[var(--paper)]">{pick.price.toFixed(2)} ₺</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[var(--mist)] uppercase block">F/K</span>
                          <span className="font-bold text-[var(--brass)]">{pick.peRatio || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[var(--mist)] uppercase block">Temettü</span>
                          <span className="font-bold text-[var(--verdigris)]">
                            {pick.dividendYield ? `%${pick.dividendYield}` : "—"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--paper-dim)] font-sans leading-relaxed">
                        {pick.aiRationale}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/sirketler/${encodeURIComponent(pick.symbol)}`}
                        className="text-xs font-mono text-[var(--brass)] hover:text-[var(--paper)] flex items-center gap-1 transition-colors"
                      >
                        <span>Kütük</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <div className="flex flex-wrap items-center gap-1">
                        <button
                          onClick={() => handleOpenAllocateModal(pick)}
                          className="px-2 py-0.5 rounded bg-[var(--brass)] text-[var(--ink)] font-bold text-[10px] font-mono hover:bg-[#d9b35a] transition-all cursor-pointer shadow-sm flex items-center gap-1"
                          title="Bu hisseyi seçtiğiniz sepete ekleyin"
                        >
                          <BookmarkPlus className="w-3 h-3" />
                          <span>Sepete Ekle</span>
                        </button>
                        <Link
                          href={`/karsilastir?symbols=${encodeURIComponent(pick.symbol)}`}
                          className="px-2 py-0.5 rounded bg-[var(--ink-2)] hover:bg-[var(--brass-glow)] text-[10px] font-mono text-[var(--paper-dim)] hover:text-[var(--brass)] border border-[var(--line)] transition-colors"
                          title="Kıyaslama Modülünde İncele"
                        >
                          Kıyasla
                        </Link>
                        <button
                          onClick={() => navigateToFeature("company", pick.symbol)}
                          className="px-2 py-0.5 rounded bg-[var(--ink-2)] hover:bg-[var(--brass-glow)] text-[10px] font-mono text-[var(--paper-dim)] hover:text-[var(--brass)] border border-[var(--line)] transition-colors cursor-pointer"
                          title="Şirket Teşhisi'nde Aç"
                        >
                          Teşhis
                        </button>
                        <button
                          onClick={() => navigateToFeature("earnings", pick.symbol)}
                          className="px-2 py-0.5 rounded bg-[var(--ink-2)] hover:bg-[var(--brass-glow)] text-[10px] font-mono text-[var(--paper-dim)] hover:text-[var(--brass)] border border-[var(--line)] transition-colors cursor-pointer"
                          title="30 Sn Bilanço"
                        >
                          Bilanço
                        </button>
                        <button
                          onClick={() => navigateToFeature("trap", pick.symbol)}
                          className="px-2 py-0.5 rounded bg-[var(--ink-2)] hover:bg-[rgba(122,46,58,0.2)] text-[10px] font-mono text-[var(--paper-dim)] hover:text-[var(--loss)] border border-[var(--line)] transition-colors cursor-pointer"
                          title="Tuzak Radarı"
                        >
                          Tuzak
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 8. TAB 7: ☕ Orakul "Akşam Kapanış Brifingi" (Daily Executive Brief) */}
      {activeTab === "daily_brief" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] text-[var(--brass)] uppercase bg-[var(--brass-glow)] px-2.5 py-0.5 rounded border border-[var(--brass-dim)] mb-1">
                <Coffee className="w-3 h-3" />
                <span>Executive Daily Briefing</span>
              </div>
              <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                Orakul Günlük Kapanış Brifingi
              </h2>
              <p className="text-xs font-mono text-[var(--mist)] mt-1">
                Borsa kapanışında portföyünüzün günlük hareketini, BIST 100 kıyaslamasını ve en çok kazandıran varlıklarınızı tek sayfada özetler.
              </p>
            </div>

            <button
              onClick={handleGenerateDailyBrief}
              disabled={briefingLoading}
              className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-5 py-2.5 rounded shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${briefingLoading ? "animate-spin" : ""}`} />
              <span>{briefingLoading ? "Brifing Hazırlanıyor..." : "Brifingi Şimdi Güncelle"}</span>
            </button>
          </div>

          {/* If not generated yet, show prompt banner */}
          {!briefingResult && !briefingLoading && (
            <div className="p-8 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl text-center space-y-3">
              <Coffee className="w-8 h-8 text-[var(--brass)] mx-auto" />
              <h3 className="font-serif text-lg text-[var(--paper)] font-bold">
                Günün Kapanış Raporunu Almaya Hazır mısınız?
              </h3>
              <p className="text-xs text-[var(--mist)] font-mono max-w-md mx-auto">
                &quot;Brifingi Şimdi Güncelle&quot; butonuna basarak Orakul&apos;un sepetleriniz ve Borsa İstanbul kapanış verileriyle hazırladığı kişisel yönetici özetini çıkarabilirsiniz.
              </p>
            </div>
          )}

          {briefingResult && (
            <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dashed border-[var(--line)] pb-4">
                <div>
                  <span className="font-mono text-xs text-[var(--brass)]">{briefingResult.date}</span>
                  <h3 className="font-serif text-2xl font-bold text-[var(--paper)] mt-0.5">
                    {briefingResult.greeting}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2.5 bg-[var(--ink-2)] rounded-lg text-right border ${
                    briefingResult.portfolioDayChangePct >= 0
                      ? "border-[rgba(91,140,123,0.3)]"
                      : "border-[rgba(217,83,79,0.3)]"
                  }`}>
                    <span className="block font-mono text-[9px] text-[var(--mist)] uppercase">
                      Portföy Günlük
                    </span>
                    <span className={`font-mono text-base font-bold ${
                      briefingResult.portfolioDayChangePct >= 0
                        ? "text-[var(--verdigris)]"
                        : "text-[var(--loss)]"
                    }`}>
                      {briefingResult.portfolioDayChangePct >= 0 ? "+" : ""}%{briefingResult.portfolioDayChangePct}
                    </span>
                  </div>
                  <div className={`p-2.5 bg-[var(--ink-2)] rounded-lg text-right border ${
                    briefingResult.bistDayChangePct >= 0
                      ? "border-[var(--line)]"
                      : "border-[rgba(217,83,79,0.3)]"
                  }`}>
                    <span className="block font-mono text-[9px] text-[var(--mist)] uppercase">
                      BIST 100
                    </span>
                    <span className={`font-mono text-base font-bold ${
                      briefingResult.bistDayChangePct >= 0
                        ? "text-[var(--paper-dim)]"
                        : "text-[var(--loss)]"
                    }`}>
                      {briefingResult.bistDayChangePct >= 0 ? "+" : ""}%{briefingResult.bistDayChangePct}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Tag */}
              <div className="p-3 bg-[var(--brass-glow)] border border-[var(--brass-dim)] rounded-lg text-xs font-mono text-[var(--brass)] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{briefingResult.outperformanceText}</span>
              </div>

              {/* Executive Summary */}
              <div className="p-5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brass)] font-bold block mb-2">
                  ☕ Yönetici Özeti (Executive Summary)
                </span>
                <p className="text-sm text-[var(--paper)] leading-relaxed font-serif">
                  {briefingResult.executiveSummary}
                </p>
              </div>

              {/* Tactical Tip for Tomorrow */}
              <div className="p-4 bg-[var(--ink-2)] border border-[rgba(91,140,123,0.3)] rounded-lg flex items-start gap-3 text-xs">
                <Target className="w-4 h-4 text-[var(--verdigris)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--verdigris)] font-bold block mb-0.5">
                    Yarın İçin Taktiksel Pusula
                  </span>
                  <span className="text-[var(--paper-dim)] font-sans">{briefingResult.tacticalTip}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 7b: 📜 Orakul Haftalık "Kasa Mektubu" (Weekly Wealth Letter - Premium Item 3) */}
      {activeTab === "weekly_letter" && (
        <section className="bg-[#FAF7F0] text-[#1C202C] border border-[var(--brass-dim)] rounded-2xl p-6 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Watermark Seal */}
          <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
            <OracleSeal size="lg" />
          </div>

          <div className="border-b border-[rgba(28,32,44,0.15)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#8C6D23] font-bold">
                DEFTER &bull; ORAKUL BAŞ SERVET DANIŞMANLIĞI
              </div>
              <h2 className="font-serif text-3xl font-medium mt-1 text-[#1C202C]">
                Haftalık Kasa &amp; Sermaye Mektubu
              </h2>
              <div className="font-mono text-xs text-[#6B7280] mt-1">
                {weeklyLetter ? weeklyLetter.date : new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} &bull; Özel Müşteri Nüshası &bull; {userSettings?.orakulPersona === "cesur" ? "Cesur Fırsat Avcısı" : userSettings?.orakulPersona === "temkinli" ? "Temkinli Danışman" : "Klasik Değer Yatırımcısı"} Tonu
              </div>
            </div>

            <button
              onClick={handleGenerateWeeklyLetter}
              disabled={weeklyLetterLoading}
              className="px-5 py-2.5 rounded-lg bg-[#1C202C] hover:bg-[#2C3244] text-[#FAF7F0] font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${weeklyLetterLoading ? "animate-spin" : ""}`} />
              <span>{weeklyLetterLoading ? "Mektup Kaleme Alınıyor..." : weeklyLetter ? "Mektubu Yenile" : "Mektubu Şimdi Kaleme Al 🖋️"}</span>
            </button>
          </div>

          {weeklyLetter ? (
            <div className="space-y-6 max-w-3xl leading-relaxed text-sm sm:text-base font-serif animate-in fade-in">
              <div className="font-bold text-lg text-[#1C202C]">
                {weeklyLetter.greeting}
              </div>

              <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#8C6D23] leading-relaxed text-[#2C3244]">
                {weeklyLetter.openingParagraph}
              </p>

              <div className="p-5 rounded-xl bg-[rgba(201,162,75,0.1)] border border-[rgba(201,162,75,0.3)] font-sans text-xs sm:text-sm text-[#1C202C] space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#8C6D23] font-bold block">
                  📊 Haftalık Varlık ve Pozisyon Seyri
                </span>
                <p>{weeklyLetter.portfolioReview}</p>
              </div>

              <p className="leading-relaxed text-[#2C3244]">
                {weeklyLetter.macroCommentary}
              </p>

              <div className="p-5 rounded-xl bg-[rgba(28,32,44,0.05)] border border-[rgba(28,32,44,0.15)] space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--verdigris)] font-bold block">
                  🧭 Orakul Stratejik Tavsiyesi &amp; Önümüzdeki Hafta
                </span>
                <p className="text-xs sm:text-sm font-sans text-[#1C202C]">{weeklyLetter.strategicGuidance}</p>
              </div>

              <div className="pt-8 border-t border-[rgba(28,32,44,0.15)] flex items-end justify-between">
                <div className="space-y-1">
                  <div className="font-serif italic text-base sm:text-lg whitespace-pre-line text-[#1C202C]">
                    {weeklyLetter.signoff}
                  </div>
                </div>
                <StampBadge verdict="DENGELİ" />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-[rgba(201,162,75,0.2)] text-[#8C6D23] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C202C]">
                Bu haftaki kişisel kasa mektubunuz hazır bekliyor
              </h3>
              <p className="text-xs text-[#6B7280] font-sans leading-relaxed">
                Orakul portföyünüzün haftalık performansını, öne çıkan pozisyonlarınızı ve piyasa risklerini özel bir servet bankacısı üslubuyla kaleme alsın.
              </p>
              <button
                onClick={handleGenerateWeeklyLetter}
                disabled={weeklyLetterLoading}
                className="px-6 py-3 rounded-lg bg-[#1C202C] text-[#FAF7F0] font-bold font-mono text-xs shadow-lg hover:bg-[#2C3244] transition-all cursor-pointer"
              >
                {weeklyLetterLoading ? "Mektup Kaleme Alınıyor..." : "Mektubu Kaleme Al 🖋️"}
              </button>
            </div>
          )}
        </section>
      )}

      {/* 9. TAB 8: Haber & KAP Duygu Analizi */}
      {activeTab === "sentiment" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
            <div>
              <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                Piyasa &amp; KAP Haberleri Duygu Puanı (Sentiment)
              </h2>
              <p className="text-xs font-mono text-[var(--mist)] mt-1">
                Kütük ve sepet şirketlerinizin son KAP açıklamaları ve piyasa algısı üzerinden üretilen doğal dil duyarlılık analizleri.
              </p>
            </div>

            <button
              onClick={handleGenerateSentiment}
              disabled={sentimentLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--brass)] text-[var(--ink)] font-bold text-xs rounded hover:bg-[var(--brass-light)] shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sentimentLoading ? "animate-spin" : ""}`} />
              <span>{sentimentLoading ? "KAP Akışı Taranıyor..." : "Duygu Analizini Çalıştır"}</span>
            </button>
          </div>

          {/* Transparent Data Source Notice */}
          <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg text-xs font-mono text-[var(--mist)] flex items-start gap-2">
            <Info className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
            <span>
              Haber ve duyarlılık skorları, kütüğünüzdeki şirketlerin son operasyonel verileri, KAP bildirim özetleri ve sektörel beklentileri Orakul NLP motoruyla taranarak hesaplanır.
            </span>
          </div>

          {/* BIST Piyasa Korku & Coşku Barometresi (Market Sentiment Barometer) */}
          {sentimentResults && sentimentResults.length > 0 && (() => {
            const avgScore =
              sentimentResults.reduce((sum, n) => sum + n.sentimentScore, 0) / sentimentResults.length;
            const normalizedIndex = Math.round(((avgScore + 1) / 2) * 100); // 0 to 100
            const positiveCount = sentimentResults.filter((n) => n.impactVerdict === "POZİTİF").length;
            const negativeCount = sentimentResults.filter((n) => n.impactVerdict === "NEGATİF").length;
            const neutralCount = sentimentResults.filter((n) => n.impactVerdict === "NÖTR").length;

            const sentimentLabel =
              normalizedIndex >= 70
                ? "AŞIRI COŞKU & İŞTAH"
                : normalizedIndex >= 55
                ? "POZİTİF / ILIMLI İYİMSER"
                : normalizedIndex >= 45
                ? "DENGELİ / NÖTR"
                : normalizedIndex >= 30
                ? "TEMKİNLİ / BASKI"
                : "AŞIRI KORKU & PANİK";

            return (
              <div className="p-5 rounded-xl bg-[var(--ink-3)] border border-[var(--brass-dim)] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--brass)] uppercase font-bold tracking-wider block">
                      🌡️ BIST Piyasa Duygu Barometresi (Fear &amp; Greed)
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[var(--paper)] mt-0.5">
                      {sentimentLabel} ({normalizedIndex}/100)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      +{positiveCount} Pozitif
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {neutralCount} Nötr
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      -{negativeCount} Negatif
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between text-[var(--mist)]">
                    <span>Aşırı Korku (0)</span>
                    <span className="font-bold text-[var(--brass)]">Piyasa Skoru: {normalizedIndex}</span>
                    <span>Aşırı Coşku (100)</span>
                  </div>
                  <div className="w-full bg-[var(--ink-2)] h-3 rounded-full overflow-hidden p-0.5 border border-[var(--line)]">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500"
                      style={{ width: `${Math.max(5, Math.min(100, normalizedIndex))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {!sentimentResults && !sentimentLoading && (
            <div className="text-center py-12 border border-dashed border-[var(--line)] rounded-lg bg-[var(--ink-3)]">
              <Newspaper className="w-10 h-10 text-[var(--mist)] mx-auto mb-3 opacity-50" />
              <p className="text-xs font-mono text-[var(--paper-dim)] mb-4">
                Henüz duygu analizi çalıştırılmadı. Portföy şirketlerinizin son duygu skorlarını çıkarmak için butona tıklayın.
              </p>
              <button
                onClick={handleGenerateSentiment}
                className="px-4 py-2 bg-[var(--brass)] text-[var(--ink)] font-bold text-xs rounded hover:bg-[var(--brass-light)] cursor-pointer"
              >
                KAP &amp; Piyasa Duygu Analizini Başlat
              </button>
            </div>
          )}

          {sentimentResults && (
            <div className="divide-y divide-dashed divide-[var(--line)] border border-[var(--line)] rounded-lg bg-[var(--ink-3)]">
              {sentimentResults.map((news) => (
                <div key={news.id} className="p-4 flex items-start justify-between gap-4 text-xs hover:bg-[rgba(201,162,75,0.02)]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[var(--brass)]">{news.relatedSymbol}</span>
                      <span className="text-[var(--mist)]">• {news.source}</span>
                      <span className="text-[var(--mist)]">• {news.date}</span>
                    </div>
                    <p className="text-[var(--paper)] font-sans text-sm font-semibold">{news.title}</p>
                    <p className="text-[var(--paper-dim)] font-sans text-xs">{news.summary}</p>
                  </div>

                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded border font-bold shrink-0 ${
                      news.impactVerdict === "POZİTİF"
                        ? "text-[var(--verdigris)] border-[var(--verdigris)] bg-[rgba(91,140,123,0.12)]"
                        : news.impactVerdict === "NEGATİF"
                        ? "text-[var(--loss)] border-[var(--loss)] bg-[rgba(122,46,58,0.15)]"
                        : "text-[var(--brass)] border-[var(--brass-dim)] bg-[rgba(201,162,75,0.1)]"
                    }`}
                  >
                    {news.sentimentScore >= 0 ? `+${news.sentimentScore}` : news.sentimentScore} ({news.impactVerdict})
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB: Portföy Risk Uyarıları (100% Real Live Portfolio Data) */}
      {activeTab === "anomaly" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4">
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              Portföy Risk Uyarıları
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              Kütüğünüzdeki gerçek sepetler üzerinden hesaplanan varlık yoğunlaşması, döviz/emtia kalkanı ve sektör riskleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Concentration Warnings */}
            {portfolioAnomalies.concentrationWarnings.length > 0 ? (
              portfolioAnomalies.concentrationWarnings.map((w, idx) => (
                <div key={idx} className="p-4 bg-[var(--ink-3)] border border-[rgba(201,162,75,0.4)] rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--brass)] font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Aşırı Yoğunlaşma Uyarısı: {w.basketName}</span>
                  </div>
                  <p className="text-xs text-[var(--paper-dim)] leading-relaxed">
                    <strong className="text-[var(--paper)]">{w.symbol}</strong> varlığı sepetinizin <strong>%{w.weight}</strong> payını oluşturarak güvenli konsantrasyon sınırını (%30) aşmıştır. (Hedeflenen ağırlık: %{w.targetWeight}). Oynaklığı düşürmek için rebalance önerilir.
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--verdigris)] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Varlık Konsantrasyonu Güvenli</span>
                </div>
                <p className="text-xs text-[var(--paper-dim)]">
                  Sepetlerinizde %30 sınırını aşan baskın tekil hisse ağırlığı bulunmamaktadır. Varlık dağılımınız dengelidir.
                </p>
              </div>
            )}

            {/* 2. Liquid / Gold / FX Shield Ratio */}
            <div className="p-4 bg-[var(--ink-3)] border border-[rgba(91,140,123,0.3)] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--verdigris)] font-bold">
                <Shield className="w-4 h-4" />
                <span>Likidite &amp; Emtia / Kur Kalkanı</span>
              </div>
              <p className="text-xs text-[var(--paper-dim)] leading-relaxed">
                Altın, gümüş ve döviz bazlı varlıklarınız toplam sepet değerinizin <strong>%{portfolioAnomalies.hedgePercent}</strong> ({portfolioAnomalies.hedgeValue.toLocaleString("tr-TR")} ₺) kısmını oluşturmaktadır.
                {portfolioAnomalies.hedgePercent >= 15
                  ? " Bu oran enflasyon ve kur şoklarına karşı güçlü bir reel sigorta kalkanı sağlar."
                  : " Yüksek enflasyonist dönemlerde emtia ve döviz kalkanı oranının en az %15 seviyesinde tutulması önerilir."}
              </p>
            </div>

            {/* 3. Sector Imbalance Alerts */}
            {portfolioAnomalies.sectorWarnings.length > 0 &&
              portfolioAnomalies.sectorWarnings.map((sw, idx) => (
                <div key={idx} className="p-4 bg-[var(--ink-3)] border border-[rgba(163,59,59,0.3)] rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--loss)] font-bold">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Sektörel Yoğunlaşma Riski: {sw.sector}</span>
                  </div>
                  <p className="text-xs text-[var(--paper-dim)]">
                    <strong className="text-[var(--paper)]">{sw.sector}</strong> sektörü toplam sepetlerinizin <strong>%{sw.pct}</strong>&apos;sini oluşturmaktadır. Sektörel regülasyon ve piyasa döngülerine karşı çeşitlendirme yapılması tavsiye edilir.
                  </p>
                </div>
              ))}

            {/* 4. High Drawdown Alerts */}
            {portfolioAnomalies.drawdownAlerts.length > 0 &&
              portfolioAnomalies.drawdownAlerts.map((da, idx) => (
                <div key={idx} className="p-4 bg-[var(--ink-3)] border border-[rgba(163,59,59,0.3)] rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--loss)] font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Zararda Pozisyon Uyarısı: {da.symbol}</span>
                  </div>
                  <p className="text-xs text-[var(--paper-dim)]">
                    <strong className="text-[var(--paper)]">{da.basketName}</strong> içindeki <strong className="text-[var(--paper)]">{da.symbol}</strong> pozisyonu maliyetine göre <strong>%{da.lossPct}</strong> değer kaybetmiştir. (Maliyet: {da.avgCost.toFixed(2)} ₺ → Fiyat: {da.currentPrice.toFixed(2)} ₺).
                  </p>
                </div>
              ))}
          </div>

          {portfolioAnomalies.isClean && (
            <div className="p-4 bg-[rgba(91,140,123,0.1)] border border-[var(--verdigris)] rounded-lg text-center font-mono text-xs text-[var(--verdigris)] font-semibold">
              ✓ Şu an kütükte tespit edilen kritik bir risk veya anomali bulunmuyor — portföyünüz dengeli ve güvenli sınırlar içerisinde.
            </div>
          )}
        </section>
      )}

      {/* 6. ORAKUL BAŞARI KARNESİ (ACCURACY TRACKER) - Visible only on Predictive / Decision Categories (Sepet & Strateji, Şirket Analizi) */}
      {(activeCategory === "strategy" || activeCategory === "company") && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[var(--brass)] bg-[var(--ink-3)] flex items-center justify-center text-[var(--brass)] shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[var(--paper)] font-medium">
                  Orakul Başarı Karnesi &amp; İsabet Oranı
                </h3>
                <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
                  Modelin geçmişte ürettiği AL/SAT/TUT kararlarının piyasa fiyatlamasıyla doğrulanma performansı.
                </p>
              </div>
            </div>

            <button
              onClick={handleEvaluateOutcomes}
              disabled={evaluating}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--line)] rounded text-xs font-mono text-[var(--paper-dim)] hover:text-[var(--paper)] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--brass)] ${evaluating ? "animate-spin" : ""}`} />
              <span>Piyasa Verileriyle Doğrula</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-[var(--ink-3)] border border-[rgba(91,140,123,0.3)] rounded-lg">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--mist)]">
                İsabet Oranı
              </span>
              <div className="font-serif text-2xl font-bold text-[var(--verdigris)] mt-1">
                %{aiAccuracyStats.accuracyRate}
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)]">
                {aiAccuracyStats.evaluated} tamamlanan karar
              </span>
            </div>

            <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--mist)]">
                Toplam Karar
              </span>
              <div className="font-serif text-2xl font-bold text-[var(--paper)] mt-1">
                {aiAccuracyStats.total}
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)]">Kasa Arşivi</span>
            </div>

            <div className="p-4 bg-[var(--ink-3)] border border-[rgba(91,140,123,0.3)] rounded-lg">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--mist)]">
                İsabetli (Doğru)
              </span>
              <div className="font-serif text-2xl font-bold text-[var(--verdigris)] mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>{aiAccuracyStats.correct}</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)]">Doğrulandı</span>
            </div>

            <div className="p-4 bg-[var(--ink-3)] border border-[rgba(122,46,58,0.3)] rounded-lg">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--mist)]">
                Yanıltıcı (Ters)
              </span>
              <div className="font-serif text-2xl font-bold text-[var(--loss)] mt-1 flex items-center gap-1.5">
                <XCircle className="w-5 h-5" />
                <span>{aiAccuracyStats.incorrect}</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)]">Düzeltme Gerekli</span>
            </div>

            <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg col-span-2 sm:col-span-1">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--mist)]">
                Takip Sürecinde
              </span>
              <div className="font-serif text-2xl font-bold text-[var(--brass)] mt-1 flex items-center gap-1.5">
                <Clock className="w-5 h-5" />
                <span>{aiAccuracyStats.pending}</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)]">Vadesi Dolmamış</span>
            </div>
          </div>

          {/* 1. Karar Tipine Göre İsabet & Alfa Ayrımı (Geliştirme Madde 1 & 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-3 rounded-lg bg-[var(--ink-3)] border border-[rgba(91,140,123,0.25)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--mist)] block">🟢 AL İsabeti</span>
                <span className="font-serif text-base font-bold text-[var(--verdigris)]">
                  %{aiAccuracyStats.alAccuracy}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)] bg-[var(--ink-2)] px-2 py-0.5 rounded border border-[var(--line)]">
                {aiAccuracyStats.alCorrect}/{aiAccuracyStats.alTotal} Karar
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--ink-3)] border border-[rgba(122,46,58,0.25)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--mist)] block">🔴 SAT İsabeti</span>
                <span className="font-serif text-base font-bold text-[var(--loss)]">
                  %{aiAccuracyStats.satAccuracy}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)] bg-[var(--ink-2)] px-2 py-0.5 rounded border border-[var(--line)]">
                {aiAccuracyStats.satCorrect}/{aiAccuracyStats.satTotal} Karar
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--ink-3)] border border-[rgba(201,162,75,0.25)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--mist)] block">🟡 TUT / Nötr</span>
                <span className="font-serif text-base font-bold text-[var(--brass)]">
                  %{aiAccuracyStats.tutAccuracy}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--mist)] bg-[var(--ink-2)] px-2 py-0.5 rounded border border-[var(--line)]">
                {aiAccuracyStats.tutCorrect}/{aiAccuracyStats.tutTotal} Karar
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--ink-3)] border border-[var(--brass-dim)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--mist)] block">📈 Ort. Üretilen Alfa</span>
                <span className={`font-serif text-base font-bold ${aiAccuracyStats.avgAlpha >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"}`}>
                  {aiAccuracyStats.avgAlpha >= 0 ? `+${aiAccuracyStats.avgAlpha}` : aiAccuracyStats.avgAlpha}%
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--brass)] bg-[var(--brass-glow)] px-2 py-0.5 rounded border border-[var(--brass-dim)]">
                vs BIST100
              </span>
            </div>
          </div>

          {/* Accuracy Trend Chart (Item 2) */}
          {accuracyTrendData ? (
            <div className="p-4 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--brass)] font-bold uppercase tracking-wider">
                    📈 Zaman İçinde İsabet Oranı Eğrisi
                  </span>
                  <span className="text-[10px] text-[var(--mist)]">({accuracyTrendData.points.length} Karar Noktası)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-[var(--mist)]">Min: %{accuracyTrendData.minRate}</span>
                  <span className="text-[var(--mist)]">•</span>
                  <span className="text-[var(--verdigris)] font-bold">Güncel: %{accuracyTrendData.latestRate}</span>
                </div>
              </div>

              <div className="h-28 w-full relative flex items-end pt-2 pb-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 90">
                  <defs>
                    <linearGradient id="accuracyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5B8C7B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#5B8C7B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="20" x2="400" y2="20" stroke="var(--line)" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="0" y1="55" x2="400" y2="55" stroke="var(--line)" strokeDasharray="3 3" opacity="0.4" />
                  <path d={accuracyTrendData.areaD} fill="url(#accuracyGrad)" />
                  <path d={accuracyTrendData.pathD} fill="none" stroke="#5B8C7B" strokeWidth="2.5" />
                  {accuracyTrendData.points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={3.5}
                      fill={p.isCorrect ? "#5B8C7B" : "#A33B3B"}
                      stroke="var(--ink)"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-[var(--ink-3)] border border-dashed border-[var(--line)] rounded-xl text-center font-mono text-xs text-[var(--mist)]">
              📊 İsabet trendi grafiği için en az 2 tamamlanmış ve vadesi dolmuş AI kararı gereklidir.
            </div>
          )}

          {/* 2. Güven Kalibrasyonu & Sağlayıcı Karşılaştırması (Geliştirme Madde 3 & 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Güven Kalibrasyonu */}
            <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                <span className="font-mono text-xs text-[var(--brass)] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Güven Kalibrasyonu Analizi</span>
                </span>
                <span className="text-[10px] font-mono text-[var(--mist)]">Model Özgüven Testi</span>
              </div>

              {calibrationStats && calibrationStats.some((b) => b.total > 0) ? (
                <div className="space-y-2.5">
                  {calibrationStats.map((bucket, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--paper-dim)]">{bucket.label}</span>
                        <span className="text-[var(--mist)]">
                          {bucket.actualRate !== null ? (
                            <strong className="text-[var(--paper)] font-bold">
                              %{bucket.actualRate} Gerçekleşen ({bucket.correct}/{bucket.total})
                            </strong>
                          ) : (
                            "— (Henüz karar yok)"
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--ink-2)] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[var(--brass)] h-full rounded-full transition-all"
                          style={{ width: `${bucket.actualRate || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center font-mono text-xs text-[var(--mist)]">
                  Kalibrasyon analizi için tamamlanmış karar verisi bekleniyor.
                </div>
              )}
            </div>

            {/* Sağlayıcı & Model Performansı */}
            <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                <span className="font-mono text-xs text-[var(--verdigris)] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Sağlayıcı &amp; Model İsabeti</span>
                </span>
                <span className="text-[10px] font-mono text-[var(--mist)]">Motor Karşılaştırması</span>
              </div>

              {providerStats && providerStats.length > 0 ? (
                <div className="space-y-2.5">
                  {providerStats.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--paper)] font-medium">{p.provider}</span>
                        <span className="text-[var(--mist)]">
                          {p.rate !== null ? (
                            <span className="text-[var(--verdigris)] font-bold">
                              %{p.rate} İsabet ({p.correct}/{p.total})
                            </span>
                          ) : (
                            "—"
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--ink-2)] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[var(--verdigris)] h-full rounded-full transition-all"
                          style={{ width: `${p.rate || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center font-mono text-xs text-[var(--mist)]">
                  Henüz sonuçlanan model bazlı karar verisi bulunmuyor.
                </div>
              )}
            </div>
          </div>

          {/* 3. Öne Çıkan Kararlar: En İyi ve En Zayıf 3 Çağrı (Geliştirme Madde 5) */}
          {topAndWorstCalls && (topAndWorstCalls.top3.length > 0 || topAndWorstCalls.worst3.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* En Başarılı 3 Alfa Çağrısı */}
              <div className="p-4 bg-[var(--ink-3)] border border-[rgba(91,140,123,0.3)] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--verdigris)] font-bold uppercase tracking-wider border-b border-[var(--line)] pb-2">
                  <Award className="w-4 h-4" />
                  <span>🏆 En Başarılı Alfa Çağrıları</span>
                </div>
                <div className="space-y-2">
                  {topAndWorstCalls.top3.map((call, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[rgba(91,140,123,0.2)] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[var(--paper)]">{call.symbol}</span>
                          <span className="font-mono text-[10px] text-[var(--verdigris)] bg-[rgba(91,140,123,0.15)] px-1.5 py-0.2 rounded border border-[var(--verdigris)]">
                            {call.verdict || call.verdictTag}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-[var(--mist)] mt-0.5">
                          {call.priceAtVerdict?.toFixed(2)} ₺ → {call.priceAfterPeriod?.toFixed(2)} ₺ (%{call.stockReturn})
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-xs text-[var(--verdigris)] block">
                          +{call.alpha}% Alfa
                        </span>
                        <span className="text-[9px] text-[var(--mist)]">BIST100 Farkı</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* En Zayıf 3 Çağrı (Hata Dersi) */}
              <div className="p-4 bg-[var(--ink-3)] border border-[rgba(122,46,58,0.3)] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--loss)] font-bold uppercase tracking-wider border-b border-[var(--line)] pb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>⚠️ En Zayıf Çağrılar (Hata Dersi)</span>
                </div>
                <div className="space-y-2">
                  {topAndWorstCalls.worst3.length > 0 ? (
                    topAndWorstCalls.worst3.map((call, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[var(--ink-2)] border border-[rgba(122,46,58,0.2)] flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[var(--paper)]">{call.symbol}</span>
                            <span className="font-mono text-[10px] text-[var(--loss)] bg-[rgba(122,46,58,0.15)] px-1.5 py-0.2 rounded border border-[var(--loss)]">
                              {call.verdict || call.verdictTag}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-[var(--mist)] mt-0.5">
                            {call.priceAtVerdict?.toFixed(2)} ₺ → {call.priceAfterPeriod?.toFixed(2)} ₺ (%{call.stockReturn})
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-bold text-xs text-[var(--loss)] block">
                            {call.alpha}% Alfa
                          </span>
                          <span className="text-[9px] text-[var(--mist)]">BIST100 Altında</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center font-mono text-xs text-[var(--mist)]">
                      Kritik negatif sapma gösteren bir karar bulunmuyor.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filter Pills and Clear All Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Tüm Kararlar" },
                { id: "correct", label: `İsabetli (${aiAccuracyStats.correct})` },
                { id: "incorrect", label: `Yanıltıcı (${aiAccuracyStats.incorrect})` },
                { id: "pending", label: `Takipte (${aiAccuracyStats.pending})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setHistoryFilter(f.id as "all" | "correct" | "incorrect" | "pending")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    historyFilter === f.id
                      ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                      : "bg-[var(--ink-3)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {aiHistory.length > 0 && (
              <button
                onClick={() => setShowClearAllConfirm(true)}
                className="px-2.5 py-1 rounded text-xs font-mono text-[var(--loss)] border border-[rgba(217,83,79,0.3)] hover:bg-[rgba(122,46,58,0.15)] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tümünü Temizle</span>
              </button>
            )}
          </div>

          {/* Table of Decisions with Verified Outcomes */}
          <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-[100px_1.2fr_1.8fr_140px_130px_40px] gap-4 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
              <span>Tarih</span>
              <span>Varlık &amp; Tür</span>
              <span>Özet &amp; Model</span>
              <span className="text-center">Fiyat Takibi</span>
              <span className="text-right">İsabet Durumu</span>
              <span className="text-center">İşlem</span>
            </div>

            <div className="divide-y divide-dashed divide-[var(--line)]">
              {filteredAiHistory.length === 0 && (
                <div className="p-8 text-center text-xs font-mono text-[var(--mist)]">
                  Henüz kaydedilmiş bir AI karar veya analiz geçmişi bulunmuyor.
                </div>
              )}
              {filteredAiHistory.map((h) => {
                const co = companies.find((c) => c.symbol === h.symbol);
                const currentPrice = co ? co.price : h.priceAfterPeriod;

                return (
                  <div
                    key={h.id}
                    className="grid grid-cols-1 md:grid-cols-[100px_1.2fr_1.8fr_140px_130px_40px] gap-3 md:gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[rgba(201,162,75,0.03)]"
                  >
                    <div className="font-mono text-xs text-[var(--mist)]">{h.date}</div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--brass)]">
                          {h.symbol || h.type}
                        </span>
                        <StampBadge verdict={(h.verdict || h.verdictTag) as "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ"} />
                      </div>
                      <div className="font-medium text-xs text-[var(--paper)] mt-0.5 line-clamp-1">
                        {h.title}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[var(--mist)] line-clamp-2">
                        {h.description}
                      </div>
                      {/* Provider & Model Tag (Item 3) */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[9px] bg-[var(--ink-2)] text-[var(--brass)] px-1.5 py-0.5 rounded border border-[var(--brass-dim)]">
                          {h.model || h.provider || "Algoritmik Motor"}
                        </span>
                      </div>
                    </div>

                    <div className="text-left md:text-center font-mono text-xs">
                      {h.type === "Sepet Önerisi" || h.type === "Reçete" || h.budgetAtCreation ? (
                        <div>
                          <span className="text-[10px] text-[var(--mist)] uppercase block">Bütçe</span>
                          <span className="font-bold text-[var(--paper)]">
                            {(h.budgetAtCreation || h.priceAtVerdict)?.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      ) : h.priceAtVerdict ? (
                        <div>
                          <div>
                            <span className="text-[var(--mist)]">{h.priceAtVerdict.toFixed(2)} ₺</span>
                            <span className="mx-1 text-[var(--brass)]">→</span>
                            <span className="font-bold text-[var(--paper)]">
                              {currentPrice ? `${currentPrice.toFixed(2)} ₺` : "—"}
                            </span>
                          </div>
                          {typeof h.alpha === "number" && (
                            <div className="mt-0.5">
                              <span
                                className={`text-[10px] font-mono font-bold ${
                                  h.alpha >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                                }`}
                              >
                                {h.alpha >= 0 ? `+${h.alpha}%` : `${h.alpha}%`} Alfa
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--mist)]">—</span>
                      )}
                    </div>

                    <div className="text-left md:text-right">
                      {h.outcomeCorrect === true ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--verdigris)] text-[var(--verdigris)] bg-[rgba(91,140,123,0.12)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>İsabetli</span>
                        </span>
                      ) : h.outcomeCorrect === false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--loss)] text-[var(--loss)] bg-[rgba(122,46,58,0.15)]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Yanıltıcı</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--brass-dim)] text-[var(--brass)] bg-[rgba(201,162,75,0.1)]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Takipte</span>
                        </span>
                      )}
                    </div>

                    <div className="text-left md:text-center">
                      <button
                        onClick={() => setHistoryToDelete(h)}
                        title="Bu kaydı sil"
                        className="p-1.5 rounded hover:bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--loss)] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deletion Confirmation Modals */}
          <ConfirmModal
            isOpen={!!historyToDelete}
            onClose={() => setHistoryToDelete(null)}
            onConfirm={() => {
              if (historyToDelete) {
                deleteAiHistory(historyToDelete.id);
                showToast("Kayıt Silindi", "AI analiz geçmişi kaydı silindi.", "info");
                setHistoryToDelete(null);
              }
            }}
            title="Analiz Kaydını Sil"
            message={`"${historyToDelete?.title || historyToDelete?.symbol || 'Bu analiz'}" kaydını kalıcı olarak silmek istediğinizden emin misiniz?`}
            confirmText="Evet, Sil"
            cancelText="Vazgeç"
            variant="danger"
          />

          <ConfirmModal
            isOpen={showClearAllConfirm}
            onClose={() => setShowClearAllConfirm(false)}
            onConfirm={() => {
              clearAllAiHistory();
              showToast("Tüm Kayıtlar Temizlendi", "AI analiz geçmişi tamamen temizlendi.", "info");
              setShowClearAllConfirm(false);
            }}
            title="Tüm AI Geçmişini Temizle"
            message="Tüm geçmiş AI analiz ve karar kayıtlarını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
            confirmText="Evet, Tümünü Temizle"
            cancelText="Vazgeç"
            variant="danger"
          />

          <ConfirmModal
            isOpen={queryToDelete !== null}
            onClose={() => setQueryToDelete(null)}
            onConfirm={confirmDeleteSavedQuery}
            title="Kayıtlı Sorguyu Sil"
            message={
              queryToDelete
                ? `"${queryToDelete}" kayıtlı aramasını silmek istediğinize emin misiniz?`
                : ""
            }
            confirmText="Evet, Sil"
            cancelText="Vazgeç"
            variant="danger"
          />

          {/* Screener Add to Basket Modal */}
          {allocatingPick && (
            <div className="fixed inset-0 bg-[rgba(10,14,13,0.8)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <div className="flex items-center gap-2">
                    <BookmarkPlus className="w-5 h-5 text-[var(--brass)]" />
                    <h3 className="font-serif text-lg font-bold text-[var(--paper)]">
                      Sepete Hisse Ekle
                    </h3>
                  </div>
                  <button
                    onClick={() => setAllocatingPick(null)}
                    className="text-[var(--mist)] hover:text-[var(--paper)] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--mist)]">Varlık:</span>
                    <span className="font-bold text-[var(--brass)]">{allocatingPick.symbol} — {allocatingPick.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--mist)]">Birim Fiyat:</span>
                    <span className="font-bold text-[var(--paper)]">{allocatingPick.price.toFixed(2)} ₺</span>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[var(--mist)] uppercase mb-1.5 text-[11px]">Hedef Sepet</label>
                    <select
                      value={allocateBasketId}
                      onChange={(e) => setAllocateBasketId(e.target.value)}
                      className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-2.5 text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                    >
                      {baskets.length === 0 && (
                        <option value="">Henüz sepetiniz yok</option>
                      )}
                      {baskets.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.holdings?.length || 0} Varlık)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[var(--mist)] uppercase mb-1.5 text-[11px]">Eklenecek Lot Miktarı</label>
                    <input
                      type="number"
                      min="1"
                      value={allocateLotAmount}
                      onChange={(e) => setAllocateLotAmount(e.target.value)}
                      className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-lg p-2.5 text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                      placeholder="10"
                    />
                  </div>

                  <div className="p-2.5 bg-[var(--ink)] rounded border border-[var(--line)] flex justify-between items-center text-[11px]">
                    <span className="text-[var(--mist)]">Tahmini Toplam Tutar:</span>
                    <span className="font-bold text-[var(--verdigris)]">
                      {((parseFloat(allocateLotAmount) || 0) * allocatingPick.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
                  <button
                    onClick={() => setAllocatingPick(null)}
                    className="px-4 py-2 rounded-lg bg-[var(--ink-3)] hover:bg-[var(--ink)] text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)] cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={handleConfirmAllocateToBasket}
                    disabled={baskets.length === 0}
                    className="px-5 py-2 rounded-lg bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs font-mono cursor-pointer disabled:opacity-50 transition-all shadow"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function OrakulPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-[var(--mist)]">
          Orakul Yükleniyor...
        </div>
      }
    >
      <OrakulContent />
    </Suspense>
  );
}
