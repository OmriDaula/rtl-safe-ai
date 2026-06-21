/**
 * Public type surface for @rtl-safe-ai/core.
 *
 * All processing in this package is local-only and synchronous. No type here
 * implies I/O, network access, or persistence.
 */

/** Base text direction. */
export type Direction = 'ltr' | 'rtl' | 'auto';

/**
 * Supported RTL scripts. `latin` is included as the common LTR fallback so the
 * detector can report a concrete script rather than only a direction.
 */
export type ScriptId =
  | 'hebrew'
  | 'arabic'
  | 'persian'
  | 'urdu'
  | 'yiddish'
  | 'syriac'
  | 'thaana'
  | 'latin'
  | 'unknown';

/** Result of analysing a single string. */
export interface DetectionResult {
  /** Resolved base direction for the text as a whole. */
  readonly direction: Direction;
  /** Best-guess dominant script. */
  readonly script: ScriptId;
  /** Share of strongly-directional characters that are RTL (0..1). */
  readonly rtlRatio: number;
  /** True when the text mixes strong LTR and RTL runs. */
  readonly isMixed: boolean;
  /** Confidence in the detection (0..1). */
  readonly confidence: number;
}

/** Options that tune detection without changing its local-only guarantees. */
export interface DetectOptions {
  /**
   * Direction to assume when the text contains no strongly-directional
   * characters (e.g. digits/punctuation only).
   */
  readonly neutralDefault?: Direction;
  /**
   * Minimum RTL ratio required to resolve to `rtl`. Defaults to a balanced
   * threshold tuned for chat-length messages.
   */
  readonly rtlThreshold?: number;
}

/** Options controlling how a string is wrapped for safe bidi rendering. */
export interface WrapOptions {
  /** Force a specific direction instead of auto-detecting. */
  readonly direction?: Direction;
  /**
   * Strategy for isolating the text from surrounding content.
   * - `unicode`: wrap with Unicode isolate control characters (FSI/PDI).
   * - `none`: do not add isolation characters.
   */
  readonly isolation?: 'unicode' | 'none';
}

/** A minimal description of how a DOM node should be rendered. */
export interface RenderHint {
  readonly direction: Direction;
  /** Suggested value for the CSS `unicode-bidi` property. */
  readonly unicodeBidi: 'isolate' | 'plaintext' | 'normal';
  /** Suggested `text-align` for the container. */
  readonly textAlign: 'start' | 'end' | 'left' | 'right';
}
