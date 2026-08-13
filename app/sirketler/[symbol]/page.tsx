"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import StampBadge from "@/components/StampBadge";
import DataStatusBadge from "@/components/DataStatusBadge";
import TransactionModal from "@/components/TransactionModal";
import ShareCardModal from "@/components/ShareCardModal";
import { isLiveSymbol } from "@/lib/liveSymbols";

interface CompanyDiagnosisReport {
  valuationScore?: number | string;
  verdict?: string;
  whyMoved?: string;
  pros?: string[];
  risks?: string[];
}

export default function SirketDetayPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params.symbol as string)?.toUpperCase();

  const {
    companies,
    toggleWatchlist,
    companyNotes,
    addNote,
    deleteNote,
    transactions,
    aiProvider,
    aiApiKey,
  } = useDefterStore();

  const company =
    companies.find((c) => c.symbol.toUpperCase() === symbol);

  const [newNote, setNewNote] = useState("");
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [aiReport, setAiReport] = useState<CompanyDiagnosisReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

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
          apiKey: aiApiKey || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data.data);
      }
    } catch (e) {
      console.warn("AI analysis error:", e);
    } finally {
      setAiLoading(false);
    }
  };

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

        <div className="flex items-center gap-3">
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
              company.dailyChange >= 0
                ? "text-[var(--verdigris)]"
                : "text-[var(--loss)]"
            }`}
          >
            {company.dailyChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {company.dailyChange >= 0 ? "+" : ""}
              {company.dailyChange}% Bugün
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Chart, Metrics, AI Deep Dive & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Trend Chart Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)]">
                Fiyat Eğrisi &amp; Hacim Takibi
              </h3>
              <div className="flex gap-1.5 font-mono text-[11px]">
                {["1A", "3A", "6A", "1Y"].map((period) => (
                  <span
                    key={period}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      period === "6A"
                        ? "bg-[var(--brass)] text-[var(--ink)] font-bold"
                        : "text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-3)]"
                    }`}
                  >
                    {period}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-44 w-full relative flex items-end pt-6 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                <defs>
                  <linearGradient id="grad-line" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,90 Q80,70 160,75 T320,40 T500,15 L500,120 L0,120 Z"
                  fill="url(#grad-line)"
                />
                <path
                  d="M0,90 Q80,70 160,75 T320,40 T500,15"
                  fill="none"
                  stroke="#C9A24B"
                  strokeWidth="2.5"
                />
                <circle cx="0" cy="90" r="4" fill="#C9A24B" />
                <circle cx="160" cy="75" r="4" fill="#C9A24B" />
                <circle cx="320" cy="40" r="4" fill="#C9A24B" />
                <circle cx="500" cy="15" r="5" fill="#5B8C7B" />
              </svg>
            </div>
            <div className="flex justify-between font-mono text-[11px] text-[var(--mist)] pt-2 border-t border-dashed border-[var(--line)]">
              <span>Ocak</span>
              <span>Şubat</span>
              <span>Mart</span>
              <span>Nisan</span>
              <span>Mayıs</span>
              <span className="text-[var(--brass)] font-semibold">Haziran (Son)</span>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--brass)] mb-4">
              Finansal Kütük Değerleri &amp; Çarpanlar
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  F/K Oranı
                </span>
                <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1">
                  {company.peRatio ? `${company.peRatio}x` : "-"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Sektör: 7.2x</span>
              </div>

              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  PD / DD
                </span>
                <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1">
                  {company.pbRatio ? `${company.pbRatio}x` : "-"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Sektör: 1.4x</span>
              </div>

              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Temettü Verimi
                </span>
                <div className="font-mono text-lg font-bold text-[var(--verdigris)] mt-1">
                  {company.dividendYield ? `%${company.dividendYield}` : "-"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Yıllık Dağıtım</span>
              </div>

              <div className="bg-[var(--ink-3)] p-3.5 rounded border border-[var(--line)]">
                <span className="text-[11px] font-mono text-[var(--mist)] uppercase">
                  Piyasa Değeri
                </span>
                <div className="font-mono text-lg font-bold text-[var(--paper)] mt-1">
                  {company.marketCap || "453 Mr ₺"}
                </div>
                <span className="text-[10px] text-[var(--mist)]">Beta: {company.beta !== undefined ? company.beta : "-"}</span>
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
                className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiLoading ? "İnceleniyor..." : "Teşhis Raporu Üret"}</span>
              </button>
            </div>

            {aiReport ? (
              <div className="bg-[var(--ink-3)] p-4 rounded-lg space-y-3 font-sans text-xs border border-[var(--line)] animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono border-b border-dashed border-[var(--line)] pb-2">
                  <span className="text-[var(--brass)] font-bold">
                    Değerleme Puanı: {aiReport.valuationScore}
                  </span>
                  <span className="text-[var(--verdigris)] font-bold">
                    Karar: {aiReport.verdict}
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
              <p className="text-xs text-[var(--mist)] font-sans">
                Orakul yapay zekasını çalıştırarak bilançodaki gizli avantajları, &quot;Neden Düştü / Yükseldi?&quot; sebeplerini ve risk faktörlerini tek tıkla analiz edebilirsiniz.
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
                className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1"
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
              <div className="divide-y divide-dashed divide-[var(--line)] border border-[var(--line)] rounded bg-[var(--ink-3)]">
                {companyTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span
                        className={`font-bold mr-2 ${
                          tx.type === "BUY"
                            ? "text-[var(--verdigris)]"
                            : "text-[var(--loss)]"
                        }`}
                      >
                        {tx.type === "BUY" ? "ALIŞ" : "SATIŞ"}
                      </span>
                      <span className="text-[var(--paper)]">
                        {tx.quantity} Lot @ {tx.price.toFixed(2)} {company.currency}
                      </span>
                      {tx.note && (
                        <div className="text-[11px] text-[var(--mist)] font-sans mt-0.5">
                          {tx.note}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-[var(--paper)]">
                        {tx.totalAmount.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {company.currency}
                      </div>
                      <span className="text-[10px] text-[var(--mist)]">{tx.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Orakul Notes & Personal Notes */}
        <div className="space-y-6">
          {/* Orakul AI Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl p-5 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[var(--brass)]" />
              <h3 className="font-serif font-semibold text-base text-[var(--paper)]">
                Orakul Şirket Yorumu
              </h3>
            </div>
            <p className="text-xs text-[var(--paper)] leading-relaxed font-sans">
              {company.description ||
                "Güçlü bilanço yapısı ve döviz bazlı nakit akımı ile piyasa dalgalanmalarına karşı defansif bir yapı sergilemektedir."}
            </p>
            <div className="mt-4 pt-3 border-t border-dashed border-[var(--line)] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[var(--mist)]">Değerleme Puanı</span>
              <span className="text-[var(--brass)] font-bold">9.2 / 10</span>
            </div>
          </div>

          {/* Personal Notes Card */}
          <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--brass)]" />
              <h3 className="font-serif font-semibold text-base text-[var(--paper)]">
                Kişisel Notlarım ({notes.length})
              </h3>
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Şirkete özel not yaz..."
                className="flex-1 bg-[var(--ink-3)] border border-[var(--line)] rounded px-3 py-2 text-xs text-[var(--paper)] focus:border-[var(--brass)] outline-none"
              />
              <button
                type="submit"
                className="bg-[var(--brass)] text-[var(--ink)] px-3 py-2 rounded text-xs font-bold hover:bg-[#d9b35a] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-xs text-[var(--mist)] font-mono py-2 text-center">
                  Henüz bir not eklenmedi.
                </p>
              ) : (
                notes.map((n, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--ink-3)] border border-[var(--line)] p-2.5 rounded text-xs text-[var(--paper-dim)] leading-relaxed flex items-start justify-between gap-2 group"
                  >
                    <span>{n}</span>
                    <button
                      onClick={() => deleteNote(company.symbol, idx)}
                      className="text-[var(--mist)] hover:text-[var(--loss)] opacity-60 hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                      title="Notu Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        symbol={company.symbol}
        defaultPrice={company.price}
        currency={company.currency}
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
      />

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={`${company.symbol} — ${company.name}`}
        subtitle={`${company.exchange} • ${company.sector}`}
        type="company"
        data={{
          primaryLabel: "Birim Fiyat",
          primaryMetric: `${company.price.toFixed(2)} ${company.currency}`,
          secondaryLabel: "Günlük Değişim",
          secondaryMetric: `${company.dailyChange >= 0 ? "+" : ""}${company.dailyChange}%`,
          tags: [
            company.indexTag || "BIST",
            `F/K: ${company.peRatio || "-"}`,
            `Temettü: %${company.dividendYield || "0"}`,
          ],
          note: company.description,
          verdict: company.recommendation,
        }}
      />
    </div>
  );
}
