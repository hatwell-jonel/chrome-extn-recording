import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MessageType } from '@/constants/messages'
import { createChromeMock } from '@/test/mocks/chrome'

describe('Background service worker', () => {
  let chromeMock: ReturnType<typeof createChromeMock>

  beforeEach(async () => {
    chromeMock = createChromeMock()
    vi.stubGlobal('chrome', chromeMock)
    vi.clearAllMocks()
    vi.resetModules()
  })

  function getHandler(): (...args: unknown[]) => unknown {
    return chromeMock.runtime.onMessage.addListener.mock.calls[0][0]
  }

  it('should respond to PING with PONG', async () => {
    await import('../main')
    const handler = getHandler()

    const sendResponse = vi.fn()
    const result = handler({ type: MessageType.PING }, {}, sendResponse)

    expect(sendResponse).toHaveBeenCalledWith({
      type: MessageType.PONG,
      timestamp: expect.any(Number),
    })
    expect(result).toBe(true)
  })

  it('should respond with ERROR for unknown message types', async () => {
    await import('../main')
    const handler = getHandler()

    const sendResponse = vi.fn()
    handler({ type: 'UNKNOWN_TYPE' }, {}, sendResponse)

    expect(sendResponse).toHaveBeenCalledWith({
      type: 'ERROR',
      code: 'UNKNOWN_MESSAGE_TYPE',
      message: 'Unknown message type: "UNKNOWN_TYPE"',
      handler: 'background',
    })
  })

  it('should handle OFFSCREEN_CREATE by creating offscreen document', async () => {
    await import('../main')
    const handler = getHandler()

    const sendResponse = vi.fn()
    const result = handler({ type: MessageType.OFFSCREEN_CREATE }, {}, sendResponse)

    expect(result).toBe(true)
    expect(chromeMock.offscreen.createDocument).toHaveBeenCalledOnce()

    await vi.waitFor(() => {
      expect(sendResponse).toHaveBeenCalledWith({
        type: MessageType.OFFSCREEN_READY,
      })
    })
  })

  it('should handle OFFSCREEN_CLOSE by closing offscreen document', async () => {
    await import('../main')
    const handler = getHandler()

    const createResponse = vi.fn()
    handler({ type: MessageType.OFFSCREEN_CREATE }, {}, createResponse)
    await vi.waitFor(() => {
      expect(createResponse).toHaveBeenCalledWith({ type: MessageType.OFFSCREEN_READY })
    })

    const closeResponse = vi.fn()
    const result = handler({ type: MessageType.OFFSCREEN_CLOSE }, {}, closeResponse)

    expect(result).toBe(true)
    expect(chromeMock.offscreen.closeDocument).toHaveBeenCalledOnce()

    await vi.waitFor(() => {
      expect(closeResponse).toHaveBeenCalledWith({ type: 'OFFSCREEN_CLOSED' })
    })
  })

  it('should handle OFFSCREEN_CLOSE error gracefully', async () => {
    chromeMock.offscreen.closeDocument.mockRejectedValue(new Error('Close failed'))

    await import('../main')
    const handler = getHandler()

    const createResponse = vi.fn()
    handler({ type: MessageType.OFFSCREEN_CREATE }, {}, createResponse)
    await vi.waitFor(() => {
      expect(createResponse).toHaveBeenCalled()
    })

    const closeResponse = vi.fn()
    handler({ type: MessageType.OFFSCREEN_CLOSE }, {}, closeResponse)

    await vi.waitFor(() => {
      expect(closeResponse).toHaveBeenCalledWith({
        type: 'ERROR',
        code: 'OFFSCREEN_CLOSE_FAILED',
        message: 'Close failed',
        handler: 'background',
      })
    })
  })

  it('should handle OFFSCREEN_CREATE error gracefully', async () => {
    chromeMock.offscreen.createDocument.mockRejectedValue(new Error('Create failed'))

    await import('../main')
    const handler = getHandler()

    const sendResponse = vi.fn()
    handler({ type: MessageType.OFFSCREEN_CREATE }, {}, sendResponse)

    await vi.waitFor(() => {
      expect(sendResponse).toHaveBeenCalledWith({
        type: 'ERROR',
        code: 'OFFSCREEN_CREATE_FAILED',
        message: 'Create failed',
        handler: 'background',
      })
    })
  })
})
