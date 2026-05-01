import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { PageBreadcrumbs } from "@/components/seo/JsonLd";
import { resolveHomeMarket } from "@/lib/geo";
import SampleTabs from "./sample-tabs";

export const metadata: Metadata = {
  title: "Free trade setup samples — NIFTY, S&P 500, BTC, Gold",
  description:
    "Four free trade setup previews — one per market (NIFTY ORB, ES pullback, BTC range, XAU overlap trend). Same format you'll find inside the portal after purchase, alongside the interactive course and quiz. Ungated. No email required.",
  keywords: [
    "free trading sample",
    "NIFTY trading setup",
    "S&P 500 trading setup",
    "BTC trading strategy",
    "XAU trading strategy",
    "free trade setup preview",
    "trading indicator preview",
  ],
  alternates: { canonical: "/sample" },
  openGraph: {
    title: "Free trade setup samples — NIFTY · ES · BTC · XAU",
    description:
      "One full setup preview per market. Setup, entries, exits, invalidation, risk. No email.",
    url: "https://www.easytradesetup.com/sample",
    type: "article",
  },
};

export default async function SamplePage() {
  const homeMarket = await resolveHomeMarket();
  return (
    <>
      <PageBreadcrumbs name="Sample" path="/sample" />
      <PageHeader
        eyebrow="Free sample"
        title={<>Four markets. Four setups. No email.</>}
        lede="One full trade setup preview from each market we trade — Indian indices, US indices, crypto, and gold. Same format you'll find inside your portal after purchase, alongside the interactive course and knowledge quiz. Ungated so you can judge the rigour before you buy."
      />
      <SampleTabs homeMarket={homeMarket} />
    </>
  );
}
