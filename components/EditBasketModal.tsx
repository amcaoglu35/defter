"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Plus, Trash2, Sliders, Check, Sparkles, DollarSign, Scale, RefreshCw, AlertTriangle } from "lucide-react";
import { useDefterStore } from "@/lib/store";
import { Basket, BasketHolding, Company } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import CompanyCombobox from "@/components/CompanyCombobox";
import ConfirmModal from "@/components/ConfirmModal";

interface EditBasketModalProps {
  basket: Basket;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditBasketModal({
  basket,
  isOpen,
  onClose,
}: EditBasketModalProps) {
  const {
    companies,
    addHoldingToBasket,
    removeHoldingFromBasket,
    updateHolding,
    updateBasket,
    addTransaction,
  } = useDefterStore();
  const { showToast } = useToast();

  // Basket Metadata State
  const [basketName, setBasketName] = useState(basket.name);
  const [basketSubtitle, setBasketSubtitle] = useState(basket.subtitle || "");
  const [basketRiskLevel, setBasketRiskLevel] = useState<"Düşük" | "Orta" | "Yüksek">(basket.riskLevel || "Orta");
  const [isMetaDirty, setIsMetaDirty] = useState(false);

  useEffect(() => {
    setBasketName(basket.name);
    setBasketSubtitle(basket.subtitle || "");
    setBasketRiskLevel(basket.riskLevel || "Orta");
    setIsMetaDirty(false);
  }, [basket]);

  const [selectedAddSymbol, setSelectedAddSymbol] = useState("");
  const [addQty, setAddQty] = useState("10");
  const [addCost, setAddCost] = useState("");
  const [addWeight, setAddWeight] = useState("20");

  // Confirm delete holding state
  const [holdingToDelete, setHoldingToDelete] = useState<BasketHolding | null>(null);

  // Keep cost in sync when selecting a company if cost wasn't manually set
  useEffect(() => {
    if (selectedAddSymbol) {
      const co = companies.find((c) => c.symbol.toUpperCase() === selectedAddSymbol.toUpperCase());
      if (co && !addCost) {
        setAddCost(co.price.toString());
      }
    }
  }, [companies, selectedAddSymbol, addCost]);

  const handleSelectCompany = (co: Company) => {
    setSelectedAddSymbol(co.symbol);
    setAddCost(co.price.toString());
  };

  const totalTargetWeight = useMemo(() => {
    return basket.holdings.reduce((acc, h) => acc + (h.targetWeightPercent ?? h.weightPercent ?? 0), 0);
  }, [basket.holdings]);

  if (!isOpen) return null;

  const currentCo = companies.find((c) => c.symbol === selectedAddSymbol);
  const parsedQty = parseFloat(addQty) || 0;
  const parsedCost = parseFloat(addCost) || currentCo?.price || 0;
  const estimatedTotal = parsedQty * (currentCo ? currentCo.price : parsedCost);

  const handleSaveMeta = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!basketName.trim()) {
      showToast("Hata", "Sepet adı boş bırakılamaz.", "error");
      return;
    }

    const riskColor: "low" | "mid" | "high" =
      basketRiskLevel === "Düşük" ? "low" : basketRiskLevel === "Orta" ? "mid" : "high";

    updateBasket(basket.id, {
      name: basketName.trim(),
      subtitle: basketSubtitle.trim(),
      riskLevel: basketRiskLevel,
      riskColor,
      description: basketSubtitle.trim() || basket.description,
    });

