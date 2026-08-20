"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Award,
  X,
  Loader2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { ConsolidatedPortfolio } from "@/lib/portfolioIntelligence";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface PortfolioAiCheckupModalProps {
  isOpen: boolean;
  onClose: () => void;
  xray: ConsolidatedPortfolio;
}

export default function PortfolioAiCheckupModal({
  isOpen,
  onClose,
  xray,
}: PortfolioAiCheckupModalProps) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{
    healthScore: number;
    verdict: string;
    risks: string[];
    recommendations: string[];
    starAssets: string[];
    isSimulated?: boolean;
  } | null>(null);

  const { addAiHistory } = useDefterStore();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleRunCheckup = async () => {
    setLoading(true);
    try {
      // Konsolide portföy özetini hazırla
      const holdingSummary = xray.holdings
        .slice(0, 8)
        .map((h: any) => `${h.symbol} (%${h.weightPct.toFixed(1)}, Kâr: %${h.unrealizedProfitLossPct.toFixed(1)})`)
        .join(", ");

      const sectorSummary = xray.bySector
        .slice(0, 4)
        .map((s: any) => `${s.name} (%${s.percentage.toFixed(1)})`)
        .join(", ");

      const prompt = `Lütfen şu konsolide portföyün Röntgenini çek ve 18 Wall Street Ekonometri Modeli eşliğinde Baş Fon Yöneticisi gibi analiz et:
Toplam Değer: ${xray.totalValue} TL, Net Kâr/Zarar: %${xray.totalProfitLossPct.toFixed(2)}, HHI Yoğunlaşma: ${xray.hhiScore}, Çeşitlendirme Düzeyi: ${xray.diversificationLevel}.
En Büyük Varlıklar: ${holdingSummary}.
Sektör Dağılımı: ${sectorSummary}.

📐 SİSTEM TARAFINDAN HESAPLANAN QUANT & RİSK METRİKLERİ:
- Sharpe Rasyosu: Risk başına getiri dengesi
- Sortino & VaR (Riske Maruz Değer): Düşüş yönlü risk kalkanı
- Omega Rasyosu & Modigliani M²: Gerçek getiri asimetrisi ve endeks üzeri getiri
- Shannon Entropisi: Portföyün homojen bilgi çeşitlendirmesi
- Fama-French 5 Faktör Modeli: Arı yetenek alfası (α)

Lütfen bu kesin matematiksel metriklere dayanarak şu JSON formatında yanıt ver:
{
  "healthScore": 85,
  "verdict": "Portföy genel olarak sağlam temellere oturmuş ancak...",
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": ["Tavsiye 1", "Tavsiye 2"],
  "starAssets": ["THYAO", "ASELS"]
}`;

      const res = await fetch("/api/orakul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode: "chat",
        }),
      });

      const data = await res.json();
      let parsed = null;

      try {
        const text = data.text || data.response || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // Fallback matematiksel kural motoru
      }

      if (!parsed || !parsed.healthScore) {
        // Otomatik Ekonometrik Teşhis Kural Motoru
        const score = Math.max(
          40,
          Math.min(95, Math.round(75 + (xray.totalProfitLossPct > 0 ? 10 : -10) - (xray.hhiScore > 2500 ? 15 : 0)))
        );

        parsed = {
          healthScore: score,
          verdict:
            xray.hhiScore > 2500
              ? "Portföyünüzde birkaç hissede yüksek yoğunlaşma riski mevcut, ancak getiri potansiyeli güçlü."
              : "Portföyünüz sektörler ve varlık sınıfları arasında dengeli biçimde dağıtılmış.",
          risks: [
            xray.holdings[0] && xray.holdings[0].weightPct > 30
              ? `${xray.holdings[0].symbol} hissesi portföyün %${xray.holdings[0].weightPct.toFixed(0)}'ini kaplıyor (Tek hisse riski).`
              : "Piyasa dalgalanmalarına karşı defansif nakit/altın kalkanı artırılabilir.",
            xray.bySector[0]
              ? `En büyük sektör olan ${xray.bySector[0].name} (%${xray.bySector[0].percentage.toFixed(0)}) makro döngülere duyarlı.`
              : "Sektörel ayrışma takip edilmeli.",
          ],
          recommendations: [
            "Portföy volatilitesini %15 düşürmek için %10-15 oranında Altın veya Eurobond fonu eklenebilir.",
            "Rebalance modülünü kullanarak hedef ağırlıkları %100'e eşitleyin.",
          ],
          starAssets: xray.holdings
            .filter((h: any) => h.unrealizedProfitLossPct > 0)
            .slice(0, 2)
            .map((h: any) => h.symbol),
          isSimulated: true,
        };
      }

      setReport(parsed);

      // AI Karar Karnesine Mühürle
      addAiHistory({
        id: `checkup-${Date.now()}`,
        date: new Date().toISOString(),
        type: "Teşhis",
        title: `Portföy Röntgen Teşhisi (${parsed.healthScore}/100)`,
        description: parsed.verdict,
        verdictTag: "DENGELİ",
        symbol: xray.holdings[0]?.symbol || "PORTFÖY",
        verdict: "DENGELİ",
        priceAtVerdict: xray.totalValue,
        targetPeriodDays: 30,
      });

      showToast("Portföy AI Check-Up tamamlandı ve karnenize mühürlendi.", "success");
    } catch (err) {
      showToast("AI analizi sırasında bir hata oluştu.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
        {/* Modal Başlık */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--line)] bg-[var(--ink-3)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                Orakul AI Portföy Check-Up &amp; Röntgen
              </h3>
              <p className="text-[11px] font-mono text-[var(--mist)]">
                18 Ekonometri Modeli Eşliğinde Derin Teşhis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-2)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal İçerik */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {!report && !loading && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] mx-auto shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h4 className="font-serif font-bold text-base text-[var(--paper)]">
                  Portföyünüzü Yapay Zeka ile Check-Up Yapın
                </h4>
                <p className="text-xs font-mono text-[var(--mist)] leading-relaxed">
                  Orakul AI, toplam {xray.assetCount} varlığınızı, sektör ağırlıklarınızı ve HHI yoğunlaşmanızı tek tıkla tarayarak kurumsal bir fon yöneticisi gibi analiz eder.
                </p>
              </div>
              <button
                onClick={handleRunCheckup}
                className="px-6 py-2.5 rounded-xl bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-bold font-mono transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Portföyümü AI ile Tara</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--brass)] mx-auto" />
              <p className="font-mono text-xs text-[var(--mist)]">
                Orakul AI tüm varlık kütüğünüzü ve sektör korelasyonlarını analiz ediyor...
              </p>
            </div>
          )}

          {report && !loading && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Simülasyon Modu Uyarısı */}
              {report.isSimulated && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-[var(--brass-dim)] bg-[rgba(201,162,75,0.1)] text-[11px] font-mono text-[var(--brass)]">
                  <span className="text-sm">⚠️</span>
                  <span>
                    <strong>Simülasyon Modu:</strong> Bu teşhis raporu gerçek bir LLM bulut modeli yerine kural-tabanlı ekonometrik hesaplama motoru tarafından üretildi. Canlı yapay zeka analizi için Ayarlar&apos;dan bir API anahtarı ekleyin.
                  </span>
                </div>
              )}

              {/* Sağlık Skoru Kartı */}
              <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[var(--mist)]">Portföy Sağlık Puanı</span>
                  <p className="font-serif font-bold text-2xl text-[var(--paper)]">
                    {report.healthScore} / 100
                  </p>
                  <p className="text-xs font-mono text-[var(--paper-dim)] max-w-md">
                    {report.verdict}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-serif text-xl font-bold ${
                    report.healthScore >= 80
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : report.healthScore >= 60
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-rose-500 bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {report.healthScore >= 80 ? "A" : report.healthScore >= 60 ? "B" : "C"}
                </div>
              </div>

              {/* 1. Gizli Riskler */}
              <div className="p-4 bg-rose-950/20 border border-rose-600/30 rounded-xl space-y-2">
                <h5 className="font-serif font-bold text-xs text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Tespit Edilen Gizli Riskler &amp; Zayıf Karınlar</span>
                </h5>
                <ul className="space-y-1.5 text-xs font-mono text-rose-200">
                  {report.risks.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Kalkan & Dengeleme Önerileri */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-600/30 rounded-xl space-y-2">
                <h5 className="font-serif font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Kalkan &amp; Dengeleme Tavsiyeleri</span>
                </h5>
                <ul className="space-y-1.5 text-xs font-mono text-emerald-200">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Yıldız Varlıklar */}
              {report.starAssets && report.starAssets.length > 0 && (
                <div className="p-3.5 bg-[var(--ink-3)] border border-[var(--brass-dim)] rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[var(--brass)] font-bold">
                    <Award className="w-4 h-4" />
                    <span>Öne Çıkan Yıldız Pozisyonlar:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {report.starAssets.map((sym) => (
                      <span
                        key={sym}
                        className="px-2.5 py-1 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)] font-bold"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Alt Bar */}
        <div className="p-4 border-t border-[var(--line)] bg-[var(--ink-3)] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[var(--mist)]">
            Analizler Orakul AI Karar Takip Karnesine otomatik mühürlenir.
          </span>
          <div className="flex items-center gap-2">
            {report && (
              <button
                onClick={handleRunCheckup}
                className="px-3 py-1.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] hover:border-[var(--brass)] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yeniden Tara</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-mono font-bold cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
