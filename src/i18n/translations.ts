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
  landing: {
    titleA: 'Websites and apps',
    titleB: 'tailored to you.',
    intro:
      'Websites, web apps and portfolios for small businesses, trades and individuals. Planning, development and maintenance in one place.',
    primaryCta: "Let's build something",
    secondaryCta: 'Explore the work',
    servicesEyebrow: 'Services',
    servicesTitle: 'The right build.\nFor your next chapter.',
    servicesIntro:
      "A new business, a better workflow, or a place to make your work shine. Let's make the web work for you.",
    services: [
      {
        title: 'Custom web applications',
        body: 'Turn a process that slows you down into a tool that moves you forward. Purpose-built applications, integrations, and business tools.',
        tag: 'Built around your business',
      },
      {
        title: 'Small-business websites',
        body: 'A clear, fast, and easy-to-use home for your business. Help the right people find you and take the next step.',
        tag: 'A better first impression',
      },
      {
        title: 'Personal portfolios',
        body: 'Give your work a home that feels like you. A considered online presence for creatives, freelancers, and professionals.',
        tag: 'Distinctly yours',
      },
      {
        title: 'SEO optimization',
        body: 'Technical SEO, fast loading, structured data and clear content, so customers find you more easily on Google.',
        tag: 'Easier to find',
      },
      {
        title: 'Price lists',
        body: "Price lists with anchor and base prices under Croatia's 2026 price-display rules (NN 101/2026): a .csv or .xml file for your website and a list to display in store.",
        tag: 'Ready by 17 Nov 2026',
      },
      {
        title: 'Care & improvements',
        body: 'Keep moving after launch. Thoughtful updates, fixes, and improvements as your website and business evolve.',
        tag: 'Here for what comes next',
      },
    ],
    serviceCta: 'Tell me what you need',
    processEyebrow: 'How it works',
    processTitle: "How we'll work together",
    processIntro:
      "Simple: you know your business, I know how to build for the web. Here's how we get from an idea to a finished site.",
    process: [
      {
        title: 'Initial call and consultation',
        body: 'I get to know your business and what you need, then suggest the right solution. We agree on scope, timeline and price before any work starts.',
      },
      {
        title: 'Design proposal',
        body: 'Before development you get a proposal of how the site will look. We refine it until you are happy with it.',
      },
      {
        title: 'Build and testing',
        body: 'I keep you updated as the work progresses and make sure everything works on phones and computers.',
      },
      {
        title: 'Launch and support',
        body: 'The site goes live and you receive all access details. I remain available for changes and upgrades.',
      },
    ],
    workEyebrow: 'Selected work',
    workTitle: 'Recent work.',
    workIntro: 'Websites and apps in everyday use, designed and built independently.',
    allWork: 'View all work',
    projectCta: 'Explore project',
    stackIntro: 'Tools and technologies used across projects.',
    founderEyebrow: 'About me',
    founderTitle: 'You work directly with me.',
    founderBody:
      "I'm Mihael Rodek. I hold a master's in computer engineering from FER in Zagreb and have worked as a full stack developer since 2021, on backend systems, web apps and mobile apps. Through Kodek I build websites and applications for small businesses, trades and individuals. You talk to me from the first idea to launch and after it, with no middlemen.",
    founderCta: 'See more',
    faqEyebrow: 'FAQ',
    faqTitle: 'Before we begin.',
    faqIntro: "Something else on your mind? Let's talk.",
    faqs: [
      {
        question: 'What kinds of projects can we work on?',
        answer:
          'Custom web applications, small-business websites, and personal portfolios are the main focus. If you need integrations, improvements to an existing website, or something a little different, tell me what you have in mind.',
      },
      {
        question: 'How much will my project cost?',
        answer:
          "Every project has a different scope. After an initial conversation, you'll receive a proposal based on the features, design, and work involved. We'll agree on scope and pricing before development starts.",
      },
      {
        question: 'How long does a project take?',
        answer:
          "It depends on the size of the project and how ready your content and requirements are. We'll agree on a realistic timeline and milestones once the scope is clear.",
      },
      {
        question: 'Do I need a complete brief to get started?',
        answer:
          "No. A short description of your idea, who it's for, and what you'd like to achieve is enough to start the conversation. We can work through the details together.",
      },
      {
        question: 'Can you help after the site goes live?',
        answer:
          'Yes. We can agree on ongoing maintenance, fixes, and new features based on your needs. The support arrangement and its scope are discussed as part of the project.',
      },
      {
        question: 'Can we work together remotely?',
        answer:
          "Yes. Kodek is based in Croatia and can collaborate remotely in Croatian or English. We'll choose a simple way to share progress and feedback that works for both of us.",
      },
    ],
    ctaTitle: 'Tell me what you need',
    ctaBody:
      'A rough idea or a detailed brief, either works. I reply personally, with a concrete next step.',
    ctaButton: 'Send an enquiry',
    ctaEmailLabel: 'Or reach me directly:',
  },
  nav: {
    home: 'Home',
    work: 'Work',
    about: 'About me',
    contact: 'Contact',
    requestQuote: 'Request a quote',
    primaryLabel: 'Primary navigation',
    mobileMenu: 'Open navigation menu',
    mobileMenuClose: 'Close navigation menu',
    mobileMenuTitle: 'Navigation',
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
  footer: {
    summary: 'Custom software, thoughtfully built in Croatia.',
    navigation: 'Navigation',
    legal: 'Business details',
    social: 'Elsewhere',
    owner: 'Owner',
    address: 'Registered address',
    oib: 'OIB',
    email: 'Email',
    phone: 'Phone',
    rights: (year: number) => `© ${year} Kodek. All rights reserved.`,
  },
  timeline: {
    ariaLabel: 'Life timeline',
    selectedProjects: 'Selected projects',
    skip: 'Skip timeline',
  },
  about: {
    eyebrow: 'About me',
    role: 'univ. mag. ing. comp. · Founder of Kodek',
    intro:
      'Software developer with an MSc in Computer Engineering from FER. Since 2021 I have been building banking and public-sector systems at True North; Kodek is where that experience goes to work for small businesses and individuals.',
    body: 'I’m Mihael Rodek, a full-stack software engineer and the founder of Kodek. I hold an MSc in Computer Engineering from FER and build reliable products across web, backend, and mobile systems, with experience in banking and public-sector projects.',
    downloadCv: 'CV (PDF)',
    photoAlt: 'Mihael Rodek, founder of Kodek',
    timelineTitle: 'My path so far',
    experienceEyebrow: 'Experience',
    experienceIntro:
      'Work done as a full-stack developer at True North, before and alongside Kodek. Listed as professional background, not as Kodek projects.',
    educationEyebrow: 'Education',
    thesisLabel: 'Master’s thesis',
    skillsTitle: 'Skills',
    skillsIntro: 'Technologies I use to take products from a clear idea to dependable software.',
    ctaTitle: 'Have a project in mind?',
    ctaBody: 'Describe what you need and I will reply with practical next steps.',
    ctaButton: 'Request a quote',
  },
  projects: {
    eyebrow: 'Work',
    all: 'All',
    categories: {
      website: 'Websites',
      app: 'Applications',
      'open-source': 'Open source',
      academic: 'University',
    },
    searchPlaceholder: 'Search projects…',
    searchAria: 'Search projects',
    sortAria: 'Sort projects',
    sortRecent: 'Most recent',
    sortOldest: 'Oldest first',
    sortAlpha: 'A → Z',
    clear: 'Clear filters',
    empty: {
      title: 'No projects match',
      body: 'Try a different category or clear the search.',
      reset: 'Clear filters',
    },
  },
  contact: {
    eyebrow: 'Start a project',
    title: 'Let’s build something useful.',
    intro:
      'Tell me what you need, where the project stands, and what a successful outcome looks like. I’ll reply with practical next steps.',
    detailsTitle: 'Contact details',
    responseNote: 'Prefer email? Write directly and include any useful links or requirements.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    fields: {
      name: 'Name',
      email: 'Email',
      subject: 'Project or company',
      message: 'How can I help?',
      optional: '(optional)',
      placeholder: 'A short overview, preferred timing, and any helpful context…',
    },
    submit: 'Request a quote',
    submitting: 'Sending…',
    success: 'Thanks — your inquiry is on its way.',
    errors: {
      name: 'Please enter your name.',
      emailRequired: 'Please enter an email for the reply.',
      emailInvalid: 'Please enter a valid email address.',
      messageRequired: 'Please add a short project overview.',
      messageShort: 'Please add a little more detail — at least 10 characters.',
      network: 'Network error — please try again.',
      // Keyed by the `code` field of the /api/contact error response.
      rateLimited: 'Too many messages just now — please try again in a few minutes.',
      notConfigured: 'The form is offline right now — please email me directly.',
      upstream: "The message couldn't be delivered — please try again shortly.",
      validation: 'Please check the form and try again.',
      generic: (status: number) => `Submission failed (HTTP ${status}).`,
    },
  },
  a11y: {
    skipToContent: 'Skip to content',
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
  landing: {
    titleA: 'Web stranice i aplikacije',
    titleB: 'po vašoj mjeri.',
    intro:
      'Izrada web stranica, web aplikacija i portfolija za obrte, male tvrtke i pojedince. Dogovor, razvoj i održavanje na jednom mjestu.',
    primaryCta: 'Krenimo od vaše ideje',
    secondaryCta: 'Pogledajte radove',
    servicesEyebrow: 'Usluge',
    servicesTitle: 'Pravo rješenje.\nZa vaš sljedeći korak.',
    servicesIntro:
      'Pokrećete posao, želite jednostavniji rad ili mjesto za svoje radove? Izgradimo ono što vam treba.',
    services: [
      {
        title: 'Web aplikacije po mjeri',
        body: 'Pretvorite procese koji vas usporavaju u alate koji vam olakšavaju posao. Namjenske aplikacije, integracije i poslovni alati.',
        tag: 'Prilagođeno vašem poslovanju',
      },
      {
        title: 'Web stranice za male tvrtke',
        body: 'Pregledna, brza i jednostavna web stranica za vaš posao. Pomozite pravim ljudima da vas pronađu i jave vam se.',
        tag: 'Za dobar prvi dojam',
      },
      {
        title: 'Osobni portfoliji',
        body: 'Predstavite radove na način koji odražava vas. Promišljena web prisutnost za kreativce, freelancere i stručnjake.',
        tag: 'Prepoznatljivo vaši',
      },
      {
        title: 'SEO optimizacija',
        body: 'Tehnički SEO, brzo učitavanje, strukturirani podaci i jasan sadržaj, da vas kupci lakše pronađu na Googleu.',
        tag: 'Da vas lakše pronađu',
      },
      {
        title: 'Izrada cjenika',
        body: 'Cjenici sa sidrenim i baznim cijenama prema Odlukama iz NN 101/2026: datoteka .csv ili .xml za web stranicu i cjenik za isticanje u prodajnom mjestu.',
        tag: 'Spremno do 17. 11. 2026.',
      },
      {
        title: 'Održavanje i nadogradnje',
        body: 'Razvoj se nastavlja i nakon objave. Ažuriranja, ispravci i poboljšanja koja prate rast vaše web stranice i poslovanja.',
        tag: 'Podrška za sljedeći korak',
      },
    ],
    serviceCta: 'Recite mi što vam treba',
    processEyebrow: 'Način rada',
    processTitle: 'Kako izgleda suradnja?',
    processIntro:
      'Jednostavno. Vi znate svoj posao, ja znam izradu. Ovako dolazimo od ideje do gotove stranice.',
    process: [
      {
        title: 'Inicijalni razgovor i savjetovanje',
        body: 'Upoznam vaše poslovanje i potrebe te predložim odgovarajuće rješenje. Prije početka rada dogovorimo opseg, rok i cijenu.',
      },
      {
        title: 'Prijedlog dizajna',
        body: 'Prije izrade dobivate prijedlog izgleda stranice. Prilagođavamo ga dok ne budete zadovoljni.',
      },
      {
        title: 'Izrada i testiranje',
        body: 'Redovito vas obavještavam o napretku i provjeravam da sve radi na mobitelu i računalu.',
      },
      {
        title: 'Objava i podrška',
        body: 'Stranica ide uživo, a vi dobivate sve pristupe. Za izmjene i nadogradnje ostajem na raspolaganju.',
      },
    ],
    workEyebrow: 'Odabrani radovi',
    workTitle: 'Nedavni radovi.',
    workIntro:
      'Stranice i aplikacije koje su u svakodnevnoj upotrebi, osmišljene i izrađene samostalno.',
    allWork: 'Svi radovi',
    projectCta: 'Pogledajte projekt',
    stackIntro: 'Alati i tehnologije korišteni na projektima.',
    founderEyebrow: 'O meni',
    founderTitle: 'Radite izravno sa mnom.',
    founderBody:
      'Ja sam Mihael Rodek. Diplomirao sam računarstvo na FER-u, a od 2021. radim kao full stack developer na backend sustavima, web i mobilnim aplikacijama. Kroz Kodek izrađujem web stranice i aplikacije za obrte, male tvrtke i pojedince. Od prve ideje do objave, i nakon nje, razgovarate izravno sa mnom, bez posrednika.',
    founderCta: 'Vidi više',
    faqEyebrow: 'Česta pitanja',
    faqTitle: 'Prije nego krenemo.',
    faqIntro: 'Imate još pitanja? Javite se.',
    faqs: [
      {
        question: 'Na kakvim projektima možemo surađivati?',
        answer:
          'Fokus je na web aplikacijama po mjeri, web stranicama za male tvrtke i osobnim portfolijima. Trebate li integracije, doradu postojeće stranice ili nešto drukčije, javite mi svoju ideju.',
      },
      {
        question: 'Koliko će projekt koštati?',
        answer:
          'Svaki projekt ima drukčiji opseg. Nakon uvodnog razgovora dobit ćete ponudu prema potrebnim funkcionalnostima, dizajnu i količini posla. Opseg i cijenu dogovaramo prije početka razvoja.',
      },
      {
        question: 'Koliko traje izrada?',
        answer:
          'Trajanje ovisi o veličini projekta te spremnosti sadržaja i zahtjeva. Kad utvrdimo opseg, dogovorit ćemo realan rok i ključne korake.',
      },
      {
        question: 'Trebam li imati gotov projektni zadatak?',
        answer:
          'Ne. Dovoljan je kratak opis ideje, kome je namijenjena i što želite postići. Detalje možemo razraditi zajedno.',
      },
      {
        question: 'Pružate li podršku nakon objave?',
        answer:
          'Da. Možemo dogovoriti održavanje, ispravke i nove funkcionalnosti prema vašim potrebama. Način i opseg podrške definiramo u sklopu projekta.',
      },
      {
        question: 'Možemo li surađivati na daljinu?',
        answer:
          'Da. Kodek posluje iz Hrvatske, a suradnja na daljinu moguća je na hrvatskom ili engleskom jeziku. Dogovorit ćemo jednostavan način praćenja napretka i razmjene povratnih informacija.',
      },
    ],
    ctaTitle: 'Recite mi što trebate',
    ctaBody:
      'Prva zamisao ili detaljan plan, svejedno. Odgovaram osobno, s konkretnim prijedlogom sljedećeg koraka.',
    ctaButton: 'Pošaljite upit',
    ctaEmailLabel: 'Ili izravno:',
  },
  nav: {
    home: 'Početna',
    work: 'Radovi',
    about: 'O meni',
    contact: 'Kontakt',
    requestQuote: 'Zatraži ponudu',
    primaryLabel: 'Glavna navigacija',
    mobileMenu: 'Otvori navigacijski izbornik',
    mobileMenuClose: 'Zatvori navigacijski izbornik',
    mobileMenuTitle: 'Navigacija',
  },
  theme: {
    toggle: 'Uključi ili isključi tamni način',
  },
  language: {
    label: 'Jezik',
    short: { en: 'EN', hr: 'HR' },
    switchTo: (l: string) => `Promijeni jezik u ${l}`,
  },
  footer: {
    summary: 'Softver po mjeri, promišljeno izrađen u Hrvatskoj.',
    navigation: 'Navigacija',
    legal: 'Podaci o obrtu',
    social: 'Društvene mreže',
    owner: 'Vlasnik',
    address: 'Sjedište',
    oib: 'OIB',
    email: 'Email',
    phone: 'Telefon',
    rights: (year: number) => `© ${year} Kodek. Sva prava pridržana.`,
  },
  timeline: {
    ariaLabel: 'Životna vremenska crta',
    selectedProjects: 'Odabrani projekti',
    skip: 'Preskoči vremensku crtu',
  },
  about: {
    eyebrow: 'O meni',
    role: 'univ. mag. ing. comp. · osnivač Kodeka',
    intro:
      'Softverski inženjer, magistar računarstva s FER-a. Od 2021. razvijam bankarske i javne sustave u True Northu; Kodek je mjesto gdje to iskustvo radi za male tvrtke i pojedince.',
    body: 'Ja sam Mihael Rodek, full-stack softverski inženjer i osnivač Kodeka. Magistrirao sam računarstvo na FER-u te razvijam pouzdana web, backend i mobilna rješenja, uz iskustvo na projektima u bankarskom i javnom sektoru.',
    downloadCv: 'Životopis (PDF)',
    photoAlt: 'Mihael Rodek, osnivač Kodeka',
    timelineTitle: 'Moj dosadašnji put',
    experienceEyebrow: 'Iskustvo',
    experienceIntro:
      'Rad kao full-stack developer u True Northu, prije i uz Kodek. Navedeno kao profesionalna pozadina, ne kao Kodekovi projekti.',
    educationEyebrow: 'Obrazovanje',
    thesisLabel: 'Diplomski rad',
    skillsTitle: 'Vještine',
    skillsIntro: 'Tehnologije kojima jasnu ideju pretvaram u pouzdan softverski proizvod.',
    ctaTitle: 'Imate projekt na umu?',
    ctaBody: 'Opišite što trebate i odgovorit ću s konkretnim sljedećim koracima.',
    ctaButton: 'Zatraži ponudu',
  },
  projects: {
    eyebrow: 'Radovi',
    all: 'Sve',
    categories: {
      website: 'Web stranice',
      app: 'Aplikacije',
      'open-source': 'Open source',
      academic: 'Fakultet',
    },
    searchPlaceholder: 'Pretraži projekte…',
    searchAria: 'Pretraži projekte',
    sortAria: 'Sortiraj projekte',
    sortRecent: 'Najnovije',
    sortOldest: 'Najstarije',
    sortAlpha: 'A → Z',
    clear: 'Očisti filtre',
    empty: {
      title: 'Nema rezultata',
      body: 'Pokušaj s drugom kategorijom ili očisti pretragu.',
      reset: 'Očisti filtre',
    },
  },
  contact: {
    eyebrow: 'Pokrenimo projekt',
    title: 'Izgradimo nešto korisno.',
    intro:
      'Opišite što vam treba, u kojoj je fazi projekt i kako izgleda uspješan rezultat. Odgovorit ću s konkretnim prijedlogom sljedećih koraka.',
    detailsTitle: 'Kontaktni podaci',
    responseNote:
      'Radije koristite email? Javite se izravno i priložite korisne poveznice ili zahtjeve.',
    emailLabel: 'Email',
    phoneLabel: 'Telefon',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    fields: {
      name: 'Ime i prezime',
      email: 'Email',
      subject: 'Projekt ili tvrtka',
      message: 'Kako mogu pomoći?',
      optional: '(neobavezno)',
      placeholder: 'Kratak opis, željeni rok i druge korisne informacije…',
    },
    submit: 'Zatraži ponudu',
    submitting: 'Šalje se…',
    success: 'Hvala — vaš je upit poslan.',
    errors: {
      name: 'Upišite svoje ime.',
      emailRequired: 'Upišite email na koji mogu odgovoriti.',
      emailInvalid: 'Upišite valjanu email adresu.',
      messageRequired: 'Dodajte kratak opis projekta.',
      messageShort: 'Dodajte još malo detalja — barem 10 znakova.',
      network: 'Mrežna pogreška — pokušajte ponovno.',
      rateLimited: 'Previše poruka u kratkom vremenu — pokušajte ponovno za nekoliko minuta.',
      notConfigured: 'Obrazac trenutačno ne radi — javite mi se izravno emailom.',
      upstream: 'Poruku nije bilo moguće dostaviti — pokušajte ponovno uskoro.',
      validation: 'Provjerite unesene podatke i pokušajte ponovno.',
      generic: (status: number) => `Slanje nije uspjelo (HTTP ${status}).`,
    },
  },
  a11y: {
    skipToContent: 'Preskoči na sadržaj',
  },
  notFound: {
    code: '404',
    title: 'Stranica nije pronađena',
    body: 'Stranica koju tražite ne postoji.',
    back: 'Natrag na početnu',
  },
}

export const translations: Record<Lang, Translations> = { en, hr }
