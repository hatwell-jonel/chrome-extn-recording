export type RecordingStatus = 'idle' | 'recording' | 'paused'

export interface RecordingState {
  status: RecordingStatus
  startedAt: number | null
  pausedAt: number | null
  totalPausedDuration: number
}

export interface RecordingMetadata {
  tabId?: number
  tabTitle?: string
  tabUrl?: string
  mimeType?: string
  fileName?: string
}

export interface RecordingPermissions {
  camera: boolean | null
  microphone: boolean | null
  display: boolean | null
  storage: boolean | null
  downloads: boolean | null
}
