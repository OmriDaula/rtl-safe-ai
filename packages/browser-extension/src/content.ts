/**
 * Content script.
 *
 * Planned behaviour:
 * - Observe chat message nodes via a MutationObserver.
 * - For each message, use @rtl-safe-ai/core to detect direction and apply
 *   safe rendering hints (the `dir` attribute + CSS `unicode-bidi`).
 *
 * Hard constraints:
 * - NEVER use innerHTML / insertAdjacentHTML. Only attributes & inline styles.
 * - NEVER read inputs, tokens, cookies, or other credentials.
 * - NEVER send data anywhere. All processing is in-page and local.
 */

import { detect, toRenderHint } from '@rtl-safe-ai/core';

/**
 * Apply direction hints to a single element based on its text content.
 * Placeholder: wiring only, detection logic lives in core.
 */
function applyDirection(el: HTMLElement): void {
  const text = el.textContent ?? '';
  const { direction } = detect(text);
  const hint = toRenderHint(direction);
  el.setAttribute('dir', hint.direction);
  el.style.unicodeBidi = hint.unicodeBidi;
  el.style.textAlign = hint.textAlign;
}

function init(): void {
  // Placeholder: real implementation will select chat message containers and
  // observe DOM mutations. Intentionally a no-op for now.
  void applyDirection;
}

init();

export {};
