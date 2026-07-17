import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSettings, setSettings } from '../settings'
import { StorageKey } from '@/constants/storage'
import { createChromeMock, type ChromeMock } from '@/test/mocks/chrome'
import type { Settings } from '@/types/storage'

const defaultSettings: Settings = {
  showContentPopup: false,
}

describe('settings', () => {
  let mockChrome: ChromeMock

  beforeEach(() => {
    mockChrome = createChromeMock()
    vi.stubGlobal('chrome', mockChrome)
  })

  describe('getSettings', () => {
    it('should return defaults when no settings stored', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })

      const result = await getSettings()
      expect(result).toEqual(defaultSettings)
    })

    it('should merge stored values with defaults', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.SETTINGS]: { showContentPopup: true } })
      })

      const result = await getSettings()
      expect(result.showContentPopup).toBe(true)
    })

    it('should return full object when all settings stored', async () => {
      const stored: Settings = {
        showContentPopup: true,
      }
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.SETTINGS]: stored })
      })

      const result = await getSettings()
      expect(result).toEqual(stored)
    })
  })

  describe('setSettings', () => {
    it('should merge partial settings with defaults', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await setSettings({ showContentPopup: true })

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        {
          [StorageKey.SETTINGS]: {
            ...defaultSettings,
            showContentPopup: true,
          },
        },
        expect.any(Function),
      )
    })

    it('should overwrite existing fields', async () => {
      const existing: Settings = { showContentPopup: true }
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.SETTINGS]: existing })
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await setSettings({ showContentPopup: false })

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        {
          [StorageKey.SETTINGS]: { showContentPopup: false },
        },
        expect.any(Function),
      )
    })
  })
})
