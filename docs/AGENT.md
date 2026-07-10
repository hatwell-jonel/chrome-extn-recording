# AGENT.md

## Purpose

These guidelines apply to every task in this project. Follow them unless a phase explicitly states otherwise.

## Tech Stack

* React 19
* TypeScript (Strict)
* Vite + CRXJS
* Manifest V3
* Tailwind CSS v4
* shadcn/ui
* Zustand

## General Rules

* Preserve the existing architecture.
* Implement changes incrementally.
* Do not rewrite working code without a clear reason.
* Keep solutions simple, modular, and maintainable.
* Only implement the current phase.

## Architecture

* UI components should only handle rendering and user interactions.
* Business logic belongs in services or managers.
* The background service worker is the source of truth for recording state.
* Wrap Chrome APIs inside reusable services.
* Use a centralized messaging layer for communication between extension contexts.
* Avoid duplicated logic and magic strings.

## Code Standards

* Use strict TypeScript.
* Avoid `any`.
* Keep functions and files focused on a single responsibility.
* Prefer composition over large components.
* Add JSDoc comments to exported APIs.
* Reuse existing code before creating new abstractions.

## State Management

* Use Zustand for application state.
* Keep stores focused on state and actions only.
* Do not place business logic inside stores.

## Documentation

For significant features:

* Update relevant documentation in `/docs`.
* Explain architecture decisions when necessary.

## Before Completing a Task

Verify that:

* The project builds successfully.
* No TypeScript errors.
* No lint errors.
* Existing functionality still works.
* New code is documented where appropriate.

## Deliverables

After each phase, provide:

1. Summary of changes
2. Files created
3. Files modified
4. Architecture decisions
5. Remaining work or recommendations
6. Build status
