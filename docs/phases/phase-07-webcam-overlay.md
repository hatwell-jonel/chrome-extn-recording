# Phase 7 — Webcam Overlay

> **Goal**
>
> Add webcam recording with a picture-in-picture (PiP) overlay that can be displayed on top of the recorded screen. This phase focuses on camera capture, overlay rendering, positioning, resizing, and compositing while keeping the implementation modular and extensible for future enhancements.

---

# Overview

## Objectives

The webcam system should:

* Capture video from the user's webcam.
* Render the webcam as an overlay on the recording.
* Support multiple overlay positions.
* Allow drag-and-drop positioning.
* Support resizing.
* Support different overlay shapes.
* Maintain good recording performance.
* Remain independent from the Popup UI.

---

# Implementation Parts

---

# Part 1 — Webcam Architecture

## Goal

Design the webcam subsystem and define how it integrates with the recording engine.

## Tasks

* [ ] Define CameraService responsibilities
* [ ] Define overlay renderer
* [ ] Define rendering pipeline
* [ ] Define camera lifecycle
* [ ] Define integration with Recording Engine

## Deliverables

* Webcam architecture
* Rendering pipeline diagram

## Documentation

Update:

* `docs/architecture/webcam.md`
* `docs/diagrams/webcam-flow.md`

## Testing

* [ ] Architecture reviewed
* [ ] Responsibilities documented

## Acceptance Criteria

* [ ] Camera system is modular
* [ ] Rendering responsibilities clearly separated

---

# Part 2 — Webcam Capture

## Goal

Capture live video from the user's webcam.

## Tasks

* [ ] Request camera permission
* [ ] Enumerate available cameras
* [ ] Capture webcam stream
* [ ] Handle unavailable cameras
* [ ] Handle permission denial
* [ ] Handle disconnected devices

## Deliverables

* Camera capture service

## Documentation

Update:

* `docs/architecture/camera.md`

## Testing

* [ ] Camera permission granted
* [ ] Camera permission denied
* [ ] Camera disconnected
* [ ] Multiple cameras detected

## Acceptance Criteria

* [ ] Camera stream initializes correctly
* [ ] Errors handled gracefully

---

# Part 3 — Overlay Rendering

## Goal

Render the webcam feed on top of the recorded screen.

## Tasks

* [ ] Create overlay renderer
* [ ] Render camera stream
* [ ] Synchronize overlay with recording
* [ ] Handle overlay visibility
* [ ] Maintain rendering performance

## Deliverables

* Webcam overlay renderer

## Documentation

Update:

* `docs/architecture/overlay-renderer.md`

## Testing

* [ ] Overlay displayed correctly
* [ ] Overlay hidden correctly
* [ ] Overlay synchronized with recording

## Acceptance Criteria

* [ ] Overlay renders without noticeable lag

---

# Part 4 — Overlay Positioning

## Goal

Allow users to position the webcam overlay.

## Tasks

* [ ] Top-left position
* [ ] Top-right position
* [ ] Bottom-left position
* [ ] Bottom-right position
* [ ] Center position (future)
* [ ] Save selected position

## Deliverables

* Overlay positioning system

## Documentation

Update:

* `docs/architecture/overlay-position.md`

## Testing

* [ ] Position changes correctly
* [ ] Position persists during recording

## Acceptance Criteria

* [ ] Overlay remains within recording bounds

---

# Part 5 — Drag & Resize

## Goal

Allow users to freely position and resize the webcam overlay.

## Tasks

* [ ] Drag overlay
* [ ] Resize overlay
* [ ] Snap to edges (optional)
* [ ] Minimum size
* [ ] Maximum size
* [ ] Boundary constraints

## Deliverables

* Interactive overlay controls

## Documentation

Update:

* `docs/architecture/overlay-interactions.md`

## Testing

* [ ] Dragging works
* [ ] Resizing works
* [ ] Overlay remains inside recording area

## Acceptance Criteria

* [ ] User interactions are smooth
* [ ] Overlay cannot leave visible bounds

---

# Part 6 — Overlay Appearance

## Goal

Support different webcam overlay styles.

## Tasks

* [ ] Circular overlay
* [ ] Rounded rectangle
* [ ] Square overlay
* [ ] Border styles
* [ ] Shadow styles
* [ ] Mirror preview

## Deliverables

* Overlay appearance options

## Documentation

Update:

* `docs/architecture/overlay-styles.md`

## Testing

