/**
 * Static server for the e2e run.
 *
 * `vite preview` cannot be used here: its SPA fallback answers every unknown
 * URL with the prerendered *home* page, which both hides the 404 page and
 * causes a hydration mismatch (the router renders NotFound over home markup).
 * This server mimics how Cloudflare Workers Static Assets serves the build
 * (worker/index.ts + wrangler.jsonc) instead:
 *
 *   /            -> index.html
 *   /about       -> about.html          (extensionless lookup)
 *   /unknown     -> 404.html, HTTP 404
 *
 * Builds dist/ first when it is missing, so `npm run test:e2e` works from a
 * clean checkout.
 */
import { createServer } from 'node:http'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const dist = join(root, 'dist')
const port = Number(process.env.PORT ?? 4173)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

if (!existsSync(join(dist, 'index.html'))) {
  console.log('[e2e] dist/ is missing — running `npm run build`…')
  const built = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: false })
  if (built.status !== 0) {
    console.error('[e2e] build failed')
    process.exit(built.status ?? 1)
  }
}

function isFile(path) {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

/** Resolve a URL pathname to a file inside dist/, or null. */
function resolveFile(pathname) {
  let decoded
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return null
  }
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const target = join(dist, clean)
  // Path traversal guard.
  if (target !== dist && !target.startsWith(dist + sep)) return null

  if (clean === '/' || clean === '') return join(dist, 'index.html')
  if (isFile(target)) return target
  if (isFile(`${target}.html`)) return `${target}.html`
  if (isFile(join(target, 'index.html'))) return join(target, 'index.html')
  return null
}

const server = createServer((req, res) => {
  // Exercise the actual build's CSP, including its theme-script hash. Otherwise
  // blocked inline reveal scripts could pass local tests and fail in production.
  const policy = readFileSync(join(dist, '_headers'), 'utf8').match(
    /^\s+Content-Security-Policy: (.+)$/m,
  )?.[1]
  if (policy) res.setHeader('Content-Security-Policy', policy)
  const pathname = new URL(req.url ?? '/', `http://localhost:${port}`).pathname
  const file = resolveFile(pathname)

  if (!file) {
    const notFound = join(dist, '404.html')
    const body = isFile(notFound) ? readFileSync(notFound) : Buffer.from('Not found')
    res.writeHead(404, { 'Content-Type': MIME['.html'] })
    res.end(body)
    return
  }

  res.writeHead(200, {
    'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  res.end(readFileSync(file))
})

server.listen(port, () => {
  console.log(`[e2e] serving ${dist} on http://localhost:${port}`)
})
