import { Link } from 'react-router-dom'
import Brand from './Brand'
import { business } from '../data/business'
import { localized } from '../i18n/translations'
import { useTranslation } from '../hooks/useTranslation'

export default function Footer() {
  const { t, lang } = useTranslation()
  const navLinks = [
    { to: '/#services', label: t.nav.services },
    { to: '/projects', label: t.nav.work },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_1.35fr_0.7fr]">
          <div>
            <Brand />
            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {t.footer.summary}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">{t.footer.navigation}</h2>
            <nav aria-label={t.footer.navigation} className="mt-3 flex flex-col items-start">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="focus-ring inline-flex min-h-11 min-w-11 items-center rounded-md text-sm text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold">{t.footer.legal}</h2>
            <dl className="mt-4 space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              <div>
                <dt className="sr-only">{t.footer.legal}</dt>
                <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                  {business.legalName}
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.footer.owner}</dt>
                <dd>{business.ownerLabel}</dd>
              </div>
              <div>
                <dt className="sr-only">{t.footer.address}</dt>
                <dd>{localized(lang, business.address, business.addressHr)}</dd>
              </div>
              <div className="flex gap-2">
                <dt>{t.footer.oib}:</dt>
                <dd>{business.oib}</dd>
              </div>
              <div>
                <dt className="sr-only">{t.footer.email}</dt>
                <dd>
                  <a
                    href={`mailto:${business.email}`}
                    className="focus-ring inline-flex min-h-11 items-center rounded-md underline-offset-4 hover:text-zinc-950 hover:underline dark:hover:text-white"
                  >
                    {business.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-sm font-semibold">{t.footer.social}</h2>
            <div className="mt-3 flex flex-col items-start">
              <a
                href={business.social.github}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex min-h-11 items-center rounded-md text-sm text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                {t.contact.githubLabel}
              </a>
              <a
                href={business.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex min-h-11 items-center rounded-md text-sm text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                {t.contact.linkedinLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {t.footer.rights(business.copyrightYear)}
        </div>
      </div>
    </footer>
  )
}
