# Phase 3 — Recording Engine

> **Goal**
>
> Implement the complete recording engine that powers the extension. This phase is responsible for capturing the user's screen, window, or browser tab, recording media using the browser's MediaRecorder API, managing the recording lifecycle, and generating downloadable video files. The engine should remain UI-independent and communicate only through the Background Service Worker.

---

# Overview

## Objectives

The recording engine should:

* Capture media from supported sources.
* Record video using browser APIs.
* Manage the recording lifecycle.
* Produce downloadable video files.
* Recover gracefully from failures.
* Keep the recording logic independent of the UI.
* Be reusable for future features such as webcam overlay and audio recording.

---

# Implementation Parts

---

# Part 1 — Recording Architecture

## Goal

Design the recording pipeline and define the responsibilities of each component.

## Tasks

* [ ] Define recording lifecycle
* [ ] Review RecordingManager responsibilities
* [ ] Define MediaService responsibilities
* [ ] Define DownloadService responsibilities
* [ ] Define message flow
* [ ] Document data flow

## Deliverables

* Recording architecture
* Recording flow diagram

## Documentation

Update:

* `docs/architecture/recording-engine.md`
* `docs/diagrams/recording-flow.md`

## Testing

* [ ] Architecture reviewed
* [ ] Responsibilities clearly separated

## Acceptance Criteria

* [ ] No duplicated responsibilities
* [ ] Recording pipeline documented

---

# Part 2 — Capture Source Selection

## Goal

Allow the engine to request different capture sources.

## Tasks

* [ ] Screen capture
* [ ] Window capture
* [ ] Browser tab capture
* [ ] Validate selected source
* [ ] Handle unsupported selections

## Deliverables

* Generic capture interface

## Documentation

Update:

* `docs/architecture/capture-sources.md`

## Testing

* [ ] Screen selection works
* [ ] Window selection works
* [ ] Tab selection works

## Acceptance Criteria

* [ ] Capture sources use a common interface

---

# Part 3 — Permission Management

## Goal

Request and validate permissions before recording.

## Tasks

* [ ] Request recording permission
* [ ] Handle permission denial
* [ ] Handle cancellation
* [ ] Detect unavailable APIs
* [ ] Surface meaningful errors

## Deliverables

* Permission validation flow

## Documentation

Update:

* `docs/architecture/permissions.md`

## Testing

* [ ] Permission granted
* [ ] Permission denied
* [ ] User cancels selection
* [ ] Browser limitation handling

## Acceptance Criteria

* [ ] Recording never starts without permission
* [ ] Errors are descriptive

---

# Part 4 — Media Capture

## Goal

Acquire a media stream from the selected source.

## Tasks

* [ ] Start capture
* [ ] Validate MediaStream
* [ ] Store active stream
* [ ] Detect inactive tracks
* [ ] Handle stream termination

## Deliverables

* Active MediaStream

## Documentation

Update:

* `docs/architecture/media-stream.md`

## Testing

* [ ] MediaStream is created
* [ ] Stream ends gracefully
* [ ] Invalid stream handled

## Acceptance Criteria

* [ ] Stream lifecycle managed correctly

---

# Part 5 — MediaRecorder Integration

## Goal

Record captured media using the MediaRecorder API.

## Tasks

* [ ] Create MediaRecorder
* [ ] Configure recorder
* [ ] Start recording
* [ ] Pause recording
* [ ] Resume recording
* [ ] Stop recording
* [ ] Listen to MediaRecorder events

## Deliverables

* Recording pipeline

## Documentation

Update:

* `docs/architecture/media-recorder.md`

## Testing

* [ ] Recording starts
* [ ] Pause works
* [ ] Resume works
* [ ] Stop works

## Acceptance Criteria

* [ ] MediaRecorder lifecycle fully managed

---

# Part 6 — Recording Buffer & Blob Generation

## Goal

Collect recorded chunks and generate the final video.

## Tasks

* [ ] Buffer media chunks
* [ ] Handle chunk events
* [ ] Generate Blob
* [ ] Validate Blob
* [ ] Release temporary buffers

## Deliverables

* Recording Blob

## Documentation

Update:

* `docs/architecture/blob-generation.md`

## Testing

* [ ] Blob generated successfully
* [ ] Empty recordings handled
* [ ] Memory cleaned after completion

## Acceptance Criteria

* [ ] Blob generation is reliable
* [ ] No memory leaks

---

# Part 7 — Download Pipeline

## Goal

Save completed recordings to the user's device.

## Tasks

