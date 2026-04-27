import type { Metadata } from "next";
import Link from "next/link";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// On Stripe success_url, the URL has ?session_id=cs_... We pull the session
// from the API to confirm the payment status (paid / unpaid) and surface
// the buyer email for orientation. We do NOT grant entitlements here —
// that's the webhook's job. This page only renders state.

async function fetchSession(sessionId: string | undefined) {
  if (!sessionId || !stripeConfigured()) return null;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      paid: session.payment_status === "paid",
      email: session.customer_details?.email || session.customer_email || null,
      amountTotal: session.amount_total || 0,
      currency: (session.currency || "usd").toLowerCase(),
    };
  } catch {
    return null;
  }
}

function fmt(amountCents: number, currency: string): string {
  const amt = amountCents / 100;
  if (currency === "usd") return `$${amt.toFixed(2)}`;
  if (currency === "inr") return `₹${amt.toLocaleString("en-IN")}`;
  return `${amt.toFixed(2)} ${currency.toUpperCase()}`;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }>;
}) {
  const sp = (await searchParams) || {};
  const session = await fetchSession(sp.session_id);
  const isStripe = !!sp.session_id;

  return (
    <section className="above-bg">
      <div className="container-wide py-32 md:py-40 text-center max-w-2xl mx-auto">
        <div className="eye justify-center inline-flex">
          <span className="eye-dot" aria-hidden />
          {isStripe && session?.paid
            ? "Payment confirmed"
            : isStripe
              ? "Processing payment"
              : "Order confirmed"}
        </div>

        <h1 className="mt-5 h-hero">
          {isStripe && session?.paid
            ? "You're in. Check your inbox."
            : "Welcome. Check your inbox."}
        </h1>

        {isStripe && session?.paid && (
          <p className="mt-6 text-body-lg text-ink-60 leading-relaxed">
            Paid <strong className="text-ink">{fmt(session.amountTotal, session.currency)}</strong>.
            Magic-link email is on the way to{" "}
            <strong className="text-ink">{session.email || "your inbox"}</strong> — tap it to drop
            straight into your portal. Indicator unlock, install guide, and Trade Logic PDF are
            inside.
          </p>
        )}

        {isStripe && !session?.paid && (
          <p className="mt-6 text-body-lg text-ink-60 leading-relaxed">
            Stripe is finalising your payment. This page will refresh in a moment — your email
            will arrive shortly with your portal access link.
          </p>
        )}

        {!isStripe && (
          <p className="mt-6 text-body-lg text-ink-60 leading-relaxed">
            Your Pine Script, Trade Logic PDF, and risk calculator link are on the way — arrival in under 60 seconds.
            If nothing lands, check spam, then email us.
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          {isStripe && session?.paid ? (
            <>
              <a
                href="https://portal.easytradesetup.com/sign-in"
                className="btn btn-primary"
              >
                Open my portal
              </a>
              <Link href="/docs/install" className="btn btn-outline">
                Install guide
              </Link>
            </>
          ) : (
            <>
              <Link href="/docs/install" className="btn btn-primary">
                Install guide
              </Link>
              <Link href="/docs/faq" className="btn btn-outline">
                Read the FAQ
              </Link>
            </>
          )}
        </div>

        {isStripe && session?.paid && (
          <p className="mt-8 text-caption text-muted">
            Need help? Reply to the welcome email or write{" "}
            <a href="mailto:thomas@easytradesetup.com" className="underline">
              thomas@easytradesetup.com
            </a>
            . 7-day refund window, no questions.
          </p>
        )}
      </div>
    </section>
  );
}
