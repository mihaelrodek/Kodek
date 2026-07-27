# Mihael Rodek — Portfolio

Personal portfolio site. React 19 + TypeScript + Vite, styled with Tailwind CSS v4, animated
with Framer Motion. Deployed to Cloudflare Pages.

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7** (multi-page setup, scrollable sections within each route)
- **Framer Motion** for transitions
- **ESLint** + **Prettier** (with `prettier-plugin-tailwindcss`)
- Class-based **dark mode** with `localStorage` persistence and system-preference fallback

## Getting started

```bash
npm install
npm run dev      # start dev server on http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
npm run lint     # run eslint
npm run format   # run prettier on src/, functions/ and scripts/
```

## Project structure

```
functions/
  api/contact.ts       Cloudflare Pages Function — contact form proxy
scripts/
  prerender.mjs        post-build prerender (static HTML + per-route meta + CSP hashes)
  cv.html              CV source — regenerates public/cv.pdf (see "CV" below)
src/
  components/          reusable UI (Navbar, Footer, ThemeToggle, Timeline, ...)
  contexts/            React contexts (ThemeContext, LanguageContext)
  data/                content data (timeline events, projects)
  hooks/               custom hooks (useTheme, useTranslation, useMatchMedia)
  i18n/                translations (en/hr)
  layouts/             route layouts (RootLayout)
  pages/               route components (Home, About, Projects, Contact, NotFound)
  App.tsx              routes (lazy-loaded per page)
  main.tsx             entry — hydrates prerendered HTML (or mounts fresh in dev)
  entry-server.tsx     SSR entry used by the build-time prerender
  index.css            Tailwind import + base/component layers + theme tokens
```

The `@/` import alias resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Contact form

The `/contact` page posts to a **Cloudflare Pages Function** (`functions/api/contact.ts`), which
holds the [Web3Forms](https://web3forms.com) access key server-side and forwards the message to my
email. The key never ships in the client bundle. To wire it up:

1. Go to https://web3forms.com, enter `mihael.rodek1@gmail.com`, confirm via the email Web3Forms
   sends, and copy the access key.
2. In production: add `WEB3FORMS_ACCESS_KEY` (no `VITE_` prefix) to the Cloudflare Pages project
   environment variables (Settings → Environment variables, mark it encrypted), then redeploy.
3. Locally: `cp .env.example .env.local`, paste the key, then run the Function with
   `npm run build && npx wrangler pages dev dist`. Plain `vite dev` does not serve `/functions`,
   so `/api/contact` returns 404 under it.

Validation runs on both sides: the client checks before submit, and the Function re-validates
(including length caps), honors a honeypot field, applies a best-effort per-IP rate limit
(5 requests / 10 min, per isolate), and only then calls Web3Forms.

The in-Function rate limit is friction, not a guarantee (isolate state is not shared across
Cloudflare locations). For a hard limit, add a WAF rate-limiting rule on `/api/contact` in the
Cloudflare dashboard, or wire in [Turnstile](https://developers.cloudflare.com/turnstile/) — if you
do, extend `script-src` and `frame-src` in `public/_headers` with `https://challenges.cloudflare.com`.

## CV

`public/cv.pdf` is generated from `scripts/cv.html` (content pulled from the timeline/projects
data). The About and Contact pages link to it. After editing the HTML, regenerate with headless
Chrome (or Edge — swap the exe path):

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="public\cv.pdf" "scripts\cv.html"
```

Review the PDF before sharing — it's a generated draft, not a hand-tuned document.

## Localization

UI strings live in `src/i18n/translations.ts` (en/hr). Content data (timeline, projects) carries
optional `*Hr` fields next to each English field; components resolve them with `localized(lang,
en, hr)` and fall back to English when a translation is missing. The first render is always
English (it must match the prerendered HTML — see `LanguageContext`), and the stored/browser
language applies right after mount.

## Theming

Dark mode is class-based — toggling the `dark` class on `<html>` flips the theme. The
`ThemeProvider` reads from `localStorage` first, falling back to the user's
`prefers-color-scheme` setting. Use `useTheme()` to read or change the theme from any component.

Brand color tokens live in `src/index.css` under `@theme` as `--color-accent-*`. Adjust those
values to retheme the whole site.

## Deployment (Cloudflare Pages)

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 22 (set via `NODE_VERSION=22` environment variable)

The build prerenders every route to static HTML (`index.html`, `about.html`, `projects.html`,
`contact.html`) plus a real `404.html`, so direct navigation works without a SPA fallback and
unknown URLs return an actual 404 status. The app hydrates on load and continues as a SPA.

Custom domain: point your `.from.hr` domain at the Pages project in the Cloudflare dashboard.

## SEO & indexing

- Each prerendered route gets its own `title`, `description`, `canonical`, and Open Graph/Twitter
  meta (injected by `scripts/prerender.mjs`).
- `index.html` embeds JSON-LD (`schema.org/Person`) structured data — update it if your role or
  links change.
- `public/robots.txt` allows all crawlers and points to the sitemap.
- `public/sitemap.xml` lists all four routes.
- `public/_headers` sets long-lived immutable caching for content-hashed `/assets/*`, security
  headers (CSP, HSTS, nosniff, frame denial), and the CSP hash for the inline theme script is
  computed automatically at build time.

**Before deploy — replace the placeholder URL.** Find-and-replace every `__SITE_URL__` with your real
origin (no trailing slash), e.g. `https://mihaelrodek.from.hr`. It appears in `index.html`,
`public/robots.txt`, and `public/sitemap.xml`.

**Social preview image.** `public/og.svg` is the 1200×630 card design. Social crawlers (Facebook,
LinkedIn, X) need a raster image, so export it to `public/og.png` once:

```bash
npx svgexport public/og.svg public/og.png 1200:630
```

(or open `og.svg` in Figma/Inkscape and export at 1200×630). The meta tags already reference `/og.png`.
