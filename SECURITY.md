# Security Policy

`rtl-safe-ai` is built security-first and **designed to align with**
secure-development principles from NIST SSDF, CISA Secure by Design, OWASP ASVS,
and Israeli National Cyber Directorate (INCD) supply-chain guidance.

> **Not formally certified.** This project has not been certified, audited by a
> third party, or approved by any government or standards body. References to
> frameworks describe a good-faith self-assessment only — see
> [docs/COMPLIANCE_MATRIX.md](./docs/COMPLIANCE_MATRIX.md).

## Supported versions

The project is pre-1.0. Security fixes are applied to the latest released minor
version and to `main`.

| Version | Supported |
| --- | --- |
| `0.1.x` (latest) | ✅ |
| `< 0.1.0` | ❌ |

## Reporting a vulnerability

Please report security issues **privately** — do not open a public issue for an
undisclosed vulnerability.

- Preferred: open a private **GitHub Security Advisory** for this repository
  ("Security" tab → "Report a vulnerability").
- Alternatively: contact the maintainers through the channel listed on the
  repository profile.

### What to include

To help us triage quickly, please include:

- a clear description of the issue and its security impact;
- the affected package(s) and version(s) or commit;
- step-by-step reproduction (and a minimal proof-of-concept if possible);
- the environment (browser/version, OS) where relevant;
- any suggested remediation.

### Response process

- **Acknowledgement:** we aim to acknowledge a report within a few business days.
- **Triage:** we assess severity and reproduce the issue.
- **Fix & disclosure:** we develop a fix, prepare a release, and coordinate
  disclosure with the reporter. We credit reporters who wish to be named.

Timelines are best-effort; this is a community open-source project without a
paid security team or bug-bounty program.

## Security guarantees

Across all packages, the project will not:

- access the network (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`);
- execute dynamic code (`eval`, `new Function`, dynamic code generation);
- render untrusted HTML (`innerHTML`, `outerHTML`, `insertAdjacentHTML`,
  `document.write`);
- read credentials (cookies, tokens, passwords, or secret form fields);
- read website `localStorage` / `sessionStorage`;
- collect telemetry or analytics;
- modify system files, install certificates, or require elevated permissions.

These are enforced by ESLint rules (`eslint.config.js`), security invariant
tests (`tests/security.invariants.test.ts`, `tests/security.regression.test.ts`),
and the extension CSP (`connect-src 'none'`). See
[docs/SECURITY.md](./docs/SECURITY.md) for details.

## Scope

**In scope:** code in `packages/*` and `apps/*` of this repository — the core
engine, the browser extension, and the demo app.

**Out of scope:**

- third-party AI chat sites, browsers, and operating systems;
- vulnerabilities that require a pre-compromised browser or device;
- social-engineering, physical access, or denial-of-service of third parties;
- issues in dependencies that are already publicly known and tracked upstream
  (please still let us know if we are shipping a vulnerable version).

This project only adjusts how text is rendered locally and never interacts with
remote services.

## More information

- [docs/SECURITY.md](./docs/SECURITY.md) — security overview and controls
- [docs/PRIVACY.md](./docs/PRIVACY.md) — privacy guarantees
- [docs/THREAT_MODEL.md](./docs/THREAT_MODEL.md) — threat model
- [docs/SUPPLY_CHAIN.md](./docs/SUPPLY_CHAIN.md) — supply-chain practices
- [docs/EXTENSION_SECURITY.md](./docs/EXTENSION_SECURITY.md) — extension model
- [docs/RELEASE_SECURITY.md](./docs/RELEASE_SECURITY.md) — release checklist
