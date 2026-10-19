import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import {
  PROJECT_CATEGORY_ORDER,
  projects,
  type Project,
  type ProjectCategory,
} from '../data/projects'
import ProjectCard, { type CardSpan } from '../components/projects/ProjectCard'
import { useTranslation } from '../hooks/useTranslation'

type Filter = 'all' | ProjectCategory
type SortMode = 'recent' | 'oldest' | 'alpha'

interface FilterState {
  filter: Filter
  query: string
  sort: SortMode
}

// Static data — count once at module scope instead of on every render.
const CATEGORY_COUNTS = projects.reduce(
  (map, p) => map.set(p.category, (map.get(p.category) ?? 0) + 1),
  new Map<ProjectCategory, number>(),
)
// Display order comes from the data module, not from record insertion order.
const AVAILABLE_CATEGORIES = PROJECT_CATEGORY_ORDER.filter((cat) => CATEGORY_COUNTS.has(cat))

/** Query-param names. Short because they end up in shared links. */
const PARAM_CATEGORY = 'c'
const PARAM_QUERY = 'q'
const PARAM_SORT = 'sort'

const SORT_MODES: readonly SortMode[] = ['recent', 'oldest', 'alpha']

/** Values that are left out of the URL entirely. */
const DEFAULT_STATE: FilterState = { filter: 'all', query: '', sort: 'recent' }

function isFilter(value: string | null): value is Filter {
  return value === 'all' || AVAILABLE_CATEGORIES.some((cat) => cat === value)
}

function isSortMode(value: string | null): value is SortMode {
  return SORT_MODES.some((mode) => mode === value)
}

/** URL → state. Anything unrecognised silently falls back to the default. */
function parseParams(params: URLSearchParams): FilterState {
  const category = params.get(PARAM_CATEGORY)
  const sort = params.get(PARAM_SORT)
  return {
    filter: isFilter(category) ? category : DEFAULT_STATE.filter,
    query: params.get(PARAM_QUERY) ?? DEFAULT_STATE.query,
    sort: isSortMode(sort) ? sort : DEFAULT_STATE.sort,
  }
}

/**
 * State → URL, preserving any params this page does not own. Defaults are
 * deleted rather than written, so the canonical URL for an unfiltered page is
 * a bare `/projects` — and feeding `parseParams` output back through here is
 * what scrubs invalid values out of the address bar.
 */
function toSearchParams(current: URLSearchParams, state: FilterState): URLSearchParams {
  const next = new URLSearchParams(current)
  const write = (key: string, value: string, fallback: string) => {
    if (value === fallback) next.delete(key)
    else next.set(key, value)
  }
  write(PARAM_CATEGORY, state.filter, DEFAULT_STATE.filter)
  write(PARAM_QUERY, state.query, DEFAULT_STATE.query)
  write(PARAM_SORT, state.sort, DEFAULT_STATE.sort)
  return next
}

