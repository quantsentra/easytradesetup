import "server-only";
import { cookies } from "next/headers";
import { CONSENT_COOKIE, type ConsentState } from "./consent";

export async function readConsent(): Promise<ConsentState> {
  const store = await cookies();
  const v = store.get(CONSENT_COOKIE)?.value;
  if (v === "all" || v === "essential") return v;
  return "unset";
}
