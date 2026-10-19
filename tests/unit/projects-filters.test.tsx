import { useLayoutEffect, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, StaticRouter, useLocation } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ProjectsPage from '@/pages/ProjectsPage'
import { PROJECT_CATEGORY_ORDER, projects } from '@/data/projects'
import { translations } from '@/i18n/translations'

const t = translations.en.projects
const TOTAL = projects.length
const WEBSITE_COUNT = projects.filter((p) => p.category === 'website').length
const GROUP_LABELS = PROJECT_CATEGORY_ORDER.filter((cat) =>
  projects.some((p) => p.category === cat),
).map((cat) => t.categories[cat])

/**
 * Reports the router's current query string, normalised through
 * URLSearchParams — react-router can leave a bare `?` behind after clearing
 * every param, and that is the same URL as none at all.
 */
function LocationProbe() {
  const { search } = useLocation()
  return <span data-testid="search">{new URLSearchParams(search).toString()}</span>
}

/**
 * Layout effects run in the commit phase, before the passive `useEffect` that
 * adopts the URL — so this snapshots the DOM exactly as the FIRST client
 * render produced it, which is the markup that has to match the prerendered
 * HTML. (`render()` from RTL flushes passive effects, so asserting after it
 * returns would always see the settled state.)
 */
function FirstCommitProbe({ onCommit }: { onCommit: (html: string) => void }) {
  useLayoutEffect(() => {
    onCommit(document.body.innerHTML)
    // Mount only — a later commit is no longer the first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  )
}

function renderPage(initialEntry: string, probe?: (html: string) => void) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Wrapper>
        {probe ? <FirstCommitProbe onCommit={probe} /> : null}
        <ProjectsPage />
        <LocationProbe />
      </Wrapper>
    </MemoryRouter>,
  )
}

function currentSearch(): string {
  return screen.getByTestId('search').textContent ?? ''
}

/** Chip accessible names are `label` + the count, with no separator ("Websites2"). */
function chip(label: string): HTMLElement {
  return screen.getByRole('button', { name: new RegExp(`^${label}\\d+$`) })
}

/** Every project card is an `<article>`; count them in a markup snapshot or the live DOM. */
function shownCount(html: string = document.body.innerHTML): number {
  return html.match(/<article\b/g)?.length ?? 0
}

/** Category group headings (h2s carrying the group id), in document order. */
function groupHeadings(html: string = document.body.innerHTML): string[] {
  return [...html.matchAll(/<h2[^>]*id="projects-group-[^"]*"[^>]*>([^<]*)/g)].map((m) =>
    m[1].trim(),
  )
}

function pressedChipLabels(html: string): string[] {
  return [...html.matchAll(/aria-pressed="true"[^>]*>([^<]*)/g)].map((m) => m[1].trim())
}

