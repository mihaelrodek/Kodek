import { MousePointer2 } from 'lucide-react'

const BARS = [34, 52, 41, 66, 48, 74, 88, 70, 96]

/** Decorative animated wireframes — no invented product screenshots, copy, or metrics. */
export function ServiceVisual({ kind }: { kind: number }) {
  return (
    <div
      aria-hidden="true"
      className="service-visual pointer-events-none relative flex h-48 items-end justify-center overflow-hidden px-6 sm:h-56"
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
        <div className="visual-frame relative w-full max-w-sm translate-y-6 transition-transform duration-700 ease-out group-hover:translate-y-2">
          <div className="flex h-8 items-center gap-1.5 border-b border-zinc-200 px-3 dark:border-zinc-800">
            <span className="bg-accent-600 size-1.5 rounded-full" />
            <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="mock-line ml-3 w-28" />
          </div>
          <div className="space-y-3 p-6">
            <span className="visual-type block h-2.5 w-40 rounded-full bg-zinc-800 dark:bg-zinc-100" />
            <span
              className="visual-type block h-2.5 w-28 rounded-full bg-zinc-800 dark:bg-zinc-100"
              style={{ animationDelay: '0.35s' }}
            />
            <span className="mock-line block w-48" />
            <span className="mock-line block w-36" />
            <span className="visual-click bg-accent-600 mt-4 block h-7 w-20 rounded-full" />
          </div>
          <MousePointer2 className="visual-cursor fill-accent-600 absolute top-0 left-0 size-5 text-white" />
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
