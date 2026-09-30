import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToStaticMarkup } from 'react-dom/server'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'
import { translations, type Lang } from '@/i18n/translations'

const STORAGE_KEY = 'portfolio-lang'

// Records the language of every render pass so the *first* one can be asserted
// separately from the settled one.
function makeProbe() {
  const renders: Lang[] = []
  function Probe() {
    const { lang, t } = useTranslation()
    renders.push(lang)
    return (
      <>
        <span data-testid="lang">{lang}</span>
        <span data-testid="about-copy">{t.about.eyebrow}</span>
      </>
    )
  }
  return { renders, Probe }
}

describe('LanguageProvider hydration contract', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("first render is 'en' even when localStorage says 'hr', then adopts 'hr'", async () => {
    window.localStorage.setItem(STORAGE_KEY, 'hr')
    const { renders, Probe } = makeProbe()

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    // The prerendered HTML is English; a first render in 'hr' would be a
    // hydration mismatch.
    expect(renders[0]).toBe('en')

    await waitFor(() => expect(screen.getByTestId('lang')).toHaveTextContent('hr'))
    expect(screen.getByTestId('about-copy')).toHaveTextContent(translations.hr.about.eyebrow)
    expect(document.documentElement.lang).toBe('hr')
  })

  it("stays 'en' when nothing is stored and the browser language is English", async () => {
    const { renders, Probe } = makeProbe()

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(renders[0]).toBe('en')
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(new Set(renders)).toEqual(new Set(['en']))
  })

  it("server-renders 'en' regardless of a stored 'hr' preference", () => {
    window.localStorage.setItem(STORAGE_KEY, 'hr')
    const { Probe } = makeProbe()

    // Mirrors what scripts/prerender.mjs bakes into the static HTML.
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(html).toContain(translations.en.about.eyebrow)
    expect(html).not.toContain(translations.hr.about.eyebrow)
  })

  it('ignores an unsupported stored language', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'de')
    const { renders, Probe } = makeProbe()

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(renders[0]).toBe('en')
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('persists only explicit setLang() choices', async () => {
    const user = userEvent.setup()

    function Toggle() {
      const { lang, setLang } = useTranslation()
      return (
        <button type="button" onClick={() => setLang(lang === 'en' ? 'hr' : 'en')}>
          {lang}
        </button>
      )
    }

    render(
      <LanguageProvider>
        <Toggle />
      </LanguageProvider>,
    )

    // Adopting the browser default must not write to storage.
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()

    await user.click(screen.getByRole('button'))

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('hr')
  })
})
