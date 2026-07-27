/**
 * UI translations. Content data (timeline events, project descriptions) lives
 * in src/data/*.ts with optional `*Hr` fields; components pick the right one
 * with `localized()` below, falling back to English when a translation is
 * missing.
 */

export const SUPPORTED_LANGS = ['en', 'hr'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

/** Pick the Croatian variant of a content string when available. */
export function localized(lang: Lang, en: string, hr?: string): string {
  return lang === 'hr' && hr ? hr : en
}

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  hr: 'Hrvatski',
}

const en = {
  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
  },
  theme: {
    // One neutral label for both states: the button's markup must not depend
    // on the theme, or it would mismatch against the prerendered (light) HTML.
    toggle: 'Toggle dark mode',
  },
  language: {
    label: 'Language',
    short: { en: 'EN', hr: 'HR' } as Record<Lang, string>,
    switchTo: (l: string) => `Switch language to ${l}`,
  },
  home: {
    eyebrow: 'Mihael Rodek',
    titleA: 'A life in commits.',
    titleB: 'Scroll through it',
  },
  footer: {
    copyright: (year: number) => `© ${year} Mihael Rodek`,
    built: 'Built with React, TypeScript & Tailwind',
  },
  timeline: {
    ariaLabel: 'Life timeline',
    selectedProjects: 'Selected projects',
  },
  about: {
    title: 'About',
    body: "Short bio goes here. Write a paragraph or two about your background, what you enjoy working on, and what you're currently learning.",
    downloadCv: 'Download CV (PDF)',
  },
  projects: {
    eyebrow: 'Projects',
    title: "Things I've built.",
    intro: 'A mix of open source, university projects, and side experiments.',
    countSingular: (n: number) => `${n} project total.`,
    countPlural: (n: number) => `${n} projects total.`,
    all: 'All',
    categories: {
      'open-source': 'Open source',
      mobile: 'Mobile',
      web: 'Web',
      backend: 'Backend',
      iot: 'IoT',
      academic: 'Academic',
    },
    searchPlaceholder: 'Search projects…',
    searchAria: 'Search projects',
    sortAria: 'Sort projects',
    sortRecent: 'Most recent',
    sortOldest: 'Oldest first',
    sortAlpha: 'A → Z',
    showing: (n: number, m: number) => `Showing ${n} of ${m}`,
    clear: 'Clear filters',
    empty: {
      title: 'No projects match',
      body: 'Try a different category or clear the search.',
      reset: 'Clear filters',
    },
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Say hi.',
    intro:
      "Got a question, an opportunity, or just want to chat about Java, React, or a project you're working on? Drop a message — it lands in my inbox.",
    emailLabel: 'Email',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    cvLabel: 'CV',
    cvDownload: 'Download PDF',
    fields: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      optional: '(optional)',
      placeholder: "Tell me what's on your mind…",
    },
    submit: 'Send message',
    submitting: 'Sending…',
    success: 'Thanks — your message is on its way.',
    errors: {
      name: 'Your name, please.',
      emailRequired: 'I need an email to reply to.',
      emailInvalid: "That doesn't look like a valid email.",
      messageRequired: "Don't forget the message.",
      messageShort: 'A few more words — at least 10 characters.',
      network: 'Network error — please try again.',
      generic: (status: number) => `Submission failed (HTTP ${status}).`,
    },
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    body: "The page you're looking for doesn't exist.",
    back: 'Back home',
  },
}

export type Translations = typeof en

const hr: Translations = {
  nav: {
    home: 'Početna',
    about: 'O meni',
    projects: 'Projekti',
    contact: 'Kontakt',
  },
  theme: {
    toggle: 'Uključi/isključi tamni način',
  },
  language: {
    label: 'Jezik',
    short: { en: 'EN', hr: 'HR' },
    switchTo: (l: string) => `Promijeni jezik u ${l}`,
  },
  home: {
    eyebrow: 'Mihael Rodek',
    titleA: 'Život u commitovima.',
    titleB: 'Skrolaj kroz njega',
  },
  footer: {
    copyright: (year: number) => `© ${year} Mihael Rodek`,
    built: 'Izrađeno uz React, TypeScript i Tailwind',
  },
  timeline: {
    ariaLabel: 'Životna vremenska crta',
    selectedProjects: 'Odabrani projekti',
  },
  about: {
    title: 'O meni',
    body: 'Ovdje ide kratak životopis. Napiši nekoliko rečenica o sebi, što voliš raditi i što trenutno učiš.',
    downloadCv: 'Preuzmi životopis (PDF)',
  },
  projects: {
    eyebrow: 'Projekti',
    title: 'Stvari koje sam izradio.',
    intro: 'Mješavina open source projekata, fakultetskih radova i osobnih eksperimenata.',
    countSingular: (n: number) => `Ukupno ${n} projekt.`,
    countPlural: (n: number) => `Ukupno ${n} projekata.`,
    all: 'Sve',
    categories: {
      'open-source': 'Open source',
      mobile: 'Mobilno',
      web: 'Web',
      backend: 'Backend',
      iot: 'IoT',
      academic: 'Akademski',
    },
    searchPlaceholder: 'Pretraži projekte…',
    searchAria: 'Pretraži projekte',
    sortAria: 'Sortiraj projekte',
    sortRecent: 'Najnovije',
    sortOldest: 'Najstarije',
    sortAlpha: 'A → Z',
    showing: (n: number, m: number) => `Prikazano ${n} od ${m}`,
    clear: 'Očisti filtere',
    empty: {
      title: 'Nema rezultata',
      body: 'Pokušaj s drugom kategorijom ili očisti pretragu.',
      reset: 'Očisti filtere',
    },
  },
  contact: {
    eyebrow: 'Kontakt',
    title: 'Javi se.',
    intro:
      'Imaš pitanje, priliku ili samo želiš popričati o Javi, Reactu ili projektu na kojem radiš? Pošalji poruku — stiže direktno u moj inbox.',
    emailLabel: 'Email',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    cvLabel: 'Životopis',
    cvDownload: 'Preuzmi PDF',
    fields: {
      name: 'Ime',
      email: 'Email',
      subject: 'Predmet',
      message: 'Poruka',
      optional: '(neobavezno)',
      placeholder: 'Reci mi što ti je na umu…',
    },
    submit: 'Pošalji poruku',
    submitting: 'Šalje se…',
    success: 'Hvala — tvoja poruka je na putu.',
    errors: {
      name: 'Molim te, upiši ime.',
      emailRequired: 'Treba mi email za odgovor.',
      emailInvalid: 'To ne izgleda kao valjan email.',
      messageRequired: 'Ne zaboravi poruku.',
      messageShort: 'Još malo — barem 10 znakova.',
      network: 'Greška u mreži — pokušaj ponovno.',
      generic: (status: number) => `Slanje nije uspjelo (HTTP ${status}).`,
    },
  },
  notFound: {
    code: '404',
    title: 'Stranica nije pronađena',
    body: 'Stranica koju tražiš ne postoji.',
    back: 'Natrag na početnu',
  },
}

export const translations: Record<Lang, Translations> = { en, hr }
