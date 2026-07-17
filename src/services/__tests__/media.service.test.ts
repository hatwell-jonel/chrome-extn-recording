import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MediaService } from '../media.service'
import { OffscreenManager } from '../offscreen-manager.service'
import { MediaAction } from '@/types/media'
import type { CaptureSource } from '@/types/media'
import type { OffscreenMediaResultMessage } from '@/types/messages'
import { type ChromeMock } from '@/test/mocks/chrome'

describe('MediaService', () => {
  let service: MediaService
  let mockChrome: ChromeMock

  beforeEach(() => {
    OffscreenManager['_instance'] = undefined as unknown as OffscreenManager
    MediaService['_instance'] = undefined as unknown as MediaService
    service = MediaService.getInstance()
    mockChrome = chrome as unknown as ChromeMock
    vi.clearAllMocks()
  })

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = MediaService.getInstance()
      const instance2 = MediaService.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('startCapture', () => {
    it('should send START_CAPTURE action to offscreen', async () => {
      const mockResponse: OffscreenMediaResultMessage = {
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: MediaAction.START_CAPTURE,
        success: true,
      }
      mockChrome.runtime.sendMessage.mockResolvedValue(mockResponse)

      const result = await service.startCapture('screen')

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'OFFSCREEN_MEDIA_ACTION',
        action: MediaAction.START_CAPTURE,
        payload: { source: 'screen', options: undefined },
      })
      expect(result).toEqual(mockResponse)
    })

    it('should pass capture options', async () => {
      const mockResponse: OffscreenMediaResultMessage = {
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: MediaAction.START_CAPTURE,
        success: true,
      }
      mockChrome.runtime.sendMessage.mockResolvedValue(mockResponse)

      await service.startCapture('tab', { audio: true, video: true })

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'OFFSCREEN_MEDIA_ACTION',
        action: MediaAction.START_CAPTURE,
        payload: { source: 'tab', options: { audio: true, video: true } },
      })
    })

    it('should propagate errors from offscreen', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue({
        type: 'ERROR',
        code: 'CAPTURE_FAILED',
        message: 'Stream acquisition failed',
        handler: 'offscreen',
      })

      await expect(service.startCapture('window')).rejects.toThrow('Stream acquisition failed')
    })

    it('should work with all capture sources', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue({
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: MediaAction.START_CAPTURE,
        success: true,
      })

      const sources: CaptureSource[] = ['screen', 'window', 'tab']
      for (const source of sources) {
        await service.startCapture(source)
        expect(chrome.runtime.sendMessage).toHaveBeenLastCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({ source }),
          }),
        )
      }
    })
  })

  describe('stopCapture', () => {
    it('should send STOP_CAPTURE action to offscreen', async () => {
      const mockResponse: OffscreenMediaResultMessage = {
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: MediaAction.STOP_CAPTURE,
        success: true,
      }
      mockChrome.runtime.sendMessage.mockResolvedValue(mockResponse)

      const result = await service.stopCapture()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'OFFSCREEN_MEDIA_ACTION',
        action: MediaAction.STOP_CAPTURE,
        payload: undefined,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('pauseCapture', () => {
    it('should send PAUSE_CAPTURE action to offscreen', async () => {
      const mockResponse: OffscreenMediaResultMessage = {
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: MediaAction.PAUSE_CAPTURE,
        success: true,
      }
      mockChrome.runtime.sendMessage.mockResolvedValue(mockResponse)

      const result = await service.pauseCapture()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'OFFSCREEN_MEDIA_ACTION',
        action: MediaAction.PAUSE_CAPTURE,
        payload: undefined,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('resumeCapture', () => {
    it('should send RESUME_CAPTURE action to offscreen', async () => {
      const mockResponse: OffscreenMediaResultMessage = {
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: MediaAction.RESUME_CAPTURE,
        success: true,
      }
      mockChrome.runtime.sendMessage.mockResolvedValue(mockResponse)

      const result = await service.resumeCapture()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'OFFSCREEN_MEDIA_ACTION',
        action: MediaAction.RESUME_CAPTURE,
        payload: undefined,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('error handling', () => {
    it('should throw when offscreen returns error response', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue({
        type: 'ERROR',
        code: 'MEDIA_ERROR',
        message: 'Media action failed',
        handler: 'offscreen',
      })

      await expect(service.startCapture('screen')).rejects.toThrow('Media action failed')
    })

    it('should throw on network errors', async () => {
      mockChrome.runtime.sendMessage.mockRejectedValue(new Error('Connection lost'))

      await expect(service.pauseCapture()).rejects.toThrow('Connection lost')
    })

    it('should pass through successful media result data', async () => {
      const streamData = { chunks: 5, duration: 10000 }
      const mockResponse: OffscreenMediaResultMessage = {
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: MediaAction.STOP_CAPTURE,
        success: true,
        data: streamData,
      }
      mockChrome.runtime.sendMessage.mockResolvedValue(mockResponse)

      const result = await service.stopCapture()
      expect(result.data).toEqual(streamData)
    })
  })
})