describe('ProjectsPage URL state', () => {
  it('server-renders the unfiltered list even when the URL carries filters', () => {
    // Models scripts/prerender.mjs: whatever the visitor's URL says, the
    // static HTML is the default view.
    const html = renderToStaticMarkup(
      <StaticRouter location="/en/projects?c=website&sort=alpha">
        <Wrapper>
          <ProjectsPage />
        </Wrapper>
      </StaticRouter>,
    )

    expect(shownCount(html)).toBe(TOTAL)
    expect(pressedChipLabels(html)).toEqual([t.all])
    expect(groupHeadings(html)).toEqual(GROUP_LABELS)
  })

  it('first client render ignores ?c=website (hydration parity), then adopts it', async () => {
    let firstCommit = ''
    renderPage('/en/projects?c=website', (html) => {
      firstCommit = html
    })

    // Anything other than the default view here would be a hydration mismatch
    // against the prerendered /projects HTML.
    expect(shownCount(firstCommit)).toBe(TOTAL)
    expect(pressedChipLabels(firstCommit)).toEqual([t.all])
    expect(groupHeadings(firstCommit)).toEqual(GROUP_LABELS)

    await waitFor(() => expect(chip(t.categories.website)).toHaveAttribute('aria-pressed', 'true'))
    await waitFor(() => expect(shownCount()).toBe(WEBSITE_COUNT))
    expect(chip(t.all)).toHaveAttribute('aria-pressed', 'false')
    // A category filter flattens the grouped view.
    expect(groupHeadings()).toEqual([])
    // A valid param is left alone.
    expect(currentSearch()).toBe('c=website')
  })

  it('default view groups projects under category headings in display order', () => {
    renderPage('/en/projects')

    expect(groupHeadings()).toEqual(GROUP_LABELS)
    expect(GROUP_LABELS[0]).toBe(t.categories.website)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.id)).toEqual(
      PROJECT_CATEGORY_ORDER.filter((cat) => projects.some((p) => p.category === cat)).map(
        (cat) => `projects-group-${cat}`,
      ),
    )
    expect(shownCount()).toBe(TOTAL)
    // No "Clear filters" while nothing is filtered.
    expect(screen.queryByRole('button', { name: t.clear })).toBeNull()
  })

  it('chips follow the category display order', () => {
    renderPage('/en/projects')

    const labels = screen
      .getAllByRole('button', { pressed: false })
      .map((b) => b.textContent?.replace(/\d+$/, ''))
    expect(labels).toEqual(GROUP_LABELS)
  })

  it('clicking a category chip writes the category to the URL', async () => {
    const user = userEvent.setup()
    renderPage('/en/projects')

    expect(currentSearch()).toBe('')

    await user.click(chip(t.categories.app))

    await waitFor(() => expect(currentSearch()).toBe('c=app'))
    expect(chip(t.categories.app)).toHaveAttribute('aria-pressed', 'true')
    expect(groupHeadings()).toEqual([])

    // Back to "All" removes the param rather than writing `c=all`.
    await user.click(chip(t.all))
    await waitFor(() => expect(currentSearch()).toBe(''))
  })

  it('typing mirrors the search into ?q and sorting into ?sort', async () => {
    const user = userEvent.setup()
    renderPage('/en/projects')

    const search = screen.getByRole('searchbox', { name: t.searchAria })
    await user.type(search, 'helm')

    // The input stays controlled from local state, so every keystroke lands
    // even though each one also rewrites the URL.
    expect(search).toHaveValue('helm')
    await waitFor(() => expect(currentSearch()).toBe('q=helm'))

    await user.selectOptions(screen.getByRole('combobox', { name: t.sortAria }), 'alpha')
    await waitFor(() => expect(currentSearch()).toBe('q=helm&sort=alpha'))
  })

  it('falls back to the defaults for ?sort=bogus and scrubs it from the URL', async () => {
    renderPage('/en/projects?sort=bogus&c=nope')

    const sort = screen.getByRole('combobox', { name: t.sortAria })
    expect(sort).toHaveValue('recent')

    await waitFor(() => expect(currentSearch()).toBe(''))
    expect(sort).toHaveValue('recent')
    expect(chip(t.all)).toHaveAttribute('aria-pressed', 'true')
    expect(shownCount()).toBe(TOTAL)
  })

  it('leaves params it does not own alone', async () => {
    renderPage('/en/projects?utm_source=news&sort=bogus')

    await waitFor(() => expect(currentSearch()).toBe('utm_source=news'))
  })

  it('clear resets the filters and the URL', async () => {
    const user = userEvent.setup()
    renderPage('/en/projects?c=academic&q=dog')

    await waitFor(() => expect(currentSearch()).toBe('c=academic&q=dog'))

    await user.click(screen.getByRole('button', { name: t.clear }))

    await waitFor(() => expect(currentSearch()).toBe(''))
    expect(chip(t.all)).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('searchbox', { name: t.searchAria })).toHaveValue('')
    await waitFor(() => expect(shownCount()).toBe(TOTAL))
    expect(groupHeadings()).toEqual(GROUP_LABELS)
  })

  it('the empty-state reset clears the URL too', async () => {
    const user = userEvent.setup()
    renderPage('/en/projects?q=zzzznothing')

    await waitFor(() => expect(shownCount()).toBe(0))
    const empty = screen.getByRole('heading', { name: t.empty.title }).parentElement
    if (!empty) throw new Error('empty state not rendered')

    await user.click(within(empty).getByRole('button', { name: t.empty.reset }))

    await waitFor(() => expect(currentSearch()).toBe(''))
    await waitFor(() => expect(shownCount()).toBe(TOTAL))
  })

  it('grouped view uses bento spans that fill every lg row; the filtered view uses none', async () => {
    const lgSpan = (article: Element) => {
      const match = article.className.match(/\blg:col-span-(\d)\b/)
      return match ? Number(match[1]) : 1
    }
    const { container } = renderPage('/en/projects')

    const sections = container.querySelectorAll('section[aria-labelledby^="projects-group-"]')
    expect(sections.length).toBe(GROUP_LABELS.length)
    let wide = 0
    sections.forEach((section) => {
      const spans = [...section.querySelectorAll('article')].map(lgSpan)
      wide += spans.filter((span) => span > 1).length
      if (spans.length === 1) {
        // A lone project is widened, but never stretched across the full row.
        expect(spans[0]).toBeLessThan(3)
      } else {
        expect(spans.reduce((sum, span) => sum + span, 0) % 3).toBe(0)
      }
    })
    expect(wide).toBeGreaterThan(0)

    await userEvent.click(chip(t.categories.website))
    await waitFor(() => expect(shownCount()).toBe(WEBSITE_COUNT))
    expect([...container.querySelectorAll('article')].map(lgSpan)).toEqual(
      Array(WEBSITE_COUNT).fill(1),
    )
  })
})
