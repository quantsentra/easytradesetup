import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { addMessage, getTicket } from "@/lib/tickets";

export const runtime = "nodejs";

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

  return NextResponse.redirect(new URL(`/admin/tickets/${id}`, req.url), 303);
}
