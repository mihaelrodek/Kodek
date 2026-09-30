/**
 * Adapted from Kokonut UI Background Paths / Shape Hero, MIT.
 * https://github.com/kokonut-labs/kokonutui
 * See THIRD_PARTY_NOTICES.md. Deterministic geometry, no Next.js or remote fonts.
 * Only one SVG group is animated, using CSS transform and opacity.
 */
const paths = Array.from({ length: 12 }, (_, index) => {
  const offset = index * 22
  return `M ${-120 + offset} 800 C ${120 + offset} 740, ${100 + offset} 380, ${450 + offset} 420 S ${760 + offset} 150, ${1200 + offset} 70`
})

export function BackgroundPaths() {
  return (
    <div
      aria-hidden="true"
      className="hero-paths pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="hero-glow absolute inset-0" />
      <svg
        viewBox="0 0 1400 850"
        preserveAspectRatio="xMidYMid slice"
        className="text-accent-600/10 dark:text-accent-400/10 h-full w-full"
        fill="none"
      >
        <g className="drifting-paths">
          {paths.map((path, index) => (
            <path key={index} d={path} stroke="currentColor" strokeWidth="0.7" />
          ))}
        </g>
      </svg>
    </div>
  )
}
