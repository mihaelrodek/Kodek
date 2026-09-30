import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <section className="container-page flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center text-center">
      <p className="text-accent-600 dark:text-accent-400 text-sm font-medium">{t.notFound.code}</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t.notFound.title}</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">{t.notFound.body}</p>
      <Link
        to="/"
        className="focus-ring bg-accent-600 hover:bg-accent-700 mt-6 rounded-md px-4 py-2 text-sm font-medium text-white transition"
      >
        {t.notFound.back}
      </Link>
    </section>
  )
}
