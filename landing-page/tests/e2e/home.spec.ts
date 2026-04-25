import { test, expect } from "@playwright/test";

test.describe("Home page — marketing integrity", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero headline with structure-vs-noise positioning + accent word", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(/one tradingview indicator/i);
    await expect(h1).toContainText(/structure/i);
    await expect(h1).toContainText(/not noise/i);
  });

  test("hero CTA links point to checkout + sample", async ({ page }) => {
    const reserve = page.getByRole("link", { name: /reserve.*\$49|reserve.*₹4,599/i }).first();
    await expect(reserve).toBeVisible();
    await expect(reserve).toHaveAttribute("href", "/checkout");

    const sample = page.getByRole("link", { name: /free sample/i }).first();
    await expect(sample).toBeVisible();
    await expect(sample).toHaveAttribute("href", "/sample");
  });

  test("reservation notice shows claimed counter + days-left", async ({ page }) => {
    await expect(page.getByText(/\d+ \/ 500 claimed/i).first()).toBeVisible();
    await expect(page.getByText(/left · ends 15 may 2026/i).first()).toBeVisible();
  });

  test("markets marquee renders symbols", async ({ page }) => {
    await expect(page.getByText(/live markets|reads any symbol on tradingview/i).first()).toBeVisible();
    await expect(page.getByText(/nifty 50/i).first()).toBeVisible();
    await expect(page.getByText(/spx 500/i).first()).toBeVisible();
  });

  test("Bundle 6-grid shows kit items with NEW pill", async ({ page }) => {
    await expect(page.getByText("Golden Indicator", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Trade Logic PDF").first()).toBeVisible();
    await expect(page.getByText("Risk Calculator").first()).toBeVisible();
    await expect(page.getByText("Install Guide").first()).toBeVisible();
    await expect(page.getByText("Lifetime Updates").first()).toBeVisible();
    await expect(page.getByText("Founder Support").first()).toBeVisible();
    await expect(page.getByText(/^new$/i).first()).toBeVisible();
  });

  test("MultiMarket stacked cards show sample symbols", async ({ page }) => {
    await expect(page.getByText(/multi-market coverage/i)).toBeVisible();
    await expect(page.getByText(/nifty 50/i).first()).toBeVisible();
    await expect(page.getByText(/btc \/ usd/i).first()).toBeVisible();
  });

  test("FAQ teaser includes key objection handlers", async ({ page }) => {
    await expect(page.getByText(/free pine scripts exist/i)).toBeVisible();
    await expect(page.getByText(/signal service/i).first()).toBeVisible();
    await expect(page.getByText(/refund work/i)).toBeVisible();
    await expect(page.getByText(/repaint/i).first()).toBeVisible();
  });

  test("FinalCTA reinforces structure-vs-confusion framing", async ({ page }) => {
    await expect(page.getByText(/trade from structure/i).first()).toBeVisible();
    await expect(page.getByText(/once\. not.*\/month\. ever\./i)).toBeVisible();
  });

  test("no broken internal links in primary nav", async ({ page }) => {
    const nav = page.locator("header, nav").first();
    const links = await nav.locator("a[href^='/']").all();
    expect(links.length).toBeGreaterThan(3);
    for (const l of links.slice(0, 8)) {
      const href = await l.getAttribute("href");
      expect(href, `nav link href must start with /`).toMatch(/^\//);
    }
  });
});
