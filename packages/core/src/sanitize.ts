import { INVISIBLE_CONTROLS, UNSAFE_BIDI_CONTROLS } from './constants.js';

/**
 * Text-level safety helpers.
 *
 * IMPORTANT: This module operates on plain strings only. It does not parse
 * HTML, build DOM, or execute anything. Consumers must insert returned strings
 * using safe APIs (e.g. `textContent`), never `innerHTML`.
 */

const INVISIBLE_CLASS = `[${INVISIBLE_CONTROLS.join('')}]`;
const UNSAFE_BIDI_CLASS = `[${UNSAFE_BIDI_CONTROLS.join('')}]`;
/** Unicode "tag" characters — invisible and abusable for hidden instructions. */
const TAG_CHARS_CLASS = '[\\u{E0000}-\\u{E007F}]';

const INVISIBLE_RE = new RegExp(INVISIBLE_CLASS, 'g');
const TAG_CHARS_RE = new RegExp(TAG_CHARS_CLASS, 'gu');
const UNSAFE_PROBE = new RegExp(
  `${UNSAFE_BIDI_CLASS}|${INVISIBLE_CLASS}|${TAG_CHARS_CLASS}`,
  'u',
);

/**
 * Remove invisible / zero-width characters and Unicode tag characters that
 * carry no legitimate meaning and can be used for spoofing or hidden content.
 *
 * Legitimate joiners (ZWNJ/ZWJ), directional marks (LRM/RLM/ALM) and isolates
 * are preserved — see {@link INVISIBLE_CONTROLS}.
 */
export function neutralizeInvisible(text: string): string {
  return text.replace(INVISIBLE_RE, '').replace(TAG_CHARS_RE, '');
}

/**
 * Report whether a string is safe to render as plain text: it must contain no
 * unsafe bidi overrides, no disallowed invisible characters, and no tag chars.
 */
export function isPlainTextSafe(text: string): boolean {
  return !UNSAFE_PROBE.test(text);
}
