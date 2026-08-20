"use client";

import React, { useState } from "react";
import {
  Users,
  Sparkles,
  Shield,
  Brain,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Award,
  Scale,
  Target,
  FileCheck,
} from "lucide-react";
import { MultiAgentCommitteeReport, AgentDebateOpinion } from "@/lib/multiAgentEngine";
import { Company } from "@/lib/mockData";
import { useDefterStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

interface AiAgentCommitteeCardProps {
  company: Company;
  initialReport?: MultiAgentCommitteeReport | null;
  priceHistoryCloses?: number[];
}

export function AiAgentCommitteeCard({
  company,
  initialReport,
  priceHistoryCloses = [],
}: AiAgentCommitteeCardProps) {
  const { aiApiKey, aiProvider, geminiModel } = useDefterStore();
  const { showToast } = useToast();

  const [report, setReport] = useState<MultiAgentCommitteeReport | null>(initialReport || null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAgentIndex, setExpandedAgentIndex] = useState<number | null>(null);

  const handleRunCommittee = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai-tools/agent-debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          priceHistoryCloses,
          provider: aiProvider,
          model: geminiModel,
          apiKey: aiApiKey,
        }),
      });

      if (!res.ok) {
        throw new Error("Yatırım komitesi toplantısı başlatılamadı");
      }

      const json = await res.json();
      if (json.success && json.data) {
        setReport(json.data);
        showToast(
          "Yatırım Komitesi Raporu Hazır",
          `${company.symbol} için 10 uzman ajanın oybirliği kararı tescillendi.`,
          "success"
        );
      }
    } catch (err) {
      showToast(
        "Hata",
        err instanceof Error ? err.message : "Komite analizi sırasında bir hata oluştu",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "GÜÇLÜ AL":
      case "AL":
        return "bg-[rgba(91,140,123,0.15)] text-[var(--verdigris)] border-[var(--verdigris)]";
      case "GÜÇLÜ SAT":
      case "SAT":
        return "bg-[rgba(163,59,59,0.15)] text-[var(--loss)] border-[var(--loss)]";
      default:
        return "bg-[var(--brass-glow)] text-[var(--brass)] border-[var(--brass-dim)]";
    }
  };

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-6 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-[var(--paper)]">
                🏛️ 10 Ajanlı Yatırım Komitesi Münazarası
              </h3>
              <span className="font-mono text-[10px] text-[var(--brass)] bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-0.5 rounded font-bold">
                FinGPT Multi-Agent Engine
              </span>
            </div>
            <p className="text-[11px] text-[var(--mist)] mt-0.5">
              Temel, Teknik, Makro, Risk ve Portföy Yöneticisi ajanlarının sıralı münazara ve oy matrisi
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunCommittee}
          disabled={isLoading}
          className="px-4 py-2 rounded bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Komite Toplanıyor..." : report ? "Komiteyi Yeniden Topla" : "10 Ajanlı Komiteyi Başlat"}</span>
        </button>
      </div>

      {!report && !isLoading && (
        <div className="p-8 text-center bg-[var(--ink-3)] border border-dashed border-[var(--line)] rounded-xl space-y-3">
          <Brain className="w-8 h-8 text-[var(--brass)] mx-auto opacity-70" />
          <h4 className="font-serif text-base font-bold text-[var(--paper)]">
            {company.symbol} İçin Komite Kararı Bekleniyor
          </h4>
          <p className="text-xs text-[var(--mist)] max-w-md mx-auto font-sans leading-relaxed">
            Temel Analist, Teknik Kantitatifçi, KAP Duyarlılık Uzmanı, Boğa/Ayı münazara ajanları ve Portföy Yöneticisi (CIO) dahil 10 yapay zeka ajanının analizini başlatmak için yukarıdaki butona tıklayın.
          </p>
        </div>
      )}

      {report && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top KPI Consensus Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] uppercase block">Komite Konsensüsü</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getVerdictBadge(report.consensusVerdict)}`}>
                  {report.consensusVerdict}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--brass)] shadow-sm">
              <span className="text-[10px] text-[var(--brass)] uppercase font-bold block">Ağırlıklı Komite Skoru</span>
              <span className="font-serif text-lg font-bold text-[var(--paper)] block mt-0.5">
                {report.overallScore} <span className="text-xs font-mono text-[var(--mist)]">/ 100</span>
              </span>
            </div>

            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
              <span className="text-[10px] text-[var(--verdigris)] uppercase font-bold block">Önerilen Portföy Payı</span>
              <span className="font-serif text-lg font-bold text-[var(--verdigris)] block mt-0.5">
                %{report.actionableRecommendation.recommendedPositionSizePct}
              </span>
            </div>

            <div className="p-3 bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
              <span className="text-[10px] text-[var(--mist)] uppercase block">12 Aylık Hedef Fiyat</span>
              <span className="font-serif text-lg font-bold text-[var(--paper)] block mt-0.5">
                {report.targetPrice12M ? `${report.targetPrice12M} ${company.currency || "₺"}` : "—"}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 bg-[var(--ink-3)] rounded-xl border border-[rgba(201,162,75,0.3)] space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--brass)] font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Komite Başkanı (CIO) Yönetici Özeti</span>
            </div>
            <p className="font-sans text-xs text-[var(--paper-dim)] leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>

          {/* 10-Agent Grid / Opinion Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <span className="text-[11px] font-bold text-[var(--paper)] uppercase tracking-wider">
                👥 10 Ajanın Münazara &amp; Oy Dağılımı
              </span>
              <span className="text-[10px] text-[var(--mist)]">
                Detay için ajanın üzerine tıklayın
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.opinions.map((agent: AgentDebateOpinion, idx: number) => {
                const isExpanded = expandedAgentIndex === idx;

                return (
                  <div
                    key={agent.agentName}
                    onClick={() => setExpandedAgentIndex(isExpanded ? null : idx)}
                    className="p-3.5 bg-[var(--ink-3)] border border-[var(--line)] hover:border-[var(--brass-dim)] rounded-xl transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{agent.agentAvatar}</span>
                        <div>
                          <h5 className="font-serif font-bold text-xs text-[var(--paper)]">
                            {agent.agentName}
                          </h5>
                          <span className="text-[10px] text-[var(--mist)] font-mono">
                            {agent.agentRole}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVerdictBadge(agent.verdict)}`}>
                          {agent.verdict} ({agent.score})
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[var(--mist)]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-[var(--mist)]" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-dashed border-[var(--line)] space-y-2 text-[11px] font-sans">
                        <div>
                          <span className="font-mono text-[10px] text-[var(--brass)] font-bold block">
                            💡 Temel Savlar &amp; Katalizörler:
                          </span>
                          <ul className="list-disc list-inside text-[var(--paper-dim)] mt-0.5 space-y-0.5">
                            {agent.keyArguments.map((arg, aIdx) => (
                              <li key={aIdx}>{arg}</li>
                            ))}
                          </ul>
                        </div>

                        {agent.risksNoted && agent.risksNoted.length > 0 && (
                          <div>
                            <span className="font-mono text-[10px] text-[var(--loss)] font-bold block">
                              ⚠️ Vurgulanan Riskler:
                            </span>
                            <ul className="list-disc list-inside text-[var(--paper-dim)] mt-0.5 space-y-0.5">
                              {agent.risksNoted.map((risk, rIdx) => (
                                <li key={rIdx}>{risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
