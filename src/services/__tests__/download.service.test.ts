import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DownloadService } from '../download.service'
import { DownloadFailedError } from '@/errors/recording.errors'
import { type ChromeMock } from '@/test/mocks/chrome'

function createTextBlob(text: string, mimeType = 'text/plain'): Blob {
  return new Blob([text], { type: mimeType })
}

describe('DownloadService', () => {
  let service: DownloadService
  let mockChrome: ChromeMock

  beforeEach(() => {
    DownloadService['_instance'] = undefined as unknown as DownloadService
    service = DownloadService.getInstance()
    mockChrome = chrome as unknown as ChromeMock
    mockChrome.runtime.lastError = null
    vi.clearAllMocks()
    mockChrome.downloads.download.mockImplementation(
      (_options: unknown, callback?: (id?: number) => void) => {
        callback?.(1)
      },
    )
  })

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = DownloadService.getInstance()
      const instance2 = DownloadService.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('download', () => {
    it('should call chrome.downloads.download with a data URL', async () => {
      const blob = createTextBlob('test content')

      await service.download(blob, 'recording.txt')

      expect(mockChrome.downloads.download).toHaveBeenCalledOnce()
      const [options] = mockChrome.downloads.download.mock.calls[0]
      expect(options).toMatchObject({
        url: expect.stringMatching(/^data:text\/plain;base64,/),
        filename: 'recording.txt',
        saveAs: false,
      })
    })

    it('should throw DownloadFailedError when chrome.downloads.download fails', async () => {
      mockChrome.downloads.download.mockImplementation(
        (_options: unknown, callback?: () => void) => {
          mockChrome.runtime.lastError = { message: 'Download was cancelled' }
          callback?.()
        },
      )

      const blob = createTextBlob('test')

      await expect(service.download(blob, 'fail.txt')).rejects.toThrow(DownloadFailedError)
      await expect(service.download(blob, 'fail.txt')).rejects.toThrow('Download was cancelled')
    })

    it('should throw DownloadFailedError for empty blob', async () => {
      const blob = createTextBlob('')

      await expect(service.download(blob, 'empty.txt')).rejects.toThrow(DownloadFailedError)
      await expect(service.download(blob, 'empty.txt')).rejects.toThrow(
        'Cannot download an empty blob',
      )
      expect(mockChrome.downloads.download).not.toHaveBeenCalled()
    })

    it('should throw DownloadFailedError for empty filename', async () => {
      const blob = createTextBlob('content')

      await expect(service.download(blob, '')).rejects.toThrow(DownloadFailedError)
      await expect(service.download(blob, '')).rejects.toThrow(
        'Filename cannot be empty',
      )
      expect(mockChrome.downloads.download).not.toHaveBeenCalled()
    })

    it('should throw DownloadFailedError for whitespace-only filename', async () => {
      const blob = createTextBlob('content')

      await expect(service.download(blob, '   ')).rejects.toThrow(DownloadFailedError)
      await expect(service.download(blob, '   ')).rejects.toThrow(
        'Filename cannot be empty',
      )
    })

    it('should handle binary blob content', async () => {
      const binaryData = new Uint8Array([0, 1, 2, 255, 254, 253])
      const blob = new Blob([binaryData], { type: 'application/octet-stream' })

      await service.download(blob, 'binary.bin')

      const calls = mockChrome.downloads.download.mock.calls
      const options = calls[0][0] as { url: string }
      expect(options.url).toMatch(/^data:application\/octet-stream;base64,/)
    })

    it('should encode the correct content in the data URL', async () => {
      const blob = createTextBlob('Hello, World!')

      await service.download(blob, 'hello.txt')

      const calls = mockChrome.downloads.download.mock.calls
      const options = calls[0][0] as { url: string }
      const base64 = options.url.split(',')[1]
      const decoded = atob(base64)
      expect(decoded).toBe('Hello, World!')
    })
  })

  describe('generateFilename', () => {
    const fixedDate = new Date(2025, 6, 17, 9, 30, 15)

    it('should return default format with no options', () => {
      vi.useFakeTimers()
      vi.setSystemTime(fixedDate)

      const name = service.generateFilename()

      expect(name).toBe('Recording-Screen-2025-07-17_09-30-15.webm')
      vi.useRealTimers()
    })

    it('should use custom prefix', () => {
      const name = service.generateFilename({
        prefix: 'MyRecording',
        source: 'screen',
        mimeType: 'video/webm',
        timestamp: fixedDate.getTime(),
      })

      expect(name).toBe('MyRecording-screen-2025-07-17_09-30-15.webm')
    })

    it('should use custom source', () => {
      const name = service.generateFilename({
        source: 'Tab',
        timestamp: fixedDate.getTime(),
      })

      expect(name).toContain('Tab')
    })

    it('should map MIME types to correct extensions', () => {
      const timestamp = fixedDate.getTime()
      const tests: Array<[string, string]> = [
        ['video/webm', 'webm'],
        ['video/mp4', 'mp4'],
        ['audio/webm', 'webm'],
        ['audio/mp4', 'mp4'],
        ['audio/ogg', 'ogg'],
        ['image/png', 'png'],
        ['image/jpeg', 'jpg'],
        ['image/gif', 'gif'],
        ['video/unknown', 'webm'],
        ['', 'webm'],
      ]

      for (const [mimeType, ext] of tests) {
        const name = service.generateFilename({ mimeType, timestamp })
        expect(name).toBe(`Recording-Screen-2025-07-17_09-30-15.${ext}`)
      }
    })

    it('should sanitize special characters in prefix', () => {
      const name = service.generateFilename({
        prefix: 'My<Recording> #1',
        source: 'screen',
        timestamp: fixedDate.getTime(),
      })

      expect(name).toBe('MyRecording-1-screen-2025-07-17_09-30-15.webm')
    })

    it('should sanitize special characters in source', () => {
      const name = service.generateFilename({
        source: 'Chrome Tab!@#',
        timestamp: fixedDate.getTime(),
      })

      expect(name).toBe('Recording-Chrome-Tab-2025-07-17_09-30-15.webm')
    })

    it('should use provided timestamp', () => {
      const name = service.generateFilename({
        timestamp: 0,
      })

      expect(name).toMatch(/^Recording-Screen-1970-01-01_\d{2}-\d{2}-\d{2}\.webm$/)
    })
  })
})
