import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get, set, remove, onChanged } from '../storage'
import { createChromeMock, type ChromeMock } from '@/test/mocks/chrome'

describe('storage', () => {
  let mockChrome: ChromeMock

  beforeEach(() => {
    mockChrome = createChromeMock()
    vi.stubGlobal('chrome', mockChrome)
  })

  describe('get', () => {
    it('should retrieve a stored value by key', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ theme: 'dark' })
      })

      const result = await get<string>('theme')
      expect(result).toBe('dark')
    })

    it('should return undefined for missing keys', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })

      const result = await get<string>('missing')
      expect(result).toBeUndefined()
    })

    it('should call chrome.storage.local.get with the key', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })

      await get<string>('myKey')
      expect(mockChrome.storage.local.get).toHaveBeenCalledWith('myKey', expect.any(Function))
    })
  })

  describe('set', () => {
    it('should store a value under the given key', async () => {
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await set('theme', 'light')

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        { theme: 'light' },
        expect.any(Function),
      )
    })

    it('should handle complex values', async () => {
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      const value = { nested: { a: 1 }, list: [1, 2, 3] }
      await set('complex', value)

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        { complex: value },
        expect.any(Function),
      )
    })
  })

  describe('remove', () => {
    it('should remove a key from storage', async () => {
      mockChrome.storage.local.remove.mockImplementation((_key: string, callback?: () => void) => {
        callback?.()
      })

      await remove('theme')

      expect(mockChrome.storage.local.remove).toHaveBeenCalledWith('theme', expect.any(Function))
    })
  })

  describe('onChanged', () => {
    it('should call callback when the watched key changes', () => {
      const callback = vi.fn()
      onChanged('theme', callback)

      const handler = mockChrome.storage.onChanged.addListener.mock.calls[0][0]
      handler({ theme: { newValue: 'dark', oldValue: 'light' } })

      expect(callback).toHaveBeenCalledWith('dark')
    })

    it('should not call callback for unrelated keys', () => {
      const callback = vi.fn()
      onChanged('theme', callback)

      const handler = mockChrome.storage.onChanged.addListener.mock.calls[0][0]
      handler({ otherKey: { newValue: 'val' } })

      expect(callback).not.toHaveBeenCalled()
    })

    it('should return an unsubscribe function', () => {
      const callback = vi.fn()
      const unsub = onChanged('theme', callback)

      expect(typeof unsub).toBe('function')
      unsub()
      expect(mockChrome.storage.onChanged.removeListener).toHaveBeenCalledOnce()
    })

    it('should handle undefined new values', () => {
      const callback = vi.fn()
      onChanged('theme', callback)

      const handler = mockChrome.storage.onChanged.addListener.mock.calls[0][0]
      handler({ theme: { newValue: undefined } })

      expect(callback).toHaveBeenCalledWith(undefined)
    })
  })
})
