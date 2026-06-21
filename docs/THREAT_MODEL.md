# Threat Model

This document describes the assets RTL Safe AI handles, the threats considered,
and the mitigations in place. It is a living document and a self-assessment, not
a third-party audit.

## Scope and assumptions

- The engine runs inside an **untrusted page** (an AI chat site) and processes
  **untrusted text** (model output and user input).
- The host browser and operating system are assumed to be trusted and outside
  this project's control.
- The project never interacts with remote services and never elevates
  privileges.

## Assets

| Asset | Why it matters |
| --- | --- |
| **User text** | Prompts and editable-field content the user types. |
| **AI conversation content** | Model responses rendered on the page. |
| **Browser session context** | Cookies, tokens, `localStorage` of the visited site. |
| **Extension settings** | Per-site enable/disable preferences. |
| **Project source code and releases** | The published packages and extension build. |

## Threats and mitigations

| # | Threat | Description | Mitigation |
| --- | --- | --- | --- |
| T1 | **Data exfiltration** | Code sends user text or session data to a remote server. | No network APIs anywhere; ESLint bans `fetch`/`XHR`/`WebSocket`/`sendBeacon`; extension CSP `connect-src 'none'`; invariant test scans core. |
| T2 | **Malicious dependency** | A transitive dependency introduces hostile code. | Core has **zero runtime dependencies** (regression test enforces this); minimal dev dependencies; `npm audit`; lockfile committed. |
| T3 | **Malicious update / release** | A compromised release ships tampered code to users. | Pre-release checklist; small, reviewable diffs; planned signed releases and provenance (see [SUPPLY_CHAIN.md](./SUPPLY_CHAIN.md)). |
| T4 | **Over-permissive extension permissions** | Extension requests more access than needed. | Only `activeTab` + `storage`; empty `host_permissions`; narrow content-script allowlist instead of `<all_urls>`. |
| T5 | **DOM injection / XSS** | Untrusted text is rendered as HTML. | Core emits plain strings/values only; consumers use `textContent`, attributes and `style`; ESLint bans `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write`. |
| T6 | **Unsafe bidi control characters** | Trojan-Source style overrides reorder displayed text to deceive. | `stripUnsafeControls()` removes `LRE/RLE/PDF/LRO/RLO`; isolates are used for safe wrapping; `isPlainTextSafe()` flags unsafe input. |
| T7 | **Hidden prompt-injection via invisible Unicode** | Zero-width or "tag" characters smuggle hidden instructions. | `neutralizeInvisible()` removes zero-width and Unicode tag characters; `isPlainTextSafe()` detects them. |
| T8 | **Supply-chain compromise** | Build tooling or registry account is compromised. | Dependency minimization; lockfile; `npm audit`; planned Dependabot, CodeQL, SBOM, branch protection, and maintainer key hygiene. |
| T9 | **Breaking host pages / privilege misuse** | Extension corrupts SPA state or touches sensitive fields. | Non-destructive DOM changes (attributes/styles only, reversible); skips `script`/`style`/`template`/hidden nodes and sensitive inputs; throttled `MutationObserver`. |

## Out of scope

- Compromise of the host operating system or browser.
- Attacks requiring an already-compromised device or browser extension store.
- The security of third-party AI chat sites themselves.
- Denial-of-service against third-party services (the project makes no requests).

## Residual risk

- The extension reads visible text on allowlisted sites to detect direction. A
  bug could in principle mis-handle a node, but text is never stored or sent
  off-device, bounding the impact to local rendering.
- Until signed releases and provenance are in place (planned), users rely on the
  integrity of the distribution channel. See [SUPPLY_CHAIN.md](./SUPPLY_CHAIN.md).
