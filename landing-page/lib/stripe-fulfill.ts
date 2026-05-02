import "server-only";
import type Stripe from "stripe";
import { Resend } from "resend";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

// Shared fulfillment used by the webhook AND the manual recovery endpoint.
// Idempotent: safe to invoke twice on the same session — entitlement is
// upserted, and the email send tolerates repeats (Stripe may resend events).

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Sender. Default to Resend's shared sandbox domain so the integration
// works the moment the API key is set, but Gmail/Outlook will spam-flag
// Domain is Resend-verified (resend._domainkey.easytradesetup.com DKIM is
// live) and welcome@easytradesetup.com is the operator inbox in Zoho.
// Override with PURCHASE_FROM_EMAIL on Vercel only if a different sender
// is needed for a specific environment.
const FROM_EMAIL = process.env.PURCHASE_FROM_EMAIL || "EasyTradeSetup <welcome@easytradesetup.com>";
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "welcome@easytradesetup.com";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "welcome@easytradesetup.com";
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
  entitlementGranted: boolean;
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
      entitlementGranted: false,
      warnings: ["session has neither user_id metadata nor buyer email"],
    };
  }

  let alreadyGranted = false;
  let entitlementWritten = false;
  if (userId) {
    alreadyGranted = await entitlementExists(userId, session.id);
    if (!alreadyGranted) {
      const upsertWarning = await upsertEntitlement({
        userId,
        stripeSessionId: session.id,
        stripeCustomerId: customerId,
        amountCents,
        currency,
      });
      if (upsertWarning) warnings.push(upsertWarning);
      // Verify the row really landed — surfaces silent insert/permission
      // failures so the operator sees them in the recovery UI.
      entitlementWritten = await entitlementExists(userId, session.id);
      if (!entitlementWritten) {
        warnings.push(
          "entitlement row not visible after upsert — check Supabase service-role key + RLS policies on the entitlements table",
        );
      }
    } else {
      entitlementWritten = true;
    }
  } else {
    warnings.push("could not resolve user_id; entitlement skipped");
  }

  // Magic link only when we have an email — without one we can't deliver.
  const magicLink = email ? await generateMagicLink(email) : null;

  // Fetch the Stripe-hosted invoice + PDF link so we can include them in
  // the welcome email. Stripe finalises invoices asynchronously; usually
  // ready within a couple of seconds of checkout.session.completed but
  // not guaranteed. If the invoice is missing or not finalised, we send
  // the welcome email without it — Stripe also emails its own invoice
  // separately, so the buyer gets a receipt either way.
  const invoiceLinks = await fetchInvoiceLinks(session);

  if (!options.skipBuyerEmail && email) {
    await sendBuyerEmail(email, {
      amountCents, currency, magicLink,
      hostedInvoiceUrl: invoiceLinks.hostedInvoiceUrl,
      invoicePdfUrl: invoiceLinks.invoicePdfUrl,
      invoiceNumber: invoiceLinks.invoiceNumber,
    });
  }
  if (!options.skipAdminEmail) {
    await sendAdminNotice(email || "(no email)", {
      amountCents, currency, sessionId: session.id, customerId, recovered: false,
    });
  }

  return {
    ok: true,
    email,
    userId,
    amountCents,
    currency,
    alreadyGranted,
    entitlementGranted: alreadyGranted || entitlementWritten,
    warnings,
  };
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
  // Query both columns separately so a missing stripe_session_id column
  // (migration 019 not run) doesn't crash the whole lookup.
  const { data, error } = await supa
    .from("entitlements")
    .select("user_id, active")
    .eq("user_id", userId)
    .eq("product", "golden-indicator")
    .maybeSingle();
  if (error || !data) return false;
  return data.active === true;
}

