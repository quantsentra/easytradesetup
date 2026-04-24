import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createTicket } from "@/lib/tickets";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const form = await req.formData();
  const subject = String(form.get("subject") || "");
  const body = String(form.get("body") || "");

  const result = await createTicket({ userId, subject, body });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.redirect(new URL(`/portal/support/${result.id}`, req.url), 303);
}
