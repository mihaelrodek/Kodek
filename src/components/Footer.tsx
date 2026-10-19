import { Link } from 'react-router-dom'
import Brand from './Brand'
import { business } from '../data/business'
import { localized } from '../i18n/translations'
import { useTranslation } from '../hooks/useTranslation'

export default function Footer() {
  const { t, lang, path } = useTranslation()
  const navLinks = [
    { to: path('home'), label: t.nav.home },
    { to: path('projects'), label: t.nav.work },
    { to: path('about'), label: t.nav.about },
    { to: path('contact'), label: t.nav.contact },
  ]

  const linkClass =
    'focus-ring inline-flex min-h-9 items-center rounded-md text-sm text-zinc-600 transition hover:text-zinc-950 sm:min-h-0 sm:py-0.5 dark:text-zinc-400 dark:hover:text-white'

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-page grid grid-cols-2 gap-8 py-10 sm:py-12 lg:grid-cols-[1.3fr_0.6fr_1.4fr_0.6fr] lg:gap-10">
        <div className="col-span-2 sm:col-span-1">
          <Brand />
          <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {t.footer.summary}
          </p>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
            {t.footer.rights(business.copyrightYear)}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">{t.footer.navigation}</h2>
          <nav aria-label={t.footer.navigation} className="mt-3 flex flex-col items-start gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="order-last col-span-2 sm:order-none sm:col-span-1">
          <h2 className="text-sm font-semibold">{t.footer.legal}</h2>
          <dl className="mt-3 space-y-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <div>
              <dt className="sr-only">{t.footer.legal}</dt>
              <dd className="font-medium text-zinc-800 dark:text-zinc-200">{business.legalName}</dd>
            </div>
            <div>
              <dt className="sr-only">{t.footer.owner}</dt>
              <dd>{business.ownerLabel}</dd>
            </div>
            <div>
              <dt className="sr-only">{t.footer.address}</dt>
              <dd>{localized(lang, business.address, business.addressHr)}</dd>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex gap-1.5">
                <dt>{t.footer.oib}:</dt>
                <dd>{business.oib}</dd>
              </div>
              <div>
                <dt className="sr-only">{t.footer.email}</dt>
                <dd>
                  <a
                    href={`mailto:${business.email}`}
                    className="focus-ring inline-flex min-h-9 items-center rounded-md underline-offset-4 hover:text-zinc-950 hover:underline sm:min-h-0 dark:hover:text-white"
                  >
                    {business.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.footer.phone}</dt>
                <dd>
                  <a
                    href={business.phoneHref}
                    className="focus-ring inline-flex min-h-9 items-center rounded-md whitespace-nowrap underline-offset-4 hover:text-zinc-950 hover:underline sm:min-h-0 dark:hover:text-white"
                  >
                    {business.phone}
                  </a>
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-sm font-semibold">{t.footer.social}</h2>
          <div className="mt-3 flex flex-col items-start gap-1">
            <a href={business.social.github} target="_blank" rel="noreferrer" className={linkClass}>
              {t.contact.githubLabel}
            </a>
            <a
              href={business.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              {t.contact.linkedinLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
