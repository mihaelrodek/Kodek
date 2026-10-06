# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Vite dev server on http://localhost:5174 (strictPort — fails if taken)
npm run build         # tsc -b + client build + SSR build + prerender → dist/
npm run preview       # serve dist/ (static only, no Pages Function)
npm run lint          # eslint .
npm run lint:fix
npm run format        # prettier on src/, functions/, scripts/
npm run format:check
```

### Testing

```bash
npm test              # Vitest, jsdom, tests/unit/
npm run test:watch    # Vitest in watch mode
npm run test:e2e      # Playwright chromium + iPhone 13 emulation; builds dist/ if missing
                      # and serves it via tests/e2e/static-server.mjs with
                      # Cloudflare-Pages-like routing (vite preview's SPA fallback would
                      # mask the 404 page and cause a hydration mismatch)
npm run typecheck     # tsc -b (now covers tests via tsconfig.test.json)
```

The e2e smoke test fails on any console message matching hydration signatures including
minified React error #418/#421/#422/#423/#425, so hydration-unsafe changes are caught there.

Type-checking is `tsc -b` over four project references: `tsconfig.app.json` (src/, excludes
`entry-server.tsx`), `tsconfig.functions.json` (functions/, WebWorker lib), `tsconfig.node.json`
(vite.config.ts), and `tsconfig.test.json` (tests/).

To exercise the contact-form Pages Function locally (plain `vite dev` does not serve `/functions`,
so `/api/contact` 404s there):

```bash
cp .env.example .env.local   # set WEB3FORMS_ACCESS_KEY
npm run build && npx wrangler pages dev dist
```

## Architecture

React 19 + TypeScript + Vite 8 + Tailwind v4 + React Router v7 + Framer Motion. Deployed to
Cloudflare Pages (build output `dist`, Node 22). `@/` aliases `src/`.

### Build-time prerender + hydration (the non-obvious part)

`npm run build` is a three-stage pipeline:

1. `vite build` — client bundle into `dist/`.
2. `vite build --ssr src/entry-server.tsx --outDir dist/server` — SSR bundle. `entry-server.tsx`
   uses `prerenderToNodeStream` from `react-dom/static` so `React.lazy` route chunks resolve
   before capturing HTML. The build rejects pending Suspense markers or injected scripts.
3. `node scripts/prerender.mjs` — imports `dist/server/entry-server.js`, renders each route in its
   `ROUTES` table, injects markup into `#root` of the built `index.html`, writes flat files
   (`index.html`, `about.html`, `projects.html`, `contact.html`, `404.html`) with per-route
   `<title>`/description/canonical/OG/Twitter meta, computes sha256 CSP hashes for inline scripts
   and substitutes `__CSP_SCRIPT_HASHES__` in `dist/_headers`, then deletes `dist/server`.

`src/main.tsx` calls `hydrateRoot` when `#root` has children (production) and `createRoot`
otherwise (dev). Consequences for any change:

- **Adding a route** means touching `src/App.tsx` (lazy route) and `scripts/prerender.mjs`
  (`ROUTES` entry with Kodek-framed title/description).
- **First render must be hydration-safe.** Nothing in the initial render may depend on
  `localStorage`, `navigator`, `matchMedia`, or the theme/language state. `LanguageProvider`
  always boots in `'en'` and adopts the stored/browser language in a post-mount effect for
  exactly this reason. `ThemeProvider` reads the `dark` class the inline `index.html` script
  already applied (it does not re-derive from storage). Markup that differs by theme (e.g. a
  toggle label) breaks hydration — keep it theme-neutral.
- `prerender.mjs` throws if `index.html` loses the `<div id="root"></div>`, the canonical link,
  any meta tag it rewrites, or the inline `<script>`; keep that structure intact when editing
  `index.html`.
- `entry-server.tsx` uses the Node-only React static API and is excluded from `tsc`; do not
  import it from app code.

`BrowserRouter` uses `useTransitions={false}` so Back/Forward commits promptly even with
an active mobile search field. Keep route-level lazy loading and Suspense in place.

### Theme

Class-based dark mode (`dark` on `<html>`, `@custom-variant dark` in `src/index.css`). Dark is the
default: the inline script adds `dark` unless the stored value is `light`. Storage key
`portfolio-theme` is shared between the inline bootstrap script in `index.html` and
`ThemeContext.tsx` — change both together.

### Brand

The Kodek identity lives in `export/` (source package: `README.md`, `tokens.json`, SVG/PNG
logos, favicons, Chakra Petch font). Applied in the app as:

