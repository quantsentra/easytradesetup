import type { Metadata, Viewport } from "next";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://easytradesetup.com"),
  title: {
    default: "EasyTradeSetup — Golden Indicator",
    template: "%s · EasyTradeSetup",
  },
  description:
    "Golden Indicator — proprietary TradingView Pine Script with 8 built-in tools for global markets: equities, F&O, commodities, forex, crypto. Any symbol, any timeframe. India ₹2,499 · Global $49. One-time payment.",
  keywords: [
    "TradingView indicator",
    "Pine Script",
    "global markets",
    "NSE F&O",
    "SPX",
    "XAU gold indicator",
    "BTC indicator",
    "forex indicator",
    "intraday trading tool",
  ],
  authors: [{ name: "EasyTradeSetup" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://easytradesetup.com",
    siteName: "EasyTradeSetup",
    title: "EasyTradeSetup — Golden Indicator",
    description: "One indicator. Eight tools. Every market.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyTradeSetup — Golden Indicator",
    description: "One indicator. Eight tools. Every market. India ₹2,499 · Global $49. One-time payment.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <TopNav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
