import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { projects, type ProjectCategory } from '../data/projects'
import ProjectCard from '../components/projects/ProjectCard'
import { useTranslation } from '../hooks/useTranslation'

type Filter = 'all' | ProjectCategory
type SortMode = 'recent' | 'oldest' | 'alpha'

// Static data — count once at module scope instead of on every render.
const CATEGORY_COUNTS = projects.reduce(
  (map, p) => map.set(p.category, (map.get(p.category) ?? 0) + 1),
  new Map<ProjectCategory, number>(),
)
const AVAILABLE_CATEGORIES = [...CATEGORY_COUNTS.keys()]

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('recent')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects
      .filter((p) => (filter === 'all' ? true : p.category === filter))
      .filter((p) => {
        if (!q) return true
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (sort === 'alpha') return a.title.localeCompare(b.title)
        if (sort === 'oldest') return a.sortYear - b.sortYear
        return b.sortYear - a.sortYear
      })
  }, [filter, query, sort])

  const totalCount = projects.length
  const matchCount = filtered.length

  return (
    <section className="container-page py-12 md:py-16">
      <div className="flex flex-col gap-3">
        <p className="text-accent-600 dark:text-accent-400 text-xs font-semibold tracking-[0.2em] uppercase">
          {t.projects.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl">{t.projects.title}</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          {t.projects.intro}{' '}
          <span className="text-zinc-500 dark:text-zinc-500">
            {totalCount === 1
              ? t.projects.countSingular(totalCount)
              : t.projects.countPlural(totalCount)}
          </span>
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:mt-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label={t.projects.all}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            count={totalCount}
          />
          {AVAILABLE_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              label={t.projects.categories[cat]}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              count={CATEGORY_COUNTS.get(cat) ?? 0}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400 dark:text-zinc-600"
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.projects.searchPlaceholder}
              aria-label={t.projects.searchAria}
              className="focus:border-accent-500 focus:ring-accent-500/20 w-full rounded-md border border-zinc-300 bg-white py-2 pr-3 pl-9 text-sm shadow-sm transition outline-none placeholder:text-zinc-400 focus:ring-2 sm:w-64 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>

          <label className="sr-only" htmlFor="sort">
            {t.projects.sortAria}
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="focus:border-accent-500 focus:ring-accent-500/20 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="recent">{t.projects.sortRecent}</option>
            <option value="oldest">{t.projects.sortOldest}</option>
            <option value="alpha">{t.projects.sortAlpha}</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500">
        <span>{t.projects.showing(matchCount, totalCount)}</span>
        {(filter !== 'all' || query) && (
          <button
            type="button"
            onClick={() => {
              setFilter('all')
              setQuery('')
            }}
            className="text-accent-600 dark:text-accent-400 text-xs font-medium underline-offset-4 hover:underline"
          >
            {t.projects.clear}
          </button>
        )}
      </div>

      <LayoutGroup>
        <motion.div layout className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {matchCount === 0 && (
        <EmptyState
          onReset={() => {
            setFilter('all')
            setQuery('')
          }}
        />
      )}
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
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
        active
          ? 'border-accent-500 bg-accent-500 text-white shadow-sm'
          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800',
      ].join(' ')}
    >
      {label}
      {typeof count === 'number' && (
        <span
          className={[
            'rounded-full px-1.5 text-[10px] font-semibold tabular-nums',
            active
              ? 'bg-white/20 text-white'
              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
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
        className="mt-5 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {t.projects.empty.reset}
      </button>
    </div>
  )
}
