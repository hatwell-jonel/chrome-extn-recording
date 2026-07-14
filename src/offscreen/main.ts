import { MessageType } from '@/constants/messages'
import { MediaAction } from '@/types/media'
import type { MediaActionValue } from '@/types/media'
import type {
  ExtensionMessage,
  ExtensionResponse,
  OffscreenMediaResultMessage,
} from '@/types/messages'

type MediaHandler = (
  payload: unknown,
) => Promise<{ success: boolean; data?: unknown; error?: string }>

const mediaHandlers: Partial<Record<MediaActionValue, MediaHandler>> = {
  [MediaAction.START_CAPTURE]: async (_payload) => {
    return { success: false, error: 'Not implemented' }
  },
  [MediaAction.STOP_CAPTURE]: async (_payload) => {
    return { success: false, error: 'Not implemented' }
  },
  [MediaAction.PAUSE_CAPTURE]: async (_payload) => {
    return { success: false, error: 'Not implemented' }
  },
  [MediaAction.RESUME_CAPTURE]: async (_payload) => {
    return { success: false, error: 'Not implemented' }
  },
  [MediaAction.GET_STATUS]: async (_payload) => {
    return { success: false, error: 'Not implemented' }
  },
}

function handleMessage(
  message: ExtensionMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: ExtensionResponse) => void,
): boolean | void {
  switch (message.type) {
    case MessageType.PING:
      sendResponse({ type: MessageType.PONG, timestamp: Date.now() })
      return true

    case MessageType.OFFSCREEN_MEDIA_ACTION:
      handleMediaAction(message, sendResponse)
      return true

    default:
      return false
  }
}

function handleMediaAction(
  message: Extract<ExtensionMessage, { type: typeof MessageType.OFFSCREEN_MEDIA_ACTION }>,
  sendResponse: (response: ExtensionResponse) => void,
): void {
  const handler = mediaHandlers[message.action]

  if (!handler) {
    const result: OffscreenMediaResultMessage = {
      type: MessageType.OFFSCREEN_MEDIA_RESULT,
      action: message.action,
      success: false,
      error: `Unknown media action: "${message.action}"`,
    }
    sendResponse(result)
    return
  }

  handler(message.payload)
    .then(({ success, data, error }) => {
      const result: OffscreenMediaResultMessage = {
        type: MessageType.OFFSCREEN_MEDIA_RESULT,
        action: message.action,
        success,
        data,
        error,
      }
      sendResponse(result)
    })
    .catch((err: Error) => {
      const result: OffscreenMediaResultMessage = {
        type: MessageType.OFFSCREEN_MEDIA_RESULT,
        action: message.action,
        success: false,
        error: err.message,
      }
      sendResponse(result)
    })
}

chrome.runtime.onMessage.addListener(handleMessage)

chrome.runtime.sendMessage({ type: MessageType.OFFSCREEN_READY })