async function upsertEntitlement(args: {
  userId: string;
  stripeSessionId: string;
  stripeCustomerId: string | null;
  amountCents: number;
  currency: string;
}): Promise<string | null> {
  let supa;
  try {
    supa = createSupabaseAdmin();
  } catch (e) {
    return e instanceof Error ? e.message : "Supabase admin client init failed";
  }

  const fullPayload = {
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
  };

  // Try the full payload first. If migration 019 hasn't been run yet the
  // stripe_* + amount_cents + currency columns won't exist; fall back to
  // a minimal upsert so the buyer still gets their license. We surface the
  // schema warning back to the caller so the operator knows to run it.
  const { error } = await supa.from("entitlements").upsert(fullPayload, {
    onConflict: "user_id,product",
  });
  if (!error) return null;

  console.error("[stripe-fulfill] upsert (full) failed", error.message);

  const minimalPayload = {
    user_id: args.userId,
    product: "golden-indicator",
    active: true,
    granted_at: new Date().toISOString(),
    revoked_at: null,
    source: "stripe",
  };
  const { error: minErr } = await supa.from("entitlements").upsert(minimalPayload, {
    onConflict: "user_id,product",
  });
  if (minErr) {
    console.error("[stripe-fulfill] upsert (minimal) also failed", minErr.message);
    return `entitlement upsert failed: ${minErr.message}`;
  }
  return `entitlement granted with reduced columns; run migration 019_stripe.sql for full Stripe metadata. (root cause: ${error.message})`;
}

type InvoiceLinks = {
  hostedInvoiceUrl: string | null;
  invoicePdfUrl: string | null;
  invoiceNumber: string | null;
};

