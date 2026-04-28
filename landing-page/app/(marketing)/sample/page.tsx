import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { PageBreadcrumbs } from "@/components/seo/JsonLd";
import SampleTabs from "./sample-tabs";

export const metadata: Metadata = {
  title: "Free sample chapters — NIFTY, S&P 500, BTC, Gold setups",
  description:
    "Free chapters from the Golden Indicator Trade Logic PDF — one full setup each for Indian markets (NIFTY ORB), US markets (ES pullback), crypto (BTC range), and gold (XAU overlap trend). Ungated. No email required.",
  keywords: [
    "free trading sample",
    "NIFTY trading setup",
    "S&P 500 trading setup",
    "BTC trading strategy",
    "XAU trading strategy",
    "Trade Logic PDF",
    "Pine Script sample",
  ],
  alternates: { canonical: "/sample" },
  openGraph: {
    title: "Free Trade Logic samples — NIFTY · ES · BTC · XAU",
    description:
      "One full setup chapter per market. Setup, entries, exits, invalidation, risk. No email.",
    url: "https://www.easytradesetup.com/sample",
    type: "article",
  },
};

export default function SamplePage() {
  return (
    <>
      <PageBreadcrumbs name="Sample" path="/sample" />
      <PageHeader
        eyebrow="Free sample"
        title={<>Four markets. Four setups. No email.</>}
        lede="One full chapter from the 50-page Trade Logic PDF for each market we trade — Indian indices, US indices, crypto, and gold. Same format, same rigour, ungated so you can judge the quality before you buy."
      />
      <SampleTabs />
    </>
  );
}
