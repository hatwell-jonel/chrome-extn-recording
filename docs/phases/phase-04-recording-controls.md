# Phase 4 — Recording Controls

> **Goal**
>
> Build the complete recording control workflow by connecting the Popup UI to the Recording Engine through the Background Service Worker. This phase focuses on user interactions, recording state transitions, and delivering a smooth recording experience while keeping the UI and business logic properly separated.

---

# Overview

## Objectives

The recording controls should:

* Provide intuitive recording actions.
* Control recordings through the Background Service Worker.
* Prevent invalid user actions.
* Reflect the current recording state immediately.
* Keep business logic outside React components.
* Prepare the application for advanced recording features.

---

# Implementation Parts

---

# Part 1 — Recording Control Architecture

## Goal

Define the interaction flow between the Popup, Background Service Worker, and Recording Engine.

## Tasks

* [ ] Define control flow
* [ ] Define UI responsibilities
* [ ] Define Background responsibilities
* [ ] Define message contracts
* [ ] Review state transitions

## Deliverables

* Recording control architecture
* Updated message flow diagram

## Documentation

Update:

* `docs/architecture/recording-controls.md`
* `docs/diagrams/control-flow.md`

## Testing

* [ ] Architecture reviewed
* [ ] Message flow validated

## Acceptance Criteria

* [ ] UI contains no recording logic
* [ ] Background remains the controller

---

# Part 2 — Start Recording

## Goal

Allow users to initiate a recording session.

## Tasks

* [ ] Connect Start button
* [ ] Validate current state
* [ ] Send start message
* [ ] Handle loading state
* [ ] Handle failures
* [ ] Update UI

## Deliverables

* Working Start action

## Documentation

Update:

* `docs/architecture/start-recording.md`

## Testing

* [ ] Start recording succeeds
* [ ] Multiple clicks prevented
* [ ] Invalid state rejected

## Acceptance Criteria

* [ ] Recording starts only once
* [ ] UI updates correctly

---

# Part 3 — Pause & Resume

## Goal

Allow users to temporarily pause and resume recordings.

## Tasks

* [ ] Connect Pause button
* [ ] Connect Resume button
* [ ] Validate recording state
* [ ] Synchronize UI
* [ ] Handle invalid transitions

## Deliverables

* Pause & Resume workflow

## Documentation

Update:

* `docs/architecture/pause-resume.md`

## Testing

* [ ] Pause works
* [ ] Resume works
* [ ] Invalid actions blocked

## Acceptance Criteria

* [ ] Recording resumes without data loss
* [ ] UI reflects paused state

---

# Part 4 — Stop Recording

## Goal

Finish the recording session and trigger file generation.

## Tasks

* [ ] Connect Stop button
* [ ] Confirm stop request
* [ ] Trigger recording cleanup
* [ ] Trigger download pipeline
* [ ] Return to idle state

## Deliverables

* Working Stop action

## Documentation

Update:

* `docs/architecture/stop-recording.md`

## Testing

* [ ] Stop completes successfully
* [ ] Download starts
* [ ] UI resets

## Acceptance Criteria

* [ ] Recording finalizes correctly
* [ ] No resources remain allocated

---

# Part 5 — Cancel Recording

## Goal

Allow users to discard the current recording.

## Tasks

* [ ] Connect Cancel action
* [ ] Confirm cancellation
* [ ] Dispose MediaRecorder
* [ ] Dispose MediaStream
* [ ] Skip download
* [ ] Reset state

## Deliverables

* Recording cancellation workflow

## Documentation

Update:

* `docs/architecture/cancel-recording.md`

## Testing

* [ ] Cancel works
* [ ] No file downloaded
* [ ] Resources cleaned

## Acceptance Criteria

* [ ] Cancel leaves no temporary data

---

# Part 6 — Countdown

## Goal

Provide an optional countdown before recording begins.

## Tasks

* [ ] Countdown component
* [ ] Countdown overlay
* [ ] Configurable duration
* [ ] Cancel countdown
* [ ] Trigger recording automatically

## Deliverables

* Countdown workflow

## Documentation

Update:

* `docs/architecture/countdown.md`

## Testing

* [ ] Countdown starts
* [ ] Countdown cancels
* [ ] Recording begins automatically

## Acceptance Criteria

* [ ] Countdown integrates seamlessly with recording flow

---

