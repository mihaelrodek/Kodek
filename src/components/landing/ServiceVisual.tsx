import type { CSSProperties } from 'react'
import { MousePointer2, Search } from 'lucide-react'

const BARS = [34, 52, 41, 66, 48, 74, 88, 70, 96]
// Search results: the highlighted row starts in slot 2 and rises to slot 0.
const SEO_ROWS = [
  { from: 0, to: 1, width: '42%', hit: false },
  { from: 1, to: 2, width: '34%', hit: false },
  { from: 2, to: 0, width: '46%', hit: true },
  { from: 3, to: 3, width: '30%', hit: false },
]
const PRICE_ROWS = ['38%', '30%', '44%', '26%']

/** Decorative animated wireframes — no invented product screenshots, copy, or metrics. */
export function ServiceVisual({ kind }: { kind: number }) {
  return (
    <div
      aria-hidden="true"
      className="service-visual pointer-events-none relative flex h-40 items-end justify-center overflow-hidden px-6 sm:h-44"
    >
      {kind === 0 ? (
        <div className="visual-frame flex w-full max-w-md translate-y-6 transition-transform duration-700 ease-out group-hover:translate-y-2">
          <div className="flex w-16 shrink-0 flex-col gap-3 border-r border-zinc-200 p-4 dark:border-zinc-800">
            <span className="bg-accent-600 size-4 rounded" />
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="mock-line" />
            ))}
          </div>
          <div className="flex-1 p-4">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-md border border-zinc-200 p-2.5 dark:border-zinc-800"
                >
                  <span className="mock-line block w-8" />
                  <span
                    className="visual-shimmer bg-accent-500 mt-2 block h-1 w-5 rounded"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex h-24 items-end gap-1.5 rounded-md border border-zinc-200 px-3 pt-3 dark:border-zinc-800">
              {BARS.map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}%`, animationDelay: `${i * 0.12}s` }}
                  className="visual-bar from-accent-600/80 to-accent-500/20 flex-1 rounded-t bg-gradient-to-t"
                />
              ))}
            </div>
          </div>
        </div>
      ) : kind === 1 ? (
        <div className="visual-frame relative h-full w-full max-w-sm translate-y-4 transition-transform duration-700 ease-out group-hover:translate-y-1">
          <div className="flex h-8 items-center gap-1.5 border-b border-zinc-200 px-3 dark:border-zinc-800">
            <span className="bg-accent-600 size-1.5 shrink-0 rounded-full" />
            <span className="size-1.5 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-1.5 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="ml-2 flex h-5 min-w-0 flex-1 items-center rounded-full bg-zinc-100 px-2.5 font-mono text-[10px] leading-none text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              <span className="site-url overflow-hidden whitespace-nowrap">www.kodek.hr</span>
              <span className="site-caret-wrap">
                <span className="site-caret bg-accent-600 dark:bg-accent-400 ml-px block h-3 w-px" />
              </span>
            </span>
          </div>
          <span className="site-loading bg-accent-500 absolute inset-x-0 top-8 h-0.5 origin-left" />
          <div className="flex gap-4 px-4 pt-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="site-reveal block h-2 w-full max-w-36 rounded-full bg-zinc-800 dark:bg-zinc-100" />
              <span
                className="site-reveal mt-1.5 block h-2 w-3/4 max-w-24 rounded-full bg-zinc-800 dark:bg-zinc-100"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="site-reveal mock-line mt-3 block w-full max-w-40"
                style={{ animationDelay: '0.3s' }}
              />
              <span className="site-reveal mt-2.5 block w-16" style={{ animationDelay: '0.55s' }}>
                <span className="site-click bg-accent-600 block h-5 w-16 rounded-full" />
              </span>
            </div>
            <span
              className="site-reveal from-accent-600/70 to-accent-500/10 block h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br max-[400px]:hidden"
              style={{ animationDelay: '0.25s' }}
            />
          </div>
          <MousePointer2 className="site-cursor fill-accent-600 absolute top-0 left-0 size-5 text-white" />
        </div>
      ) : kind === 2 ? (
        <div className="flex translate-y-4 items-end justify-center">
          {[
            'bg-zinc-200 dark:bg-zinc-800 -rotate-12 translate-x-6 group-hover:-translate-x-2 group-hover:-rotate-[18deg]',
            'bg-accent-600 z-10 -translate-y-4 group-hover:-translate-y-8',
            'bg-zinc-900 dark:bg-zinc-100 rotate-12 -translate-x-6 group-hover:translate-x-2 group-hover:rotate-[18deg]',
          ].map((tile, i) => (
            <div
              key={i}
              className={`visual-tile flex h-36 w-28 flex-col justify-end gap-2 rounded-xl p-3 shadow-2xl shadow-black/30 transition-transform duration-700 ease-out ${tile}`}
            >
              <span className="block h-1.5 w-12 rounded-full bg-white/70 mix-blend-difference" />
              <span className="block h-1.5 w-8 rounded-full bg-white/40 mix-blend-difference" />
            </div>
          ))}
        </div>
      ) : kind === 3 ? (
        <div className="visual-frame relative h-full w-full max-w-sm translate-y-6 transition-transform duration-700 ease-out group-hover:translate-y-2">
          <div className="p-3">
            <div className="flex h-7 items-center gap-2 rounded-full border border-zinc-200 px-3 dark:border-zinc-800">
              <Search className="size-3 shrink-0 text-zinc-400" />
              <span className="seo-query bg-accent-600/70 dark:bg-accent-400/70 block h-1.5 w-20 rounded-full" />
              <span className="seo-caret-wrap">
                <span className="site-caret bg-accent-600 dark:bg-accent-400 block h-3 w-px" />
              </span>
            </div>
          </div>
          <div className="seo-results relative mx-3">
            {SEO_ROWS.map((row, i) => (
              <div
                key={i}
                className={`seo-row absolute inset-x-0 top-0 flex h-6 items-center gap-2 rounded-md px-2 ${
                  row.hit ? 'bg-accent-600/10 ring-accent-500/40 z-10 ring-1' : ''
                }`}
                style={
                  { '--from': `${row.from * 28}px`, '--to': `${row.to * 28}px` } as CSSProperties
                }
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${
                    row.hit ? 'bg-accent-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                />
                <span
                  className={`block h-1.5 rounded-full ${
                    row.hit ? 'bg-accent-600 dark:bg-accent-400' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  style={{ width: row.width }}
                />
                <span className="mock-line ml-auto block w-10" />
              </div>
            ))}
          </div>
        </div>
      ) : kind === 4 ? (
        <div className="visual-frame relative h-full w-full max-w-sm translate-y-6 transition-transform duration-700 ease-out group-hover:translate-y-2">
          <div className="flex h-8 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-800">
            <span className="mock-line block w-16" />
            <span className="border-accent-500/40 text-accent-700 dark:text-accent-300 relative flex h-5 w-11 items-center justify-center rounded-md border font-mono text-[10px] leading-none">
              <span className="price-badge">.csv</span>
              <span className="price-badge price-badge-alt absolute inset-0 flex items-center justify-center">
                .xml
              </span>
            </span>
          </div>
          <div className="px-4 pt-3">
            <div className="flex items-center gap-3 pb-2">
              <span className="block h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="ml-auto block h-1 w-7 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="block h-1 w-7 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            {PRICE_ROWS.map((width, i) => (
              <div
                key={i}
                className="price-row flex items-center gap-3 border-t border-zinc-200 py-2 dark:border-zinc-800"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <span className="mock-line block" style={{ width }} />
                <span className="ml-auto block h-2 w-7 rounded-sm border border-dashed border-zinc-300 dark:border-zinc-700" />
                <span className="bg-accent-600 dark:bg-accent-500 block h-2 w-7 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="visual-frame w-full max-w-md translate-y-6 p-5 transition-transform duration-700 ease-out group-hover:translate-y-2">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="visual-ping bg-accent-500 absolute inline-flex size-full rounded-full" />
              <span className="bg-accent-600 relative inline-flex size-2 rounded-full" />
            </span>
            <span className="mock-line w-24" />
          </div>
          <svg viewBox="0 0 400 90" className="mt-3 h-24 w-full" fill="none">
            <path
              d="M0 50h70l14-30 18 58 16-44 12 16h60l14-34 18 62 16-46 12 18h150"
              className="stroke-zinc-200 dark:stroke-zinc-800"
              strokeWidth="2"
            />
            <path
              d="M0 50h70l14-30 18 58 16-44 12 16h60l14-34 18 62 16-46 12 18h150"
              pathLength="1"
              className="visual-pulse stroke-accent-500"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
