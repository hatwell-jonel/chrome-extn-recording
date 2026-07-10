import { describe, it, expect } from 'vitest'
import { MessageType } from '@/constants/messages'

describe('message types', () => {
  it('ExtensionMessage should be assignable from a PingMessage', () => {
    const msg: { type: string } = { type: MessageType.PING }
    expect(msg.type).toBe('PING')
  })

  it('ExtensionResponse should be assignable from PongMessage shape', () => {
    const pong = { type: MessageType.PONG, timestamp: Date.now() }
    expect(pong.type).toBe('PONG')
    expect(pong.timestamp).toBeTypeOf('number')
  })

  it('ErrorResponse should have the correct shape', () => {
    const error = {
      type: 'ERROR' as const,
      code: 'TEST_ERROR',
      message: 'Something went wrong',
      handler: 'background',
    }
    expect(error.type).toBe('ERROR')
    expect(error.code).toBe('TEST_ERROR')
    expect(error.message).toBe('Something went wrong')
    expect(error.handler).toBe('background')
  })
})
