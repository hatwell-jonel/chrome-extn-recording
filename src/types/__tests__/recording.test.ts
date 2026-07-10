import { describe, it, expect } from 'vitest'
import type { RecordingState, RecordingStatus } from './recording'

describe('RecordingStatus', () => {
  it('should accept valid status values', () => {
    const statuses: RecordingStatus[] = ['idle', 'recording', 'paused']
    expect(statuses).toHaveLength(3)
  })
})

describe('RecordingState', () => {
  it('should create a valid idle state', () => {
    const state: RecordingState = {
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      totalPausedDuration: 0,
    }
    expect(state.status).toBe('idle')
    expect(state.startedAt).toBeNull()
    expect(state.pausedAt).toBeNull()
    expect(state.totalPausedDuration).toBe(0)
  })

  it('should create a valid recording state', () => {
    const state: RecordingState = {
      status: 'recording',
      startedAt: 1000,
      pausedAt: null,
      totalPausedDuration: 0,
    }
    expect(state.status).toBe('recording')
    expect(state.startedAt).toBe(1000)
  })

  it('should create a valid paused state', () => {
    const state: RecordingState = {
      status: 'paused',
      startedAt: 1000,
      pausedAt: 2000,
      totalPausedDuration: 500,
    }
    expect(state.status).toBe('paused')
    expect(state.pausedAt).toBe(2000)
    expect(state.totalPausedDuration).toBe(500)
  })
})
