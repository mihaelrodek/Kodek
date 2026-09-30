export type ProjectCategory =
  | 'open-source'
  | 'mobile'
  | 'web'
  | 'backend'
  | 'iot'
  | 'academic'
  | 'personal'

export interface ProjectLink {
  label: string
  href: string
  icon?: 'github' | 'external' | 'document'
}

export interface Project {
  id: string
  title: string
  description: string
  /** Optional Croatian variant — components fall back to `description`. */
  descriptionHr?: string
  year?: string
  sortYear?: number
  category: ProjectCategory
  tags: string[]
  links?: ProjectLink[]
  featured?: boolean
  gradient?: string
  image?: string
  logo?: string
}

// Category display labels live in src/i18n/translations.ts (t.projects.categories)
// — keep this list of valid categories in sync with that translation key.

const GRADIENTS = {
  blue: 'from-blue-600 via-blue-500 to-sky-400',
  sky: 'from-sky-500 via-cyan-500 to-teal-500',
  amber: 'from-amber-500 via-orange-500 to-rose-500',
  emerald: 'from-emerald-500 via-teal-500 to-cyan-500',
  cobalt: 'from-blue-800 via-blue-600 to-sky-500',
  rose: 'from-rose-500 via-pink-500 to-red-500',
  lime: 'from-lime-500 via-green-500 to-emerald-500',
}

