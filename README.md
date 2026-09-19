# SignalDesk

[![Quality](https://github.com/MykolaDotsenko/Posts-creator-react-app/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/Posts-creator-react-app/actions/workflows/quality.yml)

**A fast, local-first personal signal workspace for ideas, research notes, and useful sources.**

**Live target:** https://mykoladotsenko.github.io/Posts-creator-react-app/

The repository started as a tiny React “add/delete post” exercise. SignalDesk keeps that original idea — capture something worth remembering — and rebuilds it as a useful product with clear state ownership, resilient persistence, retrieval workflows, accessible interaction, automated verification, and a modern responsive UI.

## Product capabilities

- create and edit notes, ideas, and source entries
- comma-separated topic tags with canonical normalization
- full-library search across title, body, type, and tags
- pinned and favorite views
- recently-updated, newest-created, and title sorting
- derived workspace metrics
- one-step Undo after deletion
- versioned local persistence
- corruption-safe storage recovery
- keyboard shortcuts for capture and search
- explicit empty and no-results states
- desktop, tablet, and mobile layouts
- reduced-motion and forced-colors support
- no account, analytics, cookies, or network dependency at runtime

## Stack

### Runtime

- React 19.3
- browser localStorage
- native `crypto.randomUUID()`
- semantic HTML
- modern CSS

### UI platform features

- CSS Grid and Flexbox
- container queries
- fluid `clamp()` typography
- `oklch()` and `color-mix()`
- registered CSS custom properties
- backdrop filtering
- progressive visual enhancement

### Verification

- Vite 8.3
- ESLint 10 flat config
- Vitest 5
- Playwright 1.63
- axe-core
- GitHub Actions
- GitHub Pages

## Architecture

```text
React UI
  |
  +--> pure post domain
  |      ├─ normalization
  |      ├─ reducer
  |      ├─ search/filter/sort
  |      └─ derived stats
  |
  +--> storage adapter
         └─ versioned localStorage
```

The app has one canonical post collection. Filters and statistics are derived rather than duplicated. Browser persistence is isolated from domain transitions.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the rationale and trade-offs.

## Run locally

Requires Node.js 24+.

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run check
npx playwright install chromium
npm run test:e2e
```

`npm run check` runs lint, unit/domain tests, and a production build.

Browser verification covers the core capture/edit/delete/Undo journey, keyboard shortcuts, automated accessibility checks, and horizontal overflow.

## Product philosophy

SignalDesk deliberately avoids turning a small local product into an “enterprise architecture demo.”

The important engineering decisions are proportional:

- deterministic domain transitions
- one source of truth
- strict persistence boundary
- explicit recovery states
- accessible native controls
- modern visual polish without a UI runtime
- automated evidence that the core workflow still works

That balance is the point of the project.
