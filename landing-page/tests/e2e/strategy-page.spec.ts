import { test, expect } from '@playwright/test'

test.describe('/strategy/ets-momentum page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/strategy/ets-momentum')
  })

  test('renders page title and breadcrumb', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ETS Momentum Setup')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('shows INR pricing — no $ sign in visible text', async ({ page }) => {
    // Use innerText to exclude script/style tag content (RSC payload has $L4 etc)
    const visibleText = await page.evaluate(() => document.body.innerText)
    expect(visibleText).toContain('₹')
    expect(visibleText).not.toContain('$')
  })

  test('no Hindi text in visible content', async ({ page }) => {
    const visibleText = await page.evaluate(() => document.body.innerText)
    expect(visibleText).not.toMatch(/[\u0900-\u097F]/)
  })

  test('CTA links go to /contact or /#pricing', async ({ page }) => {
    const ctaLinks = page.getByRole('link', { name: /Get Notified|Get the Pack/i })
    const count = await ctaLinks.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const href = await ctaLinks.nth(i).getAttribute('href')
      expect(href).toMatch(/\/contact|#pricing|\/#pricing/)
    }
  })

  test('has breadcrumb back to home', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: 'Home' })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute('href', '/')
  })
})