function sameState(a: FilterState, b: FilterState): boolean {
  return a.filter === b.filter && a.query === b.query && a.sort === b.sort
}

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  // Hydration contract (same shape as LanguageProvider): the prerendered
  // /projects HTML is produced by StaticRouter at a bare `/projects` with no
  // query string, so the FIRST client render must look exactly like the
  // defaults no matter what the address bar says. Hence local state — not
  // `searchParams` — is the source of truth the markup reads from, and it
  // boots at DEFAULT_STATE; the effect below adopts the URL after mount.
  const [state, setState] = useState<FilterState>(DEFAULT_STATE)
  const { filter, query, sort } = state

  // Runs on mount (deep links) and on every later `searchParams` change, which
  // is what makes back/forward restore state: the URL is the history record,
  // local state is the working copy. Writes go the other way (state first,
  // then the URL), and since `parseParams`/`toSearchParams` round-trip, this
  // effect is a no-op for changes the page itself made — no feedback loop and
  // no navigation latency in the controlled search input.
  useEffect(() => {
    const parsed = parseParams(searchParams)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((current) => (sameState(current, parsed) ? current : parsed))

    // Drop unknown/default values (`?sort=bogus`, `?c=nope`, `?q=`) from the
    // URL. `replace` so a bad link does not leave a junk history entry.
    const canonical = toSearchParams(searchParams, parsed)
    if (canonical.toString() !== searchParams.toString()) {
      setSearchParams(canonical, { replace: true })
    }
  }, [searchParams, setSearchParams])

  /**
   * State first, URL second. `replace` is for keystrokes — one history entry
   * per typed character would make the back button useless.
   */
  function apply(patch: Partial<FilterState>, options?: { replace?: boolean }) {
    const next = { ...state, ...patch }
    setState(next)
    setSearchParams(toSearchParams(searchParams, next), { replace: options?.replace ?? false })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects
      .filter((p) => (filter === 'all' ? true : p.category === filter))
      .filter((p) => {
        if (!q) return true
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.descriptionHr?.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          p.tagsHr?.some((tag) => tag.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (sort === 'alpha') return a.title.localeCompare(b.title)
        // Keep projects without a confirmed year after dated work in either direction.
        if (a.sortYear === undefined) return b.sortYear === undefined ? 0 : 1
        if (b.sortYear === undefined) return -1
        if (sort === 'oldest') return a.sortYear - b.sortYear
        return b.sortYear - a.sortYear
      })
  }, [filter, query, sort])

  const totalCount = projects.length
  const matchCount = filtered.length
  // The default view (no category, no query) is grouped by category; any
  // active filter collapses it into one flat grid. This is also the
  // prerendered shape, so the first client render stays grouped.
  const grouped = filter === 'all' && !query
  const isFiltering = filter !== 'all' || query !== ''

  const groups = useMemo(
    () =>
      AVAILABLE_CATEGORIES.map((category) => ({
        category,
        items: filtered.filter((p) => p.category === category),
      })).filter((group) => group.items.length > 0),
    [filtered],
  )

  return (
    <section className="container-page py-10 md:py-14">
      <h1 className="sr-only">{t.projects.eyebrow}</h1>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label={t.projects.all}
            active={filter === 'all'}
            onClick={() => apply({ filter: 'all' })}
            count={totalCount}
          />
          {AVAILABLE_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              label={t.projects.categories[cat]}
              active={filter === cat}
              onClick={() => apply({ filter: cat })}
              count={CATEGORY_COUNTS.get(cat) ?? 0}
            />
          ))}
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                // Sort is deliberately untouched: it is a view preference,
                // not a filter, so `?sort=` survives a clear.
                apply({ filter: 'all', query: '' })
              }}
              className="focus-ring text-accent-600 dark:text-accent-400 ml-1 min-h-9 rounded px-2 text-xs font-medium underline-offset-4 hover:underline"
            >
              {t.projects.clear}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => apply({ query: e.target.value }, { replace: true })}
              placeholder={t.projects.searchPlaceholder}
              aria-label={t.projects.searchAria}
              className="focus:border-accent-500 focus:ring-accent-500/20 min-h-10 w-full rounded-full border border-zinc-300 bg-transparent py-2 pr-4 pl-9 text-sm transition outline-none placeholder:text-zinc-500 focus:ring-2 sm:w-64 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400"
            />
          </div>

          <label className="sr-only" htmlFor="sort">
            {t.projects.sortAria}
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sort}
              onChange={(e) => apply({ sort: e.target.value as SortMode })}
              className="focus:border-accent-500 focus:ring-accent-500/20 min-h-10 w-full cursor-pointer appearance-none rounded-full border border-zinc-300 bg-transparent py-2 pr-10 pl-4 text-sm transition outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="recent">{t.projects.sortRecent}</option>
              <option value="oldest">{t.projects.sortOldest}</option>
              <option value="alpha">{t.projects.sortAlpha}</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
            />
          </div>
        </div>
      </div>

      <LayoutGroup>
        {grouped ? (
          <div className="mt-8 flex flex-col gap-14">
            {groups.map(({ category, items }) => (
              <section key={category} aria-labelledby={`projects-group-${category}`}>
                <h2
                  id={`projects-group-${category}`}
                  className="section-eyebrow flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800"
                >
                  {t.projects.categories[category]}
                  <span className="text-zinc-400 tabular-nums dark:text-zinc-600">
                    {items.length}
                  </span>
                </h2>
                <ProjectGrid items={items} bento />
              </section>
            ))}
          </div>
        ) : (
          <ProjectGrid items={filtered} className="mt-8" />
        )}
      </LayoutGroup>

      {matchCount === 0 && <EmptyState onReset={() => apply({ filter: 'all', query: '' })} />}
    </section>
  )
}