- Colours: `--color-accent-*` under `@theme` in `src/index.css` is a blue scale built around the
  brand blue `#4264e3` (500) and navy `#15318f` (800); `--color-brand-*` holds the raw tokens
  (navy, blue, ink `#201e1d`, paper `#f3f2f2`). Light mode uses paper/ink as background/foreground.
- Mark: `src/components/KodekMark.tsx` inlines `export/svg/kodek-mark-blue.svg`. Never round,
  shadow, stretch or recolour it. `Brand.tsx` renders mark + `odek_` wordmark (mark only below
  480px). `public/brand/` holds the SVG files for external use (JSON-LD `logo`).
- Font: Chakra Petch Bold (SIL OFL, `src/assets/fonts/`) is `--font-heading`, applied to
  `h1`–`h3`, the logo and the hero wordmark. Body text stays Geist.
- Favicons/icons in `public/` and `public/og.png` come from the package; `og.svg` is the editable
  source for the OG image (re-export at 1200×630 with Chakra Petch available).

### i18n

Two languages, `en`/`hr`. UI strings live in `src/i18n/translations.ts` (typed from the `en`
object). Content data in `src/data/*.ts` carries optional `*Hr` sibling fields; components
resolve with `localized(lang, en, hr)` falling back to English. Project category labels in
translations (`t.projects.categories`) must stay in sync with `ProjectCategory` in
`src/data/projects.ts`. Storage key `portfolio-lang`; only explicit toggle clicks persist.

### Contact form / Pages Function

`functions/api/contact.ts` is the only server code. It holds `WEB3FORMS_ACCESS_KEY` (no `VITE_`
prefix — never expose it client-side), re-validates input with length caps, honors a honeypot
field, applies a best-effort per-isolate rate limit, then forwards to Web3Forms. The client posts
to `/api/contact`.

### Security headers / CSP

`public/_headers` sets CSP with `script-src 'self' __CSP_SCRIPT_HASHES__` (filled at build).
Adding any third-party script or iframe (e.g. Turnstile) requires extending `script-src` /
`frame-src` there. `connect-src 'self'` — external fetches from the browser are blocked.

### PWA manifest

`public/manifest.webmanifest` declares the app for PWA installs. Icon PNGs (`icon-192.png`,
`icon-512.png`, `apple-touch-icon.png`) and `favicon.ico` come from the brand package
(`export/favicon/`) and are cached 1 day via `public/_headers`.

### Shared styles and motion

The shared `.focus-ring` utility in `src/index.css` should be used for any new interactive
element. `<MotionConfig reducedMotion="user">` wraps the app in both `src/main.tsx` and
`src/entry-server.tsx`; keep provider order identical in both.

### Kodek routes and business content

`/` is the Kodek business landing page; `/about` is Mihael Rodek's founder profile (`AboutPage.tsx`,
content from `src/data/founder.ts`, which reads `timeline.ts`); `/projects`
is selected work; and `/contact` is the business enquiry form. Existing project records predate
Kodek unless their content explicitly establishes otherwise. Do not turn prior work into a client
claim, testimonial, or business metric.

`src/pages/AboutTimelinePage.tsx` is the former personal life timeline. It is deliberately not
routed; keep it compiling but do not link to it publicly.

`index.html` contains a `ProfessionalService` JSON-LD entity for Kodek and a separate, linked
`Person` entity for founder Mihael Rodek. Preserve their stable IDs and the founder's `/about`
reference when changing structured data.

### Deploy assets

`https://kodek.hr` is the canonical origin in `index.html` and `public/robots.txt`.
`prerender.mjs` reads that origin from the canonical tag and writes `dist/sitemap.xml` from its
`ROUTES` table. `public/og.png` is exported from `public/og.svg` at 1200×630; the app icons are
copied from the brand package, not generated. `public/cv.pdf` is generated
from `scripts/cv.html` via headless Chrome (see README).

## CI

`.github/workflows/ci.yml` runs on every push and PR. The job runs lint, format:check,
typecheck, unit tests, build, and e2e.

## Conventions

- Prettier: no semicolons, single quotes, trailing commas, printWidth 100, Tailwind class
  sorting plugin. Run `npm run format` before committing.
- ESLint: `react-hooks` and `react-refresh` rules on. Context files export both a provider and
  the context object, so they carry `// eslint-disable-next-line react-refresh/only-export-components`.
- Unused vars prefixed `_` are allowed.
