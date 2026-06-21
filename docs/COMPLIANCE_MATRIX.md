# Compliance Self-Assessment Matrix

This matrix maps RTL Safe AI to recognized secure-development frameworks. It
describes how the project is **designed to align with** their principles and
records concrete evidence in the repository.

> **This is a self-assessment, not a third-party certification.** The project is
> not certified, audited, or approved by any organization or government body.
> "Status" reflects the maintainers' honest evaluation of the current codebase.

**Status legend:** ✅ Implemented · 🟡 Partially implemented · ⏳ Planned

## NIST SSDF (SP 800-218, Secure Software Development Framework)

| Practice area | How RTL Safe AI addresses it | Evidence | Status | Notes |
| --- | --- | --- | --- | --- |
| PO — Define security requirements | Documented security goals, scope and "never do" boundaries. | `SECURITY.md`, `docs/SECURITY.md`, `docs/THREAT_MODEL.md` | ✅ | |
| PS — Protect software / integrity of releases | Committed lockfile; small reviewable changes; signing planned. | `package-lock.json`, `docs/RELEASE_SECURITY.md` | 🟡 | Signed releases/provenance are planned. |
| PW — Produce well-secured software | Strict TypeScript, ESLint security rules, no unsafe sinks, pure core. | `tsconfig.base.json`, `eslint.config.js`, `packages/core/src` | ✅ | |
| PW.7/8 — Review and test | 111 tests incl. security invariants; manual review checklist. | `tests/`, `docs/RELEASE_SECURITY.md` | ✅ | |
| RV — Respond to vulnerabilities | Documented private reporting and response process. | `SECURITY.md` | 🟡 | No paid security team; best-effort timelines. |

## CISA Secure by Design

| Principle | How RTL Safe AI addresses it | Evidence | Status | Notes |
| --- | --- | --- | --- | --- |
| Take ownership of customer security outcomes | Safe defaults; conservative, reversible behavior; no data collection. | `packages/browser-extension/src/content.ts`, `docs/PRIVACY.md` | ✅ | |
| Embrace radical transparency | Open-source, documented threat model and self-assessment. | This folder, public repository | ✅ | |
| Secure defaults | Minimal permissions; local-only; no network; sensitive fields skipped. | `manifest.json`, `docs/EXTENSION_SECURITY.md` | ✅ | |
| Eliminate classes of vulnerability | No HTML sinks (no XSS class), no `eval`, no network (no exfil class). | `eslint.config.js`, `tests/security.invariants.test.ts` | ✅ | |
| Memory-safe / safe languages | TypeScript/JavaScript runtime; no native code. | whole repo | ✅ | |

## OWASP ASVS (selected areas)

| ASVS area | How RTL Safe AI addresses it | Evidence | Status | Notes |
| --- | --- | --- | --- | --- |
| V1 Architecture | Documented architecture and threat model; least privilege. | `docs/architecture.md`, `docs/THREAT_MODEL.md` | ✅ | |
| V5 Validation, sanitization & encoding | Bidi-control stripping and invisible-character neutralization; output is plain text. | `packages/core/src/bidi.ts`, `packages/core/src/sanitize.ts` | ✅ | |
| V7 Error handling & logging | No logging of user content; no telemetry. | `docs/PRIVACY.md` | ✅ | |
| V9 Communications | No external communication at all. | extension CSP `connect-src 'none'` | ✅ | Many V9 controls are N/A by design. |
| V10 Malicious code | No `eval`/dynamic code; dependency minimization; invariant tests. | `eslint.config.js`, `tests/` | ✅ | |
| V14 Configuration | Minimal permissions; strict CSP; documented config. | `manifest.json`, `docs/EXTENSION_SECURITY.md` | ✅ | |
| Authentication / Session / Access control (V2–V4) | Not applicable — no accounts, sessions, or server. | — | N/A | The project has no backend. |

## Israeli National Cyber Directorate (INCD) — supply-chain guidance

| Guidance theme | How RTL Safe AI addresses it | Evidence | Status | Notes |
| --- | --- | --- | --- | --- |
| Know your dependencies (inventory/SBOM) | Minimal deps; SBOM generation planned. | `package-lock.json`, `docs/SUPPLY_CHAIN.md` | 🟡 | SBOM is planned. |
| Vet and monitor third-party components | `npm audit`; Dependabot/CodeQL planned. | `docs/SUPPLY_CHAIN.md` | 🟡 | Automated scanning is planned. |
| Integrity of build and release | Lockfile, reviewable builds; signing/provenance planned. | `docs/RELEASE_SECURITY.md` | 🟡 | |
| Least privilege & data minimization | Minimal permissions; local-only; no data collection. | `manifest.json`, `docs/PRIVACY.md` | ✅ | |
| Access control on the codebase | Branch protection & maintainer key hygiene planned. | `docs/SUPPLY_CHAIN.md` | ⏳ | Repository-administration controls. |

## Summary

The runtime and engine controls (no network, no dynamic code, no HTML sinks,
minimal permissions, bidi/invisible-character handling) are **implemented and
tested**. The remaining items — signed releases, provenance, SBOM, automated
dependency/code scanning, and repository administration controls — are
**planned** and tracked in [SUPPLY_CHAIN.md](./SUPPLY_CHAIN.md) and
[RELEASE_SECURITY.md](./RELEASE_SECURITY.md).
