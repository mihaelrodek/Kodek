import { expect, test, type Page } from '@playwright/test'

/** Give the prerendered route time to hydrate before making UI assertions. */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await expect(page.locator('#root')).not.toBeEmpty()
  await page.waitForTimeout(500)
}

test.describe('Kodek landing page', () => {
  test('Croatian is the default at the root and the toggle switches to /en', async ({ page }) => {
    await page.goto('/')
    await settle(page)

    await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
    const hero = page.locator('section[aria-labelledby="hero-heading"]')
    await expect(hero.locator('a[href="/kontakt"]')).toBeVisible()

    await page.getByRole('link', { name: 'Promijeni jezik u English' }).click()
    await expect(page).toHaveURL(/\/en$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(hero.locator('a[href="/en/contact"]')).toBeVisible()
  })

  test('renders the complete landing information architecture', async ({ page }) => {
    await page.goto('/en')
    await settle(page)

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).not.toBeEmpty()

    for (const section of ['services', 'process', 'work', 'stack', 'founder', 'faq', 'start']) {
      await expect(page.locator(`#${section}`), `missing landing section #${section}`).toBeVisible()
    }

    const hero = page.locator('section[aria-labelledby="hero-heading"]')
    await expect(hero.locator('a[href="/en/contact"]')).toContainText(/build|quote/i)
    await expect(hero.locator('a[href="/en/projects"]')).toContainText(/work|view/i)
    await expect(hero).not.toContainText(/studio/i)

    // Selected work is shown as linked cards and the founder section has a portrait slot.
    // Selected-work cards open the live site in a new tab.
    const firstWork = page.locator('#work ul a').first()
    await expect(firstWork).toBeVisible()
    await expect(firstWork).toHaveAttribute('href', /^https:\/\//)
    await expect(firstWork).toHaveAttribute('target', '_blank')
    await expect(page.locator('#founder figure')).toBeVisible()
    await expect(page.locator('#founder')).not.toContainText('whoami')
  })

  test('desktop primary navigation uses the business landing labels', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'desktop navigation project only')

    await page.goto('/en')
    await settle(page)

    const nav = page.getByRole('navigation', { name: /primary/i })
    for (const label of ['Home', 'Work', 'About me', 'Contact']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
    }
    await expect(page.getByRole('link', { name: 'Request a quote', exact: true })).toBeVisible()
  })

  test('primary hero CTA navigates to the business inquiry form', async ({ page }) => {
    await page.goto('/en')
    await settle(page)

    await page.locator('section[aria-labelledby="hero-heading"] a[href="/en/contact"]').click()
    await expect(page).toHaveURL(/\/en\/contact$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible()
    await expect(page.getByLabel(/message|how can i help/i)).toBeVisible()
  })

  test('nav Home link returns to the landing page from another route', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/en/projects')
    await settle(page)

    if (isMobile) {
      await page.getByRole('button', { name: /open.*menu/i }).click()
    }
    const navigation = isMobile ? page.getByRole('dialog') : page
    await navigation.getByRole('link', { name: 'Home', exact: true }).first().click()
    await expect(page).toHaveURL(/\/en$/)
    await expect(page.locator('#hero-heading')).toBeVisible()
  })

  test('FAQ accordion opens and closes with keyboard controls', async ({ page }) => {
    await page.goto('/en')
    await settle(page)

    const faq = page.locator('#faq')
    const trigger = faq.getByRole('button').first()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(faq.locator('[role="region"]').first()).toBeVisible()

    await page.keyboard.press('Space')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})

test.describe('Founder page and mobile navigation', () => {
  test('founder page shows the profile and experience', async ({ page }) => {
    await page.goto('/en/about')
    await settle(page)

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mihael Rodek')
    // The personal life timeline is kept in the codebase but not routed.
    await expect(page.locator('section[aria-label*="timeline" i]')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'True North' })).toBeVisible()
    // The skills grid was removed from the profile; the landing page marquee covers it.
    await expect(page.getByRole('heading', { name: /skills/i })).toHaveCount(0)
    await expect(
      page.getByRole('link', { name: 'Request a quote', exact: true }).last(),
    ).toHaveAttribute('href', '/en/contact')
  })

  test('mobile menu supports focus, closing, and route navigation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-viewport project only')

    await page.goto('/en')
    await settle(page)

    const openMenu = page.getByRole('button', { name: /open.*menu/i })
    await expect(openMenu).toBeVisible()
    await openMenu.click()

    const closeMenu = page.getByRole('button', { name: /close.*menu/i })
    await expect(closeMenu).toBeVisible()
    await expect(closeMenu).toBeFocused()

    await closeMenu.click()
    await expect(closeMenu).toBeHidden()
    await expect(openMenu).toBeFocused()

    await openMenu.click()
    await page.getByRole('link', { name: 'About me', exact: true }).last().click()
    await expect(page).toHaveURL(/\/en\/about$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mihael Rodek')
  })

  test('landing page has no horizontal overflow on a phone viewport', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'mobile-viewport project only')

    await page.goto('/en')
    await settle(page)

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(overflow, 'landing page introduces horizontal overflow').toBe(false)
  })
})

for (const width of [320, 360]) {
  test(`landing fits a ${width}px viewport in both languages`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/en']) {
      await page.goto(path)
      await settle(page)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      )
      expect(overflow).toBe(false)
    }
  })
}
