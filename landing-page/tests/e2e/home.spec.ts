import { test, expect } from "@playwright/test";

test.describe("Home page — marketing integrity", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero headline + grad accent", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Trade with clarity");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Not noise");
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

  test("3-lane WhoFor segmentation renders", async ({ page }) => {
    await expect(page.getByText(/scalpers & day traders/i)).toBeVisible();
    await expect(page.getByText(/swing & positional traders/i)).toBeVisible();
    await expect(page.getByText(/options & expiry players/i)).toBeVisible();
  });

  test("India trust strip shows Hindi tagline + market chips", async ({ page }) => {
    await expect(page.getByText(/built in india.*ships globally/i)).toBeVisible();
    await expect(page.getByText(/साफ चार्ट/i)).toBeVisible();
    await expect(page.locator("text=NIFTY").first()).toBeVisible();
  });

  test("sample lead magnet CTA is present mid-scroll", async ({ page }) => {
    await expect(page.getByText(/judge the quality before you reserve/i)).toBeVisible();
    const sampleLink = page.getByRole("link", { name: /read sample chapter/i });
    await expect(sampleLink).toHaveAttribute("href", "/sample");
  });

  test("Principles section shows the We-do / We-don't balance", async ({ page }) => {
    await expect(page.getByText(/no signals/i).first()).toBeVisible();
    await expect(page.getByText(/no subscriptions/i).first()).toBeVisible();
    await expect(page.getByText(/real human support/i)).toBeVisible();
  });

  test("compare teaser leads with the 3-year savings number", async ({ page }) => {
    await expect(page.getByText(/save \$1,400\+ over 3 years/i)).toBeVisible();
  });

  test("FAQ teaser includes the new objection handlers", async ({ page }) => {
    await expect(page.getByText(/free pine scripts exist/i)).toBeVisible();
    await expect(page.getByText(/ma \+ rsi/i)).toBeVisible();
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
