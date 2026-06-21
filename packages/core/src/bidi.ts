import { BIDI_CONTROLS, UNSAFE_BIDI_CONTROLS } from './constants.js';
import type { WrapOptions } from './types.js';

const UNSAFE_CONTROL_RE = new RegExp(`[${UNSAFE_BIDI_CONTROLS.join('')}]`, 'g');

/**
 * Wrap text in Unicode bidi isolates so it renders correctly when embedded in
 * content of the opposite direction.
 *
 * - `direction: 'rtl' | 'ltr'` → forces RLI/LRI … PDI.
 * - otherwise → First-Strong Isolate (FSI … PDI), letting the renderer decide.
 * - `isolation: 'none'` → returns the input unchanged.
 *
 * This only transforms a string; it never touches the DOM or executes code.
 */
export function wrapIsolated(text: string, options: WrapOptions = {}): string {
  if (options.isolation === 'none') return text;

  const open =
    options.direction === 'rtl'
      ? BIDI_CONTROLS.RLI
      : options.direction === 'ltr'
        ? BIDI_CONTROLS.LRI
        : BIDI_CONTROLS.FSI;

  return open + text + BIDI_CONTROLS.PDI;
}

/**
 * Remove dangerous bidi embedding/override controls (the "Trojan Source" class:
 * LRE/RLE/PDF/LRO/RLO) while preserving legitimate marks and isolates.
 */
export function stripUnsafeControls(text: string): string {
  return text.replace(UNSAFE_CONTROL_RE, '');
}
