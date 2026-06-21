/**
 * Extension settings, persisted in `chrome.storage.local` only.
 *
 * We store ONLY a per-site enable/disable map — never any user text or page
 * content. The default is "enabled" on the narrow allowlist of AI chat domains
 * the content script is registered for (see manifest.json); users can disable
 * any site from the popup.
 */

export const STORAGE_KEY = 'settings';
export const DEFAULT_ENABLED = true;

export interface ExtensionSettings {
  /** Per-host overrides. Absent host → {@link DEFAULT_ENABLED}. */
  readonly siteOverrides: Record<string, boolean>;
}

const EMPTY_SETTINGS: ExtensionSettings = { siteOverrides: {} };

/** Load settings, tolerating any previously-stored or malformed shape. */
export async function loadSettings(): Promise<ExtensionSettings> {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const value: unknown = stored[STORAGE_KEY];

  if (
    value !== null &&
    typeof value === 'object' &&
    'siteOverrides' in value &&
    typeof (value as { siteOverrides: unknown }).siteOverrides === 'object' &&
    (value as { siteOverrides: unknown }).siteOverrides !== null
  ) {
    const raw = (value as { siteOverrides: Record<string, unknown> }).siteOverrides;
    const siteOverrides: Record<string, boolean> = {};
    for (const [host, on] of Object.entries(raw)) {
      if (typeof on === 'boolean') siteOverrides[host] = on;
    }
    return { siteOverrides };
  }

  return EMPTY_SETTINGS;
}

/** Whether the extension should run on a given host. */
export function isEnabledFor(settings: ExtensionSettings, host: string): boolean {
  return settings.siteOverrides[host] ?? DEFAULT_ENABLED;
}

/** Persist the enable/disable choice for a single host. */
export async function setSiteEnabled(host: string, enabled: boolean): Promise<void> {
  const settings = await loadSettings();
  const siteOverrides: Record<string, boolean> = { ...settings.siteOverrides, [host]: enabled };
  await chrome.storage.local.set({ [STORAGE_KEY]: { siteOverrides } });
}
