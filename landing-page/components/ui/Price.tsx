import { cookies, headers } from "next/headers";
import { USD_SET, INR_SET, format, type PriceSet } from "@/lib/pricing";
import { CURRENCY_COOKIE, resolveCurrency } from "@/lib/currency";

// Server-rendered currency-aware price. Reads the ets_ccy cookie that
// middleware writes on every request — but on the FIRST visit the cookie
// only lands on the response, so the same render still sees no cookie.
// To stay in sync with middleware's resolution + the client-side
// PriceClient component, we fall back to x-vercel-ip-country exactly the
// way middleware + lib/geo.ts do. Without this fallback, a first-visit
// India user saw INR in the OfferBanner (client-rendered after hydration)
// and USD in the Hero CTA (server-rendered with no cookie yet).
//
// Client components that already need "use client" for other reasons
// (StickyBuyBar, OfferBanner) should import <PriceClient /> instead.

type Variant =
  | "amount"         // "$49"
  | "retail"         // "$149"
  | "strike-offer"   // struck retail + offer side-by-side
  | "amount-once"    // "$49 once"
  | "amount-suffix"  // "$49 one-time"
  | "cta";           // "Get Golden Indicator — $49 →"

export default async function Price({ variant = "amount" }: { variant?: Variant }) {
  const store = await cookies();
  const h = await headers();
  const ccy = resolveCurrency({
    cookie: store.get(CURRENCY_COOKIE)?.value,
    ipCountry: h.get("x-vercel-ip-country"),
  });
  const set: PriceSet = ccy === "inr" ? INR_SET : USD_SET;
  const offer = format(set, set.offer);
  const retail = format(set, set.retail);

  if (variant === "retail")        return <>{retail}</>;
  if (variant === "strike-offer")  return <StrikeOffer retail={retail} offer={offer} />;
  if (variant === "amount-once")   return <>{offer} once</>;
  if (variant === "amount-suffix") return <>{offer} one-time</>;
  if (variant === "cta")           return <>Get Golden Indicator — {offer} →</>;
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
