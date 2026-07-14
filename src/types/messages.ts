import type { MessageType } from '@/constants/messages'

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
  action: string
  payload?: unknown
}

export interface OffscreenMediaResultMessage {
  type: typeof MessageType.OFFSCREEN_MEDIA_RESULT
  action: string
  success: boolean
  data?: unknown
  error?: string
}

export type ExtensionMessage =
  | PingMessage
  | OffscreenCreateMessage
  | OffscreenCloseMessage
  | OffscreenReadyMessage
  | OffscreenMediaActionMessage

export type ExtensionResponse =
  | PongMessage
  | ErrorResponse
  | OffscreenMediaResultMessage
  | OffscreenReadyMessage
  | OffscreenClosedMessage