# Part 7 — Recording Status Feedback

## Goal

Provide continuous feedback during recording.

## Tasks

* [ ] Live status updates
* [ ] Recording indicator
* [ ] Pause indicator
* [ ] Loading indicator
* [ ] Error messages

## Deliverables

* Status feedback system

## Documentation

Update:

* `docs/architecture/status-feedback.md`

## Testing

* [ ] Status changes immediately
* [ ] Errors displayed correctly

## Acceptance Criteria

* [ ] UI always reflects the actual recording state

---

# Part 8 — Keyboard Shortcuts

## Goal

Enable basic keyboard shortcuts for recording actions.

## Tasks

* [ ] Start shortcut
* [ ] Pause shortcut
* [ ] Resume shortcut
* [ ] Stop shortcut
* [ ] Shortcut validation
* [ ] Conflict handling

## Deliverables

* Keyboard shortcut support

## Documentation

Update:

* `docs/architecture/keyboard-shortcuts.md`

## Testing

* [ ] Shortcuts trigger actions
* [ ] Invalid shortcuts ignored

## Acceptance Criteria

* [ ] Keyboard shortcuts behave consistently

---

# Part 9 — Notifications & Badge Updates

## Goal

Keep users informed even when the popup is closed.

## Tasks

* [ ] Recording started notification
* [ ] Recording paused notification
* [ ] Recording resumed notification
* [ ] Recording stopped notification
* [ ] Extension badge updates
* [ ] Badge color changes

## Deliverables

* Notification system
* Dynamic extension badge

## Documentation

Update:

* `docs/architecture/notifications.md`

## Testing

* [ ] Notifications appear
* [ ] Badge updates correctly

## Acceptance Criteria

* [ ] Badge always reflects recording state

---

# Part 10 — State Synchronization

## Goal

Ensure recording controls stay synchronized across extension contexts.

## Tasks

* [ ] Popup synchronization
* [ ] Background synchronization
* [ ] Side Panel synchronization
* [ ] Offscreen synchronization
* [ ] Handle popup reopening
* [ ] Recover UI after refresh

## Deliverables

* Synchronized recording controls

## Documentation

Update:

* `docs/architecture/control-synchronization.md`

## Testing

* [ ] Reopen popup during recording
* [ ] Refresh popup
* [ ] Validate state consistency

## Acceptance Criteria

* [ ] All extension contexts display the same recording state

---

# Part 11 — User Experience Improvements

## Goal

Polish the recording experience.

## Tasks

* [ ] Disable invalid controls
* [ ] Improve loading animations
* [ ] Improve transitions
* [ ] Improve tooltips
* [ ] Improve confirmation dialogs
* [ ] Review visual consistency

## Deliverables

* Polished recording controls

## Documentation

Update:

* `docs/ux/recording-controls.md`

## Testing

* [ ] UX reviewed
* [ ] User flow verified

## Acceptance Criteria

* [ ] Controls feel responsive and intuitive

---

# Part 12 — Phase Review

## Final Checklist

### Recording Controls

* [ ] Start implemented
* [ ] Pause implemented
* [ ] Resume implemented
* [ ] Stop implemented
* [ ] Cancel implemented
* [ ] Countdown implemented
* [ ] Keyboard shortcuts implemented
* [ ] Notifications implemented
* [ ] Badge updates implemented

### Architecture

* [ ] UI remains presentation-focused
* [ ] Background controls recording lifecycle
* [ ] Message contracts remain consistent

### Documentation

* [ ] Recording control documentation updated
* [ ] Diagrams updated
* [ ] UX documentation updated
* [ ] Troubleshooting updated

### Testing

* [ ] User interaction testing completed
* [ ] State transition testing completed
* [ ] Popup synchronization verified
* [ ] Edge cases documented

---

# Architecture Decisions

Record architectural decisions made during this phase.

Examples:

* Why recording actions are routed through the Background Service Worker.
* Why UI components never directly manipulate the Recording Engine.
* Why invalid state transitions are blocked before reaching the engine.
* Trade-offs between immediate UI responsiveness and asynchronous background operations.
* Future considerations for global shortcuts and platform-specific behavior.

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

➡ **Phase 5 — Recording Library**

The next phase will introduce local recording management, including recording history, metadata storage, search, sorting, renaming, deletion, and download management, giving users a complete library of their recordings.