/**
 * Bento layout for one group in the 3-column grid. Pure and order-dependent
 * only, so the server and client compute identical spans.
 *
 * 1. Walk the items with a running column count. A featured item takes two
 *    columns when it still fits in the current row, otherwise one.
 * 2. Close a gap in the last row:
 *    - one column missing: widen the row's last card by one;
 *    - a lone single card after a full row of three singles: rebalance both
 *      rows to `2 1 / 1 2`;
 *    - any other lone card: span the full row (it renders horizontally).
 *    A group with a single project is never stretched past two columns.
 */
function bentoSpans(items: readonly Pick<Project, 'featured'>[]): CardSpan[] {
  if (items.length === 0) return []
  if (items.length === 1) return [2]

  const spans: CardSpan[] = []
  const rowStarts: number[] = []
  let col = 0
  items.forEach((item, index) => {
    if (col === 0) rowStarts.push(index)
    const span: CardSpan = item.featured && col <= 1 ? 2 : 1
    spans.push(span)
    col = (col + span) % 3
  })
  if (col === 0) return spans

  const last = spans.length - 1
  const gap = 3 - col
  if (gap === 1) {
    spans[last] = (spans[last] + 1) as CardSpan
    return spans
  }
  // gap === 2: the last row is one single-column card.
  const prevStart = rowStarts[rowStarts.length - 2]
  const prevRow = spans.slice(prevStart, last)
  if (prevRow.length === 3) {
    spans[prevStart] = 2
    spans[last] = 2
    return spans
  }
  spans[last] = 3
  return spans
}

const LG_SPAN_CLASS: Record<CardSpan, string> = {
  1: '',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
}

function ProjectGrid({
  items,
  bento = false,
  className = 'mt-5',
}: {
  items: Project[]
  /** Grouped view: irregular spans (see `bentoSpans`) and no category line on cards. */
  bento?: boolean
  className?: string
}) {
  const spans = bento ? bentoSpans(items) : null
  return (
    <motion.div
      layout
      className={`${className} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`}
    >
      <AnimatePresence mode="popLayout">
        {items.map((project, index) => {
          const span = spans?.[index] ?? 1
          return (
            <ProjectCard
              key={project.id}
              project={project}
              span={span}
              className={LG_SPAN_CLASS[span]}
              showCategory={!bento}
            />
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
  count?: number
}

function FilterChip({ label, active, onClick, count }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'focus-ring inline-flex min-h-9 items-center gap-2 rounded-full border px-4 font-mono text-[11px] tracking-wide uppercase transition',
        active
          ? 'border-accent-600 bg-accent-600 text-white'
          : 'border-zinc-200 bg-transparent text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white',
      ].join(' ')}
    >
      {label}
      {typeof count === 'number' && (
        <span
          className={[
            'text-[10px] tabular-nums',
            active ? 'text-white/70' : 'text-zinc-400 dark:text-zinc-600',
          ].join(' ')}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
      <span className="text-4xl">🔍</span>
      <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {t.projects.empty.title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {t.projects.empty.body}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="focus-ring mt-5 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {t.projects.empty.reset}
      </button>
    </div>
  )
}
