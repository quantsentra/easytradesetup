"use client";
import { USD_SET, format } from "@/lib/pricing";

// USD-only client price. Pricing is a single global USD figure, so this no
// longer reads a currency cookie — it renders the same on server and client,
// so there's no hydration flash. Kept as a separate client export only
// because its callers (StickyBuyBar, OfferBanner) are already client
// components; server surfaces should import the default <Price /> instead.

type Variant =
  | "amount"
  | "retail"
  | "strike-offer"
  | "amount-once"
  | "amount-suffix"
  | "cta";

export default function PriceClient({ variant = "amount" }: { variant?: Variant }) {
  const offer = format(USD_SET, USD_SET.offer);
  const retail = format(USD_SET, USD_SET.retail);

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
