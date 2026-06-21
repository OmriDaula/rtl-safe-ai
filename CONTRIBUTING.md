# Contributing to rtl-safe-ai

Thanks for your interest in contributing! This project is a **security-first,
local-only** RTL engine, so contributions are reviewed against a small set of
non-negotiable guarantees in addition to the usual quality bar.

## Code of conduct

By participating you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Non-negotiable guarantees

Any change must preserve these. They are enforced by ESLint and tests:

- **No network access** — no `fetch`, `XMLHttpRequest`, `WebSocket`,
  `sendBeacon`, or `EventSource`.
- **No dynamic code execution** — no `eval`, `new Function`, or similar.
- **No unsafe DOM sinks** — no `innerHTML`, `outerHTML`, `insertAdjacentHTML`,
  or `document.write`.
- **No telemetry, analytics, or tracking.**
- **`@rtl-safe-ai/core` stays dependency-free** (zero runtime dependencies).
- **Minimal extension permissions** — do not broaden the permission set.

See [docs/SECURITY.md](./docs/SECURITY.md) and
[docs/THREAT_MODEL.md](./docs/THREAT_MODEL.md) for the reasoning.

## Getting started

Requires **Node.js ≥ 20** and npm (workspaces).

```bash
git clone https://github.com/OmriDaula/rtl-safe-ai.git
cd rtl-safe-ai
npm install
```

Useful scripts (run from the repo root):

```bash
npm run typecheck     # strict TypeScript across all workspaces
npm run lint          # ESLint, including security rules
npm test              # full test suite (Vitest)
npm run build         # build core, demo, and extension
npm run dev:demo      # run the demo app locally
```

## Development workflow

1. Create a branch from `main` (e.g. `fix/table-tiebreak`).
2. Make focused changes with clear commits.
3. Add or update tests for any behavior change.
4. Run the full check suite locally (below) and make sure it passes.
5. Open a pull request using the PR template and fill in the checklists.

### Required local checks

```bash
npm run typecheck && npm run lint && npm test && npm run build && npm audit
```

All five must pass before a PR can be merged.

## Coding standards

- TypeScript in `strict` mode; avoid `any` where practical.
- Keep the core **pure and synchronous** — no I/O, no DOM, no browser APIs.
- Prefer small, readable functions; add comments only for non-trivial logic.
- Match the existing style; run `npm run format:fix` before committing.
- Add tests under `tests/` and keep names descriptive.

## Reporting bugs and requesting features

Use the issue templates:

- **Bug report** — for incorrect detection or rendering.
- **Feature request** — for new capabilities (must respect the guarantees).
- **Security question** — for general (non-vulnerability) questions.

To report a **vulnerability**, do not open a public issue — follow
[SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the
project's [MIT License](./LICENSE).
