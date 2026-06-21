/**
 * @rtl-safe-ai/core
 *
 * Security-first, dependency-free, local-only RTL engine.
 *
 * Design constraints (enforced by lint + review):
 * - No network access, no telemetry, no analytics.
 * - No eval / dynamic code execution.
 * - No DOM mutation via innerHTML; string transforms only.
 * - Pure, synchronous, deterministic functions.
 */

export type {
  Direction,
  ScriptId,
  DetectionResult,
  DetectOptions,
  WrapOptions,
  RenderHint,
} from './types.js';

export { BIDI_CONTROLS, UNSAFE_BIDI_CONTROLS, SCRIPT_RANGES } from './constants.js';

export { detect, isRtl } from './detect.js';
export { toRenderHint, resolveAuto } from './direction.js';
export { wrapIsolated, stripUnsafeControls } from './bidi.js';
export { neutralizeInvisible, isPlainTextSafe } from './sanitize.js';

/** Library version, kept in sync with package.json at release time. */
export const VERSION = '0.1.0';
