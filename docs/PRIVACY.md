# Privacy

RTL Safe AI is built to be **private by design**. It processes text locally to
fix right-to-left rendering and never sends anything anywhere.

## At a glance

| Question | Answer |
| --- | --- |
| Telemetry? | **No.** |
| Analytics? | **No.** |
| User tracking? | **No.** |
| External network requests? | **No.** |
| Collects your text? | **No.** |
| Stores your text? | **No.** |
| Reads cookies? | **No.** |
| Reads site `localStorage` / `sessionStorage`? | **No.** |
| Remote configuration or remote scripts? | **No.** |
| What is stored? | Only a per-site enable/disable setting (browser extension). |
| Where does processing happen? | Entirely in your browser, locally. |

## What we do not collect

- **No telemetry or analytics.** There is no usage reporting, event logging, or
  metrics collection of any kind.
- **No tracking.** No identifiers, fingerprints, cookies, or pixels.
- **No network calls.** The core performs no I/O; the extension's content
  security policy sets `connect-src 'none'`.
- **No user text collection or storage.** Text you type or that an AI generates
  is analysed in memory to determine direction and is never persisted or
  transmitted.

## What the browser extension stores

The extension persists exactly one thing in `chrome.storage.local`:

- a map of **per-site enable/disable** choices (e.g. "disabled on example.com").

It does **not** store page content, message text, form input, URLs you visit, or
any personal data. Storage is local to your browser profile and is never synced
to a remote server by this project.

## What the extension accesses

- The popup uses the `activeTab` permission to read **only the current tab's
  hostname** (when you click the toolbar icon) so it can show status and save the
  per-site setting.
- The content script reads the **text content** of message containers and of
  editable fields (`textarea`, `input[type=text|search]`, `contenteditable`)
  purely to detect text direction locally. Sensitive inputs such as `password`
  and `email` are ignored. This text is never stored or transmitted.

See [EXTENSION_SECURITY.md](./EXTENSION_SECURITY.md) for the full extension
model.

## Local-only processing

All detection, segmentation, and sanitization run synchronously in the browser
using `@rtl-safe-ai/core`, which has zero runtime dependencies and performs no
network or filesystem access. Nothing leaves your device.

## Children's privacy and data subjects

Because the project collects no personal data and makes no network requests,
there is no personal data to access, export, or delete. Removing the extension
removes its only stored data (the per-site settings).

## Changes

This document describes the current behavior of the project. Any future change
that could affect privacy will be reflected here and in the release notes.
