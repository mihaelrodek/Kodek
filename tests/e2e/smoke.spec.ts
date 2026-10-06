import { expect, test, type Page } from '@playwright/test'

/**
 * Smoke pass over every prerendered route. The point is the hydration
 * contract: the static HTML that scripts/prerender.mjs writes must match
 * React's first client render exactly, and React only complains about that on
 * the console — never with a failed request or a blank screen.
 */
const HYDRATION_SIGNATURES = [
  /hydrat/i,
  /did not match/i,
  /text content does not match/i,
  // A production React build only emits a code, so the words above never
  // appear. 418/421/422/423/425 are the hydration-mismatch family — verified
  // against a deliberately mismatched page while writing this spec.
  /React error #(418|421|422|423|425)\b/i,
]

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/projects', name: 'projects' },
  { path: '/contact', name: 'contact' },
  { path: '/404', name: '404 page' },
  { path: '/does-not-exist', name: '404' },
]

function watchConsole(page: Page): string[] {
  const messages: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      messages.push(`[console.${msg.type()}] ${msg.text()}`)
    }
  })
  page.on('pageerror', (err) => {
    messages.push(`[pageerror] ${err.message}`)
  })
  return messages
}

function hydrationProblems(messages: string[]): string[] {
  return messages.filter((m) => HYDRATION_SIGNATURES.some((re) => re.test(m)))
}

/** Give React time to hydrate (and to log about it) before asserting. */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await expect(page.locator('#root')).not.toBeEmpty()
  await page.waitForTimeout(500)
}

for (const route of ROUTES) {
  test(`${route.name} (${route.path}) hydrates cleanly and has an h1`, async ({ page }) => {
    const messages = watchConsole(page)

    const response = await page.goto(route.path)
    expect(response, `no response for ${route.path}`).not.toBeNull()
    await settle(page)

    expect(hydrationProblems(messages), `hydration problems on ${route.path}`).toEqual([])

    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
    await expect(h1.first()).not.toBeEmpty()
  })
}

test('unknown URLs render the 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/does-not-exist')

  expect(response?.status()).toBe(404)
  await settle(page)

  await expect(page.getByRole('heading', { level: 1, name: /page not found/i })).toBeVisible()
  await expect(page.getByText('404', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /back home/i })).toBeVisible()
})

test('the nav links reach every prerendered route without a reload', async ({ page, isMobile }) => {
  const messages = watchConsole(page)
  await page.goto('/')
  await settle(page)

  if (isMobile) {
    await page.getByRole('button', { name: /open.*menu/i }).click()
  }
  await page.getByRole('link', { name: 'Work', exact: true }).first().click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  expect(hydrationProblems(messages)).toEqual([])
})

test('stored Croatian and dark-mode preferences hydrate cleanly on every route', async ({
  page,
}) => {
  const messages = watchConsole(page)
  await page.addInitScript(() => {
    window.localStorage.setItem('portfolio-lang', 'hr')
    window.localStorage.setItem('portfolio-theme', 'dark')
  })

  for (const route of ROUTES) {
    const messageCount = messages.length
    const response = await page.goto(route.path)
    expect(response, `no response for ${route.path}`).not.toBeNull()
    await settle(page)

    expect(
      hydrationProblems(messages.slice(messageCount)),
      `hydration problems on ${route.path}`,
    ).toEqual([])
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  }
})

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile-viewport project only')

  test('founder page renders on a phone viewport', async ({ page }) => {
    const messages = watchConsole(page)

    await page.goto('/about')
    await settle(page)

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mihael Rodek')
    await expect(page.getByRole('heading', { name: 'True North' })).toBeVisible()

    expect(hydrationProblems(messages), 'hydration problems on mobile founder page').toEqual([])
  })
})

test.describe('complete static route content', () => {
  test.use({ javaScriptEnabled: false })

  for (const route of ROUTES) {
    test(`${route.name} contains a readable main heading without JavaScript`, async ({ page }) => {
      const response = await page.goto(route.path)
      await expect(page.locator('main h1')).toBeVisible()
      await expect(page.locator('main h1')).not.toBeEmpty()
      await expect(page.locator('main h1')).toHaveCSS('opacity', '1')
      const html = await response!.text()
      expect(html).not.toContain('<!--$?-->')
      expect(html).not.toContain('$RC(')
    })
  }
})
