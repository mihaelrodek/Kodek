/**
 * Groups of technologies shown as pill tags in the About page's Skills
 * section. Content is derived from what the rest of the site already states
 * about the person — `timeline.ts` tags/milestones, `projects.ts` tags, the
 * `knowsAbout` JSON-LD in `index.html`, and the Skills section of
 * `scripts/cv.html` — not invented independently. Keep it that way: add a
 * skill here only once it also shows up in one of those sources, or when the
 * owner confirms using it (Astro, Medusa, Node.js, PostgreSQL, Redis,
 * Keycloak, Firebase, Docker, Cloudflare, Quarkus, React Native, Vite).
 *
 * `titleHr` is an optional Croatian variant — components resolve it with
 * `localized()` (src/i18n/translations.ts), falling back to the English
 * `title` when missing (e.g. loanwords like "Backend" that read the same in
 * both languages).
 */
export interface SkillGroup {
  /** Stable id, used as React key. */
  id: string
  /** Group heading, e.g. "Backend". */
  title: string
  titleHr?: string
  /** Technology pills rendered under the heading. */
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      'Java',
      'Go',
      'Spring Boot',
      'Quarkus',
      'Node.js',
      'REST APIs',
      'Microservices',
      'Medusa',
      'PostgreSQL',
      'Redis',
      'Keycloak',
      'Firebase',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: ['React', 'Astro', 'Vite', 'TypeScript', 'HTML/CSS', 'Tailwind CSS'],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    titleHr: 'Mobilni razvoj',
    skills: ['Android', 'Kotlin', 'React Native'],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure & Tools',
    titleHr: 'Infrastruktura i alati',
    skills: ['Docker', 'Kubernetes', 'Helm', 'Cloudflare', 'Git', 'CI/CD', 'CLI'],
  },
]
