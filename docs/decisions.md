# Architecture Decision Records

## Background Service Worker as Single Source of Truth

**Context:** Multiple UI contexts (side panel, content script, future popup) need to share recording state. Having each context manage its own state leads to inconsistencies.

**Decision:** The background service worker hosts the `RecordingManager` and all services. UI contexts maintain a local Zustand store that syncs via messages. The background is the authoritative source for recording state.

**Trade-off:** Adds latency for every state read (requires a message round-trip). Mitigated by caching the last known state in the local store.

## Offscreen Document for Media Operations

**Context:** Manifest V3 service workers cannot access DOM APIs, `getDisplayMedia`, or `MediaRecorder`. These are required for recording.

**Decision:** Use a dynamically created offscreen document (`chrome.offscreen.createDocument` with reason `USER_MEDIA`) as a hidden DOM context for all media capture operations. Communication between background and offscreen uses `chrome.runtime.sendMessage`.

**Trade-off:** Adds complexity of managing a separate document lifecycle. Offscreen documents have a limited lifetime and may be killed by Chrome under memory pressure. Mitigated by auto-recreation logic in `OffscreenManager`.

## Singleton Service Pattern

**Context:** Services like `RecordingManager`, `MediaService`, and `OffscreenManager` manage shared resources (state machines, document references). Multiple instances would cause conflicts.

**Decision:** All services use a singleton pattern with private constructor and `getInstance()` static method. This is enforced by TypeScript.

**Trade-off:** Singletons can make testing harder. Mitigated by resetting the private `_instance` field in test `beforeEach` blocks.

## Zustand for State Management

**Context:** Need a lightweight state management solution that works across React contexts (side panel, content script) without heavy boilerplate.

**Decision:** Use Zustand with a single store. No providers or context wrappers needed. The store is consumed directly with hooks.

**Trade-off:** A single global store can grow large. Mitigated by using selectors to subscribe to only needed slices.

## Centralized Messaging Service

**Context:** Multiple contexts send and receive messages. Raw `chrome.runtime.sendMessage` calls spread across the codebase would be hard to maintain and type safely.

**Decision:** All messaging goes through `MessagingService` which provides typed `sendMessage()` and `addMessageListener()` wrappers. Message types are defined centrally in `src/types/messages.ts`.

**Trade-off:** Adds an abstraction layer. The indirection is minimal and justified by type safety.

## Recordings Stored in Extension Storage

**Context:** Recording metadata (filenames, timestamps, durations) needs to persist across browser sessions.

**Decision:** Use `chrome.storage.local` for storing recording metadata, user preferences, and settings. Three helper modules handle specific storage domains: `settings`, `recording-metadata`, and `user-preferences`.

**Trade-off:** Storage reads/writes are async. The `recording-metadata` helper loads the full list on every read — acceptable at small scale but may need pagination later.

## Permission Service Abstraction

**Context:** The extension needs to check and request various permissions (`storage`, `downloads`, `desktopCapture`, etc.) at different stages. Direct `chrome.permissions` calls would be scattered.

**Decision:** A `PermissionService` singleton wraps `chrome.permissions` API with typed methods. Optional permissions (`desktopCapture`, `tabCapture`) are declared in `optional_permissions` in the manifest.

**Trade-off:** Camera and microphone permissions require browser-level media dialogs (not runtime permissions) and are not handled until Phase 2.

## Content Script CSS Leak

**Problem:** The shared `tailwind.css` contained Vite+React starter template styles that were injected into every page, breaking host page layouts.

**Fix:** Removed template styles from the shared CSS. Extension UI styling uses shadcn components and Tailwind utility classes. See Phase 1 docs for details.
