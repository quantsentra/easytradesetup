import type { Metadata } from "next";
import Link from "next/link";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { getUser } from "@/lib/auth-server";

const PORTAL_ORIGIN = "https://portal.easytradesetup.com";

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
  const authedUser = await getUser();
  const isSignedIn = !!authedUser;

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
            {isSignedIn ? (
              <> Your license is active on this account — tap below to land in the portal.</>
            ) : (
              <> Magic-link email is on the way to <strong className="text-ink">{session.email || "your inbox"}</strong> — tap it to sign into your portal.</>
            )}{" "}
            Stripe will email a separate PDF invoice receipt within a minute.
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
            Your portal sign-in link is on the way — arrival in under 60 seconds. Inside you'll find the
            indicator source, the interactive course, the knowledge quiz, and the risk calculator.
            If nothing lands, check spam, then email us.
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          {isStripe && session?.paid ? (
            <>
              <a
                href={isSignedIn ? `${PORTAL_ORIGIN}/portal` : `${PORTAL_ORIGIN}/sign-in`}
                className="btn btn-primary"
              >
                {isSignedIn ? "Open my portal →" : "Sign in to portal"}
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
            Stuck on install? Open a support ticket at{" "}
            <a href="https://portal.easytradesetup.com/support" className="underline">
              portal · support
            </a>{" "}
            — human reply within 24h. Or reply to the welcome email.
          </p>
        )}
      </div>
    </section>
  );
}
