# SignalDesk — Local-first knowledge workspace

[![Quality](https://github.com/MykolaDotsenko/Posts-creator-react-app/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/Posts-creator-react-app/actions/workflows/quality.yml)

**A fast, privacy-first React workspace for capturing ideas, research notes, and useful sources — then finding them again without another account, cloud service, or inbox.**

[**Open the live app →**](https://react-home-work-21-04.vercel.app)

SignalDesk turns a tiny “add/delete post” training exercise into a focused local-first product. It keeps one canonical source of truth, isolates persistence behind a small adapter, treats accessibility and recovery states as product requirements, and uses modern browser capabilities without adding framework noise.

## Product tour

<p align="center">
  <img src="./docs/screenshots/signaldesk-desktop.png" alt="SignalDesk desktop dashboard with quick capture, workspace metrics, filters, and signal cards" width="100%" />
</p>

<table>
  <tr>
    <td width="66%">
      <img src="./docs/screenshots/signaldesk-library.png" alt="SignalDesk filtered favorites library with searchable signal cards" width="100%" />
    </td>
    <td width="34%">
      <img src="./docs/screenshots/signaldesk-mobile.png" alt="SignalDesk responsive mobile capture experience" width="100%" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Focused retrieval</strong><br/>Search, sort, pin, and favorite useful signals.</td>
    <td align="center"><strong>Responsive capture</strong><br/>The same workflow stays usable on mobile.</td>
  </tr>
</table>

## Why SignalDesk is useful

The product optimizes one repeatable loop:

```text
Capture → organize → retrieve → refine → revisit
```

It is deliberately local-first: no signup, no network dependency at runtime, no analytics, and no backend required for the core job.

## Product capabilities

- create and edit notes, ideas, and source entries
- normalize up to six topic tags per signal
- search across title, body, type, and tags
- pinned and favorite views
- recently-updated, newest-created, and title sorting
- derived workspace metrics
- one-step Undo after deletion
- versioned local persistence
- corruption-safe storage recovery
- keyboard shortcuts for capture and search
- explicit empty and no-results states
- responsive desktop, tablet, and mobile layouts
- reduced-motion and forced-colors support
- no account, analytics, cookies, or network dependency at runtime

## Stack

### Runtime

- React 19.3
- browser localStorage
- native `crypto.randomUUID()`
- semantic HTML
- modern CSS

### Modern browser UI

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
- Vercel

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

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the rationale, boundaries, and deliberate trade-offs.

## Quality evidence

The automated suite covers:

- **13 unit/domain/storage tests**
- **16 browser journeys** across desktop and mobile Chromium
- create → search → edit → delete → Undo
- persistence across full reloads
- pinned and favorites filters
- legacy/corrupted storage recovery
- intentionally empty-library behavior
- keyboard-first workflows
- axe automated accessibility checks
- horizontal overflow checks
- production builds and linting in CI

```bash
npm ci
npm run check

npx playwright install chromium
npm run test:e2e
```

## Run locally

Requires Node.js 24+.

```bash
npm ci
npm run dev
```

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
