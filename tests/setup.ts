import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Shared by every suite, including the node-environment Worker tests —
// hence the `window` guard.
afterEach(() => {
  if (typeof window === 'undefined') return
  cleanup()
  window.localStorage.clear()
})
