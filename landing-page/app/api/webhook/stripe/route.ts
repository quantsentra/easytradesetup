import "server-only";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe webhook receiver. Stripe POSTs the raw event body + a signature
// header here. We verify the signature with STRIPE_WEBHOOK_SECRET, then
// dispatch on event.type.
//
// Critical: must read the request body as raw bytes (req.text()) because
// Stripe's signature is computed over the exact bytes — JSON re-serialise
// breaks verification. Always reply 200 fast on a recognised event so
// Stripe's retry logic doesn't double-fire.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.PURCHASE_FROM_EMAIL || "EasyTradeSetup <onboarding@resend.dev>";
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "thomas@easytradesetup.com";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://www.easytradesetup.com";
const PORTAL_ORIGIN = "https://portal.easytradesetup.com";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

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
      case "checkout.session.completed":
        await onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "charge.refunded":
        await onChargeRefunded(event.data.object as Stripe.Charge);
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

// ---- Event handlers ---------------------------------------------------------

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email =
    session.customer_details?.email ||
    session.customer_email ||
    "";
  const amountCents = session.amount_total || 0;
  const currency = (session.currency || "usd").toLowerCase();
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id || null;

  if (!email) {
    console.error("[stripe/webhook] checkout.session.completed without email", session.id);
    return; // Cannot fulfil without a delivery target.
  }

  // Resolve or create Supabase auth user, then upsert the entitlement.
  const userId = await ensureSupabaseUser(email);
  if (userId) {
    await upsertEntitlement({
      userId,
      stripeSessionId: session.id,
      stripeCustomerId: customerId,
      amountCents,
      currency,
    });
  }

  // Magic link: lets the buyer drop straight into the portal without a
  // password reset. Generated only when service-role key is present.
  const magicLink = userId ? await generateMagicLink(email) : null;

  // Notify the buyer + admin in parallel; one failure mustn't block the
  // other. We always reply 200 to Stripe regardless of email outcome.
  await Promise.allSettled([
    sendBuyerEmail(email, { amountCents, currency, magicLink }),
    sendAdminNotice(email, { amountCents, currency, sessionId: session.id, customerId }),
  ]);
}

async function onChargeRefunded(charge: Stripe.Charge) {
  const email = charge.billing_details?.email || charge.receipt_email;
  if (!email) {
    console.warn("[stripe/webhook] charge.refunded without email", charge.id);
    return;
  }

  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return;
  }

  const { data: users } = await supa.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const target = users?.users?.find((u: { email?: string | null; id: string }) => (u.email || "").toLowerCase() === email.toLowerCase());
  if (!target) return;

  await supa.from("entitlements").update({
    active: false,
    revoked_at: new Date().toISOString(),
    source: "refund",
  }).eq("user_id", target.id).eq("product", "golden-indicator");
}

// ---- Supabase helpers -------------------------------------------------------

async function ensureSupabaseUser(email: string): Promise<string | null> {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return null;
  }

  // Stripe uses email as a stable identifier. We page through the user list
  // to match — fine for early stage; replace with a direct lookup once the
  // table grows past a few hundred users.
  const { data: list } = await supa.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list?.users?.find((u: { email?: string | null; id: string }) => (u.email || "").toLowerCase() === email.toLowerCase());
  if (existing) return existing.id;

  const { data: created, error } = await supa.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { source: "stripe_purchase" },
  });
  if (error || !created.user) {
    console.error("[stripe/webhook] failed to create user", email, error?.message);
    return null;
  }
  return created.user.id;
}

async function upsertEntitlement(args: {
  userId: string;
  stripeSessionId: string;
  stripeCustomerId: string | null;
  amountCents: number;
  currency: string;
}) {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return;
  }

  await supa.from("entitlements").upsert(
    {
      user_id: args.userId,
      product: "golden-indicator",
      active: true,
      granted_at: new Date().toISOString(),
      revoked_at: null,
      source: "stripe",
      stripe_session_id: args.stripeSessionId,
      stripe_customer_id: args.stripeCustomerId,
      amount_cents: args.amountCents,
      currency: args.currency,
    },
    { onConflict: "user_id,product" },
  );
}

