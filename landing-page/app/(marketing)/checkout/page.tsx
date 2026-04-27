import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BotIdClient } from "botid/client";
import PageHeader from "@/components/ui/PageHeader";
import Price from "@/components/ui/Price";
import StripeBuyButton from "@/components/checkout/StripeBuyButton";
import { OFFER_LABEL, OFFER_USD, OFFER_INR } from "@/lib/pricing";
import { getUser } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Buy Golden Indicator — inaugural launch price",
  description:
    "Buy Golden Indicator at the inaugural launch price. $49 one-time, lifetime access. Stripe checkout for global cards, UPI for India coming soon.",
  alternates: { canonical: "/checkout" },
};

export const dynamic = "force-dynamic";

const PORTAL_ORIGIN = "https://portal.easytradesetup.com";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<{ cancelled?: string }>;
}) {
  const sp = (await searchParams) || {};
  const cancelled = sp.cancelled === "1";

  // Login-first: anonymous purchases create orphan entitlements. Send
  // unauthed visitors to sign-in and bring them back here on success.
  const user = await getUser();
  if (!user) {
    const redirectUrl = `${PORTAL_ORIGIN}/sign-in?redirect=${encodeURIComponent("https://www.easytradesetup.com/checkout")}`;
    redirect(redirectUrl);
  }
  const userEmail = user.email || "";

  // 1-click flow: signed-in buyer who arrived from a "Buy" CTA elsewhere
  // expects to land on Stripe directly, not see another preview page. We
  // create the Checkout Session server-side and redirect immediately.
  // Skip auto-redirect when ?cancelled=1 (came back from Stripe cancel)
  // so the user can read the cancellation banner + click Pay again.
  if (!cancelled) {
    try {
      const { getStripe } = await import("@/lib/stripe");
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: OFFER_USD * 100,
              product_data: {
                name: "Golden Indicator — Inaugural",
                description: `Lifetime access · TradingView Pine v5 indicator + bundle. Retail $149, inaugural $${OFFER_USD}.`,
                metadata: { sku: "golden-indicator", tier: "inaugural" },
              },
            },
          },
        ],
        customer_email: userEmail,
        customer_creation: "always",
        client_reference_id: user.id,
        metadata: {
          user_id: user.id,
          product: "golden-indicator",
          tier: "inaugural",
          offer_usd: String(OFFER_USD),
        },
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: "Golden Indicator — Inaugural offer (lifetime access)",
            metadata: { product: "golden-indicator", tier: "inaugural", user_id: user.id },
            footer: "EasyTradeSetup · Educational tool, not investment advice. 7-day no-questions refund.",
          },
        },
        success_url: `https://www.easytradesetup.com/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://www.easytradesetup.com/checkout?cancelled=1`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        phone_number_collection: { enabled: false },
      });
      if (session.url) {
        redirect(session.url);
      }
    } catch (e) {
      // Throwing inside Server Components inside a redirect is normal —
      // Next signals redirects via a thrown sentinel. Re-throw any
      // genuine errors so the user lands on the static fallback below.
      if (e && typeof e === "object" && "digest" in e) throw e;
      console.error("[checkout/page] Stripe session create failed", e);
      // Fall through and render the static page so the buyer can retry.
    }
  }

  return (
    <>
      {/* Vercel BotID — silent bot detection on form submission. */}
      <BotIdClient
        protect={[
          { path: "/api/lead", method: "POST" },
          { path: "/api/stripe/checkout", method: "POST" },
        ]}
      />
      <PageHeader
        eyebrow="Buy · Inaugural offer"
        title={<>Buy Golden Indicator.</>}
        lede={`One-time payment, lifetime access. Pay $${OFFER_USD} via Stripe — secure card checkout. India users: UPI via Razorpay coming in days; drop your email and we'll alert you when it goes live.`}
      />

      <section className="bg-surface">
        <div className="container-wide py-16">
          {cancelled && (
            <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5" aria-hidden>
                <circle cx="12" cy="12" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.8" />
                <path d="M12 8v5 M12 16h.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="text-caption leading-relaxed text-amber-200">
                <strong className="font-semibold">Checkout cancelled.</strong> No charge made. Tap the button below whenever you're ready.
              </div>
            </div>
          )}

          <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5" aria-hidden>
              <circle cx="12" cy="12" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.8" />
              <path d="M12 8v5 M12 16h.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="text-caption leading-relaxed text-amber-200">
              <strong className="font-semibold">Educational tool, not investment advice.</strong> Golden Indicator is a
              chart tool, not a signal service. You decide every trade. Past performance does not guarantee future
              results. Trading in financial instruments involves substantial risk of loss. Indian users — we are not
              SEBI-registered. Read our full{" "}
              <Link href="/legal/disclaimer" className="underline">trading disclaimer</Link> before purchase.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 card-apple p-6 sm:p-8 md:p-10">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                Step 1 · Pay
              </div>
              <h2 className="mt-3 h-tile">One tap. <Price variant="amount" />. Lifetime access.</h2>
              <p className="mt-4 text-body text-muted leading-relaxed">
                Signed in as <strong className="text-ink">{userEmail}</strong>.
                Tap the button — Stripe handles the rest. Apple Pay, Google Pay,
                or card on the next screen. Pay{" "}
                <strong className="text-ink">${OFFER_USD}</strong> (retail{" "}
                <span className="line-through decoration-muted-faint/60">${149}</span>),
                bounce straight to your portal — your license unlocks instantly.
              </p>

              <div className="mt-8">
                <StripeBuyButton label={`Pay $${OFFER_USD} →`} />
              </div>

              <ul className="mt-8 space-y-2 text-caption text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-[#2da44e] mt-0.5">✓</span>
                  <span>Lifetime access — no subscription, no renewals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2da44e] mt-0.5">✓</span>
                  <span>Inaugural price locked — even if retail moves up later.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2da44e] mt-0.5">✓</span>
                  <span>7-day refund window, no questions asked.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2da44e] mt-0.5">✓</span>
                  <span>Magic link emailed on payment — straight to your portal.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 hairline-t">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider mb-4">
                  Payment methods
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-caption text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-semibold text-ink">Stripe</span>
                    <span className="text-muted-faint">· cards · live now · USD ${OFFER_USD}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-semibold text-muted-faint">UPI · India</span>
                    <span className="text-muted-faint">· coming soon · ₹{OFFER_INR.toLocaleString("en-IN")}</span>
                  </span>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-2 card-apple p-6 sm:p-8 md:p-10">
              <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Order preview</div>
              <div className="mt-6 pb-6 hairline-b">
                <div className="text-body text-ink font-medium">Golden Indicator · complete bundle</div>
                <div className="mt-1 text-caption text-muted">Lifetime access · one-time payment</div>
              </div>
              <div className="mt-6 flex items-baseline justify-between text-body">
                <span className="text-muted">Retail</span>
                <span className="tabular-nums text-muted-faint line-through decoration-muted-faint/60">
                  <Price variant="retail" />
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-body">
                <span className="text-muted">Offer applied</span>
                <span className="inline-flex items-center gap-1.5 bg-up/10 text-up px-2.5 py-0.5 rounded-full text-nano font-bold uppercase tracking-widest border border-up/30">
                  {OFFER_LABEL}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between text-body">
                <span className="text-muted">Taxes</span>
                <span className="tabular-nums text-ink">Included</span>
              </div>
              <div className="mt-6 pt-6 hairline-t flex items-baseline justify-between">
                <span className="h-card">Launch price</span>
                <span className="h-tile text-blue-link"><Price variant="amount" /></span>
              </div>

              <ul className="mt-6 pt-6 hairline-t space-y-2.5 text-caption text-muted">
                {[
                  "7-day no-questions refund",
                  "Lifetime updates included",
                  "One-time payment — no subscription",
                  "Magic link on payment confirmation",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1 flex-shrink-0" aria-hidden>
                      <path d="M2 7l3 3 7-7" stroke="#2da44e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="mt-10 text-center">
            <Link href="/pricing" className="link-apple text-caption">
              ← See full pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
