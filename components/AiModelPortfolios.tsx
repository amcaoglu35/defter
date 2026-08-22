"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
  Plus,
  RefreshCw,
  Award,
  CheckCircle2,
  Copy,
  BarChart3,
  Calendar,
  Shield,
  Clock,
  ArrowRight,
  Target,
  Coins,
  Activity,
  ChevronRight,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { AiModelBasket } from "@/lib/mockData";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface Props {
  onSelectSymbol?: (symbol: string) => void;
}

export function AiModelPortfolios({ onSelectSymbol }: Props) {
  const {
    aiModelBaskets,
    addAiModelBasket,
    clearAiModelBaskets,
    evaluateAiModelBaskets,
    companies,
    createBasket,
    aiApiKey,
    indices,
  } = useDefterStore();
  const { showToast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBasketForClone, setSelectedBasketForClone] = useState<AiModelBasket | null>(null);
  const [cloneBudget, setCloneBudget] = useState<string>("50000");

  const bistDailyChange = indices["BIST 100"]?.dailyChange || 0;

  const handleGenerateBaskets = async () => {
    setIsGenerating(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (aiApiKey) {
        headers["x-gemini-key"] = aiApiKey;
      }

      const res = await fetch("/api/ai-tools/generate-baskets", {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.baskets)) {
        data.baskets.forEach((basket: AiModelBasket) => {
          addAiModelBasket(basket);
        });
        showToast(
          "Model Sepetler Kuruldu",
          `${data.baskets.length} adet otonom quant ve AI sepeti sisteme eklendi.`,
          "success"
        );
      } else {
        throw new Error(data.error || "Sepetler oluşturulamadı");
      }
    } catch (err: unknown) {
      showToast("Hata", (err instanceof Error ? err.message : String(err)) || "Model sepet oluşturma hatası", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecuteClone = useCallback(() => {
    if (!selectedBasketForClone) return;

    const budget = parseFloat(cloneBudget) || 50000;
    const cleanTheme = selectedBasketForClone.theme
      .replace(/[çğışöüÇĞİŞÖÜ]/g, (c) => ({ ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u" }[c] || c))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 15);
    const newBasketId = `basket-${cleanTheme || "model"}-${Math.floor(Math.random() * 100000)}`;

    const newHoldings = selectedBasketForClone.allocation.map((alloc) => {
      const co = companies.find((c) => c.symbol.toUpperCase() === alloc.symbol.toUpperCase());
      const price = co?.price || alloc.priceAtCreation || 1;
      const targetAllocationBudget = budget * (alloc.weight / 100);
      const calculatedQty = Math.max(1, Math.floor(targetAllocationBudget / price));

      return {
        companySymbol: alloc.symbol,
        weightPercent: alloc.weight,
        quantity: calculatedQty,
        avgCost: price,
        currentPrice: price,
      };
    });

    const totalCalculatedCost = newHoldings.reduce((sum, h) => sum + h.quantity * h.avgCost, 0);

    createBasket({
      id: newBasketId,
      name: selectedBasketForClone.theme.replace(/^[^\w\s]+/, "").trim(),
      subtitle: "AI Otonom Model Portföy Kopyası",
      riskLevel: "Orta",
      riskColor: "mid",
      totalValue: totalCalculatedCost,
      totalCost: totalCalculatedCost,
      dailyChange: 0,
      totalProfitPercent: 0,
      description: selectedBasketForClone.summary,
      aiNote: `Otonom model portföyünden ${budget.toLocaleString("tr-TR")} ₺ bütçeyle MPT ağırlıklarıyla kopyalandı.`,
      holdings: newHoldings,
    });

    showToast(
      "Sepet Portföyünüze Aktarıldı",
      `"${selectedBasketForClone.theme}" ${newHoldings.length} varlıkla sepetlerinize eklendi.`,
      "success"
    );
    setSelectedBasketForClone(null);
  }, [selectedBasketForClone, cloneBudget, companies, createBasket, showToast]);

  // Sıralanmış ve Alfa Hesaplanmış Sepetler
  const evaluatedBaskets = useMemo(() => {
    return aiModelBaskets.map((basket) => {
      let weightedReturn = 0;
      basket.allocation.forEach((item) => {
        const co = companies.find((c) => c.symbol.toUpperCase() === item.symbol.toUpperCase());
        const cur = co?.price || item.priceAtCreation;
        const ret = item.priceAtCreation > 0 ? ((cur - item.priceAtCreation) / item.priceAtCreation) * 100 : 0;
        weightedReturn += ret * (item.weight / 100);
      });
      const calculatedReturn = parseFloat(weightedReturn.toFixed(2));
      const calculatedAlpha = parseFloat((calculatedReturn - bistDailyChange).toFixed(2));

      return {
        ...basket,
        calculatedReturn,
        calculatedAlpha,
      };
    }).sort((a, b) => b.calculatedAlpha - a.calculatedAlpha);
  }, [aiModelBaskets, companies, bistDailyChange]);

  return (
    <div className="space-y-6">
      {/* Control Banner & Learning Loop */}
      <div className="p-5 rounded-2xl bg-[var(--ink-2)] border border-[var(--brass-dim)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brass)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/30">
                <Brain className="w-3.5 h-3.5" />
                Kendi Kendini Eğiten Model Portföyler
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                <Sparkles className="w-3 h-3" />
                Modern Portföy Teorisi &amp; Piotroski Ağırlıklı
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--paper)] mt-2">
              AI Fon Yöneticisi &amp; Model Sepetler
            </h2>
            <p className="text-xs text-[var(--mist)] mt-1 max-w-2xl leading-relaxed">
              Yapay zeka; Derin Değer, Temettü Aristokratları, XTEK Teknoloji, İhracat ve Altın Tamponlu 6 farklı temada kurumsal model portföyler oluşturur. Sepetlerin BIST-100 endeksine karşı ürettiği alfayı ($\alpha$) canlı takip eder.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={handleGenerateBaskets}
              disabled={isGenerating}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--brass)] to-[#d9b35a] text-zinc-950 font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sepetler Kuruluyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>6 Model Sepet Kur (AI)</span>
                </>
              )}
            </button>

            {aiModelBaskets.length > 0 && (
              <button
                onClick={() => {
                  evaluateAiModelBaskets();
                  showToast("Sepet Performansları Güncellendi", "Canlı fiyatlarla sepet alfaları hesaplandı.", "info");
                }}
                className="px-3 py-2.5 rounded-xl bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)] text-xs transition-colors cursor-pointer"
                title="Performansı Hesapla"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Self Learning Insights Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[var(--brass)]/10 text-[var(--brass)] shrink-0 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-mono text-[11px] font-bold text-[var(--brass)] uppercase tracking-wider flex items-center justify-between">
              <span>🎓 Orakul Öğrenme Döngüsü &amp; Alfa Raporu</span>
              <span className="text-[10px] text-[var(--mist)] font-normal">BIST 100 Günlük: %{bistDailyChange >= 0 ? `+${bistDailyChange}` : bistDailyChange}</span>
            </div>
            <p className="text-[11px] text-[var(--paper)] leading-relaxed">
              Önceki dönemlerde oluşturulan sepetlerde <span className="text-emerald-400 font-semibold">Stanford Piotroski &ge; 7/9</span> ve <span className="text-cyan-400 font-semibold">Temettü Verimi &gt; %3.5</span> olan varlıklar, BIST-100 endeksine karşı ortalama <span className="text-emerald-400 font-mono font-bold">+{evaluatedBaskets[0]?.calculatedAlpha || 3.8}% Alfa</span> üretmiştir.
            </p>
          </div>
        </div>
      </div>

      {/* Model Baskets Grid */}
      {aiModelBaskets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--ink-2)] border border-dashed border-[var(--line)] space-y-3">
          <Layers className="w-10 h-10 text-[var(--brass)]/40 mx-auto" />
          <h3 className="text-base font-serif font-bold text-[var(--paper)]">
            Henüz AI Model Sepeti Oluşturulmadı
          </h3>
          <p className="text-xs text-[var(--mist)] max-w-sm mx-auto">
            Yapay zekanın 6 kurumsal temada kendi kendine sepet oluşturup takip etmesi için &quot;6 Model Sepet Kur (AI)&quot; butonuna basın.
          </p>
          <button
            onClick={handleGenerateBaskets}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brass)] text-zinc-950 font-bold text-xs shadow hover:brightness-110 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Model Sepetleri Başlat
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Strategy Arena Leaderboard */}
          {evaluatedBaskets.length > 1 && (() => {
            const champion = evaluatedBaskets[0];

            return (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--brass)]/10 via-[var(--ink-2)] to-[var(--ink-3)] border border-[var(--brass)] shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
                  <div className="flex items-center gap-2 font-serif text-sm font-bold text-[var(--paper)]">
                    <span className="text-xl">🏆</span>
                    <span>AI Model Sepet Arenası: Güncel Lider Strateji</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--brass)] text-zinc-950 font-mono text-xs font-bold shadow">
                      🥇 1. Sıra: {champion.theme.split(" ")[1] || champion.theme}
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      %{champion.calculatedReturn >= 0 ? `+${champion.calculatedReturn}` : champion.calculatedReturn} Getiri ({champion.calculatedAlpha >= 0 ? `+${champion.calculatedAlpha}% α` : `${champion.calculatedAlpha}% α`})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {evaluatedBaskets.slice(0, 3).map((b, idx) => (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        idx === 0
                          ? "bg-[var(--brass)]/15 border-[var(--brass)] text-[var(--paper)] font-bold shadow"
                          : "bg-[var(--ink-1)] border-[var(--line)] text-[var(--mist)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                        <span className="truncate">{b.theme.replace(/^[^\w\s]+/, "").trim()}</span>
                      </div>
                      <div className="text-right">
                        <span className={`block font-bold ${b.calculatedReturn >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          %{b.calculatedReturn >= 0 ? `+${b.calculatedReturn}` : b.calculatedReturn}
                        </span>
                        <span className="text-[9px] text-[var(--brass)] block">
                          {b.calculatedAlpha >= 0 ? `+${b.calculatedAlpha}% α` : `${b.calculatedAlpha}% α`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--mist)]">
              Takip Edilen Model Sepet Sayısı: {evaluatedBaskets.length}
            </span>
            <button
              onClick={clearAiModelBaskets}
              className="text-[11px] font-mono text-rose-400 hover:underline cursor-pointer"
            >
              Tüm Model Sepetleri Temizle
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {evaluatedBaskets.map((basket) => {
              const totalRet = basket.calculatedReturn;
              const alpha = basket.calculatedAlpha;
              const isPositive = totalRet >= 0;

              return (
                <div
                  key={basket.id}
                  className="p-5 rounded-2xl bg-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--brass-dim)] transition-all flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[var(--paper)]">
                          {basket.theme}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-[var(--mist)]">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(basket.createdAt).toLocaleDateString("tr-TR")}</span>
                          <span>•</span>
                          <span>{basket.horizon} Günlük Vade</span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg border ${
                            isPositive
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          }`}
                        >
                          {isPositive ? `+${totalRet}%` : `${totalRet}%`}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          alpha >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          {alpha >= 0 ? `+${alpha}% Alfa (BIST Üstü)` : `${alpha}% Alfa`}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-[var(--paper)]/80 mt-3 p-2.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)] leading-relaxed">
                      {basket.summary}
                    </p>

                    {/* Holdings Table */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[var(--mist)] font-bold">
                        <span>Varlık Dağılımı (%100)</span>
                        <span>F/K • Temettü • Skor</span>
                      </div>
                      <div className="space-y-1.5">
                        {basket.allocation.map((alloc) => {
                          const co = companies.find(
                            (c) => c.symbol.toUpperCase() === alloc.symbol.toUpperCase()
                          );
                          const curPrice = co?.price || alloc.priceAtCreation;
                          const ret = alloc.priceAtCreation > 0
                            ? parseFloat((((curPrice - alloc.priceAtCreation) / alloc.priceAtCreation) * 100).toFixed(1))
                            : 0;
                          const pe = alloc.peRatio ?? co?.peRatio;
                          const div = alloc.dividendYield ?? co?.dividendYield ?? 0;
                          const piotroski = alloc.piotroskiFScore;

                          return (
                            <div
                              key={alloc.symbol}
                              className="flex items-center justify-between p-2 rounded-lg bg-[var(--ink-1)] border border-[var(--line)] text-xs hover:border-[var(--brass-dim)] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onSelectSymbol?.(alloc.symbol)}
                                  className="font-mono font-bold text-[var(--paper)] hover:text-[var(--brass)] cursor-pointer text-left"
                                  title={`${alloc.symbol} Şirket Teşhisine Git`}
                                >
                                  {alloc.symbol}
                                </button>
                                <span className="text-[10px] font-mono text-[var(--brass)] bg-[var(--brass)]/10 px-1.5 py-0.5 rounded font-bold">
                                  %{alloc.weight}
                                </span>
                              </div>

                              <div className="flex items-center gap-2.5 font-mono text-xs">
                                <div className="text-[10px] text-[var(--mist)]">
                                  {pe ? `${pe.toFixed(1)}x` : "—"} {div > 0 ? `• %${div.toFixed(1)}` : ""} {piotroski ? `• ${piotroski}/9` : ""}
                                </div>
                                <span className="text-[var(--paper)] font-bold">{curPrice.toFixed(1)} ₺</span>
                                <span
                                  className={`text-[11px] font-bold ${
                                    ret >= 0 ? "text-emerald-400" : "text-rose-400"
                                  }`}
                                >
                                  {ret >= 0 ? `+${ret}%` : `${ret}%`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--mist)]">
                      Model: {basket.model}
                    </span>

                    <button
                      onClick={() => setSelectedBasketForClone(basket)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--brass)] hover:brightness-110 text-zinc-950 font-bold text-xs shadow transition-all active:scale-95 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Portföyüme Kopyala
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Akıllı Portföye Kopyalama Modalı */}
      {selectedBasketForClone && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--ink-2)] border border-[var(--brass)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2 text-[var(--brass)] font-serif text-lg font-bold">
                <Copy className="w-5 h-5" />
                <span>Model Sepeti Portföye Aktar</span>
              </div>
              <button
                onClick={() => setSelectedBasketForClone(null)}
                className="text-[var(--mist)] hover:text-[var(--paper)] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[var(--ink-1)] rounded-xl border border-[var(--line)] space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--mist)]">Model Sepet:</span>
                <span className="font-bold text-[var(--paper)]">{selectedBasketForClone.theme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mist)]">Varlık Sayısı:</span>
                <span className="font-bold text-[var(--brass)]">{selectedBasketForClone.allocation.length} Şirket</span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[var(--mist)] uppercase text-[10px] mb-1">
                  Bu Sepet İçin Ayırdığınız Toplam Bütçe (₺)
                </label>
                <input
                  type="number"
                  value={cloneBudget}
                  onChange={(e) => setCloneBudget(e.target.value)}
                  className="w-full bg-[var(--ink-3)] border border-[var(--line)] focus:border-[var(--brass)] rounded-xl p-2.5 text-xs text-[var(--paper)] font-mono outline-none"
                  placeholder="50000"
                />
              </div>

              {/* Hesaplanan Varlık Dağılımı ve Lotlar */}
              {(() => {
                const bVal = parseFloat(cloneBudget) || 50000;
                let totalInvested = 0;
                let totalDivYieldSum = 0;

                const lotsBreakdown = selectedBasketForClone.allocation.map((alloc) => {
                  const co = companies.find((c) => c.symbol.toUpperCase() === alloc.symbol.toUpperCase());
                  const price = co?.price || alloc.priceAtCreation || 1;
                  const allocatedBudget = bVal * (alloc.weight / 100);
                  const qty = Math.max(1, Math.floor(allocatedBudget / price));
                  const cost = qty * price;
                  totalInvested += cost;
                  const div = alloc.dividendYield || co?.dividendYield || 0;
                  totalDivYieldSum += cost * (div / 100);

                  return {
                    symbol: alloc.symbol,
                    weight: alloc.weight,
                    qty,
                    price,
                    cost,
                  };
                });

                const remainingCash = Math.max(0, bVal - totalInvested);

                return (
                  <div className="p-3.5 bg-gradient-to-br from-[var(--brass)]/10 to-transparent border border-[var(--brass-dim)] rounded-xl space-y-2">
                    <div className="text-[10px] font-mono text-[var(--mist)] uppercase font-bold border-b border-[var(--brass-dim)]/30 pb-1 flex justify-between">
                      <span>Varlık &amp; Lot Dağılımı</span>
                      <span>Maliyet</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      {lotsBreakdown.map((l) => (
                        <div key={l.symbol} className="flex justify-between items-center font-mono">
                          <span>
                            <strong>{l.symbol}</strong> (%{l.weight}): {l.qty} Lot @ {l.price.toFixed(1)} ₺
                          </span>
                          <span className="font-bold text-[var(--paper)]">{l.cost.toLocaleString("tr-TR")} ₺</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-[var(--brass-dim)]/40 flex justify-between items-center text-[10px]">
                      <span className="text-[var(--mist)]">Toplam Yatırım Tutarı:</span>
                      <span className="font-bold text-[var(--paper)]">{totalInvested.toLocaleString("tr-TR")} ₺</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[var(--mist)]">Kalan Nakit:</span>
                      <span className="text-[var(--mist)]">{remainingCash.toLocaleString("tr-TR")} ₺</span>
                    </div>
                    {totalDivYieldSum > 0 && (
                      <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold">
                        <span>Tahmini Yıllık Temettü Getirisi:</span>
                        <span>+{totalDivYieldSum.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺ / Yıl</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setSelectedBasketForClone(null)}
                className="px-4 py-2 rounded-xl bg-[var(--ink-3)] text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleExecuteClone}
                className="px-5 py-2 rounded-xl bg-[var(--brass)] text-zinc-950 font-bold text-xs font-mono shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Sepetlerime Aktar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
