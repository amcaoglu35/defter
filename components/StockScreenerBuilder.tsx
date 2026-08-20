"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  Layers,
  TrendingUp,
  Coins,
  Shield,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Company } from "@/lib/mockData";
import {
  ScreenerCriterion,
  ScreenerField,
  ScreenerOperator,
  runScreener,
} from "@/lib/stockScreener";

interface StockScreenerBuilderProps {
  companies: Company[];
  onFilteredResults?: (results: Company[]) => void;
  onClose?: () => void;
}

const FIELD_LABELS: Record<ScreenerField, string> = {
  peRatio: "Fiyat / Kazanç (F/K)",
  pbRatio: "Piyasa / Defter Değeri (PD/DD)",
  dividendYield: "Temettü Verimi (%)",
  marketCap: "Piyasa Değeri",
  dailyChange: "Günlük Değişim (%)",
  price: "Hisse Fiyatı",
  returnOnEquity: "Özkaynak Kârlılığı (ROE %)",
  beta: "Beta Katsayısı",
  sector: "Sektör",
  exchange: "Borsa / Pazar",
  rsi: "RSI (14)",
};

const OPERATOR_LABELS: Record<ScreenerOperator, string> = {
  LT: "< Küçük",
  LTE: "≤ Küçük veya Eşit",
  GT: "> Büyük",
  GTE: "≥ Büyük veya Eşit",
  EQ: "= Eşit",
  IN: "İçinde",
};

const PRESET_SCREENS: Array<{
  name: string;
  desc: string;
  icon: typeof Coins;
  criteria: ScreenerCriterion[];
}> = [
  {
    name: "💎 Derin Değer & İskonto",
    desc: "F/K < 10 ve PD/DD < 2.0 ucuz çarpanlı varlıklar",
    icon: Coins,
    criteria: [
      { id: "1", field: "peRatio", operator: "LT", value: 10 },
      { id: "2", field: "pbRatio", operator: "LT", value: 2.0 },
    ],
  },
  {
    name: "💰 Temettü Şampiyonları",
    desc: "Yıllık temettü verimi %4'ün üzerindeki nakit akış devleri",
    icon: Coins,
    criteria: [{ id: "1", field: "dividendYield", operator: "GT", value: 4 }],
  },
  {
    name: "🚀 Yüksek Kârlılık (ROE > %25)",
    desc: "Özkaynak kârlılığı yüksek kaliteli büyüme şirketleri",
    icon: TrendingUp,
    criteria: [{ id: "1", field: "returnOnEquity", operator: "GT", value: 25 }],
  },
  {
    name: "🛡️ Düşük Beta (Defansif)",
    desc: "Beta < 0.90 piyasa dalgalanmalarına dirençli hisseler",
    icon: Shield,
    criteria: [{ id: "1", field: "beta", operator: "LT", value: 0.9 }],
  },
];

