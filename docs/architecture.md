# Architecture

`rtl-safe-ai` is a small monorepo organised around one pure engine and thin
consumers.

```
┌────────────────────────────────────────────────────────┐
│                    @rtl-safe-ai/core                     │
│  pure, dependency-free, local-only string/value funcs    │
│                                                          │
│   detect()  isRtl()  wrapIsolated()  stripUnsafeControls │
│   toRenderHint()  neutralizeInvisible()  isPlainTextSafe │
└───────────────▲───────────────────────▲─────────────────┘
                │                        │
        ┌───────┴────────┐      ┌────────┴───────────┐
        │  browser-ext   │      │      demo app       │
        │  (Manifest V3) │      │   (Vite + React)    │
        └────────────────┘      └─────────────────────┘
```

## Design rules

1. **The core has no side effects.** Every export is a pure function over
   strings/values. No DOM, no I/O, no globals, no network. This makes the core
   trivially testable and auditable.
2. **Rendering lives in consumers.** Only the extension and demo touch the DOM,
   and they do so with safe APIs (`textContent`, attributes, inline styles) —
   never `innerHTML`.
3. **Workspaces + project references.** TypeScript project references wire the
   packages together; consumers import `@rtl-safe-ai/core` directly.

## Package responsibilities

### `packages/core`

| Module | Responsibility |
| --- | --- |
| `types.ts` | Public type surface. |
| `constants.ts` | Unicode controls & per-script ranges (the only chars emitted). |
| `detect.ts` | Script + base-direction detection. |
| `direction.ts` | Direction → render-hint mapping. |
| `bidi.ts` | Isolation wrapping & dangerous-control stripping. |
| `sanitize.ts` | Invisible/control-char neutralisation. |
| `index.ts` | Public re-exports. |

### `packages/browser-extension`

- `background.ts` — MV3 service worker; local settings only.
- `content.ts` — observes chat nodes, applies direction via attributes/styles.
- `popup/` — on/off toggle backed by `chrome.storage.local`.

### `apps/demo`

A React playground that calls the core directly and previews results. Useful for
manual QA of detection and rendering.

## Data flow

```
page text ──▶ core.detect() ──▶ DetectionResult
                              └▶ core.toRenderHint(direction)
                                          │
                                          ▼
                          set dir / unicode-bidi / text-align
```

No step in this flow performs I/O or leaves the page.
