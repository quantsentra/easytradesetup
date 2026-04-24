import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { addMessage, getTicket } from "@/lib/tickets";
import { sendEmail, ticketReplyCustomerHtml } from "@/lib/email";

export const runtime = "nodejs";

function siteUrl(req: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await req.formData();
  const body = String(form.get("body") || "");
  const resolve = form.get("resolve") === "1";

  const result = await addMessage({
    ticketId: id,
    author: "admin",
    authorId: userId,
    body,
    newStatus: resolve ? "resolved" : "waiting",
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Fire-and-forget customer notification.
  (async () => {
    try {
      const client = await clerkClient();
      const customer = await client.users.getUser(ticket.user_id);
      const to = customer.primaryEmailAddress?.emailAddress;
      if (!to) return;
      await sendEmail({
        to,
        subject: `Re: ${ticket.subject}`,
        html: ticketReplyCustomerHtml({
          subject: ticket.subject,
          body,
          ticketUrl: `${siteUrl(req)}/portal/support/${id}`,
        }),
      });
    } catch { /* ignored */ }
  })();

  return NextResponse.redirect(new URL(`/admin/tickets/${id}`, req.url), 303);
}
