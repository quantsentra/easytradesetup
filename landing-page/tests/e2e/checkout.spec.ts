import { test, expect } from "@playwright/test";

test.describe("Checkout page — Stripe buy flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/checkout");
  });

  test("renders risk disclosure callout", async ({ page }) => {
    await expect(page.getByText(/educational tool, not investment advice/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /trading disclaimer/i }).first()).toBeVisible();
  });

  test("shows price, retail strike-through, and launch price label", async ({ page }) => {
    await expect(page.getByText(/retail/i).first()).toBeVisible();
    await expect(page.getByText(/launch price/i).first()).toBeVisible();
    await expect(page.getByText(/\$49|₹4,599/).first()).toBeVisible();
  });

  test("Stripe buy button is wired and email input is optional", async ({ page }) => {
    const button = page.getByRole("button", { name: /pay \$\d+/i });
    await expect(button).toBeVisible();
    const email = page.getByPlaceholder(/you@example.com/i);
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute("type", "email");
    // Optional — no `required` attribute. Stripe collects email on hosted page.
    await expect(email).not.toHaveAttribute("required", "");
  });

  test("payment methods strip lists Stripe", async ({ page }) => {
    await expect(page.getByText(/stripe/i).first()).toBeVisible();
    await expect(page.getByText(/cards · live now/i)).toBeVisible();
  });

  test("order preview lists the bundle benefits", async ({ page }) => {
    await expect(page.getByText(/7-day no-questions refund/i)).toBeVisible();
    await expect(page.getByText(/lifetime updates included/i)).toBeVisible();
    await expect(page.getByText(/one-time payment/i).first()).toBeVisible();
  });
});
