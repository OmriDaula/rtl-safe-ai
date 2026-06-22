# Pre-Release Security Review

**Date:** 2026-06-21
**Reviewer role:** Application security / browser-extension / supply-chain
**Version reviewed:** `0.1.0` (`main` @ branch `ci/github-readiness`)

> This is an internal, good-faith review by the maintainers. It is **not** a
> third-party audit, certification, or government approval, and it does not
> guarantee the absence of vulnerabilities.

## Executive summary

The repository is in strong shape for a public open-source release. The core
engine is pure, dependency-free, and free of network, `eval`, and HTML-sink
APIs; the browser extension uses a minimal permission model with a strict CSP
and non-destructive, reversible DOM changes; the demo renders user input through
React text nodes only. Supply-chain hygiene (committed lockfile, `npm audit`
clean, Dependabot, CodeQL, minimal CI permissions) is in place, and the
documentation is honest and clearly labeled as self-assessment.

The review found **no high- or critical-severity issues**. Four low-severity,
release-readiness items were identified and fixed (a manifest pointing at
missing icon files, an incorrect repository URL in the popup, an ESLint gap
versus a documented claim, and a CI/command-consistency nit).

**Final readiness score: 9 / 10.**

## Scope

In scope (reviewed):

- `packages/core` — RTL/bidi engine and sanitization.
- `packages/browser-extension` — Manifest V3 extension (manifest, content
  script, background worker, popup, build).
- `apps/demo` — Vite + React demo.
- Supply chain — dependencies, lockfile, `npm audit`, GitHub Actions, Dependabot,
  CodeQL.
- Documentation — `README*`, root `SECURITY.md`, and `docs/*`.

Out of scope: third-party AI chat sites, browsers, operating systems, and any
attack requiring a pre-compromised device. See
[THREAT_MODEL.md](./THREAT_MODEL.md).

## Methodology

- Static reading of all source under `packages/*/src` and `apps/demo/src`.
- Pattern sweeps for forbidden APIs (`fetch`, `XMLHttpRequest`, `WebSocket`,
  `sendBeacon`, `eval`, `new Function`, `innerHTML`, `outerHTML`,
  `insertAdjacentHTML`, `document.write`, `localStorage`, `sessionStorage`,
  `document.cookie`, `dangerouslySetInnerHTML`).
- Verification that the core references no DOM/browser globals
  (`document`/`window`/`navigator`/`chrome`/`process`).
- Inspection of `manifest.json`, CSP, permissions, and the content-script
  allowlist.
- Supply-chain checks: tracked-file inventory (no `dist/`, secrets, keys, or
  certificates committed), lockfile presence, `npm audit`, workflow permissions.
- Cross-check of documentation claims against actual code behavior.

## Findings

| ID | Severity | Area | Finding | Status |
| --- | --- | --- | --- | --- |
| F1 | Low | Extension / release | `manifest.json` referenced `icons/icon-{16,48,128}.png`, which are not committed (only a placeholder `README.md`). Loading unpacked produced "could not load icon" warnings. | ✅ Fixed |
| F2 | Low | Extension / correctness | Popup "GitHub repository" link pointed to `github.com/rtl-safe-ai/rtl-safe-ai` instead of the real `github.com/OmriDaula/rtl-safe-ai`. | ✅ Fixed |
| F3 | Low | Lint / docs accuracy | Security docs state ESLint bans `sendBeacon`, but the rule only matched a bare `sendBeacon()` call, not `navigator.sendBeacon()`. | ✅ Fixed |
| F4 | Low | CI / consistency | CI ran `npm audit --audit-level=moderate` while the documented/release command is plain `npm audit`. | ✅ Fixed |
| O1 | Info | Demo | "Raw preview" intentionally renders unsanitized text (incl. bidi overrides) to demonstrate the problem. Rendered as a React text node (no HTML injection) and isolated in a `dir="ltr"` block. | No change (by design) |
| O2 | Info | Extension | `sourcemap: true` ships source maps in the extension build. For an open-source project this is acceptable/transparent, not a leak. | No change |
| O3 | Info | Detection | Direction detection is heuristic; rare mixed-content cases may be imperfect. Changes are always non-destructive and reversible. | No change |

