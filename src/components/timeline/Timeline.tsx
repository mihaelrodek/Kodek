import { useMemo, useRef, useState, type RefObject } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { timelineEvents, type TimelineEvent, type TimelineMilestone } from '../../data/timeline'
import { localized } from '../../i18n/translations'
import { useTranslation } from '../../hooks/useTranslation'
import { useMatchMedia } from '../../hooks/useMatchMedia'

/** Scroll runway per event, in viewport heights. */
const SCROLL_PER_EVENT_VH_DESKTOP = 80
const SCROLL_PER_EVENT_VH_MOBILE = 100
const RAIL_ITEM_HEIGHT = 56

function sortEvents(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => {
    if (a.sortYear !== b.sortYear) return a.sortYear - b.sortYear
    return (a.sortMonth ?? 0) - (b.sortMonth ?? 0)
  })
}

/**
 * Shared pin-scroll wiring for both timeline variants: tracks progress through
 * the runway section and maps it to the index of the active event.
 */
function useTimelineScroll(count: number) {
  const wrapperRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Clamp just below 1 so a fully-scrolled runway maps to the last index,
    // not one past it.
    const clamped = Math.min(Math.max(v, 0), 0.99999)
    setActive(Math.floor(clamped * count))
  })

  return { wrapperRef, scrollYProgress, active }
}

export default function Timeline() {
  const events = useMemo(() => sortEvents(timelineEvents), [])
  // Render exactly one variant — having both in the DOM doubles the page scroll
  // height, which breaks the pin math on the visible one.
  const isDesktop = useMatchMedia('(min-width: 768px)')
  return isDesktop ? <PinnedTimeline events={events} /> : <MobilePinnedTimeline events={events} />
}

/* --------------------------------- Desktop -------------------------------- */

