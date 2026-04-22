import { OFFER_USD, OFFER_INR, RETAIL_USD } from "@/lib/pricing";
import { LAUNCH_END_DATE } from "@/lib/launch";

const SITE_URL = "https://easytradesetup.com";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EasyTradeSetup",
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
      "Maker of Golden Indicator — a proprietary TradingView Pine Script for global markets. Based in India.",
  };
  return <Script data={data} id="ld-org" />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EasyTradeSetup",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}#org` },
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
      "Proprietary TradingView Pine Script v5 with integrated signal engine for NSE F&O, US equities, commodities, forex, and crypto. One indicator, eight built-in tools, any symbol, any timeframe.",
    category: "Software / Trading Tools",
    url: `${SITE_URL}/product`,
    image: `${SITE_URL}/chart-after.png`,
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
