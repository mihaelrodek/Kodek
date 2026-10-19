// Post-build prerender: render each route to static HTML and inject it into the
// built index.html so crawlers and the first paint get real content (the app
// then hydrates on the client). Runs after the client + SSR Vite builds.
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dist = join(here, '..', 'dist')

// Croatian (default) lives at the root, English under /en. Each page has one
// entry per language; `alternates` ties them together for hreflang + sitemap.
// Paths must match src/i18n/routes.ts.
//
// Flat files (`o-meni.html`, `en/about.html`, `en.html`), not `x/index.html`, so
// Workers Static Assets serves the extensionless URL directly, without a
// trailing-slash redirect: served URL, canonical tag and sitemap.xml all agree.
//
// 404.html is served with a real 404 status for unknown URLs; the Worker swaps
// in en/404.html for unknown URLs under /en (worker/index.ts).
const PAGES = [
  {
    hr: {
      path: '/',
      file: 'index.html',
      title: 'Izrada web stranica i aplikacija po mjeri | Kodek',
      description:
        'Izrada web stranica i web aplikacija po mjeri, SEO optimizacija, cjenici sa sidrenim i baznim cijenama te održavanje. Varaždinska županija i cijela Hrvatska.',
    },
    en: {
      path: '/en',
      file: 'en.html',
      title: 'Custom websites and web apps in Croatia | Kodek',
      description:
        'Custom websites and web applications, SEO, price lists with anchor and base prices, and ongoing maintenance. Based in Varaždin County, serving all of Croatia.',
    },
  },
  {
    hr: {
      path: '/o-meni',
      crumb: 'O meni',
      file: 'o-meni.html',
      title: 'O meni: Mihael Rodek, programer i osnivač | Kodek',
      description:
        'Mihael Rodek, programer iz Kamenice kraj Lepoglave i osnivač Kodeka. Izrađuje web stranice i web aplikacije po mjeri, a s njim surađujete izravno.',
    },
    en: {
      path: '/en/about',
      crumb: 'About',
      file: 'en/about.html',
      title: 'About Mihael Rodek, developer and founder | Kodek',
      description:
        'Mihael Rodek is a software developer from Kamenica near Lepoglava, Croatia, and the founder of Kodek. He builds custom websites and web apps, end to end.',
    },
  },
  {
    hr: {
      path: '/projekti',
      crumb: 'Projekti',
      file: 'projekti.html',
      title: 'Projekti: web stranice i web aplikacije | Kodek',
      description:
        'Odabrani radovi: web stranice opg-repic.hr i pikadoklubsnajperi.hr te web aplikacije bela-turniri.com, futsal-turniri.com i bela.games, uz starije projekte.',
    },
    en: {
      path: '/en/projects',
      crumb: 'Work',
      file: 'en/projects.html',
      title: 'Projects: websites and web applications | Kodek',
      description:
        'Selected work: the opg-repic.hr and pikadoklubsnajperi.hr websites, the bela-turniri.com, futsal-turniri.com and bela.games web apps, and earlier projects.',
    },
  },
  {
    hr: {
      path: '/kontakt',
      crumb: 'Kontakt',
      file: 'kontakt.html',
      title: 'Zatražite ponudu za web stranicu ili aplikaciju | Kodek',
      description:
        'Opišite projekt: web stranicu, web aplikaciju, SEO ili cjenik sa sidrenim i baznim cijenama. Javit ću vam se s jasnom ponudom, cijenom i rokom izrade.',
    },
    en: {
      path: '/en/contact',
      crumb: 'Contact',
      file: 'en/contact.html',
      title: 'Request a quote for a website or web app | Kodek',
      description:
        'Tell me about your project: a website, web application, SEO or a price list with anchor and base prices. You get a clear quote with price and timeline.',
    },
  },
  {
    noindex: true,
    hr: {
      path: '/404',
      file: '404.html',
      title: 'Stranica nije pronađena | Kodek',
      description:
        'Ova stranica ne postoji ili je premještena. Vratite se na početnu i pogledajte usluge izrade web stranica i aplikacija, projekte ili kontakt za ponudu.',
    },
    en: {
      path: '/en/404',
      file: 'en/404.html',
      title: 'Page not found | Kodek',
      description:
        'This page does not exist or has moved. Head back to the home page to see website and web app services, selected projects, or get in touch for a quote.',
    },
  },
]

const LANGS = ['hr', 'en']
const DEFAULT_LANG = 'hr'
const OG_LOCALES = { hr: 'hr_HR', en: 'en_US' }
// public/og.png (English) and public/og-hr.png, both exported from their .svg at 1200x630.
const OG_IMAGES = {
  hr: {
    file: 'og-hr.png',
    alt: 'Logotip Kodek i natpis: Web stranice i aplikacije po vašoj mjeri.',
  },
  en: { file: 'og.png', alt: 'Kodek logo and the line: Websites and apps tailored to you.' },
}
const HOME_CRUMB = { hr: 'Kodek', en: 'Kodek' }

const ROUTES = PAGES.flatMap((page) =>
  LANGS.map((lang) => ({
    ...page[lang],
    lang,
    noindex: Boolean(page.noindex),
    isHome: page === PAGES[0],
    alternates: Object.fromEntries(LANGS.map((l) => [l, page[l].path])),
  })),
)

const { render, translations } = await import(
  pathToFileURL(join(dist, 'server', 'entry-server.js')).href
)
const template = await readFile(join(dist, 'index.html'), 'utf8')

