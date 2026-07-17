# Architecture

## Extension Contexts

The extension uses multiple Chrome extension contexts, each with a distinct role:

```
┌──────────────────────────────────────────────────────────────────┐
│                     Background Ser    vice Worker                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Messaging    │  │ Recording    │  │ Permission             │  │
│  │ Service      │  │ Manager      │  │ Service                │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Offscreen      │  │ Media        │  │ Download           │   │
│  │ Manager        │  │ Service      │  │ Service            │   │
│  └────────────────┘  └──────────────┘  └────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────┐
│ Offscreen     │   │ Side Panel    │   │ Content Script    │
│ Document      │   │ (React/Zustand)│   │ (React/Zustand)   │
│ (MediaCapture)│   └───────────────┘   └───────────────────┘
└───────────────┘
```

### Background Service Worker
- Single source of truth for recording state.
- Hosts all services: `MessagingService`, `RecordingManager`, `MediaService`, `OffscreenManager`, `PermissionService`, `DownloadService`.
- Routes messages between contexts via `chrome.runtime.onMessage`.

### Offscreen Document
- Hidden DOM document for browser APIs unavailable in service workers (`MediaRecorder`, `getDisplayMedia`).
- Created and destroyed dynamically by `OffscreenManager`.
- Communicates with background via `chrome.runtime.sendMessage`.

### Side Panel
- React UI rendered in the browser side panel.
- Consumes the Zustand store for state.
- Sends messages to background for actions.

### Content Script
- Injected into web pages for in-page UI (future feature).
- Shares the Zustand store with the side panel via state syncing.

## Service Layering

All services follow a singleton pattern with a private constructor and `getInstance()` static method. Services are independent and composable.

| Service | Role |
|---------|------|
| `MessagingService` | Centralized `chrome.runtime.sendMessage` wrapper and listener registration |
| `RecordingManager` | State machine for recording lifecycle |
| `OffscreenManager` | Manages offscreen document lifecycle |
| `MediaService` | Abstracts media capture (screen/window/tab) behind a generic interface |
| `PermissionService` | Wraps `chrome.permissions` for runtime permission checks and requests |
| `DownloadService` | Handles blob-to-file downloads via `chrome.downloads` |

## Data Flow

1. **UI action** (side panel) → message → **background** → service → response → **UI**
2. **Background** → message → **offscreen** → media API call → result message → **background**
3. **Background** queries `chrome.permissions` / `chrome.storage` directly
