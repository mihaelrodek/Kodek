import type { PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { type Project, type ProjectLink } from '../../data/projects'
import { localized } from '../../i18n/translations'
import { useTranslation } from '../../hooks/useTranslation'
import { useMatchMedia } from '../../hooks/useMatchMedia'

interface ProjectCardProps {
  project: Project
  large?: boolean
}

export default function ProjectCard({ project, large }: ProjectCardProps) {
  const { t, lang } = useTranslation()
  // Touch devices "stick" a CSS/whileHover hover state after a tap since
  // there's no pointer to move away. Only offer the hover lift on devices
  // that report a true hover-capable pointer. Starts false (no match) on
  // both server and client so hydration markup agrees.
  const canHover = useMatchMedia('(hover: hover)')
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={canHover ? { y: -4 } : undefined}
      onPointerMove={onPointerMove}
      className={['spotlight-card group flex flex-col', large ? 'lg:col-span-2' : ''].join(' ')}
    >
      <div aria-hidden="true" className="spotlight-card-glow" />
      <span
        aria-hidden="true"
        className="group-hover:text-accent-600/15 dark:group-hover:text-accent-500/15 pointer-events-none absolute -top-8 -right-3 text-[11rem] leading-none font-black text-zinc-950/[0.04] transition-colors duration-500 select-none dark:text-white/[0.04]"
      >
        {initial(project.title)}
      </span>

      <div className="relative flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-6 flex size-16 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700">
          {project.logo ? (
            <img
              src={project.logo}
              alt=""
              width={64}
              height={64}
              loading="lazy"
              className="size-full object-contain p-2"
            />
          ) : (
            <span aria-hidden="true" className="text-accent-700 font-heading text-3xl">
              {initial(project.title)}
            </span>
          )}
        </div>
        <p className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
          <span className="bg-accent-600 dark:bg-accent-500 size-1.5 rounded-full" />
          {t.projects.categories[project.category]}
          {project.year && (
            <>
              <span aria-hidden="true">·</span>
              {project.year}
            </>
          )}
        </p>

        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="mt-6 h-40 w-full rounded-xl object-cover"
          />
        )}

        <h3
          className={[
            'mt-6 font-medium tracking-[-0.035em] text-zinc-900 dark:text-zinc-50',
            large ? 'text-3xl sm:text-4xl' : 'text-2xl',
          ].join(' ')}
        >
          {project.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {localized(lang, project.description, project.descriptionHr)}
        </p>

        {project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            {project.tags.map((tag, index) => (
              <li key={tag} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-accent-600 dark:text-accent-500">
                    /
                  </span>
                )}
                {tag}
              </li>
            ))}
          </ul>
        )}

        {project.links && project.links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-8">
            {project.links.map((link) => (
              <LinkButton key={link.href} link={link} />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  )
}

function LinkButton({ link }: { link: ProjectLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      className="focus-ring hover:border-accent-300 hover:text-accent-700 dark:hover:border-accent-500/40 dark:hover:text-accent-300 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-zinc-300 px-4 text-xs font-medium text-zinc-700 transition dark:border-zinc-700 dark:text-zinc-300"
    >
      <LinkIcon kind={link.icon} />
      {link.label}
    </a>
  )
}

function LinkIcon({ kind }: { kind: ProjectLink['icon'] }) {
  const props = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (kind === 'github') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    )
  }
  if (kind === 'document') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function initial(title: string): string {
  const match = title.match(/\p{L}/u)
  return match ? match[0].toUpperCase() : '·'
}
