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
  color = "#10b981", // Emerald accent
  benchmarkColor = "#64748b", // Slate neutral
  showBenchmark = false,
}: HealthRadarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center">
      {title && (
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {title}
        </h4>
      )}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 9 }}
              stroke="#334155"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "0.5rem",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              formatter={(value: any, name: any) => [
                `${value} / 100`,
                name === "score" ? "Şirket Puanı" : "Sektör Medyanı",
              ]}
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
