# Release Checklist

A quick, repeatable checklist for cutting a release. For the full security
rationale and review checklists, see
[docs/RELEASE_SECURITY.md](./docs/RELEASE_SECURITY.md).

## 1. Verify the build

Run all checks from the repository root; every command must pass:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

## 2. Review

- [ ] No new runtime dependency in `@rtl-safe-ai/core`.
- [ ] No forbidden APIs introduced (network / `eval` / unsafe DOM sinks).
- [ ] Extension permissions unchanged or reduced; CSP intact.
- [ ] Privacy behavior unchanged (no telemetry, no text stored/sent).
- [ ] Docs and README reflect any behavior changes.

## 3. Version & changelog

- [ ] Bump versions consistently (root, packages, extension `manifest.json`,
      and `VERSION` in `packages/core/src/index.ts`).
- [ ] Move entries from `Unreleased` to the new version in
      [CHANGELOG.md](./CHANGELOG.md).

## 4. Tag & publish

- [ ] Create an annotated git tag (e.g. `v0.1.1`).
- [ ] Create a GitHub Release with notes from the changelog.
- [ ] (When npm publishing is enabled) publish with provenance.

## Planned release-integrity improvements

Tracked in [docs/SUPPLY_CHAIN.md](./docs/SUPPLY_CHAIN.md): signed releases,
GitHub/npm provenance, SBOM, CodeQL gating, Dependabot, and branch protection.
