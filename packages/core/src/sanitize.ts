/**
 * Text-level safety helpers.
 *
 * IMPORTANT: This module deliberately operates on plain strings only. It does
 * not parse HTML, build DOM, or execute anything. Consumers are responsible for
 * inserting the returned strings using safe APIs (e.g. `textContent`), never
 * `innerHTML`.
 */

/**
 * Remove invisible/zero-width and disallowed control characters that can be
 * used for spoofing, while keeping legitimate directional marks.
 *
 * Placeholder: returns the input unchanged.
 *
 * @param _text Untrusted text.
 */
export function neutralizeInvisible(_text: string): string {
  return _text;
}

/**
 * Validate that a string is safe to render as plain text in an RTL context.
 * Placeholder: always reports safe.
 */
export function isPlainTextSafe(_text: string): boolean {
  return true;
}
