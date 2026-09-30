import { describe, expect, it } from 'vitest'
import { localized, SUPPORTED_LANGS, translations } from '@/i18n/translations'

describe('localized()', () => {
  it('returns the English string for lang "en" even when a Croatian one exists', () => {
    expect(localized('en', 'Backend developer', 'Backend programer')).toBe('Backend developer')
  })

  it('returns the Croatian string for lang "hr" when present', () => {
    expect(localized('hr', 'Backend developer', 'Backend programer')).toBe('Backend programer')
  })

  it('falls back to English for lang "hr" when the Croatian string is missing', () => {
    expect(localized('hr', 'Backend developer')).toBe('Backend developer')
    expect(localized('hr', 'Backend developer', undefined)).toBe('Backend developer')
  })

  it('falls back to English for lang "hr" when the Croatian string is empty', () => {
    // '' is falsy, so an empty translation must not blank out the UI.
    expect(localized('hr', 'Backend developer', '')).toBe('Backend developer')
  })
})

describe('translations dictionary', () => {
  it('exposes a dictionary for every supported language', () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(translations[lang]).toBeDefined()
    }
  })

  it('keeps the hr dictionary structurally in sync with en', () => {
    const keyPaths = (value: unknown, prefix = ''): string[] => {
      if (typeof value !== 'object' || value === null) return [prefix]
      return Object.entries(value).flatMap(([key, child]) =>
        keyPaths(child, prefix ? `${prefix}.${key}` : key),
      )
    }
    expect(keyPaths(translations.hr).sort()).toEqual(keyPaths(translations.en).sort())
  })
})
