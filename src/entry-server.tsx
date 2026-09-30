import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

/**
 * Build-time static entry. Unlike the streaming API, the static prerender API
 * resolves every lazy route before emitting HTML: no Suspense placeholders or
 * inline reveal scripts can leak into the CSP-protected production page.
 * Keep this provider order aligned with main.tsx. Never import this from app code.
 */
export async function render(url: string): Promise<string> {
  let renderError: unknown
  const { prelude, postponed } = await prerenderToNodeStream(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <StaticRouter location={url}>
          <LanguageProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </LanguageProvider>
        </StaticRouter>
      </MotionConfig>
    </StrictMode>,
    {
      // Static files must inline even large completed Suspense boundaries.
      // React's default chunk threshold otherwise emits script-revealed segments.
      progressiveChunkSize: Number.MAX_SAFE_INTEGER,
      onError(error) {
        renderError = error
      },
    },
  )
  if (renderError) throw renderError
  if (postponed) throw new Error(`Prerender did not finish for ${url}`)

  const chunks: Buffer[] = []
  for await (const chunk of prelude) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}
