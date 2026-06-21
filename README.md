# rtl-safe-ai

**A security-first, open-source RTL engine for AI chat interfaces.**

`rtl-safe-ai` fixes how right-to-left languages — Hebrew, Arabic, Persian, Urdu,
Yiddish and more — are displayed in AI chat UIs, where mixed-direction text is
routinely mangled. It does this with a small, dependency-free, **local-only**
engine that never touches your data.

> 🇮🇱 עברית: see [README.he.md](./README.he.md)

> **Status:** early scaffold. The architecture, configs and public API are in
> place; the detection/bidi logic is not yet implemented.

---

## What this project is

- A **pure TypeScript core** (`@rtl-safe-ai/core`) for RTL detection and
  bidi-safe text handling.
- A **Manifest V3 browser extension** that applies fixes to AI chat pages.
- A **Vite + React demo** to explore the engine.

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

# Run the demo app
npm run dev:demo

# Build the browser extension
npm run build --workspace @rtl-safe-ai/browser-extension
```

## Packages

| Package | Description |
| --- | --- |
| [`@rtl-safe-ai/core`](./packages/core) | Pure, local-only RTL engine. |
| [`@rtl-safe-ai/browser-extension`](./packages/browser-extension) | MV3 extension. |
| [`@rtl-safe-ai/demo`](./apps/demo) | Vite + React demo. |

## Contributing

Contributions are welcome. Please read [docs/architecture.md](./docs/architecture.md)
and keep every change within the security principles above — they are validated
by lint and CI.

## License

[MIT](./LICENSE)
