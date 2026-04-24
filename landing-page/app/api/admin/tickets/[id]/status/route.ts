import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { setStatus, getTicket, type TicketStatus } from "@/lib/tickets";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

const STATUS_VALUES: TicketStatus[] = ["open", "waiting", "resolved", "closed"];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const form = await req.formData();
  const status = String(form.get("status") || "") as TicketStatus;
  if (!STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const before = await getTicket(id);
  const result = await setStatus(id, status);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await audit({
    actorId: userId,
    action: "ticket.status.change",
    targetKind: "ticket",
    targetId: id,
    metadata: { from: before?.status, to: status },
  });

  return NextResponse.redirect(new URL(`/admin/tickets/${id}`, req.url), 303);
}
