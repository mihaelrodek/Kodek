import { useTranslation } from '../hooks/useTranslation'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="container-page flex h-16 items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        {/* Year is baked in at prerender time; suppress the mismatch warning if
            a stale build crosses a New Year — React patches it to the client year. */}
        <span suppressHydrationWarning>{t.footer.copyright(new Date().getFullYear())}</span>
        <span>{t.footer.built}</span>
      </div>
    </footer>
  )
}
