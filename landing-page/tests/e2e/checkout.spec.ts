import { test, expect } from "@playwright/test";

test.describe("Checkout page — buy flow", () => {
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

  test("buy email form is wired to /api/lead", async ({ page }) => {
    const form = page.locator("form[action='/api/lead']");
    await expect(form).toBeVisible();
    const emailInput = form.locator("input[name='email']");
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(emailInput).toHaveAttribute("required", "");
    const sourceInput = form.locator("input[name='source']");
    await expect(sourceInput).toHaveValue("checkout");
  });

  test("form submits email and redirects to /thank-you", async ({ page }) => {
    await page.locator("form[action='/api/lead'] input[name='email']").fill("test@example.com");
    await page.locator("form[action='/api/lead'] button[type='submit']").click();
    await expect(page).toHaveURL(/\/thank-you/);
  });

  test("order preview lists the bundle benefits", async ({ page }) => {
    await expect(page.getByText(/7-day no-questions refund/i)).toBeVisible();
    await expect(page.getByText(/lifetime updates included/i)).toBeVisible();
    await expect(page.getByText(/one-time payment/i).first()).toBeVisible();
  });
});
