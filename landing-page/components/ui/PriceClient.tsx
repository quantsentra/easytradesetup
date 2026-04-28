"use client";
import { useEffect, useState } from "react";
import { USD_SET, INR_SET, format, type PriceSet } from "@/lib/pricing";
import { readCurrencyCookieClient } from "@/lib/currency";

// Client-only currency-aware price. Used by sticky / banner / portal
// surfaces that already have to be client components for their own
// reasons. Pages and server-rendered sections should import the default
// <Price /> (server component) instead — that variant SSRs the correct
// currency from the ets_ccy cookie so SEO crawlers and OG previews see
// the right price without waiting for hydration.

type Variant =
  | "amount"
  | "retail"
  | "strike-offer"
  | "amount-once"
  | "amount-suffix"
  | "cta";

export default function PriceClient({ variant = "amount" }: { variant?: Variant }) {
  const [inIndia, setInIndia] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setInIndia(readCurrencyCookieClient() === "inr");
    setReady(true);

    function recheck() {
      setInIndia(readCurrencyCookieClient() === "inr");
    }
    document.addEventListener("visibilitychange", recheck);
    return () => document.removeEventListener("visibilitychange", recheck);
  }, []);

  const set: PriceSet = inIndia ? INR_SET : USD_SET;
  const offer = format(set, set.offer);
  const retail = format(set, set.retail);

  if (!ready) {
    // Variant-aware placeholder. Even if invisible, the text content is
    // what crawlers / share-card scrapers see — so render the right shape.
    const placeholder =
      variant === "retail" ? format(USD_SET, USD_SET.retail)
      : variant === "strike-offer" ? `${format(USD_SET, USD_SET.retail)} ${format(USD_SET, USD_SET.offer)}`
      : variant === "amount-once" ? `${format(USD_SET, USD_SET.offer)} once`
      : variant === "amount-suffix" ? `${format(USD_SET, USD_SET.offer)} one-time`
      : variant === "cta" ? `Get Golden Indicator — ${format(USD_SET, USD_SET.offer)} →`
      : format(USD_SET, USD_SET.offer);
    return (
      <span aria-hidden className="opacity-0 inline-block">
        {placeholder}
      </span>
    );
  }

  if (variant === "retail") return <>{retail}</>;
  if (variant === "strike-offer") return <StrikeOffer retail={retail} offer={offer} />;
  if (variant === "amount-once") return <>{offer} once</>;
  if (variant === "amount-suffix") return <>{offer} one-time</>;
  if (variant === "cta") return <>Get Golden Indicator — {offer} →</>;
  return <>{offer}</>;
}

function StrikeOffer({ retail, offer }: { retail: string; offer: string }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="text-muted-faint line-through decoration-muted-faint/60 decoration-[2px]">
        {retail}
      </span>
      <span>{offer}</span>
    </span>
  );
}
