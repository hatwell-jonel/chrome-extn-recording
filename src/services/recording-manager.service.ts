import type { RecordingState, RecordingStatus } from '@/types/recording'
import {
  RecordingAlreadyRunningError,
  RecordingNotRunningError,
} from '@/errors/recording.errors'

export class RecordingManager {
  private static _instance: RecordingManager

  private _state: RecordingStatus = 'idle'
  private _startedAt: number | null = null
  private _pausedAt: number | null = null
  private _totalPausedDuration = 0

  private constructor() {}

  static getInstance(): RecordingManager {
    if (!RecordingManager._instance) {
      RecordingManager._instance = new RecordingManager()
    }
    return RecordingManager._instance
  }

  start(): void {
    switch (this._state) {
      case 'idle':
        this._state = 'recording'
        this._startedAt = Date.now()
        this._pausedAt = null
        this._totalPausedDuration = 0
        break
      case 'recording':
      case 'paused':
        throw new RecordingAlreadyRunningError()
    }
  }

  stop(): void {
    switch (this._state) {
      case 'recording':
      case 'paused':
        this._state = 'idle'
        this._startedAt = null
        this._pausedAt = null
        this._totalPausedDuration = 0
        break
      case 'idle':
        throw new RecordingNotRunningError('stop')
    }
  }

  pause(): void {
    switch (this._state) {
      case 'recording':
        this._state = 'paused'
        this._pausedAt = Date.now()
        break
      case 'paused':
        throw new RecordingAlreadyRunningError()
      case 'idle':
        throw new RecordingNotRunningError('pause')
    }
  }

  resume(): void {
    switch (this._state) {
      case 'paused':
        this._state = 'recording'
        if (this._pausedAt !== null) {
          this._totalPausedDuration += Date.now() - this._pausedAt
          this._pausedAt = null
        }
        break
      case 'recording':
        throw new RecordingAlreadyRunningError()
      case 'idle':
        throw new RecordingNotRunningError('resume')
    }
  }

  cleanup(): void {
    this._state = 'idle'
    this._startedAt = null
    this._pausedAt = null
    this._totalPausedDuration = 0
  }

  getState(): RecordingState {
    return {
      status: this._state,
      startedAt: this._startedAt,
      pausedAt: this._pausedAt,
      totalPausedDuration: this._totalPausedDuration,
    }
  }
}