export const projects: Project[] = [
  {
    id: 'helm-file-utils',
    title: 'Helm File Utils',
    description:
      'Helm downloader plugin supporting file conversions, encoding, decoding, and other manipulation utilities. Maintained as part of True North Engineering open source.',
    descriptionHr:
      'Helm downloader plugin koji podržava konverzije datoteka, kodiranje, dekodiranje i druge alate za manipulaciju. Održavan kao dio True North Engineering open sourcea.',
    year: '2023',
    sortYear: 2023,
    category: 'open-source',
    tags: ['Go', 'Helm', 'Kubernetes', 'CLI'],
    featured: true,
    gradient: GRADIENTS.cobalt,
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/true-north-engineering/helm-file-utils',
        icon: 'github',
      },
    ],
  },
  {
    id: 'showsapp',
    title: 'ShowsApp',
    description:
      'Android application that fetches and displays TV shows from a given API. Built during Infinum Summer School with a focus on modern Android architecture patterns.',
    descriptionHr:
      'Android aplikacija koja dohvaća i prikazuje TV serije iz zadanog API-ja. Izrađena tijekom Infinum Summer Schoola s fokusom na moderne Android arhitekturne obrasce.',
    year: '2020',
    sortYear: 2020,
    category: 'mobile',
    tags: ['Android', 'Kotlin', 'REST API', 'Infinum'],
    gradient: GRADIENTS.blue,
  },
  {
    id: 'pizza-delivery',
    title: 'PizzaDeliveryApp',
    description:
      'Spring Boot REST API for managing pizza deliveries — orders, drivers, and dispatch. Built during Agency04 Summer School to practice clean backend design.',
    descriptionHr:
      'Spring Boot REST API za upravljanje dostavama pizza — narudžbe, vozači i dispečiranje. Izrađen tijekom Agency04 Summer Schoola za vježbanje čistog backend dizajna.',
    year: '2021',
    sortYear: 2021,
    category: 'backend',
    tags: ['Java', 'Spring Boot', 'REST', 'Agency04'],
    gradient: GRADIENTS.amber,
    featured: true,
  },
  {
    id: 'menza-app',
    title: 'MenzaApp',
    description:
      'Academic Android application for the FER student canteen, developed as part of an undergraduate project at FER with a focus on everyday student life.',
    descriptionHr:
      'Akademska Android aplikacija za studentsku menzu FER-a, izrađena u sklopu preddiplomskog projekta na FER-u s fokusom na svakodnevni studentski život.',
    year: '2022',
    sortYear: 2022,
    category: 'academic',
    tags: ['Android', 'Kotlin', 'Thesis'],
    gradient: GRADIENTS.rose,
    links: [
      {
        label: 'Thesis (FER)',
        href: 'https://zir.nsk.hr/islandora/object/fer:10086',
        icon: 'document',
      },
    ],
  },
  {
    id: 'humanitarian-dog-walkers',
    title: 'Humanitarian Dog Walkers',
    description:
      'Academic web application built as a group project for the Software Engineering course at FER, connecting volunteer dog walkers with shelters.',
    descriptionHr:
      'Akademska web aplikacija izrađena u sklopu grupnog projekta na kolegiju Programsko inženjerstvo na FER-u, koja povezuje volonterske šetače pasa sa skloništima.',
    year: '2021',
    sortYear: 2021,
    category: 'web',
    tags: ['Web', 'Group project', 'Software Engineering'],
    gradient: GRADIENTS.emerald,
  },
  {
    id: 'smart-agriculture',
    title: 'SmartAgriculture',
    description:
      'Academic IoT project developed at FER: measuring soil, temperature and humidity sensor values with Waspmote and Pycom devices, displayed in companion Android and iOS apps.',
    descriptionHr:
      'Akademski IoT projekt izrađen na FER-u: mjerenje vrijednosti senzora tla, temperature i vlažnosti uređajima Waspmote i Pycom te prikaz u pratećim Android i iOS aplikacijama.',
    year: '2022',
    sortYear: 2022,
    category: 'iot',
    tags: ['IoT', 'Waspmote', 'Pycom', 'Android', 'iOS'],
    gradient: GRADIENTS.lime,
  },
  {
    id: 'bachelors-thesis-video-wall',
    title: 'Video Wall Interactive System',
    description:
      "Bachelor's thesis at FER: a system for supporting interactive applications and video games on a video wall — covering input handling, layout, and rendering coordination.",
    descriptionHr:
      'Završni rad na FER-u: sustav za potporu interaktivnim aplikacijama i videoigrama na videozidu — obrada ulaza, raspored i koordinacija prikaza.',
    year: '2021',
    sortYear: 2021,
    category: 'academic',
    tags: ["Bachelor's thesis", 'Interactive systems'],
    gradient: GRADIENTS.sky,
    links: [
      {
        label: 'Thesis (FER)',
        href: 'https://repozitorij.fer.unizg.hr/islandora/object/fer:11550',
        icon: 'document',
      },
    ],
  },
  // ----------------------------- Personal projects -----------------------------
  {
    id: 'bela-turniri',
    title: 'bela-turniri.com',
    description:
      'Independently designed and built personal platform for organizing and following belot tournaments. Supports pair registrations, draws, match results and standings, with a tournament calendar and map.',
    descriptionHr:
      'Privatna platforma koju sam samostalno osmislio i izradio za organizaciju i praćenje turnira u beli. Omogućuje prijave parova, ždrijeb, unos rezultata i praćenje poretka, uz kalendar i kartu turnira.',
    category: 'personal',
    tags: ['Web', 'Bela', 'Tournaments'],
    logo: '/projects/bela-turniri.svg',
    links: [{ label: 'bela-turniri.com', href: 'https://bela-turniri.com', icon: 'external' }],
  },
  {
    id: 'bela-games',
    title: 'bela.games',
    description:
      'Independently designed and built personal web game for playing bela with friends or bots directly in the browser. Includes a scorekeeping logbook and works on mobile devices without installation.',
    descriptionHr:
      'Privatna web igra koju sam samostalno osmislio i izradio za igranje bele s prijateljima ili botovima izravno u pregledniku. Uključuje zapisnik za vođenje bodova i radi na mobitelu bez instalacije.',
    category: 'personal',
    tags: ['Web', 'Bela', 'Online game'],
    logo: '/projects/bela-games.svg',
    links: [{ label: 'bela.games', href: 'https://bela.games', icon: 'external' }],
  },
  {
    id: 'futsal-turniri',
    title: 'futsal-turniri.com',
    description:
      'Independently designed and built personal platform for organizing and following futsal tournaments. Covers team and player entries, draws and schedules, live match results, standings and scorer statistics.',
    descriptionHr:
      'Privatna platforma koju sam samostalno osmislio i izradio za organizaciju i praćenje futsal turnira. Obuhvaća unos ekipa i igrača, ždrijeb i raspored utakmica te rezultate uživo, tablice i statistiku strijelaca.',
    category: 'personal',
    tags: ['Web', 'Futsal', 'Tournaments'],
    logo: '/projects/futsal-turniri.svg',
    links: [{ label: 'futsal-turniri.com', href: 'https://futsal-turniri.com', icon: 'external' }],
  },
]
