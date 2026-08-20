"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Scale,
  DollarSign,
} from "lucide-react";
import { AutonomousScan } from "@/lib/mockData";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface Props {
  onAddHoldingToBasket?: (symbol: string) => void;
}

type ScanTabType = "ALL" | "AL" | "DIP" | "TEMETTU" | "HACIM" | "SAT";

export function AutonomousScanFeed({ onAddHoldingToBasket }: Props) {
  const {
    autonomousScans,
    addAutonomousScan,
    clearAutonomousScans,
    evaluateAutonomousScans,
    companies,
    baskets,
    addHoldingToBasket,
    aiApiKey,
  } = useDefterStore();
  const { showToast } = useToast();

  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState<number>(10);
  const [isAutoPilot, setIsAutoPilot] = useState(true); // Varsayılan olarak açık
  const [activeTab, setActiveTab] = useState<ScanTabType>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 6 : 10;

  const [lotModalScan, setLotModalScan] = useState<AutonomousScan | null>(null);
  const [budgetInput, setBudgetInput] = useState<string>("50000");
  const [targetBasketId, setTargetBasketId] = useState<string>("");

  // Canlı Geri Sayım (Oto-Pilot 5 dakika)
  const [countdown, setCountdown] = useState<number>(300);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const isAutoScanningRef = useRef(false);

  const helperBadges = (scan: AutonomousScan) => {
    const badges: Array<{ label: string; icon: string; style: string }> = [];
    const co = companies.find((c) => c.symbol.toUpperCase() === scan.symbol.toUpperCase());
    const pe = scan.peRatio || co?.peRatio || 10;
    const div = scan.dividendYield || co?.dividendYield || 0;
    const volumeRatio = co?.volumeRatio || 1.0;

    if (pe < 8 && scan.verdict.includes("AL")) {
      badges.push({ label: `🎯 Dip Avcısı (F/K ${pe.toFixed(1)})`, icon: "🎯", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" });
    }
    if (div >= 4.0) {
      badges.push({ label: `🛡️ Temettü Kalkanı (%${div.toFixed(1)})`, icon: "🛡️", style: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" });
    }
    if (volumeRatio > 1.3 || (co?.dailyChange || 0) > 2.5) {
      badges.push({ label: "🔥 Hacim & Momentum", icon: "🔥", style: "bg-amber-500/10 text-amber-400 border-amber-500/30" });
    }
    if (scan.verdict === "GÜÇLÜ AL") {
      badges.push({ label: "⚡ Çift Katalizör", icon: "⚡", style: "bg-purple-500/10 text-purple-400 border-purple-500/30" });
    }
    return badges;
  };

  const handleRunManualScan = async (count = scanCount, isSilent = false) => {
    if (isScanning || isAutoScanningRef.current) return;
    isAutoScanningRef.current = true;
    setIsScanning(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (aiApiKey) {
        headers["x-gemini-key"] = aiApiKey;
      }

      const res = await fetch("/api/ai-tools/autonomous-scan", {
        method: "POST",
        headers,
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.scans)) {
        data.scans.forEach((scan: AutonomousScan) => {
          addAutonomousScan(scan);
        });
        setLastScanTime(new Date());
        setCountdown(300); // Sayacı sıfırla

        if (!isSilent) {
          showToast(
            "Otonom Tarama Tamamlandı",
            `${data.scans.length} şirket nicel ve temel AI motoruyla analiz edildi.`,
            "success"
          );
        }
      } else {
        throw new Error(data.error || "Tarama başarısız");
      }
    } catch (err: unknown) {
      if (!isSilent) {
        showToast("Tarama Hatası", (err instanceof Error ? err.message : String(err)) || "Bağlantı sağlanamadı", "error");
      }
    } finally {
      setIsScanning(false);
      isAutoScanningRef.current = false;
    }
  };

  // 1. Auto-Seed on Mount: Eğer tarama yoksa otomatik başlat
  useEffect(() => {
    if (autonomousScans.length === 0) {
      handleRunManualScan(8, true);
    }
  }, []);

  // 2. Canlı Geri Sayım & Oto-Pilot Periyodik Tetikleyici
  useEffect(() => {
    if (!isAutoPilot) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRunManualScan(5, true);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPilot, aiApiKey]);

  // Filtreleme Mantığı
  const filteredScans = useMemo(() => {
    return autonomousScans.filter((scan) => {
      const badges = helperBadges(scan);
      let matchesTab = true;

      if (activeTab === "AL") {
        matchesTab = scan.verdict.includes("AL");
      } else if (activeTab === "DIP") {
        matchesTab = badges.some((b) => b.label.includes("Dip Avcısı")) || (scan.peRatio || 15) < 8;
      } else if (activeTab === "TEMETTU") {
        matchesTab = badges.some((b) => b.label.includes("Temettü Kalkanı")) || (scan.dividendYield || 0) >= 4;
      } else if (activeTab === "HACIM") {
        matchesTab = badges.some((b) => b.label.includes("Hacim & Momentum"));
      } else if (activeTab === "SAT") {
        matchesTab = scan.verdict.includes("SAT") || scan.verdict.includes("NÖTR");
      }

      const matchesSearch =
        scan.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.sector.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [autonomousScans, activeTab, searchTerm, companies]);

  // Sayfalama (Pagination)
  const totalPages = Math.max(1, Math.ceil(filteredScans.length / itemsPerPage));
  const paginatedScans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredScans.slice(start, start + itemsPerPage);
  }, [filteredScans, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, viewMode]);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getVerdictStyle = (v: string) => {
    if (v.includes("GÜÇLÜ AL")) {
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
    if (v.includes("AL")) {
      return "bg-teal-500/20 text-teal-300 border-teal-500/40";
    }
    if (v.includes("SAT")) {
      return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    }
    return "bg-amber-500/20 text-amber-300 border-amber-500/40";
  };

  return (
    <div className="space-y-5">
      {/* 1. Üst Kontrol & Oto-Pilot İstihbarat Banner'ı */}
      <div className="p-5 rounded-2xl bg-[var(--ink-2)] border border-[var(--brass-dim)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--brass)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/30">
                <Brain className="w-3.5 h-3.5" />
                7/24 Otonom Quant &amp; AI İstihbaratı
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isAutoPilot ? `Oto-Pilot Aktif (${formatCountdown(countdown)})` : "Oto-Pilot Durduruldu"}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--paper)] mt-2">
              Otonom Şirket Keşif &amp; Değerleme Radarı
            </h2>
            <p className="text-xs text-[var(--mist)] mt-1 max-w-2xl leading-relaxed">
              Borsa İstanbul kütüğünü arka planda kesintisiz tarar, F/K, PD/DD, ROE, ATH iskonto ve momentum katalizörlerini filtreleyerek hedef fiyatlı teşhisler üretir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto">
            {/* Oto-Pilot Düğmesi */}
            <button
              type="button"
              onClick={() => {
                const next = !isAutoPilot;
                setIsAutoPilot(next);
                showToast(
                  next ? "Oto-Pilot Aktif Edildi" : "Oto-Pilot Durduruldu",
                  next
                    ? "Arka planda her 5 dakikada bir otomatik yeni şirketler taranacaktır."
                    : "Otomatik periyodik tarama durduruldu.",
                  next ? "success" : "info"
                );
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                isAutoPilot
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs"
                  : "bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)] border-[var(--line)]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAutoPilot ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
              <span>{isAutoPilot ? `Oto-Pilot (${formatCountdown(countdown)})` : "Oto-Pilot: Kapalı"}</span>
            </button>

            {/* Manuel Tarama Butonu */}
            <button
              onClick={() => handleRunManualScan(scanCount)}
              disabled={isScanning}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--brass)] to-[#d9b35a] text-zinc-950 font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Taranıyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Şimdi {scanCount} Şirket Tara</span>
                </>
              )}
            </button>

            {/* Değerlendir & Fiyat Kontrol Butonu */}
            {autonomousScans.length > 0 && (
              <button
                onClick={() => {
                  evaluateAutonomousScans();
                  showToast("Fiyatlar Güncellendi", "Otonom taramaların getiri durumları kontrol edildi.", "info");
                }}
                className="p-2 rounded-xl bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)] text-xs transition-colors cursor-pointer"
                title="Getirileri Kontrol Et"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* İstatistik Çubuğu */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--line)]">
          <div className="p-2.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-[var(--mist)]">Kütükteki Tarama</span>
            <div className="text-base font-mono font-bold text-[var(--paper)] mt-0.5">
              {autonomousScans.length} Analiz
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-emerald-400">AL Tavsiyeleri</span>
            <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
              {autonomousScans.filter((s) => s.verdict.includes("AL")).length} Şirket
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-cyan-400">Temettü Kalkanı</span>
            <div className="text-base font-mono font-bold text-cyan-400 mt-0.5">
              {autonomousScans.filter((s) => (s.dividendYield || 0) >= 4).length} Varlık
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-[var(--brass)]">Ortalama Güven</span>
            <div className="text-base font-mono font-bold text-[var(--brass)] mt-0.5">
              %{autonomousScans.length > 0
                ? Math.round(
                    autonomousScans.reduce((acc, s) => acc + parseInt(s.confidence.replace("%", "") || "80", 10), 0) /
                      autonomousScans.length
                  )
                : 84}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Strateji Sekmeleri & Görünüm Modu */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        {/* Sekmeler */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "Tümü", count: autonomousScans.length },
            { id: "AL", label: "🔥 Fırsatlar (AL)", count: autonomousScans.filter((s) => s.verdict.includes("AL")).length },
            { id: "DIP", label: "🎯 Dip Avcısı", count: autonomousScans.filter((s) => (s.peRatio || 15) < 8).length },
            { id: "TEMETTU", label: "🛡️ Temettü", count: autonomousScans.filter((s) => (s.dividendYield || 0) >= 4).length },
            { id: "HACIM", label: "⚡ Momentum", count: autonomousScans.filter((s) => helperBadges(s).some((b) => b.label.includes("Hacim"))).length },
            { id: "SAT", label: "⚠️ Riskli", count: autonomousScans.filter((s) => s.verdict.includes("SAT")).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ScanTabType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-[var(--brass)] text-zinc-950 font-bold shadow-xs"
                  : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-bold">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Arama & Görünüm Değiştirici */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mist)]" />
            <input
              type="text"
              placeholder="Kod, şirket veya sektör..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] text-xs text-[var(--paper)] placeholder-[var(--mist)]/60 focus:outline-none focus:border-[var(--brass)]"
            />
          </div>

          <div className="flex items-center bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-[var(--brass)] text-zinc-950 shadow-xs" : "text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
              title="Kart Grid Görünümü"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "table" ? "bg-[var(--brass)] text-zinc-950 shadow-xs" : "text-[var(--mist)] hover:text-[var(--paper)]"
              }`}
              title="Kompakt Tablo Görünümü"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {autonomousScans.length > 0 && (
            <button
              onClick={clearAutonomousScans}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer shrink-0"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* 3. Taramalar Listesi / Grid / Tablo */}
      {filteredScans.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--ink-2)] border border-dashed border-[var(--line)] space-y-3">
          <Brain className="w-10 h-10 text-[var(--brass)]/40 mx-auto" />
          <h3 className="text-base font-serif font-bold text-[var(--paper)]">
            Seçilen Kriterde Otonom Tarama Bulunamadı
          </h3>
          <p className="text-xs text-[var(--mist)] max-w-sm mx-auto">
            Yapay zekanın kütüğü taraması için &quot;Şimdi Şirket Tara&quot; butonuna basabilir veya filtreleri sıfırlayabilirsiniz.
          </p>
          <button
            onClick={() => handleRunManualScan(10)}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brass)] text-zinc-950 font-bold text-xs shadow hover:brightness-110 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Yeni Tarama Başlat
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* KART GRID GÖRÜNÜMÜ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedScans.map((scan) => {
            const co = companies.find((c) => c.symbol.toUpperCase() === scan.symbol.toUpperCase());
            const curPrice = co?.price || scan.priceAtScan;
            const liveReturn = parseFloat((((curPrice - scan.priceAtScan) / scan.priceAtScan) * 100).toFixed(2));
            const upside = scan.targetPrice
              ? parseFloat((((scan.targetPrice - curPrice) / curPrice) * 100).toFixed(1))
              : null;
            const pe = scan.peRatio || co?.peRatio || 8.5;
            const div = scan.dividendYield || co?.dividendYield || 0;

            return (
              <div
                key={scan.id}
                className="p-4 rounded-xl bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--brass-dim)] transition-all flex flex-col justify-between space-y-3 shadow-md group relative"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[var(--line)]/50 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[var(--paper)]">
                          {scan.symbol}
                        </span>
                        <span className="text-[11px] text-[var(--mist)] truncate max-w-[140px]">
                          {scan.companyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--mist)] mt-0.5">
                        <span className="text-[var(--brass)] font-medium">{scan.sector}</span>
                        <span>•</span>
                        <span>{new Date(scan.scannedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${getVerdictStyle(scan.verdict)}`}>
                        {scan.verdict}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--mist)]">Güven: {scan.confidence}</span>
                    </div>
                  </div>

                  {/* Çarpanlar ve Fiyatlar */}
                  <div className="grid grid-cols-4 gap-1.5 my-2.5 p-2 rounded-lg bg-[var(--ink-1)] border border-[var(--line)]/60 text-center font-mono">
                    <div>
                      <span className="text-[8px] uppercase text-[var(--mist)] block">F/K</span>
                      <span className="text-[11px] font-bold text-[var(--paper)]">{pe.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase text-[var(--mist)] block">Temettü</span>
                      <span className="text-[11px] font-bold text-cyan-400">%{div.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase text-[var(--mist)] block">Fiyat</span>
                      <span className="text-[11px] font-bold text-[var(--paper)]">{curPrice.toFixed(1)} ₺</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase text-[var(--mist)] block">AI Hedef</span>
                      <span className="text-[11px] font-bold text-[var(--brass)]">
                        {scan.targetPrice ? `${scan.targetPrice.toFixed(1)} ₺` : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Rozetler */}
                  {(() => {
                    const badges = helperBadges(scan);
                    if (badges.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {badges.map((b, idx) => (
                          <span key={idx} className={`px-1.5 py-0.5 rounded text-[9px] font-mono border font-medium ${b.style}`}>
                            {b.label}
                          </span>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Boğa & Ayı Katalizörleri */}
                  <div className="space-y-1.5 text-xs">
                    <p className="text-[11px] text-emerald-300 leading-snug line-clamp-2">
                      <strong>🐂 Boğa:</strong> {scan.bullThesis}
                    </p>
                    <p className="text-[11px] text-rose-300 leading-snug line-clamp-2">
                      <strong>🐻 Risk:</strong> {scan.bearThesis}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]/60 text-[10px] font-mono">
                  {upside !== null ? (
                    <span className={`font-bold ${upside >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      Potansiyel: {upside >= 0 ? `+%${upside}` : `%${upside}`}
                    </span>
                  ) : (
                    <span className="text-[var(--mist)]">Değerleme Skoru: {scan.valuationScore}</span>
                  )}

                  <button
                    onClick={() => {
                      setLotModalScan(scan);
                      if (baskets.length > 0) setTargetBasketId(baskets[0].id);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--ink-3)] hover:bg-[var(--brass)] hover:text-zinc-950 text-[var(--paper)] border border-[var(--line)] transition-all font-mono text-[11px] font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Akıllı Lot Dağıt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* KOMPAKT TABLO GÖRÜNÜMÜ */
        <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[var(--mist)] border-b border-[var(--line)] font-mono bg-[var(--ink-1)]">
                  <th className="p-3">Hisse / Şirket</th>
                  <th className="p-3">Teşhis</th>
                  <th className="p-3 text-right">Fiyat</th>
                  <th className="p-3 text-right">F/K</th>
                  <th className="p-3 text-right">Temettü</th>
                  <th className="p-3 text-right">AI Hedef Fiyat</th>
                  <th className="p-3">Boğa Katalizörü &amp; Risk Özeti</th>
                  <th className="p-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]/40 font-mono">
                {paginatedScans.map((scan) => {
                  const co = companies.find((c) => c.symbol.toUpperCase() === scan.symbol.toUpperCase());
                  const curPrice = co?.price || scan.priceAtScan;
                  const upside = scan.targetPrice
                    ? parseFloat((((scan.targetPrice - curPrice) / curPrice) * 100).toFixed(1))
                    : null;
                  const pe = scan.peRatio || co?.peRatio || 8.5;
                  const div = scan.dividendYield || co?.dividendYield || 0;

                  return (
                    <tr key={scan.id} className="hover:bg-[var(--ink-3)] transition-colors">
                      <td className="p-3">
                        <span className="font-bold text-[var(--paper)] block">{scan.symbol}</span>
                        <span className="text-[10px] text-[var(--mist)] truncate max-w-[120px] block font-sans">
                          {scan.companyName}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getVerdictStyle(scan.verdict)}`}>
                          {scan.verdict}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-[var(--paper)]">
                        {curPrice.toFixed(2)} ₺
                      </td>
                      <td className="p-3 text-right text-[var(--mist)]">
                        {pe.toFixed(1)}
                      </td>
                      <td className="p-3 text-right text-cyan-400 font-bold">
                        %{div.toFixed(1)}
                      </td>
                      <td className="p-3 text-right text-[var(--brass)] font-bold">
                        {scan.targetPrice ? `${scan.targetPrice.toFixed(2)} ₺` : "—"}
                        {upside !== null && (
                          <span className="text-[10px] block text-emerald-400 font-normal">
                            (+%{upside})
                          </span>
                        )}
                      </td>
                      <td className="p-3 max-w-xs truncate font-sans text-[11px] text-[var(--paper-dim)]">
                        <span className="text-emerald-400 font-medium">Boğa:</span> {scan.bullThesis}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setLotModalScan(scan);
                            if (baskets.length > 0) setTargetBasketId(baskets[0].id);
                          }}
                          className="px-2.5 py-1 rounded bg-[var(--brass)] text-zinc-950 font-bold text-[10px] shadow hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                        >
                          Lot Dağıt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Sayfalama (Pagination) Kontrolleri */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs font-mono">
          <span className="text-[var(--mist)]">
            Toplam {filteredScans.length} analizden {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredScans.length)} arası gösteriliyor
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-[var(--brass)]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Akıllı Lot Dağıtım Modalı */}
      {lotModalScan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--brass)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2 text-[var(--brass)] font-serif text-lg font-bold">
                <Zap className="w-5 h-5 fill-current" />
                <span>Akıllı Lot &amp; Bütçe Hesaplayıcı</span>
              </div>
              <button
                onClick={() => setLotModalScan(null)}
                className="text-[var(--mist)] hover:text-[var(--paper)] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[var(--ink-1)] rounded-xl border border-[var(--line)] space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--mist)]">Şirket:</span>
                <span className="font-bold text-[var(--paper)]">{lotModalScan.companyName} ({lotModalScan.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mist)]">Güncel Fiyat:</span>
                <span className="font-bold text-[var(--brass)]">{lotModalScan.priceAtScan.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mist)]">Hedef / Teşhis:</span>
                <span className="font-bold text-emerald-400">{lotModalScan.verdict} ({lotModalScan.targetPrice ? `${lotModalScan.targetPrice.toFixed(2)} ₺` : "—"})</span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[var(--mist)] uppercase text-[10px] mb-1">
                  Bu Alış İçin Ayırdığınız Toplam Bütçe (₺)
                </label>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] focus:border-[var(--brass)] rounded-xl p-2.5 text-xs text-[var(--paper)] font-mono outline-none"
                  placeholder="50000"
                />
              </div>

              {/* Hesaplanan Lot */}
              {(() => {
                const bVal = parseFloat(budgetInput) || 0;
                const pVal = lotModalScan.priceAtScan || 1;
                const calcLots = Math.floor(bVal / pVal);
                const totalCost = parseFloat((calcLots * pVal).toFixed(2));
                const remaining = parseFloat((bVal - totalCost).toFixed(2));

                return (
                  <div className="p-3.5 bg-gradient-to-br from-[var(--brass)]/10 to-transparent border border-[var(--brass-dim)] rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[var(--mist)]">Hesaplanan Lot:</span>
                      <span className="text-base font-bold text-[var(--brass)] font-mono">{calcLots} Lot</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[var(--mist)]">Toplam Yatırım Tutarı:</span>
                      <span className="text-[var(--paper)] font-bold">{totalCost.toLocaleString("tr-TR")} ₺</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[var(--mist)]">Kalan Nakit:</span>
                      <span className="text-[var(--mist)]">{remaining.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </div>
                );
              })()}

              {baskets.length > 0 && (
                <div>
                  <label className="block text-[var(--mist)] uppercase text-[10px] mb-1">
                    Eklenecek Hedef Sepet
                  </label>
                  <select
                    value={targetBasketId || baskets[0]?.id}
                    onChange={(e) => setTargetBasketId(e.target.value)}
                    className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl p-2.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                  >
                    {baskets.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setLotModalScan(null)}
                className="px-4 py-2 rounded-xl bg-[var(--ink-3)] text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  const bVal = parseFloat(budgetInput) || 0;
                  const pVal = lotModalScan.priceAtScan || 1;
                  const calcLots = Math.max(Math.floor(bVal / pVal), 1);
                  const effectiveBasketId = targetBasketId || baskets[0]?.id;

                  if (effectiveBasketId) {
                    addHoldingToBasket(effectiveBasketId, {
                      companySymbol: lotModalScan.symbol,
                      weightPercent: 15,
                      quantity: calcLots,
                      avgCost: pVal,
                      currentPrice: pVal,
                    });
                    showToast(
                      "Portföye Eklendi",
                      `${calcLots} lot ${lotModalScan.symbol} başarıyla sepetinize aktarıldı.`,
                      "success"
                    );
                    setLotModalScan(null);
                  }
                }}
                disabled={baskets.length === 0}
                className="px-5 py-2 rounded-xl bg-[var(--brass)] text-zinc-950 font-bold text-xs font-mono shadow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                Sepete Aktar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
