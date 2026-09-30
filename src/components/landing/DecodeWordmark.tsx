import { useCallback, useEffect, useRef, useState } from 'react'
import { KodekMark } from '@/components/KodekMark'

/** Rendered as the mark, then the brand wordmark "odek_". */
const WORD = 'Kodek_'
/** The founder's surname is one letter away from the brand, so the intro decodes R → K. */
const SOURCE_FIRST = 'R'
const GLYPHS = '01<>/{}[]#$%&*+=?!XZ'
const TICK_MS = 70
const HOLD_SOURCE_MS = 900
const INTRO_TICKS = 9
const HOVER_TICKS = 4

interface Cell {
  char: string
  /** `source` is the held "R"; `noise` is a scramble glyph. */
  state: 'locked' | 'source' | 'noise'
}

// The prerendered markup is always the resolved word; the R and the scramble
// only appear in post-mount effects, so nothing random reaches hydration.
const RESOLVED: Cell[] = WORD.split('').map((char) => ({ char, state: 'locked' }))

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function hex(char: string) {
  return `0x${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`
}

/** Giant wordmark: "Rodek_" holds for a beat, then the R decodes into the Kodek mark. */
export function DecodeWordmark() {
  const [cells, setCells] = useState<Cell[]>(RESOLVED)
  const scrambling = useRef(new Map<number, number>())
  const timer = useRef<number | undefined>(undefined)

  const scramble = useCallback((index: number, ticks: number) => {
    scrambling.current.set(index, ticks)
    if (timer.current !== undefined) return
    timer.current = window.setInterval(() => {
      const pending = scrambling.current
      for (const [key, left] of pending) {
        if (left <= 0) pending.delete(key)
        else pending.set(key, left - 1)
      }
      setCells(
        RESOLVED.map((cell, i) =>
          pending.has(i) ? { char: randomGlyph(), state: 'noise' } : cell,
        ),
      )
      if (pending.size === 0) {
        window.clearInterval(timer.current)
        timer.current = undefined
      }
    }, TICK_MS)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Next frame, not synchronously: hydration has to commit the resolved word first.
    const swap = window.requestAnimationFrame(() =>
      setCells(
        RESOLVED.map((cell, i) => (i === 0 ? { char: SOURCE_FIRST, state: 'source' } : cell)),
      ),
    )
    const hold = window.setTimeout(() => scramble(0, INTRO_TICKS), HOLD_SOURCE_MS)
    const pending = scrambling.current
    return () => {
      window.cancelAnimationFrame(swap)
      window.clearTimeout(hold)
      window.clearInterval(timer.current)
      timer.current = undefined
      pending.clear()
    }
  }, [scramble])

  return (
    <div aria-hidden="true" className="select-none">
      <div className="decode-word font-heading text-foreground font-bold">
        {cells.map((cell, index) => {
          const isMark = index === 0 && cell.state === 'locked'
          const isUnderscore = index === WORD.length - 1 && cell.state === 'locked'
          return (
            <span
              key={index}
              onPointerEnter={() => scramble(index, HOVER_TICKS)}
              className={`decode-cell transition-colors duration-300 ${
                index === 0 ? 'decode-cell-mark' : ''
              } ${
                cell.state === 'noise'
                  ? 'text-accent-500/70 scale-[0.6] font-mono font-light'
                  : cell.state === 'source' || isUnderscore
                    ? 'text-accent-800 dark:text-accent-500'
                    : ''
              }`}
            >
              {isMark ? <KodekMark className="decode-mark" /> : cell.char}
            </span>
          )
        })}
      </div>
      <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase sm:text-xs dark:text-zinc-500">
        <span className="text-accent-700 dark:text-accent-500">decode</span>
        {cells.map((cell, index) => (
          <span
            key={index}
            className={cell.state === 'locked' ? '' : 'text-accent-700 dark:text-accent-500'}
          >
            {hex(cell.char)}
          </span>
        ))}
        <span className="decode-caret bg-accent-700 dark:bg-accent-500 inline-block h-3 w-1.5" />
      </p>
    </div>
  )
}
