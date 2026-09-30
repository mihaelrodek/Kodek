import type { SVGProps } from 'react'

/**
 * The Kodek mark from the brand package (export/svg/kodek-mark-blue.svg), inlined
 * so it scales with `em` sizing and needs no extra request. Geometry must stay
 * identical to the SVG file: no radius, no shadow, no recolouring.
 */
export function KodekMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" {...props}>
      <rect width="120" height="120" fill="#15318f" />
      <path d="M13.75 14H31.15V106H13.75Z" fill="#ffffff" />
      <path d="M38.75 60 82.25 14h15.3v9.2L62.75 60l43.5 46h-24Z" fill="#ffffff" />
      <path d="M39.55 14h31.2l-9.5 10h-21.7Z" fill="#4264e3" />
    </svg>
  )
}
