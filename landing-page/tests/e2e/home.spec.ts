import { test, expect } from "@playwright/test";

test.describe("Home page — marketing integrity", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero headline with tradzella-style accent word", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(/signal stack/i);
    await expect(h1).toContainText(/devours/i);
    await expect(h1).toContainText(/chart clutter/i);
  });

  test("hero CTA links point to checkout + sample", async ({ page }) => {
    const reserve = page.getByRole("link", { name: /reserve.*\$49|reserve.*₹4,599/i }).first();
    await expect(reserve).toBeVisible();
    await expect(reserve).toHaveAttribute("href", "/checkout");

    const sample = page.getByRole("link", { name: /free chapter/i }).first();
    await expect(sample).toBeVisible();
    await expect(sample).toHaveAttribute("href", "/sample");
  });

  test("reservation notice shows cap + days-left", async ({ page }) => {
    await expect(page.getByText(/500 spots · launch price/i).first()).toBeVisible();
    await expect(page.getByText(/ends 15 may 2026/i).first()).toBeVisible();
  });

  test("markets marquee renders symbols", async ({ page }) => {
    await expect(page.getByText(/reads any symbol on tradingview/i).first()).toBeVisible();
    await expect(page.getByText(/nifty 50/i).first()).toBeVisible();
    await expect(page.getByText(/spx 500/i).first()).toBeVisible();
  });

  test("3-lane WhoFor segmentation renders", async ({ page }) => {
    await expect(page.getByText(/scalpers & day traders/i)).toBeVisible();
    await expect(page.getByText(/swing & positional traders/i)).toBeVisible();
    await expect(page.getByText(/options & expiry players/i)).toBeVisible();
  });

  test("Bundle 4-grid shows kit items with NEW + COMING SOON pills", async ({ page }) => {
    await expect(page.getByText("Golden Indicator", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Trade Logic PDF").first()).toBeVisible();
    await expect(page.getByText("Risk Calculator").first()).toBeVisible();
    await expect(page.getByText("Daily Market Notes").first()).toBeVisible();
    await expect(page.getByText(/^new$/i).first()).toBeVisible();
    await expect(page.getByText(/coming soon/i).first()).toBeVisible();
  });

  test("MultiMarket stacked cards show sample symbols", async ({ page }) => {
    await expect(page.getByText(/multi-market coverage/i)).toBeVisible();
    await expect(page.getByText(/nifty 50/i).first()).toBeVisible();
    await expect(page.getByText(/btc \/ usd/i).first()).toBeVisible();
  });

  test("TheLoop 4-step section renders", async ({ page }) => {
    await expect(page.getByText(/^the loop$/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /^install$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^read$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^decide$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^trade$/i })).toBeVisible();
  });

  test("FAQ teaser includes key objection handlers", async ({ page }) => {
    await expect(page.getByText(/free pine scripts exist/i)).toBeVisible();
    await expect(page.getByText(/is this a signal service\?/i)).toBeVisible();
    await expect(page.getByText(/how does the refund work/i)).toBeVisible();
  });

  test("FinalCTA reinforces one-time vs recurring", async ({ page }) => {
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
