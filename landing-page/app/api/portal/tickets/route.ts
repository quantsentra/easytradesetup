import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createTicket } from "@/lib/tickets";
import {
  getAdminNotifyAddress,
  sendEmail,
  ticketCreatedAdminHtml,
} from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// 5 new tickets per 15 minutes per user. Stops a confused user hammering
// the form; legitimate follow-ups happen on the reply endpoint, not here.
const CREATE_RL = { windowMs: 15 * 60_000, max: 5 };

function siteUrl(req: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const rl = rateLimit(`ticket-create:${userId}`, CREATE_RL);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many new tickets — wait a few minutes and try again" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const form = await req.formData();
  const subject = String(form.get("subject") || "");
  const body = String(form.get("body") || "");

  const result = await createTicket({ userId, subject, body });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Fire-and-forget admin notification. Never block the redirect.
  (async () => {
    try {
      const user = await currentUser();
      const customerEmail = user?.primaryEmailAddress?.emailAddress || "unknown";
      await sendEmail({
        to: getAdminNotifyAddress(),
        subject: `[Ticket] ${subject}`,
        replyTo: customerEmail !== "unknown" ? customerEmail : undefined,
        html: ticketCreatedAdminHtml({
          customerEmail,
          subject,
          body,
          adminUrl: `${siteUrl(req)}/admin/tickets/${result.id}`,
        }),
      });
    } catch { /* ignored — notification is best-effort */ }
  })();

  return NextResponse.redirect(new URL(`/portal/support/${result.id}`, req.url), 303);
}
