"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Check,
  RefreshCw,
  Sparkles,
  Search,
  ArrowRight,
  CircleDot,
  Eye,
  EyeOff,
  Coins,
} from "lucide-react";
import { useDefterStore } from "@/lib/store";
import OrakulChatModal from "@/components/OrakulChatModal";
import ThemeToggle from "@/components/ThemeToggle";
import ViewModeToggle from "@/components/ViewModeToggle";
import CurrencyConverterModal from "@/components/CurrencyConverterModal";
import { useToast } from "@/components/ToastProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    isCloudConnected,
    refreshPrices,
    isRefreshing,
    lastSyncTime,
    isPrivacyMode,
    togglePrivacyMode,
  } = useDefterStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [converterOpen, setConverterOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  // Close Notification Dropdown on Click Outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
    );
  };

  const handleRefreshPrices = async () => {
    try {
      await refreshPrices();
      showToast("Fiyatlar Güncellendi", "Canlı piyasa verileri başarıyla senkronize edildi.", "success");
    } catch {
      showToast("Güncelleme Hatası", "Piyasa fiyatları alınırken bir sorun oluştu.", "error");
    }
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    setNotifOpen(false);

    if (n.relatedCompanySymbol) {
      router.push(`/sirketler/${encodeURIComponent(n.relatedCompanySymbol)}`);
    } else if (n.relatedBasketId) {
      router.push(`/sepetlerim/${n.relatedBasketId}`);
    } else if (n.type === "ipo") {
      router.push("/halka-arz");
    } else if (n.type === "ai" || n.type === "signal") {
      router.push("/orakul");
    }
  };

  const handleTogglePrivacy = () => {
    togglePrivacyMode();
    showToast(
      !isPrivacyMode ? "Gizlilik Modu Açıldı" : "Gizlilik Modu Kapatıldı",
      !isPrivacyMode
        ? "Tüm bakiyeler ve kâr/zarar tutarları yıldızlandı (••••••)."
        : "Portföy tutarları ve bakiyeler yeniden görünür yapıldı.",
      "info"
    );
  };

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/sirketler", label: "Şirketler" },
    { href: "/sepetlerim", label: "Sepetlerim" },
    { href: "/analiz", label: "Analiz", badge: "PRO" },
    { href: "/orakul", label: "Orakul", badge: "AI" },
    { href: "/halka-arz", label: "Halka Arz" },
    { href: "/ayarlar", label: "Ayarlar" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--ink)]/95 backdrop-blur-md border-b border-[var(--line)] px-3 sm:px-6 lg:px-8 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Sol: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-baseline gap-2 group cursor-pointer shrink-0">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-[var(--paper)] tracking-tight group-hover:text-[var(--brass)] transition-colors">
                Defter
              </span>
              <span className="font-mono text-[9px] text-[var(--brass)] uppercase tracking-widest border border-[var(--brass-dim)] px-1 py-0.5 rounded bg-[var(--brass-glow)]">
                PRO
              </span>
            </Link>

            {/* Mobile Sync Indicator */}
            <div className="md:hidden flex items-center ml-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCloudConnected ? "bg-[var(--verdigris)] shadow-[0_0_8px_var(--verdigris)]" : "bg-[var(--mist)]"
                }`}
                title={isCloudConnected ? "Bulut Senkronize" : "Yerel Mod"}
              />
            </div>
          </div>

          {/* Orta: Masaüstü Navigasyon (Düzenli, Sıkışmayan Linkler) */}
          <nav className="hidden md:flex items-center gap-2.5 lg:gap-4 xl:gap-6 shrink-0">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs lg:text-sm font-medium transition-all relative py-1 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "text-[var(--brass)] font-semibold"
                      : "text-[var(--mist)] hover:text-[var(--paper)]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono font-bold bg-[var(--brass)] text-[var(--ink)] px-1 py-0.2 rounded">
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

          {/* Sağ: Kompakt & Düzenli Araç Çubuğu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Hızlı Arama Butonu */}
            <button
              onClick={triggerCommandPalette}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-2)] text-[var(--mist)] hover:text-[var(--paper)] text-xs font-mono transition-colors cursor-pointer"
              title="Komut Paleti (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--brass)]" />
              <span>Ara...</span>
              <kbd className="bg-[var(--ink-3)] text-[var(--brass)] border border-[var(--line)] px-1 py-0.2 rounded text-[10px] font-bold">
                Ctrl K
              </kbd>
            </button>

            {/* Orakul Chat Butonu */}
            <button
              onClick={() => setChatOpen(true)}
              className="border border-[var(--brass-dim)] text-[var(--brass)] bg-[var(--brass-glow)] hover:bg-[rgba(201,162,75,0.25)] px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Orakul&apos;a Sor</span>
            </button>

            {/* Canlı Fiyat Yenileme */}
            <button
              onClick={handleRefreshPrices}
              disabled={isRefreshing}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--brass)] hover:border-[var(--brass-dim)] bg-[var(--ink-2)] transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs shrink-0"
              title={`Fiyatları Güncelle (Son: ${lastSyncTime})`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[var(--brass)]" : ""}`}
              />
              <span className="hidden xl:inline text-[10px]">{lastSyncTime}</span>
            </button>

            {/* Kompakt Hızlı Araç Kutusu (Utility Island) */}
            <div className="hidden sm:flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--ink-2)] border border-[var(--line)]">
              {/* Kur Çevirici */}
              <button
                onClick={() => setConverterOpen(true)}
                title="Canlı Kur &amp; Varlık Çevirici"
                className="p-1.5 rounded-md hover:bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--brass)] transition-colors cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-[var(--brass)]" />
              </button>

              {/* Gizlilik Modu */}
              <button
                onClick={handleTogglePrivacy}
                title={isPrivacyMode ? "Gizlilik Modunu Kapat (Bakiyeleri Göster)" : "Gizlilik Modunu Aç (Bakiyeleri Gizle)"}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isPrivacyMode ? "bg-[var(--brass-glow)] text-[var(--brass)]" : "hover:bg-[var(--ink-3)] text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              {/* Tema Değiştirici */}
              <div className="px-0.5">
                <ThemeToggle />
              </div>

              {/* Görünüm Ölçeği */}
              <div className="px-0.5">
                <ViewModeToggle />
              </div>
            </div>

            {/* Bildirim Çanı */}
            <div className="relative shrink-0" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--brass-dim)] bg-[var(--ink-2)] transition-colors cursor-pointer"
                aria-label="Bildirimler"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--brass)] text-[var(--ink)] font-mono text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Bildirim Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--ink-2)] border border-[var(--line)] rounded-xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
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

                  <div className="divide-y divide-dashed divide-[var(--line)] max-h-80 overflow-y-auto mt-2 space-y-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[var(--mist)] py-4 text-center">
                        Henüz bildirim yok.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-2.5 transition-all rounded cursor-pointer group hover:bg-[rgba(201,162,75,0.08)] ${
                            !n.read ? "bg-[rgba(201,162,75,0.05)] border-l-2 border-[var(--brass)]" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[var(--paper)] group-hover:text-[var(--brass)] transition-colors">
                              {n.title}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--mist)]">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--mist)] mt-1 line-clamp-2">
                            {n.message}
                          </p>
                          {(n.relatedCompanySymbol || n.relatedBasketId) && (
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-[var(--brass)] opacity-80 group-hover:opacity-100">
                              <span>İlgili varlığa git</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobil Menü Aç/Kapa Butonu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-2)] cursor-pointer shrink-0"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[var(--line)] flex flex-col gap-2 animate-in fade-in">
            {/* Mobil Senkronizasyon Şeridi */}
            <div className="grid grid-cols-2 gap-2 mb-1">
              <div className="px-3 py-2 flex items-center gap-1.5 text-xs font-mono bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
                <CircleDot className={`w-3 h-3 ${isCloudConnected ? "text-[var(--verdigris)]" : "text-[var(--brass)]"}`} />
                <span className="text-[11px] text-[var(--paper-dim)] truncate">
                  {isCloudConnected ? "Bulut Senkronize" : "📌 Yerel Mod"}
                </span>
              </div>

              <div className="px-3 py-2 flex items-center justify-between text-xs font-mono bg-[var(--ink-3)] rounded-lg border border-[var(--line)]">
                <span className="text-[10px] text-[var(--mist)]">Son:</span>
                <span className="text-[11px] text-[var(--brass)] font-bold">{lastSyncTime}</span>
              </div>
            </div>

            {/* Mobil Linkler */}
            <div className="space-y-1">
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
                    className={`text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-[var(--ink-2)] text-[var(--brass)] font-semibold border-l-2 border-[var(--brass)]"
                        : "text-[var(--mist)] hover:text-[var(--paper)]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-mono font-bold bg-[var(--brass)] text-[var(--ink)] px-1.5 py-0.5 rounded">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobil Araç Butonları */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--line)]">
              <div className="p-1 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between px-2.5">
                <span className="text-xs font-mono text-[var(--mist)]">Tema:</span>
                <ThemeToggle />
              </div>

              <div className="p-1 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] flex items-center justify-between px-2.5">
                <span className="text-xs font-mono text-[var(--mist)]">Ölçek:</span>
                <ViewModeToggle />
              </div>

              <button
                type="button"
                onClick={() => {
                  setConverterOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-[var(--brass)]" />
                <span>Kur Çevirici</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRefreshPrices();
                  setMobileMenuOpen(false);
                }}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-[var(--ink-3)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[var(--brass)]" : "text-[var(--brass)]"}`} />
                <span>{isRefreshing ? "Yenileniyor..." : "Fiyat Güncelle"}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Orakul Chat Modalı */}
      <OrakulChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Canlı Kur Çevirici Modalı */}
      <CurrencyConverterModal isOpen={converterOpen} onClose={() => setConverterOpen(false)} />
    </>
  );
}
