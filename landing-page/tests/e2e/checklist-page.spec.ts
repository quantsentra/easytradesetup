import { test, expect } from '@playwright/test'

test.describe('/checklist page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checklist')
    await page.evaluate(() => {
      const key = `ets-checklist-${new Date().toISOString().slice(0, 10)}`
      localStorage.removeItem(key)
    })
    await page.reload()
  })

  test('renders page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ETS Pre-Trade Checklist')
  })

  test('renders all 5 checklist buttons', async ({ page }) => {
    // Items are <button> elements inside the checklist card
    const checklistCard = page.locator('.bg-bg-surface.border.border-border.rounded-card')
    const buttons = checklistCard.getByRole('button')
    await expect(buttons).toHaveCount(5)
  })

  test('progress bar container is visible and fill starts at 0%', async ({ page }) => {
    // Container is always visible; fill div is hidden at width 0
    const container = page.locator('.h-2.bg-bg-raised.rounded-full')
    await expect(container).toBeVisible()
    const fill = container.locator('div')
    const width = await fill.evaluate((el) => (el as HTMLElement).style.width)
    expect(width).toBe('0%')
  })

  test('clicking an item marks it complete', async ({ page }) => {
    const checklistCard = page.locator('.bg-bg-surface.border.border-border.rounded-card')
    const firstBtn = checklistCard.getByRole('button').first()
    await firstBtn.click()
    // Checked button gets bg-accent-green/5 class
    await expect(firstBtn).toHaveClass(/accent-green/, { timeout: 2000 })
  })

  test('completing all items shows "Ready to trade"', async ({ page }) => {
    const checklistCard = page.locator('.bg-bg-surface.border.border-border.rounded-card')
    const buttons = checklistCard.getByRole('button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click()
    }
    await expect(page.getByText('Ready to trade')).toBeVisible({ timeout: 3000 })
  })

  test('has a CTA linking to /#pricing', async ({ page }) => {
    const link = page.getByRole('link', { name: /₹999/i })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/#pricing')
  })

  test('persists state after page reload', async ({ page }) => {
    const checklistCard = page.locator('.bg-bg-surface.border.border-border.rounded-card')
    await checklistCard.getByRole('button').first().click()
    await page.reload()
    const firstBtn = checklistCard.getByRole('button').first()
    await expect(firstBtn).toHaveClass(/accent-green/, { timeout: 2000 })
  })
})
