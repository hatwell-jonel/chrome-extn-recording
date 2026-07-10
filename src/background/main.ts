import { MessageType } from '@/constants/messages'
import { addMessageListener } from '@/services/messaging.service'

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

export {}
