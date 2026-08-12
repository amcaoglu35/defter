import React from "react";

interface OracleSealProps {
  size?: "sm" | "md" | "lg";
}

export default function OracleSeal({ size = "md" }: OracleSealProps) {
  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-24 h-24 text-3xl",
    lg: "w-32 h-32 text-4xl",
  };

  return (
    <div className="relative flex items-center justify-center my-4 select-none">
      {/* Outer Glow Ring */}
      <div className="absolute inset-[-20px] rounded-full bg-[radial-gradient(circle,var(--brass-glow)_0%,transparent_70%)] pointer-events-none" />

      {/* Concentric Decorative Rings */}
      <div className="relative">
        <div className="absolute -inset-4 border border-[var(--brass-dim)] opacity-20 rounded-full animate-spin-slow" />
        <div className="absolute -inset-2 border border-[var(--brass-dim)] opacity-40 rounded-full" />
        
        {/* Main Center Seal */}
        <div
          className={`${sizeClasses[size]} rounded-full border-2 border-[var(--brass)] bg-[var(--ink-2)] flex items-center justify-center font-serif italic font-bold text-[var(--brass)] shadow-xl oracle-pulse`}
        >
          O
        </div>
      </div>
    </div>
  );
}
