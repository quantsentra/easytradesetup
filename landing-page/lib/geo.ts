import { headers } from "next/headers";

// Marketing pages need a coarse "home market" signal so they can lead with
// content the visitor recognises. India sees NIFTY first; everyone else
// sees SPX / NAS first. Pricing is USD-only globally now, so this is a
// pure IP-country read (no currency cookie behind it).
export type HomeMarket = "in" | "global";

export async function resolveHomeMarket(): Promise<HomeMarket> {
  const h = await headers();
  const country = h.get("x-vercel-ip-country")?.toUpperCase();
  return country === "IN" ? "in" : "global";
}
