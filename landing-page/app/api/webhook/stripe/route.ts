import "server-only";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { fulfillCheckoutSession, revokeForCharge } from "@/lib/stripe-fulfill";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe webhook receiver. Stripe POSTs the raw event body + a signature
// header here. We verify with STRIPE_WEBHOOK_SECRET, then dispatch on
// event.type. Fulfilment logic lives in lib/stripe-fulfill.ts so the
// admin recovery endpoint can replay missed events.
//
// Critical: must read the request body as raw bytes (req.text()) because
// Stripe's signature is computed over the exact bytes — JSON re-serialise
// breaks verification.

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    console.error("[stripe/webhook] missing signature header or secret env");
    return NextResponse.json(
      { ok: false, error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[stripe/webhook] signature verification failed", e);
    return NextResponse.json({ ok: false, error: "Bad signature" }, { status: 400 });
  }

  // Idempotency: Stripe may resend the same event. Track event.id so we
  // never grant the same entitlement twice. Best-effort — if the table
  // doesn't exist yet (pre-migration) we just process the event.
  const seen = await checkAndMarkEvent(event.id);
  if (seen) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const result = await fulfillCheckoutSession(
          event.data.object as Stripe.Checkout.Session,
        );
        console.log("[stripe/webhook] fulfilled", result);
        break;
      }
      case "charge.refunded":
        await revokeForCharge(event.data.object as Stripe.Charge);
        break;
      default:
        // Acknowledge unhandled events so Stripe stops retrying. Logged
        // for visibility but not actionable yet.
        console.log("[stripe/webhook] ignored event type", event.type);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Webhook handler error";
    console.error("[stripe/webhook] handler error", msg, "event=", event.type, "id=", event.id);
    // Return 500 so Stripe retries — handler bugs should be re-attempted.
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

async function checkAndMarkEvent(eventId: string): Promise<boolean> {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return false;
  }
  const { data: existing } = await supa
    .from("stripe_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();
  if (existing) return true;
  await supa.from("stripe_events").insert({ id: eventId });
  return false;
}
