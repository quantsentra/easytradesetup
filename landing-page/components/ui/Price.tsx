import { cookies } from "next/headers";
import { USD_SET, INR_SET, format, type PriceSet } from "@/lib/pricing";
import { CURRENCY_COOKIE } from "@/lib/currency";

// Server-rendered currency-aware price. Reads the ets_ccy cookie that
// middleware writes on every request (geo-derived on first visit;
// overridable via ?ccy= or the TopNav switcher). The HTML is correct on
// first paint — no flash, no SEO mismatch, no broken share-card previews.
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
  const ccy = store.get(CURRENCY_COOKIE)?.value;
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
