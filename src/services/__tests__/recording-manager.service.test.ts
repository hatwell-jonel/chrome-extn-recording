import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { RecordingManager } from '../recording-manager.service'
import {
  RecordingAlreadyRunningError,
  RecordingNotRunningError,
} from '@/errors/recording.errors'

describe('RecordingManager', () => {
  let manager: RecordingManager

  beforeEach(() => {
    vi.useFakeTimers()
    RecordingManager['_instance'] = undefined as unknown as RecordingManager
    manager = RecordingManager.getInstance()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = RecordingManager.getInstance()
      const instance2 = RecordingManager.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('start', () => {
    it('should transition from idle to recording', () => {
      const now = Date.now()
      vi.setSystemTime(now)

      manager.start()
      const state = manager.getState()

      expect(state.status).toBe('recording')
      expect(state.startedAt).toBe(now)
      expect(state.pausedAt).toBeNull()
      expect(state.totalPausedDuration).toBe(0)
    })

    it('should throw if already recording', () => {
      manager.start()
      expect(() => manager.start()).toThrow(RecordingAlreadyRunningError)
    })

    it('should throw if paused', () => {
      manager.start()
      manager.pause()
      expect(() => manager.start()).toThrow(RecordingAlreadyRunningError)
    })

    it('should reset paused state on fresh start', () => {
      manager.start()
      manager.pause()
      manager.resume()
      manager.stop()

      vi.advanceTimersByTime(5000)
      manager.start()

      const state = manager.getState()
      expect(state.totalPausedDuration).toBe(0)
      expect(state.pausedAt).toBeNull()
    })
  })

  describe('stop', () => {
    it('should transition from recording to idle', () => {
      manager.start()
      manager.stop()

      const state = manager.getState()
      expect(state.status).toBe('idle')
      expect(state.startedAt).toBeNull()
      expect(state.pausedAt).toBeNull()
      expect(state.totalPausedDuration).toBe(0)
    })

    it('should transition from paused to idle', () => {
      manager.start()
      manager.pause()
      manager.stop()

      const state = manager.getState()
      expect(state.status).toBe('idle')
    })

    it('should throw if idle', () => {
      expect(() => manager.stop()).toThrow(RecordingNotRunningError)
    })
  })

  describe('pause', () => {
    it('should transition from recording to paused', () => {
      const now = Date.now()
      vi.setSystemTime(now)

      manager.start()
      vi.advanceTimersByTime(1000)
      const pauseTime = Date.now()
      vi.setSystemTime(pauseTime)
      manager.pause()

      const state = manager.getState()
      expect(state.status).toBe('paused')
      expect(state.pausedAt).toBe(pauseTime)
    })

    it('should throw if already paused', () => {
      manager.start()
      manager.pause()
      expect(() => manager.pause()).toThrow(RecordingAlreadyRunningError)
    })

    it('should throw if idle', () => {
      expect(() => manager.pause()).toThrow(RecordingNotRunningError)
    })
  })

  describe('resume', () => {
    it('should transition from paused to recording', () => {
      vi.setSystemTime(1000)
      manager.start()

      vi.setSystemTime(2000)
      manager.pause()

      vi.setSystemTime(5000)
      manager.resume()

      const state = manager.getState()
      expect(state.status).toBe('recording')
      expect(state.pausedAt).toBeNull()
      expect(state.totalPausedDuration).toBe(3000)
    })

    it('should accumulate paused duration across multiple pauses', () => {
      vi.setSystemTime(0)
      manager.start()

      vi.setSystemTime(1000)
      manager.pause()

      vi.setSystemTime(3000)
      manager.resume()

      vi.setSystemTime(4000)
      manager.pause()

      vi.setSystemTime(4500)
      manager.resume()

      const state = manager.getState()
      expect(state.totalPausedDuration).toBe(2500)
    })

    it('should throw if already recording', () => {
      manager.start()
      expect(() => manager.resume()).toThrow(RecordingAlreadyRunningError)
    })

    it('should throw if idle', () => {
      expect(() => manager.resume()).toThrow(RecordingNotRunningError)
    })
  })

  describe('cleanup', () => {
    it('should reset all state to idle defaults', () => {
      manager.start()
      manager.cleanup()

      const state = manager.getState()
      expect(state.status).toBe('idle')
      expect(state.startedAt).toBeNull()
      expect(state.pausedAt).toBeNull()
      expect(state.totalPausedDuration).toBe(0)
    })

    it('should not throw when called on idle manager', () => {
      expect(() => manager.cleanup()).not.toThrow()
    })
  })

  describe('getState', () => {
    it('should return idle state initially', () => {
      const state = manager.getState()
      expect(state).toEqual({
        status: 'idle',
        startedAt: null,
        pausedAt: null,
        totalPausedDuration: 0,
      })
    })

    it('should return current state after transitions', () => {
      manager.start()
      let state = manager.getState()
      expect(state.status).toBe('recording')
      expect(state.startedAt).toBeTypeOf('number')

      manager.pause()
      state = manager.getState()
      expect(state.status).toBe('paused')
      expect(state.pausedAt).toBeTypeOf('number')
    })
  })
})
