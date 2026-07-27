import { motion } from 'framer-motion'
import Timeline from '../components/timeline/Timeline'
import { useTranslation } from '../hooks/useTranslation'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <>
      <section className="container-page flex flex-col items-center justify-center py-5 text-center sm:py-7">
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-accent-600 dark:text-accent-400 text-[11px] font-semibold tracking-[0.22em] uppercase"
        >
          {t.home.eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-1.5 text-xl font-semibold sm:text-2xl"
        >
          {t.home.titleA}{' '}
          <span className="text-zinc-400 dark:text-zinc-500">{t.home.titleB} ↓</span>
        </motion.h1>
      </section>

      <Timeline />
    </>
  )
}
