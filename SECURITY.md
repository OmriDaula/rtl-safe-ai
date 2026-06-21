# Security Policy

`rtl-safe-ai` is built security-first. The threat model and guarantees below are
intended to be auditable and small.

## Guarantees

The project, in all of its packages, will not:

- access the network (no `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`);
- execute dynamic code (no `eval`, `new Function`, dynamic `Function`);
- render untrusted HTML (no `innerHTML`, `outerHTML`, `insertAdjacentHTML`,
  `document.write`);
- read credentials (cookies, tokens, passwords, form fields holding secrets);
- collect telemetry or analytics;
- modify system files, install certificates, or require elevated permissions;
- patch or tamper with desktop applications or their integrity checks.

These are enforced by:

1. **ESLint** rules (see `eslint.config.js`) that hard-fail on the above.
2. **CI invariant tests** (`tests/security.invariants.test.ts`) that scan the
   core source.
3. **Extension CSP** with `connect-src 'none'` and minimal permissions.

## Reporting a vulnerability

If you discover a security issue, please open a private report (GitHub Security
Advisory) or contact the maintainers rather than filing a public issue.

Please include:

- a description of the issue and its impact;
- steps to reproduce;
- affected package(s) and version(s).

We aim to acknowledge reports promptly and to coordinate disclosure.

## Scope

In scope: code in `packages/*` and `apps/*` of this repository.

Out of scope: third-party AI chat sites, browsers, and operating systems. This
project only adjusts how text is rendered locally and never interacts with
remote services.
