import { test, expect } from '@playwright/test'

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hamburger button is visible on mobile', async ({ page }) => {
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible()
  })

  test('opens mobile drawer on hamburger click', async ({ page }) => {
    await page.getByRole('button', { name: /open menu/i }).click()
    // Vaul drawer animates in — wait for nav links to be visible
    await expect(page.getByRole('link', { name: 'Pricing' }).last()).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('link', { name: 'FAQ' }).last()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Free Checklist' }).last()).toBeVisible()
  })

  test('drawer closes after clicking a link', async ({ page }) => {
    await page.getByRole('button', { name: /open menu/i }).click()
    await page.getByRole('link', { name: 'FAQ' }).first().click()
    // Drawer should close
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible({ timeout: 2000 })
  })

  test('sticky mobile CTA is visible after scrolling', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 800))
    await page.waitForTimeout(500)
    const stickyCTA = page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: /Get Notified|Get the Pack/i })
    await expect(stickyCTA).toBeVisible()
  })
})
