import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addMessage, getTicket } from "@/lib/tickets";

export const runtime = "nodejs";

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

  // Customer reply re-opens a resolved ticket.
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

  return NextResponse.redirect(new URL(`/portal/support/${id}`, req.url), 303);
}
