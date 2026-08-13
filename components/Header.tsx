"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Check,
  RefreshCw,
  Sparkles,
  Search,
  CloudCheck,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import OrakulChatModal from "@/components/OrakulChatModal";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const {
    notifications,
    markAllNotificationsRead,
    isCloudConnected,
    refreshPrices,
    isRefreshing,
    lastSyncTime,
  } = useDefterStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
    );
  };

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/sirketler", label: "Şirketler" },
    { href: "/sepetlerim", label: "Sepetlerim" },
    { href: "/orakul", label: "Orakul AI", badge: "AI" },
    { href: "/halka-arz", label: "Halka Arz" },
    { href: "/ayarlar", label: "Ayarlar" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--ink)]/95 backdrop-blur-md border-b border-[var(--line)] px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-baseline gap-2.5 group cursor-pointer shrink-0">
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[var(--paper)] tracking-tight group-hover:text-[var(--brass)] transition-colors">
              Defter
            </span>
            <span className="font-mono text-[10px] text-[var(--brass)] uppercase tracking-widest border border-[var(--brass-dim)] px-1.5 py-0.5 rounded-xs bg-[var(--brass-glow)]">
              KÜTÜK v1.2
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? "text-[var(--brass)] font-semibold"
                      : "text-[var(--mist)] hover:text-[var(--paper)]"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] font-mono font-bold bg-[var(--brass)] text-[var(--ink)] px-1.5 py-0.2 rounded-xs">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brass)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Search, Sync, AI Chat, Notifications & Privacy */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Command Palette Button */}
            <button
              onClick={triggerCommandPalette}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[var(--line)] bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] text-xs font-mono transition-colors cursor-pointer"
              title="Komut Paleti (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ara...</span>
              <kbd className="bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--line)] px-1 py-0.2 rounded text-[10px] font-bold">
                Ctrl K
              </kbd>
            </button>

            {/* Live Price Refresh Button */}
            <button
              onClick={() => refreshPrices()}
              disabled={isRefreshing}
              className="p-2 rounded-md border border-[var(--line)] text-[var(--mist)] hover:text-[var(--brass)] hover:border-[var(--brass-dim)] bg-[var(--ink-2)] transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
              title={`Fiyatları Güncelle (Son: ${lastSyncTime})`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[var(--brass)]" : ""}`}
              />
              <span className="hidden xl:inline text-[11px]">{lastSyncTime}</span>
            </button>

            {/* Cloud Sync Status Indicator */}
            {isCloudConnected ? (
              <div
                className="hidden md:flex items-center gap-1 text-[10px] font-mono text-[var(--brass)] bg-[var(--brass-glow)] border border-[var(--brass-dim)] px-2 py-1 rounded"
                title="Supabase Bulut Senkronizasyonu Aktif"
              >
                <CloudCheck className="w-3.5 h-3.5 text-[var(--brass)]" />
                <span className="hidden lg:inline font-semibold">Bulut</span>
              </div>
            ) : (
              <div
                className="hidden md:flex items-center gap-1 text-[10px] font-mono text-[var(--mist)] bg-[var(--ink-2)] border border-[var(--line)] px-2 py-1 rounded"
                title="Supabase servis anahtarı bağlı değil. Veriler yalnızca bu cihazda (localStorage) tutuluyor."
              >
                <span className="hidden lg:inline font-semibold">📌 Yerel Mod</span>
              </div>
            )}

            {/* Orakul Chat Trigger */}
            <button
              onClick={() => setChatOpen(true)}
              className="border border-[var(--brass-dim)] text-[var(--brass)] bg-[var(--brass-glow)] hover:bg-[rgba(201,162,75,0.25)] px-3 py-1.5 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Orakul&apos;a Sor</span>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-md border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--brass-dim)] bg-[var(--ink-2)] transition-colors cursor-pointer"
                aria-label="Bildirimler"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--brass)] text-[var(--ink)] font-mono text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Modal Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--ink-2)] border border-[var(--line)] rounded-lg shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-[var(--paper)]">
                        Bildirimler
                      </span>
                      {unreadCount > 0 && (
                        <span className="font-mono text-xs text-[var(--brass)] font-bold">
                          ({unreadCount} yeni)
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-[var(--mist)] hover:text-[var(--brass)] flex items-center gap-1 font-mono cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Tümünü Oku
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-dashed divide-[var(--line)] max-h-80 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[var(--mist)] py-4 text-center">
                        Henüz bildirim yok.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`py-3 px-2 transition-colors rounded ${
                            !n.read ? "bg-[rgba(201,162,75,0.06)]" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[var(--paper)]">
                              {n.title}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--mist)]">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--mist)] mt-1 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-2)] cursor-pointer"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[var(--line)] flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2 px-3 rounded-md transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-[var(--ink-2)] text-[var(--brass)] font-semibold border-l-2 border-[var(--brass)]"
                      : "text-[var(--mist)] hover:text-[var(--paper)]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-mono font-bold bg-[var(--brass)] text-[var(--ink)] px-1.5 py-0.5 rounded-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Interactive Orakul AI Chat Modal */}
      <OrakulChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
