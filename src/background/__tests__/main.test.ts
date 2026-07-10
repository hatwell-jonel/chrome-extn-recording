import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MessageType } from '@/constants/messages'

describe('Background service worker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should respond to PING with PONG', async () => {
    const addListener = vi.fn()
    vi.stubGlobal('chrome', {
      runtime: {
        onInstalled: { addListener: vi.fn() },
        onStartup: { addListener: vi.fn() },
        onMessage: { addListener },
      },
    })

    await import('../main')
    const registeredListener = addListener.mock.calls[0]?.[0]

    const message = { type: MessageType.PING }
    const sender = {}
    const sendResponse = vi.fn()

    const result = registeredListener?.(message, sender, sendResponse)

    expect(sendResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        type: MessageType.PONG,
        timestamp: expect.any(Number),
      }),
    )
    expect(result).toBe(true)
  })

  it('should respond with ERROR for unknown message types', async () => {
    const addListener = vi.fn()
    vi.stubGlobal('chrome', {
      runtime: {
        onInstalled: { addListener: vi.fn() },
        onStartup: { addListener: vi.fn() },
        onMessage: { addListener },
      },
    })

    await import('../main')
    const registeredListener = addListener.mock.calls[0]?.[0]

    const message = { type: 'UNKNOWN_TYPE' }
    const sender = {}
    const sendResponse = vi.fn()

    registeredListener?.(message, sender, sendResponse)

    expect(sendResponse).toHaveBeenCalledWith({
      type: 'ERROR',
      code: 'UNKNOWN_MESSAGE_TYPE',
      message: 'Unknown message type: "UNKNOWN_TYPE"',
      handler: 'background',
    })
  })
})
