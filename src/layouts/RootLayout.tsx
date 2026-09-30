import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { useTranslation } from '../hooks/useTranslation'

export default function RootLayout() {
  const { t } = useTranslation()

  // Use a CSS grid instead of flex column. Some mobile browsers (notably iOS
  // Safari) have quirks with `position: sticky` inside a flex column parent;
  // grid avoids those edge cases entirely while still letting the footer sit
  // at the bottom on short pages.
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr_auto]">
      <a
        href="#main"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 dark:focus:bg-zinc-900 dark:focus:text-zinc-100"
      >
        {t.a11y.skipToContent}
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main" tabIndex={-1} className="min-w-0">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function PageFallback() {
  // Quiet placeholder: holds vertical space so the footer doesn't jump while a
  // lazily-loaded route chunk arrives. No spinner — chunk loads are usually
  // sub-frame on a warm cache.
  return <div className="min-h-[60svh]" aria-hidden="true" />
}
