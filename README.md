# rtl-safe-ai

**A security-first, open-source RTL engine for AI chat interfaces.**

[![CI](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/ci.yml)
[![CodeQL](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/codeql.yml/badge.svg)](https://github.com/OmriDaula/rtl-safe-ai/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-111%20passing-success.svg)](./tests)
[![No telemetry](https://img.shields.io/badge/privacy-no%20telemetry%20%C2%B7%20local--only-brightgreen.svg)](./docs/PRIVACY.md)

`rtl-safe-ai` fixes how right-to-left languages — Hebrew, Arabic, Persian, Urdu,
Yiddish and more — are displayed in AI chat UIs, where mixed-direction text is
routinely mangled. It does this with a small, dependency-free, **local-only**
engine that never touches your data.

> 🇮🇱 עברית: see [README.he.md](./README.he.md)

> **Not formally certified.** This project is **designed to align with**
> recognized secure-development principles (NIST SSDF, CISA Secure by Design,
> OWASP ASVS, and Israeli National Cyber Directorate supply-chain guidance). It
> is not certified or approved by any third party — see the
> [security documentation](#security--privacy-documentation).

---

## The problem

AI chat interfaces are built LTR-first. When a response mixes Hebrew or Arabic
with English, code, URLs, file paths, or math, the bidirectional (bidi)
algorithm often renders it in a confusing order: sentences flip, punctuation
jumps to the wrong side, and a leading URL can force an entire RTL paragraph to
display left-to-right. Worse, invisible Unicode and bidi-override characters can
be used to **spoof** displayed text ("Trojan Source") or hide instructions.

## The solution

A pure TypeScript engine that detects the correct base direction of mixed text,
keeps code and math LTR, and neutralizes unsafe/invisible control characters —
all **locally, in memory, with no network access**. The same engine powers a
browser extension and a demo app.

## Features

- 🔤 **Smart direction detection** for Hebrew, Arabic, Persian, Urdu, Yiddish,
  Syriac, Thaana, N'Ko, Adlam and more.
- 🧩 **Mixed-content aware** — keeps URLs, file paths, code, and LaTeX/math LTR
  while resolving the surrounding sentence correctly.
- 📊 **Markdown table direction** detection via cell-majority voting.
- 🛡️ **Bidi-safety**: strips Trojan-Source override characters and neutralizes
  invisible/zero-width Unicode; `isPlainTextSafe()` flags abuse.
- 🧪 **Well-tested**: 111 tests, including security invariants.
- 🧱 **Zero runtime dependencies** in the core; pure, synchronous functions.

## What this project will NEVER do

This is a hard, non-negotiable boundary. `rtl-safe-ai` does **not**:

- ❌ patch desktop apps or modify system files
- ❌ require admin / root permissions
- ❌ bypass app integrity checks or code signing
- ❌ install certificates or intercept TLS
- ❌ access cookies, tokens, passwords, or any credentials
- ❌ collect telemetry or analytics
- ❌ send network requests of any kind
- ❌ use `eval`, `new Function`, or other dynamic code execution
- ❌ render untrusted HTML via `innerHTML`

All processing is **local, in-page, and synchronous.**

## Security principles

| Principle | How it is enforced |
| --- | --- |
| No telemetry / analytics | No such code; CI invariant test scans the core. |
| No external network | ESLint bans `fetch`/`XHR`/`WebSocket`; extension CSP `connect-src 'none'`. |
| No `eval` | ESLint `no-eval`, `no-new-func`, `no-implied-eval`. |
| No `innerHTML` | ESLint `no-restricted-properties`; string-only core. |
| No credential access | Extension declares no such permissions; content script reads text only. |
| Local-only processing | Core is pure functions; no I/O anywhere. |
| Minimal permissions | Extension requests only `activeTab` + `storage`; empty `host_permissions`. |

## Privacy guarantees

No telemetry, no analytics, no tracking, no network requests. Your text is never
collected, stored, or transmitted. The browser extension persists only a
per-site enable/disable setting locally. See [docs/PRIVACY.md](./docs/PRIVACY.md).

## Security & privacy documentation

Security-first design, **designed to align with** secure-development principles
from NIST SSDF, CISA Secure by Design, OWASP ASVS, and Israeli National Cyber
Directorate supply-chain guidance. This is a self-assessment, not a third-party
certification.

| Document | What it covers |
| --- | --- |
| [SECURITY.md](./SECURITY.md) | Security policy and vulnerability reporting. |
| [docs/SECURITY.md](./docs/SECURITY.md) | Security overview and controls. |
| [docs/PRIVACY.md](./docs/PRIVACY.md) | Privacy guarantees (no telemetry, local-only). |
| [docs/THREAT_MODEL.md](./docs/THREAT_MODEL.md) | Assets, threats and mitigations. |
| [docs/COMPLIANCE_MATRIX.md](./docs/COMPLIANCE_MATRIX.md) | Framework self-assessment mapping. |
| [docs/SUPPLY_CHAIN.md](./docs/SUPPLY_CHAIN.md) | Dependency and release supply-chain practices. |
| [docs/EXTENSION_SECURITY.md](./docs/EXTENSION_SECURITY.md) | Browser-extension security model. |
| [docs/RELEASE_SECURITY.md](./docs/RELEASE_SECURITY.md) | Pre-release security checklist. |
| [docs/SECURITY_REVIEW.md](./docs/SECURITY_REVIEW.md) | Pre-release security review report. |

## Repository layout

```
rtl-safe-ai/
├── packages/
│   ├── core/                # @rtl-safe-ai/core — pure RTL/bidi engine
│   └── browser-extension/   # Manifest V3 extension
├── apps/
│   └── demo/                # Vite + React playground
├── docs/                    # Architecture & security documentation
├── tests/                   # Cross-package tests & security invariants
└── ...root configs
```

## Architecture

One **pure engine** with thin consumers. The core does all the logic as
side-effect-free string/value functions; only the extension and demo touch the
DOM, and they do so with safe APIs (`textContent`, attributes, inline styles).

```
              ┌────────────────────────────┐
              │      @rtl-safe-ai/core      │
              │  pure · local-only · no I/O │
              └─────────────┬──────────────┘
                ┌───────────┴───────────┐
        ┌───────┴───────┐       ┌────────┴────────┐
        │ browser-ext   │       │    demo app     │
        │ (Manifest V3) │       │ (Vite + React)  │
        └───────────────┘       └─────────────────┘
```

The core is intentionally small enough to audit in one sitting. See
[docs/architecture.md](./docs/architecture.md) for module responsibilities and
data flow.

## Getting started

Requires **Node.js ≥ 20** and npm (workspaces).

```bash
# Install all workspace dependencies
npm install

# Type-check everything
npm run typecheck

# Lint (also enforces security rules)
npm run lint

# Run tests
npm test
```

### Run the demo app

```bash
npm run dev:demo
```

This starts the Vite + React playground where you can paste Hebrew, Arabic,
English, mixed text, code, math, and tables and watch detection, previews, and
sanitization update live.

### Build & load the browser extension

```bash
# Build the extension into packages/browser-extension/dist
npm run build --workspace @rtl-safe-ai/browser-extension
```

Then load it unpacked:

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select `packages/browser-extension/dist`.

See [docs/EXTENSION_SECURITY.md](./docs/EXTENSION_SECURITY.md) for the permission
model and limitations.

## Using the core package

`@rtl-safe-ai/core` is a pure, dependency-free engine:

```ts
import {
  detect,
  segmentText,
  toRenderHint,
  stripUnsafeControls,
  isPlainTextSafe,
  VERSION,
} from '@rtl-safe-ai/core';

const text = 'בדקו את https://example.com לפני שתמשיכו';

const result = detect(text);
// { direction: 'rtl', script: 'hebrew', rtlRatio: 0.9, isMixed: true, confidence: ... }

const hint = toRenderHint(result.direction);
// { direction: 'rtl', unicodeBidi: 'plaintext', textAlign: 'start' }

const segments = segmentText('שלום $E=mc^2$ עולם');
// [{ kind: 'text', direction: 'rtl', ... }, { kind: 'math', direction: 'ltr', ... }, ...]

const safe = stripUnsafeControls(untrustedText); // removes Trojan-Source overrides
isPlainTextSafe(untrustedText); // false if hidden/override characters are present

console.log(VERSION); // '0.1.0'
```

Apply the hint with safe DOM APIs only (attributes + `style`), never `innerHTML`:

```ts
el.textContent = safe;
el.setAttribute('dir', hint.direction);
el.style.unicodeBidi = hint.unicodeBidi;
el.style.textAlign = hint.textAlign;
```

## Packages

| Package | Description |
| --- | --- |
| [`@rtl-safe-ai/core`](./packages/core) | Pure, local-only RTL engine. |
| [`@rtl-safe-ai/browser-extension`](./packages/browser-extension) | MV3 extension. |
| [`@rtl-safe-ai/demo`](./apps/demo) | Vite + React demo. |

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned work and explicit non-goals.

## Why this project matters (portfolio value)

This repository is also a portfolio project. It was built to solve a real,
everyday problem for Hebrew and Arabic speakers using AI tools, and it
demonstrates a range of practical engineering skills:

| Area | What it shows |
| --- | --- |
| **TypeScript** | Strict, typed, dependency-free library design with a clean public API. |
| **React** | A focused, accessible Vite + React demo UI. |
| **Browser extensions** | A Manifest V3 extension with a content script, service worker, and popup. |
| **Unicode / bidi** | Practical handling of bidirectional text, scripts, and Trojan-Source defenses. |
| **Security-first engineering** | Lint rules + tests that enforce "no network / no eval / no HTML sinks". |
| **Testing discipline** | 111 tests, including security invariant and regression tests. |
| **CI/CD** | GitHub Actions, CodeQL, and tuned Dependabot. |
| **Documentation** | A full security, privacy, threat-model, and supply-chain doc layer. |
| **Privacy-first product thinking** | Local-only processing with no telemetry or data collection. |

For a short project summary, CV bullets, and an interview-ready explanation, see
[docs/PORTFOLIO_SUMMARY.md](./docs/PORTFOLIO_SUMMARY.md).

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and
[docs/architecture.md](./docs/architecture.md), and keep every change within the
security principles above — they are validated by lint and CI. By participating
you agree to our [Code of Conduct](./CODE_OF_CONDUCT.md).

For releases, follow [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).

## License

[MIT](./LICENSE)
