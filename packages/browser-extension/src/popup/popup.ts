/**
 * Popup controller.
 *
 * Reads/writes the enable toggle via `chrome.storage.local` only.
 * No network, no analytics, no credential access.
 */

function setStatus(message: string): void {
  const status = document.getElementById('status');
  if (status) status.textContent = message;
}

function init(): void {
  const toggle = document.getElementById('toggle-enabled');
  if (!(toggle instanceof HTMLInputElement)) return;

  chrome.storage.local.get('settings', (current) => {
    const enabled = current?.settings?.enabled ?? true;
    toggle.checked = Boolean(enabled);
  });

  toggle.addEventListener('change', () => {
    chrome.storage.local.get('settings', (current) => {
      const settings = { ...(current?.settings ?? {}), enabled: toggle.checked };
      void chrome.storage.local.set({ settings });
      setStatus(toggle.checked ? 'Enabled' : 'Disabled');
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
