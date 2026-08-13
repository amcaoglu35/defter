"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Shield,
  TrendingUp,
  Brain,
  History,
  Check,
  ArrowRight,
  BookmarkPlus,
  Coins,
  Search,
  Activity,
  AlertTriangle,
  MessageSquare,
  Newspaper,
  Compass,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Award,
  Target,
  BarChart3,
  FileText,
  AlertOctagon,
  Hourglass,
  Coffee,
  Sliders,
  Zap,
} from "lucide-react";
import OracleSeal from "@/components/OracleSeal";
import StampBadge from "@/components/StampBadge";
import { useDefterStore } from "@/lib/store";
import { AiHistoryItem, Basket } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import CompanyCombobox from "@/components/CompanyCombobox";
import {
  EarningsFlashResult,
  ValueTrapResult,
  BacktestResult,
  StockScreenerResult,
  DailyBriefingResult,
} from "@/lib/aiService";

export default function OrakulPage() {
  const {
    companies,
    baskets,
    aiHistory,
    addAiHistory,
    evaluateAiOutcomes,
    aiAccuracyStats,
    aiProvider,
    aiApiKey,
    geminiModel,
    createBasket,
  } = useDefterStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    | "wizard"
    | "company"
    | "earnings"
    | "trap"
    | "backtest"
    | "screener"
    | "daily_brief"
    | "sentiment"
    | "anomaly"
  >("wizard");

  // 1. Wizard state
  const [goal, setGoal] = useState("Temettü Odaklı Nakit Akışı");
  const [risk, setRisk] = useState("Dengeli (Orta Risk)");
  const [universe, setUniverse] = useState("BIST 30 & Emtia");
  const [budget, setBudget] = useState("100.000");

interface OrakulRecipeResult {
  title?: string;
  recipeTitle?: string;
  summary?: string;
  healthScore?: number | string;
  expectedYield?: string;
  recommendedDuration?: string;
  riskRating?: string;
  allocation?: Array<{
    symbol: string;
    companyName?: string;
    name?: string;
    weight: number;
    note?: string;
    rationale?: string;
  }>;
}

interface CompanyAnalysisResult {
  symbol?: string;
  companyName?: string;
  verdict?: "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ";
  valuationScore?: number | string;
  targetPrice?: number | string;
  summary?: string;
  whyMoved?: string;
  pastFeedbackSummary?: string;
  metrics?: Array<{ label: string; value: string }>;
  pros?: string[];
  risks?: string[];
  catalysts?: string[];
}

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrakulRecipeResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 2. Company Deep-Dive state
  const [selectedCoSymbol, setSelectedCoSymbol] = useState(companies[0]?.symbol || "THYAO");
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysisResult | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);

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

  // 6. 🔍 Stock Screener state
  const [screenerQuery, setScreenerQuery] = useState<string>("F/K'sı 8'in altında yüksek temettü veren sanayi hisseleri");
  const [screenerResult, setScreenerResult] = useState<StockScreenerResult | null>(null);
  const [screenerLoading, setScreenerLoading] = useState(false);

  // 7. ☕ Daily Briefing state
  const [briefingResult, setBriefingResult] = useState<DailyBriefingResult | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  // History Filter state
  const [historyFilter, setHistoryFilter] = useState<"all" | "correct" | "incorrect" | "pending">("all");
  const [evaluating, setEvaluating] = useState(false);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setResult(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "recipe",
          payload: {
            goal,
            risk,
            universe,
            budget: parseFloat(budget.replace(/\./g, "")) || 100000,
            allCompanies: companies.slice(0, 60),
          },
          provider: aiProvider,
          apiKey: aiApiKey || undefined,
          model: geminiModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.data);
        showToast("Orakul Reçetesi Hazır", `${goal} için özel varlık dağılımı hesaplandı.`, "success");
      } else {
        showToast("Reçete Oluşturulamadı", "Yapay zeka motoru yanıt verirken bir sorun oluştu.", "error");
      }
    } catch (e) {
      console.warn("Recipe generation error:", e);
      showToast("Bağlantı Hatası", "Sunucu ile iletişim kurulamadı.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for the 5 new AI features
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
          apiKey: aiApiKey || undefined,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEarningsResult(data.data);
        showToast("Bilanço Karnesi Hazır", `${earningsSymbol} için 30 saniyelik bilanço özeti çıkarıldı.`, "success");
      }
    } catch (e) {
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
          apiKey: aiApiKey || undefined,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTrapResult(data.data);
        showToast("Tuzak Analizi Tamamlandı", `${trapSymbol} değer tuzağı risk puanı hesaplandı.`, "success");
      }
    } catch (e) {
      showToast("Hata", "Tuzak analizi çalıştırılamadı.", "error");
    } finally {
      setTrapLoading(false);
    }
  };

  const handleRunBacktest = async () => {
    setBacktestLoading(true);
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
          },
          provider: aiProvider,
          apiKey: aiApiKey || undefined,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBacktestResult(data.data);
        showToast("Simülasyon Tamamlandı", `${backtestMonths} aylık geçmiş getiri laboratuvarı sonuçlandı.`, "success");
      }
    } catch (e) {
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
          apiKey: aiApiKey || undefined,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setScreenerResult(data.data);
        showToast("Tarama Tamamlandı", `Kriterlere uyan şirketler listelendi.`, "success");
      }
    } catch (e) {
      showToast("Hata", "Hisse taraması yapılamadı.", "error");
    } finally {
      setScreenerLoading(false);
    }
  };

  const handleGenerateDailyBrief = async () => {
    setBriefingLoading(true);
    const totalVal = baskets.reduce((sum, b) => sum + b.totalValue, 0);
    const totalCost = baskets.reduce((sum, b) => sum + b.totalCost, 0);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily_brief",
          payload: {
            totalValue: totalVal,
            totalProfit: totalVal - totalCost,
            dailyChangePct: 1.45,
            basketsCount: baskets.length,
          },
          provider: aiProvider,
          apiKey: aiApiKey || undefined,
          model: geminiModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBriefingResult(data.data);
        showToast("Kapanış Brifingi Hazır", "Günlük yönetici özeti oluşturuldu.", "success");
      }
    } catch (e) {
      showToast("Hata", "Kapanış brifingi oluşturulamadı.", "error");
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleCompanyAnalyze = async () => {
    const co = companies.find((c) => c.symbol === selectedCoSymbol);
    if (!co) {
      showToast("Şirket Bulunamadı", "Analiz etmek istediğiniz şirket kütükte kayıtlı değil.", "error");
      return;
    }
    setCompanyLoading(true);
    try {
      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "company_analysis",
          payload: co,
          history: aiHistory,
          provider: aiProvider,
          apiKey: aiApiKey || undefined,
          model: geminiModel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCompanyAnalysis(data.data);
        showToast("Analiz Tamamlandı", `${co?.name || selectedCoSymbol} için değerleme raporu hazırlandı.`, "success");

        // Record analysis into aiHistory for persistent feedback tracking
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
            outcomeCorrect: null,
            targetPeriodDays: 30,
          };
          addAiHistory(newHist);
        }
      } else {
        showToast("Analiz Başarısız", "Şirket verisi analiz edilirken bir sorun yaşandı.", "error");
      }
    } catch (e) {
      console.warn("Company analyze error:", e);
      showToast("Bağlantı Hatası", "Sunucu bağlantısında sorun oluştu.", "error");
    } finally {
      setCompanyLoading(false);
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
            const co = companies.find((c) => c.symbol === item.symbol);
            const price = co ? co.price : 100;
            const allocatedMoney = (budgetNum * item.weight) / 100;
            const qty = parseFloat((allocatedMoney / price).toFixed(1));

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
      description: `4 varlık sepeti. Bütçe: ${budget} ₺. Skor: ${result.healthScore}/100.`,
      verdictTag: "DENGELİ",
      verdict: "DENGELİ",
      verdictDate: new Date().toISOString().split("T")[0],
      budgetAtCreation: budgetNum,
      outcomeCorrect: null,
      targetPeriodDays: 30,
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
          Makroekonomik döngüler, şirket bilançoları, geçmiş analizlerden öğrenen geri besleme modeli ve başarı karnesi.
        </p>

        {/* Feature Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 p-1.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl justify-center">
          {[
            { id: "wizard", label: "Sepet Sihirbazı", icon: Compass },
            { id: "company", label: "Şirket Teşhisi", icon: Activity },
            { id: "earnings", label: "30 Sn Bilanço Tercümanı", icon: FileText },
            { id: "trap", label: "Tuzak & Anomali Radarı", icon: AlertOctagon },
            { id: "backtest", label: "Zaman Makinesi (Backtest)", icon: Hourglass },
            { id: "screener", label: "Akıllı Hisse Tarayıcısı", icon: Search },
            { id: "daily_brief", label: "Kapanış Brifingi", icon: Coffee },
            { id: "sentiment", label: "Haber & Duygu", icon: Newspaper },
            { id: "anomaly", label: "Risk & Anomali", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-md scale-105"
                    : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-3)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. TAB 1: Sepet Sihirbazı */}
      {activeTab === "wizard" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4">
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              Özelleştirilmiş Portföy Reçetesi
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              Yatırım hedeflerinizi seçin, Orakul matematiksel optimizasyonla sepet üretsin.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2.5">
                1. Yatırım Hedefi &amp; Strateji
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Temettü Odaklı Nakit Akışı",
                  "Enflasyon & Kur Koruması",
                  "Büyüme & Teknoloji İhracatı",
                  "Defansif Kıymetli Maden",
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGoal(opt)}
                    className={`px-4 py-2.5 rounded text-xs font-mono border transition-all cursor-pointer ${
                      goal === opt
                        ? "bg-[var(--brass-glow)] border-[var(--brass)] text-[var(--brass)] font-semibold shadow-inner"
                        : "bg-[var(--ink-3)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Risk Toleransı */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                2. Risk Toleransı
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  "Düşük Risk (Defansif)",
                  "Dengeli (Orta Risk)",
                  "Yüksek Risk (Agresif)",
                ].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRisk(r)}
                    className={`p-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      risk === r
                        ? "border-[var(--brass)] bg-[var(--brass-glow)] text-[var(--brass)] font-bold shadow-sm"
                        : "border-[var(--line)] bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Varlık Evreni */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2">
                3. Yatırım Evreni
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  "BIST 30 & Emtia",
                  "Tüm BIST 100",
                  "Kıymetli Maden & Döviz",
                  "Küresel Piyasalar (ABD & BIST)",
                ].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUniverse(u)}
                    className={`p-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      universe === u
                        ? "border-[var(--brass)] bg-[var(--brass-glow)] text-[var(--brass)] font-bold shadow-sm"
                        : "border-[var(--line)] bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)]"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Başlangıç Bütçesi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[var(--mist)]">
                  4. Başlangıç Bütçesi (₺)
                </label>
                <div className="flex items-center gap-1.5">
                  {["25.000", "50.000", "100.000", "250.000", "500.000"].map((bVal) => (
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
              className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-sm py-3.5 rounded shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Orakul Reçeteyi Hesaplanıyor..." : "Orakul Reçetesini Üret"}</span>
            </button>
          </div>

          {result && (
            <div className="mt-8 pt-6 border-t border-[var(--line)] space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--ink-3)] p-5 rounded-lg border border-[var(--brass-dim)]">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brass)]">
                    Üretilen Strateji
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--paper)] mt-0.5">
                    {result.recipeTitle || result.title}
                  </h3>
                  <p className="text-xs text-[var(--mist)] mt-1 font-sans max-w-xl">
                    {result.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block font-mono text-[10px] text-[var(--mist)]">
                      Portföy Sağlık Skoru
                    </span>
                    <span className="font-serif text-xl font-bold text-[var(--verdigris)]">
                      {result.healthScore || "92"}/100
                    </span>
                  </div>
                  <StampBadge verdict="GÜÇLÜ AL" />
                </div>
              </div>

              {/* Allocation List */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs text-[var(--mist)] uppercase tracking-wider">
                  Önerilen Varlık ve Ağırlık Dağılımı
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.allocation?.map((item: any) => (
                    <div
                      key={item.symbol}
                      className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[var(--paper)]">
                            {item.symbol}
                          </span>
                          <span className="text-xs text-[var(--mist)] font-sans">
                            {item.companyName || item.name}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--paper-dim)] font-sans mt-1.5 leading-relaxed">
                          {item.rationale || item.note}
                        </p>
                      </div>
                      <div className="font-mono font-bold text-sm text-[var(--brass)] shrink-0 bg-[var(--brass-glow)] px-2.5 py-1 rounded border border-[var(--brass-dim)]">
                        %{item.weight}
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

      {/* 3. TAB 2: Şirket Teşhisi */}
      {activeTab === "company" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                Derin Şirket Değerleme &amp; Bilanço Teşhisi
              </h2>
              <p className="text-xs font-mono text-[var(--mist)] mt-1">
                Şirket çarpanları, bilanço gücü ve geçmiş analizlerden beslenen geri bildirimli Orakul teşhisi.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <CompanyCombobox
                companies={companies}
                selectedSymbol={selectedCoSymbol}
                onSelect={(co) => setSelectedCoSymbol(co.symbol)}
                label="İncelenecek Şirket / Varlık"
              />
              <button
                onClick={handleCompanyAnalyze}
                disabled={companyLoading}
                className="w-full mt-2 bg-[var(--brass)] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg cursor-pointer disabled:opacity-50 shadow transition-all active:scale-95"
              >
                {companyLoading ? "Teşhis Ediliyor..." : `${selectedCoSymbol} İçin Teşhis Üret`}
              </button>
            </div>
          </div>

          {companyAnalysis && (
            <div className="bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl p-6 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-dashed border-[var(--line)] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-[var(--brass)] bg-[var(--ink-2)] flex items-center justify-center font-mono font-bold text-[var(--brass)]">
                    {companyAnalysis.symbol}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
                      {companyAnalysis.symbol} Orakul Bilanço Raporu
                    </h3>
                    <span className="font-mono text-xs text-[var(--verdigris)] font-semibold">
                      Değerleme Skoru: {companyAnalysis.valuationScore}
                    </span>
                  </div>
                </div>

                <StampBadge verdict={companyAnalysis.verdict || "AL"} />
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[var(--ink-2)] rounded-lg border border-[var(--line)] space-y-1">
                  <span className="font-mono text-xs text-[var(--brass)] font-semibold uppercase">
                    Fiyatı Hareket Ettiren Temel Faktör
                  </span>
                  <p className="text-xs text-[var(--paper)] leading-relaxed">
                    {companyAnalysis.whyMoved}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[rgba(91,140,123,0.05)] border border-[rgba(91,140,123,0.3)] rounded-lg space-y-2">
                    <span className="font-mono text-xs text-[var(--verdigris)] font-bold uppercase flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Güçlü Yönler &amp; Katalizörler</span>
                    </span>
                    <ul className="text-xs text-[var(--paper-dim)] space-y-1 font-mono list-disc list-inside">
                      {companyAnalysis.pros?.map((p: string, idx: number) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[rgba(201,124,124,0.05)] border border-[rgba(201,124,124,0.3)] rounded-lg space-y-2">
                    <span className="font-mono text-xs text-[var(--loss)] font-bold uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Temel Risk Faktörleri</span>
                    </span>
                    <ul className="text-xs text-[var(--paper-dim)] space-y-1 font-mono list-disc list-inside">
                      {companyAnalysis.risks?.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {companyAnalysis.pastFeedbackSummary && (
                  <div className="p-3 bg-[var(--brass-glow)] border border-[var(--brass-dim)] rounded-lg text-xs font-mono text-[var(--paper)]">
                    <span className="text-[var(--brass)] font-bold">Kasa Hafızası: </span>
                    {companyAnalysis.pastFeedbackSummary}
                  </div>
                )}
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
                onSelect={(co) => setEarningsSymbol(co.symbol)}
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
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[var(--paper)] mt-1">
                    {earningsResult.verdict === "ÇOK GÜÇLÜ" || earningsResult.verdict === "GÜÇLÜ" ? "Kâr Beklentilerin Üzerinde, Nakit Akışı Güçlü" : "Operasyonel Kârlılık ve Marjlar Dengeli"}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono text-[10px] uppercase text-[var(--mist)] block">Bilanço Sağlık Puanı</span>
                    <span className="font-mono text-xl font-bold text-[var(--brass)]">{earningsResult.healthScore} / 10</span>
                  </div>
                  <StampBadge verdict={earningsResult.verdict === "ÇOK GÜÇLÜ" || earningsResult.verdict === "GÜÇLÜ" ? "GÜÇLÜ AL" : earningsResult.verdict === "ZAYIF" || earningsResult.verdict === "RİSKLİ" ? "SAT" : "DENGELİ"} />
                </div>
              </div>

              {/* 3 Metrics KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg font-mono">
                  <span className="text-[11px] text-[var(--mist)] uppercase block">Net Kâr Büyümesi</span>
                  <span className="text-base font-bold text-[var(--verdigris)] mt-0.5 block">{earningsResult.netProfitGrowth}</span>
                </div>
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg font-mono">
                  <span className="text-[11px] text-[var(--mist)] uppercase block">FAVÖK Marjı</span>
                  <span className="text-base font-bold text-[var(--paper)] mt-0.5 block">{earningsResult.ebitdaMargin}</span>
                </div>
                <div className="p-3.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg font-mono">
                  <span className="text-[11px] text-[var(--mist)] uppercase block">Borçluluk Durumu</span>
                  <span className="text-base font-bold text-[var(--brass)] mt-0.5 block">{earningsResult.debtStatus}</span>
                </div>
              </div>

              {/* 3-Sentence Summary */}
              <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg space-y-1">
                <span className="font-mono text-xs text-[var(--brass)] font-semibold uppercase">3 Cümlelik Yönetici Özeti</span>
                <p className="text-xs text-[var(--paper)] leading-relaxed font-sans">
                  {earningsResult.summary}
                </p>
              </div>

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
            </div>
          )}
        </section>
      )}

      {/* 5. TAB 4: ⚠️ Orakul "Tuzak & Anomali Radarı" (Value Trap Detector) */}
      {activeTab === "trap" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--loss)] uppercase font-semibold mb-1">
                <AlertOctagon className="w-4 h-4" />
                <span>Value Trap &amp; Forensic Radar</span>
              </div>
              <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
                Değer Tuzağı &amp; Anomali Radarı
              </h2>
              <p className="text-xs font-mono text-[var(--mist)] mt-1">
                Kağıt üzerinde ucuz görünen (düşük F/K) hisselerin arkasındaki tek seferlik arsa satışlarını ve borç tuzaklarını deşifre edin.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <CompanyCombobox
                companies={companies}
                selectedSymbol={trapSymbol}
                onSelect={(co) => setTrapSymbol(co.symbol)}
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
                <option>Temettü Kalesi Reçetesi (FROTO, TUPRS, EREGL, BIMAS)</option>
                <option>Enflasyon &amp; Kur Kalkanı (Gram Altın, THYAO, ASELS, KCHOL)</option>
                <option>Büyüme &amp; İhracat Şampiyonları (THYAO, FROTO, ASELS, PGSUS)</option>
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
              {/* 3 Outcome Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[var(--ink-3)] border border-[var(--brass)] rounded-xl relative overflow-hidden">
                  <span className="font-mono text-[10px] uppercase text-[var(--brass)] tracking-wider">
                    Orakul Portföyü
                  </span>
                  <div className="font-serif text-3xl font-bold text-[var(--paper)] mt-1">
                    {backtestResult.finalPortfolioValue.toLocaleString("tr-TR")} ₺
                  </div>
                  <div className="font-mono text-xs text-[var(--verdigris)] font-bold mt-1">
                    +%{backtestResult.portfolioReturnPct} Getiri
                  </div>
                </div>

                <div className="p-5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl">
                  <span className="font-mono text-[10px] uppercase text-[var(--mist)] tracking-wider">
                    BIST 100 Endeksi
                  </span>
                  <div className="font-serif text-3xl font-bold text-[var(--paper-dim)] mt-1">
                    {backtestResult.finalBist100Value.toLocaleString("tr-TR")} ₺
                  </div>
                  <div className="font-mono text-xs text-[var(--mist)] mt-1">
                    +%{backtestResult.bist100ReturnPct} Getiri
                  </div>
                </div>

                <div className="p-5 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl">
                  <span className="font-mono text-[10px] uppercase text-[var(--mist)] tracking-wider">
                    Gram Altın Kıyası
                  </span>
                  <div className="font-serif text-3xl font-bold text-[var(--paper-dim)] mt-1">
                    {backtestResult.finalGoldValue.toLocaleString("tr-TR")} ₺
                  </div>
                  <div className="font-mono text-xs text-[var(--mist)] mt-1">
                    +%{backtestResult.goldReturnPct} Getiri
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
                  {backtestResult.timeline.map((point: any, idx: number) => (
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

              <button
                onClick={() => handleRunScreener()}
                disabled={screenerLoading}
                className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-6 py-3 rounded-lg shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{screenerLoading ? "Taranıyor..." : "Kütüğü Tara"}</span>
              </button>
            </div>

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
                {screenerResult.picks.map((pick: any) => (
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

                    <a
                      href={`/sirketler/${pick.symbol}`}
                      className="text-xs font-mono text-[var(--brass)] hover:text-[var(--paper)] flex items-center gap-1.5 transition-colors pt-2 border-t border-[var(--line)]"
                    >
                      <span>Şirket Kütüğünü Aç</span>
                    </a>
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
                  <div className="p-2.5 bg-[var(--ink-2)] border border-[rgba(91,140,123,0.3)] rounded-lg text-right">
                    <span className="block font-mono text-[9px] text-[var(--mist)] uppercase">
                      Portföy Günlük
                    </span>
                    <span className="font-mono text-base font-bold text-[var(--verdigris)]">
                      +%{briefingResult.portfolioDayChangePct}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg text-right">
                    <span className="block font-mono text-[9px] text-[var(--mist)] uppercase">
                      BIST 100
                    </span>
                    <span className="font-mono text-base font-bold text-[var(--paper-dim)]">
                      +%{briefingResult.bistDayChangePct}
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

      {/* 9. TAB 8: Haber & KAP Duygu Analizi */}
      {activeTab === "sentiment" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4">
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              Piyasa &amp; KAP Haberleri Duygu Puanı (Sentiment)
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              Yapay zeka doğal dil işleme modeli ile haber başlıklarının pozitif/negatif duyarlılık skorlaması.
            </p>
          </div>

          <div className="divide-y divide-dashed divide-[var(--line)] border border-[var(--line)] rounded-lg bg-[var(--ink-3)]">
            {[
              {
                symbol: "THYAO",
                headline: "THY, Ağustos ayında toplam yolcu sayısını %9.4 artırarak rekor tazeledi.",
                score: "+0.84 (Güçlü Pozitif)",
                time: "2 saat önce",
                sentiment: "positive",
              },
              {
                symbol: "FROTO",
                headline: "Ford Otosan Craiova tesisinde yeni elektrikli Courier üretimi hız kazandı.",
                score: "+0.72 (Pozitif)",
                time: "5 saat önce",
                sentiment: "positive",
              },
              {
                symbol: "EREGL",
                headline: "Küresel çelik talebinde yavaşlama fiyat marjları üzerinde baskı yaratıyor.",
                score: "-0.45 (Ilımlı Negatif)",
                time: "Dün",
                sentiment: "negative",
              },
              {
                symbol: "ASELS",
                headline: "Aselsan, uluslararası bir müşteriyle 48 milyon dolarlık radar sözleşmesi imzaladı.",
                score: "+0.91 (Güçlü Pozitif)",
                time: "2 gün önce",
                sentiment: "positive",
              },
            ].map((news, idx) => (
              <div key={idx} className="p-4 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1 font-mono">
                    <span className="font-bold text-[var(--brass)]">{news.symbol}</span>
                    <span className="text-[var(--mist)]">• {news.time}</span>
                  </div>
                  <p className="text-[var(--paper)] font-sans text-sm">{news.headline}</p>
                </div>

                <span
                  className={`font-mono text-xs px-2.5 py-1 rounded border font-bold shrink-0 ${
                    news.sentiment === "positive"
                      ? "text-[var(--verdigris)] border-[var(--verdigris)] bg-[rgba(91,140,123,0.12)]"
                      : "text-[var(--loss)] border-[var(--loss)] bg-[rgba(122,46,58,0.15)]"
                  }`}
                >
                  {news.score}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. TAB 9: Anomali & Risk Tespiti */}
      {activeTab === "anomaly" && (
        <section className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[var(--line)] pb-4">
            <h2 className="font-serif text-2xl text-[var(--paper)] font-medium">
              Portföy Risk &amp; Anomali Tespiti
            </h2>
            <p className="text-xs font-mono text-[var(--mist)] mt-1">
              Hacim sapması, aşırı konsantrasyon ve makro korelasyon anomalileri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--ink-3)] border border-[rgba(201,162,75,0.3)] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--brass)] font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Yoğunlaşma Uyarısı</span>
              </div>
              <p className="text-xs text-[var(--paper-dim)]">
                BIST Temettü Kalesi sepetinizde <strong>FROTO</strong> payı %35 sınırına ulaşmıştır. Portföy oynaklığını dengelemek için kâr realizasyonu önerilir.
              </p>
            </div>

            <div className="p-4 bg-[var(--ink-3)] border border-[rgba(91,140,123,0.3)] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--verdigris)] font-bold">
                <Shield className="w-4 h-4" />
                <span>Likidite ve Kur Kalkanı</span>
              </div>
              <p className="text-xs text-[var(--paper-dim)]">
                Altın ve döviz bazlı varlıklarınız toplam portföyün %28&apos;ini oluşturmaktadır. Bu oran olası kur şoklarına karşı güvenli bir koruma marjı sağlar.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. ORAKUL BAŞARI KARNESİ (ACCURACY TRACKER) */}
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
            <span className="text-[10px] font-mono text-[var(--mist)]">Ters Hareket</span>
          </div>

          <div className="p-4 bg-[var(--ink-3)] border border-[rgba(201,162,75,0.3)] rounded-lg col-span-2 sm:col-span-1">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--mist)]">
              Takip Sürecinde
            </span>
            <div className="font-serif text-2xl font-bold text-[var(--brass)] mt-1 flex items-center gap-1.5">
              <Clock className="w-5 h-5" />
              <span>{aiAccuracyStats.pending}</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--mist)]">Piyasa İzleniyor</span>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: "all", label: `Tümü (${aiHistory.length})` },
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

        {/* Table of Decisions with Verified Outcomes */}
        <div className="bg-[var(--ink-3)] border border-[var(--line)] rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-[100px_1.2fr_1.8fr_140px_130px] gap-4 px-6 py-3 border-b border-[var(--line)] bg-[var(--ink)] font-mono text-[11px] uppercase tracking-wider text-[var(--mist)]">
            <span>Tarih</span>
            <span>Varlık &amp; Tür</span>
            <span>Özet &amp; İçerik</span>
            <span className="text-center">Fiyat Takibi</span>
            <span className="text-right">İsabet Durumu</span>
          </div>

          <div className="divide-y divide-dashed divide-[var(--line)]">
            {filteredAiHistory.map((h) => {
              const co = companies.find((c) => c.symbol === h.symbol);
              const currentPrice = co ? co.price : h.priceAfterPeriod;

              return (
                <div
                  key={h.id}
                  className="grid grid-cols-1 md:grid-cols-[100px_1.2fr_1.8fr_140px_130px] gap-3 md:gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[rgba(201,162,75,0.03)]"
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

                  <div className="text-xs text-[var(--mist)] line-clamp-2">
                    {h.description}
                  </div>

                  <div className="text-left md:text-center font-mono text-xs">
                    {h.priceAtVerdict ? (
                      <div>
                        <span className="text-[var(--mist)]">{h.priceAtVerdict.toFixed(2)} ₺</span>
                        <span className="mx-1 text-[var(--brass)]">→</span>
                        <span className="font-bold text-[var(--paper)]">
                          {currentPrice ? `${currentPrice.toFixed(2)} ₺` : "—"}
                        </span>
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
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
