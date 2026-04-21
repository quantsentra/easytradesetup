"use client";
import { useEffect, useState } from "react";
import { USD_SET, INR_SET, format, type PriceSet } from "@/lib/pricing";

type Variant =
  | "amount"         // just the offer amount — "$49"
  | "retail"         // just the retail amount — "$149"
  | "strike-offer"   // struck retail + offer side-by-side
  | "amount-once"    // "$49 once"
  | "amount-suffix"  // "$49 one-time"
  | "cta";           // "Get Golden Indicator — $49 →"

function detectIndia(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return true;
    const lang = typeof navigator !== "undefined" ? navigator.language || "" : "";
    if (lang.endsWith("-IN") || lang === "hi") return true;
  } catch {
    /* ignored */
  }
  return false;
}

export default function Price({ variant = "amount" }: { variant?: Variant }) {
  const [inIndia, setInIndia] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setInIndia(detectIndia());
    setReady(true);
  }, []);

  const set: PriceSet = inIndia ? INR_SET : USD_SET;
  const offer  = format(set, set.offer);
  const retail = format(set, set.retail);

  if (!ready) {
    return (
      <span aria-hidden className="opacity-0 inline-block">
        {format(USD_SET, USD_SET.offer)}
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
