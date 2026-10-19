import { useEffect, useRef } from 'react'

interface ProjectVideoProps {
  /** Public path without extension; `.webm` and `.mp4` siblings must exist. */
  src: string
  poster: string
  className?: string
}

/**
 * Short muted site preview that stays a still poster until it is wanted, so
 * nothing is downloaded up front (`preload="none"`).
 *
 * - Hover-capable pointers: plays while the surrounding card link is hovered
 *   or keyboard-focused, pauses when it is left.
 * - Touch screens: plays while the clip crosses the middle band of the
 *   viewport, so at most one clip runs as the visitor scrolls.
 * - Reduced motion: never plays; the poster stays.
 *
 * The markup is static (no autoplay attribute), so the prerendered HTML and
 * the first client render match; all behaviour is wired up after mount.
 */
export function ProjectVideo({ src, poster, className }: ProjectVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const play = () => {
      video.play().catch(() => {
        // Playback can be refused (e.g. data saver); the poster stays.
      })
    }
    const pause = () => video.pause()

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const card = video.closest('a') ?? video.parentElement
      if (!card) return
      card.addEventListener('pointerenter', play)
      card.addEventListener('pointerleave', pause)
      card.addEventListener('focusin', play)
      card.addEventListener('focusout', pause)
      return () => {
        card.removeEventListener('pointerenter', play)
        card.removeEventListener('pointerleave', pause)
        card.removeEventListener('focusin', play)
        card.removeEventListener('focusout', pause)
      }
    }

    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      // Only the middle 30% of the viewport counts as "in focus".
      { rootMargin: '-35% 0px -35% 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
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
