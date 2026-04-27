import "server-only";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { OFFER_USD, RETAIL_USD } from "@/lib/pricing";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe Checkout Session creator. Hits the Stripe API and returns a hosted
// checkout URL the client redirects to. The URL is single-use and scoped to
// this purchase — webhook fires `checkout.session.completed` on payment.

type Body = {
  email?: string;
};

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

export async function POST(req: Request) {
  // Soft rate-limit: 5/min per IP. Stops payment-page abuse without
  // blocking real buyers who hit "buy" twice in frustration.
  const limit = rateLimit(`stripe:${clientIp(req)}`, { max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Wait a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // Empty body is fine — Stripe will collect email on the hosted page.
  }

  const email = (body.email || "").trim().toLowerCase();
  if (email && !isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

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
      // Apple Pay, Google Pay, Link, etc). Apple Pay domain verification
      // is handled automatically because we use the hosted checkout.stripe.com
      // flow, so no .well-known files need to live on www.easytradesetup.com.
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: OFFER_USD * 100,
            product_data: {
              name: "Golden Indicator — Inaugural",
              description: `Lifetime access · TradingView Pine v5 indicator + bundle. Retail $${RETAIL_USD}, inaugural $${OFFER_USD}.`,
              metadata: { sku: "golden-indicator", tier: "inaugural" },
            },
          },
        },
      ],
      // Stripe collects the email on the hosted page when not provided —
      // the new one-tap flow doesn't ask. Pre-fill only when the API
      // caller explicitly passes it (legacy support).
      ...(email ? { customer_email: email } : {}),
      // Always create a Stripe Customer record. Saves the buyer's payment
      // method for future SKUs (Mentor PDF, etc.) without re-entering.
      customer_creation: "always",
      // Capture metadata for later attribution / refund-flow auditing.
      metadata: {
        product: "golden-indicator",
        tier: "inaugural",
        offer_usd: String(OFFER_USD),
      },
      // Buyer lands on /thank-you with the session_id — we verify there
      // and show the entitlement state.
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      // Grant 30 minutes to complete; abandoned sessions don't pollute the
      // dashboard.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      // Allow promo codes the founder may issue manually via Stripe.
      allow_promotion_codes: true,
      // Billing address optional — keeps friction low. Card-only US/global,
      // localised tax handled later when Stripe Tax flips on.
      billing_address_collection: "auto",
      // Phone number not required — keeps the form short, US/EU buyers
      // tend to bounce when phones are mandatory.
      phone_number_collection: { enabled: false },
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "Checkout session missing redirect URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, url: session.url, id: session.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe error";
    console.error("[stripe/checkout] failed", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
