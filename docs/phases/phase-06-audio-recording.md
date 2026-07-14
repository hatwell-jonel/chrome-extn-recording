# Phase 6 — Audio Recording

> **Goal**
>
> Extend the recording engine to support microphone and system audio recording. This phase focuses on building a flexible audio pipeline that can capture, synchronize, mix, and manage multiple audio sources while remaining independent of the UI and reusable for future features.

---

# Overview

## Objectives

The audio system should:

* Support microphone recording.
* Support system (desktop) audio.
* Allow users to choose audio devices.
* Synchronize audio with video.
* Support multiple audio sources.
* Handle browser compatibility gracefully.
* Prepare the architecture for future audio enhancements.

---

# Implementation Parts

---

# Part 1 — Audio Architecture

## Goal

Design the audio recording architecture and define the responsibilities of each component.

## Tasks

* [ ] Define audio pipeline
* [ ] Define AudioService responsibilities
* [ ] Define AudioManager
* [ ] Define audio message flow
* [ ] Define synchronization strategy
* [ ] Review browser limitations

## Deliverables

* Audio architecture
* Audio pipeline diagram

## Documentation

Update:

* `docs/architecture/audio.md`
* `docs/diagrams/audio-flow.md`

## Testing

* [ ] Architecture reviewed
* [ ] Audio pipeline documented

## Acceptance Criteria

* [ ] Responsibilities are clearly separated
* [ ] Audio system is independent from the UI

---

# Part 2 — Microphone Capture

## Goal

Capture audio from the user's microphone.

## Tasks

* [ ] Request microphone permission
* [ ] Enumerate audio devices
* [ ] Capture microphone stream
* [ ] Handle unavailable devices
* [ ] Handle permission denial
* [ ] Handle device removal

## Deliverables

* Microphone capture service

## Documentation

Update:

* `docs/architecture/microphone.md`

## Testing

* [ ] Permission granted
* [ ] Permission denied
* [ ] Device disconnected
* [ ] Multiple microphones detected

## Acceptance Criteria

* [ ] Microphone stream initializes correctly
* [ ] Errors handled gracefully

---

# Part 3 — System Audio Capture

## Goal

Capture desktop or tab audio when supported by the browser.

## Tasks

* [ ] Capture desktop audio
* [ ] Capture browser tab audio
* [ ] Validate browser support
* [ ] Handle unsupported scenarios
* [ ] Handle muted sources

## Deliverables

* System audio capture

## Documentation

Update:

* `docs/architecture/system-audio.md`

## Testing

* [ ] Desktop audio works
* [ ] Tab audio works
* [ ] Unsupported browsers handled

## Acceptance Criteria

* [ ] System audio integrates with recording pipeline

---

# Part 4 — Audio Device Management

## Goal

Allow users to manage available audio input devices.

## Tasks

* [ ] Enumerate microphones
* [ ] Select default microphone
* [ ] Switch microphone
* [ ] Detect device changes
* [ ] Refresh available devices

## Deliverables

* Audio device manager

## Documentation

Update:

* `docs/architecture/audio-devices.md`

## Testing

* [ ] Device list loads
* [ ] Device switching works
* [ ] Device removal detected

## Acceptance Criteria

* [ ] Device management remains independent from the UI

---

# Part 5 — Audio Mixing

## Goal

Combine multiple audio sources into a single recording stream.

## Tasks

* [ ] Create AudioContext
* [ ] Create MediaStreamDestination
* [ ] Mix microphone
* [ ] Mix system audio
* [ ] Handle missing sources
* [ ] Prevent duplicated tracks

## Deliverables

* Audio mixing service

## Documentation

Update:

* `docs/architecture/audio-mixing.md`

## Testing

* [ ] Microphone only
* [ ] System audio only
* [ ] Mixed audio
* [ ] Missing audio source

## Acceptance Criteria

* [ ] Mixed audio remains synchronized
* [ ] Recording contains expected audio tracks

---

# Part 6 — Audio Synchronization

## Goal

Synchronize audio tracks with the video recording.

## Tasks

* [ ] Synchronize streams
* [ ] Attach audio tracks
* [ ] Prevent audio drift
* [ ] Handle delayed initialization
* [ ] Validate output stream

## Deliverables

* Synchronized media stream

## Documentation

Update:

* `docs/architecture/audio-sync.md`

## Testing