async function fetchInvoiceLinks(session: Stripe.Checkout.Session): Promise<InvoiceLinks> {
  const empty: InvoiceLinks = { hostedInvoiceUrl: null, invoicePdfUrl: null, invoiceNumber: null };
  const invoiceField = session.invoice;
  if (!invoiceField) return empty;
  try {
    const invoice =
      typeof invoiceField === "string"
        ? await getStripe().invoices.retrieve(invoiceField)
        : invoiceField;
    return {
      hostedInvoiceUrl: invoice.hosted_invoice_url || null,
      invoicePdfUrl: invoice.invoice_pdf || null,
      invoiceNumber: invoice.number || null,
    };
  } catch (e) {
    console.error("[stripe-fulfill] invoice retrieve failed", e);
    return empty;
  }
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
  args: {
    amountCents: number;
    currency: string;
    magicLink: string | null;
    hostedInvoiceUrl: string | null;
    invoicePdfUrl: string | null;
    invoiceNumber: string | null;
  },
) {
  if (!resend) return;
  const amount = fmtMoney(args.amountCents, args.currency);
  const portalCta = args.magicLink || `${PORTAL_ORIGIN}/sign-in`;
  const docsUrl = `${PORTAL_ORIGIN}/portal/docs/install`;
  const supportUrl = `${PORTAL_ORIGIN}/portal/support`;
  const subject = `Your Golden Indicator access is ready`;
  const preheader = args.invoicePdfUrl
    ? `Portal access + PDF invoice inside. Install in 5 minutes; trade with discipline.`
    : `Open the portal, install on TradingView, follow the guide.`;
  const invoiceLabel = args.invoiceNumber ? `Invoice ${args.invoiceNumber}` : "Invoice";

  // Spam-mitigation considerations for this template:
  //   - Plain transactional language; no caps, no $ in subject, no urgency.
  //   - Plain-text version matches HTML 1:1 so spam filters don't see a
  //     mismatch between visible body and source.
  //   - List-Unsubscribe + List-Unsubscribe-Post = RFC 8058 one-click unsub
  //     (Gmail/Yahoo bulk-sender rule from Feb 2024).
  //   - Reply-To set to a human inbox.
  //   - From address quality matters most: switch FROM_EMAIL to a verified
  //     easytradesetup.com sender once Resend domain is set up.
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" />
<title>${subject}</title></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Inter',Arial,sans-serif;color:#15181a;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#faf9f5;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid rgba(21,24,26,0.08);border-radius:14px;overflow:hidden;">

<tr><td style="padding:28px 32px 24px;background:linear-gradient(135deg,rgba(43,123,255,0.08) 0%,rgba(34,211,238,0.04) 100%);border-bottom:1px solid rgba(21,24,26,0.06);">
<div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#2B7BFF;font-weight:600;">Order confirmed · ${amount}${args.invoiceNumber ? ` · ${args.invoiceNumber}` : ""}</div>
<h1 style="margin:10px 0 6px;font:600 26px -apple-system,'Inter',Arial,sans-serif;letter-spacing:-0.02em;color:#15181a;">Your access is ready.</h1>
<p style="margin:0;font-size:14.5px;color:rgba(21,24,26,0.72);line-height:1.55;">Lifetime access to Golden Indicator + the full bundle.${args.invoicePdfUrl || args.hostedInvoiceUrl ? " Your invoice is below." : ""}</p>
</td></tr>

<tr><td style="padding:28px 32px 8px;">
<p style="margin:0 0 18px;font-size:14.5px;line-height:1.6;color:#15181a;">Tap below to land straight in your portal — sign-in is automatic via this link.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px;"><tr><td>
<a href="${portalCta}" style="display:inline-block;background:#2B7BFF;color:#ffffff;text-decoration:none;font:600 15px -apple-system,'Inter',Arial,sans-serif;padding:14px 26px;border-radius:10px;">Open my portal &nbsp;→</a>
</td></tr></table>
<p style="margin:14px 0 0;font-size:12px;color:rgba(21,24,26,0.52);line-height:1.55;">Button not working? Paste this URL into your browser:<br /><span style="word-break:break-all;color:rgba(21,24,26,0.66);">${portalCta}</span></p>
</td></tr>

${(args.invoicePdfUrl || args.hostedInvoiceUrl) ? `<tr><td style="padding:14px 32px 22px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;border:1px solid rgba(21,24,26,0.08);border-radius:10px;">
<tr><td style="padding:16px 18px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle;">
<div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(21,24,26,0.52);font-weight:600;">${invoiceLabel}</div>
<div style="font-size:14px;color:#15181a;font-weight:600;margin-top:2px;">${amount}${args.invoiceNumber ? ` &middot; <span style='color:rgba(21,24,26,0.52);font-weight:500;'>${args.invoiceNumber}</span>` : ""}</div>
</td>
<td style="vertical-align:middle;text-align:right;white-space:nowrap;">
${args.invoicePdfUrl ? `<a href="${args.invoicePdfUrl}" style="display:inline-block;background:#15181a;color:#ffffff;text-decoration:none;font:600 12.5px -apple-system,'Inter',Arial,sans-serif;padding:9px 14px;border-radius:7px;margin-right:6px;">PDF</a>` : ""}
${args.hostedInvoiceUrl ? `<a href="${args.hostedInvoiceUrl}" style="display:inline-block;background:transparent;color:#2B7BFF;text-decoration:none;font:600 12.5px -apple-system,'Inter',Arial,sans-serif;padding:9px 14px;border-radius:7px;border:1px solid rgba(43,123,255,0.35);">View receipt</a>` : ""}
</td>
</tr></table>
</td></tr></table>
</td></tr>` : ""}

<tr><td style="padding:24px 32px;border-top:1px solid rgba(21,24,26,0.06);">
<div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(21,24,26,0.52);font-weight:600;margin-bottom:14px;">Next steps · 15 minutes</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="vertical-align:top;padding:0 0 14px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:32px;vertical-align:top;"><div style="width:24px;height:24px;border-radius:999px;background:#2B7BFF;color:#ffffff;font:700 12px Arial,sans-serif;text-align:center;line-height:24px;">1</div></td>
<td style="padding-left:8px;">
<div style="font:600 14px -apple-system,'Inter',Arial,sans-serif;color:#15181a;">Open the portal</div>
<div style="font-size:13.5px;color:rgba(21,24,26,0.72);line-height:1.55;margin-top:2px;">Tap the button above — you'll land signed in.</div>
</td></tr></table>
</td></tr>

<tr><td style="vertical-align:top;padding:0 0 14px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:32px;vertical-align:top;"><div style="width:24px;height:24px;border-radius:999px;background:#2B7BFF;color:#ffffff;font:700 12px Arial,sans-serif;text-align:center;line-height:24px;">2</div></td>
<td style="padding-left:8px;">
<div style="font:600 14px -apple-system,'Inter',Arial,sans-serif;color:#15181a;">Install on TradingView</div>
<div style="font-size:13.5px;color:rgba(21,24,26,0.72);line-height:1.55;margin-top:2px;">Step-by-step <a href="${docsUrl}" style="color:#2B7BFF;text-decoration:underline;">install guide</a> — 5 minutes from copy to chart.</div>
</td></tr></table>
</td></tr>

<tr><td style="vertical-align:top;padding:0 0 14px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:32px;vertical-align:top;"><div style="width:24px;height:24px;border-radius:999px;background:#2B7BFF;color:#ffffff;font:700 12px Arial,sans-serif;text-align:center;line-height:24px;">3</div></td>
<td style="padding-left:8px;">
<div style="font:600 14px -apple-system,'Inter',Arial,sans-serif;color:#15181a;">Take the Indicator Course + Quiz</div>
<div style="font-size:13.5px;color:rgba(21,24,26,0.72);line-height:1.55;margin-top:2px;">11 interactive lessons · knowledge quiz · mobile-friendly. Don't skip — every line, zone, and color on your chart is explained, then tested. Inside your portal under <strong>Docs &rarr; Indicator basics</strong>.</div>
</td></tr></table>
</td></tr>

<tr><td style="vertical-align:top;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:32px;vertical-align:top;"><div style="width:24px;height:24px;border-radius:999px;background:#2B7BFF;color:#ffffff;font:700 12px Arial,sans-serif;text-align:center;line-height:24px;">4</div></td>
<td style="padding-left:8px;">
<div style="font:600 14px -apple-system,'Inter',Arial,sans-serif;color:#15181a;">Trade your way</div>
<div style="font-size:13.5px;color:rgba(21,24,26,0.72);line-height:1.55;margin-top:2px;">Educational tool. Not a profit machine. Follow the playbook, manage risk, results compound over months not days.</div>
</td></tr></table>
</td></tr>
</table>
</td></tr>

<tr><td style="padding:20px 32px;background:rgba(43,123,255,0.04);border-top:1px solid rgba(21,24,26,0.06);">
<div style="font:600 13px -apple-system,'Inter',Arial,sans-serif;color:#15181a;margin-bottom:4px;">Stuck on install or anything else?</div>
<div style="font-size:13px;color:rgba(21,24,26,0.72);line-height:1.55;">Open a support ticket — <a href="${supportUrl}" style="color:#2B7BFF;text-decoration:underline;">portal.easytradesetup.com/support</a> — and a human replies within 24h. Or just reply to this email.</div>
</td></tr>

<tr><td style="padding:18px 32px 22px;border-top:1px solid rgba(21,24,26,0.06);font-size:11.5px;color:rgba(21,24,26,0.52);line-height:1.6;">
Educational tool · Not investment advice · Past performance does not guarantee future results. Trading involves substantial risk of loss. You decide every trade.
</td></tr>

</table>
<p style="font-size:11px;color:rgba(21,24,26,0.40);margin:18px 0 0;font-family:-apple-system,Arial,sans-serif;">EasyTradeSetup · <a href="${SITE_ORIGIN}" style="color:rgba(21,24,26,0.52);text-decoration:none;">easytradesetup.com</a></p>
</td></tr></table></body></html>`;

  const invoiceText =
    args.invoicePdfUrl || args.hostedInvoiceUrl
      ? `\n${invoiceLabel}${args.invoiceNumber ? ` (${args.invoiceNumber})` : ""}\n${args.invoicePdfUrl ? `Download PDF: ${args.invoicePdfUrl}\n` : ""}${args.hostedInvoiceUrl ? `View receipt: ${args.hostedInvoiceUrl}\n` : ""}`
      : "";

  const text = `Order confirmed — ${amount}.

Your Golden Indicator access is ready. Open the portal here:
${portalCta}
${invoiceText}
NEXT STEPS — 15 minutes
1) Open the portal (link above) — you'll land signed in.
2) Install on TradingView: ${docsUrl}
3) Take the Indicator Course + Quiz inside the portal — 11 lessons,
   ~30 minutes, every signal explained then tested.
4) Trade your way. Educational tool — not a profit machine. Follow
   the playbook, manage risk, results compound over months not days.

Stuck on install or anything else?
Open a ticket at ${supportUrl} or just reply to this email — a human
replies within 24h.

Educational tool. Not investment advice. Past performance does not
guarantee future results. Trading involves substantial risk of loss.
You decide every trade.

— EasyTradeSetup
${SITE_ORIGIN}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
      text,
      replyTo: SUPPORT_EMAIL,
      headers: {
        // Gmail/Yahoo bulk-sender rule (effective Feb 2024) requires
        // List-Unsubscribe + List-Unsubscribe-Post for transactional
        // bulk mail. Adding both unconditionally — even though this is
        // a 1:1 transactional email — boosts inbox placement.
        "List-Unsubscribe": `<mailto:${SUPPORT_EMAIL}?subject=Unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
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
