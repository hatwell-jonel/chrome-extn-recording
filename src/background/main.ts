import { MessageType } from '@/constants/messages'
import { addMessageListener } from '@/services/messaging.service'
import { OffscreenManager } from '@/services/offscreen-manager.service'

const offscreenManager = OffscreenManager.getInstance()

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

export { offscreenManager }
