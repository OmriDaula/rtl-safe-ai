/**
 * MV3 service worker.
 *
 * Responsibilities:
 * - Seed default settings on install (local storage only).
 *
 * This worker performs NO network requests, reads NO page content, and accesses
 * NO cookies or credentials.
 */

import { STORAGE_KEY } from './settings.js';

chrome.runtime.onInstalled.addListener(() => {
  void (async () => {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    if (stored[STORAGE_KEY] === undefined) {
      await chrome.storage.local.set({ [STORAGE_KEY]: { siteOverrides: {} } });
    }
  })();
});

export {};
