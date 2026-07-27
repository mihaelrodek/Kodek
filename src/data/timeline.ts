/**
 * Compact note nested under a TimelineEvent. Use for things that belong
 * inside a life chapter rather than standing on their own — e.g. specific
 * client projects under "Joined True North".
 *
 * `*Hr` fields are optional Croatian variants — components fall back to the
 * English field via `localized()` (src/i18n/translations.ts) when missing.
 */
export interface TimelineMilestone {
  id: string
  /** Display year or range, e.g. "Oct 2021 — Oct 2023". */
  year: string
  yearHr?: string
  title: string
  /** One-line description. Keep it short — this renders in a tight list. */
  description: string
  descriptionHr?: string
}

export interface TimelineEvent {
  /** Stable id, used as React key and as an anchor target (#id). */
  id: string
  /** Display year or range, e.g. "2000", "2014 — 2018", "Oct 2023 — Present". */
  year: string
  yearHr?: string
  /** Numeric year used by the sticky side marker (start year of the event). */
  sortYear: number
  /** Optional finer-grained ordering within a year (lower = earlier). */
  sortMonth?: number
  /** Short label, e.g. "Birth", "Gymnasium Ivanec", "MSc — FER". */
  title: string
  titleHr?: string
  /** Optional subtitle, e.g. location or org. */
  subtitle?: string
  subtitleHr?: string
  /** A short paragraph or two describing this chapter. */
  description: string
  descriptionHr?: string
  /** Public path to the image, or external URL. Falls back to a placeholder. */
  image?: string
  /** Alt text for the image. */
  imageAlt?: string
  /** Optional small "tags" rendered as chips, e.g. ["Java", "React"]. */
  tags?: string[]
  /**
   * Optional sub-items rendered as a list under the description.
   * Use for client projects within a job, courses within a degree, etc.
   */
  milestones?: TimelineMilestone[]
}

