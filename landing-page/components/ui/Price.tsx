import { USD_SET, format } from "@/lib/pricing";

// USD-only price renderer. Pricing is a single global USD figure, so this
// is a plain server component with no currency resolution.

type Variant =
  | "amount"         // "$49"
  | "retail"         // "$149"
  | "strike-offer"   // struck retail + offer side-by-side
  | "amount-once"    // "$49 once"
  | "amount-suffix"  // "$49 one-time"
  | "cta";           // "Get Golden Indicator — $49 →"

export default function Price({ variant = "amount" }: { variant?: Variant }) {
  const offer = format(USD_SET, USD_SET.offer);
  const retail = format(USD_SET, USD_SET.retail);

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
