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
} from "lucide-react";
import OracleSeal from "@/components/OracleSeal";
import StampBadge from "@/components/StampBadge";
import { useDefterStore } from "@/lib/store";
import { AiHistoryItem, Basket } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";

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
    createBasket,
  } = useDefterStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"wizard" | "company" | "sentiment" | "anomaly" | "portfolio">("wizard");

  // Wizard state
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

  // Company Deep-Dive state
  const [selectedCoSymbol, setSelectedCoSymbol] = useState(companies[0]?.symbol || "THYAO");
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysisResult | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);

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
          },
          provider: aiProvider,
          apiKey: aiApiKey || undefined,
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
        <div className="flex flex-wrap gap-2 mt-8 p-1 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg">
          {[
            { id: "wizard", label: "Sepet Sihirbazı", icon: Compass },
            { id: "company", label: "Derin Şirket Analizi", icon: Activity },
            { id: "sentiment", label: "Haber & Duygu Skoru", icon: Newspaper },
            { id: "anomaly", label: "Anomali & Risk Tespiti", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "portfolio" | "company" | "sentiment" | "anomaly")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                    : "text-[var(--mist)] hover:text-[var(--paper)]"
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
                    className={`text-xs px-4 py-2 rounded-full border transition-all cursor-pointer font-medium ${
                      goal === opt
                        ? "bg-[var(--brass)] text-[var(--ink)] border-[var(--brass)] font-semibold shadow-md"
                        : "border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-2.5">
                2. Risk Toleransı
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Düşük (Muhafazakar)",
                  "Dengeli (Orta Risk)",
                  "Yüksek Getiri (Volatil)",
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRisk(opt)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all cursor-pointer font-medium ${
                      risk === opt
                        ? "bg-[var(--brass)] text-[var(--ink)] border-[var(--brass)] font-semibold shadow-md"
                        : "border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-1.5">
                  3. Yatırım Evreni
                </label>
                <select
                  value={universe}
                  onChange={(e) => setUniverse(e.target.value)}
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
                >
                  <option value="BIST 30 & Emtia">BIST 30 &amp; Kıymetli Madenler</option>
                  <option value="BIST 100 Tüm Hisseler">BIST 100 Tüm Şirketler</option>
                  <option value="Küresel Teknoloji (ABD/NASDAQ)">Küresel Teknoloji (ABD/NASDAQ)</option>
                  <option value="Karma (BIST + ABD + Maden)">Karma Evren (BIST + ABD + Emtia)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--mist)] mb-1.5">
                  4. Başlangıç Bütçesi (₺)
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="100.000"
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded p-2.5 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateRecipe}
              disabled={loading}
              className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-semibold text-sm py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="font-mono text-xs">Orakul Reçeteyi Hazırlıyor...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Optimizasyon Reçetesi Üret</span>
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-8 pt-8 border-t border-[var(--line)] space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--ink-3)] p-4 rounded-lg border border-[var(--brass-dim)]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[var(--paper)]">
                    {result.title}
                  </h3>
                  <p className="text-xs text-[var(--mist)] mt-1">{result.summary}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="block font-mono text-[10px] text-[var(--mist)] uppercase">
                      Portföy Sağlığı
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--verdigris)]">
                      {result.healthScore} / 100
                    </span>
                  </div>

                  <div className="text-right pl-3 border-l border-[var(--line)]">
                    <span className="block font-mono text-[10px] text-[var(--mist)] uppercase">
                      Beklenen Verim
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--brass)]">
                      {result.expectedYield}
                    </span>
                  </div>
                </div>
              </div>

              {/* Allocation List */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--mist)]">
                  Varlık Dağılım Matrisi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(result.allocation || []).map((item, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-[var(--ink-3)] border border-[var(--line)] rounded-md flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[var(--ink-2)] border border-[var(--brass-dim)] flex items-center justify-center font-mono font-bold text-xs text-[var(--brass)]">
                          {item.symbol}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[var(--paper)]">
                            {item.companyName || item.name || item.symbol}
                          </div>
                          <div className="text-[11px] text-[var(--mist)] line-clamp-1">
                            {item.rationale || item.note || ""}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold text-[var(--verdigris)]">
                        %{item.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  onClick={handleSaveToBaskets}
                  disabled={savedSuccess}
                  className="bg-[var(--ink-3)] hover:bg-[var(--ink)] border border-[var(--brass)] text-[var(--brass)] px-4 py-2 rounded text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-[var(--verdigris)]" />
                      <span>Sepetlerime Kaydedildi!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Bu Reçeteyi Sepet Yap</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. TAB 2: Derin Şirket Analizi */}
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCoSymbol}
                onChange={(e) => setSelectedCoSymbol(e.target.value)}
                className="bg-[var(--ink-3)] border border-[var(--line)] text-xs text-[var(--paper)] rounded p-2 font-mono outline-none"
              >
                {companies.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.symbol} — {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCompanyAnalyze}
                disabled={companyLoading}
                className="bg-[var(--brass)] text-[var(--ink)] font-bold text-xs px-4 py-2 rounded cursor-pointer disabled:opacity-50"
              >
                {companyLoading ? "Teşhis Ediliyor..." : "Teşhis Et"}
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

                <StampBadge verdict={(companyAnalysis as Record<string, unknown>).verdict as "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ"} />
              </div>

              {/* Feedback Loop Context Banner */}
              {companyAnalysis.pastFeedbackSummary && (
                <div className="p-3 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-lg flex items-start gap-2.5 text-xs text-[var(--paper-dim)]">
                  <Brain className="w-4 h-4 text-[var(--brass)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brass)] block font-bold mb-0.5">
                      Geri Besleme Modeli (Feedback Loop)
                    </span>
                    <span>{companyAnalysis.pastFeedbackSummary}</span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-mono text-xs text-[var(--brass)] uppercase mb-1">
                  Son Fiyat Hareketi ve Dinamikler
                </h4>
                <p className="text-xs text-[var(--paper-dim)] leading-relaxed font-sans">
                  {companyAnalysis.whyMoved}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[var(--ink-2)] rounded border border-[rgba(91,140,123,0.3)]">
                  <h5 className="font-mono text-xs text-[var(--verdigris)] font-semibold mb-2">
                    Güçlü Yönler (Pros)
                  </h5>
                  <ul className="text-xs space-y-1 text-[var(--paper-dim)]">
                    {(companyAnalysis.pros || []).map((p: string, i: number) => (
                      <li key={i}>✓ {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-[var(--ink-2)] rounded border border-[rgba(122,46,58,0.3)]">
                  <h5 className="font-mono text-xs text-[var(--loss)] font-semibold mb-2">
                    Risk Faktörleri (Risks)
                  </h5>
                  <ul className="text-xs space-y-1 text-[var(--paper-dim)]">
                    {(companyAnalysis.risks || []).map((r: string, i: number) => (
                      <li key={i}>✕ {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. TAB 3: Haber & KAP Duygu Analizi */}
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

      {/* 5. TAB 4: Anomali & Risk Tespiti */}
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
