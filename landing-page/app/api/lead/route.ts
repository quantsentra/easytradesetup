import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  let payload: Record<string, string> = {};
  if (contentType.includes("application/json")) {
    payload = await req.json();
  } else {
    const form = await req.formData();
    form.forEach((v, k) => {
      payload[k] = String(v);
    });
  }

  const email = (payload.email || "").trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  // TODO: wire to Resend / Google Sheets when credentials exist.
  console.log("[lead]", { email, ...payload });

  if (contentType.includes("application/json")) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.redirect(new URL("/thank-you", req.url), 303);
}
