import "server-only";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillCheckoutSession } from "@/lib/stripe-fulfill";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only manual fulfilment replay. When the Stripe webhook misses an
// event (e.g. endpoint URL was misconfigured at the time of purchase),
// admin can drop the session_id (cs_live_…) here and we re-run the same
// fulfilment path: ensure user, grant entitlement, send welcome email +
// admin notice. Idempotent — already-granted entitlements are detected
// and reported back so accidental double-clicks don't re-email.

type Body = { sessionId?: string };

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  if (!(await isAdmin(user.id))) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = (body.sessionId || "").trim();
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { ok: false, error: "sessionId must start with cs_ (Stripe Checkout Session id)" },
      { status: 400 },
    );
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe API error";
    return NextResponse.json({ ok: false, error: `Lookup failed: ${msg}` }, { status: 502 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({
      ok: false,
      error: `Session ${sessionId} payment_status is "${session.payment_status}", not paid. Refusing to fulfil.`,
    }, { status: 409 });
  }

  const result = await fulfillCheckoutSession(session);

  return NextResponse.json({
    ok: result.ok && result.entitlementGranted,
    sessionId,
    email: result.email,
    userId: result.userId,
    amount: result.amountCents / 100,
    currency: result.currency,
    alreadyGranted: result.alreadyGranted,
    entitlementGranted: result.entitlementGranted,
    warnings: result.warnings,
  });
}
