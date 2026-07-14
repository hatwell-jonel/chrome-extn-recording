# Phase 2 — Popup UI Foundation

> **Goal**
>
> Build the complete Popup UI that serves as the primary interface for the Chrome Screen Recording Extension. This phase focuses on creating a polished, reusable, and maintainable user interface without tightly coupling it to the recording implementation.

---

# Overview

## Objectives

The popup should:

* Provide a professional user experience.
* Display the current recording state.
* Allow users to control recordings.
* Display recording information.
* Be fully reusable and maintainable.
* Be responsive within Chrome's popup constraints.
* Be ready for future features without major refactoring.

This phase **does not implement the recording logic**. It only builds the UI and prepares it to communicate with the Background Service Worker.

---

# Implementation Parts

---

# Part 1 — Popup Layout

## Goal

Build the base popup layout that all future features will use.

## Tasks

* [ ] Create popup page layout
* [ ] Define page sections
* [ ] Create layout containers
* [ ] Configure spacing
* [ ] Configure typography
* [ ] Configure theme variables
* [ ] Apply Inter font
* [ ] Create reusable layout wrapper

## Deliverables

* Popup layout
* Layout wrapper component
* Consistent spacing system

## Documentation

Update:

* `docs/architecture/ui.md`
* `docs/decisions/layout.md`

## Testing

* [ ] Popup loads correctly
* [ ] Layout is centered
* [ ] No overflow
* [ ] Responsive within popup dimensions

## Acceptance Criteria

* [ ] Popup renders correctly
* [ ] Layout is reusable
* [ ] No hardcoded dimensions unless required

---

# Part 2 — Header

## Goal

Create the popup header containing branding and recording status.

## Tasks

* [ ] Extension logo
* [ ] Extension name
* [ ] Current recording status
* [ ] Status indicator
* [ ] Optional version badge

## Deliverables

* Header component

## Documentation

Update:

* `docs/architecture/components.md`

## Testing

* [ ] Header renders correctly
* [ ] Status updates correctly

## Acceptance Criteria

* [ ] Header is reusable
* [ ] Status indicator supports future states

---

# Part 3 — Recording Status Panel

## Goal

Display the current recording information.

## Tasks

* [ ] Current recording state
* [ ] Capture source
* [ ] Recording duration placeholder
* [ ] Audio status placeholder
* [ ] Camera status placeholder

## Deliverables

* Recording status card

## Documentation

Update:

* `docs/architecture/ui-state.md`

## Testing

* [ ] Status card renders
* [ ] Placeholder values display correctly

## Acceptance Criteria

* [ ] Component supports all recording states

---

# Part 4 — Recording Controls

## Goal

Create the recording control interface.

## Tasks

* [ ] Start button
* [ ] Pause button
* [ ] Resume button
* [ ] Stop button
* [ ] Disabled states
* [ ] Loading states

## Deliverables

* Recording controls component

## Documentation

Update:

* `docs/architecture/control-components.md`

## Testing

* [ ] Buttons render correctly
* [ ] Disabled states work
* [ ] Loading states work

## Acceptance Criteria

* [ ] Components are reusable
* [ ] Buttons expose callbacks only
* [ ] No recording logic inside UI

---

# Part 5 — Recording Timer

## Goal

Create the recording timer component.

## Tasks

* [ ] Timer display
* [ ] Placeholder state
* [ ] Formatting helper
* [ ] Ready for future synchronization

## Deliverables

* Timer component

## Documentation

Update:

* `docs/architecture/timer.md`

## Testing

* [ ] Timer formatting
* [ ] Placeholder display

## Acceptance Criteria

* [ ] Timer is presentation-only
* [ ] No internal recording logic

---

# Part 6 — Recording Source Selector

## Goal

Prepare the UI for selecting recording sources.

## Tasks

* [ ] Screen option
* [ ] Window option
* [ ] Browser Tab option
* [ ] Disabled state
* [ ] Selection indicator

## Deliverables

* Source selector component

## Documentation

Update:

* `docs/architecture/source-selector.md`

## Testing

