import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { commentOnIssue } from "@/lib/hermes/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Operator → Hermes feedback channel. Posts a comment on an existing
// issue. Hermes sees the comment when it next polls the issue queue,
// uses it to refine the next draft. This is the "improvement loop".
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let payload: { issueNumber?: number; body?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const issueNumber = Number(payload.issueNumber);
  const body = (payload.body ?? "").trim();
  if (!Number.isFinite(issueNumber) || issueNumber <= 0) {
    return NextResponse.json({ ok: false, error: "issueNumber required" }, { status: 400 });
  }
  if (!body || body.length > 4000) {
    return NextResponse.json({ ok: false, error: "body 1-4000 chars" }, { status: 400 });
  }

  const filerLine = `\n\n_— ${user.email ?? user.id} via /admin/hermes_`;

  try {
    const comment = await commentOnIssue({
      issueNumber,
      body: body + filerLine,
    });
    return NextResponse.json({ ok: true, ...comment });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