    setIsMetaDirty(false);
    showToast("Sepet Güncellendi", "Sepet adı, açıklaması ve risk seviyesi kaydedildi.", "success");
  };

  const handleClose = () => {
    if (isMetaDirty && basketName.trim()) {
      handleSaveMeta();
    }
    onClose();
  };

  const handleNormalizeWeights = () => {
    if (basket.holdings.length === 0 || totalTargetWeight <= 0) return;
    
    // Scale each holding target weight so total is 100%
    basket.holdings.forEach((h) => {
      const currentVal = h.targetWeightPercent ?? h.weightPercent ?? 0;
      const scaled = Math.round(((currentVal / totalTargetWeight) * 100) * 10) / 10;
      updateHolding(basket.id, h.companySymbol, { targetWeightPercent: scaled });
    });

    showToast(
      "Hedef Ağırlıklar Normalize Edildi",
      "Sepet içi tüm varlıkların hedef ağırlıkları %100 toplamına göre eşitlendi.",
      "success"
    );
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCo || parsedQty <= 0) return;

    const targetW = parseFloat(addWeight) || 20;

    addHoldingToBasket(basket.id, {
      companySymbol: currentCo.symbol,
      quantity: parsedQty,
      weightPercent: 0,
      targetWeightPercent: targetW,
      avgCost: parsedCost,
      currentPrice: currentCo.price,
    });

    showToast(
      "Varlık Eklendi",
      `${currentCo.symbol} (${parsedQty} Lot @ ${parsedCost.toFixed(2)} ₺) ${basketName} sepetine eklendi.`,
      "success"
    );

    // Reset inputs
    setAddQty("10");
  };

  const handleConfirmDeleteHolding = () => {
    if (!holdingToDelete) return;

    const price = holdingToDelete.currentPrice || holdingToDelete.avgCost || 0;
    const totalAmount = holdingToDelete.quantity * price;

    // 1. Record SELL transaction for audit trail
    addTransaction(
      {
        companySymbol: holdingToDelete.companySymbol,
        type: "SELL",
        quantity: holdingToDelete.quantity,
        price: price,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        date: new Date().toISOString().split("T")[0],
        note: `${basketName} sepetinden varlık tasfiyesi / çıkarma`,
      },
      basket.id
    );

    // 2. Remove from basket
    removeHoldingFromBasket(basket.id, holdingToDelete.companySymbol);

    showToast(
      "Varlık Sepetten Çıkarıldı",
      `${holdingToDelete.companySymbol} (${holdingToDelete.quantity} Lot) sepetten çıkarıldı ve ${price.toFixed(2)} ₺ fiyattan Satış işlemi olarak kütüğe işlendi.`,
      "success"
    );

    setHoldingToDelete(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
          {/* Head */}
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[var(--paper)]">
                Sepeti Düzenle — {basketName}
              </h3>
              <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
                Sepet kimliği, strateji açıklaması, risk seviyesi ve varlık dağılımını yönetin.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-[var(--mist)] hover:text-[var(--paper)] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. Basket Metadata (Name, Subtitle, Risk Level) */}
          <div className="p-4 bg-[var(--ink-3)] border border-[var(--line)] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Sepet Bilgileri &amp; Risk Seviyesi</span>
              </h4>
              {isMetaDirty && (
                <span className="text-[10px] font-mono text-[var(--brass)] bg-[rgba(201,162,75,0.15)] px-2 py-0.5 rounded border border-[var(--brass-dim)]">
                  Kaydedilmemiş Değişiklikler Var
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                  Sepet Adı
                </label>
                <input
                  type="text"
                  required
                  value={basketName}
                  onChange={(e) => {
                    setBasketName(e.target.value);
                    setIsMetaDirty(true);
                  }}
                  placeholder="Örn: BIST Temettü Kalesi"
                  className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-2 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                  Alt Başlık / Strateji Özeti
                </label>
                <input
                  type="text"
                  value={basketSubtitle}
                  onChange={(e) => {
                    setBasketSubtitle(e.target.value);
                    setIsMetaDirty(true);
                  }}
                  placeholder="Örn: Yüksek temettü ve defansif büyüme"
                  className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded-lg p-2 text-xs text-[var(--paper)] font-mono focus:border-[var(--brass)] outline-none shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                Risk Seviyesi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Düşük", "Orta", "Yüksek"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setBasketRiskLevel(lvl);
                      setIsMetaDirty(true);
                    }}
                    className={`py-1.5 text-xs font-mono rounded-md border transition-all cursor-pointer ${
                      basketRiskLevel === lvl
                        ? "border-[var(--brass)] bg-[var(--brass)] text-[var(--ink)] font-bold shadow"
                        : "border-[var(--line)] text-[var(--mist)] bg-[var(--ink-2)] hover:text-[var(--paper)]"
                    }`}
                  >
                    {lvl} Risk
                  </button>
                ))}
              </div>
            </div>

            {isMetaDirty && (
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveMeta()}
                  className="px-3 py-1.5 bg-[var(--brass)] text-[var(--ink)] font-bold font-mono text-xs rounded hover:bg-[#d9b35a] shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Sepet Bilgilerini Kaydet</span>
                </button>
              </div>
            )}
          </div>

          {/* Existing Holdings List */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h4 className="font-mono text-xs text-[var(--brass)] uppercase tracking-wider font-semibold">
                  Mevcut Varlıklar ({basket.holdings.length})
                </h4>
                <span
                  className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold border ${
                    Math.round(totalTargetWeight) === 100
                      ? "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]"
                      : "bg-[rgba(201,162,75,0.15)] text-[var(--brass)] border-[var(--brass-dim)]"
                  }`}
                >
                  Toplam Hedef: %{totalTargetWeight.toFixed(1)} {Math.round(totalTargetWeight) === 100 ? "✓" : "(!)"}
                </span>
              </div>

              {basket.holdings.length > 0 && Math.round(totalTargetWeight) !== 100 && (
                <button
                  type="button"
                  onClick={handleNormalizeWeights}
                  className="font-mono text-[11px] bg-[var(--ink-3)] hover:bg-[var(--ink)] text-[var(--brass)] border border-[var(--brass-dim)] px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all shadow"
                  title="Tüm varlıkların hedef yüzdelerini oransal olarak %100'e dengeler"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Hedefleri %100'e Normalize Et</span>
                </button>
              )}
            </div>

            {basket.holdings.length === 0 ? (
              <p className="text-xs text-[var(--mist)] py-4 text-center border border-dashed border-[var(--line)] rounded">
                Bu sepette henüz varlık yok. Aşağıdan arama yaparak yeni hisse ekleyebilirsiniz.
              </p>
            ) : (
              <div className="divide-y divide-dashed divide-[var(--line)] border border-[var(--line)] rounded-lg p-3 bg-[var(--ink-3)] max-h-64 overflow-y-auto space-y-1">
                {basket.holdings.map((h) => {
                  const targetW = h.targetWeightPercent ?? h.weightPercent;
                  return (
                    <div
                      key={h.companySymbol}
                      className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--paper)] text-sm">
                            {h.companySymbol}
                          </span>
                          <span className="text-[11px] text-[var(--mist)]">
                            Anlık: {((h.quantity || 0) * (h.currentPrice || h.avgCost)).toLocaleString("tr-TR")} ₺
                          </span>
                          <span className="bg-[var(--ink-2)] text-[var(--brass)] border border-[var(--line)] px-1.5 py-0.2 text-[10px] rounded">
                            Güncel: %{h.weightPercent}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--mist)] mt-1">
                          <label className="flex items-center gap-1">
                            <span>Adet:</span>
                            <input
                              type="number"
                              min="1"
                              value={h.quantity}
                              onChange={(e) =>
                                updateHolding(basket.id, h.companySymbol, {
                                  quantity: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-16 bg-[var(--ink-2)] border border-[var(--line)] rounded px-1.5 py-0.5 text-center text-[var(--paper)] outline-none"
                            />
                          </label>

                          <label className="flex items-center gap-1">
                            <span>Maliyet:</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={h.avgCost}
                              onChange={(e) =>
                                updateHolding(basket.id, h.companySymbol, {
                                  avgCost: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-18 bg-[var(--ink-2)] border border-[var(--line)] rounded px-1.5 py-0.5 text-center text-[var(--paper)] outline-none"
                            />
                            <span>₺</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {/* Target Weight Input */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[var(--mist)] uppercase">Hedef:</span>
                          <span className="text-[10px] text-[var(--mist)]">%</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={targetW}
                            onChange={(e) =>
                              updateHolding(basket.id, h.companySymbol, {
                                targetWeightPercent: parseFloat(e.target.value) || 0,
                              })
                            }
                            title="Hedef ağırlık yüzdesi — Orakul rebalance bu hedefe göre alım/satım önerir"
                            className="w-14 bg-[var(--ink-2)] border border-[var(--brass-dim)] rounded px-1.5 py-1 text-right text-[var(--brass)] font-bold outline-none focus:border-[var(--brass)]"
                          />
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => setHoldingToDelete(h)}
                          className="text-[var(--mist)] hover:text-[var(--loss)] p-1.5 transition-colors cursor-pointer rounded hover:bg-[rgba(163,59,59,0.1)]"
                          title="Sepetten Çıkar (Satış kaydı oluşturur)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modern Add Holding Form with CompanyCombobox */}
          <form
            onSubmit={handleAddHolding}
            className="bg-[var(--ink-3)] border border-[var(--brass-dim)] p-4 rounded-xl space-y-4 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--brass)] uppercase font-semibold">
                <Plus className="w-4 h-4" />
                <span>Sepete Yeni Şirket / Varlık Ekle</span>
              </div>
              {currentCo && (
                <span className="font-mono text-xs text-[var(--verdigris)] font-bold">
                  Piyasa Değeri: ~{estimatedTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </span>
              )}
            </div>

            {/* Search-as-you-type Combobox */}
            <CompanyCombobox
              companies={companies}
              selectedSymbol={selectedAddSymbol}
              onSelect={handleSelectCompany}
              label="Şirket / Varlık Arayın veya Seçin"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono text-[var(--mist)] uppercase">
                    Adet (Lot)
                  </label>
                  {/* Quick lot increment chips */}
                  <div className="flex items-center gap-1">
                    {[10, 50, 100].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setAddQty(quick.toString())}
                        className="text-[10px] font-mono px-1 py-0.5 rounded bg-[var(--ink-2)] hover:bg-[var(--ink)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--brass)] cursor-pointer"
                      >
                        +{quick}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={addQty}
                  onChange={(e) => setAddQty(e.target.value)}
                  className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                  Alış Maliyeti (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={addCost}
                  onChange={(e) => setAddCost(e.target.value)}
                  placeholder={currentCo?.price.toString() || "0.00"}
                  className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[var(--mist)] uppercase mb-1">
                  Hedef Ağırlık (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={addWeight}
                  onChange={(e) => setAddWeight(e.target.value)}
                  className="w-full bg-[var(--ink-2)] border border-[var(--line)] rounded p-2 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedAddSymbol || !currentCo || parsedQty <= 0}
              className="w-full bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>
                {selectedAddSymbol ? `${selectedAddSymbol} (${addQty} Lot) Sepete Ekle` : "Sepete Eklemek İçin Varlık Seçin"}
              </span>
            </button>
          </form>

          {/* Close */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] text-xs font-mono px-5 py-2.5 rounded cursor-pointer"
            >
              Tamamla &amp; Kapat
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Removing a Holding with SELL transaction */}
      <ConfirmModal
        isOpen={!!holdingToDelete}
        onClose={() => setHoldingToDelete(null)}
        onConfirm={handleConfirmDeleteHolding}
        title="Varlığı Sepetten Çıkar"
        description={
          holdingToDelete ? (
            <div className="space-y-2">
              <p>
                <strong className="text-[var(--paper)]">{holdingToDelete.companySymbol}</strong> ({holdingToDelete.quantity} Lot) varlığını <strong className="text-[var(--paper)]">{basket.name}</strong> sepetinden çıkarmak istediğinize emin misiniz?
              </p>
              <div className="bg-[var(--ink-3)] p-2.5 rounded border border-[var(--line)] text-[11px] font-mono text-[var(--brass)]">
                ℹ️ İşlem geçmişinin ve kâr/zarar hesabının bozulmaması için bu pozisyon <strong>{(holdingToDelete.currentPrice || holdingToDelete.avgCost || 0).toFixed(2)} ₺</strong> güncel fiyattan bir <strong>SATIŞ (SELL)</strong> işlemi olarak kütüğe işlenecektir.
              </div>
            </div>
          ) : ""
        }
        confirmText="Varlığı Çıkar & Satışı Kaydet"
        cancelText="Vazgeç"
        variant="danger"
      />
    </>
  );
}
