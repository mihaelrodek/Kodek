import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  Globe2,
  MessagesSquare,
  PenTool,
  ReceiptText,
  Rocket,
  Search,
  UserRound,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DecodeWordmark } from '@/components/landing/DecodeWordmark'
import { DotField } from '@/components/landing/DotField'
import { ProjectVideo } from '@/components/landing/ProjectVideo'
import { ServiceVisual } from '@/components/landing/ServiceVisual'
import { SpotlightCard } from '@/components/landing/SpotlightCard'
import { useTranslation } from '@/hooks/useTranslation'
import { localized } from '@/i18n/translations'
import { founder } from '@/data/founder'
import { business } from '@/data/business'
import { projects, projectUrl } from '@/data/projects'
import { skillGroups } from '@/data/skills'

// Live websites and platforms in everyday use, shown with their screenshots.
// These are not presented as Kodek commissions; a missing id renders nothing.
// The first two (websites) share a row; the apps after them sit three across on desktop.
const SELECTED_IDS = [
  'opg-repic',
  'pikado-klub-snajperi',
  'bela-turniri',
  'futsal-turniri',
  'bela-games',
]
const WIDE_COUNT = 2
const selectedProjects = SELECTED_IDS.flatMap((id) =>
  projects.filter((project) => project.id === id),
)
const processIcons = [MessagesSquare, PenTool, Code2, Rocket]
const serviceIcons = [Braces, Globe2, UserRound, Search, ReceiptText, Wrench]
// Wide cards per row on desktop: 3+2, 2+3, 3+2.
const WIDE_SERVICES = new Set([0, 3, 4])
const stack = skillGroups.flatMap((group) => group.skills)
const stackRows = [
  stack.slice(0, Math.ceil(stack.length / 2)),
  stack.slice(Math.ceil(stack.length / 2)),
]

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ y: 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`min-w-0 ${className}`}
    >
      {children}
    </motion.div>
  )
}

/** A selected-work card opens the live site in a new tab, or the projects page when there is none. */
function WorkLink({
  href,
  to,
  className,
  children,
}: {
  href?: string
  to: string
  className: string
  children: ReactNode
}) {
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="section-eyebrow">{children}</p>
}

