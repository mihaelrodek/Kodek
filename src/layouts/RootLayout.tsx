import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

export default function RootLayout() {
  // Use a CSS grid instead of flex column. Some mobile browsers (notably iOS
  // Safari) have quirks with `position: sticky` inside a flex column parent;
  // grid avoids those edge cases entirely while still letting the footer sit
  // at the bottom on short pages.
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr_auto]">
      <ScrollToTop />
      <Navbar />
      <main>
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
