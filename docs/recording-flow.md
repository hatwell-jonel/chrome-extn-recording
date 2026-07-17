# Recording Flow

## State Machine

The recording lifecycle is managed by `RecordingManager` with a simple state machine:

```
┌─────────┐  start()  ┌───────────┐  pause()  ┌────────┐
│  idle   │ ─────────→ │ recording │ ─────────→ │ paused │
└─────────┘            └───────────┘            └────────┘
     ▲                       │  ▲                    │
     │                       │  │                    │
     │       stop()          │  │    resume()        │
     └───────────────────────┘  └────────────────────┘
     └───────────────────────┘
     Also from paused via stop()
```

### Transitions

| Method | Valid From | Valid To | Description |
|--------|-----------|----------|-------------|
| `start()` | `idle` | `recording` | Begins a new recording, resets timing |
| `stop()` | `recording`, `paused` | `idle` | Ends recording, clears state |
| `pause()` | `recording` | `paused` | Pauses active recording |
| `resume()` | `paused` | `recording` | Resumes paused recording |
| `cleanup()` | Any | `idle` | Force-resets to idle (for error recovery) |

Invalid transitions throw typed errors (`RecordingAlreadyRunningError`, `RecordingNotRunningError`).

## Start Flow

1. UI sends `START_RECORDING` message to background.
2. Background calls `RecordingManager.start()` to transition to `recording`.
3. Background creates offscreen document via `OffscreenManager.create()`.
4. Background calls `MediaService.startCapture()` which sends `OFFSCREEN_MEDIA_ACTION` to offscreen.
5. Offscreen calls `getDisplayMedia()` / `getUserMedia()` and starts `MediaRecorder`.
6. Offscreen responds with `OFFSCREEN_MEDIA_RESULT`.
7. Background sends `RecordingStatusResponse` back to UI.

## Stop Flow

1. UI sends `STOP_RECORDING` message to background.
2. Background calls `RecordingManager.stop()` to transition to `idle`.
3. Background calls `MediaService.stopCapture()` which stops the offscreen media capture.
4. Background closes offscreen document via `OffscreenManager.close()`.
5. Background sends `RecordingStatusResponse` back to UI.

## Pause/Resume Flow

Pause stops the `MediaRecorder` (no data written); resume starts a new `MediaRecorder` session on the same `MediaStream`. The `RecordingManager` tracks accumulated paused duration for accurate recording time display.

## Error Handling

- Capture failures: `CaptureFailedError` — sent back as `ErrorResponse` to UI.
- Permission denials: `PermissionDeniedError` — thrown when `chrome.permissions.request` is denied.
- State violations: `RecordingAlreadyRunningError` / `RecordingNotRunningError` — thrown on invalid state transitions.
- `cleanup()` resets the manager to idle on any unrecoverable error.

## Download Flow

After recording stops, the recorded blob is downloaded via `DownloadService` which converts it to a data URL and calls `chrome.downloads.download`. Filenames are generated in the format `{Prefix}-{Source}-{YYYY-MM-DD_HH-mm-ss}.{ext}`.
