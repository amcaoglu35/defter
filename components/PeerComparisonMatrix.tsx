"use client";

import React from "react";
import Link from "next/link";
import { Scale, ArrowUpRight, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { Company } from "@/lib/mockData";
import StampBadge from "@/components/StampBadge";
import DataStatusBadge from "@/components/DataStatusBadge";
import { isLiveSymbol } from "@/lib/liveSymbols";

import { getSimilarCompanies } from "@/lib/similarityService";

interface PeerComparisonMatrixProps {
  currentCompany: Company;
  allCompanies: Company[];
}

export default function PeerComparisonMatrix({
  currentCompany,
  allCompanies,
}: PeerComparisonMatrixProps) {
  // Use multi-factor algorithmic similarity scoring
  const peerMatches = React.useMemo(() => {
    return getSimilarCompanies(currentCompany, allCompanies, 4);
  }, [currentCompany, allCompanies]);

  const peers = React.useMemo(() => {
    return peerMatches.map((m) => m.company);
  }, [peerMatches]);

  if (peers.length === 0) return null;

  const comparisonList = [currentCompany, ...peers];

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              ⚔️ Sektörel Rakip Kıyaslama Radarı
            </h3>
            <p className="text-xs font-mono text-[var(--mist)]">
              {currentCompany.sector} Sektöründeki Emsal Şirketler ile Çarpan Kıyaslaması
            </p>
          </div>
        </div>

        <Link
          href={`/karsilastir?c1=${encodeURIComponent(currentCompany.symbol)}&c2=${encodeURIComponent(peers[0]?.symbol || "")}`}
          className="text-xs font-mono text-[var(--brass)] hover:underline flex items-center gap-1"
        >
          <span>Detaylı Kıyaslama Aracını Aç</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[var(--line)] text-[10px] text-[var(--mist)] uppercase tracking-wider bg-[var(--ink-3)]">
              <th className="p-3">Şirket / Varlık</th>
              <th className="p-3 text-right">Anlık Fiyat</th>
              <th className="p-3 text-right">Günlük %</th>
              <th className="p-3 text-right">F/K</th>
              <th className="p-3 text-right">PD/DD</th>
              <th className="p-3 text-right">Temettü</th>
              <th className="p-3 text-center">Orakul Kararı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-[var(--line)]">
            {comparisonList.map((c) => {
              const isSelected = c.symbol === currentCompany.symbol;

              return (
                <tr
                  key={c.id}
                  className={`hover:bg-[rgba(201,162,75,0.04)] transition-colors ${
                    isSelected ? "bg-[rgba(201,162,75,0.08)] font-semibold" : ""
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)]" />
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/sirketler/${encodeURIComponent(c.symbol)}`}
                            className={`font-bold hover:underline ${
                              isSelected ? "text-[var(--brass)]" : "text-[var(--paper)]"
                            }`}
                          >
                            {c.symbol}
                          </Link>
                          <DataStatusBadge symbol={c.symbol} isLive={isLiveSymbol(c.symbol)} />
                        </div>
                        <span className="text-[10px] text-[var(--mist)] block truncate max-w-[140px]">
                          {c.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-right font-bold text-[var(--paper)]">
                    {c.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {c.currency}
                  </td>

                  <td
                    className={`p-3 text-right font-bold ${
                      c.dailyChange >= 0 ? "text-[var(--verdigris)]" : "text-[var(--loss)]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {c.dailyChange >= 0 ? "+" : ""}
                      {c.dailyChange}%
                    </span>
                  </td>

                  <td className="p-3 text-right text-[var(--paper-dim)]">
                    {c.peRatio ? `${c.peRatio}x` : "-"}
                  </td>

                  <td className="p-3 text-right text-[var(--paper-dim)]">
                    {c.pbRatio ? `${c.pbRatio}x` : "-"}
                  </td>

                  <td className="p-3 text-right text-[var(--brass)]">
                    {c.dividendYield ? `%${c.dividendYield}` : "-"}
                  </td>

                  <td className="p-3 text-center">
                    <StampBadge verdict={c.recommendation} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
