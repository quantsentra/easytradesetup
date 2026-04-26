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
    default:
      "Golden Indicator — TradingView Pine v5 for NIFTY, SPX, Gold & BTC · EasyTradeSetup",
    template: "%s · EasyTradeSetup",
  },
  description:
    "One non-repainting TradingView Pine Script v5 indicator for NIFTY 50, BANKNIFTY, SPX 500, NASDAQ 100, Gold, Silver, Crude, forex, and crypto. Market structure (BOS / CHoCH), regime bias, key levels (PDH / PDL), supply / demand zones. One-time $49 / ₹4,599. 7-day refund. No subscription.",
  keywords: [
    // Product / category
    "TradingView Pine v5 indicator",
    "TradingView indicator no repaint",
    "best Pine Script indicator",
    "non-repainting indicator",
    "bar-close indicator",
    "all-in-one TradingView indicator",
    "trading indicator one-time payment",
    "lifetime access trading indicator",
    // Setup type
    "market structure indicator",
    "BOS CHoCH indicator",
    "supply and demand indicator",
    "price action indicator",
    "smart money concepts indicator",
    "key levels indicator PDH PDL",
    "trend regime indicator",
    "pullback indicator",
    // India-specific
    "NIFTY 50 indicator",
    "BANKNIFTY intraday indicator",
    "FINNIFTY indicator",
    "NSE Pine Script",
    "Indian retail trader indicator",
    "NIFTY weekly expiry indicator",
    "BANKNIFTY expiry strategy",
    // Global markets
    "SPX 500 indicator",
    "S&P 500 TradingView indicator",
    "NASDAQ 100 indicator",
    "Dow Jones indicator",
    "XAU USD gold indicator",
    "Silver trading indicator",
    "BTC TradingView indicator",
    "crypto Pine Script indicator",
    "forex Pine Script",
    // Competitor / intent
    "LuxAlgo alternative",
    "TrendSpider alternative",
    "MarketSmith alternative",
    "Pine Script v5 indicator buy",
    "TradingView indicator paid",
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
  // Search Console + Bing verification — set GOOGLE_SITE_VERIFICATION
  // and BING_SITE_VERIFICATION on Vercel to render the meta tags.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
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
