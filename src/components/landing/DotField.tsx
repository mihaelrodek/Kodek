import { useEffect, useRef } from 'react'

const GAP = 30
const REACH = 190

/**
 * Hero backdrop: a dot grid with a slow travelling wave; dots near the pointer
 * swell and turn red, and a soft glow follows the cursor. The canvas is empty
 * in the prerendered markup and only draws after mount. It pauses offscreen
 * and renders a single static frame under prefers-reduced-motion.
 */
export function DotField() {
  const wrapper = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = wrapper.current
    const node = canvas.current
    const context = node?.getContext('2d')
    if (!host || !node || !context) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -9999, y: -9999 }
    let width = 0
    let height = 0
    let frame = 0
    let visible = true

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = host.clientWidth
      height = host.clientHeight
      node.width = width * ratio
      node.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time: number) => {
      const dark = document.documentElement.classList.contains('dark')
      const base = dark ? '255,255,255' : '24,24,27'
      context.clearRect(0, 0, width, height)
      for (let x = GAP / 2; x < width; x += GAP) {
        for (let y = GAP / 2; y < height; y += GAP) {
          const wave = Math.sin((x + y) * 0.012 - time * 0.0011) * 0.5 + 0.5
          const near = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / REACH)
          const radius = 0.9 + wave * 0.5 + near * 1.6
          context.beginPath()
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.fillStyle =
            near > 0.02
              ? `rgba(66,100,227,${0.2 + near * 0.5})`
              : `rgba(${base},${0.07 + wave * 0.2})`
          context.fill()
        }
      }
    }

    const loop = (time: number) => {
      draw(time)
      if (visible && !still) frame = requestAnimationFrame(loop)
    }

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      host.style.setProperty('--glow-x', `${pointer.x}px`)
      host.style.setProperty('--glow-y', `${pointer.y}px`)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible && !still) frame = requestAnimationFrame(loop)
    })
    const resizer = new ResizeObserver(() => {
      resize()
      if (still) draw(0)
    })

    resize()
    observer.observe(host)
    resizer.observe(host)
    window.addEventListener('pointermove', onMove, { passive: true })
    if (still) draw(0)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizer.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas
        ref={canvas}
        className="h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)]"
      />
      <div className="hero-glow absolute inset-0" />
    </div>
  )
}
