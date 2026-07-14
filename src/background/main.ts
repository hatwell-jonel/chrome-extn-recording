import { MessageType } from '@/constants/messages'
import { addMessageListener } from '@/services/messaging.service'
import { OffscreenManager } from '@/services/offscreen-manager.service'
import { RecordingManager } from '@/services/recording-manager.service'
import { MediaService } from '@/services/media.service'
import type { CaptureSource, CaptureOptions } from '@/types/media'
import type { ExtensionResponse } from '@/types/messages'

const offscreenManager = OffscreenManager.getInstance()
const recordingManager = RecordingManager.getInstance()
const mediaService = MediaService.getInstance()

function initialize(): void {
  console.log('[Background] Extension initialized')
}

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] onInstalled:', details.reason)
  initialize()
})

chrome.runtime.onStartup.addListener(() => {
  console.log('[Background] onStartup')
  initialize()
})

addMessageListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case MessageType.PING:
      sendResponse({ type: MessageType.PONG, timestamp: Date.now() })
      return true

    case MessageType.OFFSCREEN_CREATE:
      offscreenManager.create()
        .then(() => sendResponse({ type: MessageType.OFFSCREEN_READY }))
        .catch((err: Error) => sendResponse({
          type: 'ERROR',
          code: 'OFFSCREEN_CREATE_FAILED',
          message: err.message,
          handler: 'background',
        }))
      return true

    case MessageType.OFFSCREEN_CLOSE:
      offscreenManager.close()
        .then(() => sendResponse({ type: 'OFFSCREEN_CLOSED' }))
        .catch((err: Error) => sendResponse({
          type: 'ERROR',
          code: 'OFFSCREEN_CLOSE_FAILED',
          message: err.message,
          handler: 'background',
        }))
      return true

    case MessageType.OFFSCREEN_READY:
      return

    case MessageType.GET_RECORDING_STATUS: {
      const state = recordingManager.getState()
      const response: ExtensionResponse = {
        type: MessageType.GET_RECORDING_STATUS,
        state,
      }
      sendResponse(response)
      return true
    }

    case MessageType.START_RECORDING: {
      const source = 'source' in message ? (message as { source?: CaptureSource }).source : undefined
      const options = 'options' in message ? (message as { options?: CaptureOptions }).options : undefined

      try {
        recordingManager.start()
      } catch (err) {
        sendResponse({
          type: 'ERROR',
          code: err instanceof Error ? (err as Error & { code?: string }).code ?? 'START_FAILED' : 'START_FAILED',
          message: err instanceof Error ? err.message : 'Failed to start recording',
          handler: 'background',
        })
        return true
      }

      offscreenManager.create()
        .catch(() => {})
        .finally(() => {
          mediaService.startCapture(source ?? 'screen', options)
            .then((result) => {
              if (result.success) {
                sendResponse({ type: MessageType.GET_RECORDING_STATUS, state: recordingManager.getState() })
              } else {
                recordingManager.cleanup()
                sendResponse({
                  type: 'ERROR',
                  code: 'CAPTURE_FAILED',
                  message: result.error ?? 'Capture failed',
                  handler: 'background',
                })
              }
            })
            .catch((err: Error) => {
              recordingManager.cleanup()
              sendResponse({
                type: 'ERROR',
                code: 'CAPTURE_FAILED',
                message: err.message,
                handler: 'background',
              })
            })
        })
      return true
    }

    case MessageType.STOP_RECORDING: {
      try {
        recordingManager.stop()
      } catch (err) {
        sendResponse({
          type: 'ERROR',
          code: err instanceof Error ? (err as Error & { code?: string }).code ?? 'STOP_FAILED' : 'STOP_FAILED',
          message: err instanceof Error ? err.message : 'Failed to stop recording',
          handler: 'background',
        })
        return true
      }

      mediaService.stopCapture()
        .then((result) => {
          sendResponse({
            type: MessageType.GET_RECORDING_STATUS,
            state: recordingManager.getState(),
          })
          if (!result.success) {
            console.warn('[Background] Capture stop reported failure:', result.error)
          }
        })
        .catch((err: Error) => {
          sendResponse({
            type: MessageType.GET_RECORDING_STATUS,
            state: recordingManager.getState(),
          })
          console.warn('[Background] Capture stop error:', err.message)
        })

      offscreenManager.close().catch(() => {})
      return true
    }

    case MessageType.PAUSE_RECORDING: {
      try {
        recordingManager.pause()
      } catch (err) {
        sendResponse({
          type: 'ERROR',
          code: err instanceof Error ? (err as Error & { code?: string }).code ?? 'PAUSE_FAILED' : 'PAUSE_FAILED',
          message: err instanceof Error ? err.message : 'Failed to pause recording',
          handler: 'background',
        })
        return true
      }

      mediaService.pauseCapture()
        .then(() => {
          sendResponse({ type: MessageType.GET_RECORDING_STATUS, state: recordingManager.getState() })
        })
        .catch((err: Error) => {
          sendResponse({
            type: 'ERROR',
            code: 'PAUSE_FAILED',
            message: err.message,
            handler: 'background',
          })
        })
      return true
    }

    case MessageType.RESUME_RECORDING: {
      try {
        recordingManager.resume()
      } catch (err) {
        sendResponse({
          type: 'ERROR',
          code: err instanceof Error ? (err as Error & { code?: string }).code ?? 'RESUME_FAILED' : 'RESUME_FAILED',
          message: err instanceof Error ? err.message : 'Failed to resume recording',
          handler: 'background',
        })
        return true
      }

      mediaService.resumeCapture()
        .then(() => {
          sendResponse({ type: MessageType.GET_RECORDING_STATUS, state: recordingManager.getState() })
        })
        .catch((err: Error) => {
          sendResponse({
            type: 'ERROR',
            code: 'RESUME_FAILED',
            message: err.message,
            handler: 'background',
          })
        })
      return true
    }

    default:
      sendResponse({
        type: 'ERROR',
        code: 'UNKNOWN_MESSAGE_TYPE',
        message: `Unknown message type: "${message.type}"`,
        handler: 'background',
      })
      return true
  }
})

export { offscreenManager, recordingManager, mediaService }
