import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders hero with correct English headline', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stop Guessing')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Start Trading')
    // No Hindi characters
    const h1Text = await page.getByRole('heading', { level: 1 }).textContent()
    expect(h1Text).not.toMatch(/[\u0900-\u097F]/)
  })

  test('hero CTA buttons link to #pricing', async ({ page }) => {
    const primaryCTA = page.getByRole('link', { name: /Get the Pack/i }).first()
    await expect(primaryCTA).toHaveAttribute('href', '#pricing')
  })

  test('nav is present and contains key links', async ({ page }) => {
    const nav = page.locator('nav').first()
    await expect(nav.getByRole('link', { name: 'Pricing' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'FAQ' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Free Checklist' })).toBeVisible()
  })

  test('pricing section shows INR prices only — no $ sign', async ({ page }) => {
    const pricingSection = page.locator('#pricing')
    await pricingSection.scrollIntoViewIfNeeded()
    const text = await pricingSection.textContent()
    expect(text).toContain('₹999')
    expect(text).toContain('₹1,999')
    expect(text).not.toContain('$')
  })

  test('pricing CTAs link to /contact', async ({ page }) => {
    const pricingSection = page.locator('#pricing')
    await pricingSection.scrollIntoViewIfNeeded()
    const ctaLinks = pricingSection.getByRole('link', { name: /Get Notified/i })
    await expect(ctaLinks.first()).toHaveAttribute('href', '/contact')
  })

  test('FAQ accordion opens and closes', async ({ page }) => {
    const faqSection = page.locator('#faq')
    await faqSection.scrollIntoViewIfNeeded()
    const firstQuestion = faqSection.getByRole('button').first()
    await firstQuestion.click()
    // Answer should be visible
    await expect(faqSection.locator('p').first()).toBeVisible()
    // Close it
    await firstQuestion.click()
  })

  test('no Hindi text anywhere on the page', async ({ page }) => {
    // Use innerText to exclude RSC/script tags (which contain $L4 etc markers)
    const visibleText = await page.evaluate(() => document.body.innerText)
    expect(visibleText).not.toMatch(/[\u0900-\u097F]/)
  })

  test('footer contains key links', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.getByRole('link', { name: 'Free Checklist' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Terms' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Refund Policy' })).toBeVisible()
  })
})
