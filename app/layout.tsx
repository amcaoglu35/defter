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
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var z = localStorage.getItem('defter_view_zoom');
                if (z) {
                  var n = parseInt(z, 10);
                  if (!isNaN(n) && n >= 70 && n <= 150 && n !== 100) {
                    document.documentElement.style.fontSize = (16 * (n / 100)) + 'px';
                    document.documentElement.setAttribute('data-view-zoom', n + '%');
                    if (n < 100) document.documentElement.setAttribute('data-compact', 'true');
                  }
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--ink)] text-[var(--paper)] selection:bg-[var(--brass)] selection:text-[var(--ink)]">
        <ToastProvider>
          <AuthGuard>
            <StoreProvider>
              <Ticker />
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <CommandPalette />
              <OnboardingModal />
              <ShortcutsModal />
              <PwaInstallPrompt />
              <footer className="border-t border-[var(--line)] py-8 px-4 sm:px-8 bg-[var(--ink-2)] text-center text-xs font-mono text-[var(--mist)]">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-[var(--paper)] font-semibold">
                      Defter
                    </span>
                    <span className="text-[var(--brass)]">✦</span>
                    <span>Kişisel Sermaye Kütüğü &amp; Portföy Defteri</span>
                  </div>
                  <div className="text-[11px] text-[var(--mist)] font-sans">
                    Fiyat verileri Yahoo Finance &amp; TCMB kaynaklıdır. Yatırım tavsiyesi içermez.
                  </div>
                </div>
              </footer>
            </StoreProvider>
          </AuthGuard>
        </ToastProvider>
      </body>
    </html>
  );
}