### Positive observations (verified)

- **Core is pure and dependency-free.** No DOM/browser/network globals; only
  relative imports; zero runtime dependencies (enforced by
  `tests/security.regression.test.ts`).
- **No forbidden APIs in code.** The only matches for `innerHTML`/`sendBeacon`/
  etc. are in comments describing the bans.
- **Extension least privilege.** `permissions: ["activeTab","storage"]`,
  `host_permissions: []`, no `<all_urls>`, narrow content-script allowlist, and
  CSP `connect-src 'none'`.
- **Non-destructive content script.** Adds reversible `dir`/`style` only; skips
  `SCRIPT/STYLE/NOSCRIPT/TEMPLATE/HEAD/TITLE` and hidden nodes; only annotates
  `text`/`search` inputs, `textarea`, and `contenteditable` (never `password`/
  `email`); text rewriting is limited to sanitizing read-only output. The
  `MutationObserver` is debounced (200 ms) and coalesced via a single scheduled
  scan, with `WeakSet` + length-marker deduplication.
- **Settings store only a per-site boolean map**; loader validates/whitelists
  values and never persists page text.
- **Demo** uses React text nodes only; no `dangerouslySetInnerHTML`; a local CSP
  meta tag with `connect-src 'self'` and no remote assets.
- **Supply chain.** `package-lock.json` committed; `npm audit` reports 0
  vulnerabilities; no `dist/`, secrets, keys, or certificates tracked; CI uses
  `permissions: contents: read`; CodeQL scopes elevated permissions to its job.

## Required fixes (implemented)

1. **F1 — Missing icons:** Removed the `icons` block from `manifest.json` so the
   extension loads cleanly without warnings; documented re-adding icons before a
   web-store release in `packages/browser-extension/icons/README.md`.
2. **F2 — Wrong repo URL:** Updated the popup link to
   `https://github.com/OmriDaula/rtl-safe-ai`.
3. **F3 — sendBeacon lint gap:** Added `sendBeacon` to ESLint
   `no-restricted-properties` so `navigator.sendBeacon(...)` is also blocked,
   making the documented guarantee accurate.
4. **F4 — CI audit consistency:** Changed the CI step to plain `npm audit` to
   match `RELEASE_SECURITY.md` and `RELEASE_CHECKLIST.md`.

All fixes are minimal, well-scoped, and do not change core engine behavior.

## Recommended improvements (not blocking)

- Add real icon assets and restore the manifest `icons` block before publishing
  to the Chrome/Edge stores.
- Implement the already-planned release-integrity controls: signed releases,
  build provenance, SBOM, and branch protection (see
  [SUPPLY_CHAIN.md](./SUPPLY_CHAIN.md)).
- Consider pinning GitHub Actions to commit SHAs (in addition to Dependabot
  updates) for stricter supply-chain integrity.
- Optionally add an automated link-checker for docs in CI.

## Residual risks

- **Distribution integrity:** Until signed releases/provenance land, users rely
  on the integrity of the GitHub distribution channel.
- **Allowlist coverage:** Only a fixed set of AI chat domains is processed;
  others are untouched by design.
- **Heuristic detection:** Direction detection can be imperfect on unusual mixed
  content, though all changes are reversible and non-destructive.
- **Host page volatility:** Aggressive SPA re-rendering may revert applied
  attributes; the observer re-applies them, but timing edge cases can exist.

## Readiness score

**9 / 10** — Ready for a public open-source release. The single point withheld
reflects pending release-integrity automation (signing/provenance/SBOM) and the
absence of shipped icon assets, both already tracked as planned work.
