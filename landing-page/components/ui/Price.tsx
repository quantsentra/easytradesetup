"use client";
import { useEffect, useState } from "react";
import { USD_SET, INR_SET, format, type PriceSet } from "@/lib/pricing";
import { readCurrencyCookieClient } from "@/lib/currency";

// Reads the ets_ccy cookie that middleware sets per request. Cookie value
// is geo-derived on first visit (x-vercel-ip-country) and overridable via
// ?ccy=inr|usd or the TopNav currency switcher.

type Variant =
  | "amount"         // just the offer amount — "$49"
  | "retail"         // just the retail amount — "$149"
  | "strike-offer"   // struck retail + offer side-by-side
  | "amount-once"    // "$49 once"
  | "amount-suffix"  // "$49 one-time"
  | "cta";           // "Get Golden Indicator — $49 →"

export default function Price({ variant = "amount" }: { variant?: Variant }) {
  const [inIndia, setInIndia] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setInIndia(readCurrencyCookieClient() === "inr");
    setReady(true);

    // Cookie may flip mid-session if user toggles via the switcher in
    // another tab; cheap re-check on visibility regain.
    function recheck() {
      setInIndia(readCurrencyCookieClient() === "inr");
    }
    document.addEventListener("visibilitychange", recheck);
    return () => document.removeEventListener("visibilitychange", recheck);
  }, []);

  const set: PriceSet = inIndia ? INR_SET : USD_SET;
  const offer  = format(set, set.offer);
  const retail = format(set, set.retail);

  if (!ready) {
    // Render a width-stable placeholder so the layout doesn't shift when
    // the real value lands. Use the longest of the two so neither flashes.
    const placeholder = format(INR_SET, INR_SET.offer);
    return (
      <span aria-hidden className="opacity-0 inline-block">
        {placeholder}
      </span>
    );
  }

  if (variant === "retail")         return <>{retail}</>;
  if (variant === "strike-offer")   return <StrikeOffer retail={retail} offer={offer} />;
  if (variant === "amount-once")    return <>{offer} once</>;
  if (variant === "amount-suffix")  return <>{offer} one-time</>;
  if (variant === "cta")            return <>Get Golden Indicator — {offer} →</>;
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
