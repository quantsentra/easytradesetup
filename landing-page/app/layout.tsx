import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://easytradesetup.com"),
  title: {
    default: "EasyTradeSetup — Golden Indicator",
    template: "%s · EasyTradeSetup",
  },
  description:
    "Golden Indicator — proprietary TradingView Pine Script with 8 built-in tools for NSE F&O and global markets. Instant delivery, ₹2,499 one-time.",
  keywords: [
    "TradingView indicator",
    "Pine Script",
    "NSE F&O",
    "Nifty",
    "BankNifty",
    "intraday trading",
    "Indian stock market",
  ],
  authors: [{ name: "EasyTradeSetup" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://easytradesetup.com",
    siteName: "EasyTradeSetup",
    title: "EasyTradeSetup — Golden Indicator",
    description:
      "One indicator. Eight tools. Every market. Proprietary TradingView Pine Script for serious traders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyTradeSetup — Golden Indicator",
    description:
      "One indicator. Eight tools. Every market. ₹2,499 one-time.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <TopNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