* [ ] Generate filename
* [ ] Create object URL
* [ ] Trigger browser download
* [ ] Release object URL
* [ ] Handle download failures

## Deliverables

* Download workflow

## Documentation

Update:

* `docs/architecture/download-pipeline.md`

## Testing

* [ ] Download starts
* [ ] Filename generated correctly
* [ ] Failed download handled

## Acceptance Criteria

* [ ] Files download successfully
* [ ] Resources cleaned afterward

---

# Part 8 — Recording Lifecycle

## Goal

Manage the complete lifecycle of a recording session.

## Tasks

* [ ] Initialize recording
* [ ] Start session
* [ ] Pause session
* [ ] Resume session
* [ ] Stop session
* [ ] Cleanup session
* [ ] Dispose resources

## Deliverables

* Recording lifecycle manager

## Documentation

Update:

* `docs/architecture/lifecycle.md`

## Testing

* [ ] Lifecycle follows valid transitions
* [ ] Cleanup always executes

## Acceptance Criteria

* [ ] No orphaned streams
* [ ] No leaked resources

---

# Part 9 — Error Recovery

## Goal

Recover gracefully from recording failures.

## Tasks

* [ ] Handle MediaRecorder errors
* [ ] Handle stream failures
* [ ] Handle browser API failures
* [ ] Handle unexpected termination
* [ ] Log recoverable errors

## Deliverables

* Recovery strategy

## Documentation

Update:

* `docs/troubleshooting/recording.md`

## Testing

* [ ] Force recording failure
* [ ] Force stream end
* [ ] Validate recovery

## Acceptance Criteria

* [ ] Application remains stable after failures

---

# Part 10 — Background Integration

## Goal

Integrate the recording engine with the Background Service Worker.

## Tasks

* [ ] Start recording via messages
* [ ] Pause via messages
* [ ] Resume via messages
* [ ] Stop via messages
* [ ] Return recording status
* [ ] Return recording errors

## Deliverables

* Recording message integration

## Documentation

Update:

* `docs/architecture/background-recording.md`

## Testing

* [ ] Background starts recording
* [ ] Popup receives updates
* [ ] State remains synchronized

## Acceptance Criteria

* [ ] Background remains the single source of truth

---

# Part 11 — Engine Validation

## Goal

Validate the recording engine under common scenarios.

## Tasks

* [ ] Record full screen
* [ ] Record browser tab
* [ ] Record application window
* [ ] Long-duration recording
* [ ] Consecutive recordings
* [ ] Rapid start/stop actions

## Deliverables

* Recording validation report

## Documentation

Update:

* `docs/testing/recording-engine.md`

## Testing

* [ ] All recording modes verified
* [ ] Stress scenarios verified
* [ ] Edge cases documented

## Acceptance Criteria

* [ ] Engine behaves consistently
* [ ] No crashes during testing

---

# Part 12 — Phase Review

## Final Checklist

### Recording Engine

* [ ] Capture sources complete
* [ ] Permission handling complete
* [ ] MediaStream management complete
* [ ] MediaRecorder integration complete
* [ ] Blob generation complete
* [ ] Download pipeline complete
* [ ] Lifecycle management complete
* [ ] Error recovery complete

### Architecture

* [ ] Services remain decoupled
* [ ] UI contains no recording logic
* [ ] Background remains the coordinator

### Documentation

* [ ] Recording architecture updated
* [ ] API documentation updated
* [ ] Diagrams updated
* [ ] Troubleshooting updated

### Testing

* [ ] Screen recording verified
* [ ] Window recording verified
* [ ] Tab recording verified
* [ ] Download verified
* [ ] Cleanup verified

---

# Architecture Decisions

Record architectural decisions made during this phase.

Examples:

* Why the recording engine lives behind the Background Service Worker.
* Why browser APIs are abstracted inside `MediaService`.
* Why `MediaRecorder` is wrapped instead of used directly.
* Why recording lifecycle management is centralized.
* Trade-offs between browser compatibility and advanced features.
* Considerations for future support of microphone, system audio, webcam overlay, and additional output formats.

---

# Phase Summary

## Completed Features

*To be completed during implementation.*

## Known Issues

*To be updated during development.*

## Technical Debt

*To be updated during development.*

## Lessons Learned

*To be updated after completing the phase.*

---

# Next Phase

➡ **Phase 4 — Recording Controls**

The next phase will connect the recording engine to user interactions by implementing Start, Pause, Resume, Stop, Cancel, countdown timers, keyboard shortcuts, notifications, and extension badge updates.