// TODO(mihael): adjust birth year, elementary school years, and any other
// dates that aren't already exact. Drop real photos into `public/timeline/`
// and reference them by `/timeline/your-image.jpg`.
export const timelineEvents: TimelineEvent[] = [
  {
    id: 'birth',
    year: '1999',
    sortYear: 1999,
    sortMonth: 1,
    title: 'Born',
    titleHr: 'Rođen',
    subtitle: 'Croatia',
    subtitleHr: 'Hrvatska',
    description: 'The very beginning. Born in Croatia — the journey starts here.',
    descriptionHr: 'Sam početak. Rođen u Hrvatskoj — putovanje počinje ovdje.',
    imageAlt: 'A baby photo placeholder',
  },
  {
    id: 'elementary-school',
    year: '2006 — 2014',
    sortYear: 2006,
    title: 'Elementary school',
    titleHr: 'Osnovna škola',
    subtitle: 'Croatia',
    subtitleHr: 'Hrvatska',
    description:
      'Eight years of elementary school. First taste of math competitions and a growing curiosity for how things work.',
    descriptionHr:
      'Osam godina osnovne škole. Prvi susret s matematičkim natjecanjima i sve veća znatiželja o tome kako stvari rade.',
    imageAlt: 'Elementary school years',
  },
  {
    id: 'gymnasium',
    year: '2014 — 2018',
    sortYear: 2014,
    title: 'Gymnasium Ivanec',
    titleHr: 'Gimnazija Ivanec',
    subtitle: 'High school in Ivanec',
    subtitleHr: 'Srednja škola u Ivancu',
    description:
      'Participated in several inter-county competitions, STEM festivals, and summer camps — including a national mathematics competition. Took weekly advanced classes at the Center of Excellence in Varaždin.',
    descriptionHr:
      'Sudjelovao na više međužupanijskih natjecanja, STEM festivala i ljetnih kampova — uključujući državno natjecanje iz matematike. Pohađao tjednu dodatnu nastavu u Centru izvrsnosti u Varaždinu.',
    imageAlt: 'High school years in Ivanec',
    tags: ['Math', 'STEM', 'Competitions'],
  },
  {
    id: 'fer',
    year: '2018 — 2023',
    sortYear: 2018,
    title: 'MSc in Computer Engineering — FER',
    titleHr: 'Diplomski studij računarstva — FER',
    subtitle: 'Faculty of Electrical Engineering and Computing, University of Zagreb',
    subtitleHr: 'Fakultet elektrotehnike i računarstva, Sveučilište u Zagrebu',
    description:
      "Strengthened expertise in software development with a focus on OOP, Android, Marko Čupić's Expert Java course, Web & Mobile, and Artificial Intelligence. Side projects (ShowsApp, MenzaApp, PizzaDeliveryApp, Smart Agriculture) live on the Projects page.",
    descriptionHr:
      'Produbio znanje razvoja softvera s fokusom na OOP, Android, kolegij Expert Java Marka Čupića, web i mobilne aplikacije te umjetnu inteligenciju. Studentski projekti (ShowsApp, MenzaApp, PizzaDeliveryApp, Smart Agriculture) nalaze se na stranici Projekti.',
    imageAlt: 'Studying at FER',
    tags: ['Java', 'Android', 'Spring Boot', 'AI'],
  },
  {
    id: 'true-north',
    year: 'Oct 2021 — Present',
    yearHr: 'lis 2021. — danas',
    sortYear: 2021,
    sortMonth: 10,
    title: 'Joined True North',
    titleHr: 'Početak u True Northu',
    subtitle: 'Full Stack Developer (started as student)',
    subtitleHr: 'Full Stack Developer (počeo kao student)',
    description:
      'Full-stack work in Go, Java, and React across banking and public-sector domains — combining hands-on development with a consultative approach to defining requirements and delivering features end-to-end.',
    descriptionHr:
      'Full-stack razvoj u Gou, Javi i Reactu u bankarskim i javnim domenama — praktičan razvoj uz konzultantski pristup definiranju zahtjeva i isporuci funkcionalnosti od početka do kraja.',
    imageAlt: 'Starting at True North',
    tags: ['Java', 'Go', 'React', 'TypeScript'],
    milestones: [
      {
        id: 'akd-squid2',
        year: 'Oct 2021 — Oct 2023',
        yearHr: 'lis 2021. — lis 2023.',
        title: 'AKD Squid2',
        description:
          'Microservices platform for card issuing and production management — backend and frontend work across new features, maintenance, and continuous improvement.',
        descriptionHr:
          'Mikroservisna platforma za izdavanje kartica i upravljanje proizvodnjom — backend i frontend rad na novim funkcionalnostima, održavanju i kontinuiranom unapređenju.',
      },
      {
        id: 'hzmo',
        year: 'Dec 2022 — Feb 2023',
        yearHr: 'pro 2022. — velj 2023.',
        title: 'HZMO',
        description:
          "Sole frontend developer on an application that calculates a user's share of the family pension.",
        descriptionHr:
          'Jedini frontend developer na aplikaciji koja izračunava korisnikov udio obiteljske mirovine.',
      },
      {
        id: 'rba',
        year: 'Oct 2023 — Present',
        yearHr: 'lis 2023. — danas',
        title: 'RBA.hr — Card Issuing team',
        description:
          'Building and maintaining a new card platform within the RBA Croatia group — features, platform migration, daily incident handling, and production support.',
        descriptionHr:
          'Razvoj i održavanje nove kartične platforme unutar grupe RBA Hrvatska — funkcionalnosti, migracija platforme, svakodnevno rješavanje incidenata i produkcijska podrška.',
      },
    ],
  },
  {
    id: 'msc-graduation',
    year: '2023',
    sortYear: 2023,
    sortMonth: 7,
    title: 'Graduated — univ. mag. ing. comp.',
    titleHr: 'Diplomirao — univ. mag. ing. comp.',
    subtitle: "Master's thesis: Student canteen Android application",
    subtitleHr: 'Diplomski rad: Android aplikacija studentske menze',
    description:
      "Wrapped up the MSc at FER. Bachelor's thesis covered a system for supporting interactive applications and video games on a video wall.",
    descriptionHr:
      'Završen diplomski studij na FER-u. Završni rad pokrivao je sustav za potporu interaktivnim aplikacijama i videoigrama na videozidu.',
    imageAlt: 'MSc graduation',
    tags: ['Android', 'Thesis'],
  },
]
