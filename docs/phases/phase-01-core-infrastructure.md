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

* [ ] Create `RecordingManager` singleton
* [ ] Implement recording state machine
* [ ] Implement `start()`
* [ ] Implement `stop()`
* [ ] Implement `pause()`
* [ ] Implement `resume()`
* [ ] Implement `cleanup()`
* [ ] Implement `getState()`
* [ ] Prevent multiple simultaneous recordings

---

## Offscreen Document

* [ ] Create Offscreen Document
* [ ] Register Offscreen Document
* [ ] Implement Offscreen lifecycle
* [ ] Prepare Background ↔ Offscreen communication

---

## Media Service

* [ ] Create Media Service
* [ ] Abstract browser recording APIs
* [ ] Create generic capture interface
* [ ] Prepare support for:

  * [ ] Screen capture
  * [ ] Window capture
  * [ ] Tab capture

---

## State Management

* [ ] Create Zustand recording store
* [ ] Recording status
* [ ] Recording duration
* [ ] Recording metadata
* [ ] Error state
* [ ] Capture source
* [ ] Recording permissions

---

## Storage

* [ ] Create settings helper
* [ ] Create recording metadata helper
* [ ] Create user preferences helper

---

## Downloads

* [ ] Create Download Service
* [ ] Implement Blob download helper
* [ ] Implement filename generator

---

## Permissions

* [ ] Create Permission Service
* [ ] Handle storage permission
* [ ] Handle downloads permission
* [ ] Prepare recording permissions

---

## Errors

* [ ] Create `PermissionDeniedError`
* [ ] Create `RecordingAlreadyRunningError`
* [ ] Create `RecordingNotRunningError`
* [ ] Create `CaptureFailedError`
* [ ] Create `DownloadFailedError`

---

## Types & Constants

* [ ] Create shared message types
* [ ] Create shared recording types
* [ ] Create shared media types
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
* [ ] Offscreen Document can be created
* [x] Typed messaging works
* [ ] RecordingManager can be instantiated
* [ ] RecordingManager state transitions work
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
