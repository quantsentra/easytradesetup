import { OFFER_USD, OFFER_INR, RETAIL_USD } from "@/lib/pricing";
import { LAUNCH_END_DATE } from "@/lib/launch";

const SITE_URL = "https://easytradesetup.com";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#org`,
    name: "EasyTradeSetup",
    alternateName: ["Easy Trade Setup", "ETS"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    sameAs: [
      "https://github.com/quantsentra/easytradesetup",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@easytradesetup.com",
        contactType: "customer support",
        availableLanguage: ["en"],
        url: `${SITE_URL}/contact`,
      },
    ],
    description:
      "Maker of Golden Indicator — a non-repainting TradingView Pine Script v5 for intraday, swing, and options traders across global markets.",
    areaServed: "Worldwide",
  };
  return <Script data={data} id="ld-org" />;
}

export function WebSiteJsonLd() {
  // Site has no on-site search yet, so we omit potentialAction (a broken
  // SearchAction is worse than none — Google's sitelink searchbox needs a
  // real working endpoint).
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: "EasyTradeSetup",
    alternateName: ["Easy Trade Setup", "ETS"],
    url: SITE_URL,
    description:
      "Golden Indicator — one TradingView Pine v5 script for any market. Market structure, regime, key levels, supply / demand.",
    publisher: { "@id": `${SITE_URL}#org` },
    inLanguage: "en",
  };
  return <Script data={data} id="ld-website" />;
}

/**
 * Helps Google identify the site's primary navigation. One signal that
 * feeds organic sitelink generation. Six entries beats the typical
 * 4–6-sitelink box Google renders.
 */
export function SiteNavigationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Primary navigation",
    itemListElement: [
      { "@type": "SiteNavigationElement", position: 1, name: "Features",  url: `${SITE_URL}/product`   },
      { "@type": "SiteNavigationElement", position: 2, name: "Resources", url: `${SITE_URL}/resources` },
      { "@type": "SiteNavigationElement", position: 3, name: "Library",   url: `${SITE_URL}/sample`    },
      { "@type": "SiteNavigationElement", position: 4, name: "Pricing",   url: `${SITE_URL}/pricing`   },
      { "@type": "SiteNavigationElement", position: 5, name: "Compare",   url: `${SITE_URL}/compare`   },
      { "@type": "SiteNavigationElement", position: 6, name: "FAQ",       url: `${SITE_URL}/docs/faq`  },
    ],
  };
  return <Script data={data} id="ld-sitenav" />;
}

export function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Golden Indicator",
    brand: { "@type": "Brand", name: "EasyTradeSetup" },
    description:
      "TradingView Pine Script v5 indicator for global markets. Fuses market structure (BOS / CHoCH / HH-HL), regime bias, key levels (PDH / PDL / PWH / PWL), and supply / demand zones into one non-repainting engine. Works on NIFTY, BANKNIFTY, SPX, NASDAQ, XAU, Silver, Crude, forex, and crypto.",
    category: "Software / Trading Tools",
    url: `${SITE_URL}/product`,
    image: [
      `${SITE_URL}/chart-after.png`,
      `${SITE_URL}/chart-before.png`,
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Retail traders — intraday, swing, options",
    },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: OFFER_USD,
        priceValidUntil: LAUNCH_END_DATE,
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/checkout`,
        seller: { "@type": "Organization", name: "EasyTradeSetup" },
      },
      {
        "@type": "Offer",
        priceCurrency: "INR",
        price: OFFER_INR,
        priceValidUntil: LAUNCH_END_DATE,
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/checkout`,
        seller: { "@type": "Organization", name: "EasyTradeSetup" },
      },
    ],
    additionalProperty: [
      { "@type": "PropertyValue", name: "Retail price (USD)", value: `$${RETAIL_USD}` },
      { "@type": "PropertyValue", name: "Platform", value: "TradingView" },
      { "@type": "PropertyValue", name: "Language", value: "Pine Script v5" },
      { "@type": "PropertyValue", name: "Billing model", value: "One-time, lifetime access" },
      { "@type": "PropertyValue", name: "Repaint behavior", value: "None — bar-close only" },
      { "@type": "PropertyValue", name: "Supported markets", value: "Equities, F&O, forex, crypto, commodities" },
    ],
  };
  return <Script data={data} id="ld-product" />;
}

/**
 * SoftwareApplication schema for the indicator. Google treats this richer
 * than plain Product for software listings — eligible for the "App"
 * rich result and shows up better in shopping/software-specific search.
 */
export function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Golden Indicator",
    alternateName: ["EasyTradeSetup Golden Indicator", "Golden Indicator Pine v5"],
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Trading Indicator",
    operatingSystem: "TradingView (web, desktop, mobile)",
    url: `${SITE_URL}/product`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "Non-repainting TradingView Pine Script v5 indicator. Fuses market structure (BOS / CHoCH / HH-HL), trend regime, key levels (PDH / PDL / PWH / PWL), and supply / demand zones into one bar-close engine. Works on NIFTY, BANKNIFTY, SPX 500, NASDAQ 100, XAU / Gold, Silver, Crude, forex, and crypto. One-time payment, lifetime updates.",
    softwareVersion: "2.4",
    fileFormat: "Pine Script v5",
    creator: { "@id": `${SITE_URL}#org` },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: OFFER_USD,
        priceValidUntil: LAUNCH_END_DATE,
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/checkout`,
      },
      {
        "@type": "Offer",
        priceCurrency: "INR",
        price: OFFER_INR,
        priceValidUntil: LAUNCH_END_DATE,
        availability: "https://schema.org/PreOrder",
        url: `${SITE_URL}/checkout`,
      },
    ],
    featureList: [
      "Bar-close logic — no repaint",
      "Market structure (BOS, CHoCH, higher highs / lower lows)",
      "Trend regime classification",
      "Key levels (PDH, PDL, PWH, PWL)",
      "Supply and demand zones",
      "Pullback / continuation context",
      "Risk framework + position sizer",
      "Daily pre-market notes",
    ],
  };
  return <Script data={data} id="ld-software" />;
}

type FAQ = { q: string; a: string };

export function FAQPageJsonLd({ faqs }: { faqs: FAQ[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <Script data={data} id="ld-faq" />;
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return <Script data={data} id="ld-breadcrumb" />;
}

/** Convenience — build a Home > Page breadcrumb from a path slug. */
export function PageBreadcrumbs({ name, path }: { name: string; path: string }) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return (
    <BreadcrumbJsonLd
      items={[
        { name: "Home", url: SITE_URL + "/" },
        { name, url: SITE_URL + clean },
      ]}
    />
  );
}

function Script({ data, id }: { data: unknown; id: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
