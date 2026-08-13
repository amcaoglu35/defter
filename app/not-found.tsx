"use client";

import Link from "next/link";
import { Home, Search, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Animated 404 */}
      <div className="relative mb-8">
        <span className="font-serif text-[120px] sm:text-[160px] font-black text-[var(--brass)] opacity-10 select-none leading-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass className="w-16 h-16 text-[var(--brass)] animate-spin" style={{ animationDuration: "8s" }} />
        </div>
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--paper)] mb-2">
        Sayfa Bulunamadı
      </h1>
      <p className="font-mono text-xs text-[var(--mist)] max-w-md mb-8">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        Pusulanız sizi doğru rotaya yönlendirsin.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="bg-[var(--brass)] hover:bg-[#d9b35a] text-[var(--ink)] font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow"
        >
          <Home className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
        <Link
          href="/sirketler"
          className="border border-[var(--line)] hover:border-[var(--brass)] text-[var(--paper)] text-xs font-mono px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Şirketleri Keşfet</span>
        </Link>
      </div>
    </div>
  );
}