// Preload the above-the-fold fonts (hashed filenames, so discovered from dist/assets).
// Fonts need `crossorigin` even when same-origin; CSP `font-src 'self'` already allows them.
const assetFiles = await readdir(join(dist, 'assets'))
const preloadFonts = ['ChakraPetch-Bold-latin-', 'geist-latin-wght-normal-']
  .map((prefix) => assetFiles.find((f) => f.startsWith(prefix) && f.endsWith('.woff2')))
  .filter(Boolean)
const fontPreloads = preloadFonts
  .map(
    (f) =>
      `    <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />\n`,
  )
  .join('')

const ROOT_DIV = '<div id="root"></div>'
if (!template.includes(ROOT_DIV)) {
  throw new Error(`prerender: "${ROOT_DIV}" not found in dist/index.html`)
}

// Site origin taken from the template's canonical tag, keeping canonical URLs
// and the generated sitemap aligned with the deployed Kodek domain.
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

const absolute = (path) => (path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`)

if (!/<html lang="[^"]*">/.test(template)) {
  throw new Error('prerender: <html lang="..."> not found in dist/index.html')
}

for (const route of ROUTES) {
  const appHtml = await render(route.path)
  if (appHtml.includes('<script') || appHtml.includes('<!--$?-->')) {
    throw new Error(`prerender: unfinished or scripted route markup for ${route.path}`)
  }
  const url = absolute(route.path)
  const otherLang = LANGS.find((l) => l !== route.lang)

  let html = template
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${route.lang}">`)
  html = set(html, /(<title>)[\s\S]*?(<\/title>)/, route.title)
  html = set(html, /(name="description"[\s\S]*?content=")[^"]*(")/, route.description)
  html = set(html, /(rel="canonical" href=")[^"]*(")/, url)
  html = set(html, /(property="og:title"[\s\S]*?content=")[^"]*(")/, route.title)
  html = set(html, /(property="og:description"[\s\S]*?content=")[^"]*(")/, route.description)
  html = set(html, /(property="og:url"[\s\S]*?content=")[^"]*(")/, url)
  html = set(html, /(property="og:locale" content=")[^"]*(")/, OG_LOCALES[route.lang])
  html = set(html, /(property="og:locale:alternate" content=")[^"]*(")/, OG_LOCALES[otherLang])
  html = set(html, /(name="twitter:title"[\s\S]*?content=")[^"]*(")/, route.title)
  html = set(html, /(name="twitter:description"[\s\S]*?content=")[^"]*(")/, route.description)
  const ogImage = OG_IMAGES[route.lang]
  html = set(html, /(property="og:image" content=")[^"]*(")/, `${siteUrl}/${ogImage.file}`)
  html = set(html, /(name="twitter:image" content=")[^"]*(")/, `${siteUrl}/${ogImage.file}`)
  html = set(html, /(property="og:image:alt" content=")[^"]*(")/, ogImage.alt)
  html = set(html, /(name="twitter:image:alt" content=")[^"]*(")/, ogImage.alt)
  if (route.noindex) {
    html = set(html, /(name="robots"[\s\S]*?content=")[^"]*(")/, 'noindex')
  }
  if (fontPreloads) {
    html = html.replace('  </head>', () => `${fontPreloads}  </head>`)
  }
  if (!route.noindex) {
    // Reciprocal hreflang for every language version, plus x-default (Croatian).
    const hreflang = [
      ...LANGS.map((l) => [l, route.alternates[l]]),
      ['x-default', route.alternates[DEFAULT_LANG]],
    ]
      .map(([l, path]) => `    <link rel="alternate" hreflang="${l}" href="${absolute(path)}" />\n`)
      .join('')
    html = html.replace('  </head>', () => `${hreflang}  </head>`)
  }
  if (route.isHome) {
    // FAQPage built from the same copy the landing FAQ renders, so the two never drift.
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: route.lang,
      mainEntity: translations[route.lang].landing.faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    }
    html = html.replace(
      '  </head>',
      () => `    <script type="application/ld+json">${JSON.stringify(faq)}</script>\n  </head>`,
    )
  }
  if (!route.isHome && !route.noindex) {
    // BreadcrumbList for inner pages (Home > Page). Data block: needs no CSP hash.
    const home = ROUTES.find((r) => r.isHome && r.lang === route.lang)
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: HOME_CRUMB[route.lang],
          item: absolute(home.path),
        },
        { '@type': 'ListItem', position: 2, name: route.crumb, item: url },
      ],
    }
    html = html.replace(
      '  </head>',
      () =>
        `    <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n  </head>`,
    )
  }
  html = html.replace(ROOT_DIV, () => `<div id="root">${appHtml}</div>`)

  await mkdir(dirname(join(dist, route.file)), { recursive: true })
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

// Sitemap: one entry per indexable route (skips `noindex` routes, e.g. 404),
// using the same site origin as the canonical tags above, a single lastmod
// (the build date) and xhtml:link alternates mirroring the hreflang tags.
const lastmod = new Date().toISOString().slice(0, 10)
const indexable = ROUTES.filter((route) => !route.noindex)
const sitemapUrls = indexable
  .map((route) => {
    const links = [
      ...LANGS.map((l) => [l, route.alternates[l]]),
      ['x-default', route.alternates[DEFAULT_LANG]],
    ]
      .map(
        ([l, path]) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${absolute(path)}" />`,
      )
      .join('\n')
    return `  <url>\n    <loc>${absolute(route.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${links}\n  </url>`
  })
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapUrls}\n</urlset>\n`
await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8')
console.log(`sitemap.xml -> ${indexable.length} url(s)`)

// The SSR bundle is a build artifact — don't ship it to the CDN.
await rm(join(dist, 'server'), { recursive: true, force: true })
console.log('prerender complete')
