# Phase 1 — Core Infrastructure

## Goal

Build the foundation of the recording extension without implementing the final UI. This phase focuses on establishing a scalable architecture, reusable services, and communication between extension contexts.

---

# Checklist

## Background

* [x] Create Background Service Worker
* [x] Register it in the Manifest
* [x] Initialize extension startup
* [x] Handle runtime lifecycle
* [x] Prepare Background as the single source of truth

---

## Messaging

* [x] Create typed message definitions
* [x] Create shared message constants / enums
* [x] Create messaging service
* [x] Implement runtime messaging
* [x] Implement Background message router
* [ ] Remove future dependency on storage messaging (deferred — existing toggle still uses storage)

---

## Recording Manager

* [x] Create `RecordingManager` singleton
* [x] Implement recording state machine
* [x] Implement `start()`
* [x] Implement `stop()`
* [x] Implement `pause()`
* [x] Implement `resume()`
* [x] Implement `cleanup()`
* [x] Implement `getState()`
* [x] Prevent multiple simultaneous recordings

---

## Offscreen Document

* [x] Create Offscreen Document
* [x] Register Offscreen Document
* [x] Implement Offscreen lifecycle
* [x] Prepare Background ↔ Offscreen communication

---

## Media Service

* [x] Create Media Service
* [x] Abstract browser recording APIs
* [x] Create generic capture interface
* [x] Prepare support for:

  * [x] Screen capture
  * [x] Window capture
  * [x] Tab capture

---

## State Management

* [x] Create Zustand recording store
* [x] Recording status
* [x] Recording duration
* [x] Recording metadata
* [x] Error state
* [x] Capture source
* [x] Recording permissions

---

## Storage

* [x] Create settings helper
* [x] Create recording metadata helper
* [x] Create user preferences helper

---

## Downloads

* [x] Create Download Service
* [x] Implement Blob download helper
* [x] Implement filename generator

---

## Permissions

* [ ] Create Permission Service
* [ ] Handle storage permission
* [ ] Handle downloads permission
* [ ] Prepare recording permissions

---

## Errors

* [x] Create `PermissionDeniedError`
* [x] Create `RecordingAlreadyRunningError`
* [x] Create `RecordingNotRunningError`
* [x] Create `CaptureFailedError`
* [x] Create `DownloadFailedError`

---

## Types & Constants

* [ ] Create shared message types
* [ ] Create shared recording types
* [x] Create shared media types
* [ ] Create shared constants
* [ ] Remove duplicated type definitions

---

## Documentation

* [ ] Create `architecture.md`
* [ ] Create `messaging.md`
* [ ] Create `recording-flow.md`
* [ ] Create `state-management.md`
* [ ] Create `decisions.md`

---

# Acceptance Criteria

* [x] Project builds successfully
* [x] No TypeScript errors
* [x] No lint errors
* [x] Existing Popup still works
* [x] Existing Content Script still works
* [x] Existing Side Panel still works
* [x] Background Service Worker is active
* [x] Offscreen Document can be created
* [x] Typed messaging works
* [x] RecordingManager can be instantiated
* [x] RecordingManager state transitions work
* [ ] Documentation completed

---

# Architecture Decisions

Record important architectural decisions made during this phase.

Examples:

* Why the Background Service Worker is the single source of truth.
* Why an Offscreen Document is used for media operations.
* Why browser APIs are abstracted behind services.
* Why runtime messaging is centralized.
* Why Zustand is used for state management.
* Any trade-offs or implementation decisions made during development.

### Content Script CSS Leak

**Problem:** The shared `tailwind.css` contained Vite+React starter template styles (`body { display: flex; place-items: center }`, `#root { max-width: 1280px }`, button/link overrides) that were injected into every page via `content_scripts.css`, breaking host page layouts.

**Fix:** Removed the template styles from the shared CSS. The file now only imports Tailwind, shadcn theme variables, and the Inter font. Extension-specific UI styling will be handled by shadcn components and Tailwind utility classes in future phases.

### Offscreen Document

- **Created dynamically** via `chrome.offscreen.createDocument()` with reason `USER_MEDIA` — not declared statically in manifest.
- **Single-instance** `OffscreenManager` singleton tracks `_isCreated` flag to prevent duplicate creation.
- **Communication** uses `chrome.runtime.sendMessage` (simple request/response). The offscreen doc emits `OFFSCREEN_READY` on load; the background can `PING`/`PONG` for health checks, and send `OFFSCREEN_MEDIA_ACTION` messages for future media operations.
- **URL resolution** uses `chrome.runtime.getURL('src/offscreen/index.html')` — the HTML is built by Vite/CRXJS as an additional rollup entry point.
- **Lifecycle**: created on demand (future: on recording start), closed explicitly (future: on recording stop). Auto-recreation on crash handled by background checking `isCreated` state.
- **Reasoning**: Offscreen documents provide a hidden DOM context required for `MediaRecorder` and `getDisplayMedia` APIs, which are unavailable in MV3 service workers.

### RecordingManager Singleton

- **Singleton pattern** ensures only one recording instance exists, enforced by a private constructor and `getInstance()` static method.
- **State machine** uses a simple `RecordingStatus` union (`'idle'` | `'recording'` | `'paused'`) with explicit transition validation in each method.
- **Custom errors** extend `Error` with a `code` property for structured handling. Errors are thrown immediately on invalid transitions (fail-fast).
- **No external dependencies** — the manager is a pure TypeScript class with no Chrome API or framework imports, making it testable and independent.
