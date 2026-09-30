import type { CSSProperties } from 'react'

/**
 * "Izrada: Kodek" credit for React sites built by Kodek. Copy this file into the
 * project; it has no dependencies beyond React and renders the same markup on
 * server and client. Logo geometry and colours come from the Kodek brand
 * package: do not round, shadow, stretch or recolour it.
 */

const THEMES = {
  light: { bg: '#f3f2f2', fg: '#201e1d', accent: '#15318f', border: 'rgba(32,30,29,.12)' },
  dark: { bg: '#201e1d', fg: '#f3f2f2', accent: '#4264e3', border: 'rgba(243,242,242,.14)' },
} as const

const LABELS = { hr: 'Izrada:', en: 'Built by:' } as const

const WORD =
  'M107.8 73.02V45.18L117.69 35.19H145.14L155.03 45.18V73.02L145.14 83H117.69ZM139 72.44 142.36 69.08V49.11L139 45.75H123.83L120.47 49.11V69.08L123.83 72.44ZM164.63 73.02V45.18L174.52 35.19H193.53L199.19 40.09V14.46H211.86V83H199.96V75.61L192.57 83H174.52ZM191.42 72.25 199.19 64.28V51.8L192.66 45.94H180.95L177.3 49.69V68.5L180.95 72.25ZM222.42 73.21V45.18L232.31 35.19H259.29L269.27 45.18V63.32H235.1V69.46L238.17 72.63H253.82L256.7 69.66V67.16H269.18V73.4L259.67 83H232.12ZM256.6 54.49V48.92L253.34 45.56H238.36L235.1 48.92V54.49ZM279.35 14.46H292.02V52.76H300.38L312.57 35.19H326.58L310.65 58.23L327.54 83H313.53L300.09 63.51H292.02V83H279.35Z'
const UNDERSCORE = 'M328.02 83.96H374.3V94.71H328.02Z'

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const

interface KodekLogoProps {
  theme?: keyof typeof THEMES
  /** Rendered height in px; the brand minimum for the full logo is 24. */
  height?: number
  className?: string
}

/** Full Kodek logo with the wordmark as outlines, so no font is required. */
export function KodekLogo({ theme = 'light', height = 24, className }: KodekLogoProps) {
  const { fg, accent } = THEMES[theme]
  return (
    <svg
      viewBox="0 0 375 95"
      height={height}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: 'block', width: 'auto', flex: 'none' }}
    >
      <g transform="scale(0.775)">
        <rect width="120" height="120" fill="#15318f" />
        <path d="M13.75 14H31.15V106H13.75Z" fill="#ffffff" />
        <path d="M38.75 60 82.25 14h15.3v9.2L62.75 60l43.5 46h-24Z" fill="#ffffff" />
        <path d="M39.55 14h31.2l-9.5 10h-21.7Z" fill="#4264e3" />
      </g>
      <path d={WORD} fill={fg} />
      <path d={UNDERSCORE} fill={accent} />
    </svg>
  )
}

interface KodekBadgeProps {
  /** sticky pins the bar to the viewport bottom; render it last in the page. */
  mode?: 'sticky' | 'static' | 'inline'
  theme?: keyof typeof THEMES
  align?: keyof typeof JUSTIFY
  lang?: keyof typeof LABELS
  /** Overrides the default text; pass an empty string to show the logo only. */
  label?: string
  href?: string
  className?: string
  style?: CSSProperties
}

export default function KodekBadge({
  mode = 'sticky',
  theme = 'light',
  align = 'center',
  lang = 'hr',
  label,
  href = 'https://kodek.hr',
  className,
  style,
}: KodekBadgeProps) {
  const { bg, fg, border } = THEMES[theme]
  const text = (label ?? LABELS[lang]).trim()
  const inline = mode === 'inline'

  return (
    <div
      className={className}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        justifyContent: JUSTIFY[align],
        boxSizing: 'border-box',
        ...(inline && { verticalAlign: 'middle' }),
        ...(mode === 'sticky' && { position: 'sticky', bottom: 0, zIndex: 40 }),
        ...(!inline && {
          padding: '4px 16px calc(4px + env(safe-area-inset-bottom, 0px))',
          background: bg,
          borderTop: `1px solid ${border}`,
        }),
        ...style,
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={`${text} Kodek`.trim()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 36,
          padding: '0 6px',
          color: fg,
          font: "500 13px/1 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          letterSpacing: '.01em',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {text && <span style={{ opacity: 0.72 }}>{text}</span>}
        <KodekLogo theme={theme} />
      </a>
    </div>
  )
}
