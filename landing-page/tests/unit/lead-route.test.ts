import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/lead/route";
import { __resetRateLimit } from "@/lib/rate-limit";

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function formRequest(kv: Record<string, string>): Request {
  const form = new URLSearchParams(kv);
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

describe("POST /api/lead", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    __resetRateLimit();
  });

  it("accepts a well-formed email via JSON and returns ok:true", async () => {
    const res = await POST(jsonRequest({ email: "trader@example.com", source: "test" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  it("rejects empty email with 400", async () => {
    const res = await POST(jsonRequest({ email: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/email/i);
  });

  it("rejects malformed email with 400", async () => {
    const res = await POST(jsonRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("rejects email missing domain with 400", async () => {
    const res = await POST(jsonRequest({ email: "user@" }));
    expect(res.status).toBe(400);
  });

  it("redirects form submissions to /thank-you on success", async () => {
    const res = await POST(formRequest({ email: "trader@example.com", source: "checkout" }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toContain("/thank-you");
  });

  it("accepts emails with + subaddressing and dots", async () => {
    const res = await POST(jsonRequest({ email: "first.last+test@example.co.in" }));
    expect(res.status).toBe(200);
  });

  it("rejects a form submission with invalid email", async () => {
    const res = await POST(formRequest({ email: "x", source: "exit" }));
    expect(res.status).toBe(400);
  });

  it("rejects unsupported Content-Type with 415", async () => {
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "email=trader@example.com",
    });
    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("rejects email with consecutive dots (RFC violation)", async () => {
    const res = await POST(jsonRequest({ email: "foo..bar@example.com" }));
    expect(res.status).toBe(400);
  });

  it("rejects single-char TLD", async () => {
    const res = await POST(jsonRequest({ email: "foo@bar.c" }));
    expect(res.status).toBe(400);
  });

  it("silently accepts honeypot-filled submission without logging email", async () => {
    const logSpy = vi.spyOn(console, "log");
    const res = await POST(
      jsonRequest({ email: "bot@example.com", website: "https://spam.example.com" }),
    );
    expect(res.status).toBe(200);
    expect(logSpy).not.toHaveBeenCalledWith(
      "[lead]",
      expect.objectContaining({ email: expect.stringContaining("bot") }),
    );
  });

  it("redirects form submissions to SITE_ORIGIN (not req Host) to prevent open redirect", async () => {
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        host: "evil.example.com",
        "x-forwarded-host": "evil.example.com",
      },
      body: "email=trader@example.com&source=checkout",
    });
    const res = await POST(req);
    expect(res.status).toBe(303);
    const loc = res.headers.get("location") || "";
    expect(loc).not.toContain("evil.example.com");
    expect(loc).toMatch(/\/thank-you$/);
  });

  it("redacts email in console log output (no plaintext PII)", async () => {
    const logSpy = vi.spyOn(console, "log");
    await POST(jsonRequest({ email: "sensitive@example.com", source: "test" }));
    const allCalls = logSpy.mock.calls.flat().map((c) => JSON.stringify(c));
    const logged = allCalls.join("\n");
    expect(logged).not.toContain("sensitive@example.com");
    expect(logged).toMatch(/\*\*\*/);
  });

  it("returns 429 Too Many Requests after burst from the same IP", async () => {
    const ipHeaders = { "content-type": "application/json", "x-forwarded-for": "203.0.113.7" };
    const body = JSON.stringify({ email: "a@example.com" });
    const make = () => new Request("http://localhost/api/lead", { method: "POST", headers: ipHeaders, body });

    // 6 allowed, 7th blocked (RATE_LIMIT = { windowMs: 60_000, max: 6 })
    for (let i = 0; i < 6; i++) {
      const res = await POST(make());
      expect(res.status, `req ${i + 1}`).toBe(200);
    }
    const blocked = await POST(make());
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toMatch(/^\d+$/);
  });
});
