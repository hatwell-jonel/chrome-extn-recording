import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPreferences, setPreferences } from '../user-preferences'
import { StorageKey } from '@/constants/storage'
import { createChromeMock, type ChromeMock } from '@/test/mocks/chrome'
import type { UserPreferences } from '@/types/storage'

const defaultPrefs: UserPreferences = {
  defaultSource: 'screen',
  includeAudio: true,
  includeMicrophone: false,
  countdownDuration: 3,
  autoDownload: true,
}

describe('user-preferences', () => {
  let mockChrome: ChromeMock

  beforeEach(() => {
    mockChrome = createChromeMock()
    vi.stubGlobal('chrome', mockChrome)
  })

  describe('getPreferences', () => {
    it('should return defaults when no preferences stored', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })

      const result = await getPreferences()
      expect(result).toEqual(defaultPrefs)
    })

    it('should merge stored values with defaults', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.USER_PREFERENCES]: { defaultSource: 'window' } })
      })

      const result = await getPreferences()
      expect(result.defaultSource).toBe('window')
      expect(result.includeAudio).toBe(true)
      expect(result.includeMicrophone).toBe(false)
      expect(result.autoDownload).toBe(true)
    })

    it('should return full object when all preferences stored', async () => {
      const stored: UserPreferences = {
        defaultSource: 'tab',
        includeAudio: false,
        includeMicrophone: true,
        countdownDuration: 5,
        autoDownload: false,
      }
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.USER_PREFERENCES]: stored })
      })

      const result = await getPreferences()
      expect(result).toEqual(stored)
    })
  })

  describe('setPreferences', () => {
    it('should merge partial preferences with existing stored values', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.USER_PREFERENCES]: defaultPrefs })
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await setPreferences({ includeMicrophone: true, countdownDuration: 5 })

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        {
          [StorageKey.USER_PREFERENCES]: {
            ...defaultPrefs,
            includeMicrophone: true,
            countdownDuration: 5,
          },
        },
        expect.any(Function),
      )
    })

    it('should merge with defaults when no stored preferences exist', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await setPreferences({ autoDownload: false })

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        {
          [StorageKey.USER_PREFERENCES]: {
            ...defaultPrefs,
            autoDownload: false,
          },
        },
        expect.any(Function),
      )
    })

    it('should overwrite existing fields', async () => {
      const existing: UserPreferences = {
        defaultSource: 'tab',
        includeAudio: false,
        includeMicrophone: true,
        countdownDuration: 10,
        autoDownload: false,
      }
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.USER_PREFERENCES]: existing })
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await setPreferences({ defaultSource: 'window', includeAudio: true })

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        {
          [StorageKey.USER_PREFERENCES]: {
            ...existing,
            defaultSource: 'window',
            includeAudio: true,
          },
        },
        expect.any(Function),
      )
    })
  })
})
