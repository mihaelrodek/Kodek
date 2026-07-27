import { useTranslation } from '../hooks/useTranslation'

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <section className="container-page py-16">
      <h1 className="text-3xl sm:text-4xl">{t.about.title}</h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">{t.about.body}</p>
      <a
        href="/cv.pdf"
        download
        className="bg-accent-600 hover:bg-accent-700 focus:ring-accent-500/40 mt-8 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition focus:ring-2 focus:outline-none"
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
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {t.about.downloadCv}
      </a>
    </section>
  )
}