function PinnedTimeline({ events }: { events: TimelineEvent[] }) {
  const { t } = useTranslation()
  const { wrapperRef, scrollYProgress, active } = useTimelineScroll(events.length)
  const reduced = useReducedMotion()

  const railY = useTransform(scrollYProgress, [0, 1], [0, -(events.length - 1) * RAIL_ITEM_HEIGHT])

  return (
    <section
      ref={wrapperRef}
      aria-label={t.timeline.ariaLabel}
      style={{ height: `${events.length * SCROLL_PER_EVENT_VH_DESKTOP}vh` }}
      className="relative"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] w-full overflow-hidden bg-white dark:bg-zinc-950">
        <div className="relative mx-auto h-full w-full max-w-[1800px]">
          <div className="absolute inset-y-0 right-[220px] left-0 flex items-center px-8 sm:px-12 lg:right-[280px] lg:px-20 xl:right-[320px] xl:px-24">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={events[active].id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <DesktopEventContent event={events[active]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-y-0 right-6 flex items-center sm:right-10 lg:right-14">
            <YearRail events={events} active={active} railY={railY} wrapperRef={wrapperRef} />
          </div>
        </div>
      </div>
    </section>
  )
}

function DesktopEventContent({ event }: { event: TimelineEvent }) {
  const { lang } = useTranslation()
  return (
    <div className="grid w-full items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-14 xl:gap-20">
      <div className="relative">{renderImage(event, 'aspect-[4/3]', 96)}</div>
      <div className="space-y-4">
        <p className="text-accent-600 dark:text-accent-400 text-xs font-semibold tracking-[0.2em] uppercase">
          {localized(lang, event.year, event.yearHr)}
        </p>
        <h2 className="text-3xl leading-tight font-semibold tracking-tight text-zinc-900 sm:text-4xl xl:text-5xl dark:text-zinc-50">
          {localized(lang, event.title, event.titleHr)}
        </h2>
        {event.subtitle && (
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            {localized(lang, event.subtitle, event.subtitleHr)}
          </p>
        )}
        <p className="max-w-prose text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          {localized(lang, event.description, event.descriptionHr)}
        </p>
        {event.tags && event.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {event.tags.map((tag) => (
              <li
                key={tag}
                className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300 rounded-full px-3 py-1 text-xs font-medium"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        {event.milestones && event.milestones.length > 0 && (
          <MilestonesList milestones={event.milestones} />
        )}
      </div>
    </div>
  )
}

function renderImage(event: TimelineEvent, aspectClass: string, iconSize: number) {
  if (event.image) {
    return (
      <img
        src={event.image}
        alt={event.imageAlt ?? event.title}
        className={`${aspectClass} w-full rounded-2xl object-cover shadow-2xl shadow-zinc-900/10 dark:shadow-black/40`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${aspectClass} flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 shadow-2xl shadow-zinc-900/10 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600 dark:shadow-black/40`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    </div>
  )
}

function MilestonesList({ milestones }: { milestones: TimelineMilestone[] }) {
  const { t, lang } = useTranslation()
  return (
    <div className="mt-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
        {t.timeline.selectedProjects}
      </p>
      <ol className="mt-3 space-y-3">
        {milestones.map((m) => (
          <li key={m.id} className="relative pl-5">
            <span
              aria-hidden="true"
              className="bg-accent-500 absolute top-2 left-0 inline-block h-1.5 w-1.5 rounded-full"
            />
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
              <span className="text-accent-600 dark:text-accent-400 text-xs font-medium whitespace-nowrap tabular-nums">
                {localized(lang, m.year, m.yearHr)}
              </span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {m.title}
              </span>
            </div>
            <p className="mt-0.5 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
              {localized(lang, m.description, m.descriptionHr)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

interface YearRailProps {
  events: TimelineEvent[]
  active: number
  railY: MotionValue<number>
  /** The runway <section> — scroll target for the year buttons. */
  wrapperRef: RefObject<HTMLElement | null>
}

function YearRail({ events, active, railY, wrapperRef }: YearRailProps) {
  const { lang } = useTranslation()
  const reduced = useReducedMotion()

  const scrollToIndex = (index: number) => {
    const section = wrapperRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const sectionTop = rect.top + window.scrollY
    const progress = events.length === 1 ? 0 : index / events.length
    const target = sectionTop + (section.clientHeight - window.innerHeight) * progress
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div className="relative h-[70vh] max-h-[640px] w-48 lg:w-56 xl:w-64">
      <div
        aria-hidden="true"
        className="absolute top-0 right-1 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"
      />
      <div
        aria-hidden="true"
        className="border-accent-500/40 pointer-events-none absolute top-1/2 right-0 left-0 z-10 -translate-y-px border-t"
      />
      <div className="absolute inset-x-0 top-1/2 -translate-y-7 overflow-visible">
        <motion.ol style={{ y: railY }} className="m-0 list-none p-0">
          {events.map((event, i) => {
            const isActive = i === active
            return (
              <li key={event.id} style={{ height: RAIL_ITEM_HEIGHT }}>
                <button
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-current={isActive ? 'true' : undefined}
                  className={[
                    'group flex h-full w-full items-center justify-end gap-4 pr-1 text-right transition',
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400',
                  ].join(' ')}
                >
                  <div className="flex flex-col items-end leading-tight">
                    <span
                      className={[
                        'text-sm font-semibold tabular-nums',
                        isActive ? 'text-accent-600 dark:text-accent-400' : '',
                      ].join(' ')}
                    >
                      {localized(lang, event.year, event.yearHr)}
                    </span>
                    <span
                      className={[
                        'truncate text-xs',
                        isActive
                          ? 'text-zinc-700 dark:text-zinc-300'
                          : 'text-zinc-400 dark:text-zinc-600',
                      ].join(' ')}
                    >
                      {localized(lang, event.title, event.titleHr)}
                    </span>
                  </div>
                  <span className="relative inline-flex h-3 w-3 items-center justify-center">
                    <span
                      className={[
                        'inline-flex rounded-full transition-all duration-300',
                        isActive
                          ? 'bg-accent-500 ring-accent-500/20 h-3 w-3 ring-4'
                          : 'h-2 w-2 bg-zinc-300 dark:bg-zinc-700',
                      ].join(' ')}
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </motion.ol>
      </div>
    </div>
  )
}

/* ---------------------------------- Mobile -------------------------------- */

function MobilePinnedTimeline({ events }: { events: TimelineEvent[] }) {
  const { t } = useTranslation()
  const { wrapperRef, scrollYProgress, active } = useTimelineScroll(events.length)
  const reduced = useReducedMotion()

  // Progress through the timeline section (0 → 1), used to drive the
  // horizontal "fill" of the year strip.
  const progress = scrollYProgress

  return (
    <section
      ref={wrapperRef}
      aria-label={t.timeline.ariaLabel}
      style={{ height: `${events.length * SCROLL_PER_EVENT_VH_MOBILE}vh` }}
      className="relative"
    >
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-white sm:top-16 sm:h-[calc(100svh-4rem)] dark:bg-zinc-950">
        {/* Year strip — fixed at top */}
        <YearStrip events={events} active={active} progress={progress} />

        {/* Content — animated crossfade */}
        <div className="flex flex-1 items-start overflow-hidden px-5 pt-3 pb-6">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={events[active].id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <MobileEventContent event={events[active]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

interface YearStripProps {
  events: TimelineEvent[]
  active: number
  progress: MotionValue<number>
}

function YearStrip({ events, active, progress }: YearStripProps) {
  const { lang } = useTranslation()
  const fillWidth = useTransform(progress, [0, 1], ['0%', '100%'])
  return (
    <div className="border-b border-zinc-200 px-5 pt-3 pb-3 dark:border-zinc-800">
      <div className="relative">
        {/* Track */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800"
        />
        {/* Filled progress */}
        <motion.div
          aria-hidden="true"
          style={{ width: fillWidth }}
          className="bg-accent-500 absolute top-1/2 left-0 h-px -translate-y-1/2"
        />
        {/* Dots */}
        <ol className="relative flex items-center justify-between">
          {events.map((event, i) => {
            const isActive = i === active
            const isPast = i < active
            return (
              <li key={event.id}>
                <span
                  aria-hidden="true"
                  className={[
                    'block rounded-full ring-2 ring-white transition-all duration-300 dark:ring-zinc-950',
                    isActive
                      ? 'bg-accent-500 h-3 w-3'
                      : isPast
                        ? 'bg-accent-500 h-2 w-2'
                        : 'h-2 w-2 bg-zinc-300 dark:bg-zinc-700',
                  ].join(' ')}
                />
              </li>
            )
          })}
        </ol>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-zinc-400 tabular-nums dark:text-zinc-600">
        <span className="text-accent-600 dark:text-accent-400">{events[0].sortYear}</span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {localized(lang, events[active].year, events[active].yearHr)}
        </span>
        <span>{events[events.length - 1].sortYear}</span>
      </div>
    </div>
  )
}

function MobileEventContent({ event }: { event: TimelineEvent }) {
  const { lang } = useTranslation()
  return (
    <div className="space-y-4">
      {renderImage(event, 'aspect-[16/10]', 48)}

      <div>
        <p className="text-accent-600 dark:text-accent-400 text-[11px] font-semibold tracking-[0.2em] uppercase">
          {localized(lang, event.year, event.yearHr)}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {localized(lang, event.title, event.titleHr)}
        </h2>
        {event.subtitle && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {localized(lang, event.subtitle, event.subtitleHr)}
          </p>
        )}
      </div>

      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {localized(lang, event.description, event.descriptionHr)}
      </p>

      {event.tags && event.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <li
              key={tag}
              className="bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300 rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {event.milestones && event.milestones.length > 0 && (
        <MilestonesList milestones={event.milestones} />
      )}
    </div>
  )
}
