import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getUser } from "@/lib/auth-server";
import { getEntitlement } from "@/lib/entitlements";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allow-list of Pine versions we currently serve. Anything outside this
// set returns 404 — prevents path-traversal attempts via the [version]
// segment from probing the filesystem.
const ALLOWED: Record<string, string> = {
  "v5": "golden-indicator-v5.pine",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ version: string }> },
) {
  const { version } = await params;
  const filename = ALLOWED[version];
  if (!filename) {
    return NextResponse.json({ ok: false, error: "unknown version" }, { status: 404 });
  }

  // Entitlement gate. The route is only reachable to logged-in users with
  // an active entitlement. Anonymous + lapsed visitors get 401 / 403 so
  // the .pine source is never publicly downloadable.
  const user = await getUser();
  if (!user?.id) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const ent = await getEntitlement(user.id);
  if (!ent || !ent.active) {
    return NextResponse.json({ ok: false, error: "no active entitlement" }, { status: 403 });
  }

  // Read from /private/pine — sibling to /public but NOT auto-served by
  // Next, so the file can only reach the browser through this gated route.
  // process.cwd() points at landing-page/ in both dev and Vercel builds.
  const filePath = path.join(process.cwd(), "private", "pine", filename);

  let body: string;
  try {
    body = await fs.readFile(filePath, "utf-8");
  } catch {
    return NextResponse.json({ ok: false, error: "file missing" }, { status: 500 });
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
