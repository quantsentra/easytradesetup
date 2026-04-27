import "server-only";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { OFFER_USD, RETAIL_USD } from "@/lib/pricing";
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

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Sign in first — purchases require an account.", needsAuth: true },
      { status: 401 },
    );
  }

  // Soft rate-limit: 5/min per IP. Stops payment-page abuse without
  // blocking real buyers who hit "buy" twice in frustration.
  const limit = rateLimit(`stripe:${clientIp(req)}`, { max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Wait a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  // Buyer's authenticated email is the one we trust. Stripe-side mismatch
  // is fine — the entitlement key is user_id from metadata, not the email.
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
      // Pre-fill the buyer's signed-in email so they don't retype it.
      ...(email ? { customer_email: email } : {}),
      // Always create a Stripe Customer record. Saves the buyer's payment
      // method for future SKUs (Mentor PDF, etc.) without re-entering.
      customer_creation: "always",
      // user_id is the authoritative link from Stripe → Supabase. The
      // webhook reads this first; email lookup is only the fallback for
      // legacy / pre-auth-gated purchases.
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        product: "golden-indicator",
        tier: "inaugural",
        offer_usd: String(OFFER_USD),
      },
      // Auto-create a Stripe-hosted PDF invoice + email it to the buyer.
      // Independent of our Resend "welcome" email, this lands in their
      // inbox as a proper receipt with our brand + product details.
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Golden Indicator — Inaugural offer (lifetime access)",
          metadata: {
            product: "golden-indicator",
            tier: "inaugural",
            user_id: user.id,
          },
          footer: "EasyTradeSetup · Educational tool, not investment advice. 7-day no-questions refund.",
        },
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
