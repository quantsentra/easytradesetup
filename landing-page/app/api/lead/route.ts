import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import { checkBotId } from "botid/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { OFFER_USD, OFFER_INR } from "@/lib/pricing";

export const runtime = "nodejs";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Default to Resend's pre-verified test sender so the integration works the
// moment RESEND_API_KEY is set; swap for noreply@easytradesetup.com once
// the domain is verified in Resend dashboard.
const FROM_EMAIL = process.env.LEAD_FROM_EMAIL || "EasyTradeSetup <welcome@easytradesetup.com>";
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "welcome@easytradesetup.com";
const LEAD_SALT = process.env.LEAD_SALT || "ets-lead-salt-2026";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// 6 submissions per IP per minute. Users rarely need more than a couple
// (fat-finger retry, different source). Bots hammering for list-farming
// get cut off within a second.
const RATE_LIMIT = { windowMs: 60_000, max: 6 };

// Max payload bytes for a lead submission. Plenty of room for email + source
// metadata; anything bigger is almost certainly abusive.
const MAX_PAYLOAD_BYTES = 4 * 1024; // 4 KB

// RFC 5322-lite: rejects consecutive dots, single-char TLDs, missing TLD.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const ALLOWED_CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
];

// Canonical site origin — used as fallback for post-submit redirects.
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.easytradesetup.com";

// Allowlist of hostnames we will honor when choosing a redirect target.
// Uses the real browser-facing Host header (or X-Forwarded-Host) rather than
// req.url, because req.url inside Next resolves to "localhost" even when
// the client reached the server via "127.0.0.1" — which would break CSP
// form-action 'self'. Only hosts in the allowlist are honored; everything
// else falls back to SITE_ORIGIN (open-redirect guard).
function pickRedirectOrigin(req: Request): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const ok =
    hostname === "easytradesetup.com" ||
    hostname === "www.easytradesetup.com" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app");
  if (!ok) return SITE_ORIGIN;
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (hostname === "localhost" || hostname === "127.0.0.1" ? "http" : "https");
  return `${proto}://${host}`;
}

function badRequest(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const head = local.slice(0, 2);
  return `${head}***@${domain}`;
}

export async function POST(req: Request) {
  const contentType = (req.headers.get("content-type") || "").toLowerCase();

  if (!ALLOWED_CONTENT_TYPES.some((ct) => contentType.startsWith(ct))) {
    return badRequest("Unsupported Content-Type", 415);
  }

  // Rate limit before any body parsing — cheap rejection, no allocations for
  // abusive callers.
  const ip = clientIp(req);
  const rl = rateLimit(`lead:${ip}`, RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  // Vercel BotID verdict — silent bot detection (no captcha shown to users
  // unless escalated). isBot=true means high confidence non-human; reject
  // without ever inserting to leads or firing emails.
  try {
    const verdict = await checkBotId();
    if (verdict.isBot) {
      // Pretend success so attackers can't fingerprint the filter.
      // Lead is silently dropped.
      console.log("[lead] botid blocked", { ip });
      if ((req.headers.get("content-type") || "").startsWith("application/json")) {
        return NextResponse.json({ ok: true });
      }
      return new Response(null, {
        status: 303,
        headers: { Location: `${pickRedirectOrigin(req)}/thank-you` },
      });
    }
  } catch {
    // BotID not configured (local dev, missing env) — fall through and
    // let other defenses (rate-limit, honeypot) catch abuse.
  }

  // Enforce Content-Length where provided. formData()/json() do not impose
  // an app-level cap, so we bail early on oversized payloads.
  const lenHeader = req.headers.get("content-length");
  if (lenHeader && Number(lenHeader) > MAX_PAYLOAD_BYTES) {
    return badRequest("Payload too large", 413);
  }

  let payload: Record<string, string> = {};
  try {
    if (contentType.startsWith("application/json")) {
      const raw = await req.text();
      if (raw.length > MAX_PAYLOAD_BYTES) return badRequest("Payload too large", 413);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === "object") {
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === "string") payload[k] = v;
          else if (typeof v === "number" || typeof v === "boolean") payload[k] = String(v);
        }
      }
    } else {
      const form = await req.formData();
      form.forEach((v, k) => {
        payload[k] = String(v);
      });
    }
  } catch {
    return badRequest("Malformed request body");
  }

  // Honeypot — non-human visitors fill every field. If `website` is set,
  // silently accept (to waste the bot's time) but do not log or process.
  if (payload.website && payload.website.trim().length > 0) {
    return contentType.startsWith("application/json")
      ? NextResponse.json({ ok: true })
      : new Response(null, { status: 303, headers: { Location: `${pickRedirectOrigin(req)}/thank-you` } });
  }

  const email = (payload.email || "").trim().slice(0, 254);
  if (!email || !EMAIL_RE.test(email) || /\.\./.test(email)) {
    return badRequest("Invalid email");
  }

  const source = (payload.source || "unknown").trim().slice(0, 64);
  const ua = req.headers.get("user-agent")?.slice(0, 500) || null;
  const country = req.headers.get("x-vercel-ip-country") || null;
  const referer = req.headers.get("referer")?.slice(0, 500) || null;
  const ipHash = crypto
    .createHash("sha256")
    .update(`${LEAD_SALT}:${ip}`)
    .digest("hex")
    .slice(0, 32);

  console.log("[lead]", { email: redactEmail(email), source, country });

  // 1. Persist to Supabase (best-effort — never fail the request on DB issues).
  try {
    const supa = createSupabaseAdmin();
    await supa.from("leads").insert({
      email,
      source,
      ip_hash: ipHash,
      user_agent: ua,
      country,
      referer,
    });
  } catch (e) {
    console.error("[lead] db insert failed", e);
  }

  // 2. Send Resend emails (best-effort, non-blocking).
  if (resend) {
    const offerLabel = `$${OFFER_USD} / ₹${OFFER_INR.toLocaleString("en-IN")}`;
    Promise.allSettled([
      // Welcome / confirmation to lead
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        replyTo: NOTIFY_EMAIL,
        subject: "You're on the list — Golden Indicator launch",
        html: welcomeEmail(offerLabel),
        text: welcomeText(offerLabel),
        headers: {
          "List-Unsubscribe": `<mailto:${NOTIFY_EMAIL}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
      // Admin notification
      resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        replyTo: email,
        subject: `New lead · ${redactEmail(email)} · ${source}`,
        html: notifyEmail({ email, source, country, referer, ua }),
        text: notifyText({ email, source, country, referer }),
      }),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[lead] resend ${i === 0 ? "welcome" : "notify"} failed`, r.reason);
        }
      });
    });
  } else {
    console.warn("[lead] RESEND_API_KEY not set — emails skipped");
  }

  if (contentType.startsWith("application/json")) {
    return NextResponse.json({ ok: true });
  }
  return new Response(null, { status: 303, headers: { Location: `${pickRedirectOrigin(req)}/thank-you` } });
}

