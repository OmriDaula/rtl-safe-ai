# Security Overview

Security-first, open-source RTL support for Hebrew, Arabic and bidirectional AI
interfaces, **designed to align with** secure-development principles from
NIST SSDF, CISA Secure by Design, OWASP ASVS, and Israeli National Cyber
Directorate (INCD) supply-chain guidance.

> This project is **not** formally certified, audited by a third party, or
> approved by any government or standards body. The documents in this folder are
> a transparent, good-faith **self-assessment** intended to make the project
> easy to review.

## Security documentation map

| Document | Purpose |
| --- | --- |
| [`/SECURITY.md`](../SECURITY.md) | Security policy and vulnerability reporting. |
| [PRIVACY.md](./PRIVACY.md) | What data is (and is not) processed and stored. |
| [THREAT_MODEL.md](./THREAT_MODEL.md) | Assets, threats and mitigations. |
| [COMPLIANCE_MATRIX.md](./COMPLIANCE_MATRIX.md) | Self-assessment against recognized frameworks. |
| [SUPPLY_CHAIN.md](./SUPPLY_CHAIN.md) | Dependency and release supply-chain practices. |
| [EXTENSION_SECURITY.md](./EXTENSION_SECURITY.md) | Browser-extension security model. |
| [RELEASE_SECURITY.md](./RELEASE_SECURITY.md) | Pre-release security checklist. |
| [architecture.md](./architecture.md) | System architecture. |

## Design goals

The engine is assumed to run inside a hostile, untrusted page (an AI chat site)
and to process untrusted text (model output and user input). The goals are:

- **Confidentiality** — never read or exfiltrate user data or credentials.
- **Integrity** — never inject executable content or HTML into the page.
- **Least privilege** — request the minimum browser permissions.

The project explicitly does **not** attempt to defend the host operating system,
modify other applications, or bypass any integrity checks. That is out of scope
and forbidden by design.

## Security controls

### 1. No network access

- ESLint bans `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource` and
  `sendBeacon` (see `eslint.config.js`).
- The browser-extension CSP sets `connect-src 'none'`.
- A test scans `packages/core/src` for forbidden network APIs
  (`tests/security.invariants.test.ts`).

### 2. No dynamic code execution

- ESLint: `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`.
- The core ships as plain ES modules with no runtime code generation.

### 3. No HTML injection

- ESLint bans `innerHTML`, `outerHTML`, `insertAdjacentHTML` and
  `document.write`.
- The core never produces HTML; it returns plain strings and value objects.
- Consumers (demo and extension) render with `textContent`, attributes and the
  `style` property only.

### 4. No credential or page-storage access

- The extension declares no `cookies`, `webRequest`, or host-wide permissions.
- It never reads website `localStorage` / `sessionStorage`.
- The content script ignores sensitive inputs (e.g. `password`, `email`).

### 5. Minimal permissions

- Extension `permissions`: `activeTab`, `storage`.
- `host_permissions`: empty. Content scripts use a narrow domain allowlist
  rather than `<all_urls>`.

### 6. Trojan-Source and hidden-Unicode resistance

- `stripUnsafeControls()` removes bidi override/embedding controls
  (`LRE/RLE/PDF/LRO/RLO`) that enable
  [Trojan Source](https://trojansource.codes/) style spoofing, while keeping
  legitimate marks (`LRM/RLM/ALM`) and isolates (`FSI…PDI`).
- `neutralizeInvisible()` removes zero-width and Unicode "tag" characters that
  can hide content or smuggle prompt-injection payloads.
- `isPlainTextSafe()` reports whether a string contains such unsafe characters.

### 7. Strict, auditable codebase

- TypeScript `strict` mode plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noUnusedLocals/Parameters`.
- `@rtl-safe-ai/core` has **zero runtime dependencies**
  (guarded by `tests/security.regression.test.ts`).
- The core is small and intended to be readable in a single sitting.

## How controls are verified

| Control | Verification |
| --- | --- |
| No network / eval / HTML sinks | ESLint rules + `tests/security.invariants.test.ts` |
| Core stays dependency-free and pure | `tests/security.regression.test.ts` |
| Behavior correctness | 111 tests across the suite (`npm test`) |
| Known-vulnerable dependencies | `npm audit` (currently 0 vulnerabilities) |

## Reviewing a contribution

When reviewing a change, verify that:

- no new dependency is added to `@rtl-safe-ai/core`;
- no forbidden API appears (lint and the invariant tests will catch this);
- any newly emitted control characters are added to `packages/core/src/constants.ts`;
- the extension's permission set is unchanged or reduced.
