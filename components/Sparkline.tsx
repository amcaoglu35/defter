"use client";

import React, { memo, useId } from "react";

interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
  negativeColor?: string;
  strokeWidth?: number;
  showDot?: boolean;
}

function SparklineComponent({
  data,
  width = 80,
  height = 28,
  color = "var(--verdigris)",
  negativeColor = "var(--loss)",
  strokeWidth = 1.5,
  showDot = true,
}: SparklineProps) {
  const uid = useId();

  // Zero Mock Data Rule: If genuine historical data is absent or insufficient, render neutral state without fabricating curves
  if (!data || data.length < 2) {
    return (
      <span className="text-[11px] font-mono text-[var(--mist)] select-none">
        —
      </span>
    );
  }

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
  const gradId = `sparkGrad-${isPositive ? "pos" : "neg"}-${uid}`;

  // Gradient fill path
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const fillD = `${pathD} L ${lastPoint.x} ${height - padding} L ${firstPoint.x} ${height - padding} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <path
        d={fillD}
        fill={`url(#${gradId})`}
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

const Sparkline = memo(SparklineComponent);
export default Sparkline;
