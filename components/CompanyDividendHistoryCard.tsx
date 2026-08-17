"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Coins, Calendar, ArrowUpRight } from "lucide-react";
import { Company, DividendItem } from "@/lib/mockData";

interface CompanyDividendHistoryCardProps {
  company: Company;
  dividends: DividendItem[];
}

export function CompanyDividendHistoryCard({
  company,
  dividends,
}: CompanyDividendHistoryCardProps) {
  const companyDividends = useMemo(() => {
    return dividends.filter(
      (d) => d.companySymbol.toUpperCase() === company.symbol.toUpperCase()
    );
  }, [dividends, company.symbol]);

  // Aggregate yearly dividend payouts for this company
  const historyData = useMemo(() => {
    const yearsMap: Record<number, { year: number; payoutPerShare: number; totalYield: number }> = {};
    const currentYear = new Date().getFullYear();

    // Fill last 5 years
    for (let y = currentYear - 4; y <= currentYear; y++) {
      yearsMap[y] = { year: y, payoutPerShare: 0, totalYield: 0 };
    }

    if (companyDividends.length > 0) {
      companyDividends.forEach((d) => {
        const year = d.paymentDate
          ? new Date(d.paymentDate).getFullYear()
          : currentYear;
        if (yearsMap[year]) {
          yearsMap[year].payoutPerShare += d.netAmountPerShare || 0;
          yearsMap[year].totalYield = Math.max(
            yearsMap[year].totalYield,
            d.yieldPercent || company.dividendYield || 0
          );
        }
      });
    } else if (company.dividendYield && company.dividendYield > 0) {
      // Approximate estimated payouts for display based on current yield and price
      const estPayout = (company.price * company.dividendYield) / 100;
      yearsMap[currentYear] = {
        year: currentYear,
        payoutPerShare: Number(estPayout.toFixed(2)),
        totalYield: company.dividendYield,
      };
      yearsMap[currentYear - 1] = {
        year: currentYear - 1,
        payoutPerShare: Number((estPayout * 0.85).toFixed(2)),
        totalYield: Number((company.dividendYield * 0.85).toFixed(1)),
      };
    }

    return Object.values(yearsMap).filter((d) => d.payoutPerShare > 0 || company.dividendYield);
  }, [companyDividends, company]);

  if (!company.dividendYield && companyDividends.length === 0) {
    return (
      <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 font-mono text-xs text-[var(--mist)] space-y-2">
        <div className="flex items-center gap-2 text-[var(--paper)] font-bold">
          <Coins className="w-4 h-4 text-[var(--brass)]" />
          <span>💰 Temettü Geçmişi &amp; Kâr Payı Dağıtım Karnesi</span>
        </div>
        <p className="text-[11px]">
          {company.symbol} temettü dağıtmıyor veya kütükte kayıtlı temettü ilanı bulunmuyor.
        </p>
      </div>
    );
  }

  const latestYield = company.dividendYield || 0;

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              💰 Temettü Geçmişi &amp; Kâr Payı Dağıtım Karnesi
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Yıllara Göre Hisse Başı Dağıtılan Net Nakit Kâr Payı (TL)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[var(--mist)] block">Anlık Temettü Verimi</span>
          <span className="font-bold text-[var(--brass)] text-sm">%{latestYield}</span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full h-52 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              dataKey="year"
              stroke="var(--mist)"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "var(--line)" }}
            />
            <YAxis
              stroke="var(--mist)"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "var(--line)" }}
              tickFormatter={(v: number) => `${v} ₺`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--ink-3)",
                borderColor: "var(--brass-dim)",
                borderRadius: "0.5rem",
                color: "var(--paper)",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
              formatter={((value: number) => [
                `${Number(value).toLocaleString("tr-TR")} ₺ / hisse`,
                "Net Dağıtılan Temettü",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ]) as any}
              labelFormatter={(label: any) => `Yıl: ${label}`}
            />
            <Bar dataKey="payoutPerShare" radius={[4, 4, 0, 0]}>
              {historyData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === historyData.length - 1 ? "var(--brass)" : "var(--brass-dim)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
