"use client";

import React, { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Scale, Users, Sparkles } from "lucide-react";
import { Company } from "@/lib/mockData";
import { calculateCompanyHealth } from "@/lib/healthScore";

interface PeerOverlayRadarCardProps {
  company: Company;
  allCompanies: Company[];
}

export function PeerOverlayRadarCard({ company, allCompanies }: PeerOverlayRadarCardProps) {
  // Find potential sector peers
  const peers = useMemo(() => {
    return allCompanies
      .filter(
        (c) =>
          c.symbol.toUpperCase() !== company.symbol.toUpperCase() &&
          (c.sector === company.sector || c.exchange === company.exchange)
      )
      .slice(0, 8);
  }, [company, allCompanies]);

  const [selectedPeerSymbol, setSelectedPeerSymbol] = useState<string>(
    peers.length > 0 ? peers[0].symbol : ""
  );

  const selectedPeer = useMemo(() => {
    return allCompanies.find(
      (c) => c.symbol.toUpperCase() === selectedPeerSymbol.toUpperCase()
    );
  }, [selectedPeerSymbol, allCompanies]);

  const overlayData = useMemo(() => {
    const mainHealth = calculateCompanyHealth(company);
    const peerHealth = selectedPeer ? calculateCompanyHealth(selectedPeer) : null;

    return [
      {
        subject: "Değerleme (F/K)",
        [company.symbol]: mainHealth.dimensions.valuation,
        ...(peerHealth && selectedPeer ? { [selectedPeer.symbol]: peerHealth.dimensions.valuation } : {}),
      },
      {
        subject: "Kârlılık (ROE)",
        [company.symbol]: mainHealth.dimensions.profitability,
        ...(peerHealth && selectedPeer ? { [selectedPeer.symbol]: peerHealth.dimensions.profitability } : {}),
      },
      {
        subject: "Finansal Sağlık",
        [company.symbol]: mainHealth.dimensions.leverage,
        ...(peerHealth && selectedPeer ? { [selectedPeer.symbol]: peerHealth.dimensions.leverage } : {}),
      },
      {
        subject: "Büyüme İvmesi",
        [company.symbol]: mainHealth.dimensions.growth,
        ...(peerHealth && selectedPeer ? { [selectedPeer.symbol]: peerHealth.dimensions.growth } : {}),
      },
      {
        subject: "Temettü Verimi",
        [company.symbol]: mainHealth.dimensions.efficiency,
        ...(peerHealth && selectedPeer ? { [selectedPeer.symbol]: peerHealth.dimensions.efficiency } : {}),
      },
    ];
  }, [company, selectedPeer]);

  if (peers.length === 0) return null;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
      {/* Header & Peer Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              ⚔️ Rakip İle Üst Üste Bindirilmiş Radar (Peer Overlay)
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              {company.symbol} vs Sektörel Rakip Poligon Kıyaslaması
            </p>
          </div>
        </div>

        {/* Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--mist)] uppercase">Rakip Seç:</span>
          <select
            value={selectedPeerSymbol}
            onChange={(e) => setSelectedPeerSymbol(e.target.value)}
            className="bg-[var(--ink-3)] border border-[var(--brass-dim)] text-[var(--paper)] text-xs font-mono px-3 py-1.5 rounded cursor-pointer focus:outline-none"
          >
            {peers.map((p) => (
              <option key={p.symbol} value={p.symbol}>
                {p.symbol} ({p.name.slice(0, 16)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overlay Radar Chart Container */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={overlayData}>
            <PolarGrid stroke="var(--line)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--paper-dim)", fontSize: 10, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--line)" tick={{ fill: "var(--mist)", fontSize: 9 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--ink-3)",
                borderColor: "var(--line)",
                borderRadius: "0.5rem",
                color: "var(--paper)",
                fontSize: "12px",
              }}
            />
            {/* Target Company Polygon */}
            <Radar
              name={company.symbol}
              dataKey={company.symbol}
              stroke="var(--verdigris)"
              fill="var(--verdigris)"
              fillOpacity={0.35}
            />
            {/* Peer Rival Polygon */}
            {selectedPeer && (
              <Radar
                name={selectedPeer.symbol}
                dataKey={selectedPeer.symbol}
                stroke="var(--brass)"
                fill="var(--brass)"
                fillOpacity={0.35}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Badge */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-[var(--line)] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--verdigris)] inline-block" />
          <span className="font-bold text-[var(--paper)]">{company.symbol} (Hedef)</span>
        </div>

        {selectedPeer && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--brass)] inline-block" />
            <span className="font-bold text-[var(--paper)]">{selectedPeer.symbol} (Rakip)</span>
          </div>
        )}
      </div>
    </div>
  );
}
