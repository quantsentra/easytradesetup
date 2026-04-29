import { cookies, headers } from "next/headers";
import { CURRENCY_COOKIE, isValidCurrency } from "@/lib/currency";

// Marketing pages need a coarse "home market" signal so they can lead with
// content the visitor recognises. India sees NIFTY first; everyone else
// sees SPX / NAS first. Same cookie + IP fallback that drives currency.
export type HomeMarket = "in" | "global";

export async function resolveHomeMarket(): Promise<HomeMarket> {
  const store = await cookies();
  const cookieVal = store.get(CURRENCY_COOKIE)?.value?.toLowerCase();
  if (isValidCurrency(cookieVal)) {
    return cookieVal === "inr" ? "in" : "global";
  }
  const h = await headers();
  const country = h.get("x-vercel-ip-country")?.toUpperCase();
  return country === "IN" ? "in" : "global";
}
