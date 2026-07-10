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

export type ExtensionMessage = PingMessage

export type ExtensionResponse = PongMessage | ErrorResponse
