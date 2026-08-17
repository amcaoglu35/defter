"use client";

import { useEffect } from "react";

export function useEscapeKey(
  isOpen: boolean,
  onClose: () => void,
  disabled = false
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !disabled) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, disabled, onClose]);
}
