# SignalDesk architecture

SignalDesk is intentionally a **local-first modular frontend**, not a miniature distributed system.

The architecture exists to keep business rules testable, browser state resilient, and UI code easy to read.

## Dependency direction

```text
React composition
      |
      +--> components
      |
      +--> pure post domain
      |
      +--> localStorage adapter

User intent -> action -> reducer -> canonical posts -> selectors -> view
                                  |
                                  +-> versioned persistence
```

## State ownership

`App.jsx` owns the canonical product state through one reducer:

- `posts`
- `lastDeleted` for one-step deletion recovery

Search query, active view, sort order, and edit selection are transient UI state. They are not persisted because they are cheap to reconstruct and should not become durable product data.

Derived values such as filtered posts and overview metrics are calculated with selectors. They are never copied into state.

## Domain boundary

`src/domain/posts.js` is browser-independent.

It owns:

- normalization
- tag constraints
- post creation
- reducer transitions
- search semantics
- filter semantics
- sorting
- aggregate statistics

IDs and timestamps are created at the application boundary and passed into the domain. This keeps transitions deterministic and easy to test.

## Persistence

`src/lib/storage.js` is the only module that touches localStorage.

Properties:

1. versioned payload
2. corruption-safe parsing
3. record normalization on read
4. intentionally empty libraries remain empty
5. storage failure never makes the current session unusable

No account or backend is required for the product's current job.

## UX architecture

The interface optimizes the loop:

```text
Capture -> organize -> retrieve -> refine -> revisit
```

High-frequency actions are deliberately cheap:

- `N` focuses capture
- `/` focuses search
- pinning changes attention without changing content
- favorite marks revisit value
- delete has a one-step Undo
- editing returns to the same composer rather than opening a second interaction model

## Styling strategy

The shipped UI uses modern platform primitives rather than a component framework:

- CSS custom properties
- `oklch()`
- `color-mix()`
- registered custom property animation
- container queries
- fluid typography
- Grid and Flexbox
- backdrop filtering with readable base surfaces
- responsive layout changes
- reduced-motion support
- forced-colors support

The visual layer remains optional polish; core interactions do not depend on animation.

## Quality gates

Pull requests verify:

- ESLint 10
- Vitest domain tests
- Vite production build
- Playwright desktop/mobile journeys
- axe automated accessibility smoke checks
- horizontal overflow checks

## Deliberate non-features

SignalDesk currently does not add:

- authentication
- backend storage
- collaboration
- rich text
- AI summarization
- state-management libraries
- a design-system dependency

Those features would increase cost and maintenance without improving the core local capture/retrieval job.
