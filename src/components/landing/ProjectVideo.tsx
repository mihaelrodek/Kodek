import { useEffect, useRef } from 'react'

interface ProjectVideoProps {
  /** Public path without extension; `.webm` and `.mp4` siblings must exist. */
  src: string
  poster: string
  className?: string
}

/**
 * Scroll mode shares one controller across all clips so that only the clip
 * closest to the middle of the viewport plays.
 */
const scrollVideos = new Set<HTMLVideoElement>()
let frame = 0

function play(video: HTMLVideoElement) {
  if (!video.paused) return
  video.play().catch(() => {
    // Playback can be refused (e.g. low-power or data-saver mode); the poster stays.
  })
}

function pickFocused() {
  frame = 0
  const middle = window.innerHeight / 2
  let best: HTMLVideoElement | null = null
  let bestDistance = Infinity
  for (const video of scrollVideos) {
    const rect = video.getBoundingClientRect()
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
    if (rect.height === 0 || visible < rect.height * 0.5) continue
    const distance = Math.abs(rect.top + rect.height / 2 - middle)
    if (distance < bestDistance) {
      best = video
      bestDistance = distance
    }
  }
  for (const video of scrollVideos) {
    if (video === best) play(video)
    else if (!video.paused) video.pause()
  }
}

function schedule() {
  if (!frame) frame = window.requestAnimationFrame(pickFocused)
}

/** Touch screens and narrow windows follow scroll; wide windows with a mouse follow hover. */
function usesHover() {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(min-width: 768px)').matches
  )
}

/**
 * Short muted site preview that stays a still poster until it is wanted, so
 * nothing is downloaded up front (`preload="none"`).
 *
 * - Wide windows with a mouse: plays while the surrounding card link is
 *   hovered or keyboard-focused, pauses when it is left.
 * - Touch screens and narrow windows: the one clip closest to the middle of
 *   the viewport (and at least half visible) plays; the others pause.
 * - Reduced motion: never plays; the poster stays.
 *
 * The markup is static (no autoplay attribute), so the prerendered HTML and
 * the first client render match; all behaviour is wired up after mount and
 * re-evaluated when the window is resized across the breakpoint.
 */
export function ProjectVideo({ src, poster, className }: ProjectVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Mobile autoplay policies require a muted clip; set it explicitly rather
    // than trusting the hydrated attribute.
    video.muted = true
    video.defaultMuted = true

    const card = video.closest('a') ?? video.parentElement
    const onEnter = () => play(video)
    const onLeave = () => video.pause()
    let teardown = () => {}

    const setup = () => {
      teardown()
      if (usesHover() && card) {
        card.addEventListener('pointerenter', onEnter)
        card.addEventListener('pointerleave', onLeave)
        card.addEventListener('focusin', onEnter)
        card.addEventListener('focusout', onLeave)
        teardown = () => {
          card.removeEventListener('pointerenter', onEnter)
          card.removeEventListener('pointerleave', onLeave)
          card.removeEventListener('focusin', onEnter)
          card.removeEventListener('focusout', onLeave)
          video.pause()
        }
      } else {
        scrollVideos.add(video)
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        schedule()
        teardown = () => {
          scrollVideos.delete(video)
          if (scrollVideos.size === 0) {
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
          }
          video.pause()
        }
      }
    }

    setup()
    const wide = window.matchMedia('(min-width: 768px)')
    wide.addEventListener('change', setup)
    return () => {
      wide.removeEventListener('change', setup)
      teardown()
    }
  }, [])

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      width={960}
      height={600}
      aria-hidden="true"
      className={className}
    >
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  )
}
