import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SUPPORTED_LANGS, translations, type Lang, type Translations } from '../i18n/translations'

export interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Translations dictionary for the current language. */
  t: Translations
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'portfolio-lang'

function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(value)
}

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isLang(stored)) return stored
  const browser = (navigator.language || 'en').toLowerCase()
  return browser.startsWith('hr') ? 'hr' : 'en'
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Start at the default language so the prerendered HTML and the first client
  // render agree (no hydration mismatch); adopt the stored/browser preference
  // right after mount. (hr visitors briefly see English until this runs — the
  // tradeoff of single-language prerendering.)
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    // Deliberate post-hydration adoption: the first render must match the
    // prerendered ('en') HTML, so the stored/browser preference can only
    // apply after mount.
    const preferred = getInitialLang()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState((current) => (current === preferred ? current : preferred))
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Persist only explicit choices (toggle clicks). Adopted browser defaults
  // stay re-derivable — and the mount effect can't momentarily overwrite a
  // stored preference with the 'en' the app boots in.
  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: translations[lang],
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
