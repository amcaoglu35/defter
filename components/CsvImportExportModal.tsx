"use client";

import React, { useState } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  HelpCircle,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface CsvImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CsvImportExportModal({
  isOpen,
  onClose,
}: CsvImportExportModalProps) {
  const { baskets, companies, addTransaction } = useDefterStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [brokerType, setBrokerType] = useState<"general" | "midas" | "isbank" | "garanti">("general");
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [selectedBasketId, setSelectedBasketId] = useState<string>(
    baskets[0]?.id || ""
  );

  if (!isOpen) return null;

  // CSV Dışa Aktarma
  const handleExportCsv = () => {
    let csv = "Sembol,Sirket Adi,Adet,Maliyet,Piyasa Fiyati,Piyasa Degeri,Varlik Sinifi,Sepet\n";

    baskets.forEach((b) => {
      b.holdings?.forEach((h) => {
        const c = companies.find((comp) => comp.symbol === h.companySymbol);
        const price = c?.price || h.avgCost || 0;
        const val = (h.quantity || 0) * price;
        csv += `"${h.companySymbol}","${c?.name || h.companySymbol}",${h.quantity},${h.avgCost},${price},${val},"${c?.assetClass || "hisse"}","${b.name}"\n`;
      });
    });

    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `defter-portfoy-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Portföy Dışa Aktarıldı", "CSV dosyası başarıyla indirildi.", "success");
  };

  // CSV Dosyası Seçme
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  // CSV Ayrıştırma
  const parseCsv = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return;

    const parsed: any[] = [];
    // Basit CSV parser: Sembol, Tip, Adet, Fiyat, Tarih
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.replace(/"/g, "").trim());
      if (parts.length >= 4) {
        const symbol = parts[0]?.toUpperCase();
        const type: "BUY" | "SELL" = parts[1]?.toLowerCase().includes("sat") || parts[1]?.toUpperCase() === "SELL" ? "SELL" : "BUY";
        const quantity = parseFloat(parts[2]) || 0;
        const price = parseFloat(parts[3]) || 0;
        const date = parts[4] || new Date().toISOString().slice(0, 10);

        if (symbol && quantity > 0 && price > 0) {
          parsed.push({ symbol, type, quantity, price, date });
        }
      }
    }
    setParsedRows(parsed);
  };

  // İçe Aktarmayı Onayla
  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;

    parsedRows.forEach((row) => {
      addTransaction({
        basketId: selectedBasketId,
        companySymbol: row.symbol,
        type: row.type,
        quantity: row.quantity,
        price: row.price,
        totalAmount: row.quantity * row.price,
        date: row.date,
        note: `CSV İçe Aktarma (${brokerType.toUpperCase()})`,
      });
    });

    showToast(
      "İşlemler Aktarıldı",
      `${parsedRows.length} adet işlem başarıyla kütüğe eklendi.`,
      "success"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[var(--paper)]">
                CSV & Excel İçe / Dışa Aktarma
              </h3>
              <p className="text-xs text-[var(--muted)]">Aracı kurum ekstrelerini kütüğe aktarın.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--paper)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex items-center gap-2 p-1 bg-[var(--ink)]/60 rounded-lg border border-[var(--line)]">
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "import"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)]"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            İçe Aktar (Import)
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "export"
                ? "bg-[var(--brass)] text-[var(--ink)] font-bold shadow-xs"
                : "text-[var(--muted)]"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Dışa Aktar (Export)
          </button>
        </div>

        {/* İÇE AKTAR */}
        {activeTab === "import" && (
          <div className="space-y-4">
            {/* Hedef Sepet */}
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--muted)]">İşlemlerin Ekleneceği Sepet:</label>
              <select
                value={selectedBasketId}
                onChange={(e) => setSelectedBasketId(e.target.value)}
                className="w-full bg-[var(--ink)]/70 border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--brass)]"
              >
                {baskets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dosya Yükleme Alanı */}
            <div className="border-2 border-dashed border-[var(--line)] hover:border-[var(--brass)] rounded-xl p-6 text-center space-y-2 cursor-pointer relative bg-[var(--ink)]/20 transition-all">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-[var(--muted)] mx-auto opacity-50" />
              <p className="text-xs font-medium text-[var(--paper)]">
                CSV Dosyasını Sürükleyin veya Seçin
              </p>
              <p className="text-[10px] text-[var(--muted)]">
                Format: Sembol, İşlem Tipi (BUY/SELL), Adet, Fiyat, Tarih
              </p>
            </div>

            {/* Ayrıştırılan Veri Önizlemesi */}
            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)]">Bulunan İşlem Sayısı:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {parsedRows.length} İşlem
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto border border-[var(--line)] rounded-lg p-2 bg-[var(--ink)]/40 divide-y divide-[var(--line)]/30 text-xs">
                  {parsedRows.slice(0, 5).map((row, idx) => (
                    <div key={idx} className="py-1 flex justify-between font-mono text-[11px]">
                      <span>
                        {row.symbol} ({row.type === "BUY" ? "ALIŞ" : "SATIŞ"})
                      </span>
                      <span>
                        {row.quantity} Adet @ {row.price} ₺
                      </span>
                    </div>
                  ))}
                  {parsedRows.length > 5 && (
                    <p className="text-[10px] text-[var(--muted)] pt-1 text-center">
                      ... ve {parsedRows.length - 5} işlem daha
                    </p>
                  )}
                </div>

                <button
                  onClick={handleConfirmImport}
                  className="w-full py-2 rounded-lg bg-[var(--brass)] text-[var(--ink)] font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
                >
                  {parsedRows.length} İşlemi Kütüğe Kaydet
                </button>
              </div>
            )}
          </div>
        )}

        {/* DIŞA AKTAR */}
        {activeTab === "export" && (
          <div className="space-y-4">
            <p className="text-xs text-[var(--muted)]">
              Tüm sepetlerinizi, varlık adetlerini, ortalama maliyetleri ve güncel piyasa değerlerini Excel ve Google E-Tablolar uyumlu CSV olarak indirin.
            </p>

            <button
              onClick={handleExportCsv}
              className="w-full py-2.5 rounded-lg bg-[var(--brass)] text-[var(--ink)] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Tüm Portföyü CSV Olarak İndir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
