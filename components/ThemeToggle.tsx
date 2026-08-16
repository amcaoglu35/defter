"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => {};

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("defter_theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    const savedTheme = (localStorage.getItem("defter_theme") as "dark" | "light" | null) || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
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
