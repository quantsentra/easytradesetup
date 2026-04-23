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

  test("Bundle section shows all 6 included items", async ({ page }) => {
    await expect(page.getByText("Golden Indicator", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Trade Logic PDF").first()).toBeVisible();
    await expect(page.getByText("Risk Calculator").first()).toBeVisible();
    await expect(page.getByText("Daily Market Notes").first()).toBeVisible();
  });

  test("FAQ teaser includes the new objection handlers", async ({ page }) => {
    await expect(page.getByText(/free pine scripts exist/i)).toBeVisible();
    await expect(page.getByText(/ma \+ rsi/i)).toBeVisible();
  });

  test("FinalCTA reinforces one-time vs recurring", async ({ page }) => {
    await expect(page.getByText(/once\. not.*\/month\. ever\./i)).toBeVisible();
  });

  test("home page composition — 7 sections only", async ({ page }) => {
    // After simplification, home should not contain sections we removed
    await expect(page.getByText(/the indicator. live on the chart/i)).toHaveCount(0);
    await expect(page.getByText(/judge the quality before you reserve/i)).toHaveCount(0);
    await expect(page.getByText(/built in india · ships globally/i)).toHaveCount(0);
    await expect(page.getByText(/a note from the founder/i)).toHaveCount(0);
    await expect(page.getByText(/we don.*sell shortcuts/i)).toHaveCount(0);
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
