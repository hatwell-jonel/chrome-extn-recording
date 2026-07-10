import { describe, it, expect } from 'vitest'
import { MessageType } from '../messages'

describe('MessageType', () => {
  it('should have all expected message types', () => {
    expect(MessageType.PING).toBe('PING')
    expect(MessageType.PONG).toBe('PONG')
    expect(MessageType.GET_RECORDING_STATUS).toBe('GET_RECORDING_STATUS')
    expect(MessageType.START_RECORDING).toBe('START_RECORDING')
    expect(MessageType.STOP_RECORDING).toBe('STOP_RECORDING')
    expect(MessageType.PAUSE_RECORDING).toBe('PAUSE_RECORDING')
    expect(MessageType.RESUME_RECORDING).toBe('RESUME_RECORDING')
    expect(MessageType.OPEN_SIDE_PANEL).toBe('OPEN_SIDE_PANEL')
  })

  it('should have an as const assertion making values literal types', () => {
    const ping: 'PING' = MessageType.PING
    expect(ping).toBe('PING')
  })
})
