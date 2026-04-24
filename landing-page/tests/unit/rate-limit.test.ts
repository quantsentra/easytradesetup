import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, __resetRateLimit, clientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    __resetRateLimit();
  });

  it("allows hits under the cap", () => {
    const cfg = { windowMs: 60_000, max: 3 };
    expect(rateLimit("ip:a", cfg, 0).allowed).toBe(true);
    expect(rateLimit("ip:a", cfg, 100).allowed).toBe(true);
    expect(rateLimit("ip:a", cfg, 200).allowed).toBe(true);
  });

  it("blocks the cap+1 hit with retryAfter", () => {
    const cfg = { windowMs: 60_000, max: 2 };
    rateLimit("ip:a", cfg, 0);
    rateLimit("ip:a", cfg, 1_000);
    const blocked = rateLimit("ip:a", cfg, 2_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("allows again after the window slides past oldest hit", () => {
    const cfg = { windowMs: 60_000, max: 2 };
    rateLimit("ip:a", cfg, 0);
    rateLimit("ip:a", cfg, 1_000);
    expect(rateLimit("ip:a", cfg, 2_000).allowed).toBe(false);
    // Slide past the window — both previous hits expire.
    expect(rateLimit("ip:a", cfg, 61_001).allowed).toBe(true);
  });

  it("tracks different keys independently", () => {
    const cfg = { windowMs: 60_000, max: 1 };
    expect(rateLimit("ip:a", cfg, 0).allowed).toBe(true);
    expect(rateLimit("ip:b", cfg, 0).allowed).toBe(true);
    expect(rateLimit("ip:a", cfg, 1).allowed).toBe(false);
    expect(rateLimit("ip:b", cfg, 1).allowed).toBe(false);
  });
});

describe("clientIp", () => {
  it("returns first IP in x-forwarded-for", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip when xff is absent", () => {
    const req = new Request("http://x", { headers: { "x-real-ip": "9.9.9.9" } });
    expect(clientIp(req)).toBe("9.9.9.9");
  });

  it("returns 'unknown' when no IP header is present", () => {
    const req = new Request("http://x");
    expect(clientIp(req)).toBe("unknown");
  });
});
