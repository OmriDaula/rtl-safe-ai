# Security model (detailed)

This document expands on [SECURITY.md](../SECURITY.md) with the reasoning behind
each control.

## Threat model

We assume the engine runs inside a hostile, untrusted page (an AI chat site) and
processes untrusted text (model output and user input). Our goals:

- **Confidentiality:** never read or exfiltrate user data or credentials.
- **Integrity:** never inject executable content or HTML into the page.
- **Least privilege:** request the minimum browser permissions.

We explicitly do **not** attempt to defend the host OS or modify other apps —
that is out of scope and forbidden by design.

## Controls

### 1. No network

- ESLint bans `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`,
  `sendBeacon`.
- The extension's CSP sets `connect-src 'none'`.
- A CI test scans `packages/core/src` for forbidden network APIs.

### 2. No dynamic code execution

- ESLint: `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`.
- The core ships as plain ES modules with no runtime codegen.

### 3. No HTML injection

- ESLint bans `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`.
- The core never produces HTML; it returns plain strings and value objects.
- Consumers render with `textContent` and attributes only.

### 4. No credential access

- The content script reads `textContent` of message nodes only.
- The extension declares no `cookies`, `webRequest`, or host-wide permissions.

### 5. Minimal permissions

- `permissions: ["storage"]` for a local on/off preference.
- `host_permissions: []`; content scripts use a narrow domain allowlist.

### 6. Trojan-Source resistance

- `stripUnsafeControls()` removes bidi override/embedding controls
  (`LRE/RLE/PDF/LRO/RLO`) that enable
  [Trojan Source](https://trojansource.codes/) style spoofing, while keeping
  legitimate marks (`LRM/RLM`) and isolates (`FSI…PDI`).

## Auditing

The entire core is intended to be readable in a single sitting. If you are
reviewing a contribution, verify that:

- no new dependency is added to `@rtl-safe-ai/core`;
- no forbidden API appears (lint + invariant test will catch this);
- new emitted characters, if any, are added to `constants.ts`.
