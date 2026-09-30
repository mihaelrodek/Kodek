import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactPage from '@/pages/ContactPage'
import { translations } from '@/i18n/translations'
import { renderWithProviders } from '../utils/render'

// `validate()` is module-private, so it is exercised through the rendered form:
// submit, then assert the error copy from the translations dictionary appears.
const t = translations.en
const errors = t.contact.errors

function setup() {
  const user = userEvent.setup()
  renderWithProviders(<ContactPage />)
  return {
    user,
    name: screen.getByLabelText(t.contact.fields.name),
    email: screen.getByLabelText(t.contact.fields.email),
    message: screen.getByLabelText(t.contact.fields.message),
    submit: screen.getByRole('button', { name: t.contact.submit }),
  }
}

/** Fills every required field with valid input and submits. */
async function submitValid(form: ReturnType<typeof setup>) {
  await form.user.type(form.name, 'Ada Lovelace')
  await form.user.type(form.email, 'ada@example.com')
  await form.user.type(form.message, 'This message is comfortably over ten characters long.')
  await form.user.click(form.submit)
}

describe('ContactPage client-side validation', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // A failed validation must never reach the network; every assertion below
    // also checks this stub stayed untouched.
    fetchMock = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 })),
    )
    vi.stubGlobal('fetch', fetchMock)
  })

  it('reports every required field when the form is submitted empty', async () => {
    const { user, submit } = setup()

    await user.click(submit)

    expect(await screen.findByText(errors.name)).toBeInTheDocument()
    expect(screen.getByText(errors.emailRequired)).toBeInTheDocument()
    expect(screen.getByText(errors.messageRequired)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('treats whitespace-only input as missing', async () => {
    const { user, name, email, message, submit } = setup()

    await user.type(name, '   ')
    await user.type(email, '   ')
    await user.type(message, '   ')
    await user.click(submit)

    expect(await screen.findByText(errors.name)).toBeInTheDocument()
    expect(screen.getByText(errors.emailRequired)).toBeInTheDocument()
    expect(screen.getByText(errors.messageRequired)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a malformed email address', async () => {
    const { user, name, email, message, submit } = setup()

    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@@example')
    await user.type(message, 'This message is comfortably over ten characters long.')
    await user.click(submit)

    expect(await screen.findByText(errors.emailInvalid)).toBeInTheDocument()
    expect(screen.queryByText(errors.emailRequired)).not.toBeInTheDocument()
    expect(screen.queryByText(errors.messageShort)).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a message shorter than 10 characters', async () => {
    const { user, name, email, message, submit } = setup()

    await user.type(name, 'Ada Lovelace')
    await user.type(email, 'ada@example.com')
    await user.type(message, 'too short')
    await user.click(submit)

    expect(await screen.findByText(errors.messageShort)).toBeInTheDocument()
    expect(screen.queryByText(errors.messageRequired)).not.toBeInTheDocument()
    expect(screen.queryByText(errors.emailInvalid)).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('marks invalid fields with aria-invalid and links the error text', async () => {
    const { user, submit, name } = setup()

    await user.click(submit)

    await screen.findByText(errors.name)
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAttribute('aria-describedby', 'name-error')
  })

  it('submits to /api/contact once every field is valid', async () => {
    await submitValid(setup())

    expect(await screen.findByText(t.contact.success)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/contact')
    expect(JSON.parse(String(init.body))).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'This message is comfortably over ten characters long.',
    })
  })
})

describe('ContactPage server-error handling', () => {
  function stubResponse(status: number, body: unknown) {
    const fetchMock = vi.fn(() => Promise.resolve(new Response(JSON.stringify(body), { status })))
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the translated rate-limit message for a 429 with code "rate_limited"', async () => {
    // The server also sends an English `message` for curl users; the UI must
    // render its own translated copy instead.
    stubResponse(429, {
      success: false,
      code: 'rate_limited',
      message: 'Too many requests — please try again later.',
    })

    await submitValid(setup())

    expect(await screen.findByText(errors.rateLimited)).toBeInTheDocument()
    expect(
      screen.queryByText('Too many requests — please try again later.'),
    ).not.toBeInTheDocument()
  })

  it.each([
    ['not_configured', 500, () => errors.notConfigured],
    ['upstream', 502, () => errors.upstream],
    ['validation', 422, () => errors.validation],
    ['invalid_body', 400, () => errors.validation],
  ])('maps code "%s" to its translated message', async (code, status, expected) => {
    stubResponse(status, { success: false, code })

    await submitValid(setup())

    expect(await screen.findByText(expected())).toBeInTheDocument()
  })

  it('falls back to the HTTP status when the response carries no code', async () => {
    stubResponse(503, { success: false })

    await submitValid(setup())

    expect(await screen.findByText(errors.generic(503))).toBeInTheDocument()
  })

  it('maps a known status to its message when the response carries no code', async () => {
    stubResponse(429, {})

    await submitValid(setup())

    expect(await screen.findByText(errors.rateLimited)).toBeInTheDocument()
  })

  it('shows the network message — never the thrown error text — when fetch rejects', async () => {
    const fetchMock = vi.fn(() => Promise.reject(new Error('getaddrinfo ENOTFOUND api.example')))
    vi.stubGlobal('fetch', fetchMock)

    await submitValid(setup())

    expect(await screen.findByText(errors.network)).toBeInTheDocument()
    expect(screen.queryByText(/ENOTFOUND/)).not.toBeInTheDocument()
  })
})
