# SEO plan

Status of what is implemented in the repo, plus a prioritised checklist of items that need the
owner or an external service.

## Implemented in the repo

- Per-route `<title>`, description, canonical, `og:*`, `twitter:*` injected by `scripts/prerender.mjs`
  (`PAGES`). Titles are `<topic> | Kodek` (max 60 chars, no em dashes); descriptions 140-158 chars,
  front-loading the services (izrada web stranica, web aplikacije, SEO, cjenici sa sidrenim i baznim
  cijenama, održavanje); the home page adds the local signal (Varaždinska županija, cijela Hrvatska).
  `index.html` defaults equal the Croatian home page.
- `og:image` 1200x630 per language (`og-hr.png` / `og.png`, exported from `og-hr.svg` / `og.svg`
  with the hero line "Web stranice i aplikacije po vašoj mjeri." / "Websites and apps tailored to
  you."), `og:image:alt` + `twitter:image:alt` describe the image per language, `og:locale` per
  language (`hr_HR` / `en_US`) + alternate.
- `robots`: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
  (404 pages: `noindex`). `format-detection telephone=yes`. Geo: `geo.region` HR-05,
  `geo.placename` Kamenica, `geo.position` / `ICBM` 46.244;16.034 (village coordinates from
  Wikipedia, not the exact address). No `keywords` meta (ignored by Google).
- JSON-LD in `index.html` `@graph`: `ProfessionalService` (`#business`, address with region,
  `telephone`, `areaServed` Croatia + Varaždinska županija, `sameAs` GitHub/LinkedIn,
  `knowsLanguage` hr/en, `hasOfferCatalog` with the six services as `Offer` > `Service` in
  Croatian, `founder` > Person),
  `WebSite` (`#website`, `inLanguage` hr/en), `Person` (`about#mihael-rodek`). Stable IDs kept.
- `BreadcrumbList` JSON-LD per inner route (injected at prerender).
- Preload of Chakra Petch Bold and Geist latin woff2 (hashed names discovered at prerender).
- `robots.txt` allows all and points to `https://kodek.hr/sitemap.xml`; `sitemap.xml` is generated
  from `ROUTES` (absolute canonical URLs, `lastmod`, no 404). Security headers/CSP unchanged.
- Heading hierarchy: one `h1` per route; images have dimensions where above the fold, `loading="lazy"` below.

## Bilingual URLs (hreflang)

Croatian is the default at the root (`/`, `/o-meni`, `/projekti`, `/kontakt`), English lives under
`/en` (`/en`, `/en/about`, `/en/projects`, `/en/contact`). Every page is prerendered in its own
language with `<html lang>`, `og:locale`, reciprocal `hreflang` links (`hr`, `en`,
`x-default` = Croatian) and matching `xhtml:link` alternates in `sitemap.xml`. The pre-i18n English
URLs (`/about`, `/projects`, `/contact`) 301 to the Croatian pages in the Worker.

## Prioritised checklist

### P0 (owner decisions / external)
- [ ] Verify kodek.hr in Google Search Console, submit `https://kodek.hr/sitemap.xml`.
- [ ] Verify in Bing Webmaster Tools (can import from GSC).
- [ ] Create / claim Google Business Profile (service-area business; needs verification).
- [ ] Research HR keywords (e.g. izrada web stranica, web aplikacije po mjeri, sidrene cijene cjenik)
      and decide which pages target them.

### P1
- [ ] Backlinks: Croatian business directories, GitHub/LinkedIn profile links to kodek.hr, project sites.
- [ ] Publish 2-3 case studies (only with real, approved client content; no invented metrics).
- [ ] Add a blog/insights section (Croatian + English) once a content plan exists.
- [ ] Confirm legal/business data in JSON-LD (address, taxID, email) is what should be public.

### P2
- [ ] Run PageSpeed Insights / Lighthouse after deploy; check LCP on `/`.
- [x] FAQPage JSON-LD on both home pages (from `t.landing.faqs`, emitted by prerender).
- [ ] Re-export `og.png` if the brand changes; add per-route OG images if desired.
- [ ] Monitor Search Console coverage and Core Web Vitals monthly.