export function StockScreenerBuilder({
  companies,
  onFilteredResults,
  onClose,
}: StockScreenerBuilderProps) {
  const router = useRouter();
  const [criteria, setCriteria] = useState<ScreenerCriterion[]>([
    { id: "c-1", field: "peRatio", operator: "LT", value: 15 },
    { id: "c-2", field: "dividendYield", operator: "GT", value: 2 },
  ]);

  const [sortBy, setSortBy] = useState<"peRatio" | "dividendYield" | "marketCap" | "dailyChange" | "price">("peRatio");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Available sectors in current company universe
  const availableSectors = useMemo(() => {
    return Array.from(new Set(companies.map((c) => c.sector).filter(Boolean))).sort();
  }, [companies]);

  // Instantaneous Client-side Screener execution
  const matchedCompanies = useMemo(() => {
    const results = runScreener(companies, {
      criteria,
      sortBy,
      sortDir,
    });
    if (onFilteredResults) {
      onFilteredResults(results);
    }
    return results;
  }, [companies, criteria, sortBy, sortDir, onFilteredResults]);

  const handleAddCriterion = () => {
    const newId = `crit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setCriteria((prev) => [
      ...prev,
      { id: newId, field: "peRatio", operator: "LT", value: 20 },
    ]);
  };

  const handleRemoveCriterion = (id?: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCriterion = (
    id: string,
    field: ScreenerField,
    operator: ScreenerOperator,
    value: number | string
  ) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, field, operator, value } : c))
    );
  };

  const handleApplyPreset = (presetCriteria: ScreenerCriterion[]) => {
    setCriteria(presetCriteria);
  };

  const handleAskOrakul = () => {
    const querySummary = criteria
      .map((c) => `${FIELD_LABELS[c.field]} ${OPERATOR_LABELS[c.operator]} ${c.value}`)
      .join(" ve ");
    router.push(
      `/orakul?category=strategy&tab=screener&query=${encodeURIComponent(querySummary)}`
    );
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-5 font-mono text-xs shadow-xl animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🎯 Çok Kriterli Deterministik Hisse Tarayıcısı
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              0 ms Gecikmeli, yapay zeka maliyetsiz kesin filtreleme motoru
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAskOrakul}
            className="px-3 py-1.5 rounded bg-[var(--brass-glow)] border border-[var(--brass-dim)] text-[var(--brass)] font-bold text-xs flex items-center gap-1.5 hover:text-[var(--paper)] transition-colors cursor-pointer"
            title="Bu kriterleri ve çıkan sonuçları Orakul AI analizine aktar"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--brass)]" />
            <span>🔮 Bunu Orakul&apos;a Sor</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--mist)] hover:text-[var(--paper)] p-1 rounded transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick Filters */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-[var(--mist)] uppercase tracking-wider font-semibold block">
          ⚡ Hazır Tarama Şablonları:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_SCREENS.map((preset, pIdx) => {
            const Icon = preset.icon;
            return (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleApplyPreset(preset.criteria)}
                className="px-3 py-1.5 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass-dim)] text-[11px] text-[var(--paper)] hover:text-[var(--brass)] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Icon className="w-3 h-3 text-[var(--brass)]" />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Criteria List */}
      <div className="space-y-2.5 bg-[var(--ink-3)] p-4 rounded-xl border border-[var(--line)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[var(--brass)] font-bold uppercase tracking-wider">
            Aktif Filtre Kuralları (VE / AND Mantığı):
          </span>
          <button
            type="button"
            onClick={handleAddCriterion}
            className="px-2.5 py-1 rounded bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-[11px] flex items-center gap-1 transition-all shadow cursor-pointer active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>Kriter Ekle</span>
          </button>
        </div>

        {criteria.length === 0 ? (
          <div className="p-4 text-center text-[var(--mist)] text-xs font-sans">
            Tüm filtreler temizlendi. Kütükteki tüm şirketler listeleniyor.
          </div>
        ) : (
          <div className="space-y-2">
            {criteria.map((crit) => (
              <div
                key={crit.id}
                className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-[var(--ink-2)] border border-[var(--line)]"
              >
                {/* Field Selector */}
                <select
                  value={crit.field}
                  onChange={(e) =>
                    handleUpdateCriterion(
                      crit.id!,
                      e.target.value as ScreenerField,
                      crit.operator,
                      crit.value as number
                    )
                  }
                  className="bg-[var(--ink-3)] border border-[var(--line)] rounded px-2.5 py-1.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)]"
                >
                  {(Object.keys(FIELD_LABELS) as ScreenerField[]).map((fKey) => (
                    <option key={fKey} value={fKey}>
                      {FIELD_LABELS[fKey]}
                    </option>
                  ))}
                </select>

                {/* Operator Selector */}
                <select
                  value={crit.operator}
                  onChange={(e) =>
                    handleUpdateCriterion(
                      crit.id!,
                      crit.field,
                      e.target.value as ScreenerOperator,
                      crit.value as number
                    )
                  }
                  className="bg-[var(--ink-3)] border border-[var(--line)] rounded px-2.5 py-1.5 text-xs text-[var(--brass)] font-mono outline-none focus:border-[var(--brass)]"
                >
                  {(Object.keys(OPERATOR_LABELS) as ScreenerOperator[]).map((opKey) => (
                    <option key={opKey} value={opKey}>
                      {OPERATOR_LABELS[opKey]}
                    </option>
                  ))}
                </select>

                {/* Value Input */}
                {crit.field === "sector" ? (
                  <select
                    value={String(crit.value)}
                    onChange={(e) =>
                      handleUpdateCriterion(crit.id!, crit.field, crit.operator, e.target.value)
                    }
                    className="bg-[var(--ink-3)] border border-[var(--line)] rounded px-2.5 py-1.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)] flex-1 min-w-[120px]"
                  >
                    {availableSectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    step="any"
                    value={crit.value as number}
                    onChange={(e) =>
                      handleUpdateCriterion(
                        crit.id!,
                        crit.field,
                        crit.operator,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Değer..."
                    className="bg-[var(--ink-3)] border border-[var(--line)] rounded px-2.5 py-1.5 text-xs text-[var(--paper)] font-mono outline-none focus:border-[var(--brass)] w-24"
                  />
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveCriterion(crit.id)}
                  className="text-[var(--mist)] hover:text-[var(--loss)] p-1 rounded transition-colors cursor-pointer ml-auto"
                  title="Kriteri Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[var(--ink-3)] rounded-xl border border-[var(--line)]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--verdigris)]" />
          <span className="font-bold text-[var(--paper)]">
            Eşleşen Varlık Sayısı:{" "}
            <span className="text-[var(--verdigris)] font-serif text-sm">
              {matchedCompanies.length}
            </span>{" "}
            / {companies.length}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--mist)]">Sırala:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[var(--ink-2)] border border-[var(--line)] rounded px-2 py-1 text-xs text-[var(--paper)] font-mono outline-none"
          >
            <option value="peRatio">F/K Oranı</option>
            <option value="dividendYield">Temettü Verimi</option>
            <option value="dailyChange">Günlük Değişim</option>
            <option value="marketCap">Piyasa Değeri</option>
            <option value="price">Fiyat</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="px-2 py-1 rounded bg-[var(--ink-2)] border border-[var(--line)] text-xs text-[var(--brass)] cursor-pointer"
          >
            {sortDir === "asc" ? "Artan ↑" : "Azalan ↓"}
          </button>
        </div>
      </div>
    </div>
  );
}
