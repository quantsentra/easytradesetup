import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
  process.env.NEXT_PUBLIC_SITE_URL || "https://easytradesetup.com";

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

  // PII guard: log a redacted form of the email only. Full address goes to
  // the downstream sink (Resend / Sheet / DB) once wired, never to stdout.
  console.log("[lead]", { email: redactEmail(email), source });

  if (contentType.startsWith("application/json")) {
    return NextResponse.json({ ok: true });
  }
  return new Response(null, { status: 303, headers: { Location: `${pickRedirectOrigin(req)}/thank-you` } });
}
