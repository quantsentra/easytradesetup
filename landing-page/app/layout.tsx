import type { Metadata, Viewport } from "next";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";
import OfferBanner from "@/components/ui/OfferBanner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://easytradesetup.com"),
  title: {
    default: "EasyTradeSetup — Golden Indicator",
    template: "%s · EasyTradeSetup",
  },
  description:
    "Golden Indicator — proprietary TradingView Pine Script for global markets: equities, F&O, commodities, forex, crypto. Any symbol, any timeframe. Inaugural offer: $49 / ₹4,599 (retail $149 / ₹13,999). One-time payment, lifetime access.",
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
    description: "Trade with clarity. Not noise. Inaugural offer: $49 / ₹4,599 (retail $149 / ₹13,999). One-time payment, lifetime access.",
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
        <OfferBanner />
        <TopNav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
