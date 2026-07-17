# State Management

## Store

State is managed with [Zustand](https://github.com/pmndrs/zustand). A single store (`useRecordingStore`) holds all UI-facing state.

## Store Shape

```typescript
interface RecordingStore {
  // Recording state
  status: RecordingStatus           // 'idle' | 'recording' | 'paused'
  startedAt: number | null
  pausedAt: number | null
  totalPausedDuration: number

  // Capture metadata
  captureSource: CaptureSource | null  // 'screen' | 'window' | 'tab'
  metadata: RecordingMetadata          // tabId, tabTitle, tabUrl, etc.

  // Permission state
  permissions: RecordingPermissions    // camera, microphone, display, storage, downloads

  // Error state
  error: string | null
  errorCode: string | null

  // UI state
  isLoading: boolean
  isInitialized: boolean

  // Actions
  initialize: () => Promise<void>
  startRecording: (source: CaptureSource, options?: CaptureOptions) => Promise<void>
  stopRecording: () => Promise<void>
  pauseRecording: () => Promise<void>
  resumeRecording: () => Promise<void>
  clearError: () => void
}
```

## State Sources

The store is the UI's source of truth. The background service worker is the application's source of truth. The store syncs with the background via messages:

- On `initialize()`: sends `GET_RECORDING_STATUS` to fetch current state.
- On `startRecording()` / `stopRecording()` / etc.: sends the corresponding message and updates from the response.
- Error responses update `error` and `errorCode` fields.

## Actions

### `initialize()`
Fetches current recording state from the background. Sets `isInitialized` to `true` on completion.

### `startRecording(source, options?)`
Sets `isLoading`, clears errors, sends `START_RECORDING`. On success, syncs recording state; on error, reverts to idle.

### `stopRecording()`
Sends `STOP_RECORDING`, updates state from response.

### `pauseRecording()` / `resumeRecording()`
Sends `PAUSE_RECORDING` / `RESUME_RECORDING`, updates state from response.

### `clearError()`
Resets `error` and `errorCode` to `null`.

## Usage

```typescript
import { useRecordingStore } from '@/stores/recording.store'

function MyComponent() {
  const status = useRecordingStore((s) => s.status)
  const startRecording = useRecordingStore((s) => s.startRecording)

  return (
    <button onClick={() => startRecording('screen')}>
      {status === 'recording' ? 'Stop' : 'Start'}
    </button>
  )
}
```

Selectors should be used to prevent unnecessary re-renders.
