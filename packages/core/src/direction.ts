import type { Direction, RenderHint } from './types.js';

/**
 * Map a resolved {@link Direction} to safe, framework-agnostic render hints.
 *
 * - `rtl`/`ltr` → CSS `unicode-bidi: isolate` so the run cannot leak its
 *   direction into surrounding UI, aligned to the matching edge.
 * - `auto` → `plaintext`, letting the renderer pick per first-strong, aligned
 *   to the logical `start`.
 */
export function toRenderHint(direction: Direction): RenderHint {
  switch (direction) {
    case 'rtl':
      return { direction: 'rtl', unicodeBidi: 'isolate', textAlign: 'right' };
    case 'ltr':
      return { direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'left' };
    default:
      return { direction: 'auto', unicodeBidi: 'plaintext', textAlign: 'start' };
  }
}

/**
 * Resolve `auto` against a base direction. A concrete direction is returned as
 * is; `auto` resolves to `base`, falling back to `ltr` when the base is also
 * `auto`.
 */
export function resolveAuto(direction: Direction, base: Direction): Direction {
  if (direction !== 'auto') return direction;
  return base === 'auto' ? 'ltr' : base;
}
