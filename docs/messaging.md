# Messaging

## Architecture

All extension context communication uses `chrome.runtime.sendMessage` with a centralized routing pattern. The `MessagingService` provides type-safe wrappers for sending messages and registering listeners.

## Message Types

Defined in `src/types/messages.ts` with corresponding string constants in `src/constants/messages.ts`.

### Request Types (`ExtensionMessage`)

| Message | `type` | Payload | Direction |
|---------|--------|---------|-----------|
| `PingMessage` | `PING` | — | Any → Background |
| `OffscreenCreateMessage` | `OFFSCREEN_CREATE` | — | Any → Background |
| `OffscreenCloseMessage` | `OFFSCREEN_CLOSE` | — | Any → Background |
| `GetRecordingStatusMessage` | `GET_RECORDING_STATUS` | — | Any → Background |
| `StartRecordingMessage` | `START_RECORDING` | `source?`, `options?` | Any → Background |
| `StopRecordingMessage` | `STOP_RECORDING` | — | Any → Background |
| `PauseRecordingMessage` | `PAUSE_RECORDING` | — | Any → Background |
| `ResumeRecordingMessage` | `RESUME_RECORDING` | — | Any → Background |
| `OpenSidePanelMessage` | `OPEN_SIDE_PANEL` | — | Any → Background |
| `OffscreenMediaActionMessage` | `OFFSCREEN_MEDIA_ACTION` | `action`, `payload?` | Background → Offscreen |

### Response Types (`ExtensionResponse`)

| Response | `type` | Payload |
|----------|--------|---------|
| `PongMessage` | `PONG` | `timestamp` |
| `ErrorResponse` | `ERROR` | `code`, `message`, `handler` |
| `RecordingStatusResponse` | `GET_RECORDING_STATUS` | `state` |
| `OffscreenReadyMessage` | `OFFSCREEN_READY` | — |
| `OffscreenClosedMessage` | `OFFSCREEN_CLOSED` | — |
| `OffscreenMediaResultMessage` | `OFFSCREEN_MEDIA_RESULT` | `action`, `success`, `data?`, `error?` |

## Request/Response Pattern

All messages use a simple Promise-based request/response pattern:

```typescript
// Sending (via MessagingService)
const response = await sendMessage({ type: MessageType.GET_RECORDING_STATUS })

// Handling (via addMessageListener)
addMessageListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case MessageType.PING:
      sendResponse({ type: MessageType.PONG, timestamp: Date.now() })
      return true
  }
})
```

The `return true` in the handler keeps the message channel open for async `sendResponse` calls.

## Handler Registration

```typescript
import { addMessageListener } from '@/services/messaging.service'

addMessageListener((message, sender, sendResponse) => {
  // Handle messages
})
```

Multiple listeners can be registered; they are all called in registration order.

## Offscreen Communication

The offscreen document and background communicate via the same `chrome.runtime.sendMessage` API. The offscreen document:

1. Sends `OFFSCREEN_READY` on load.
2. Receives `OFFSCREEN_MEDIA_ACTION` messages from the background.
3. Responds with `OFFSCREEN_MEDIA_RESULT` after completing media actions.
4. Sends `OFFSCREEN_CLOSED` before unloading.
