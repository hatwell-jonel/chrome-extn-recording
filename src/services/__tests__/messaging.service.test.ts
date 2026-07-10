import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendMessage, addMessageListener } from '../messaging.service'
import type { ExtensionMessage, ExtensionResponse } from '@/types/messages'
import { MessageType } from '@/constants/messages'

const mockSendMessage = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('chrome', {
    runtime: {
      sendMessage: mockSendMessage,
      onMessage: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
      },
    },
  })
})

describe('sendMessage', () => {
  it('should send a message and return the response', async () => {
    const response: ExtensionResponse = { type: MessageType.PONG, timestamp: 12345 }
    mockSendMessage.mockResolvedValue(response)

    const message: ExtensionMessage = { type: MessageType.PING }
    const result = await sendMessage(message)

    expect(mockSendMessage).toHaveBeenCalledWith(message)
    expect(result).toEqual(response)
  })

  it('should propagate errors from chrome.runtime.sendMessage', async () => {
    const error = new Error('Connection error')
    mockSendMessage.mockRejectedValue(error)

    const message: ExtensionMessage = { type: MessageType.PING }
    await expect(sendMessage(message)).rejects.toThrow('Connection error')
  })
})

describe('addMessageListener', () => {
  it('should register a listener and return an unsubscribe function', () => {
    const addListener = vi.fn()
    const removeListener = vi.fn()
    vi.stubGlobal('chrome', {
      runtime: {
        onMessage: {
          addListener,
          removeListener,
        },
      },
    })

    const handler = vi.fn()
    const unsubscribe = addMessageListener(handler)

    expect(addListener).toHaveBeenCalledTimes(1)

    unsubscribe()
    expect(removeListener).toHaveBeenCalledWith(addListener.mock.calls[0][0])
  })

  it('should call the handler with properly typed arguments', () => {
    let registeredListener: (...args: unknown[]) => void = () => {}
    vi.stubGlobal('chrome', {
      runtime: {
        onMessage: {
          addListener: vi.fn((cb: (...args: unknown[]) => void) => {
            registeredListener = cb
          }),
          removeListener: vi.fn(),
        },
      },
    })

    const handler = vi.fn()
    addMessageListener(handler)

    const message = { type: MessageType.PING }
    const sender = { id: 'test-extension', url: 'https://example.com' }
    const sendResponse = vi.fn()

    registeredListener(message, sender, sendResponse)

    expect(handler).toHaveBeenCalledWith(message, sender, expect.any(Function))
  })

  it('should allow the handler to send responses', () => {
    let registeredListener: (...args: unknown[]) => void = () => {}

    vi.stubGlobal('chrome', {
      runtime: {
        onMessage: {
          addListener: vi.fn((cb: (...args: unknown[]) => void) => {
            registeredListener = cb
          }),
          removeListener: vi.fn(),
        },
      },
    })

    const handler = vi.fn()
    addMessageListener(handler as unknown as Parameters<typeof addMessageListener>[0])

    const message = { type: MessageType.PING }
    const sender = { id: 'test-extension' }
    const sendResponse = vi.fn()

    registeredListener(message, sender, sendResponse)

    const capturedSendResponse = handler.mock.calls[0]?.[2]
    expect(capturedSendResponse).toBeDefined()

    if (capturedSendResponse) {
      const response: ExtensionResponse = { type: MessageType.PONG, timestamp: Date.now() }
      capturedSendResponse(response)
      expect(sendResponse).toHaveBeenCalledWith(response)
    }
  })
})
