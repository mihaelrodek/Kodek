import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  Globe2,
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
import { BackgroundPaths } from '@/components/landing/BackgroundPaths'
import { DecodeWordmark } from '@/components/landing/DecodeWordmark'
import { DotField } from '@/components/landing/DotField'
import { ServiceVisual } from '@/components/landing/ServiceVisual'
import { SpotlightCard } from '@/components/landing/SpotlightCard'
import { useTranslation } from '@/hooks/useTranslation'
import { localized } from '@/i18n/translations'
import { projects } from '@/data/projects'
import { skillGroups } from '@/data/skills'

// Live, independently built platforms first, then the open-source plugin: the
// strongest proof of shipped work. Their history is disclosed in the section
// intro; these are not presented as Kodek commissions.
const SELECTED_IDS = ['bela-turniri', 'futsal-turniri', 'helm-file-utils']
const selectedProjects = SELECTED_IDS.flatMap((id) =>
  projects.filter((project) => project.id === id),
)
const serviceIcons = [Braces, Globe2, UserRound, Wrench]
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

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="section-eyebrow">{children}</p>
}

export default function HomePage() {
  const { t, lang } = useTranslation()
  const copy = t.landing
  return (
    <>
      <section
        className="bg-background relative isolate overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80 dark:bg-zinc-950"
        aria-labelledby="hero-heading"
      >
        <DotField />
        <div className="container-page relative">
          <div className="flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-14 pb-10 sm:pt-16">
            <div className="mb-8 inline-flex items-center gap-2.5 self-start rounded-full border border-zinc-200 bg-white/70 py-2 pr-4 pl-3 text-[10px] font-medium tracking-[0.06em] text-zinc-600 sm:text-xs dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
              <span className="bg-accent-500 size-1.5 shrink-0 rounded-full" />
              {copy.eyebrow}
            </div>
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
                    <Link to="/contact">
                      {copy.primaryCta}
                      <ArrowUpRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-full bg-white/60 px-6 text-sm dark:bg-zinc-950/50"
                  >
                    <Link to="/projects">
                      {copy.secondaryCta}
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-200/80 py-5 text-[10px] font-medium tracking-widest text-zinc-500 uppercase dark:border-zinc-800/80 dark:text-zinc-400">
            <span>{copy.disciplines}</span>
            <a
              href="#services"
              className="focus-ring inline-flex min-h-11 items-center gap-3 rounded-md"
            >
              {copy.scroll}
              <ArrowDown className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="landing-section container-page"
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
        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {copy.services.map((service, index) => {
            const Icon = serviceIcons[index]
            const wide = index === 0 || index === 3
            return (
              <Reveal
                key={service.title}
                delay={index * 0.08}
                className={wide ? 'lg:col-span-3' : 'lg:col-span-2'}
              >
                <SpotlightCard>
                  <div className="relative z-10 p-7 sm:p-9">
                    <div className="mb-8 flex items-center justify-between">
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
            <Link to="/contact">
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
          <ol className="mt-14 grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {copy.process.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 0.08}>
                  <div className="mb-7 flex items-center gap-4">
                    <span className="text-accent-700 dark:text-accent-300 flex size-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 font-mono text-xs dark:border-zinc-700">
                      0{index + 1}
                    </span>
                    <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {step.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
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
            <Link to="/projects">
              {copy.allWork}
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
        </Reveal>
        <ol className="mt-12 border-t border-zinc-200 dark:border-zinc-800">
          {selectedProjects.map((project, index) => (
            <li key={project.id}>
              <Reveal delay={index * 0.07}>
                <Link
                  to={`/projects?q=${encodeURIComponent(project.title)}`}
                  className="focus-ring group relative grid gap-x-10 gap-y-4 border-b border-zinc-200 py-9 md:grid-cols-[4rem_1.1fr_1fr_auto] md:items-center dark:border-zinc-800"
                >
                  <span
                    aria-hidden="true"
                    className="bg-accent-600 dark:bg-accent-500 absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                  <span className="group-hover:text-accent-600 dark:group-hover:text-accent-500 font-mono text-xs text-zinc-400 transition-colors dark:text-zinc-600">
                    0{index + 1}
                  </span>
                  <div className="transition-transform duration-500 ease-out md:group-hover:translate-x-3">
                    <h3 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 font-mono text-[10px] tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                      {t.projects.categories[project.category]} ·{' '}
                      {project.year && `${project.year} · `}
                      {(lang === 'hr' ? (project.tagsHr ?? project.tags) : project.tags)
                        .slice(0, 3)
                        .join(' / ')}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {localized(lang, project.description, project.descriptionHr)}
                  </p>
                  <span className="group-hover:border-accent-600 group-hover:bg-accent-600 dark:group-hover:border-accent-500 dark:group-hover:bg-accent-500 inline-flex size-12 items-center justify-center justify-self-start rounded-full border border-zinc-300 text-zinc-700 transition-colors duration-300 group-hover:text-white md:justify-self-end dark:border-zinc-700 dark:text-zinc-300">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                    <span className="sr-only">{copy.projectCta}</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section id="stack" className="pb-24 sm:pb-32" aria-labelledby="stack-heading">
        <div className="container-page text-center">
          <h2
            id="stack-heading"
            className="text-xs font-normal tracking-wide text-zinc-600 dark:text-zinc-400"
          >
            {copy.stackEyebrow}
          </h2>
        </div>
        <div className="marquee mt-9 space-y-4 overflow-hidden">
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
        <div className="grid items-center gap-10 rounded-2xl bg-zinc-50 p-7 sm:p-12 lg:grid-cols-[0.7fr_1fr] lg:gap-20 dark:bg-zinc-900/60">
          <Reveal className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs shadow-2xl shadow-zinc-950/20 sm:text-sm">
            <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3">
              <span className="bg-accent-600 size-2.5 rounded-full" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="ml-3 text-[10px] text-zinc-500">kodek — zsh</span>
            </div>
            <div className="space-y-5 p-5 leading-relaxed text-zinc-300 sm:p-7">
              <div>
                <p>
                  <span className="text-accent-500">$</span> whoami
                </p>
                <p className="mt-1 text-white">Mihael Rodek</p>
                <p className="text-zinc-500">
                  {copy.founderRole} · {copy.founderLocation}
                </p>
              </div>
              <div>
                <p>
                  <span className="text-accent-500">$</span> cat principles.txt
                </p>
                <ul className="mt-1">
                  {copy.founderPoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span aria-hidden="true" className="text-accent-500">
                        +
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <p aria-hidden="true">
                <span className="text-accent-500">$</span>{' '}
                <span className="decode-caret bg-accent-500 inline-block h-3.5 w-2 align-middle" />
              </p>
            </div>
          </Reveal>
          <Reveal>
            <Eyebrow>{copy.founderEyebrow}</Eyebrow>
            <h2 id="founder-heading" className="section-title">
              {copy.founderTitle}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {copy.founderBody}
            </p>
            <Button asChild variant="link" className="dark:text-accent-400 mt-5 px-0">
              <Link to="/about">
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
              to="/contact"
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

      <section
        id="start"
        className="bg-accent-50/50 dark:bg-accent-950/20 relative isolate overflow-hidden border-t border-zinc-200 py-20 text-center sm:py-28 dark:border-zinc-800"
        aria-labelledby="start-heading"
      >
        <BackgroundPaths />
        <Reveal className="container-page relative">
          <div className="border-accent-200 text-accent-700 dark:border-accent-800 dark:text-accent-300 mx-auto mb-7 flex size-12 items-center justify-center rounded-xl border bg-white dark:bg-zinc-900">
            <Code2 className="size-6" />
          </div>
          <Eyebrow>{copy.ctaEyebrow}</Eyebrow>
          <h2
            id="start-heading"
            className="mx-auto mt-5 max-w-3xl text-4xl leading-[1.12] font-medium tracking-[-0.045em] whitespace-pre-line sm:text-6xl"
          >
            {copy.ctaTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {copy.ctaBody}
          </p>
          <Button asChild className="mt-8 h-12 rounded-full px-7">
            <Link to="/contact">
              {copy.primaryCta}
              <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </Button>
          <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400">{copy.ctaNote}</p>
        </Reveal>
      </section>
    </>
  )
}