async function generateMagicLink(email: string): Promise<string | null> {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return null;
  }
  try {
    const { data, error } = await supa.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${PORTAL_ORIGIN}/portal` },
    });
    if (error) return null;
    return data.properties?.action_link || null;
  } catch {
    return null;
  }
}

// ---- Idempotency ------------------------------------------------------------

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

// ---- Email --------------------------------------------------------------------

function fmtMoney(amountCents: number, currency: string): string {
  const amt = amountCents / 100;
  if (currency === "usd") return `$${amt.toFixed(2)}`;
  if (currency === "inr") return `₹${amt.toLocaleString("en-IN")}`;
  return `${amt.toFixed(2)} ${currency.toUpperCase()}`;
}

async function sendBuyerEmail(
  email: string,
  args: { amountCents: number; currency: string; magicLink: string | null },
) {
  if (!resend) return;
  const amount = fmtMoney(args.amountCents, args.currency);
  const portalCta = args.magicLink || `${PORTAL_ORIGIN}/sign-in`;
  const subject = `Welcome — your Golden Indicator is unlocked`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" />
<title>${subject}</title></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:Inter,Arial,sans-serif;color:#15181a;">
<div style="display:none;max-height:0;overflow:hidden;">Payment confirmed. Tap the button below to access your portal — Pine indicator, install guide, and refund window.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid rgba(21,24,26,0.08);border-radius:14px;">
<tr><td style="padding:28px 32px 20px;border-bottom:1px solid rgba(21,24,26,0.08);">
<div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(21,24,26,0.52);font-family:'Space Grotesk',Arial,sans-serif;">Payment confirmed</div>
<h1 style="margin:8px 0 0;font:600 24px 'Space Grotesk',Arial,sans-serif;letter-spacing:-0.02em;">Welcome aboard.</h1>
<p style="margin:8px 0 0;font-size:14.5px;color:rgba(21,24,26,0.72);line-height:1.55;">${amount} processed. Lifetime access unlocked.</p>
</td></tr>
<tr><td style="padding:24px 32px;">
<p style="margin:0;font-size:14.5px;line-height:1.6;color:#15181a;">Your portal is ready. Tap below to land straight inside — install guide, indicator unlock instructions, Trade Logic PDF, and Risk Calculator are waiting.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 4px;"><tr><td>
<a href="${portalCta}" style="display:inline-block;background:#2B7BFF;color:#fff;text-decoration:none;font:600 14px Inter,Arial,sans-serif;padding:12px 22px;border-radius:9px;">Open the portal →</a>
</td></tr></table>
<p style="margin:18px 0 0;font-size:13px;color:rgba(21,24,26,0.52);line-height:1.55;">If the button doesn't work, paste this in your browser:<br /><span style="word-break:break-all;">${portalCta}</span></p>
</td></tr>
<tr><td style="padding:18px 32px 24px;border-top:1px solid rgba(21,24,26,0.08);font-size:12.5px;color:rgba(21,24,26,0.52);line-height:1.55;">
<strong style="color:rgba(21,24,26,0.72);">Refund window:</strong> 7 days, no-questions. Reply to this email to claim.<br />
<strong style="color:rgba(21,24,26,0.72);">Educational tool</strong> — not investment advice. You decide every trade.
</td></tr>
</table>
<p style="font-size:11px;color:rgba(21,24,26,0.40);margin:18px 0 0;font-family:Inter,Arial,sans-serif;">EasyTradeSetup · <a href="${SITE_ORIGIN}" style="color:rgba(21,24,26,0.52);">easytradesetup.com</a></p>
</td></tr></table></body></html>`;

  const text = `Payment confirmed — ${amount}.

Your Golden Indicator portal is ready. Open here:
${portalCta}

Refund window: 7 days, no questions. Reply to this email to claim.

Educational tool, not investment advice — you decide every trade.

— EasyTradeSetup`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
      text,
      replyTo: NOTIFY_EMAIL,
      headers: { "List-Unsubscribe": `<mailto:${NOTIFY_EMAIL}?subject=Unsubscribe>` },
    });
  } catch (e) {
    console.error("[stripe/webhook] buyer email failed", e);
  }
}

async function sendAdminNotice(
  email: string,
  args: { amountCents: number; currency: string; sessionId: string; customerId: string | null },
) {
  if (!resend) return;
  const amount = fmtMoney(args.amountCents, args.currency);
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `💰 New purchase — ${amount} from ${email}`,
      text: `New Stripe purchase confirmed.

Buyer: ${email}
Amount: ${amount}
Session: ${args.sessionId}
Stripe Customer: ${args.customerId || "—"}

Entitlement granted in Supabase. Buyer received the welcome email + magic link.`,
    });
  } catch (e) {
    console.error("[stripe/webhook] admin notice failed", e);
  }
}