* [ ] Audio matches video
* [ ] Long recording remains synchronized

## Acceptance Criteria

* [ ] No noticeable synchronization issues

---

# Part 7 — Audio Controls

## Goal

Provide audio-specific recording controls.

## Tasks

* [ ] Enable microphone
* [ ] Disable microphone
* [ ] Enable system audio
* [ ] Disable system audio
* [ ] Mute indicator
* [ ] Audio status updates

## Deliverables

* Audio control workflow

## Documentation

Update:

* `docs/architecture/audio-controls.md`

## Testing

* [ ] Toggle microphone
* [ ] Toggle system audio
* [ ] Status updates correctly

## Acceptance Criteria

* [ ] Audio settings update without restarting the application

---

# Part 8 — Error Handling & Recovery

## Goal

Recover gracefully from audio-related failures.

## Tasks

* [ ] Handle permission denial
* [ ] Handle disconnected devices
* [ ] Handle unsupported APIs
* [ ] Handle stream failures
* [ ] Retry initialization where appropriate

## Deliverables

* Audio recovery strategy

## Documentation

Update:

* `docs/troubleshooting/audio.md`

## Testing

* [ ] Permission denied
* [ ] Device unplugged
* [ ] Browser limitations
* [ ] Audio stream interrupted

## Acceptance Criteria

* [ ] Audio failures do not crash the recording engine

---

# Part 9 — Audio State Management

## Goal

Manage audio state across the application.

## Tasks

* [ ] Selected microphone
* [ ] Microphone enabled
* [ ] System audio enabled
* [ ] Audio device list
* [ ] Permission state
* [ ] Error state

## Deliverables

* Audio Zustand store

## Documentation

Update:

* `docs/architecture/audio-store.md`

## Testing

* [ ] State updates correctly
* [ ] UI reacts to changes

## Acceptance Criteria

* [ ] Audio state remains synchronized across extension contexts

---

# Part 10 — Browser Compatibility

## Goal

Ensure consistent behavior across supported Chromium browsers.

## Tasks

* [ ] Chrome compatibility review
* [ ] Edge compatibility review
* [ ] Browser feature detection
* [ ] Graceful feature degradation
* [ ] Document unsupported features

## Deliverables

* Browser compatibility report

## Documentation

Update:

* `docs/browser-support.md`

## Testing

* [ ] Chrome verified
* [ ] Edge verified
* [ ] Unsupported scenarios documented

## Acceptance Criteria

* [ ] Unsupported features fail gracefully

---

# Part 11 — Future Extensibility

## Goal

Prepare the audio subsystem for future enhancements.

## Tasks

* [ ] Noise suppression hooks
* [ ] Echo cancellation support
* [ ] Automatic gain control
* [ ] Volume controls
* [ ] Audio level monitoring
* [ ] Multiple microphone support

## Deliverables

* Extensible audio architecture

## Documentation

Update:

* `docs/architecture/audio-roadmap.md`

## Testing

* [ ] Extension points documented

## Acceptance Criteria

* [ ] Future audio features can be added without major refactoring

---

# Part 12 — Phase Review

## Final Checklist

### Audio Recording

* [ ] Microphone recording complete
* [ ] System audio complete
* [ ] Device management complete
* [ ] Audio mixing complete
* [ ] Audio synchronization complete
* [ ] Audio controls complete
* [ ] Error recovery complete

### Architecture

* [ ] Audio pipeline documented
* [ ] Services remain reusable
* [ ] UI independent from audio implementation

### Documentation

* [ ] Audio architecture updated
* [ ] Browser compatibility documented
* [ ] Troubleshooting updated
* [ ] Future roadmap documented

### Testing

* [ ] Microphone recording verified
* [ ] System audio verified
* [ ] Mixed audio verified
* [ ] Browser compatibility verified

---

# Architecture Decisions

Record architectural decisions made during this phase.

Examples:

* Why audio capture is isolated inside an `AudioService`.
* Why the Web Audio API is used to mix multiple audio sources.
* Why microphone and system audio are treated as independent inputs.
* Trade-offs between browser compatibility and advanced audio features.
* Future considerations for audio processing, filters, and real-time monitoring.

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

➡ **Phase 7 — Webcam Overlay**

The next phase will introduce webcam capture, picture-in-picture rendering, draggable and resizable overlays, and camera management to create a recording experience similar to professional screen recording tools such as Loom.
