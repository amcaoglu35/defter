"use client";

import React, { useEffect, useState, useCallback } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  scale: number;
  speedX: number;
  speedY: number;
  delay: number;
}

const COLORS = [
  "var(--brass)",
  "var(--verdigris)",
  "#e8c547",
  "#7ecfc0",
  "#f0d98d",
  "#a8e6cf",
  "#ffd3b6",
  "#ffaaa5",
];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    rotation: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    scale: 0.5 + Math.random() * 0.8,
    speedX: (Math.random() - 0.5) * 3,
    speedY: 2 + Math.random() * 3,
    delay: Math.random() * 0.5,
  }));
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export default function Confetti({ active, duration = 2500, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setPieces(generatePieces(50));
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        setPieces([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  if (!visible || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            transform: `scale(${piece.scale}) rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${1.5 + piece.speedY * 0.3}s ease-in forwards`,
            animationDelay: `${piece.delay}s`,
            opacity: 0.9,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
