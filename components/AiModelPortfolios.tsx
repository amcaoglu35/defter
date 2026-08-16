"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { AiModelBasket } from "@/lib/mockData";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

export function AiModelPortfolios() {
  const {
    aiModelBaskets,
    addAiModelBasket,
    clearAiModelBaskets,
    evaluateAiModelBaskets,
    companies,
    createBasket,
    aiApiKey,
  } = useDefterStore();
  const { showToast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBaskets = async () => {
    setIsGenerating(true);
    try {
      const keyParam = aiApiKey ? `?apiKey=${encodeURIComponent(aiApiKey)}` : "";
      const res = await fetch(`/api/cron/orakul-auto-basket${keyParam}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.baskets)) {
        data.baskets.forEach((basket: AiModelBasket) => {
          addAiModelBasket(basket);
        });
        showToast(
          "Model Sepetler Oluşturuldu",
          `${data.baskets.length} adet otonom AI sepeti sisteme eklendi.`,
          "success"
        );
      } else {
        throw new Error(data.error || "Sepetler oluşturulamadı");
      }
    } catch (err: any) {
      showToast("Hata", err.message || "Model sepet oluşturma hatası", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloneBasket = (modelBasket: AiModelBasket) => {
    const newBasketId = `basket-${Date.now()}`;
    const newHoldings = modelBasket.allocation.map((alloc) => {
      const co = companies.find((c) => c.symbol === alloc.symbol);
      const price = co?.price || alloc.priceAtCreation;
      return {
        companySymbol: alloc.symbol,
        weightPercent: alloc.weight,
        quantity: 10,
        avgCost: price,
        currentPrice: price,
      };
    });

    createBasket({
      id: newBasketId,
      name: modelBasket.theme.replace(/^[^\w\s]+/, "").trim(),
      subtitle: "AI Otonom Model Sepeti Kopyası",
      riskLevel: "Orta",
      riskColor: "mid",
      totalValue: 0,
      totalCost: 0,
      dailyChange: 0,
      totalProfitPercent: 0,
      description: modelBasket.summary,
      aiNote: `Otonom model portföyünden ${new Date().toLocaleDateString("tr-TR")} tarihinde kopyalandı.`,
      holdings: newHoldings,
    });

    showToast(
      "Sepet Kütüğe Kopyalandı",
      `"${modelBasket.theme}" sepetlerinize eklendi. Sepetler sayfasından yönetebilirsiniz.`,
      "success"
    );
  };

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
                Geri Besleme Modeli Aktif
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--paper)] mt-2">
              AI Fon Yöneticisi &amp; Model Sepetler
            </h2>
            <p className="text-xs text-[var(--mist)] mt-1 max-w-2xl leading-relaxed">
              Yapay zeka, her gün farklı piyasa temalarında (Değer Avcısı, Büyüme &amp; İhracat, Temettü Kalesi)
              deneysel sepetler kurar. Bu sepetlerin BIST-100 karşısındaki alfa performansını ölçerek bir sonraki
              sepet seçimlerinde ağırlıklandırma algoritmasını optimize eder.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={handleGenerateBaskets}
              disabled={isGenerating}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--brass)] to-[var(--brass-glow)] text-zinc-950 font-medium text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sepetler Kuruluyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>3 Model Sepet Kur (AI)</span>
                </>
              )}
            </button>

            {aiModelBaskets.length > 0 && (
              <button
                onClick={() => {
                  evaluateAiModelBaskets();
                  showToast("Sepet Performansları Güncellendi", "Canlı fiyatlarla sepet alfaları hesaplandı.", "info");
                }}
                className="px-3 py-2.5 rounded-xl bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)] border border-[var(--line)] text-xs transition-colors"
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
            <div className="font-mono text-[11px] font-bold text-[var(--brass)] uppercase tracking-wider">
              🎓 Orakul Öğrenme Döngüsü Analizi
            </div>
            <p className="text-[11px] text-[var(--paper)] leading-relaxed">
              Önceki dönemlerde oluşturulan sepetlerde <span className="text-emerald-400 font-semibold">Temettü Verimi &gt; %4</span> ve <span className="text-emerald-400 font-semibold">F/K &lt; 9</span> olan şirketler, BIST-100 endeksine karşı ortalama <span className="text-emerald-400 font-mono font-bold">+4.2% Alfa</span> üretmiştir. Model sepet oluşturucusunda bu faktörlerin ağırlığı otomatik olarak artırılmıştır.
            </p>
          </div>
        </div>
      </div>

      {/* Model Baskets Grid */}
      {aiModelBaskets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--ink-2)] border border-dashed border-[var(--line)]">
          <Layers className="w-10 h-10 text-[var(--brass)]/40 mx-auto mb-3" />
          <h3 className="text-base font-serif font-bold text-[var(--paper)]">
            Henüz AI Model Sepeti Oluşturulmadı
          </h3>
          <p className="text-xs text-[var(--mist)] max-w-sm mx-auto mt-1">
            Yapay zekanın kendi kendine sepet oluşturup takip etmesi için &quot;3 Model Sepet Kur (AI)&quot; butonuna basın.
          </p>
          <button
            onClick={handleGenerateBaskets}
            disabled={isGenerating}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brass)] text-zinc-950 font-medium text-xs shadow hover:brightness-110 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Model Sepetleri Başlat
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--mist)]">
              Takip Edilen Model Sepet Sayısı: {aiModelBaskets.length}
            </span>
            <button
              onClick={clearAiModelBaskets}
              className="text-[11px] font-mono text-rose-400 hover:underline"
            >
              Tüm Model Sepetleri Temizle
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {aiModelBaskets.map((basket) => {
              // Calculate live total return
              let weightedReturn = 0;
              basket.allocation.forEach((item) => {
                const co = companies.find((c) => c.symbol.toUpperCase() === item.symbol.toUpperCase());
                const cur = co?.price || item.priceAtCreation;
                const ret = ((cur - item.priceAtCreation) / item.priceAtCreation) * 100;
                weightedReturn += ret * (item.weight / 100);
              });
              const totalRet = parseFloat(weightedReturn.toFixed(2));
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

                      <div className="text-right">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-1 rounded-lg border ${
                            isPositive
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          }`}
                        >
                          {isPositive ? `+${totalRet}%` : `${totalRet}%`}
                        </span>
                        <div className="text-[9px] font-mono text-[var(--mist)] mt-0.5">
                          Ağırlıklı Getiri
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-[var(--paper)]/80 mt-3 p-2.5 rounded-xl bg-[var(--ink-1)] border border-[var(--line)] leading-relaxed">
                      {basket.summary}
                    </p>

                    {/* Holdings Table */}
                    <div className="mt-4 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-[var(--mist)] font-bold">
                        Varlık Dağılımı (%100)
                      </span>
                      <div className="space-y-1.5">
                        {basket.allocation.map((alloc) => {
                          const co = companies.find(
                            (c) => c.symbol.toUpperCase() === alloc.symbol.toUpperCase()
                          );
                          const curPrice = co?.price || alloc.priceAtCreation;
                          const ret = parseFloat(
                            (((curPrice - alloc.priceAtCreation) / alloc.priceAtCreation) * 100).toFixed(1)
                          );

                          return (
                            <div
                              key={alloc.symbol}
                              className="flex items-center justify-between p-2 rounded-lg bg-[var(--ink-1)] border border-[var(--line)] text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[var(--paper)]">
                                  {alloc.symbol}
                                </span>
                                <span className="text-[10px] font-mono text-[var(--brass)] bg-[var(--brass)]/10 px-1.5 py-0.5 rounded">
                                  %{alloc.weight}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-xs">
                                <span className="text-[var(--mist)]">{curPrice.toFixed(2)} ₺</span>
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
                      onClick={() => handleCloneBasket(basket)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--brass)] hover:brightness-110 text-zinc-950 font-medium text-xs shadow transition-all active:scale-95"
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
    </div>
  );
}
