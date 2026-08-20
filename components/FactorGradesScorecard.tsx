"use client";

import React, { useMemo } from "react";
import { Award, ShieldCheck, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Company } from "@/lib/mockData";

interface FactorGradesScorecardProps {
  company: Company;
}

interface GradeItem {
  category: string;
  grade: "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D" | "F" | "N/A";
  score: number; // 0-100
  color: string;
  description: string;
  metricLabel: string;
  metricValue: string;
}

export function FactorGradesScorecard({ company }: FactorGradesScorecardProps) {
  const grades = useMemo<GradeItem[]>(() => {
    const { peRatio, pbRatio, dividendYield, dailyChange, oneYearReturn, beta } = company;

    // 1. Valuation Grade
    let valScore = 70;
    let valGrade: GradeItem["grade"] = "B";
    if (peRatio) {
      if (peRatio < 8) { valScore = 96; valGrade = "A+"; }
      else if (peRatio < 12) { valScore = 88; valGrade = "A"; }
      else if (peRatio < 16) { valScore = 78; valGrade = "B+"; }
      else if (peRatio < 22) { valScore = 68; valGrade = "B"; }
      else if (peRatio < 30) { valScore = 55; valGrade = "C"; }
      else { valScore = 35; valGrade = "D"; }
    }
    const valColor = valScore >= 80 ? "var(--verdigris)" : valScore >= 60 ? "var(--brass)" : "var(--loss)";

    // 2. Profitability Grade (PB & Margin proxy)
    let profScore = 75;
    let profGrade: GradeItem["grade"] = "B+";
    if (pbRatio) {
      if (pbRatio < 1.2) { profScore = 92; profGrade = "A"; }
      else if (pbRatio < 2.5) { profScore = 82; profGrade = "B+"; }
      else if (pbRatio < 4.5) { profScore = 70; profGrade = "B"; }
      else { profScore = 50; profGrade = "C"; }
    }
    const profColor = profScore >= 80 ? "var(--verdigris)" : profScore >= 60 ? "var(--brass)" : "var(--loss)";

    // 3. Momentum & Growth Grade
    let growthScore = 0;
    let growthGrade: GradeItem["grade"] = "N/A";
    if (typeof oneYearReturn === "number") {
      if (oneYearReturn > 40) { growthScore = 95; growthGrade = "A+"; }
      else if (oneYearReturn > 20) { growthScore = 86; growthGrade = "A"; }
      else if (oneYearReturn > 5) { growthScore = 76; growthGrade = "B+"; }
      else if (oneYearReturn >= -10) { growthScore = 65; growthGrade = "B"; }
      else { growthScore = 40; growthGrade = "D"; }
    }
    const growthColor = growthGrade === "N/A" ? "var(--mist)" : growthScore >= 80 ? "var(--verdigris)" : growthScore >= 60 ? "var(--brass)" : "var(--loss)";

    // 4. Financial Health & Stability Grade
    let healthScore = 80;
    let healthGrade: GradeItem["grade"] = "A-";
    if (beta !== undefined && beta !== null) {
      if (beta <= 0.85) { healthScore = 94; healthGrade = "A+"; }
      else if (beta <= 1.1) { healthScore = 84; healthGrade = "A"; }
      else if (beta <= 1.4) { healthScore = 72; healthGrade = "B"; }
      else { healthScore = 52; healthGrade = "C"; }
    }
    const healthColor = healthScore >= 80 ? "var(--verdigris)" : healthScore >= 60 ? "var(--brass)" : "var(--loss)";

    // 5. Dividend Safety & Yield Grade
    let divScore = 0;
    let divGrade: GradeItem["grade"] = "N/A";
    if (dividendYield && dividendYield > 0) {
      if (dividendYield > 6) { divScore = 95; divGrade = "A+"; }
      else if (dividendYield > 3.5) { divScore = 85; divGrade = "A"; }
      else if (dividendYield > 1.5) { divScore = 75; divGrade = "B+"; }
      else { divScore = 60; divGrade = "C"; }
    }
    const divColor = divScore >= 80 ? "var(--verdigris)" : divScore >= 60 ? "var(--brass)" : "var(--mist)";

    return [
      {
        category: "Değerleme (Valuation)",
        grade: valGrade,
        score: valScore,
        color: valColor,
        description: "Sektörel F/K ve Çarpan İskontosu",
        metricLabel: "F/K Oranı",
        metricValue: peRatio ? `${peRatio}x` : "—",
      },
      {
        category: "Kârlılık (Profitability)",
        grade: profGrade,
        score: profScore,
        color: profColor,
        description: "Özkaynak Verimliliği & PD/DD",
        metricLabel: "PD/DD",
        metricValue: pbRatio ? `${pbRatio}x` : "—",
      },
      {
        category: "Büyüme & İvme (Growth)",
        grade: growthGrade,
        score: growthScore,
        color: growthColor,
        description: "Yıllık Fiyat & Kazanç Performansı",
        metricLabel: "1 Yıllık Getiri",
        metricValue: typeof oneYearReturn === "number" ? `%${oneYearReturn}` : "Veri Yok",
      },
      {
        category: "Finansal Sağlık (Health)",
        grade: healthGrade,
        score: healthScore,
        color: healthColor,
        description: "Volatilite & Beta Denge Skoru",
        metricLabel: "Beta Riski",
        metricValue: beta !== undefined ? `${beta}` : "1.0",
      },
      {
        category: "Temettü Güvenliği (Dividend)",
        grade: divGrade,
        score: divScore,
        color: divColor,
        description: "Kâr Payı Dağıtım Sürdürülebilirliği",
        metricLabel: "Temettü %",
        metricValue: dividendYield ? `%${dividendYield}` : "Dağıtmıyor",
      },
    ];
  }, [company]);

  return (
    <div className="bg-[var(--ink-2)] border border-[var(--line)] rounded-xl p-5 space-y-4 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,162,75,0.15)] border border-[var(--brass-dim)] flex items-center justify-center text-[var(--brass)] shadow-inner">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[var(--paper)]">
              🏅 Defter Faktör Karnesi (Factor Grades)
            </h3>
            <p className="text-[10px] text-[var(--mist)]">
              Sektör Medyanı &amp; Finansal Çarpan Notlandırma
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[var(--brass)] bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-0.5 rounded font-bold">
          Sektörel Kıyas Notları
        </span>
      </div>

      {/* Grade Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {grades.map((item) => (
          <div
            key={item.category}
            className="p-3.5 bg-[var(--ink-3)] rounded-lg border border-[var(--line)] hover:border-[var(--brass-dim)] transition-colors flex flex-col justify-between space-y-2 text-center"
          >
            <div>
              <span className="text-[10px] text-[var(--mist)] uppercase font-bold block truncate">
                {item.category.split(" ")[0]}
              </span>
              <span className="text-[9px] text-[var(--mist)] opacity-75 block truncate">
                {item.metricLabel}: {item.metricValue}
              </span>
            </div>

            <div className="my-1">
              <span
                className="font-serif text-2xl font-bold inline-block px-3 py-1 rounded border shadow-sm"
                style={{
                  color: item.color,
                  borderColor: item.color,
                  backgroundColor: "rgba(18,21,28,0.6)",
                }}
              >
                {item.grade}
              </span>
            </div>

            <div className="w-full h-1 bg-[var(--ink-2)] rounded-full overflow-hidden border border-[var(--line)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.score}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
