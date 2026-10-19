import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { SUPPORTED_LANGS, LANG_LABELS, type Lang } from '../i18n/translations'
import { translatePath } from '../i18n/routes'

/** Links (not buttons): each language is its own URL, so crawlers can follow them too. */
export default function LanguageToggle() {
  const { lang, t } = useTranslation()
  const { pathname, search } = useLocation()

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="inline-flex h-12 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    >
      {SUPPORTED_LANGS.map((l: Lang) => {
        const active = l === lang
        return (
          <Link
            key={l}
            to={`${translatePath(pathname, l)}${search}`}
            hrefLang={l}
            aria-current={active ? 'true' : undefined}
            aria-label={t.language.switchTo(LANG_LABELS[l])}
            className={[
              'focus-ring inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-xs font-semibold tracking-wide transition',
              active
                ? 'bg-accent-700 text-white'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
            ].join(' ')}
          >
            {t.language.short[l]}
          </Link>
        )
      })}
    </div>
  )
}
