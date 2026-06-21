# Roadmap

This roadmap is indicative, not a commitment. Priorities may shift based on
feedback and contributions. Everything here is designed to preserve the
project's local-only, privacy-first guarantees.

## Now (0.1.x)

- ✅ Core RTL/bidi engine with 111 tests.
- ✅ Privacy-first Manifest V3 browser extension (MVP).
- ✅ Vite + React demo app.
- ✅ Security & privacy documentation layer.
- ✅ CI, CodeQL, and Dependabot.

## Next

- Broaden the extension's AI-chat site allowlist (opt-in, still no `<all_urls>`).
- More robust handling of streaming responses and virtualized message lists.
- Additional script coverage and detection edge-case tests.
- Publish `@rtl-safe-ai/core` to npm with provenance.
- Optional user-facing settings (e.g. per-site detection sensitivity).

## Later

- Signed releases and SBOM generation (see [docs/SUPPLY_CHAIN.md](./docs/SUPPLY_CHAIN.md)).
- Branch protection and additional automated review gates.
- Framework adapters/examples (React/Vue) for embedding the core safely.
- Internationalized demo and documentation.

## Explicit non-goals

These are out of scope by design:

- Patching desktop apps, modifying system files, or requiring elevated
  permissions.
- Any network access, telemetry, analytics, or user tracking.
- Storing or transmitting user text.
- Unsafe DOM injection or dynamic code execution.

See [docs/THREAT_MODEL.md](./docs/THREAT_MODEL.md) for the full security context.
