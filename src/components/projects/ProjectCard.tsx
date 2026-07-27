import { motion } from 'framer-motion'
import { type Project, type ProjectLink } from '../../data/projects'
import { localized } from '../../i18n/translations'
import { useTranslation } from '../../hooks/useTranslation'

interface ProjectCardProps {
  project: Project
  large?: boolean
}

export default function ProjectCard({ project, large }: ProjectCardProps) {
  const { t, lang } = useTranslation()
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={[
        'group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-xl',
        'dark:border-zinc-800 dark:bg-zinc-900',
        large ? 'lg:col-span-2' : '',
      ].join(' ')}
    >
      <div className={['relative overflow-hidden', large ? 'h-48 lg:h-56' : 'h-40'].join(' ')}>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className={[
              'h-full w-full bg-gradient-to-br transition-transform duration-500 group-hover:scale-105',
              project.gradient ?? 'from-zinc-500 to-zinc-700',
            ].join(' ')}
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-zinc-800 shadow-sm backdrop-blur dark:bg-zinc-950/80 dark:text-zinc-100">
          {t.projects.categories[project.category]}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-black/30 px-2.5 py-0.5 text-xs font-medium tracking-wider text-white/95 backdrop-blur">
          {project.year}
        </span>
        <div className="pointer-events-none absolute -right-2 -bottom-6 select-none">
          <span className="text-7xl font-black text-white/15">{initial(project.title)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {localized(lang, project.description, project.descriptionHr)}
        </p>

        {project.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {project.links && project.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
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
      className="hover:border-accent-300 hover:text-accent-700 dark:hover:border-accent-500/40 dark:hover:text-accent-300 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
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
  const word = title.replace(/[^A-Za-z]/g, '')
  return word.charAt(0).toUpperCase() || '·'
}
