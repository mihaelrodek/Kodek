import { useLayoutEffect, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, StaticRouter, useLocation } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ProjectsPage from '@/pages/ProjectsPage'
import { projects } from '@/data/projects'
import { translations } from '@/i18n/translations'

const t = translations.en.projects
const TOTAL = projects.length
const WEB_COUNT = projects.filter((p) => p.category === 'web').length

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

/** Chip accessible names are `label` + the count, with no separator ("Web1"). */
function chip(label: string): HTMLElement {
  return screen.getByRole('button', { name: new RegExp(`^${label}\\d+$`) })
}

/** The "Showing n of m" line is the cheapest read of how many cards are up. */
function shownCount(html: string = document.body.innerHTML): number {
  const match = /Showing (\d+) of (\d+)/.exec(html.replace(/<[^>]+>/g, ''))
  if (!match) throw new Error('no "Showing n of m" line rendered')
  return Number(match[1])
}

function pressedChipLabels(html: string): string[] {
  return [...html.matchAll(/aria-pressed="true"[^>]*>([^<]*)/g)].map((m) => m[1].trim())
}

describe('ProjectsPage URL state', () => {
  it('server-renders the unfiltered list even when the URL carries filters', () => {
    // Models scripts/prerender.mjs: whatever the visitor's URL says, the
    // static HTML is the default view.
    const html = renderToStaticMarkup(
      <StaticRouter location="/projects?c=web&sort=alpha">
        <Wrapper>
          <ProjectsPage />
        </Wrapper>
      </StaticRouter>,
    )

    expect(shownCount(html)).toBe(TOTAL)
    expect(pressedChipLabels(html)).toEqual([t.all])
  })

  it('first client render ignores ?c=web (hydration parity), then adopts it', async () => {
    let firstCommit = ''
    renderPage('/projects?c=web', (html) => {
      firstCommit = html
    })

    // Anything other than the default view here would be a hydration mismatch
    // against the prerendered /projects HTML.
    expect(shownCount(firstCommit)).toBe(TOTAL)
    expect(pressedChipLabels(firstCommit)).toEqual([t.all])

    await waitFor(() => expect(chip(t.categories.web)).toHaveAttribute('aria-pressed', 'true'))
    expect(shownCount()).toBe(WEB_COUNT)
    expect(chip(t.all)).toHaveAttribute('aria-pressed', 'false')
    // A valid param is left alone.
    expect(currentSearch()).toBe('c=web')
  })

  it('clicking a category chip writes the category to the URL', async () => {
    const user = userEvent.setup()
    renderPage('/projects')

    expect(currentSearch()).toBe('')

    await user.click(chip(t.categories.mobile))

    await waitFor(() => expect(currentSearch()).toBe('c=mobile'))
    expect(chip(t.categories.mobile)).toHaveAttribute('aria-pressed', 'true')

    // Back to "All" removes the param rather than writing `c=all`.
    await user.click(chip(t.all))
    await waitFor(() => expect(currentSearch()).toBe(''))
  })

  it('typing mirrors the search into ?q and sorting into ?sort', async () => {
    const user = userEvent.setup()
    renderPage('/projects')

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
    renderPage('/projects?sort=bogus&c=nope')

    const sort = screen.getByRole('combobox', { name: t.sortAria })
    expect(sort).toHaveValue('recent')

    await waitFor(() => expect(currentSearch()).toBe(''))
    expect(sort).toHaveValue('recent')
    expect(chip(t.all)).toHaveAttribute('aria-pressed', 'true')
    expect(shownCount()).toBe(TOTAL)
  })

  it('leaves params it does not own alone', async () => {
    renderPage('/projects?utm_source=news&sort=bogus')

    await waitFor(() => expect(currentSearch()).toBe('utm_source=news'))
  })

  it('clear resets the filters and the URL', async () => {
    const user = userEvent.setup()
    renderPage('/projects?c=web&q=dog')

    await waitFor(() => expect(currentSearch()).toBe('c=web&q=dog'))

    await user.click(screen.getByRole('button', { name: t.clear }))

    await waitFor(() => expect(currentSearch()).toBe(''))
    expect(chip(t.all)).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('searchbox', { name: t.searchAria })).toHaveValue('')
    expect(shownCount()).toBe(TOTAL)
  })

  it('the empty-state reset clears the URL too', async () => {
    const user = userEvent.setup()
    renderPage('/projects?q=zzzznothing')

    await waitFor(() => expect(shownCount()).toBe(0))
    const empty = screen.getByRole('heading', { name: t.empty.title }).parentElement
    if (!empty) throw new Error('empty state not rendered')

    await user.click(within(empty).getByRole('button', { name: t.empty.reset }))

    await waitFor(() => expect(currentSearch()).toBe(''))
    expect(shownCount()).toBe(TOTAL)
  })
})
