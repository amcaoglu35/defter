"use client";

import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  negativeColor?: string;
  strokeWidth?: number;
  showDot?: boolean;
}

export default function Sparkline({
  data,
  width = 80,
  height = 28,
  color = "var(--verdigris)",
  negativeColor = "var(--loss)",
  strokeWidth = 1.5,
  showDot = true,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * effectiveWidth;
    const y = padding + effectiveHeight - ((value - min) / range) * effectiveHeight;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  // Determine if the trend is positive or negative
  const isPositive = data[data.length - 1] >= data[0];
  const lineColor = isPositive ? color : negativeColor;

  // Gradient fill path
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const fillD = `${pathD} L ${lastPoint.x} ${height - padding} L ${firstPoint.x} ${height - padding} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <defs>
        <linearGradient id={`sparkGrad-${isPositive ? "pos" : "neg"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <path
        d={fillD}
        fill={`url(#sparkGrad-${isPositive ? "pos" : "neg"})`}
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      {showDot && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2}
          fill={lineColor}
        />
      )}
    </svg>
  );
}

/**
 * Generate mock sparkline data for a company based on its current price and daily change.
 * Creates a realistic-looking 7-day trend line.
 */
export function generateSparklineData(price: number, dailyChange: number): number[] {
  const trend = dailyChange >= 0 ? 1 : -1;
  const volatility = price * 0.015; // 1.5% volatility
  const points: number[] = [];

  let currentPrice = price * (1 - (dailyChange / 100) * 3); // Start ~3 days ago in terms of trend

  for (let i = 0; i < 7; i++) {
    const noise = (Math.random() - 0.5) * volatility;
    const trendPush = trend * volatility * 0.3 * (i / 7);
    currentPrice += noise + trendPush;
    points.push(Math.max(currentPrice, price * 0.9));
  }

  // Ensure the last point matches the actual price
  points[points.length - 1] = price;

  return points;
}
