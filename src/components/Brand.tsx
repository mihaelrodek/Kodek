import { Link } from 'react-router-dom'
import { KodekMark } from './KodekMark'

interface BrandProps {
  className?: string
}

/** Header/footer logo: mark plus the "odek_" wordmark; only the mark below 480px. */
export default function Brand({ className = '' }: BrandProps) {
  return (
    <Link
      to="/"
      aria-label="Kodek"
      className={`focus-ring inline-flex min-h-11 items-center rounded-lg ${className}`}
    >
      <KodekMark className="size-8 shrink-0" />
      <span
        aria-hidden="true"
        className="font-heading text-foreground ml-[0.11em] hidden text-[2.05rem] leading-none font-bold min-[480px]:inline"
      >
        odek
        <span className="text-accent-800 dark:text-accent-500">_</span>
      </span>
    </Link>
  )
}
