import type { WrapOptions } from './types.js';

/**
 * Wrap text in Unicode bidi isolates so it renders correctly when embedded in
 * content of the opposite direction (the core fix for "leaking" directionality
 * in chat bubbles).
 *
 * Placeholder: returns the input unchanged. The real implementation will wrap
 * with FSI…PDI (or LRI/RLI when direction is forced) per {@link WrapOptions}.
 *
 * This function never executes code and never touches the DOM — it only
 * transforms a string.
 *
 * @param text Text to isolate.
 * @param _options Wrapping strategy.
 */
export function wrapIsolated(text: string, _options: WrapOptions = {}): string {
  return text;
}

/**
 * Strip dangerous bidi override/embedding controls (the "Trojan Source" class)
 * while preserving legitimate marks.
 *
 * Placeholder: returns the input unchanged. The real implementation will remove
 * characters listed in {@link UNSAFE_BIDI_CONTROLS}.
 */
export function stripUnsafeControls(text: string): string {
  return text;
}
