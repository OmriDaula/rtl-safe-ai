# @rtl-safe-ai/core

Local-only, dependency-free RTL detection and bidi-safe text utilities.

> Status: **implemented** — pure, synchronous, deterministic. No DOM, no network.

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

## API

| Export | Description |
| --- | --- |
| `detect(text, options?)` | Resolve dominant script, base direction, RTL ratio, mix. |
| `detectTextDirection(text, options?)` | Resolve just the base `Direction`. |
| `isRtl(text, options?)` | Convenience predicate. |
| `isRTLCodePoint(cp)` / `hasRTL(text)` | Strong-RTL membership / presence checks. |
| `firstStrongDirection(text)` | First strongly-directional char (`ltr`/`rtl`/`neutral`). |
| `stripLeadingLTRNoise(text)` | Drop leading URLs/paths/identifiers before detection. |
| `segmentText(text, options?)` | Split into directional text/math/code `Segment`s. |
| `detectLatexRanges(text)` | Find `$$…$$`, `\[…\]`, `\(…\)`, inline `$…$` (not currency). |
| `detectTableDirection(text, options?)` | Resolve a Markdown table's direction by cell majority. |
| `wrapIsolated(text, options?)` | Wrap with Unicode isolates (FSI/LRI/RLI…PDI). |
| `stripUnsafeControls(text)` | Remove "Trojan Source" bidi overrides. |
| `neutralizeInvisible(text)` | Drop invisible/zero-width and Unicode tag chars. |
| `isPlainTextSafe(text)` | True when no unsafe controls/invisibles are present. |
| `toRenderHint(direction)` / `resolveAuto(dir, base)` | Direction → CSS hints / `auto` resolution. |

## Usage (target)

```ts
import { detect, wrapIsolated } from '@rtl-safe-ai/core';

const { direction } = detect('שלום world');
const safe = wrapIsolated('שלום world', { direction });
```

## License

MIT
