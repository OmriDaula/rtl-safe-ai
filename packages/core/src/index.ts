/**
 * @rtl-safe-ai/core
 *
 * Security-first, dependency-free, local-only RTL engine.
 *
 * Design constraints (enforced by lint + review):
 * - No network access, no telemetry, no analytics.
 * - No eval / dynamic code execution.
 * - No DOM access and no `innerHTML`; pure string/value transforms only.
 * - Pure, synchronous, deterministic functions.
 */

export type {
  Direction,
  StrongDirection,
  ScriptId,
  TextRange,
  SegmentKind,
  Segment,
  DetectionResult,
  TableDirectionResult,
  DetectOptions,
  WrapOptions,
  RenderHint,
} from './types.js';

export {
  BIDI_CONTROLS,
  UNSAFE_BIDI_CONTROLS,
  INVISIBLE_CONTROLS,
  RTL_SCRIPT_RANGES,
} from './constants.js';

export {
  detect,
  detectTextDirection,
  isRtl,
  isRTLCodePoint,
  hasRTL,
  firstStrongDirection,
  rtlRatio,
  stripLeadingLTRNoise,
} from './detect.js';
export { segmentText } from './segment.js';
export { detectLatexRanges } from './latex.js';
export { detectTableDirection } from './table.js';
export { toRenderHint, resolveAuto } from './direction.js';
export { wrapIsolated, stripUnsafeControls } from './bidi.js';
export { neutralizeInvisible, isPlainTextSafe } from './sanitize.js';

/** Library version, kept in sync with package.json at release time. */
export const VERSION = '0.1.0';
