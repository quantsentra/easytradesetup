import "server-only";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { OFFER_USD, OFFER_INR, RETAIL_USD, RETAIL_INR } from "@/lib/pricing";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { getUser } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe Checkout Session creator. Hits the Stripe API and returns a hosted
// checkout URL the client redirects to. The URL is single-use and scoped to
// this purchase — webhook fires `checkout.session.completed` on payment.
//
// LOGIN-REQUIRED: The /checkout page enforces auth before this endpoint is
// reached, but we double-check here. Anonymous purchases are rejected so
// every entitlement maps to a real Supabase user_id from the start.
//
// CURRENCY: Body accepts { currency: "usd" | "inr" }. INR is the bridge
// for India until the UPI gateway lands. Stripe accepts INR via cross-border
// charging for international accounts. Defaults to country-derived choice
// from the x-vercel-ip-country header, falling back to USD.

type Body = { currency?: string };

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Sign in first — purchases require an account.", needsAuth: true },
      { status: 401 },
    );
  }

  const limit = rateLimit(`stripe:${clientIp(req)}`, { max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Wait a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: Body = {};
  try {
    if ((req.headers.get("content-length") || "0") !== "0") {
      body = (await req.json()) as Body;
    }
  } catch {
    // Empty body is fine — falls through to default currency selection.
  }

  // Currency resolution: explicit body wins → IP country fallback → USD.
  const requested = (body.currency || "").toLowerCase();
  const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase();
  const currency: "usd" | "inr" =
    requested === "inr" ? "inr"
    : requested === "usd" ? "usd"
    : country === "IN" ? "inr"
    : "usd";

  const offer = currency === "inr" ? OFFER_INR : OFFER_USD;
  const retail = currency === "inr" ? RETAIL_INR : RETAIL_USD;
  const symbol = currency === "inr" ? "₹" : "$";
  const formattedOffer = currency === "inr" ? offer.toLocaleString("en-IN") : String(offer);
  const formattedRetail = currency === "inr" ? retail.toLocaleString("en-IN") : String(retail);

  const email = (user.email || "").trim().toLowerCase();
  const origin =
    req.headers.get("origin") ||
    `https://${req.headers.get("host") || "www.easytradesetup.com"}`;

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Payments not configured yet — try again shortly." },
      { status: 503 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // payment_method_types intentionally omitted — Stripe auto-enables
      // every method enabled in the Dashboard for this account (cards,
      // Apple Pay, Google Pay, Link, etc).
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: offer * 100,
            product_data: {
              name: "Golden Indicator — Launch price",
              description: `Lifetime access · TradingView Pine v5 indicator + bundle. Launch price ${symbol}${formattedOffer} (retail ${symbol}${formattedRetail}).`,
              metadata: { sku: "golden-indicator", tier: "launch" },
            },
          },
        },
      ],
      ...(email ? { customer_email: email } : {}),
      customer_creation: "always",
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        product: "golden-indicator",
        tier: "launch",
        offer_amount: String(offer),
        currency,
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Golden Indicator — Launch price (lifetime access)",
          metadata: {
            product: "golden-indicator",
            tier: "launch",
            user_id: user.id,
            currency,
          },
          footer: "EasyTradeSetup · Educational tool, not investment advice. Support: portal.easytradesetup.com/portal/support",
        },
      },
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "Checkout session missing redirect URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, url: session.url, id: session.id, currency });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe error";
    console.error("[stripe/checkout] failed", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
