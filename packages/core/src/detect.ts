import type { DetectOptions, DetectionResult } from './types.js';

/**
 * Detect the dominant script and base direction of a string.
 *
 * NOTE: This is a placeholder. The real implementation will scan grapheme
 * clusters against {@link SCRIPT_RANGES}, compute an RTL ratio from strongly
 * directional characters, and resolve a base direction.
 *
 * Guarantees that will hold for the real implementation:
 * - Pure & synchronous (no I/O, no network, no persistence).
 * - Deterministic for a given input + options.
 *
 * @param _text  Text to analyse.
 * @param _options Optional tuning parameters.
 */
export function detect(_text: string, _options: DetectOptions = {}): DetectionResult {
  // Placeholder result — intentionally not implemented yet.
  return {
    direction: 'auto',
    script: 'unknown',
    rtlRatio: 0,
    isMixed: false,
    confidence: 0,
  };
}

/**
 * Convenience predicate built on top of {@link detect}.
 * Placeholder: always returns `false` until detection is implemented.
 */
export function isRtl(_text: string, _options: DetectOptions = {}): boolean {
  return false;
}
