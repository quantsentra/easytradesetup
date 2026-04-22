import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/lead/route";

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
});
