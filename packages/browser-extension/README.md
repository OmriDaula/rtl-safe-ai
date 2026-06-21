# @rtl-safe-ai/browser-extension

Manifest V3 browser extension that applies local-only RTL fixes to AI chat
interfaces.

> Status: **scaffold** — wiring and config only; the fixing logic is not yet
> implemented.

## What it does NOT do

This extension is intentionally constrained. It does **not**:

- patch desktop apps or modify system files;
- require admin permissions;
- bypass app integrity checks or install certificates;
- access cookies, tokens, form inputs, or any credentials;
- send network requests (`connect-src 'none'` in the CSP);
- collect telemetry or analytics.

## Permissions

| Permission | Why |
| --- | --- |
| `storage` | Save the on/off preference locally (`chrome.storage.local`). |

`host_permissions` is empty. Content scripts are scoped to a small allowlist of
AI chat domains in `manifest.json`.

## Develop

```bash
npm run build --workspace @rtl-safe-ai/browser-extension
```

Then load the `dist/` folder via `chrome://extensions` → **Developer mode** →
**Load unpacked**.

## License

MIT
