import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { useTranslation } from '../hooks/useTranslation'

export default function Navbar() {
  const { t } = useTranslation()
  const links = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/about', label: t.nav.about },
    { to: '/projects', label: t.nav.projects },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-page flex h-14 items-center gap-2 sm:h-16">
        {/* Left spacer keeps the nav visually centered on wider screens.
            On mobile, the spacer collapses so we keep the nav close to the
            left edge and leave room for the toggles. */}
        <div className="hidden flex-1 sm:block" aria-hidden="true" />

        {/* Centered nav */}
        <nav
          aria-label="Primary"
          className="flex flex-1 items-center justify-start gap-0.5 sm:flex-none sm:justify-center sm:gap-1"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  'rounded-md px-2 py-1.5 text-xs font-medium whitespace-nowrap transition sm:px-3 sm:text-sm',
                  isActive
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex flex-shrink-0 items-center justify-end gap-1.5 sm:flex-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
