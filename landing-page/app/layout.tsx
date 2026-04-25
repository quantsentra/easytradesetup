import type { Metadata, Viewport } from "next";
import { Inter_Tight, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://easytradesetup.com"),
  title: {
    default: "Golden Indicator — one TradingView Pine v5 for any market · EasyTradeSetup",
    template: "%s · EasyTradeSetup",
  },
  description:
    "Golden Indicator fuses market structure, regime bias, key levels, and supply / demand into one non-repainting Pine v5 script. NIFTY, SPX, XAU, BTC, forex. One-time $49 / ₹4,599. 7-day refund.",
  keywords: [
    "TradingView Pine v5 indicator",
    "no repaint indicator",
    "market structure indicator",
    "price action indicator",
    "NIFTY 50 indicator",
    "BANKNIFTY intraday indicator",
    "SPX indicator",
    "XAU gold indicator",
    "BTC TradingView indicator",
    "supply and demand indicator",
    "Pine Script one-time payment",
    "LuxAlgo alternative",
    "TrendSpider alternative",
  ],
  authors: [{ name: "EasyTradeSetup" }],
  creator: "EasyTradeSetup",
  publisher: "EasyTradeSetup",
  category: "Finance / Trading Tools",
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US"],
    url: "https://easytradesetup.com",
    siteName: "EasyTradeSetup",
    title: "Golden Indicator — one TradingView Pine v5 for any market",
    description: "Structure, regime, levels, supply / demand — fused on one chart. Bar-close only, no repaint, no signal service.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@easytradesetup",
    creator: "@easytradesetup",
    title: "Golden Indicator — one indicator, any market",
    description: "Bar-close only. No repaint. One-time $49 / ₹4,599. Lifetime.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head />
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
