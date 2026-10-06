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
    eyebrow: 'Independent development studio · Croatia',
    titleA: 'Good ideas.',
    titleB: 'Thoughtfully built.',
    intro:
      'Custom web apps, business websites, and personal portfolios. Built with care, from the first conversation to the final detail.',
    primaryCta: "Let's build something",
    secondaryCta: 'Explore the work',
    scroll: 'Discover Kodek',
    servicesEyebrow: '01 / What I do',
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
        title: 'Care & improvements',
        body: 'Keep moving after launch. Thoughtful updates, fixes, and improvements as your website and business evolve.',
        tag: 'Here for what comes next',
      },
    ],
    serviceCta: 'Tell me what you need',
    processEyebrow: '02 / How it works',
    processTitle: 'Less guesswork.\nMore getting there.',
    processIntro:
      'You work directly with the person building your project. Clear communication, shared decisions, and progress you can see.',
    process: [
      {
        title: 'First, we talk.',
        body: 'Your goals, your audience, and what success looks like. We agree on the scope before the work begins.',
      },
      {
        title: 'Make it tangible.',
        body: 'Structure and design turn the idea into something you can explore. We refine the direction together.',
      },
      {
        title: 'Build with care.',
        body: 'Clean development, regular check-ins, and testing across devices. You stay part of the process.',
      },
      {
        title: 'Launch. Then grow.',
        body: 'A considered handover and a plan for what comes next. Support and improvements can continue after launch.',
      },
    ],
    workEyebrow: '03 / Selected work',
    workTitle: 'A look under the hood.',
    workIntro:
      'Live platforms and open source by Mihael Rodek, designed and built independently before Kodek.',
    allWork: 'View all work',
    projectCta: 'Explore project',
    stackEyebrow: 'Good foundations, thoughtfully chosen.',
    stackIntro: 'Familiar tools. The right fit for your project.',
    founderEyebrow: '04 / The person behind Kodek',
    founderTitle: 'A small studio.\nA personal commitment.',
    founderBody:
      "I'm Mihael Rodek, a software developer based in Croatia. Kodek brings together my experience across backend, web, and mobile development with a simple goal: making useful things, well.",
    founderPoints: [
      'Direct communication',
      'Thoughtful technical choices',
      'Attention beyond launch',
    ],
    founderCta: 'A little more about me',
    founderRole: 'Founder & developer',
    founderLocation: 'Kamenica, Croatia',
    faqEyebrow: '05 / A few answers',
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
    ctaEyebrow: 'A good place to start',
    ctaTitle: "Have something in mind?\nLet's make it happen.",
    ctaBody: "A rough idea or a detailed brief. Either way, I'd love to hear it.",
    ctaNote: "Tell me about your project. We'll work out the next step together.",
    disciplines: 'Web · Software · Design',
  },
  nav: {
    services: 'Services',
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
      'Software developer from Kamenica, Croatia, with an MSc in Computer Engineering from FER. Since 2021 I have been building banking and public-sector systems at True North; Kodek is where that experience goes to work for small businesses and individuals.',
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
    principlesEyebrow: 'How I work',
    principlesTitle: 'Direct, considered, there after launch.',
    principles: [
      {
        title: 'Direct communication',
        body: 'You talk to the person writing the code. No intermediaries, nothing lost in translation.',
      },
      {
        title: 'Considered technical choices',
        body: 'Proven tools that fit the project, not the trend. Something you can still maintain in two years.',
      },
      {
        title: 'Attention beyond launch',
        body: 'Going live is not the end. Maintenance, fixes, and new features are agreed as your needs grow.',
      },
    ],
    ctaTitle: 'Have a project in mind?',
    ctaBody: 'Describe what you need and I will reply with practical next steps.',
    ctaButton: 'Request a quote',
  },
  projects: {
    eyebrow: 'Work',
    all: 'All',
    categories: {
      'open-source': 'Open source',
      mobile: 'Mobile',
      web: 'Web',
      backend: 'Backend',
      iot: 'IoT',
      academic: 'Academic',
      personal: 'Personal projects',
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
    eyebrow: 'Start a project',
    title: 'Let’s build something useful.',
    intro:
      'Tell me what you need, where the project stands, and what a successful outcome looks like. I’ll reply with practical next steps.',
    detailsTitle: 'Contact details',
    responseNote: 'Prefer email? Write directly and include any useful links or requirements.',
    emailLabel: 'Email',
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
    eyebrow: 'Neovisni razvojni studio · Hrvatska',
    titleA: 'Dobre ideje.',
    titleB: 'Promišljena izvedba.',
    intro:
      'Web aplikacije po mjeri, poslovne web stranice i osobni portfoliji. Pažljivo izrađeni, od prvog razgovora do posljednjeg detalja.',
    primaryCta: 'Krenimo od vaše ideje',
    secondaryCta: 'Pogledajte radove',
    scroll: 'Upoznajte Kodek',
    servicesEyebrow: '01 / Usluge',
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
        title: 'Održavanje i nadogradnje',
        body: 'Razvoj se nastavlja i nakon objave. Ažuriranja, ispravci i poboljšanja koja prate rast vaše web stranice i poslovanja.',
        tag: 'Podrška za sljedeći korak',
      },
    ],
    serviceCta: 'Recite mi što vam treba',
    processEyebrow: '02 / Način rada',
    processTitle: 'Jasan dogovor.\nVidljiv napredak.',
    processIntro:
      'Surađujete izravno s osobom koja razvija vaš projekt. Otvorena komunikacija, zajedničke odluke i napredak koji možete pratiti.',
    process: [
      {
        title: 'Prvo, razgovor.',
        body: 'Vaši ciljevi, vaša publika i željeni rezultat. Dogovaramo opseg projekta prije početka rada.',
      },
      {
        title: 'Ideja dobiva oblik.',
        body: 'Struktura i dizajn pretvaraju ideju u nešto opipljivo. Zajedno razrađujemo smjer.',
      },
      {
        title: 'Pažljiva izrada.',
        body: 'Kvalitetan kod, redoviti dogovori i testiranje na različitim uređajima. Uključeni ste u svaki korak.',
      },
      {
        title: 'Objava i daljnji rast.',
        body: 'Jasna primopredaja i plan za dalje. Podršku i nadogradnje možemo nastaviti i nakon objave.',
      },
    ],
    workEyebrow: '03 / Odabrani radovi',
    workTitle: 'Pogled iza koda.',
    workIntro:
      'Platforme u produkciji i open source Mihaela Rodeka, samostalno osmišljeni i izrađeni prije Kodeka.',
    allWork: 'Svi radovi',
    projectCta: 'Pogledajte projekt',
    stackEyebrow: 'Dobri temelji, promišljen odabir.',
    stackIntro: 'Provjereni alati. Pravi izbor za vaš projekt.',
    founderEyebrow: '04 / Osoba iza Kodeka',
    founderTitle: 'Mali studio.\nOsobna odgovornost.',
    founderBody:
      'Ja sam Mihael Rodek, programer iz Hrvatske. Kodek povezuje moje iskustvo u razvoju backenda, weba i mobilnih aplikacija s jednostavnim ciljem: izraditi nešto korisno i kvalitetno.',
    founderPoints: [
      'Izravna komunikacija',
      'Promišljena tehnička rješenja',
      'Briga i nakon objave',
    ],
    founderCta: 'Nešto više o meni',
    founderRole: 'Osnivač i programer',
    founderLocation: 'Kamenica, Hrvatska',
    faqEyebrow: '05 / Nekoliko odgovora',
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
    ctaEyebrow: 'Dobar početak',
    ctaTitle: 'Imate ideju?\nPretvorimo je u stvarnost.',
    ctaBody: 'Prva zamisao ili detaljan plan. Rado ću čuti što imate na umu.',
    ctaNote: 'Opišite mi svoj projekt. Zajedno ćemo dogovoriti sljedeći korak.',
    disciplines: 'Web · Softver · Dizajn',
  },
  nav: {
    services: 'Usluge',
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
      'Softverski inženjer iz Kamenice, magistar računarstva s FER-a. Od 2021. razvijam bankarske i javne sustave u True Northu; Kodek je mjesto gdje to iskustvo radi za male tvrtke i pojedince.',
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
    principlesEyebrow: 'Kako radim',
    principlesTitle: 'Izravno, promišljeno, prisutno i nakon objave.',
    principles: [
      {
        title: 'Izravna komunikacija',
        body: 'Razgovarate s osobom koja piše kod. Bez posrednika, bez prepričavanja.',
      },
      {
        title: 'Promišljene tehničke odluke',
        body: 'Provjereni alati koji odgovaraju projektu, ne trendu. Rješenje koje se može održavati i za dvije godine.',
      },
      {
        title: 'Briga i nakon objave',
        body: 'Objava nije kraj. Održavanje, popravke i nove funkcionalnosti dogovaramo prema vašim potrebama.',
      },
    ],
    ctaTitle: 'Imate projekt na umu?',
    ctaBody: 'Opišite što trebate i odgovorit ću s konkretnim sljedećim koracima.',
    ctaButton: 'Zatraži ponudu',
  },
  projects: {
    eyebrow: 'Radovi',
    all: 'Sve',
    categories: {
      'open-source': 'Open source',
      mobile: 'Mobilno',
      web: 'Web',
      backend: 'Backend',
      iot: 'IoT',
      academic: 'Akademski',
      personal: 'Privatni projekti',
    },
    searchPlaceholder: 'Pretraži projekte…',
    searchAria: 'Pretraži projekte',
    sortAria: 'Sortiraj projekte',
    sortRecent: 'Najnovije',
    sortOldest: 'Najstarije',
    sortAlpha: 'A → Z',
    showing: (n: number, m: number) => `Prikazano ${n} od ${m}`,
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
