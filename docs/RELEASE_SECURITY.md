# Release Security

This checklist is run before publishing a release to keep the project's security
and privacy guarantees intact. It is designed to align with NIST SSDF release
integrity practices.

## Pre-release checklist

Run the full check suite from the repository root and ensure each passes:

```bash
npm run typecheck   # strict TypeScript across all workspaces
npm run lint        # ESLint, including security rules
npm test            # full test suite + security invariants (111 tests)
npm run build       # build core, demo, and extension
npm audit           # known-vulnerability scan (expect 0 vulnerabilities)
```

All five commands must succeed with no errors before tagging a release.

## Manual review checklist

- [ ] No new runtime dependency was added to `@rtl-safe-ai/core`.
- [ ] No forbidden API (`fetch`/`XHR`/`WebSocket`/`sendBeacon`/`eval`/
      `new Function`/`innerHTML`/`outerHTML`/`insertAdjacentHTML`/
      `document.write`) was introduced.
- [ ] `package-lock.json` changes are intentional and reviewed.
- [ ] Public API changes are documented and versioned appropriately.
- [ ] Diff is small and reviewable; no unexplained or generated artifacts.
- [ ] Version numbers are consistent across packages and the manifest.

## Browser extension review checklist

- [ ] `permissions` are still only `activeTab` and `storage`.
- [ ] `host_permissions` is still empty; `<all_urls>` is not used.
- [ ] Content-script `matches` allowlist changes are intentional and minimal.
- [ ] CSP still sets `connect-src 'none'`.
- [ ] `content.js` is a self-contained bundle with no remote imports.
- [ ] DOM changes remain non-destructive and reversible; sensitive inputs and
      `script`/`style`/`template`/hidden nodes are skipped.

## Privacy review checklist

- [ ] No telemetry, analytics, or tracking added.
- [ ] No network requests of any kind.
- [ ] No user text is stored or transmitted.
- [ ] Only the per-site enable/disable setting is persisted.
- [ ] No access to cookies or website `localStorage` / `sessionStorage`.
- [ ] [PRIVACY.md](./PRIVACY.md) still accurately describes behavior.

## Planned future improvements

These release-integrity controls are **planned** and not yet implemented:

| Improvement | Purpose |
| --- | --- |
| **Signed releases** | Let users verify artifact/tag integrity. |
| **GitHub provenance** | Publish build provenance (e.g. SLSA / npm provenance). |
| **SBOM** | Ship a Software Bill of Materials per release. |
| **CodeQL** | Automated static security analysis in CI. |
| **Dependabot** | Automated dependency updates and alerts. |
| **Branch protection** | Require reviews and green checks on `main`. |

See [SUPPLY_CHAIN.md](./SUPPLY_CHAIN.md) for the broader supply-chain roadmap.
