export interface StoredRecording {
  id: string
  name: string
  createdAt: number
  duration: number
  source: string
  mimeType: string
  fileSize?: number
}

export interface UserPreferences {
  defaultSource: 'screen' | 'window' | 'tab'
  includeAudio: boolean
  includeMicrophone: boolean
  countdownDuration: number
  autoDownload: boolean
}
