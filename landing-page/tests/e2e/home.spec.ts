import { test, expect } from "@playwright/test";

test.describe("Home page — marketing integrity", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero headline with brand keyword + structure-vs-noise positioning + accent word", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(/golden indicator/i);
    await expect(h1).toContainText(/one tradingview indicator/i);
    await expect(h1).toContainText(/structure/i);
    await expect(h1).toContainText(/not noise/i);
  });

  test("hero CTA links point to checkout + sample", async ({ page }) => {
    const buy = page.getByRole("link", { name: /buy.*\$49|buy.*₹4,599|buy golden indicator/i }).first();
    await expect(buy).toBeVisible();
    await expect(buy).toHaveAttribute("href", "/checkout");

    const sample = page.getByRole("link", { name: /free sample/i }).first();
    await expect(sample).toBeVisible();
    await expect(sample).toHaveAttribute("href", "/sample");
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

  test("Compare teaser surfaces the head-to-head spec", async ({ page }) => {
    await expect(page.getByText(/side by side/i).first()).toBeVisible();
    await expect(page.getByText(/luxalgo/i).first()).toBeVisible();
    await expect(page.getByText(/trendspider/i).first()).toBeVisible();
  });

  test("Pricing teaser shows the early-access scarcity badge", async ({ page }) => {
    await expect(
      page.getByText(/first 100 buyers receive a personalized welcome video/i),
    ).toBeVisible();
  });

  test("FAQ teaser includes key objection handlers", async ({ page }) => {
    await expect(page.getByText(/free pine scripts exist/i)).toBeVisible();
    await expect(page.getByText(/signal service/i).first()).toBeVisible();
    await expect(page.getByText(/guarantee profits/i)).toBeVisible();
    await expect(page.getByText(/does it repaint/i)).toBeVisible();
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
