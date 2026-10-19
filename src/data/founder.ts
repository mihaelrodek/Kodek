import { timelineEvents, type TimelineEvent } from './timeline'

/**
 * Content for the public founder profile (/o-meni, /en/about). Career and education are
 * read from `timeline.ts` so the two pages — this one and the unrouted
 * personal timeline in AboutTimelinePage.tsx — never drift apart.
 */
function event(id: string): TimelineEvent {
  const found = timelineEvents.find((item) => item.id === id)
  if (!found) throw new Error(`timeline event "${id}" is missing`)
  return found
}

export const founder = {
  /**
   * Public path of the portrait, e.g. '/founder/mihael-rodek.webp' once the
   * photo is dropped into `public/founder/`. The same path serves both the
   * About page and the landing page founder section. Undefined renders a
   * neutral monogram tile instead of a broken image.
   */
  photo: '/founder/mihael-rodek.webp' as string | undefined,
  initials: 'MR',
  /** Current employer, with client projects as milestones. */
  career: event('true-north'),
  /** Degree programme and the graduation entry (thesis lives in its subtitle). */
  degree: event('fer'),
  graduation: event('msc-graduation'),
} as const
