# @rtl-safe-ai/browser-extension

A Manifest V3 browser extension that applies **RTL Safe AI** to AI chat
interfaces and editable text fields — entirely locally, with a minimal and
transparent permission model.

> Status: **MVP**.

## What it does

- **Direction detection** on AI chat messages: sets the correct `dir` and CSS
  `unicode-bidi` so Hebrew, Arabic, Persian and Urdu render properly, including
  mixed Hebrew/Arabic + English text.
- **Editable fields**: detects direction in `textarea`, `input[type=text|search]`
  and `contenteditable` elements as you type (using `unicode-bidi: plaintext`).
- **Code & math stay LTR**: `pre`, `code`, `kbd`, `samp`, KaTeX and `math`
  elements are forced left-to-right; blocks that are entirely code/math stay LTR.
- **Safe text sanitization**: when read-only AI output contains dangerous bidi
  overrides (Trojan-Source) or hidden zero-width / tag characters, those text
  nodes are neutralized via the core sanitizers. User input is never rewritten.
- **Per-site enable/disable** from the popup, persisted locally.

All detection and sanitization come from [`@rtl-safe-ai/core`](../core), which is
pure, local, and dependency-free.

## Permissions and why

| Permission | Why it is needed |
| --- | --- |
| `activeTab` | Lets the popup read **only the current tab's hostname** (when you click the extension) to show status and store the per-site on/off choice. No broad tab access. |
| `storage` | Persists **only** the per-site enable/disable map in `chrome.storage.local`. Never any page text or user content. |
| content script `matches` | A narrow allowlist of AI chat domains (`chatgpt.com`, `chat.openai.com`, `claude.ai`, `gemini.google.com`). This is the only host access; `host_permissions` is empty and `<all_urls>` is **not** used. |

## Privacy guarantees

- No network requests of any kind (`connect-src 'none'` in the extension CSP).
- No telemetry, no analytics, no remote configuration, no remote scripts.
- No cookie access; no website `localStorage` / `sessionStorage` access.
- No credential access; sensitive inputs (password, email, etc.) are ignored.
- All text processing happens locally in the browser.
- User text is never persisted — only the per-site setting is stored.

## How it works (safety model)

- Uses only safe DOM APIs: `textContent`, `setAttribute`, `classList`, the
  `style` property, `createElement`, `appendChild`.
- Never uses `innerHTML` / `outerHTML` / `insertAdjacentHTML` / `document.write`.
- Non-destructive: direction changes are attribute/inline-style only and are
  **fully reverted** when you disable a site (originals are remembered).
- A throttled `MutationObserver` handles streaming AI responses; a `WeakSet`
  plus a `data-rtlsafe-len` attribute prevents reprocessing unchanged nodes.
- Skips `script` / `style` / `noscript` / `template` and hidden elements, and
  avoids replacing nodes so React/Vue/Svelte apps keep working.

## Build

From the repository root (npm workspaces):

```bash
npm install
npm run build --workspace @rtl-safe-ai/browser-extension
```

The build produces `packages/browser-extension/dist/` containing
`manifest.json`, `background.js`, `content.js`, `popup.html`, `popup.js`,
`popup.css` and `icons/`.

> The content script is bundled as a self-contained IIFE because MV3 content
> scripts are classic scripts and cannot use ES `import`. The service worker and
> popup are ES modules.

## Load unpacked in Chrome / Edge

1. Run the build (above).
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `dist/` folder.
5. Open a supported AI chat site and use the toolbar icon to toggle per-site.

## Known limitations

- Message-container detection uses best-effort selectors; some sites or future
  redesigns may not be fully covered. Editable-field detection is site-agnostic.
- Sanitization runs on read-only AI output only; during streaming it may be
  re-applied as new text arrives.
- Disabling a site reverts the extension's own changes; a page reload is the
  cleanest way to guarantee a pristine DOM.
- No icon binaries are committed in this scaffold (see `icons/README.md`).

## Security principles

- No telemetry · no analytics · no network requests.
- No credential access · no cookie / storage snooping.
- No DOM/HTML string injection · no `eval` / `Function`.
- Local-only processing · minimal permissions · open-source and auditable.

## License

MIT
