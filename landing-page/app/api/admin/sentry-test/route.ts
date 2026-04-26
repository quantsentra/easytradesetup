import "server-only";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Deliberate-error endpoint. Triggers a server-side exception that Sentry
// captures so the admin dashboard has something to show. Admin-gated so
// random visitors can't pollute the issues feed.

class SampleSentryTestError extends Error {
  constructor() {
    super("Sample test error from /admin/errors — safe to resolve.");
    this.name = "SampleSentryTestError";
  }
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const err = new SampleSentryTestError();

  // Capture via SDK directly — guarantees ingestion even if higher-level
  // handlers swallow before instrumentation.onRequestError fires.
  Sentry.captureException(err, {
    tags: {
      source: "admin-test-button",
      triggered_by: user.email || user.id,
    },
    extra: {
      url: new URL(req.url).pathname,
      timestamp: new Date().toISOString(),
    },
  });

  // Force a flush so the event reaches Sentry before the function exits
  // (serverless cold-start kills any in-flight request without flush).
  await Sentry.flush(2000);

  return NextResponse.json({
    ok: true,
    message: "Test error captured. Refresh /admin/errors in ~30s to see it.",
    eventName: err.name,
  });
}
