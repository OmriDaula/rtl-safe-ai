import type { Direction, RenderHint } from './types.js';

/**
 * Map a resolved {@link Direction} to safe, framework-agnostic render hints.
 *
 * Placeholder: returns conservative defaults. The real implementation will
 * choose `isolate` vs `plaintext` based on whether the direction was forced
 * or auto-detected, and pick alignment accordingly.
 *
 * @param _direction Resolved base direction.
 */
export function toRenderHint(_direction: Direction): RenderHint {
  return {
    direction: 'auto',
    unicodeBidi: 'plaintext',
    textAlign: 'start',
  };
}

/**
 * Resolve `auto` against a parent/base direction.
 * Placeholder: returns the base direction unchanged.
 */
export function resolveAuto(_direction: Direction, base: Direction): Direction {
  return base;
}
