import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'
import type { Translations } from '../i18n/translations'

// Posts to a Cloudflare Pages Function (functions/api/contact.ts) which holds
// the Web3Forms key server-side and proxies the submission.
const CONTACT_ENDPOINT = '/api/contact'

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
        message?: string
      }
      if (res.ok && data.success) {
        setStatus({ kind: 'success' })
        setFields(INITIAL)
      } else {
        setStatus({ kind: 'error', message: data.message || t.contact.errors.generic(res.status) })
      }
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : t.contact.errors.network,
      })
    }
  }

  const submitting = status.kind === 'submitting'

  return (
    <section className="container-page py-16 md:py-24">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <div>
          <p className="text-accent-600 dark:text-accent-400 text-xs font-semibold tracking-[0.2em] uppercase">
            {t.contact.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl">{t.contact.title}</h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">{t.contact.intro}</p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                {t.contact.emailLabel}
              </dt>
              <dd>
                <a
                  href="mailto:mihael.rodek1@gmail.com"
                  className="text-accent-600 dark:text-accent-400 underline-offset-4 hover:underline"
                >
                  mihael.rodek1@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                {t.contact.githubLabel}
              </dt>
              <dd>
                <a
                  href="https://github.com/mihaelrodek"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-600 dark:text-accent-400 underline-offset-4 hover:underline"
                >
                  github.com/mihaelrodek
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                {t.contact.linkedinLabel}
              </dt>
              <dd>
                <a
                  href="https://linkedin.com/in/mihaelrodek"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-600 dark:text-accent-400 underline-offset-4 hover:underline"
                >
                  linkedin.com/in/mihaelrodek
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">{t.contact.cvLabel}</dt>
              <dd>
                <a
                  href="/cv.pdf"
                  download
                  className="text-accent-600 dark:text-accent-400 underline-offset-4 hover:underline"
                >
                  {t.contact.cvDownload}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
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
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
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
                'mt-1.5 block w-full resize-y rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition outline-none',
                'placeholder:text-zinc-400 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600',
                errors.message
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900/40'
                  : 'focus:border-accent-500 focus:ring-accent-500/20 border-zinc-300 focus:ring-2 dark:border-zinc-700',
              ].join(' ')}
              placeholder={t.contact.fields.placeholder}
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="bg-accent-600 hover:bg-accent-700 focus:ring-accent-500/40 inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-white shadow-sm transition focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Spinner /> {t.contact.submitting}
                </>
              ) : (
                t.contact.submit
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
        </form>
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
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {optionalLabel && (
          <span className="ml-1 text-zinc-400 dark:text-zinc-600">{optionalLabel}</span>
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
          'mt-1.5 block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition outline-none',
          'placeholder:text-zinc-400 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900/40'
            : 'focus:border-accent-500 focus:ring-accent-500/20 border-zinc-300 focus:ring-2 dark:border-zinc-700',
        ].join(' ')}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
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
