import { test, expect } from '@playwright/test'

test.describe('Lead Capture Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows email input and submit button', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Not Ready to Buy' })
    await section.scrollIntoViewIfNeeded()
    await expect(section.getByRole('textbox')).toBeVisible()
    await expect(section.getByRole('button', { name: /Send it/i })).toBeVisible()
  })

  test('rejects empty submission — button stays visible', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: 'Not Ready to Buy' })
    await section.scrollIntoViewIfNeeded()
    const submitBtn = section.getByRole('button', { name: /Send it/i })
    await submitBtn.click()
    // HTML5 required prevents submission, input still visible
    await expect(section.getByRole('textbox')).toBeVisible()
  })

  test('submit button shows loading state and is disabled while loading', async ({ page }) => {
    await page.route('**/api/lead', async (route) => {
      await new Promise((r) => setTimeout(r, 800))
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    })
    const section = page.locator('section').filter({ hasText: 'Not Ready to Buy' })
    await section.scrollIntoViewIfNeeded()
    await section.getByRole('textbox').fill('test@example.com')
    // Click and immediately check for loading text (button text changes to "Sending…")
    await section.getByRole('button', { name: /Send it/i }).click()
    await expect(section.getByRole('button', { name: /Sending/i })).toBeDisabled({ timeout: 2000 })
  })

  test('shows success state after valid submission', async ({ page }) => {
    await page.route('**/api/lead', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    )
    const section = page.locator('section').filter({ hasText: 'Not Ready to Buy' })
    await section.scrollIntoViewIfNeeded()
    await section.getByRole('textbox').fill('trader@example.com')
    await section.getByRole('button', { name: /Send it/i }).click()
    await expect(section.getByText('Check your inbox')).toBeVisible({ timeout: 5000 })
    await expect(section.getByText('trader@example.com')).toBeVisible()
  })

  test('shows error message on API failure', async ({ page }) => {
    await page.route('**/api/lead', (route) =>
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'fail' }) })
    )
    const section = page.locator('section').filter({ hasText: 'Not Ready to Buy' })
    await section.scrollIntoViewIfNeeded()
    await section.getByRole('textbox').fill('trader@example.com')
    await section.getByRole('button', { name: /Send it/i }).click()
    await expect(section.getByText(/support@easytradesetup\.com/i)).toBeVisible({ timeout: 5000 })
  })
})
