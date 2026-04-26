import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { OFFER_USD, OFFER_INR } from "@/lib/pricing";

export const runtime = "nodejs";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Default to Resend's pre-verified test sender so the integration works the
// moment RESEND_API_KEY is set; swap for noreply@easytradesetup.com once
// the domain is verified in Resend dashboard.
const FROM_EMAIL = process.env.LEAD_FROM_EMAIL || "EasyTradeSetup <onboarding@resend.dev>";
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "thomas@easytradesetup.com";
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
        subject: "You're on the list — Golden Indicator launch",
        html: welcomeEmail(offerLabel),
      }),
      // Admin notification
      resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        subject: `New lead · ${redactEmail(email)} · ${source}`,
        html: notifyEmail({ email, source, country, referer, ua }),
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
  return `<!doctype html><html><body style="font-family:-apple-system,system-ui,Segoe UI,Roboto,sans-serif;background:#faf9f5;padding:24px;color:#15181a;line-height:1.55">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(21,24,26,.08);border-radius:14px;padding:32px;box-shadow:0 4px 16px -4px rgba(0,0,0,.07)">
<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
<div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#2B7BFF,#22D3EE);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">✓</div>
<div style="font-weight:600;font-size:16px">EasyTradeSetup</div>
</div>
<h1 style="font-size:22px;margin:0 0 12px;letter-spacing:-.02em">You're on the list.</h1>
<p style="margin:0 0 16px;color:rgba(21,24,26,.72)">We've saved your email. The moment payments go live (UPI for India, Gumroad for global), you'll receive a secure payment link at the inaugural price of <strong>${offerLabel}</strong> — locked in even if retail moves up.</p>
<p style="margin:0 0 16px;color:rgba(21,24,26,.72)">In the meantime:</p>
<ul style="color:rgba(21,24,26,.72);padding-left:20px">
<li><a href="https://www.easytradesetup.com/sample" style="color:#2B7BFF;text-decoration:none">Read a free chapter</a> from the Trade Logic PDF</li>
<li><a href="https://www.easytradesetup.com/compare" style="color:#2B7BFF;text-decoration:none">See how Golden Indicator compares</a> to LuxAlgo, TradingLite, etc.</li>
<li><a href="https://www.easytradesetup.com/docs/install" style="color:#2B7BFF;text-decoration:none">Browse the install guide</a></li>
</ul>
<hr style="border:none;border-top:1px solid rgba(21,24,26,.08);margin:24px 0"/>
<p style="font-size:12px;color:rgba(21,24,26,.52);margin:0">EasyTradeSetup is a chart tool, not investment advice. We are not SEBI-registered. You decide every trade.</p>
</div>
</body></html>`;
}

function notifyEmail(d: {
  email: string; source: string;
  country: string | null; referer: string | null; ua: string | null;
}): string {
  const row = (k: string, v: string | null) =>
    `<tr><td style="padding:6px 0;color:rgba(21,24,26,.52);font-size:12px;text-transform:uppercase;letter-spacing:.08em">${k}</td><td style="padding:6px 0;font-family:monospace;font-size:13px">${v || "—"}</td></tr>`;
  return `<!doctype html><html><body style="font-family:-apple-system,system-ui,sans-serif;background:#faf9f5;padding:20px">
<div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid rgba(21,24,26,.08);border-radius:12px;padding:24px">
<div style="font-size:11px;font-family:monospace;letter-spacing:.16em;text-transform:uppercase;color:rgba(21,24,26,.52);margin-bottom:8px">New lead · ${new Date().toISOString().slice(0,16).replace("T"," ")}</div>
<h2 style="margin:0 0 16px;font-size:18px">${d.email}</h2>
<table style="width:100%;border-collapse:collapse">
${row("Source", d.source)}
${row("Country", d.country)}
${row("Referer", d.referer)}
${row("User-Agent", d.ua)}
</table>
<p style="margin:20px 0 0;font-size:12px;color:rgba(21,24,26,.52)">View all leads: <a href="https://portal.easytradesetup.com/admin/customers" style="color:#2B7BFF">/admin</a></p>
</div>
</body></html>`;
}
