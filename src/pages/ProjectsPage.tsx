import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { projects, type ProjectCategory } from '../data/projects'
import ProjectCard from '../components/projects/ProjectCard'
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
const AVAILABLE_CATEGORIES = [...CATEGORY_COUNTS.keys()]

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
          p.tags.some((tag) => tag.toLowerCase().includes(q))
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
          <select
            id="sort"
            value={sort}
            onChange={(e) => apply({ sort: e.target.value as SortMode })}
            className="focus:border-accent-500 focus:ring-accent-500/20 min-h-10 rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm transition outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="recent">{t.projects.sortRecent}</option>
            <option value="oldest">{t.projects.sortOldest}</option>
            <option value="alpha">{t.projects.sortAlpha}</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>{t.projects.showing(matchCount, totalCount)}</span>
        {(filter !== 'all' || query) && (
          <button
            type="button"
            onClick={() => {
              // Sort is deliberately untouched (as before) — it is a view
              // preference, not a filter, so `?sort=` survives a clear.
              apply({ filter: 'all', query: '' })
            }}
            className="focus-ring text-accent-600 dark:text-accent-400 rounded text-xs font-medium underline-offset-4 hover:underline"
          >
            {t.projects.clear}
          </button>
        )}
      </div>

      <LayoutGroup>
        <motion.div layout className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                large={project.featured && filter === 'all' && !query}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {matchCount === 0 && <EmptyState onReset={() => apply({ filter: 'all', query: '' })} />}
    </section>
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
