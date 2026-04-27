import "server-only";
import type Stripe from "stripe";
import { Resend } from "resend";
import { createSupabaseAdmin } from "@/lib/supabase/server";

// Shared fulfillment used by the webhook AND the manual recovery endpoint.
// Idempotent: safe to invoke twice on the same session — entitlement is
// upserted, and the email send tolerates repeats (Stripe may resend events).

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.PURCHASE_FROM_EMAIL || "EasyTradeSetup <onboarding@resend.dev>";
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "thomas@easytradesetup.com";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://www.easytradesetup.com";
const PORTAL_ORIGIN = "https://portal.easytradesetup.com";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export type FulfillResult = {
  ok: boolean;
  email: string;
  userId: string | null;
  amountCents: number;
  currency: string;
  alreadyGranted: boolean;
  warnings: string[];
};

export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session,
  options: { skipBuyerEmail?: boolean; skipAdminEmail?: boolean } = {},
): Promise<FulfillResult> {
  const warnings: string[] = [];

  const email =
    session.customer_details?.email ||
    session.customer_email ||
    "";
  const amountCents = session.amount_total || 0;
  const currency = (session.currency || "usd").toLowerCase();
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id || null;

  // Prefer the user_id we attached as metadata when the session was created.
  // Falling back to email lookup keeps legacy / pre-auth-gated purchases
  // working — but the metadata path is the authoritative one going forward.
  let userId: string | null =
    typeof session.metadata?.user_id === "string" && session.metadata.user_id
      ? session.metadata.user_id
      : typeof session.client_reference_id === "string" && session.client_reference_id
        ? session.client_reference_id
        : null;

  if (!userId && email) {
    userId = await findUserByEmail(email);
    if (!userId) {
      warnings.push("user_id not in metadata; created new user from buyer email");
      userId = await createUser(email);
    }
  }

  if (!email && !userId) {
    return {
      ok: false, email: "", userId: null, amountCents, currency,
      alreadyGranted: false,
      warnings: ["session has neither user_id metadata nor buyer email"],
    };
  }

  let alreadyGranted = false;
  if (userId) {
    alreadyGranted = await entitlementExists(userId, session.id);
    if (!alreadyGranted) {
      await upsertEntitlement({
        userId,
        stripeSessionId: session.id,
        stripeCustomerId: customerId,
        amountCents,
        currency,
      });
    }
  } else {
    warnings.push("could not resolve user_id; entitlement skipped");
  }

  // Magic link only when we have an email — without one we can't deliver.
  const magicLink = email ? await generateMagicLink(email) : null;

  if (!options.skipBuyerEmail && email) {
    await sendBuyerEmail(email, { amountCents, currency, magicLink });
  }
  if (!options.skipAdminEmail) {
    await sendAdminNotice(email || "(no email)", {
      amountCents, currency, sessionId: session.id, customerId, recovered: false,
    });
  }

  return { ok: true, email, userId, amountCents, currency, alreadyGranted, warnings };
}

export async function revokeForCharge(charge: Stripe.Charge): Promise<{ ok: boolean; email: string | null }> {
  const email = charge.billing_details?.email || charge.receipt_email || null;
  if (!email) return { ok: false, email: null };

  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return { ok: false, email };
  }

  const userId = await findUserByEmail(email);
  if (!userId) return { ok: false, email };

  await supa.from("entitlements").update({
    active: false,
    revoked_at: new Date().toISOString(),
    source: "refund",
  }).eq("user_id", userId).eq("product", "golden-indicator");
  return { ok: true, email };
}

// ---- Supabase helpers -------------------------------------------------------

async function findUserByEmail(email: string): Promise<string | null> {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return null;
  }
  const { data: list } = await supa.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const target = list?.users?.find(
    (u: { email?: string | null; id: string }) =>
      (u.email || "").toLowerCase() === email.toLowerCase(),
  );
  return target?.id || null;
}

async function createUser(email: string): Promise<string | null> {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return null;
  }
  const { data: created, error } = await supa.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { source: "stripe_purchase" },
  });
  if (error || !created.user) {
    console.error("[stripe-fulfill] createUser failed", email, error?.message);
    return null;
  }
  return created.user.id;
}

async function entitlementExists(userId: string, sessionId: string): Promise<boolean> {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch {
    return false;
  }
  const { data } = await supa
    .from("entitlements")
    .select("user_id, stripe_session_id, active")
    .eq("user_id", userId)
    .eq("product", "golden-indicator")
    .maybeSingle();
  if (!data) return false;
  return data.active === true && data.stripe_session_id === sessionId;
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

// ---- Email -------------------------------------------------------------------

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
<p style="margin:0;font-size:14.5px;line-height:1.6;color:#15181a;">Your portal is ready. Tap below to land straight inside — install guide, indicator unlock instructions, Trade Logic PDF, and Risk Calculator are waiting. Stripe will email a separate PDF invoice receipt to you within minutes.</p>
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

Stripe will send a separate PDF invoice receipt to your inbox.

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
    console.error("[stripe-fulfill] buyer email failed", e);
  }
}

async function sendAdminNotice(
  email: string,
  args: { amountCents: number; currency: string; sessionId: string; customerId: string | null; recovered: boolean },
) {
  if (!resend) return;
  const amount = fmtMoney(args.amountCents, args.currency);
  const subject = args.recovered
    ? `🛠 Recovered purchase — ${amount} from ${email}`
    : `💰 New purchase — ${amount} from ${email}`;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject,
      text: `${args.recovered ? "Recovered (manual replay)" : "New"} Stripe purchase confirmed.

Buyer: ${email}
Amount: ${amount}
Session: ${args.sessionId}
Stripe Customer: ${args.customerId || "—"}

Entitlement granted in Supabase. Buyer received the welcome email + magic link.`,
    });
  } catch (e) {
    console.error("[stripe-fulfill] admin notice failed", e);
  }
}
