import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllRecordings, saveRecording, deleteRecording } from '../recording-metadata'
import { StorageKey } from '@/constants/storage'
import { createChromeMock } from '@/test/mocks/chrome'
import type { StoredRecording } from '@/types/storage'

type ChromeMock = ReturnType<typeof createChromeMock>

const sampleRecording: StoredRecording = {
  id: 'rec-1',
  name: 'Test Recording',
  createdAt: 1000,
  duration: 5000,
  source: 'screen',
  mimeType: 'video/webm',
}

describe('recording-metadata', () => {
  let mockChrome: ChromeMock

  beforeEach(() => {
    mockChrome = createChromeMock()
    vi.stubGlobal('chrome', mockChrome)
  })

  describe('getAllRecordings', () => {
    it('should return empty array when no recordings stored', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })

      const result = await getAllRecordings()
      expect(result).toEqual([])
    })

    it('should return stored recordings', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.RECORDING_METADATA]: [sampleRecording] })
      })

      const result = await getAllRecordings()
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('rec-1')
      expect(result[0].name).toBe('Test Recording')
    })
  })

  describe('saveRecording', () => {
    it('should append recording to existing list', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.RECORDING_METADATA]: [sampleRecording] })
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      const newRecording: StoredRecording = { ...sampleRecording, id: 'rec-2', name: 'Second' }
      await saveRecording(newRecording)

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        { [StorageKey.RECORDING_METADATA]: [sampleRecording, newRecording] },
        expect.any(Function),
      )
    })

    it('should create list when storage is empty', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({})
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await saveRecording(sampleRecording)

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        { [StorageKey.RECORDING_METADATA]: [sampleRecording] },
        expect.any(Function),
      )
    })
  })

  describe('deleteRecording', () => {
    it('should remove recording by id', async () => {
      const rec2: StoredRecording = { ...sampleRecording, id: 'rec-2' }
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.RECORDING_METADATA]: [sampleRecording, rec2] })
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await deleteRecording('rec-1')

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        { [StorageKey.RECORDING_METADATA]: [rec2] },
        expect.any(Function),
      )
    })

    it('should do nothing if id does not exist', async () => {
      mockChrome.storage.local.get.mockImplementation((_key: string, callback: (result: Record<string, unknown>) => void) => {
        callback({ [StorageKey.RECORDING_METADATA]: [sampleRecording] })
      })
      mockChrome.storage.local.set.mockImplementation((_items: Record<string, unknown>, callback?: () => void) => {
        callback?.()
      })

      await deleteRecording('nonexistent')

      expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
        { [StorageKey.RECORDING_METADATA]: [sampleRecording] },
        expect.any(Function),
      )
    })
  })
})
