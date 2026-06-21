# @rtl-safe-ai/core

Local-only, dependency-free RTL detection and bidi-safe text utilities.

> Status: **scaffold** — the public API is defined but the logic is not yet implemented.

## Why

AI chat interfaces frequently mangle Hebrew, Arabic, Persian, Urdu and Yiddish:
mixed-direction messages leak directionality into surrounding UI, punctuation
jumps to the wrong side, and copy/paste can smuggle dangerous bidi control
characters. This package provides the pure text primitives needed to fix that —
with zero runtime dependencies and zero side effects.

## Security model

- **No network**: the package never opens a socket. `fetch`/`XMLHttpRequest`
  usage is blocked by lint.
- **No code execution**: no `eval`, `new Function`, or dynamic imports.
- **No DOM**: every export is a pure string/value transform. Rendering is the
  consumer's responsibility and must use safe APIs (`textContent`).
- **Deterministic**: same input + options → same output.

## API (planned)

| Export | Description |
| --- | --- |
| `detect(text, options?)` | Resolve dominant script, base direction, RTL ratio. |
| `isRtl(text, options?)` | Convenience predicate. |
| `wrapIsolated(text, options?)` | Wrap with Unicode isolates (FSI…PDI). |
| `stripUnsafeControls(text)` | Remove "Trojan Source" bidi overrides. |
| `neutralizeInvisible(text)` | Drop disallowed invisible/control chars. |
| `toRenderHint(direction)` | Map a direction to CSS render hints. |

## Usage (target)

```ts
import { detect, wrapIsolated } from '@rtl-safe-ai/core';

const { direction } = detect('שלום world');
const safe = wrapIsolated('שלום world', { direction });
```

## License

MIT
