"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("defter_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("defter_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Açık Temaya Geç (Parşömen)" : "Koyu Temaya Geç (Mürekkep)"}
      className="p-2 rounded-lg border border-[var(--line)] hover:border-[var(--brass)] bg-[var(--ink-2)] hover:bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--brass)] transition-all cursor-pointer shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[var(--brass)]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--brass)]" />
      )}
    </button>
  );
}
