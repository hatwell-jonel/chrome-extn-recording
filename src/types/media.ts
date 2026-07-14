export type CaptureSource = 'screen' | 'window' | 'tab'

export interface CaptureOptions {
  audio?: boolean
  video?: boolean
  audioConstraints?: MediaTrackConstraints
  videoConstraints?: MediaTrackConstraints
  mimeType?: string
}

export interface CaptureState {
  isCapturing: boolean
  source: CaptureSource | null
  startedAt: number | null
}

export const MediaAction = {
  START_CAPTURE: 'startCapture',
  STOP_CAPTURE: 'stopCapture',
  PAUSE_CAPTURE: 'pauseCapture',
  RESUME_CAPTURE: 'resumeCapture',
  GET_STATUS: 'getStatus',
} as const

export type MediaActionValue = (typeof MediaAction)[keyof typeof MediaAction]

export interface StartCapturePayload {
  source: CaptureSource
  options?: CaptureOptions
}

export interface StopCapturePayload {}

export interface PauseCapturePayload {}

export interface ResumeCapturePayload {}

export interface GetStatusPayload {}
