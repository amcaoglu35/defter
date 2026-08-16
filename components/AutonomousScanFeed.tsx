"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { AutonomousScan } from "@/lib/mockData";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface Props {
  onAddHoldingToBasket?: (symbol: string) => void;
}

export function AutonomousScanFeed({ onAddHoldingToBasket }: Props) {
  const {
    autonomousScans,
    addAutonomousScan,
    clearAutonomousScans,
    evaluateAutonomousScans,
    companies,
    baskets,
    addHoldingToBasket,
  } = useDefterStore();
  const { showToast } = useToast();

  const [isScanning, setIsScanning] = useState(false);
  const [filterVerdict, setFilterVerdict] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScan, setSelectedScan] = useState<AutonomousScan | null>(null);

  const handleRunManualScan = async (count = 10) => {
    setIsScanning(true);
    try {
      const res = await fetch(`/api/cron/orakul-scanner?count=${count}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.scans)) {
        data.scans.forEach((scan: AutonomousScan) => {
          addAutonomousScan(scan);
        });
        showToast(
          "Otonom Tarama Tamamlandı",
          `${data.scans.length} şirket AI motoru tarafından incelendi ve akışa eklendi.`,
          "success"
        );
      } else {
        throw new Error(data.error || "Tarama başarısız");
      }
    } catch (err: any) {
      showToast("Tarama Hatası", err.message || "Bağlantı sağlanamadı", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const filteredScans = autonomousScans.filter((scan) => {
    const matchesVerdict =
      filterVerdict === "ALL" ||
      (filterVerdict === "AL" && scan.verdict.includes("AL")) ||
      (filterVerdict === "SAT" && scan.verdict.includes("SAT")) ||
      (filterVerdict === "TUT" && (scan.verdict.includes("TUT") || scan.verdict.includes("NÖTR")));
    const matchesSearch =
      scan.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.sector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVerdict && matchesSearch;
  });

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
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="p-5 rounded-2xl bg-[var(--ink-2)] border border-[var(--brass-dim)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--brass)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/30">
                <Brain className="w-3.5 h-3.5" />
                7/24 Otonom Analiz İstihbaratı
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Aktif Tarayıcı
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--paper)] mt-2">
              Yapay Zeka Keşif &amp; Değerleme Akışı
            </h2>
            <p className="text-xs text-[var(--mist)] mt-1 max-w-2xl leading-relaxed">
              Yapay zeka motoru, Borsa İstanbul kütüğündeki şirketleri periyodik olarak inceler,
              boğa ve ayı tezlerini çıkarır ve hedef fiyatlarını kaydeder.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={() => handleRunManualScan(10)}
              disabled={isScanning}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--brass)] to-[var(--brass-glow)] text-zinc-950 font-medium text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Şirketler Taranıyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>10 Şirket Tara (AI)</span>
                </>
              )}
            </button>

            {autonomousScans.length > 0 && (
              <button
                onClick={() => {
                  evaluateAutonomousScans();
                  showToast("Fiyatlar Güncellendi", "Otonom taramaların güncel getiri durumları kontrol edildi.", "info");
                }}
                className="px-3 py-2.5 rounded-xl bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)] text-xs transition-colors"
                title="Getirileri Kontrol Et"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--line)]">
          <div className="p-3 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-[var(--mist)]">Toplam Tarama</span>
            <div className="text-lg font-mono font-bold text-[var(--paper)] mt-0.5">
              {autonomousScans.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-emerald-400">AL Tavsiyeleri</span>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
              {autonomousScans.filter((s) => s.verdict.includes("AL")).length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-rose-400">SAT / Riskli</span>
            <div className="text-lg font-mono font-bold text-rose-400 mt-0.5">
              {autonomousScans.filter((s) => s.verdict.includes("SAT")).length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
            <span className="text-[10px] font-mono uppercase text-[var(--brass)]">Ortalama Güven</span>
            <div className="text-lg font-mono font-bold text-[var(--brass)] mt-0.5">
              %
              {autonomousScans.length > 0
                ? Math.round(
                    autonomousScans.reduce((acc, s) => acc + parseInt(s.confidence.replace("%", "") || "75", 10), 0) /
                      autonomousScans.length
                  )
                : 82}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mist)]" />
          <input
            type="text"
            placeholder="Hisse kodu, şirket veya sektör..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--ink-2)] border border-[var(--line)] text-xs text-[var(--paper)] placeholder-[var(--mist)]/60 focus:outline-none focus:border-[var(--brass)]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "AL", "TUT", "SAT"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterVerdict(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filterVerdict === v
                  ? "bg-[var(--brass)] text-zinc-950 font-bold shadow"
                  : "bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)]"
              }`}
            >
              {v === "ALL" ? "Tümü" : v}
            </button>
          ))}

          {autonomousScans.length > 0 && (
            <button
              onClick={clearAutonomousScans}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ml-2"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Scans Grid */}
      {filteredScans.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--ink-2)] border border-dashed border-[var(--line)]">
          <Brain className="w-10 h-10 text-[var(--brass)]/40 mx-auto mb-3" />
          <h3 className="text-base font-serif font-bold text-[var(--paper)]">
            Henüz Otonom Tarama Bulunmuyor
          </h3>
          <p className="text-xs text-[var(--mist)] max-w-sm mx-auto mt-1">
            Yapay zeka motorunun BIST hisselerini analiz etmesi için yukarıdaki &quot;10 Şirket Tara (AI)&quot; butonuna basın.
          </p>
          <button
            onClick={() => handleRunManualScan(10)}
            disabled={isScanning}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brass)] text-zinc-950 font-medium text-xs shadow hover:brightness-110 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            İlk Taramayı Başlat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScans.map((scan) => {
            const co = companies.find((c) => c.symbol.toUpperCase() === scan.symbol.toUpperCase());
            const curPrice = co?.price || scan.priceAtScan;
            const liveReturn = parseFloat((((curPrice - scan.priceAtScan) / scan.priceAtScan) * 100).toFixed(2));
            const upside = scan.targetPrice
              ? parseFloat((((scan.targetPrice - curPrice) / curPrice) * 100).toFixed(1))
              : null;

            return (
              <div
                key={scan.id}
                className="p-5 rounded-2xl bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--brass-dim)] transition-all flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden"
              >
                {/* Header: Symbol & Verdict */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[var(--paper)]">
                          {scan.symbol}
                        </span>
                        <span className="text-[11px] text-[var(--mist)] truncate max-w-[160px]">
                          {scan.companyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-[var(--brass)]">
                          {scan.sector}
                        </span>
                        <span className="text-[10px] text-[var(--mist)]">•</span>
                        <span className="text-[10px] font-mono text-[var(--mist)]">
                          {new Date(scan.scannedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border ${getVerdictStyle(
                          scan.verdict
                        )}`}
                      >
                        {scan.verdict}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--mist)]">
                        Güven: {scan.confidence}
                      </span>
                    </div>
                  </div>

                  {/* Price & Target Row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)]">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-[var(--mist)]">Tarama Fiyatı</span>
                      <div className="font-mono text-xs font-bold text-[var(--paper)]">
                        {scan.priceAtScan.toFixed(2)} ₺
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-[var(--mist)]">Güncel Fiyat</span>
                      <div
                        className={`font-mono text-xs font-bold flex items-center gap-1 ${
                          liveReturn >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {curPrice.toFixed(2)} ₺
                        <span className="text-[10px]">
                          ({liveReturn >= 0 ? `+${liveReturn}%` : `${liveReturn}%`})
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-[var(--mist)]">AI Hedef</span>
                      <div className="font-mono text-xs font-bold text-[var(--brass)]">
                        {scan.targetPrice ? `${scan.targetPrice.toFixed(2)} ₺` : "—"}
                        {upside !== null && (
                          <span className="text-[9px] text-[var(--mist)] ml-1">
                            (%{upside >= 0 ? `+${upside}` : upside})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bull & Bear Theses */}
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-semibold mb-0.5">
                        <TrendingUp className="w-3 h-3" />
                        Boğa Tezi
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug">
                        {scan.bullThesis}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/15">
                      <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] font-semibold mb-0.5">
                        <TrendingDown className="w-3 h-3" />
                        Risk &amp; Ayı Tezi
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug">
                        {scan.bearThesis}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-[10px] font-mono text-[var(--mist)]">
                  <span>Model: {scan.model}</span>

                  <div className="flex items-center gap-2">
                    {baskets.length > 0 && (
                      <button
                        onClick={() => {
                          const targetBasket = baskets[0];
                          if (targetBasket) {
                            addHoldingToBasket(targetBasket.id, {
                              companySymbol: scan.symbol,
                              weightPercent: 10,
                              quantity: 1,
                              avgCost: curPrice,
                              currentPrice: curPrice,
                            });
                            showToast("Sepete Eklendi", `${scan.symbol} "${targetBasket.name}" sepetine eklendi.`, "success");
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--ink-3)] hover:bg-[var(--brass)] hover:text-zinc-950 text-[var(--paper)] border border-[var(--line)] transition-all font-mono"
                      >
                        <Plus className="w-3 h-3" />
                        Sepete Ekle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
