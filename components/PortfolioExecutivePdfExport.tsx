"use client";

import React from "react";
import { FileText, Printer, Download, X, PieChart, ShieldCheck } from "lucide-react";
import { ConsolidatedPortfolio } from "@/lib/portfolioIntelligence";

interface PortfolioExecutivePdfExportProps {
  isOpen: boolean;
  onClose: () => void;
  xray: ConsolidatedPortfolio;
}

export default function PortfolioExecutivePdfExport({
  isOpen,
  onClose,
  xray,
}: PortfolioExecutivePdfExportProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-0 max-h-[90vh] flex flex-col">
        {/* Üst Kontrol Barı (Yazdırmada Gizlenir) */}
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--ink-3)] shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[var(--paper)]">
                Portföy Yönetici Özeti &amp; Yatırım Bülteni
              </h3>
              <p className="text-[11px] font-mono text-[var(--mist)]">
                Tek tıkla PDF olarak kaydedin veya yazıcıdan çıktı alın.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] text-xs font-bold font-mono transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PDF Olarak Yazdır / Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--line)]/40 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bülten Sayfası (Yazdırılabilir Alan) */}
        <div
          id="printable-portfolio-bulletin"
          className="p-8 space-y-6 overflow-y-auto bg-[var(--ink)] text-[var(--paper)] font-sans print:p-0 print:bg-white print:text-black print:overflow-visible"
        >
          {/* Bülten Başlığı & Logo */}
          <div className="flex items-center justify-between border-b-2 border-[var(--brass)] pb-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-[var(--brass)] uppercase block print:text-amber-700">
                DEFTER DEFTER PORTFÖY ZEKA RAPORU
              </span>
              <h1 className="font-serif text-2xl font-bold text-[var(--paper)] print:text-black">
                Konsolide Varlık Röntgeni &amp; Yönetici Özeti
              </h1>
              <p className="text-xs font-mono text-[var(--mist)] print:text-gray-600">
                Oluşturulma Tarihi: {currentDate}
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-[var(--mist)] print:text-gray-600 block">Gizlilik Derecesi</span>
              <span className="text-xs font-bold text-[var(--brass)] uppercase px-2 py-0.5 rounded bg-[var(--ink-3)] border border-[var(--brass-dim)] print:border-gray-400 print:text-black print:bg-gray-100">
                KİŞİSEL ARŞİV
              </span>
            </div>
          </div>

          {/* Özet Metrik Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] font-mono text-[var(--mist)] print:text-gray-600 block">
                Toplam Portföy Değeri
              </span>
              <p className="font-serif font-bold text-xl text-[var(--paper)] print:text-black">
                {xray.totalValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
              </p>
            </div>

            <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] font-mono text-[var(--mist)] print:text-gray-600 block">
                Net Kâr / Zarar
              </span>
              <p
                className={`font-serif font-bold text-xl ${
                  xray.totalProfitLoss >= 0 ? "text-emerald-400 print:text-emerald-700" : "text-rose-400 print:text-red-700"
                }`}
              >
                {xray.totalProfitLoss >= 0 ? "+" : ""}
                {xray.totalProfitLoss.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
                <span className="text-xs ml-1">
                  (%{xray.totalProfitLossPct.toFixed(2)})
                </span>
              </p>
            </div>

            <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] font-mono text-[var(--mist)] print:text-gray-600 block">
                Çeşitlendirme Düzeyi
              </span>
              <p className="font-serif font-bold text-xl text-[var(--paper)] print:text-black">
                {xray.diversificationLevel}
              </p>
              <span className="text-[10px] font-mono text-[var(--mist)] print:text-gray-600">
                HHI: {xray.hhiScore}
              </span>
            </div>

            <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] font-mono text-[var(--mist)] print:text-gray-600 block">
                Toplam Enstrüman
              </span>
              <p className="font-serif font-bold text-xl text-[var(--paper)] print:text-black">
                {xray.assetCount} Varlık
              </p>
            </div>
          </div>

          {/* Sektör Dağılım Şeridi */}
          <div className="p-4 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl space-y-3 print:bg-gray-50 print:border-gray-300">
            <h4 className="font-serif font-bold text-sm text-[var(--paper)] print:text-black border-b border-[var(--line)] print:border-gray-300 pb-2">
              Sektörel Varlık Röntgeni
            </h4>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              {xray.bySector.slice(0, 6).map((sec: any) => (
                <div key={sec.name} className="flex items-center justify-between p-2 rounded bg-[var(--ink-3)] print:bg-white border border-[var(--line)] print:border-gray-200">
                  <span className="text-[var(--paper)] print:text-black font-medium">{sec.name}</span>
                  <span className="text-[var(--brass)] print:text-amber-800 font-bold">%{sec.percentage.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Varlık Dağılım Tablosu */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[var(--paper)] print:text-black">
              Pozisyon Kütüğü &amp; Getiri Karnesi
            </h4>
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[var(--line)] print:border-black text-[var(--mist)] print:text-gray-700">
                  <th className="py-2">Varlık</th>
                  <th className="py-2">Kategori</th>
                  <th className="py-2 text-right">Adet</th>
                  <th className="py-2 text-right">Piyasa Değeri</th>
                  <th className="py-2 text-right">Ağırlık %</th>
                  <th className="py-2 text-right">Net Kâr / Zarar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] print:divide-gray-200">
                {xray.holdings.map((h: any) => (
                  <tr key={h.symbol}>
                    <td className="py-2 font-bold text-[var(--paper)] print:text-black">
                      {h.symbol} <span className="text-[10px] font-normal text-[var(--mist)] print:text-gray-500">({h.name})</span>
                    </td>
                    <td className="py-2 text-[var(--mist)] print:text-gray-600 uppercase">{h.category}</td>
                    <td className="py-2 text-right text-[var(--paper)] print:text-black">{h.totalQuantity.toLocaleString("tr-TR")}</td>
                    <td className="py-2 text-right font-medium text-[var(--paper)] print:text-black">{h.totalCurrentValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺</td>
                    <td className="py-2 text-right font-bold text-[var(--brass)] print:text-black">%{h.weightPct.toFixed(1)}</td>
                    <td className={`py-2 text-right font-bold ${h.unrealizedProfitLoss >= 0 ? "text-emerald-400 print:text-emerald-700" : "text-rose-400 print:text-red-700"}`}>
                      {h.unrealizedProfitLoss >= 0 ? "+" : ""}{h.unrealizedProfitLoss.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺ (%{h.unrealizedProfitLossPct.toFixed(1)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Alt Dipnot */}
          <div className="pt-4 border-t border-[var(--line)] print:border-gray-400 flex items-center justify-between text-[10px] font-mono text-[var(--mist)] print:text-gray-500">
            <span>Defter Finansal Zeka Platformu tarafından üretilmiştir.</span>
            <span>Yatırım tavsiyesi niteliğinde değildir.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
