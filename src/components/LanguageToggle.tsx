import { useTranslation } from '../hooks/useTranslation'
import { SUPPORTED_LANGS, LANG_LABELS, type Lang } from '../i18n/translations'

export default function LanguageToggle() {
  const { lang, setLang, t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="inline-flex h-9 overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    >
      {SUPPORTED_LANGS.map((l: Lang) => {
        const active = l === lang
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            aria-label={t.language.switchTo(LANG_LABELS[l])}
            className={[
              'min-w-[2.25rem] px-2 text-xs font-semibold tracking-wide transition',
              active
                ? 'bg-accent-500 text-white'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
            ].join(' ')}
          >
            {t.language.short[l]}
          </button>
        )
      })}
    </div>
  )
}
