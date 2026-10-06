import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { business } from '../data/business'
import { founder } from '../data/founder'
import { skillGroups } from '../data/skills'
import { localized } from '../i18n/translations'
import { useTranslation } from '../hooks/useTranslation'

/**
 * Founder profile for the Kodek business site. Deliberately not a CV: one
 * portrait, professional experience, a single education line, how I work,
 * and a call to action. The former personal timeline lives in
 * AboutTimelinePage.tsx and is not routed.
 */
export default function AboutPage() {
  const { t, lang } = useTranslation()
  const copy = t.about
  const { career, degree, graduation } = founder

  const externalLinks = [
    { href: business.social.linkedin, label: t.contact.linkedinLabel },
    { href: business.social.github, label: t.contact.githubLabel },
  ]

  return (
    <>
      <section
        className="container-page pt-14 pb-20 sm:pt-20 sm:pb-24"
        aria-labelledby="founder-name"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <figure className="mx-auto w-full max-w-sm lg:max-w-none">
            {founder.photo ? (
              <img
                src={founder.photo}
                alt={copy.photoAlt}
                width={640}
                height={800}
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
            ) : (
              <div
                role="img"
                aria-label={copy.photoAlt}
                className="from-accent-800 to-accent-500 font-heading flex aspect-[4/5] w-full items-end rounded-2xl bg-gradient-to-br p-6 text-6xl font-bold text-white/90 sm:text-7xl"
              >
                {founder.initials}
              </div>
            )}
          </figure>

          <div>
            <p className="section-eyebrow">{copy.eyebrow}</p>
            <h1
              id="founder-name"
              className="mt-5 text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.055em]"
            >
              {business.owner}
            </h1>
            <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">{copy.role}</p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 sm:text-xl dark:text-zinc-300">
              {copy.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild className="h-12 rounded-full px-6 text-sm">
                <Link to="/contact">
                  {copy.ctaButton}
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </Button>
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex min-h-11 items-center rounded-md text-sm text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/cv.pdf"
                download
                className="focus-ring inline-flex min-h-11 items-center rounded-md text-sm text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-white"
              >
                {copy.downloadCv}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-zinc-200 dark:border-zinc-800"
        aria-labelledby="founder-experience"
      >
        <div className="container-page py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="section-eyebrow">{copy.experienceEyebrow}</p>
              <h2 id="founder-experience" className="section-title">
                {career.title === 'Joined True North' ? 'True North' : career.title}
              </h2>
              <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {localized(lang, career.subtitle ?? '', career.subtitleHr)} ·{' '}
                {localized(lang, career.year, career.yearHr)}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {localized(lang, career.description, career.descriptionHr)}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
                {copy.experienceIntro}
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {(career.milestones ?? []).map((milestone) => (
                <li
                  key={milestone.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60"
                >
                  <p className="font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                    {localized(lang, milestone.year, milestone.yearHr)}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {localized(lang, milestone.description, milestone.descriptionHr)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="border-t border-zinc-200 dark:border-zinc-800"
        aria-labelledby="founder-education"
      >
        <div className="container-page py-14 sm:py-16">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <p className="section-eyebrow">{copy.educationEyebrow}</p>
            <dl className="grid gap-x-10 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                {localized(lang, degree.year, degree.yearHr)}
              </dt>
              <dd>
                <h2
                  id="founder-education"
                  className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  {localized(lang, degree.title, degree.titleHr)}
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  {localized(lang, degree.subtitle ?? '', degree.subtitleHr)}
                </p>
              </dd>
              <dt className="font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                {localized(lang, graduation.year, graduation.yearHr)}
              </dt>
              <dd>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {localized(lang, graduation.title, graduation.titleHr)}
                </p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  {localized(lang, graduation.subtitle ?? '', graduation.subtitleHr)}
                </p>
              </dd>
            </dl>
          </div>
        </div>
      </section>

      <section
        className="border-t border-zinc-200 dark:border-zinc-800"
        aria-labelledby="founder-skills"
      >
        <div className="container-page py-20 sm:py-24">
          <div className="max-w-2xl">
            <h2 id="founder-skills" className="text-3xl sm:text-4xl">
              {copy.skillsTitle}
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">{copy.skillsIntro}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60"
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

      <section
        className="border-t border-zinc-200 dark:border-zinc-800"
        aria-labelledby="founder-principles"
      >
        <div className="container-page py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="section-eyebrow">{copy.principlesEyebrow}</p>
              <h2 id="founder-principles" className="section-title">
                {copy.principlesTitle}
              </h2>
            </div>
            <ol className="grid gap-8 sm:grid-cols-3">
              {copy.principles.map((principle, index) => (
                <li key={principle.title}>
                  <p className="text-accent-700 dark:text-accent-300 font-mono text-[10px] font-medium tracking-[0.12em]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {principle.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-page pb-24 sm:pb-32" aria-labelledby="founder-cta">
        <div className="flex flex-col gap-6 rounded-2xl bg-zinc-50 p-7 sm:p-12 md:flex-row md:items-center md:justify-between dark:bg-zinc-900/60">
          <div>
            <h2 id="founder-cta" className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
              {copy.ctaTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{copy.ctaBody}</p>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-full px-6 text-sm">
            <Link to="/contact">
              {copy.ctaButton}
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
