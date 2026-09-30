import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { business } from '../data/business'
import { useTranslation } from '../hooks/useTranslation'
import type { Translations } from '../i18n/translations'

// Posts to a Cloudflare Pages Function (functions/api/contact.ts) which holds
// the Web3Forms key server-side and proxies the submission.
const CONTACT_ENDPOINT = '/api/contact'

/**
 * Machine codes returned by functions/api/contact.ts. The server never sends
 * user-facing copy — its English `message` field exists for curl users only —
 * so everything shown here comes from the translation dictionary.
 */
type ErrorCode = 'not_configured' | 'rate_limited' | 'invalid_body' | 'validation' | 'upstream'

/** Fallback for older/edge responses that carry a status but no code. */
const STATUS_TO_CODE: Record<number, ErrorCode> = {
  400: 'invalid_body',
  422: 'validation',
  429: 'rate_limited',
  500: 'not_configured',
  502: 'upstream',
}

function errorMessage(t: Translations, code: string | undefined, status: number): string {
  const resolved = code ?? STATUS_TO_CODE[status]
  switch (resolved) {
    case 'rate_limited':
      return t.contact.errors.rateLimited
    case 'not_configured':
      return t.contact.errors.notConfigured
    case 'upstream':
      return t.contact.errors.upstream
    case 'validation':
    case 'invalid_body':
      return t.contact.errors.validation
    default:
      return t.contact.errors.generic(status)
  }
}

type SubmitStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

interface FormFields {
  name: string
  email: string
  subject: string
  message: string
  botcheck: string
}

