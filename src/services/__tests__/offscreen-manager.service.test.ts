import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OffscreenManager } from '../offscreen-manager.service'
import { type ChromeMock } from '@/test/mocks/chrome'

describe('OffscreenManager', () => {
  let manager: OffscreenManager
  let mockChrome: ChromeMock

  beforeEach(() => {
    OffscreenManager['_instance'] = undefined as unknown as OffscreenManager
    manager = OffscreenManager.getInstance()
    mockChrome = chrome as unknown as ChromeMock
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = OffscreenManager.getInstance()
      const instance2 = OffscreenManager.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('create', () => {
    it('should call chrome.offscreen.createDocument with correct params', async () => {
      await manager.create()

      expect(chrome.offscreen.createDocument).toHaveBeenCalledOnce()
      const callArgs = (chrome.offscreen.createDocument as ReturnType<typeof vi.fn>).mock.calls[0][0]
      expect(callArgs.url).toContain('src/offscreen/index.html')
      expect(callArgs.reasons).toContain('USER_MEDIA')
      expect(callArgs.justification).toBeTruthy()
    })

    it('should set isCreated to true after creation', async () => {
      expect(manager.isCreated).toBe(false)
      await manager.create()
      expect(manager.isCreated).toBe(true)
    })

    it('should not call createDocument if already created', async () => {
      await manager.create()
      expect(chrome.offscreen.createDocument).toHaveBeenCalledTimes(1)

      await manager.create()
      expect(chrome.offscreen.createDocument).toHaveBeenCalledTimes(1)
    })

    it('should propagate errors from chrome.offscreen.createDocument', async () => {
      const error = new Error('Failed to create document')
      mockChrome.offscreen.createDocument.mockRejectedValueOnce(error)

      await expect(manager.create()).rejects.toThrow(error)
      expect(manager.isCreated).toBe(false)
    })
  })

  describe('close', () => {
    it('should call chrome.offscreen.closeDocument when document exists', async () => {
      await manager.create()
      expect(chrome.offscreen.closeDocument).not.toHaveBeenCalled()

      await manager.close()
      expect(chrome.offscreen.closeDocument).toHaveBeenCalledOnce()
    })

    it('should set isCreated to false after close', async () => {
      await manager.create()
      expect(manager.isCreated).toBe(true)

      await manager.close()
      expect(manager.isCreated).toBe(false)
    })

    it('should not call closeDocument if not created', async () => {
      await manager.close()
      expect(chrome.offscreen.closeDocument).not.toHaveBeenCalled()
    })
  })

  describe('ping', () => {
    it('should return true when offscreen responds with PONG', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue({
        type: 'PONG',
        timestamp: Date.now(),
      })

      const result = await manager.ping()
      expect(result).toBe(true)
    })

    it('should return false when offscreen responds with error', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue({
        type: 'ERROR',
        code: 'UNKNOWN_MESSAGE_TYPE',
        message: 'test',
        handler: 'offscreen',
      })

      const result = await manager.ping()
      expect(result).toBe(false)
    })

    it('should return false when sendMessage throws', async () => {
      mockChrome.runtime.sendMessage.mockRejectedValue(new Error('Connection failed'))

      const result = await manager.ping()
      expect(result).toBe(false)
    })
  })

  describe('sendMediaAction', () => {
    it('should send a media action message to offscreen', async () => {
      const mockResponse = {
        type: 'OFFSCREEN_MEDIA_RESULT',
        action: 'startCapture',
        success: true,
      }
      mockChrome.runtime.sendMessage.mockResolvedValue(mockResponse)

      const result = await manager.sendMediaAction('startCapture', { source: 'screen' })

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'OFFSCREEN_MEDIA_ACTION',
        action: 'startCapture',
        payload: { source: 'screen' },
      })
      expect(result.success).toBe(true)
    })

    it('should throw when offscreen returns an error', async () => {
      mockChrome.runtime.sendMessage.mockResolvedValue({
        type: 'ERROR',
        code: 'CAPTURE_FAILED',
        message: 'Capture failed',
        handler: 'offscreen',
      })

      await expect(manager.sendMediaAction('startCapture')).rejects.toThrow('Capture failed')
    })
  })
})
