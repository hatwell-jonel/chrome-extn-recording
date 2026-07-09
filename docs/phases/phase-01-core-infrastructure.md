# Phase 1 — Core Infrastructure

## Goal

Build the foundation of the recording extension without implementing the final UI.

---

# Checklist

## Background

* [x] Create Background Service Worker
* [x] Register it in the Manifest
* [x] Initialize extension startup
* [x] Handle runtime lifecycle

---

## Recording Manager

* [ ] Create RecordingManager singleton
* [ ] Implement `start()`
* [ ] Implement `stop()`
* [ ] Implement `pause()`
* [ ] Implement `resume()`
* [ ] Implement `cleanup()`
* [ ] Prevent multiple simultaneous recordings

---

## Media Service

* [ ] Create Media Service
* [ ] Abstract browser recording APIs
* [ ] Prepare support for:

  * [ ] Screen recording
  * [ ] Window recording
  * [ ] Tab recording

---

## Messaging

* [ ] Create typed message definitions
* [ ] Create messaging helper
* [ ] Implement runtime messaging
* [ ] Remove future dependency on storage messaging

---

## State Management

* [ ] Create Zustand recording store
* [ ] Recording status
* [ ] Duration
* [ ] Error state
* [ ] Recording metadata

---

## Storage

* [ ] Settings helper
* [ ] Metadata helper
* [ ] User preferences helper

---

## Downloads

* [ ] Download service
* [ ] Blob download helper
* [ ] Filename generator

---

## Permissions

* [ ] Permission service
* [ ] Storage permission
* [ ] Download permission
* [ ] Recording permissions

---

## Errors

* [ ] PermissionDeniedError
* [ ] RecordingAlreadyRunningError
* [ ] RecordingNotRunningError
* [ ] CaptureFailedError
* [ ] DownloadFailedError

---

## Documentation

* [ ] architecture.md
* [ ] messaging.md
* [ ] recording-flow.md
* [ ] state-management.md

---

## Acceptance Criteria

* [ ] Project builds successfully
* [ ] No TypeScript errors
* [ ] No lint errors
* [ ] Existing Popup still works
* [ ] Existing Content Script still works
* [ ] Existing Side Panel still works
* [ ] Background Service Worker is active
* [ ] Messaging layer works
* [ ] RecordingManager can be instantiated
* [ ] Documentation completed

---

## Notes

Use this section to record architecture decisions or implementation notes during development.
