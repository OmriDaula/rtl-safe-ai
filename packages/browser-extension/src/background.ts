/**
 * MV3 service worker.
 *
 * Responsibilities (planned):
 * - Persist user preferences via `chrome.storage.local` (local-only).
 * - Relay enable/disable toggles to content scripts.
 *
 * This worker performs NO network requests and accesses NO credentials.
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  isolation: 'unicode' as const,
};

chrome.runtime.onInstalled.addListener(() => {
  // Seed defaults only if nothing is stored yet. Local storage only.
  chrome.storage.local.get('settings', (current) => {
    if (!current || current.settings === undefined) {
      void chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
    }
  });
});

export {};
