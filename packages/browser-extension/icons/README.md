# Icons

No binary icon assets are committed yet. The extension therefore does **not**
declare an `icons` key in `manifest.json`, so it loads cleanly (Chrome/Edge show
a generic icon) without "could not load icon" warnings.

Before publishing to a web store, add the following PNGs here and re-add the
`icons` block to `manifest.json`:

- `icon-16.png`
- `icon-48.png`
- `icon-128.png`

```jsonc
// manifest.json
"icons": {
  "16": "icons/icon-16.png",
  "48": "icons/icon-48.png",
  "128": "icons/icon-128.png"
}
```

The build copies this `icons/` directory into `dist/` automatically when assets
are present.
