import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serves files from landing-page/admin-assets/brand/ — gated to admin
// only. The brand kit HTML uses inline <script type="text/babel"> tags
// for its in-browser JSX runtime, which violates the strict CSP the rest
// of the site enforces. We override CSP on this response with a more
// permissive policy scoped only to the iframe document.
//
// Path traversal protection: the resolved file must live under the brand
// asset directory; anything outside returns 403.
const BRAND_DIR = path.join(process.cwd(), "admin-assets", "brand");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md":   "text/markdown; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg":  "image/svg+xml",
  ".webp": "image/webp",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".jsx":  "text/jsx; charset=utf-8",
  ".ttf":  "font/ttf",
  ".otf":  "font/otf",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".txt":  "text/plain; charset=utf-8",
};

// Permissive CSP for the iframe document only. Allows the React-via-CDN
// + Babel-standalone pattern that brand-kit.html relies on.
const IFRAME_CSP = [
  "default-src 'self' https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }

  const requested = segments.join("/");
  const fullPath = path.resolve(BRAND_DIR, requested);

  if (!fullPath.startsWith(BRAND_DIR + path.sep) && fullPath !== BRAND_DIR) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let buf: Buffer;
  try {
    buf = await readFile(fullPath);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";

  // Decode text MIME types as utf-8 strings; pass other types through
  // as Buffer (cast through BodyInit — TS DOM lib types are stricter
  // than what NextResponse actually accepts at runtime).
  const isText = contentType.startsWith("text/") || contentType.includes("json") || contentType.includes("javascript");
  const body: BodyInit = isText
    ? buf.toString("utf8")
    : (buf as unknown as BodyInit);

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
      "Content-Security-Policy": IFRAME_CSP,
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "no-referrer",
    },
  });
}
