import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import { createChromeMock } from './mocks/chrome'

const chromeMock = createChromeMock()

vi.stubGlobal('chrome', chromeMock)
