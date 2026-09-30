import type { PointerEvent, ReactNode } from 'react'

/** Card with a red glow that follows the pointer (position set via CSS vars, no re-render). */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }
  return (
    <div onPointerMove={onPointerMove} className={`spotlight-card group ${className}`}>
      <div aria-hidden="true" className="spotlight-card-glow" />
      {children}
    </div>
  )
}
