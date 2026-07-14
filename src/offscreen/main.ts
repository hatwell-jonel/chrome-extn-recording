import { MessageType } from '@/constants/messages'
import type {
  ExtensionMessage,
  ExtensionResponse,
  OffscreenMediaResultMessage,
} from '@/types/messages'

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
  const result: OffscreenMediaResultMessage = {
    type: MessageType.OFFSCREEN_MEDIA_RESULT,
    action: message.action,
    success: false,
    error: 'Not implemented',
  }
  sendResponse(result)
}

chrome.runtime.onMessage.addListener(handleMessage)

chrome.runtime.sendMessage({ type: MessageType.OFFSCREEN_READY })
