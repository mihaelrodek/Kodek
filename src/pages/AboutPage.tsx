import Timeline from '../components/timeline/Timeline'
import { skillGroups } from '../data/skills'
import { localized } from '../i18n/translations'
import { useTranslation } from '../hooks/useTranslation'

export default function AboutPage() {
  const { t, lang } = useTranslation()

  return (
    <>
      <section aria-labelledby="about-timeline-heading">
        <h1 id="about-timeline-heading" className="sr-only">
          {t.about.timelineTitle}
        </h1>

        <a
          href="#timeline-end"
          className="focus-ring focus:bg-accent-600 sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-1/2 focus:z-50 focus:inline-flex focus:min-h-11 focus:-translate-x-1/2 focus:items-center focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          {t.timeline.skip}
        </a>

        <Timeline />
        <div id="timeline-end" tabIndex={-1} className="scroll-mt-20 outline-none" />
      </section>

      <section
        aria-labelledby="about-skills-heading"
        className="border-t border-zinc-200 dark:border-zinc-800"
      >
        <div className="container-page py-20 sm:py-24">
          <div className="mb-16 max-w-2xl">
            <p className="section-eyebrow">Mihael Rodek · {t.about.eyebrow}</p>
            <p className="mt-5 text-lg leading-relaxed text-zinc-700 sm:text-xl dark:text-zinc-300">
              {t.about.body}
            </p>
            <a
              href="/cv.pdf"
              download
              className="focus-ring bg-accent-600 hover:bg-accent-700 mt-8 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-sm transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t.about.downloadCv}
            </a>
          </div>
          <div className="max-w-2xl">
            <h2 id="about-skills-heading" className="text-3xl sm:text-4xl">
              {t.about.skillsTitle}
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t.about.skillsIntro}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {localized(lang, group.title, group.titleHr)}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
