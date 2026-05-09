import { test, expect } from "@playwright/test";

// Smoke-test every route linked from sitemap / nav / footer.
const routes: Array<{ path: string; mustContain: RegExp }> = [
  { path: "/", mustContain: /one tradingview indicator|any market/i },
  { path: "/product", mustContain: /golden indicator|one decision layer/i },
  { path: "/pricing", mustContain: /one price.*forever/i },
  { path: "/compare", mustContain: /compare|alternatives|side by side/i },
  { path: "/sample", mustContain: /free sample|chapter/i },
  { path: "/blog", mustContain: /indicator literacy|risk math|essays/i },
  { path: "/blog/best-indicator-for-nifty-options", mustContain: /four questions|nifty.*regime|decision-grade/i },
  { path: "/blog/are-paid-trading-signals-worth-it", mustContain: /four numbers|win rate|signal seller|drawdown/i },
  { path: "/docs/install", mustContain: /install/i },
  { path: "/docs/faq", mustContain: /asked.*answered|faq/i },
  { path: "/contact", mustContain: /contact|hello@easytradesetup/i },
  { path: "/about", mustContain: /about|easytradesetup/i },
  { path: "/thank-you", mustContain: /thank|order confirmed/i },
  { path: "/legal/disclaimer", mustContain: /disclaimer/i },
  { path: "/legal/privacy", mustContain: /privacy/i },
  { path: "/legal/terms", mustContain: /terms/i },
  { path: "/legal/refund", mustContain: /refund/i },
];

for (const r of routes) {
  test(`GET ${r.path} returns 200 and contains expected copy`, async ({ page }) => {
    const res = await page.goto(r.path);
    expect(res?.status(), `status for ${r.path}`).toBeLessThan(400);
    await expect(page.locator("body")).toContainText(r.mustContain);
  });
}

test("sitemap.xml lists the public routes", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
  const body = await page.content();
  expect(body).toContain("<urlset");
  expect(body).toContain("/pricing");
  expect(body).toContain("/checkout");
  expect(body).toContain("/compare");
  expect(body).toContain("/sample");
});

test("sitemap does not include removed pages", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  const body = await page.content();
  expect(res?.status()).toBe(200);
  expect(body).not.toMatch(/\/case-studies/);
  expect(body).not.toMatch(/\/docs\/risk-calc/);
  expect(body).not.toMatch(/\/docs\/changelog/);
});

test("robots.txt allows crawling", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
  const body = await page.content();
  expect(body.toLowerCase()).toContain("user-agent");
});

test("OpenGraph image endpoint renders without 5xx", async ({ page }) => {
  const res = await page.goto("/opengraph-image");
  expect(res?.status(), "opengraph-image status").toBeLessThan(500);
});
