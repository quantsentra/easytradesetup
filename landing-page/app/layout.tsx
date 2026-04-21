import type { Metadata, Viewport } from "next";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";
import WhatsAppFab from "@/components/ui/WhatsAppFab";
import "./globals.css";

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
    description: "One indicator. Eight tools. Every market.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyTradeSetup — Golden Indicator",
    description: "One indicator. Eight tools. Every market. ₹2,499 one-time.",
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
        <WhatsAppFab />
      </body>
    </html>
  );
}