const INITIAL: FormFields = {
  name: '',
  email: '',
  subject: '',
  message: '',
  botcheck: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

function validate(fields: FormFields, t: Translations): FieldErrors {
  const errors: FieldErrors = {}
  if (!fields.name.trim()) errors.name = t.contact.errors.name
  if (!fields.email.trim()) errors.email = t.contact.errors.emailRequired
  else if (!EMAIL_RE.test(fields.email.trim())) errors.email = t.contact.errors.emailInvalid
  if (!fields.message.trim()) errors.message = t.contact.errors.messageRequired
  else if (fields.message.trim().length < 10) errors.message = t.contact.errors.messageShort
  return errors
}

export default function ContactPage() {
  const { t } = useTranslation()
  const [fields, setFields] = useState<FormFields>(INITIAL)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle' })

  const update =
    (key: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }))
      if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }))
    }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (fields.botcheck) {
      setStatus({ kind: 'success' })
      return
    }

    const v = validate(fields, t)
    if (Object.keys(v).length > 0) {
      setErrors(v)
      return
    }

    setStatus({ kind: 'submitting' })
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          subject: fields.subject.trim(),
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
          botcheck: fields.botcheck,
          page: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        code?: string
      }
      if (res.ok && data.success) {
        setStatus({ kind: 'success' })
        setFields(INITIAL)
      } else {
        // Never render `data.message`: it is English-only and server-authored.
        setStatus({ kind: 'error', message: errorMessage(t, data.code, res.status) })
      }
    } catch {
      // The thrown error's text is a browser/network detail, not user-facing
      // copy — always show the translated network message.
      setStatus({ kind: 'error', message: t.contact.errors.network })
    }
  }

  const submitting = status.kind === 'submitting'

  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-eyebrow">{t.contact.eyebrow}</p>
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.055em]">
            {t.contact.title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
            {t.contact.intro}
          </p>

          <h2 className="mt-14 font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            {t.contact.detailsTitle}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {t.contact.responseNote}
          </p>

          <dl className="mt-6 border-t border-zinc-200 dark:border-zinc-800">
            {[
              {
                label: t.contact.emailLabel,
                href: `mailto:${business.email}`,
                text: business.email,
                external: false,
              },
              {
                label: t.contact.githubLabel,
                href: business.social.github,
                text: 'github.com/mihaelrodek',
                external: true,
              },
              {
                label: t.contact.linkedinLabel,
                href: business.social.linkedin,
                text: 'linkedin.com/in/mihaelrodek',
                external: true,
              },
            ].map((item) => (
              <div
                key={item.href}
                className="group relative border-b border-zinc-200 dark:border-zinc-800"
              >
                <span
                  aria-hidden="true"
                  className="bg-accent-600 dark:bg-accent-500 absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-focus-within:scale-x-100 group-hover:scale-x-100"
                />
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <a
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="focus-ring flex min-h-14 items-center gap-4 rounded-md py-3 text-sm sm:text-base"
                  >
                    <span
                      aria-hidden="true"
                      className="w-20 shrink-0 font-mono text-[10px] tracking-widest text-zinc-500 uppercase dark:text-zinc-500"
                    >
                      {item.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-zinc-900 transition-transform duration-500 ease-out group-hover:translate-x-1 dark:text-zinc-100">
                      {item.text}
                    </span>
                    <ArrowUpRight className="group-hover:text-accent-600 dark:group-hover:text-accent-500 size-4 shrink-0 text-zinc-400 transition duration-300 group-hover:rotate-45" />
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          noValidate
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative space-y-8 overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <span
            aria-hidden="true"
            className="via-accent-500 absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
          />
          <input
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            value={fields.botcheck}
            onChange={update('botcheck')}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          {/* maxLength values mirror the server-side caps in functions/api/contact.ts */}
          <Field
            id="name"
            label={t.contact.fields.name}
            value={fields.name}
            onChange={update('name')}
            error={errors.name}
            autoComplete="name"
            disabled={submitting}
            maxLength={100}
          />
          <Field
            id="email"
            label={t.contact.fields.email}
            type="email"
            value={fields.email}
            onChange={update('email')}
            error={errors.email}
            autoComplete="email"
            disabled={submitting}
            maxLength={254}
          />
          <Field
            id="subject"
            label={t.contact.fields.subject}
            value={fields.subject}
            onChange={update('subject')}
            disabled={submitting}
            optionalLabel={t.contact.fields.optional}
            maxLength={200}
          />

          <div>
            <label
              htmlFor="message"
              className="block font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-600 uppercase dark:text-zinc-400"
            >
              {t.contact.fields.message}
            </label>
            <textarea
              id="message"
              name="message"
              value={fields.message}
              onChange={update('message')}
              rows={5}
              maxLength={5000}
              disabled={submitting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={[
                'mt-1 block w-full resize-y rounded-none border-0 border-b bg-transparent px-0 py-2 text-base transition-colors duration-300 outline-none sm:text-lg',
                'placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600',
                errors.message
                  ? 'border-red-500 focus:border-red-500 focus:shadow-[0_1px_0_0_var(--color-red-500)]'
                  : 'focus:border-accent-600 dark:focus:border-accent-500 border-zinc-300 hover:border-zinc-400 focus:shadow-[0_1px_0_0_var(--color-accent-600)] dark:border-zinc-700 dark:hover:border-zinc-500 dark:focus:shadow-[0_1px_0_0_var(--color-accent-500)]',
              ].join(' ')}
              placeholder={t.contact.fields.placeholder}
            />
            {errors.message && (
              <p id="message-error" className="mt-2 text-xs text-red-600 dark:text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="focus-ring group bg-accent-600 hover:bg-accent-700 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Spinner /> {t.contact.submitting}
                </>
              ) : (
                <>
                  {t.contact.submit}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </>
              )}
            </button>

            <AnimatePresence mode="wait">
              {status.kind === 'success' && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400"
                >
                  {t.contact.success}
                </motion.p>
              )}
              {status.kind === 'error' && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </section>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  autoComplete?: string
  disabled?: boolean
  optionalLabel?: string
  maxLength?: number
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  disabled,
  optionalLabel,
  maxLength,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-600 uppercase dark:text-zinc-400"
      >
        {label}
        {optionalLabel && (
          <span className="ml-1 tracking-normal text-zinc-500 normal-case dark:text-zinc-500">
            {optionalLabel}
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'mt-1 block min-h-12 w-full rounded-none border-0 border-b bg-transparent px-0 py-2 text-base transition-colors duration-300 outline-none sm:text-lg',
          'placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600',
          error
            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_1px_0_0_var(--color-red-500)]'
            : 'focus:border-accent-600 dark:focus:border-accent-500 border-zinc-300 hover:border-zinc-400 focus:shadow-[0_1px_0_0_var(--color-accent-600)] dark:border-zinc-700 dark:hover:border-zinc-500 dark:focus:shadow-[0_1px_0_0_var(--color-accent-500)]',
        ].join(' ')}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
