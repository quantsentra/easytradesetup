import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { addMessage, getTicket } from "@/lib/tickets";
import {
  getAdminNotifyAddress,
  sendEmail,
  ticketReplyAdminHtml,
} from "@/lib/email";

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

  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (ticket.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (ticket.status === "closed") return NextResponse.json({ error: "Ticket is closed" }, { status: 400 });

  const form = await req.formData();
  const body = String(form.get("body") || "");

  const newStatus = ticket.status === "resolved" ? "open" : undefined;
  const result = await addMessage({
    ticketId: id,
    author: "customer",
    authorId: userId,
    body,
    newStatus,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Fire-and-forget admin notification about the customer reply.
  (async () => {
    try {
      const user = await currentUser();
      const customerEmail = user?.primaryEmailAddress?.emailAddress || "unknown";
      await sendEmail({
        to: getAdminNotifyAddress(),
        subject: `[Ticket reply] ${ticket.subject}`,
        replyTo: customerEmail !== "unknown" ? customerEmail : undefined,
        html: ticketReplyAdminHtml({
          customerEmail,
          subject: ticket.subject,
          body,
          adminUrl: `${siteUrl(req)}/admin/tickets/${id}`,
        }),
      });
    } catch { /* ignored */ }
  })();

  return NextResponse.redirect(new URL(`/portal/support/${id}`, req.url), 303);
}
