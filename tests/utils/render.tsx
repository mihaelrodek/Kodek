import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

interface ProvidersProps {
  children: ReactNode
}

/**
 * The same provider stack `src/main.tsx` mounts, minus StrictMode (double
 * rendering would duplicate the render-order assertions in the hydration test).
 * Starts on an English URL: the language comes from the path, and the unit
 * tests assert English copy.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <MemoryRouter initialEntries={['/en']}>
      <LanguageProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LanguageProvider>
    </MemoryRouter>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  return render(ui, { wrapper: Providers, ...options })
}
