# Kodek implementation handoff

The portfolio is now the Kodek business site. Existing uncommitted work was retained;
nothing was committed, pushed, or deployed.

## Delivered

- `/`: hero, four service cards, four-step process, three selected projects, technology cloud,
  founder teaser, keyboard-accessible FAQ, and final inquiry CTA.
- `/about`: the former personal hero, complete timeline, biography, CV, and skills.
- `/projects`: Work / Radovi, preserving filters, sorting, URL state, and project history.
- `/contact`: business inquiry copy using `mihael.rodek1@gmail.com`. The contact API contract
  and `functions/api/contact.ts` behavior were not changed by this task.
- Kodek wordmark, geometric K artwork, mobile Sheet navigation, legal business footer,
  English/Croatian copy, light/dark themes, self-hosted Geist, and reduced-motion behavior.
- Business SEO, canonical URLs, sitemap metadata, ProfessionalService JSON-LD with linked
  founder Person, manifest, favicon, and 1200×630 OG SVG.

The services use the owner's confirmed direction: custom web applications, small-business
websites, personal portfolios, and ongoing improvements. Existing projects are explicitly
identified as pre-Kodek open-source, educational, and university work. No testimonials,
client logos, business metrics, or client commissions were invented. Illustrations are
abstract SVG/CSS artwork, not purported project screenshots.

## Components and references

- shadcn/ui Radix Nova: Button, Card, Accordion, Sheet. Initialized with
  `npx shadcn@latest init --base radix --preset nova --no-monorepo --yes`, then added through
  the CLI. Tokens map to the blue brand palette. Focus rings, touch targets,
  translations, and accordion motion were adapted for the repository.
- The requested 21st.dev install for `kokonutd/background-paths` returned
  `Authentication required`. Instead, public MIT upstream Kokonut UI Background Paths,
  Shape Hero, and Bento Grid supplied the starting patterns. Random IDs, Next.js imports,
  remote fonts, stock copy, counters, and unused effects were removed. There was no
  successful authenticated 21st registry install.
- The stack is a static cloud (the brief's alternative to a marquee); the final CTA reuses
  the background and Button. No extra marquee/CTA package was installed.
- Mobbin was consulted as a layout/navigation reference only. Its public gallery exposed
  a limited shell; no assets or private examples were copied.
- See `THIRD_PARTY_NOTICES.md` for source links and full MIT notices.

## Prerender correction

The expanded landing exposed React's completed-Suspense chunk threshold: large boundaries
were emitted as hidden segments with inline reveal scripts. This delayed visible content,
shifted the footer, and conflicted with the existing CSP. The build now uses
`prerenderToNodeStream` with an explicit static chunk threshold and rejects pending
boundaries or injected scripts. Client/server provider order matches. No CSP relaxation
was needed. Browser tests serve the generated CSP and verify readable route headings with
JavaScript disabled, alongside normal hydration and stored Croatian/dark preferences.

## Performance and visual review

Lighthouse 13.5.0, default mobile simulated throttling, local gzip-compressed production
build preview: Performance **95**, Accessibility **100**, Best Practices **100**, SEO **100**.
FCP **2.2 s**, LCP **2.5 s**, Speed Index **2.2 s**; TBT **0 ms**; CLS **0.001**.
An earlier run scored 98 for performance; the figures above are the final-build run. This measures a local
production preview with compression representative of hosting, not the deployed domain.
The deliberately uncompressed e2e fixture is not the performance benchmark.

Desktop and phone layouts were visually inspected in both themes; 320px and 360px layouts
were additionally checked in both languages. Interactive tests cover navigation, CTAs,
FAQ keyboard operation, mobile focus restoration, and existing project filters.
A final axe-core WCAG 2 A/AA scan reported zero violations on all four main routes in
both light and dark themes. Muted text in the retained timeline, form, and filters was
adjusted to pass contrast checks.

## Verification

| Check                  | Result                                              |
| ---------------------- | --------------------------------------------------- |
| `npm run lint`         | Passed                                              |
| `npm run format:check` | Passed                                              |
| `npm run typecheck`    | Passed                                              |
| `npm test`             | 54 passed across 5 files                            |
| `npm run build`        | 5 routes prerendered; 4 sitemap URLs; CSP generated |
| `npm run test:e2e`     | 56 passed, 4 expected viewport-specific skips       |
| `git diff --check`     | Passed                                              |

The full browser suite exposed stale filter state after a rapid mobile Back navigation
with a focused search input. BrowserRouter now commits navigation synchronously
(`useTransitions={false}`); lazy route splitting and Suspense remain. The existing
back/forward regression test passes with the rest of the suite and in 10 additional
concurrent mobile repetitions.

## Owner follow-up

- Export `public/og.png` from `public/og.svg` at **1200×630**. Metadata already references it.
- Regenerate `public/icon-192.png`, `public/icon-512.png`, and `public/apple-touch-icon.png`
  from the new `public/favicon.svg` before release.
- Existing owner TODOs remain in `src/data/timeline.ts`: confirm the approximate birth,
  school, and other dates; provide real timeline photos if desired.
- Existing owner TODO in `src/data/projects.ts`: add personal/startup or future Kodek work
  when factual descriptions and publishable assets are available.
- No email/service placeholders remain. The founder portrait uses initials intentionally;
  a real portrait is optional. Phone is omitted as the brief allows.
- Contact delivery still uses the existing Cloudflare Pages/Web3Forms configuration.
  Validation uses the automated API/form tests; no live inquiry was sent.