function welcomeEmail(offerLabel: string): string {
  // Table-based layout for Outlook compatibility. Inline styles only.
  // Bg-color fallbacks accompany every gradient for clients that strip it.
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>You're on the list</title>
<style>
  @media only screen and (max-width:600px){
    .container{width:100%!important}
    .px{padding-left:24px!important;padding-right:24px!important}
    h1{font-size:24px!important}
    .btn a{display:block!important;width:100%!important;box-sizing:border-box}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#15181a;-webkit-font-smoothing:antialiased">
<!-- Preheader (hidden in body but shown as inbox preview) -->
<div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
Your spot is locked. We'll send the secure payment link the moment checkout opens — at ${offerLabel}, locked in.
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#faf9f5;padding:32px 16px">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" class="container" style="max-width:560px;background:#ffffff;border:1px solid #e5e4dd;border-radius:14px">
        <tr>
          <td class="px" style="padding:32px 36px 8px">

            <!-- Brand row -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" style="background-color:#2B7BFF;background-image:linear-gradient(135deg,#2B7BFF 0%,#22D3EE 100%);width:36px;height:36px;border-radius:9px;text-align:center;color:#ffffff;font-weight:700;font-size:18px;line-height:36px">
                  &#10003;
                </td>
                <td valign="middle" style="padding-left:12px;font-weight:600;font-size:16px;color:#15181a;letter-spacing:-0.01em">
                  EasyTradeSetup
                </td>
              </tr>
            </table>

            <h1 style="font-size:28px;line-height:1.15;letter-spacing:-0.025em;margin:24px 0 12px;color:#15181a;font-weight:700">
              You're on the list.
            </h1>

            <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:rgba(21,24,26,0.72)">
              We've saved your email. Stripe checkout is live now (USD + INR cards) and UPI via Razorpay is landing soon. Buy whenever — the launch price of <strong style="color:#15181a">${offerLabel}</strong> stays put. 67% off retail, always.
            </p>

          </td>
        </tr>

        <!-- CTA button -->
        <tr>
          <td class="px" style="padding:8px 36px 24px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn">
              <tr>
                <td style="background-color:#2B7BFF;background-image:linear-gradient(135deg,#2B7BFF 0%,#22D3EE 100%);border-radius:10px">
                  <a href="https://www.easytradesetup.com/sample" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:-0.005em;border-radius:10px">
                    See a free trade setup →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td class="px" style="padding:0 36px">
            <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:rgba(21,24,26,0.52);font-weight:600;letter-spacing:0.04em;text-transform:uppercase;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace">
              While you wait
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:8px 0;border-top:1px solid #efede4">
                  <a href="https://www.easytradesetup.com/sample" style="color:#1e5fb8;text-decoration:none;font-size:14px;font-weight:500">→ See a free trade setup</a>
                  <span style="color:rgba(21,24,26,0.52);font-size:13px"> — same format as the portal setups</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-top:1px solid #efede4">
                  <a href="https://www.easytradesetup.com/compare" style="color:#1e5fb8;text-decoration:none;font-size:14px;font-weight:500">→ See how it compares</a>
                  <span style="color:rgba(21,24,26,0.52);font-size:13px"> to LuxAlgo, TradingLite, etc.</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-top:1px solid #efede4;border-bottom:1px solid #efede4">
                  <a href="https://www.easytradesetup.com/docs/install" style="color:#1e5fb8;text-decoration:none;font-size:14px;font-weight:500">→ Install guide</a>
                  <span style="color:rgba(21,24,26,0.52);font-size:13px"> — TradingView setup in 60 seconds</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td class="px" style="padding:24px 36px 32px">
            <p style="margin:0 0 8px;font-size:12.5px;line-height:1.55;color:rgba(21,24,26,0.52)">
              Reply to this email any time — it goes straight to ${NOTIFY_EMAIL.replace(/.*<|>.*/g, "") || NOTIFY_EMAIL}. We read every one.
            </p>
            <p style="margin:0;font-size:11px;line-height:1.55;color:rgba(21,24,26,0.40)">
              EasyTradeSetup is a chart tool, not investment advice. We are not SEBI-registered. You decide every trade.
              <br/>
              You're receiving this because you joined the launch list at easytradesetup.com.
              <a href="mailto:${NOTIFY_EMAIL}?subject=unsubscribe" style="color:rgba(21,24,26,0.52);text-decoration:underline">Unsubscribe</a>.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function welcomeText(offerLabel: string): string {
  return [
    "You're on the list.",
    "",
    `We've saved your email. Stripe checkout is live now (USD + INR cards) and UPI via Razorpay is landing soon. Buy whenever — the launch price of ${offerLabel} stays put. 67% off retail, always.`,
    "",
    "While you wait:",
    "  • See a free trade setup:  https://www.easytradesetup.com/sample",
    "  • See how it compares:  https://www.easytradesetup.com/compare",
    "  • Install guide:        https://www.easytradesetup.com/docs/install",
    "",
    `Reply to this email any time — it goes straight to ${NOTIFY_EMAIL}. We read every one.`,
    "",
    "—",
    "EasyTradeSetup is a chart tool, not investment advice. We are not SEBI-registered. You decide every trade.",
    `Unsubscribe: mailto:${NOTIFY_EMAIL}?subject=unsubscribe`,
  ].join("\n");
}

function escapeHtml(s: string | null): string {
  if (!s) return "—";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function notifyEmail(d: {
  email: string; source: string;
  country: string | null; referer: string | null; ua: string | null;
}): string {
  const row = (k: string, v: string | null) =>
    `<tr><td style="padding:8px 0;color:rgba(21,24,26,0.52);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;width:90px;vertical-align:top">${k}</td><td style="padding:8px 0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:13px;color:#15181a;word-break:break-all">${escapeHtml(v)}</td></tr>`;
  return `<!doctype html>
<html><head><meta charset="utf-8"/><title>New lead</title></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:24px 16px">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="540" style="max-width:540px;background:#ffffff;border:1px solid #e5e4dd;border-radius:12px">
        <tr>
          <td style="padding:24px 28px">
            <div style="font-size:11px;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;letter-spacing:0.16em;text-transform:uppercase;color:rgba(21,24,26,0.52);margin-bottom:6px">
              New lead · ${new Date().toISOString().slice(0,16).replace("T", " ")} UTC
            </div>
            <h2 style="margin:0 0 16px;font-size:18px;color:#15181a;word-break:break-all">${escapeHtml(d.email)}</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid #efede4">
              ${row("Source", d.source)}
              ${row("Country", d.country)}
              ${row("Referer", d.referer)}
              ${row("UA", d.ua)}
            </table>
            <p style="margin:20px 0 0;font-size:12px;color:rgba(21,24,26,0.52)">
              <a href="https://portal.easytradesetup.com/admin/customers" style="color:#1e5fb8;text-decoration:none;font-weight:500">View all leads →</a>
              <br/>
              Reply to this email to respond directly to the lead.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body></html>`;
}

function notifyText(d: {
  email: string; source: string;
  country: string | null; referer: string | null;
}): string {
  return [
    `New lead · ${new Date().toISOString().slice(0,16).replace("T", " ")} UTC`,
    "",
    `Email:    ${d.email}`,
    `Source:   ${d.source}`,
    `Country:  ${d.country || "—"}`,
    `Referer:  ${d.referer || "—"}`,
    "",
    "View all: https://portal.easytradesetup.com/admin/customers",
    "Reply to this email to respond directly.",
  ].join("\n");
}
