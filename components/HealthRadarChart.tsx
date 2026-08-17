"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface RadarMetric {
  subject: string;
  score: number; // 0-100
  fullMark: number;
  benchmark?: number;
}

interface HealthRadarChartProps {
  data: RadarMetric[];
  title?: string;
  color?: string;
  benchmarkColor?: string;
  showBenchmark?: boolean;
}

export function HealthRadarChart({
  data,
  title,
  color = "var(--verdigris)",
  benchmarkColor = "var(--mist)",
  showBenchmark = false,
}: HealthRadarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center">
      {title && (
        <h4 className="text-xs font-semibold text-[var(--mist)] uppercase tracking-wider mb-2">
          {title}
        </h4>
      )}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="var(--line)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--paper-dim)", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "var(--mist)", fontSize: 9 }}
              stroke="var(--line)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--ink-2)",
                borderColor: "var(--line)",
                borderRadius: "0.5rem",
                color: "var(--paper)",
                fontSize: "12px",
              }}
              formatter={((value: unknown, name: unknown) => [
                `${value ?? "—"} / 100`,
                name === "score" ? "Şirket Puanı" : "Sektör Medyanı",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ]) as any}
            />
            {showBenchmark && (
              <Radar
                name="benchmark"
                dataKey="benchmark"
                stroke={benchmarkColor}
                fill={benchmarkColor}
                fillOpacity={0.15}
              />
            )}
            <Radar
              name="score"
              dataKey="score"
              stroke={color}
              fill={color}
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
