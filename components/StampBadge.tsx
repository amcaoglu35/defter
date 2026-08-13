import React from "react";

interface StampBadgeProps {
  verdict: "AL" | "SAT" | "TUT" | "NÖTR" | "YÜKSEK RİSK" | "DENGELİ";
  className?: string;
}

export default function StampBadge({ verdict, className = "" }: StampBadgeProps) {
  let styleClass = "stamp-notr";
  const label = verdict;

  if (verdict === "AL") {
    styleClass = "stamp-al";
  } else if (verdict === "SAT" || verdict === "YÜKSEK RİSK") {
    styleClass = "stamp-sat";
  } else if (verdict === "TUT" || verdict === "DENGELİ") {
    styleClass = "stamp-tut";
  }

  return (
    <span className={`stamp ${styleClass} ${className}`}>
      {label}
    </span>
  );
}
