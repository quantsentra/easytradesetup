"use client";
import { useEffect, useState } from "react";

type Variant = "amount" | "amount-suffix" | "amount-once" | "cta";

const INR = { symbol: "₹", amount: 2499, locale: "en-IN", code: "INR" };
const USD = { symbol: "$", amount: 49,   locale: "en-US", code: "USD" };

function detectIndia(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return true;
    const lang = typeof navigator !== "undefined" ? navigator.language || "" : "";
    if (lang.endsWith("-IN") || lang === "hi") return true;
  } catch {
    /* SSR or restricted env */
  }
  return false;
}

function format(c: typeof INR) {
  return `${c.symbol}${c.amount.toLocaleString(c.locale)}`;
}

export default function Price({ variant = "amount" }: { variant?: Variant }) {
  const [inIndia, setInIndia] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setInIndia(detectIndia());
    setReady(true);
  }, []);

  const c = inIndia ? INR : USD;
  const price = format(c);

  if (!ready) {
    return (
      <span aria-hidden className="opacity-0 inline-block">
        {format(USD)}
      </span>
    );
  }

  if (variant === "amount-once")   return <>{price} once</>;
  if (variant === "amount-suffix") return <>{price} one-time</>;
  if (variant === "cta")           return <>Get Golden Indicator — {price} →</>;
  return <>{price}</>;
}

export function priceLabel(inIndia: boolean) {
  return format(inIndia ? INR : USD);
}
