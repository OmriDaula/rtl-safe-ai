# Browser Extension Security

The RTL Safe AI browser extension is a privacy-first, Manifest V3 extension that
applies RTL/bidi fixes to AI chat interfaces locally. This document explains its
security model.

## Manifest V3 security model

The extension targets **Manifest V3**, which provides important guarantees the
project relies on:

- The background logic is a **service worker** (`background.js`), not a
  persistent page with ambient privileges.
- A **content security policy** restricts extension pages to `script-src 'self'`
  with `connect-src 'none'`, blocking remote code and network connections.
- Content scripts run as **classic scripts** with no remote-code loading; the
  content bundle is built as a self-contained IIFE with the core inlined and no
  `import` of remote resources.

## Permissions used and why

| Permission | Why it is needed |
| --- | --- |
| `activeTab` | Lets the popup read **only the current tab's hostname** (on user action) to show status and store the per-site setting. No broad tab access. |
| `storage` | Persists **only** the per-site enable/disable preference in `chrome.storage.local`. |

```jsonc
"permissions": ["activeTab", "storage"],
"host_permissions": []
```

### Why `host_permissions` is empty

The extension does **not** request standing host permissions. Instead, content
scripts are statically declared for a **narrow allowlist** of AI chat domains in
`manifest.json`. This avoids granting the extension persistent cross-site access
and keeps the trust footprint small.

### Why `<all_urls>` is not used

Broad `<all_urls>` host permissions would let the extension run on every site the
user visits — an unnecessary and excessive amount of access for a tool that only
needs to operate on specific AI chat interfaces. The allowlist approach follows
the principle of least privilege.

Current content-script allowlist:

```
https://chatgpt.com/*
https://chat.openai.com/*
https://claude.ai/*
https://gemini.google.com/*
```

## Content script behavior

The content script:

- detects text direction for message containers and applies `dir` and a safe
  `unicode-bidi` style **only** via attributes and the `style` property;
- detects direction for editable fields (`textarea`,
  `input[type=text|search]`, `contenteditable`) as the user types;
- keeps **code blocks and math segments LTR**;
- sanitizes unsafe bidi/invisible characters in read-only displayed output using
  the core engine;
- uses a **throttled `MutationObserver`** to handle streaming responses;
- deduplicates work with a `WeakSet` and `data-*` markers so the same node is not
  reprocessed;
- is **non-destructive and reversible** — it stores prior attribute values and
  can revert all changes when disabled.

## What text is processed

Only **visible text** on allowlisted AI chat pages is read, specifically the
`textContent` of message containers and the value/content of editable fields.
This text is used solely to compute text direction and bidi-safe rendering.

## What is never stored

- Page content, message text, or editable-field input.
- URLs visited, browsing history, or any identifiers.
- Anything other than the per-site enable/disable setting.

## What is never transmitted

- Nothing. The extension makes **no network requests** (`connect-src 'none'`),
  sends no telemetry, and loads no remote scripts or configuration.

## DOM safety rules

- Use **`textContent`**, **`setAttribute`**, **`classList`**, the **`style`
  property**, **`createElement`** and **`appendChild`** only.
- **Never** use `innerHTML`, `outerHTML`, `insertAdjacentHTML`, or
  `document.write` (also blocked by ESLint).
- Skip `script`, `style`, `noscript`, `template`, and hidden elements.
- Skip sensitive inputs (e.g. `password`, `email`).
- Prefer adding attributes/classes/styles over replacing nodes, to avoid
  breaking React/Vue/Svelte rendering.

## Known limitations

- The allowlist covers a fixed set of popular AI chat sites; other sites are not
  processed unless added.
- Some sites aggressively re-render or sanitize the DOM, which can revert applied
  attributes; the `MutationObserver` re-applies them but timing edge cases exist.
- Direction detection is heuristic; rare mixed-content cases may be imperfect.
  Changes are always non-destructive and reversible.
- `activeTab` exposes the current tab to the popup only on user action; this is
  the minimum needed to show and store per-site status.
