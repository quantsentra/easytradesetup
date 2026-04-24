import "server-only";

// Resend wrapper. Silently no-ops when RESEND_API_KEY is missing so local
// dev and half-configured previews don't fail ticket creation. All sends
// are fire-and-forget — a failed notification must never block a write.

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

const FROM_DEFAULT = process.env.EMAIL_FROM || "EasyTradeSetup <hello@easytradesetup.com>";
const ADMIN_NOTIFY = process.env.ADMIN_NOTIFY_EMAIL || "hello@easytradesetup.com";

async function getClient(): Promise<{ emails: { send: (p: Record<string, unknown>) => Promise<unknown> } } | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    const { Resend } = await import("resend");
    return new Resend(key) as unknown as { emails: { send: (p: Record<string, unknown>) => Promise<unknown> } };
  } catch {
    return null;
  }
}

export async function sendEmail(args: SendArgs): Promise<void> {
  const client = await getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY missing — skipping send", { to: args.to, subject: args.subject });
    return;
  }
  try {
    await client.emails.send({
      from: FROM_DEFAULT,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    });
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

export function getAdminNotifyAddress(): string {
  return ADMIN_NOTIFY;
}

// Template helpers — keep inline so the email lib stays dependency-free.
function wrap(body: string): string {
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f7f7f5;padding:24px;color:#0d0d0d;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;border:1px solid rgba(0,0,0,0.08);">
${body}
<hr style="border:0;border-top:1px solid rgba(0,0,0,0.08);margin:28px 0 16px;"/>
<p style="font-size:11px;color:rgba(13,13,13,0.5);font-family:ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em;">EasyTradeSetup · easytradesetup.com</p>
</div></body></html>`;
}

export function ticketCreatedAdminHtml(params: {
  customerEmail: string;
  subject: string;
  body: string;
  adminUrl: string;
}): string {
  return wrap(`
    <p style="font-size:11px;color:#2B7BFF;font-family:ui-monospace,monospace;text-transform:uppercase;letter-spacing:.14em;margin:0 0 8px;">New support ticket</p>
    <h1 style="font-size:22px;margin:0 0 12px;">${escapeHtml(params.subject)}</h1>
    <p style="margin:0 0 16px;color:rgba(13,13,13,0.72);">From <strong>${escapeHtml(params.customerEmail)}</strong></p>
    <div style="background:#f6f6f4;border-radius:10px;padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.55;">${escapeHtml(params.body)}</div>
    <p style="margin:24px 0 0;"><a href="${params.adminUrl}" style="display:inline-block;background:#2B7BFF;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">Reply in admin →</a></p>
  `);
}

export function ticketReplyCustomerHtml(params: {
  subject: string;
  body: string;
  ticketUrl: string;
}): string {
  return wrap(`
    <p style="font-size:11px;color:#2B7BFF;font-family:ui-monospace,monospace;text-transform:uppercase;letter-spacing:.14em;margin:0 0 8px;">Support replied</p>
    <h1 style="font-size:20px;margin:0 0 12px;">${escapeHtml(params.subject)}</h1>
    <div style="background:#f6f6f4;border-radius:10px;padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.55;">${escapeHtml(params.body)}</div>
    <p style="margin:24px 0 0;"><a href="${params.ticketUrl}" style="display:inline-block;background:#2B7BFF;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">View ticket →</a></p>
  `);
}

export function ticketReplyAdminHtml(params: {
  customerEmail: string;
  subject: string;
  body: string;
  adminUrl: string;
}): string {
  return wrap(`
    <p style="font-size:11px;color:#2B7BFF;font-family:ui-monospace,monospace;text-transform:uppercase;letter-spacing:.14em;margin:0 0 8px;">Customer replied</p>
    <h1 style="font-size:20px;margin:0 0 12px;">${escapeHtml(params.subject)}</h1>
    <p style="margin:0 0 16px;color:rgba(13,13,13,0.72);">From <strong>${escapeHtml(params.customerEmail)}</strong></p>
    <div style="background:#f6f6f4;border-radius:10px;padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.55;">${escapeHtml(params.body)}</div>
    <p style="margin:24px 0 0;"><a href="${params.adminUrl}" style="display:inline-block;background:#2B7BFF;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">Open in admin →</a></p>
  `);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
