/**
 * Content script: applies RTL Safe AI to AI chat pages and editable fields.
 *
 * Hard safety rules (also enforced by lint):
 * - Only safe DOM APIs: textContent, setAttribute, classList, style, createElement.
 * - NEVER innerHTML / outerHTML / insertAdjacentHTML / document.write.
 * - NEVER network, cookies, localStorage, or credential access.
 * - Non-destructive: we add direction attributes/inline styles and can fully
 *   revert them. We rewrite text only to strip dangerous bidi/hidden controls
 *   from read-only AI output (never from user inputs).
 */

import {
  detect,
  isPlainTextSafe,
  neutralizeInvisible,
  segmentText,
  stripUnsafeControls,
  toRenderHint,
  type Direction,
} from '@rtl-safe-ai/core';
import { isEnabledFor, loadSettings, STORAGE_KEY } from './settings.js';

const SCAN_DELAY_MS = 200;

/** Elements we never inspect or modify. */
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'HEAD', 'TITLE']);

/** Best-effort selectors for AI chat message containers on supported sites. */
const MESSAGE_SELECTORS = [
  '[data-message-author-role]',
  '.markdown',
  '.prose',
  'message-content',
  '.model-response-text',
];

/** Descendants that must always render left-to-right. */
const FORCE_LTR_SELECTOR = 'pre, code, kbd, samp, .katex, .katex-display, [data-katex], math';

/** Editable input types we may annotate (everything else is left untouched). */
const ALLOWED_INPUT_TYPES = new Set(['text', 'search']);

const seen = new WeakSet<HTMLElement>();
let active = false;
let observer: MutationObserver | null = null;
let scanScheduled = false;

function isVisible(el: HTMLElement): boolean {
  if (el.hidden) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
}

function shouldSkip(el: HTMLElement): boolean {
  return SKIP_TAGS.has(el.tagName) || !isVisible(el);
}

function isEditableTarget(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  if (el instanceof HTMLTextAreaElement) return !el.readOnly && !el.disabled;
  if (el instanceof HTMLInputElement) {
    return ALLOWED_INPUT_TYPES.has(el.type) && !el.readOnly && !el.disabled;
  }
  return false;
}

function editableText(el: HTMLElement): string {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return el.value;
  return el.textContent ?? '';
}

/** Apply a direction non-destructively, remembering the original for revert. */
function applyDir(el: HTMLElement, direction: Direction, unicodeBidi: string, textAlign?: string): void {
  if (!el.hasAttribute('data-rtlsafe-prev-dir')) {
    el.setAttribute('data-rtlsafe-prev-dir', el.getAttribute('dir') ?? '');
  }
  el.setAttribute('dir', direction);
  el.style.unicodeBidi = unicodeBidi;
  if (textAlign !== undefined) el.style.textAlign = textAlign;
  el.setAttribute('data-rtlsafe-applied', '1');
}

/** Strip dangerous bidi/hidden controls from read-only text nodes only. */
function sanitizeUnsafeText(root: HTMLElement): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets: Text[] = [];
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || SKIP_TAGS.has(parent.tagName) || parent.isContentEditable) continue;
    const data = node.nodeValue ?? '';
    if (data !== '' && !isPlainTextSafe(data)) targets.push(node as Text);
  }
  for (const node of targets) {
    node.textContent = neutralizeInvisible(stripUnsafeControls(node.nodeValue ?? ''));
  }
}

function processMessage(el: HTMLElement): void {
  if (shouldSkip(el)) return;
  const text = el.textContent ?? '';
  if (text.trim().length === 0) return;

  const len = String(text.length);
  if (seen.has(el) && el.getAttribute('data-rtlsafe-len') === len) return;
  seen.add(el);
  el.setAttribute('data-rtlsafe-len', len);

  // If every meaningful segment is code/math, keep the whole block LTR.
  const segments = segmentText(text).filter((s) => s.text.trim() !== '');
  const onlyNonText = segments.length > 0 && segments.every((s) => s.kind !== 'text');
  const direction: Direction = onlyNonText ? 'ltr' : detect(text).direction;
  const hint = toRenderHint(direction);

  applyDir(el, hint.direction, hint.unicodeBidi, hint.textAlign);

  el.querySelectorAll(FORCE_LTR_SELECTOR).forEach((d) => {
    if (d instanceof HTMLElement) applyDir(d, 'ltr', 'isolate');
  });

  if (!isPlainTextSafe(text)) {
    el.setAttribute('data-rtlsafe-unsafe', '1');
    sanitizeUnsafeText(el);
  }
}

function processEditable(el: HTMLElement): void {
  if (shouldSkip(el)) return;
  const text = editableText(el);
  if (text.trim().length === 0) return;

  const len = String(text.length);
  if (el.getAttribute('data-rtlsafe-len') === len) return;
  el.setAttribute('data-rtlsafe-len', len);

  // `plaintext` lets the browser pick direction per paragraph as the user types.
  applyDir(el, detect(text).direction, 'plaintext');
}

function scan(): void {
  if (!active) return;
  for (const selector of MESSAGE_SELECTORS) {
    document.querySelectorAll(selector).forEach((el) => {
      if (el instanceof HTMLElement) processMessage(el);
    });
  }
  document.querySelectorAll('textarea, input, [contenteditable]').forEach((el) => {
    if (isEditableTarget(el)) processEditable(el);
  });
}

function scheduleScan(): void {
  if (scanScheduled) return;
  scanScheduled = true;
  setTimeout(() => {
    scanScheduled = false;
    scan();
  }, SCAN_DELAY_MS);
}

function onInput(event: Event): void {
  if (!active) return;
  const target = event.target;
  if (target instanceof Element && isEditableTarget(target)) processEditable(target);
}

/** Undo every change this script made, restoring original direction. */
function revertAll(): void {
  document.querySelectorAll('[data-rtlsafe-applied]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const prev = node.getAttribute('data-rtlsafe-prev-dir');
    if (prev) node.setAttribute('dir', prev);
    else node.removeAttribute('dir');
    node.style.removeProperty('unicode-bidi');
    node.style.removeProperty('text-align');
    node.removeAttribute('data-rtlsafe-applied');
    node.removeAttribute('data-rtlsafe-prev-dir');
    node.removeAttribute('data-rtlsafe-len');
    node.removeAttribute('data-rtlsafe-unsafe');
  });
}

function start(): void {
  if (active) return;
  active = true;
  scan();
  document.addEventListener('input', onInput, true);
  observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

function stop(): void {
  if (!active) return;
  active = false;
  document.removeEventListener('input', onInput, true);
  observer?.disconnect();
  observer = null;
  revertAll();
}

function init(): void {
  const host = location.hostname;

  void loadSettings().then((settings) => {
    if (isEnabledFor(settings, host)) start();
  });

  // React live to popup toggles without a page reload.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || changes[STORAGE_KEY] === undefined) return;
    void loadSettings().then((settings) => {
      const enabled = isEnabledFor(settings, host);
      if (enabled && !active) start();
      else if (!enabled && active) stop();
    });
  });
}

init();
