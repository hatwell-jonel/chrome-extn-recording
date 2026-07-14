import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MessageType } from '@/constants/messages'
import { createChromeMock } from '@/test/mocks/chrome'

describe('Offscreen Document', () => {
  let chromeMock: ReturnType<typeof createChromeMock>

  beforeEach(() => {
    chromeMock = createChromeMock()
    vi.stubGlobal('chrome', chromeMock)
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should send OFFSCREEN_READY on load', async () => {
    await import('../main')

    expect(chromeMock.runtime.sendMessage).toHaveBeenCalledWith({
      type: MessageType.OFFSCREEN_READY,
    })
  })

  it('should respond to PING with PONG', async () => {
    await import('../main')

    const addListener = chromeMock.runtime.onMessage.addListener
    const handler = addListener.mock.calls[0][0]

    const sendResponse = vi.fn()
    handler(
      { type: MessageType.PING },
      {},
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      type: MessageType.PONG,
      timestamp: expect.any(Number),
    })
  })

  it('should handle MEDIA_ACTION with not-implemented response', async () => {
    await import('../main')

    const addListener = chromeMock.runtime.onMessage.addListener
    const handler = addListener.mock.calls[0][0]

    const sendResponse = vi.fn()
    handler(
      { type: MessageType.OFFSCREEN_MEDIA_ACTION, action: 'startCapture', payload: {} },
      {},
      sendResponse,
    )

    expect(sendResponse).toHaveBeenCalledWith({
      type: MessageType.OFFSCREEN_MEDIA_RESULT,
      action: 'startCapture',
      success: false,
      error: 'Not implemented',
    })
  })

  it('should return false for unknown message types', async () => {
    await import('../main')

    const addListener = chromeMock.runtime.onMessage.addListener
    const handler = addListener.mock.calls[0][0]

    const sendResponse = vi.fn()
    const result = handler(
      { type: 'UNKNOWN_TYPE' },
      {},
      sendResponse,
    )

    expect(result).toBe(false)
    expect(sendResponse).not.toHaveBeenCalled()
  })
})
