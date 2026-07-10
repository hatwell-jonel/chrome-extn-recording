export type RecordingStatus = 'idle' | 'recording' | 'paused'

export interface RecordingState {
  status: RecordingStatus
  startedAt: number | null
  pausedAt: number | null
  totalPausedDuration: number
}
