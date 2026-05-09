import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createIssue } from "@/lib/hermes/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Operator → Hermes: file a new SEO task as a GitHub issue. Hermes picks
// it up from its issue queue. Closes the round-trip: instead of opening
// GitHub manually, the operator briefs from inside the admin console.
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let payload: { title?: string; body?: string; labels?: string[] };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const title = (payload.title ?? "").trim();
  const body  = (payload.body ?? "").trim();
  if (!title || !body) {
    return NextResponse.json({ ok: false, error: "title and body required" }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ ok: false, error: "title too long" }, { status: 400 });
  }
  if (body.length > 8000) {
    return NextResponse.json({ ok: false, error: "body too long" }, { status: 400 });
  }

  // Always tag as hermes + seo so the dashboard query picks it up.
  const labels = Array.from(new Set([
    ...(payload.labels ?? []),
    "seo",
    "hermes",
  ]));

  const filerLine = `\n\n---\n_Filed via /admin/hermes by ${user.email ?? user.id}_`;

  try {
    const issue = await createIssue({
      title: title.startsWith("[SEO]") ? title : `[SEO] ${title}`,
      body:  body + filerLine,
      labels,
    });
    return NextResponse.json({ ok: true, ...issue });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