* [ ] Selection changes correctly
* [ ] Disabled state works

## Acceptance Criteria

* [ ] Ready for integration with recording engine

---

# Part 7 — Settings Entry

## Goal

Provide access to extension settings.

## Tasks

* [ ] Settings button
* [ ] Tooltip
* [ ] Placeholder navigation
* [ ] Future options page integration

## Deliverables

* Settings entry component

## Documentation

Update:

* `docs/architecture/navigation.md`

## Testing

* [ ] Button renders
* [ ] Navigation callback fires

## Acceptance Criteria

* [ ] Independent component
* [ ] No business logic

---

# Part 8 — UI States

## Goal

Prepare all visual application states.

## Tasks

### Loading

* [ ] Initial loading
* [ ] Button loading

### Empty

* [ ] No recording

### Error

* [ ] Generic error
* [ ] Permission denied
* [ ] Recording unavailable

### Success

* [ ] Ready state

## Deliverables

* Shared UI state components

## Documentation

Update:

* `docs/architecture/ui-states.md`

## Testing

* [ ] Every state renders correctly

## Acceptance Criteria

* [ ] Shared across popup
* [ ] Easily reusable

---

# Part 9 — Component Library

## Goal

Extract reusable UI components.

## Tasks

* [ ] Button variants
* [ ] Cards
* [ ] Badges
* [ ] Status indicator
* [ ] Divider
* [ ] Icon wrapper
* [ ] Tooltip wrapper

## Deliverables

Reusable component library

## Documentation

Update:

* `docs/architecture/component-library.md`

## Testing

* [ ] Components are reusable
* [ ] Variants render correctly

## Acceptance Criteria

* [ ] No duplicated UI code

---

# Part 10 — Accessibility & UX

## Goal

Ensure the popup follows accessibility best practices.

## Tasks

* [ ] Keyboard navigation
* [ ] Focus management
* [ ] ARIA labels
* [ ] Color contrast review
* [ ] Screen reader support
* [ ] Tooltip accessibility

## Deliverables

Accessible popup

## Documentation

Update:

* `docs/accessibility.md`

## Testing

* [ ] Keyboard only navigation
* [ ] Screen reader labels
* [ ] Focus visibility

## Acceptance Criteria

* [ ] WCAG-friendly implementation
* [ ] All controls accessible

---

# Part 11 — Integration Preparation

## Goal

Prepare the UI to integrate with the recording engine.

## Tasks

* [ ] Connect Zustand selectors
* [ ] Connect message hooks
* [ ] Remove mock data
* [ ] Prepare event handlers

## Deliverables

Popup ready for Recording Engine integration

## Documentation

Update:

* `docs/architecture/popup-integration.md`

## Testing

* [ ] Mock state changes update UI
* [ ] Event handlers fire correctly

## Acceptance Criteria

* [ ] Popup contains no recording implementation
* [ ] UI is ready for Phase 3

---

# Part 12 — Phase Review

## Final Checklist

### UI

* [ ] Popup layout complete
* [ ] Header complete
* [ ] Recording status complete
* [ ] Controls complete
* [ ] Timer complete
* [ ] Settings entry complete
* [ ] Loading states complete
* [ ] Error states complete

### Components

* [ ] No duplicated components
* [ ] Components are reusable
* [ ] UI follows design system

### Documentation

* [ ] UI documentation updated
* [ ] Component documentation updated
* [ ] Accessibility documentation updated
* [ ] Architecture diagrams updated

### Testing

* [ ] Manual UI verification complete
* [ ] Accessibility verified
* [ ] Responsive verification complete

---

# Architecture Decisions

Record architectural decisions made during this phase.

Examples:

* Why the popup is composed of small reusable components.
* Why business logic is kept outside React components.
* Why recording state is injected rather than owned by the UI.
* Why shadcn/ui components are wrapped instead of used directly.
* Design trade-offs for popup size and layout.

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

➡ **Phase 3 — Recording Engine**

The next phase will connect this UI to the actual recording pipeline by implementing browser permissions, screen capture, MediaRecorder, and the download workflow.
