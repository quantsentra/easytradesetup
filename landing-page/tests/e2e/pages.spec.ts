import { test, expect } from "@playwright/test";

const routes: Array<{ path: string; mustContain: RegExp }> = [
  { path: "/", mustContain: /trade with clarity/i },
  { path: "/pricing", mustContain: /pricing|reserve/i },
  { path: "/product", mustContain: /golden indicator|product/i },
  { path: "/compare", mustContain: /compare|alternatives/i },
  { path: "/sample", mustContain: /free sample|chapter/i },
  { path: "/case-studies", mustContain: /case studies/i },
  { path: "/strategy", mustContain: /strateg/i },
  { path: "/updates", mustContain: /updates|notes/i },
  { path: "/docs/faq", mustContain: /asked.*answered|faq/i },
  { path: "/docs/install", mustContain: /install/i },
  { path: "/docs/changelog", mustContain: /changelog/i },
  { path: "/docs/risk-calc", mustContain: /risk/i },
  { path: "/legal/disclaimer", mustContain: /disclaimer/i },
  { path: "/legal/privacy", mustContain: /privacy/i },
  { path: "/legal/terms", mustContain: /terms/i },
  { path: "/legal/refund", mustContain: /refund/i },
  { path: "/contact", mustContain: /contact|hello@easytradesetup/i },
  { path: "/about", mustContain: /about|easytradesetup/i },
  { path: "/thank-you", mustContain: /thank|reserved/i },
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
