import type { MessageType } from '@/constants/messages'
import type { RecordingState } from './recording'
import type { MediaActionValue, CaptureSource, CaptureOptions } from './media'

export interface PingMessage {
  type: typeof MessageType.PING
}

export interface PongMessage {
  type: typeof MessageType.PONG
  timestamp: number
}

export interface ErrorResponse {
  type: 'ERROR'
  code: string
  message: string
  handler: string
}

export interface OffscreenCreateMessage {
  type: typeof MessageType.OFFSCREEN_CREATE
}

export interface OffscreenCloseMessage {
  type: typeof MessageType.OFFSCREEN_CLOSE
}

export interface OffscreenReadyMessage {
  type: typeof MessageType.OFFSCREEN_READY
}

export interface OffscreenClosedMessage {
  type: 'OFFSCREEN_CLOSED'
}

export interface OffscreenMediaActionMessage {
  type: typeof MessageType.OFFSCREEN_MEDIA_ACTION
  action: MediaActionValue
  payload?: unknown
}

export interface OffscreenMediaResultMessage {
  type: typeof MessageType.OFFSCREEN_MEDIA_RESULT
  action: MediaActionValue
  success: boolean
  data?: unknown
  error?: string
}

export interface GetRecordingStatusMessage {
  type: typeof MessageType.GET_RECORDING_STATUS
}

export interface StartRecordingMessage {
  type: typeof MessageType.START_RECORDING
  source?: CaptureSource
  options?: CaptureOptions
}

export interface StopRecordingMessage {
  type: typeof MessageType.STOP_RECORDING
}

export interface PauseRecordingMessage {
  type: typeof MessageType.PAUSE_RECORDING
}

export interface ResumeRecordingMessage {
  type: typeof MessageType.RESUME_RECORDING
}

export interface OpenSidePanelMessage {
  type: typeof MessageType.OPEN_SIDE_PANEL
}

export interface RecordingStatusResponse {
  type: typeof MessageType.GET_RECORDING_STATUS
  state: RecordingState
}

export type ExtensionMessage =
  | PingMessage
  | OffscreenCreateMessage
  | OffscreenCloseMessage
  | OffscreenReadyMessage
  | OffscreenMediaActionMessage
  | GetRecordingStatusMessage
  | StartRecordingMessage
  | StopRecordingMessage
  | PauseRecordingMessage
  | ResumeRecordingMessage
  | OpenSidePanelMessage

export type ExtensionResponse =
  | PongMessage
  | ErrorResponse
  | OffscreenMediaResultMessage
  | OffscreenReadyMessage
  | OffscreenClosedMessage
  | RecordingStatusResponse
