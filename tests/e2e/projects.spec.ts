import { expect, test, type Page } from '@playwright/test'

/**
 * The Projects page keeps its filter/search/sort in the URL (`c`, `q`,
 * `sort`). Two things can only be checked in a real browser against the real
 * build: that a deep link survives hydration (the prerendered HTML is built at
 * a bare `/projects`, so the page has to adopt the params *after* mount
 * without React complaining), and that back/forward restores the state.
 */
const HYDRATION_SIGNATURES = [
  /hydrat/i,
  /did not match/i,
  /text content does not match/i,
  // A production React build only emits a code, so the words above never
  // appear. 418/421/422/423/425 are the hydration-mismatch family.
  /React error #(418|421|422|423|425)\b/i,
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

// Chip accessible names carry a trailing count ("Web1"), so match on a prefix.
const chip = (page: Page, label: string) =>
  page.getByRole('button', { name: new RegExp(`^${label}`) })
const sortSelect = (page: Page) => page.getByRole('combobox', { name: 'Sort projects' })
const searchBox = (page: Page) => page.getByRole('searchbox', { name: 'Search projects' })

test('?c=web deep link hydrates cleanly and activates the Web chip', async ({ page }) => {
  const messages = watchConsole(page)

  await page.goto('/projects?c=web')
  await settle(page)

  await expect(chip(page, 'Web')).toHaveAttribute('aria-pressed', 'true')
  await expect(chip(page, 'All')).toHaveAttribute('aria-pressed', 'false')

  // Adopting the param must not rewrite a URL that was already canonical.
  await expect(page).toHaveURL(/\/projects\?c=web$/)

  const cards = page.locator('article')
  const shown = await cards.count()
  expect(shown).toBeGreaterThan(0)
  for (let i = 0; i < shown; i += 1) {
    await expect(cards.nth(i)).toContainText('Web')
  }

  expect(hydrationProblems(messages), 'hydration problems on /projects?c=web').toEqual([])
})

test('changing the sort pushes to the URL and back restores the previous state', async ({
  page,
}) => {
  const messages = watchConsole(page)

  await page.goto('/projects?c=web')
  await settle(page)
  await expect(sortSelect(page)).toHaveValue('recent')

  await sortSelect(page).selectOption('alpha')
  await expect(page).toHaveURL(/\/projects\?c=web&sort=alpha$/)
  await expect(sortSelect(page)).toHaveValue('alpha')
  await expect(chip(page, 'Web')).toHaveAttribute('aria-pressed', 'true')

  await page.goBack()

  // A normal push, so back lands on the pre-sort URL and the page follows it.
  await expect(page).toHaveURL(/\/projects\?c=web$/)
  await expect(sortSelect(page)).toHaveValue('recent')
  await expect(chip(page, 'Web')).toHaveAttribute('aria-pressed', 'true')

  await page.goForward()
  await expect(page).toHaveURL(/\/projects\?c=web&sort=alpha$/)
  await expect(sortSelect(page)).toHaveValue('alpha')

  expect(hydrationProblems(messages)).toEqual([])
})

test('unknown param values fall back to the defaults and are scrubbed', async ({ page }) => {
  const messages = watchConsole(page)

  await page.goto('/projects?c=nope&sort=bogus')
  await settle(page)

  await expect(page).toHaveURL(/\/projects\??$/)
  await expect(chip(page, 'All')).toHaveAttribute('aria-pressed', 'true')
  await expect(sortSelect(page)).toHaveValue('recent')

  expect(hydrationProblems(messages)).toEqual([])
})

test('typing mirrors into ?q without stacking history entries, and clear resets the URL', async ({
  page,
}) => {
  await page.goto('/projects')
  await settle(page)

  // Category change: a normal push.
  await chip(page, 'Academic').click()
  await expect(page).toHaveURL(/\/projects\?c=academic$/)

  // Search: written with `replace`, so it edits the current entry in place.
  await searchBox(page).fill('menza')
  await expect(page).toHaveURL(/\/projects\?c=academic&q=menza$/)
  await expect(searchBox(page)).toHaveValue('menza')

  // One step back therefore skips the whole query and lands on the unfiltered
  // page — not on `?c=academic` with a partially typed word.
  await page.goBack()
  await expect(page).toHaveURL(/\/projects\??$/)
  await expect(searchBox(page)).toHaveValue('')
  await expect(chip(page, 'All')).toHaveAttribute('aria-pressed', 'true')

  await page.goForward()
  await expect(page).toHaveURL(/\/projects\?c=academic&q=menza$/)
  await expect(searchBox(page)).toHaveValue('menza')

  await page.getByRole('button', { name: 'Clear filters' }).first().click()
  await expect(page).toHaveURL(/\/projects\??$/)
  await expect(searchBox(page)).toHaveValue('')
  await expect(chip(page, 'All')).toHaveAttribute('aria-pressed', 'true')
})
