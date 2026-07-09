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

chrome.runtime.onMessage.addListener((_message, _sender, sendResponse) => {
  sendResponse({ received: true })
  return true
})

export {}
