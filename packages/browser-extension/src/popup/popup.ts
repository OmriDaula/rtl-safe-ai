/**
 * Popup controller.
 *
 * Uses `activeTab` to read the current tab's hostname and `chrome.storage.local`
 * to read/write the per-site enable choice. No network, no analytics, no
 * credential or page-content access.
 */

import { VERSION } from '@rtl-safe-ai/core';
import { isEnabledFor, loadSettings, setSiteEnabled } from '../settings.js';

/** Hostnames where the content script is registered (see manifest.json). */
const SUPPORTED_HOSTS = ['chatgpt.com', 'chat.openai.com', 'claude.ai', 'gemini.google.com'];

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

function hostFromUrl(url: string | undefined): string {
  if (!url) return '';
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function isSupported(host: string): boolean {
  return SUPPORTED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

async function activeHost(): Promise<string> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return hostFromUrl(tab?.url);
}

function render(host: string, enabled: boolean): void {
  const hostEl = byId('site-host');
  const tagEl = byId('site-tag');
  const toggle = byId<HTMLButtonElement>('toggle');
  const status = byId('status');

  if (hostEl) hostEl.textContent = host || 'this page';
  if (tagEl) {
    const supported = isSupported(host);
    tagEl.textContent = supported ? 'Supported site' : 'Other site';
    tagEl.classList.toggle('site__tag--supported', supported);
  }
  if (toggle) {
    toggle.textContent = enabled ? 'Disable on this site' : 'Enable on this site';
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.classList.toggle('toggle--off', !enabled);
  }
  if (status) {
    status.textContent = enabled
      ? `RTL Safe AI is active on ${host || 'this site'}.`
      : `Disabled on ${host || 'this site'}.`;
  }
}

async function init(): Promise<void> {
  const versionEl = byId('version');
  if (versionEl) versionEl.textContent = `v${VERSION}`;

  const host = await activeHost();
  let enabled = isEnabledFor(await loadSettings(), host);
  render(host, enabled);

  const toggle = byId<HTMLButtonElement>('toggle');
  if (!host) {
    if (toggle) toggle.disabled = true;
    const status = byId('status');
    if (status) status.textContent = 'Not available on this page.';
    return;
  }

  toggle?.addEventListener('click', () => {
    enabled = !enabled;
    render(host, enabled);
    void setSiteEnabled(host, enabled);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  void init();
});
