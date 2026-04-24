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
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@easytradesetup.com",
        contactType: "customer support",
        availableLanguage: ["en"],
      },
    ],
    description:
      "Maker of Golden Indicator — a non-repainting TradingView Pine Script v5 for intraday, swing, and options traders across global markets.",
    areaServed: "Worldwide",
  };
  return <Script data={data} id="ld-org" />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: "EasyTradeSetup",
    url: SITE_URL,
    description:
      "Golden Indicator — one TradingView Pine v5 script for any market. Market structure, regime, key levels, supply / demand.",
    publisher: { "@id": `${SITE_URL}#org` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/docs/faq?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return <Script data={data} id="ld-website" />;
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
