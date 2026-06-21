# Supply-Chain Security

This document describes how RTL Safe AI manages its dependencies and releases to
reduce supply-chain risk. It is designed to align with NIST SSDF (PS/PW) and
Israeli National Cyber Directorate supply-chain guidance.

## Dependency strategy

- **Minimize dependencies.** Fewer dependencies means a smaller attack surface
  and an easier audit.
- **No runtime dependencies in the core.** `@rtl-safe-ai/core` ships with **zero
  runtime dependencies** and no Node built-ins. This is enforced by
  `tests/security.regression.test.ts`, which fails if a non-relative import or a
  `node:` import appears in the core source.
- **Dev dependencies only where needed.** Build/test tooling (TypeScript, Vite,
  Vitest, ESLint, Prettier) is confined to development and does not ship to
  users. The browser extension bundles only the core engine.

## Lockfile usage

- `package-lock.json` is committed at the repository root and covers all
  workspaces, pinning the full dependency tree for reproducible installs.
- Use `npm ci` in automated/release environments to install exactly the locked
  versions.

## Dependency review process

When adding or upgrading a dependency:

1. Justify the need — prefer a small, well-maintained package or no dependency.
2. Review its purpose, maintenance status, and transitive footprint.
3. Confirm it does not introduce network, `eval`, or unsafe DOM behavior in code
   paths we ship.
4. Run `npm audit` and the full check suite (see
   [RELEASE_SECURITY.md](./RELEASE_SECURITY.md)).
5. Keep the change small and reviewable; commit the updated lockfile.

## Vulnerability scanning

- **`npm audit`** is run as part of the pre-release checklist. The project
  currently reports **0 vulnerabilities**.
- Security invariant tests scan the core source for forbidden APIs on every test
  run.

## Planned improvements

These controls are **planned** and not yet in place:

| Control | Purpose | Status |
| --- | --- | --- |
| **Dependabot** | Automated dependency-update PRs and alerts. | ⏳ Planned |
| **CodeQL** | Static analysis for security issues in CI. | ⏳ Planned |
| **SBOM** | Publish a Software Bill of Materials per release (e.g. CycloneDX). | ⏳ Planned |
| **Release signing** | Sign release artifacts/tags so users can verify integrity. | ⏳ Planned |
| **Build provenance** | Publish provenance (e.g. SLSA / npm provenance) for builds. | ⏳ Planned |
| **Branch protection** | Require reviews and passing checks on `main`. | ⏳ Planned |

## Maintainer key hygiene (guidance)

For maintainers with publish or administrative access:

- Enable **two-factor authentication** on GitHub and npm accounts.
- Use **hardware-backed** or platform-managed keys where possible; never commit
  secrets to the repository.
- Use **scoped, least-privilege tokens** for automation; rotate them regularly
  and revoke unused tokens.
- Prefer **short-lived credentials** and CI OIDC over long-lived tokens.
- Protect signing keys; store them outside the repository and back them up
  securely.
- Review account access periodically and remove inactive collaborators.
