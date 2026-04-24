import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { setStatus, type TicketStatus } from "@/lib/tickets";

export const runtime = "nodejs";

const STATUS_VALUES: TicketStatus[] = ["open", "waiting", "resolved", "closed"];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await isAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const form = await req.formData();
  const status = String(form.get("status") || "") as TicketStatus;
  if (!STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const result = await setStatus(id, status);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.redirect(new URL(`/admin/tickets/${id}`, req.url), 303);
}
