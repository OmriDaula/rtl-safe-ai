# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- GitHub Actions CI (typecheck, lint, test, build, audit) on PRs and `main`.
- CodeQL static analysis workflow (PRs, `main`, weekly schedule).
- Dependabot configuration for npm and GitHub Actions updates.
- Issue templates (bug report, feature request, security question) and PR template.
- Community docs: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `ROADMAP.md`,
  `RELEASE_CHECKLIST.md`, and this changelog.
- `CODEOWNERS` for review routing.

## [0.1.0] - 2026-06-21

### Added

- `@rtl-safe-ai/core`: local-only, dependency-free RTL detection and bidi-safe
  text utilities (`detect`, `detectTextDirection`, `segmentText`,
  `detectLatexRanges`, `detectTableDirection`, `toRenderHint`, `resolveAuto`,
  `wrapIsolated`, `stripUnsafeControls`, `neutralizeInvisible`,
  `isPlainTextSafe`).
- Privacy-first Manifest V3 browser extension with `activeTab` + `storage`
  permissions, empty `host_permissions`, and a narrow content-script allowlist.
- Vite + React demo app showcasing detection, previews, segmentation, and
  sanitization.
- Security and privacy documentation layer under `docs/` plus the root
  `SECURITY.md`.
- 111 tests, including security invariant and regression tests.

[Unreleased]: https://github.com/OmriDaula/rtl-safe-ai/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/OmriDaula/rtl-safe-ai/releases/tag/v0.1.0
