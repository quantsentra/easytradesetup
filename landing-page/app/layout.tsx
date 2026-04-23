import type { Metadata, Viewport } from "next";
import { Inter_Tight, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import TopNav from "@/components/nav/TopNav";
import Footer from "@/components/nav/Footer";
import OfferBanner from "@/components/ui/OfferBanner";
import StickyBuyBar from "@/components/ui/StickyBuyBar";
import ExitIntent from "@/components/ui/ExitIntent";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05070F" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeInitScript = `(function(){try{var m=localStorage.getItem('theme')||'auto';var e=m;if(m==='auto'){var h=new Date().getHours();e=(h>=6&&h<18)?'light':'dark';}if(e==='light'){document.documentElement.classList.add('light');}document.documentElement.dataset.themeMode=m;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <OfferBanner />
        <TopNav />
        <main id="main" className="above-bg">{children}</main>
        <Footer />
        <StickyBuyBar />
        <ExitIntent />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
