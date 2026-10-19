import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes, StaticRouter, useLocation } from 'react-router-dom'
import LanguageToggle from '@/components/LanguageToggle'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'
import { translations } from '@/i18n/translations'
import { langFromPath, routeKeyFromPath, translatePath } from '@/i18n/routes'

function Probe() {
  const { lang, t, path } = useTranslation()
  const { pathname } = useLocation()
  return (
    <>
      <span data-testid="lang">{lang}</span>
      <span data-testid="about-copy">{t.about.eyebrow}</span>
      <span data-testid="contact-path">{path('contact')}</span>
      <span data-testid="pathname">{pathname}</span>
    </>
  )
}

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <LanguageProvider>
        <Probe />
        <Routes>
          <Route path="*" element={<LanguageToggle />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('routes', () => {
  it('maps paths to languages: Croatian at the root, English under /en', () => {
    expect(langFromPath('/')).toBe('hr')
    expect(langFromPath('/o-meni')).toBe('hr')
    expect(langFromPath('/en')).toBe('en')
    expect(langFromPath('/en/about')).toBe('en')
    expect(langFromPath('/english')).toBe('hr')
  })

  it('translates a page path into the other language', () => {
    expect(routeKeyFromPath('/kontakt/')).toBe('contact')
    expect(translatePath('/o-meni', 'en')).toBe('/en/about')
    expect(translatePath('/en/projects', 'hr')).toBe('/projekti')
    expect(translatePath('/en', 'hr')).toBe('/')
    expect(translatePath('/does-not-exist', 'en')).toBe('/en')
  })
})

describe('LanguageProvider', () => {
  it('renders Croatian on Croatian URLs', () => {
    renderAt('/o-meni')

    expect(screen.getByTestId('lang')).toHaveTextContent('hr')
    expect(screen.getByTestId('about-copy')).toHaveTextContent(translations.hr.about.eyebrow)
    expect(screen.getByTestId('contact-path')).toHaveTextContent('/kontakt')
    expect(document.documentElement.lang).toBe('hr')
  })

  it('renders English on /en URLs', () => {
    renderAt('/en/about')

    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(screen.getByTestId('contact-path')).toHaveTextContent('/en/contact')
    expect(document.documentElement.lang).toBe('en')
  })

  it('server-renders the language of the URL (what prerender bakes in)', () => {
    const html = renderToStaticMarkup(
      <StaticRouter location="/en/about">
        <LanguageProvider>
          <Probe />
        </LanguageProvider>
      </StaticRouter>,
    )

    expect(html).toContain(translations.en.about.eyebrow)
    expect(html).not.toContain(translations.hr.about.eyebrow)
  })

  it('the toggle links to the same page in the other language, keeping the query', async () => {
    const user = userEvent.setup()
    renderAt('/projekti?c=web')

    expect(
      screen.getByRole('link', { name: translations.hr.language.switchTo('English') }),
    ).toHaveAttribute('href', '/en/projects?c=web')

    await user.click(
      screen.getByRole('link', { name: translations.hr.language.switchTo('English') }),
    )

    expect(screen.getByTestId('pathname')).toHaveTextContent('/en/projects')
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })
})
