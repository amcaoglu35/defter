import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ToastProvider";
import CommandPalette from "@/components/CommandPalette";
import OnboardingModal from "@/components/OnboardingModal";
import ShortcutsModal from "@/components/ShortcutsModal";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#12151C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Defter — Kişisel Sermaye Kütüğü & Yatırım Pusulası",
  description:
    "Kişisel hisse senedi, kıymetli maden, fon ve sepet takip platformu. Orakul yapay zeka analiz motoru ile güçlendirildi.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Defter",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--ink)] text-[var(--paper)] selection:bg-[var(--brass)] selection:text-[var(--ink)]">
        <StoreProvider>
          <ToastProvider>
            <AuthGuard>
              <Ticker />
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <CommandPalette />
              <OnboardingModal />
              <ShortcutsModal />
              <footer className="border-t border-[var(--line)] py-8 px-4 sm:px-8 bg-[var(--ink-2)] text-center text-xs font-mono text-[var(--mist)]">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-[var(--paper)] font-semibold">
                      Defter
                    </span>
                    <span>• Kişisel Yatırım Kütüğü</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>Kısayol: <kbd className="border border-[var(--line)] px-1.5 py-0.5 rounded bg-[var(--ink-3)] text-[var(--brass)] font-bold">Ctrl + K</kbd></span>
                    <span className="text-[var(--brass)] font-semibold">
                      FAZ 5 — PWA &amp; Komut Paleti
                    </span>
                  </div>
                </div>
              </footer>
            </AuthGuard>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
