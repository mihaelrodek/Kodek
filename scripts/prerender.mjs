// Post-build prerender: render each route to static HTML and inject it into the
// built index.html so crawlers and the first paint get real content (the app
// then hydrates on the client). Runs after the client + SSR Vite builds.
import { createHash } from 'node:crypto'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dist = join(here, '..', 'dist')

// Flat `about.html` files (not `about/index.html`) so Cloudflare Pages serves
// the extensionless URL (/about) directly, without a trailing-slash redirect —
// served URL, canonical tag, and sitemap.xml all agree.
//
// 404.html is picked up by Pages and served with a real 404 status for unknown
// URLs (its presence replaces the SPA catch-all fallback, which the prerendered
// routes no longer need).
const ROUTES = [
  {
    path: '/',
    file: 'index.html',
    title: 'Mihael Rodek — Portfolio',
    description:
      'Mihael Rodek — software developer. Java & Go backend, React & TypeScript frontend. Full-stack work across banking and public-sector projects.',
  },
  {
    path: '/about',
    file: 'about.html',
    title: 'About — Mihael Rodek',
    description:
      'Who I am — software developer from Croatia. Java & Go backend, React & TypeScript frontend.',
  },
  {
    path: '/projects',
    file: 'projects.html',
    title: 'Projects — Mihael Rodek',
    description:
      'Selected projects by Mihael Rodek — open source, Android, backend, IoT, and academic work.',
  },
  {
    path: '/contact',
    file: 'contact.html',
    title: 'Contact — Mihael Rodek',
    description: 'Get in touch with Mihael Rodek — email, GitHub, LinkedIn, or the contact form.',
  },
  {
    path: '/404',
    file: '404.html',
    title: 'Page not found — Mihael Rodek',
    description: 'This page does not exist.',
    noindex: true,
  },
]

const { render } = await import(pathToFileURL(join(dist, 'server', 'entry-server.js')).href)
const template = await readFile(join(dist, 'index.html'), 'utf8')

const ROOT_DIV = '<div id="root"></div>'
if (!template.includes(ROOT_DIV)) {
  throw new Error(`prerender: "${ROOT_DIV}" not found in dist/index.html`)
}

// Site origin taken from the template's canonical tag — works both before and
// after the __SITE_URL__ placeholder is replaced with the real domain.
const canonicalMatch = template.match(/rel="canonical" href="(.+?)\/?"/)
if (!canonicalMatch) {
  throw new Error('prerender: canonical link not found in dist/index.html')
}
const siteUrl = canonicalMatch[1]

/**
 * Replace the text between a tag pattern's two capture groups. Uses a replacer
 * function so `$` sequences in the value are inserted literally, and throws if
 * the pattern is missing (fail loudly when index.html gets restructured).
 */
function set(html, pattern, value) {
  if (!pattern.test(html)) {
    throw new Error(`prerender: no match for ${pattern} in dist/index.html`)
  }
  return html.replace(pattern, (_match, pre, post) => `${pre}${value}${post}`)
}

for (const route of ROUTES) {
  const appHtml = await render(route.path)
  const url = route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`

  let html = template
  html = set(html, /(<title>)[\s\S]*?(<\/title>)/, route.title)
  html = set(html, /(name="description"[\s\S]*?content=")[^"]*(")/, route.description)
  html = set(html, /(rel="canonical" href=")[^"]*(")/, url)
  html = set(html, /(property="og:title"[\s\S]*?content=")[^"]*(")/, route.title)
  html = set(html, /(property="og:description"[\s\S]*?content=")[^"]*(")/, route.description)
  html = set(html, /(property="og:url"[\s\S]*?content=")[^"]*(")/, url)
  html = set(html, /(name="twitter:title"[\s\S]*?content=")[^"]*(")/, route.title)
  html = set(html, /(name="twitter:description"[\s\S]*?content=")[^"]*(")/, route.description)
  if (route.noindex) {
    html = set(html, /(name="robots"[\s\S]*?content=")[^"]*(")/, 'noindex')
  }
  html = html.replace(ROOT_DIV, () => `<div id="root">${appHtml}</div>`)

  await writeFile(join(dist, route.file), html, 'utf8')
  console.log(`prerendered ${route.path} -> ${route.file}`)
}

// CSP: hash the inline <script>s (the theme bootstrap) from the *built* HTML —
// hashing the built output stays correct even if the build pipeline ever
// rewrites the script — and fill the placeholder in _headers.
const inlineScripts = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])
if (inlineScripts.length === 0) {
  throw new Error('prerender: no inline <script> found in dist/index.html for CSP hashing')
}
const scriptHashes = inlineScripts
  .map((s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`)
  .join(' ')

const headersPath = join(dist, '_headers')
const headersFile = await readFile(headersPath, 'utf8')
if (!headersFile.includes('__CSP_SCRIPT_HASHES__')) {
  throw new Error('prerender: __CSP_SCRIPT_HASHES__ placeholder not found in dist/_headers')
}
await writeFile(headersPath, headersFile.replaceAll('__CSP_SCRIPT_HASHES__', scriptHashes), 'utf8')
console.log(`CSP hashes for ${inlineScripts.length} inline script(s) -> _headers`)

// The SSR bundle is a build artifact — don't ship it to the CDN.
await rm(join(dist, 'server'), { recursive: true, force: true })
console.log('prerender complete')