* [ ] Shape changes correctly
* [ ] Mirror preview works
* [ ] Styles render consistently

## Acceptance Criteria

* [ ] Appearance changes do not affect recording quality

---

# Part 7 — Camera Controls

## Goal

Allow users to manage webcam behavior.

## Tasks

* [ ] Enable webcam
* [ ] Disable webcam
* [ ] Switch cameras
* [ ] Preview camera
* [ ] Camera status indicator
* [ ] Handle unavailable devices

## Deliverables

* Camera control workflow

## Documentation

Update:

* `docs/architecture/camera-controls.md`

## Testing

* [ ] Camera toggles correctly
* [ ] Camera switching works
* [ ] Status updates correctly

## Acceptance Criteria

* [ ] Camera can be controlled independently from recording

---

# Part 8 — Performance Optimization

## Goal

Ensure webcam rendering has minimal impact on recording performance.

## Tasks

* [ ] Optimize rendering loop
* [ ] Minimize frame drops
* [ ] Reduce memory usage
* [ ] Release unused resources
* [ ] Monitor rendering performance

## Deliverables

* Optimized webcam rendering

## Documentation

Update:

* `docs/performance/webcam.md`

## Testing

* [ ] Long recording test
* [ ] Memory usage review
* [ ] Frame rate validation

## Acceptance Criteria

* [ ] Webcam overlay does not significantly reduce recording performance

---

# Part 9 — Error Handling & Recovery

## Goal

Handle camera-related failures gracefully.

## Tasks

* [ ] Handle permission denial
* [ ] Handle disconnected cameras
* [ ] Handle unavailable devices
* [ ] Handle stream interruption
* [ ] Retry initialization where appropriate

## Deliverables

* Camera recovery strategy

## Documentation

Update:

* `docs/troubleshooting/webcam.md`

## Testing

* [ ] Permission denied
* [ ] Camera unplugged
* [ ] Stream interrupted

## Acceptance Criteria

* [ ] Camera failures do not stop screen recording

---

# Part 10 — State Management

## Goal

Manage webcam state throughout the application.

## Tasks

* [ ] Selected camera
* [ ] Webcam enabled
* [ ] Overlay visibility
* [ ] Overlay position
* [ ] Overlay size
* [ ] Error state

## Deliverables

* Webcam Zustand store

## Documentation

Update:

* `docs/architecture/webcam-store.md`

## Testing

* [ ] State updates correctly
* [ ] UI reflects changes

## Acceptance Criteria

* [ ] Webcam state remains synchronized across extension contexts

---

# Part 11 — Future Extensibility

## Goal

Prepare the webcam subsystem for future enhancements.

## Tasks

* [ ] Virtual background hooks
* [ ] Background blur hooks
* [ ] AI framing hooks
* [ ] Gesture controls (future)
* [ ] Multiple camera support
* [ ] Camera effects pipeline

## Deliverables

* Extensible webcam architecture

## Documentation

Update:

* `docs/architecture/webcam-roadmap.md`

## Testing

* [ ] Extension points documented

## Acceptance Criteria

* [ ] Future features can be added without redesigning the architecture

---

# Part 12 — Phase Review

## Final Checklist

### Webcam Overlay

* [ ] Camera capture complete
* [ ] Overlay rendering complete
* [ ] Positioning complete
* [ ] Drag & resize complete
* [ ] Appearance options complete
* [ ] Camera controls complete
* [ ] Error recovery complete

### Architecture

* [ ] Camera pipeline documented
* [ ] Rendering responsibilities separated
* [ ] Services remain reusable

### Documentation

* [ ] Webcam architecture updated
* [ ] Rendering documentation updated
* [ ] Performance documentation updated
* [ ] Troubleshooting updated

### Testing

* [ ] Camera capture verified
* [ ] Overlay rendering verified
* [ ] Drag & resize verified
* [ ] Performance verified

---

# Architecture Decisions

Record architectural decisions made during this phase.

Examples:

* Why webcam rendering is isolated from the recording engine.
* Why overlay rendering is abstracted behind a dedicated renderer.
* Why overlay position and appearance are stored as application state.
* Trade-offs between rendering quality and recording performance.
* Future considerations for AI-powered camera enhancements and virtual backgrounds.

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

➡ **Phase 8 — Settings & Preferences**

The next phase will introduce a centralized settings system, allowing users to configure recording quality, frame rate, audio and camera devices, default behaviors, themes, and other preferences that persist across extension sessions.
