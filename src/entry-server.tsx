import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

/**
 * Build-time SSR entry. `scripts/prerender.mjs` calls render(url) for each route
 * and injects the markup into the built index.html.
 *
 * Uses renderToPipeableStream + onAllReady so the React.lazy route chunks fully
 * resolve before we capture the HTML (a sync renderToString would emit the
 * Suspense fallback instead of the page content).
 *
 * Excluded from tsc (see tsconfig.app.json) because it imports node:stream;
 * Vite's esbuild transpiles it during the SSR build.
 */
export function render(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk))
        callback()
      },
    })
    sink.on('finish', () => resolve(Buffer.concat(chunks).toString('utf8')))
    sink.on('error', reject)

    const { pipe } = renderToPipeableStream(
      <LanguageProvider>
        <ThemeProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </ThemeProvider>
      </LanguageProvider>,
      {
        onAllReady() {
          pipe(sink)
        },
        onError(error) {
          reject(error)
        },
      },
    )
  })
}
