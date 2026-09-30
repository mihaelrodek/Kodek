import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      {/* History changes must commit promptly, including Back with a focused
          mobile search field. Route chunks remain lazy under Suspense. */}
      <BrowserRouter useTransitions={false}>
        <LanguageProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
)

// Routes are prerendered to static HTML at build time (scripts/prerender.mjs),
// so #root already contains real markup in production — hydrate it. Fall back to
// a fresh mount if the shell is empty (e.g. the dev server).
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
