## Purpose

These guidelines apply to every task in this project unless a phase explicitly states otherwise.

---

# Tech Stack

- React 19
- TypeScript (Strict)
- Vite + CRXJS
- Manifest V3
- Tailwind CSS v4
- shadcn/ui
- Zustand
- Vitest

---

# General Rules

- Preserve the existing architecture.
- Implement changes incrementally.
- Do not rewrite working code without a clear reason.
- Keep solutions simple, modular, and maintainable.
- Only implement the current phase or explicitly requested scope.
- Do not implement future phases.
- Do not introduce unnecessary abstractions.

---

# Architecture

- UI components should only handle rendering and user interactions.
- Business logic belongs in services or managers.
- The Background Service Worker is the source of truth for recording state.
- Wrap Chrome APIs inside reusable services.
- Use a centralized messaging layer for communication between extension contexts.
- Avoid duplicated logic and magic strings.
- Prefer dependency isolation to simplify testing.

---

# Code Standards

- Use strict TypeScript.
- Avoid `any`.
- Keep functions and files focused on a single responsibility.
- Prefer composition over inheritance.
- Reuse existing code before creating new abstractions.
- Add JSDoc comments to exported public APIs.
- Keep implementations readable and maintainable.
- Do not prematurely optimize.

---

# State Management

- Use Zustand for application state.
- Stores should contain only state and actions.
- Business logic belongs in services, not stores.
- The UI should consume state rather than own business logic.

---

# Documentation

For significant changes:

- Update the relevant documentation under `/docs`.
- Update only the documentation related to the current task.
- Explain architecture decisions when appropriate.
- Do not modify unrelated documentation.

---

# Testing Requirements

Every new business logic must include automated unit tests.

Requirements:

- Add tests for new functionality.
- Update tests when behavior changes.
- Do not reduce existing test coverage.
- Keep tests focused, deterministic, and isolated.
- Prefer testing business logic independently from Chrome APIs.

---

# Testing Strategy

## During Development

Run **only the tests affected by the current change**.

Examples:

- Modified `RecordingManager`
  - Run `recording-manager.service.test.ts`

- Modified recording errors
  - Run `recording.errors.test.ts`

- Modified messaging service
  - Run `messaging.service.test.ts`

Avoid running the entire test suite after every small change.

---

## Before Completing a Task

Verify:

- All affected tests pass.
- No new failing tests were introduced.

Also run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

---

## Before Completing a Phase

Run the complete verification:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The full test suite should be executed only when:

- Completing a phase
- Completing a feature
- Refactoring shared infrastructure
- Modifying multiple modules
- Explicitly requested

---

# Verification

Before marking work as complete, ensure:

- The implementation satisfies the requested scope.
- No unrelated functionality was modified.
- The project builds successfully.
- TypeScript passes without errors.
- Lint passes without errors.
- Relevant tests pass.
- Documentation has been updated if required.

---

# Scope Control

Unless explicitly requested, do **not** implement:

- Future phases
- Placeholder implementations
- UI improvements outside the requested scope
- Additional APIs
- Performance optimizations
- Refactors unrelated to the current task

Keep changes minimal and focused.

---

# Deliverables

After completing a task, provide:

1. Summary of changes
2. Files created
3. Files modified
4. Architecture decisions
5. Testing performed
6. Remaining work or recommendations
7. Build status

---

# Communication

When reporting completion:

- Clearly distinguish implemented work from recommendations.
- Report any assumptions made.
- Report any limitations.
- If something was intentionally left unimplemented because it belongs to a later phase, explicitly state that.