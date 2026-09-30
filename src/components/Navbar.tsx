import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { useTranslation } from '../hooks/useTranslation'

export default function Navbar() {
  const { t } = useTranslation()
  const links = [
    { to: '/#services', label: t.nav.services, end: true },
    { to: '/projects', label: t.nav.work },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-2">
        <Brand className="shrink-0" />

        <nav aria-label={t.nav.primaryLabel} className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  'focus-ring inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition',
                  isActive
                    ? 'text-accent-700 dark:text-accent-300'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            asChild
            className="bg-accent-600 hover:bg-accent-700 hidden px-4 text-white shadow-sm lg:inline-flex"
          >
            <Link to="/contact">{t.nav.requestQuote}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t.nav.mobileMenu}
                className="lg:hidden"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              aria-describedby={undefined}
              className="w-[min(22rem,88vw)] border-zinc-200 bg-white p-0 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <SheetHeader className="flex-row items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
                <SheetTitle>{t.nav.mobileMenuTitle}</SheetTitle>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t.nav.mobileMenuClose}
                  >
                    <X aria-hidden="true" />
                  </Button>
                </SheetClose>
              </SheetHeader>

              <nav aria-label={t.nav.primaryLabel} className="flex flex-col gap-1 px-4 py-5">
                {links.map((link) => (
                  <SheetClose key={link.to} asChild>
                    <Link
                      to={link.to}
                      className="focus-ring inline-flex min-h-12 items-center rounded-lg px-3 text-base font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    asChild
                    className="bg-accent-600 hover:bg-accent-700 mt-4 text-white shadow-sm"
                  >
                    <Link to="/contact">{t.nav.requestQuote}</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
