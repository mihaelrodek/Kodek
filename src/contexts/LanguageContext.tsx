import { createContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { translations, type Lang, type Translations } from '../i18n/translations'
import { langFromPath, pathFor, type RouteKey } from '../i18n/routes'

export interface LanguageContextValue {
  lang: Lang
  /** Translations dictionary for the current language. */
  t: Translations
  /** Localized path of a page in the current language. */
  path: (key: RouteKey) => string
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

/**
 * The language comes from the URL (`/en/...` is English, everything else
 * Croatian), so the prerendered HTML and the first client render always agree.
 * Must be rendered inside a router.
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: translations[lang],
      path: (key) => pathFor(lang, key),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