export default function HomePage() {
  const { t, lang, path } = useTranslation()
  const copy = t.landing
  // Keep the blinking underscore glued to the last word so it never wraps alone.
  const ctaWords = copy.ctaTitle.split(' ')
  const ctaLast = ctaWords.pop()
  const ctaLead = ctaWords.join(' ')
  return (
    <>
      <section
        className="bg-background relative isolate overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80 dark:bg-zinc-950"
        aria-labelledby="hero-heading"
      >
        <DotField />
        <div className="container-page relative">
          <div className="flex flex-col pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-36 lg:pb-28">
            <DecodeWordmark />
            <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
              <h1
                id="hero-heading"
                className="hero-heading text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.05] font-medium tracking-[-0.05em]"
              >
                <span className="block">{copy.titleA}</span>
                <span className="text-accent-600 dark:text-accent-500 block">{copy.titleB}</span>
              </h1>
              <div>
                <p className="max-w-[460px] text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
                  {copy.intro}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild className="h-12 rounded-full px-6 text-sm">
                    <Link to={path('contact')}>
                      {copy.primaryCta}
                      <ArrowUpRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-full bg-white/60 px-6 text-sm dark:bg-zinc-950/50"
                  >
                    <Link to={path('projects')}>
                      {copy.secondaryCta}
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="landing-section container-page pt-16 sm:pt-24"
        aria-labelledby="services-heading"
      >
        <Reveal className="section-heading-row">
          <div>
            <Eyebrow>{copy.servicesEyebrow}</Eyebrow>
            <h2 id="services-heading" className="section-title">
              {copy.servicesTitle}
            </h2>
          </div>
          <p className="section-description">{copy.servicesIntro}</p>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {copy.services.map((service, index) => {
            const Icon = serviceIcons[index]
            const wide = WIDE_SERVICES.has(index)
            return (
              <Reveal
                key={service.title}
                delay={index * 0.08}
                className={wide ? 'lg:col-span-3' : 'lg:col-span-2'}
              >
                <SpotlightCard>
                  <div className="relative z-10 p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="group-hover:border-accent-600 group-hover:bg-accent-600 dark:group-hover:border-accent-500 dark:group-hover:bg-accent-500 flex size-11 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors duration-500 group-hover:text-white dark:border-zinc-700 dark:text-zinc-300">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-500">
                        0{index + 1} / 0{copy.services.length}
                      </span>
                    </div>
                    <h3 className="text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-[420px] text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {service.body}
                    </p>
                    <p className="text-accent-700 dark:text-accent-400 mt-5 font-mono text-[10px] font-medium tracking-[0.09em] uppercase">
                      {service.tag}
                    </p>
                  </div>
                  <ServiceVisual kind={index} />
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
        <div className="mt-7 text-center">
          <Button asChild variant="link" className="dark:text-accent-400 rounded-md">
            <Link to={path('contact')}>
              {copy.serviceCta}
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section
        id="process"
        className="landing-section border-y border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/35"
        aria-labelledby="process-heading"
      >
        <div className="container-page">
          <Reveal className="section-heading-row">
            <div>
              <Eyebrow>{copy.processEyebrow}</Eyebrow>
              <h2 id="process-heading" className="section-title">
                {copy.processTitle}
              </h2>
            </div>
            <p className="section-description">{copy.processIntro}</p>
          </Reveal>
          <Reveal className="mt-12">
            <ol className="grid overflow-hidden rounded-3xl border border-zinc-200 bg-white sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              {copy.process.map((step, index) => {
                const Icon = processIcons[index]
                return (
                  <li
                    key={step.title}
                    className="relative border-zinc-200 p-7 not-first:border-t sm:p-8 lg:border-t-0 lg:not-first:border-l dark:border-zinc-800 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l"
                  >
                    {/* Progress segment: fills step by step once the row scrolls into view. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-zinc-100 dark:bg-zinc-900"
                    />
                    <motion.span
                      aria-hidden="true"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.35, ease: 'easeOut' }}
                      className="bg-accent-600 dark:bg-accent-500 absolute inset-x-0 top-0 h-1 origin-left"
                    />
                    <div className="flex items-start justify-between">
                      <span className="bg-accent-50 text-accent-700 dark:bg-accent-950/60 dark:text-accent-300 flex size-11 items-center justify-center rounded-xl">
                        <Icon className="size-5" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-heading text-5xl leading-none font-bold text-zinc-200 dark:text-zinc-800"
                      >
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-medium">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {step.body}
                    </p>
                  </li>
                )
              })}
            </ol>
          </Reveal>
        </div>
      </section>

      <section id="work" className="landing-section container-page" aria-labelledby="work-heading">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{copy.workEyebrow}</Eyebrow>
            <h2 id="work-heading" className="section-title">
              {copy.workTitle}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {copy.workIntro}
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link to={path('projects')}>
              {copy.allWork}
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </Reveal>
        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-6">
          {selectedProjects.map((project, index) => (
            <li
              key={project.id}
              className={`min-w-0 ${index < WIDE_COUNT ? 'lg:col-span-3' : 'lg:col-span-2'}`}
            >
              <Reveal delay={(index % 2) * 0.07}>
                <WorkLink
                  href={projectUrl(project)}
                  to={`${path('projects')}?q=${encodeURIComponent(project.title)}`}
                  className="focus-ring group block rounded-xl"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                    {project.video && project.image ? (
                      <ProjectVideo
                        src={project.video}
                        poster={project.image}
                        className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : project.image ? (
                      <img
                        src={project.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={1280}
                        height={800}
                        className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        {project.logo && (
                          <img
                            src={project.logo}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="size-20 object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3
                        className={`group-hover:text-accent-600 dark:group-hover:text-accent-400 font-medium tracking-[-0.035em] transition-colors ${
                          index < WIDE_COUNT ? 'text-2xl sm:text-3xl' : 'text-2xl'
                        }`}
                      >
                        {project.title}
                      </h3>
                      <p className="mt-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                        {t.projects.categories[project.category]} ·{' '}
                        {(lang === 'hr' ? (project.tagsHr ?? project.tags) : project.tags)
                          .slice(0, 3)
                          .join(' / ')}
                      </p>
                    </div>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="group-hover:text-accent-600 dark:group-hover:text-accent-400 mt-1.5 size-5 shrink-0 text-zinc-400 transition-transform duration-300 group-hover:rotate-45"
                    />
                  </div>
                  <p className="mt-2 truncate text-sm text-zinc-600 dark:text-zinc-400">
                    {localized(
                      lang,
                      project.summary ?? project.description,
                      project.summaryHr ?? project.descriptionHr,
                    )}
                  </p>
                  <span className="sr-only">{copy.projectCta}</span>
                </WorkLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section id="stack" className="pb-24 sm:pb-32" aria-label={copy.stackIntro}>
        <div className="marquee space-y-4 overflow-hidden">
          {stackRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`marquee-track ${rowIndex === 1 ? 'marquee-track-reverse' : ''}`}
            >
              {/* The second copy only exists to loop the track seamlessly. */}
              {[0, 1].map((copyIndex) => (
                <ul key={copyIndex} aria-hidden={copyIndex === 1} className="flex shrink-0">
                  {[...row, ...row].map((skill, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-8 pr-8 text-3xl font-medium tracking-[-0.04em] whitespace-nowrap text-zinc-300 sm:text-5xl dark:text-zinc-700"
                    >
                      <span className="hover:text-accent-600 dark:hover:text-accent-500 transition-colors duration-300">
                        {skill}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-accent-600 dark:text-accent-500 text-xl"
                      >
                        /
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>
        <p className="container-page mt-9 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {copy.stackIntro}
        </p>
      </section>

      <section
        id="founder"
        className="container-page pb-24 sm:pb-32"
        aria-labelledby="founder-heading"
      >
        <div className="grid items-center gap-8 rounded-2xl bg-zinc-50 p-6 sm:p-8 lg:grid-cols-[260px_1fr] lg:gap-14 dark:bg-zinc-900/60">
          <Reveal>
            <figure className="mx-auto w-full max-w-[260px] lg:mx-0">
              {founder.photo ? (
                <img
                  src={founder.photo}
                  alt={t.about.photoAlt}
                  width={792}
                  height={1188}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
                />
              ) : (
                <div
                  role="img"
                  aria-label={t.about.photoAlt}
                  className="from-accent-800 to-accent-500 font-heading flex aspect-[4/5] w-full items-end rounded-2xl bg-gradient-to-br p-6 text-6xl font-bold text-white/90 sm:text-7xl"
                >
                  {founder.initials}
                </div>
              )}
            </figure>
          </Reveal>
          <Reveal>
            <Eyebrow>{copy.founderEyebrow}</Eyebrow>
            <h2 id="founder-heading" className="section-title">
              {copy.founderTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
              {copy.founderBody}
            </p>
            <Button asChild variant="link" className="dark:text-accent-400 mt-4 px-0">
              <Link to={path('about')}>
                {copy.founderCta}
                <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="container-page pb-24 sm:pb-32" aria-labelledby="faq-heading">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>{copy.faqEyebrow}</Eyebrow>
            <h2 id="faq-heading" className="section-title">
              {copy.faqTitle}
            </h2>
            <Link
              to={path('contact')}
              className="focus-ring hover:text-accent-700 dark:hover:text-accent-300 mt-5 inline-flex min-h-11 items-center gap-2 rounded text-sm text-zinc-600 dark:text-zinc-400"
            >
              {copy.faqIntro}
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal>
            <Accordion type="single" collapsible>
              {copy.faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="border-zinc-200 dark:border-zinc-800"
                >
                  <AccordionTrigger className="rounded-none py-5 pr-1 text-sm font-medium text-zinc-900 hover:no-underline sm:text-base dark:text-zinc-100">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pr-6 pb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section id="start" className="container-page pb-24 sm:pb-32" aria-labelledby="start-heading">
        <Reveal>
          <div className="bg-accent-800 relative isolate overflow-hidden rounded-3xl px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -right-32 -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(66,100,227,0.55),transparent_65%)]"
            />
            <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
              <div>
                <h2
                  id="start-heading"
                  className="text-4xl leading-[1.08] font-medium tracking-[-0.045em] text-white sm:text-6xl dark:text-white"
                >
                  {ctaLead}{' '}
                  <span className="whitespace-nowrap">
                    {ctaLast}
                    <span
                      aria-hidden="true"
                      className="decode-caret ml-[0.12em] inline-block h-[0.12em] w-[0.55em] bg-white/80"
                    />
                  </span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                  {copy.ctaBody}
                </p>
              </div>
              <div className="flex flex-col items-start gap-5 lg:items-end">
                <Button
                  asChild
                  className="text-accent-800 hover:bg-accent-50 hover:text-accent-900 h-12 rounded-full bg-white px-7"
                >
                  <Link to={path('contact')}>
                    {copy.ctaButton}
                    <ArrowUpRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <p className="text-sm text-white/65 lg:text-right">
                  {copy.ctaEmailLabel}{' '}
                  <a
                    href={`mailto:${business.email}`}
                    className="focus-ring rounded font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {business.email}
                  </a>
                  <span aria-hidden="true"> · </span>
                  <a
                    href={business.phoneHref}
                    className="focus-ring rounded font-medium whitespace-nowrap text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {business.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
