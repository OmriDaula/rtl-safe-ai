/**
 * Public type surface for @rtl-safe-ai/core.
 *
 * All processing in this package is local-only and synchronous. No type here
 * implies I/O, network access, or persistence.
 */

/** Base text direction. */
export type Direction = 'ltr' | 'rtl' | 'auto';

/**
 * Result of a first-strong scan. `neutral` means no strongly-directional
 * character was found.
 */
export type StrongDirection = 'ltr' | 'rtl' | 'neutral';

/**
 * Supported scripts. `latin` is the common LTR fallback so the detector can
 * report a concrete script rather than only a direction.
 */
export type ScriptId =
  | 'hebrew'
  | 'yiddish'
  | 'arabic'
  | 'persian'
  | 'urdu'
  | 'syriac'
  | 'thaana'
  | 'nko'
  | 'samaritan'
  | 'mandaic'
  | 'adlam'
  | 'rohingya'
  | 'latin'
  | 'unknown';

/** A half-open `[start, end)` range of UTF-16 code unit offsets. */
export interface TextRange {
  readonly start: number;
  readonly end: number;
}

/** Kind of a segment produced by {@link segmentText}. */
export type SegmentKind = 'text' | 'math' | 'code';

/** A contiguous run of text with a resolved direction. */
export interface Segment {
  readonly kind: SegmentKind;
  readonly text: string;
  readonly direction: Direction;
  /** Offset of the segment in the original string (UTF-16 code units). */
  readonly start: number;
  /** Exclusive end offset in the original string. */
  readonly end: number;
}

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

/** Result of analysing a Markdown-style table. */
export interface TableDirectionResult {
  /** Resolved base direction for the table. */
  readonly direction: Direction;
  /** Number of cells that resolved to RTL. */
  readonly rtlCells: number;
  /** Number of cells that resolved to LTR. */
  readonly ltrCells: number;
  /** Number of cells with no strong direction. */
  readonly neutralCells: number;
  /** Confidence in the result (0..1). */
  readonly confidence: number;
}

/** Options that tune detection without changing its local-only guarantees. */
export interface DetectOptions {
  /**
   * Direction to assume when the text contains no strongly-directional
   * characters (e.g. digits/punctuation only). Defaults to `ltr`.
   */
  readonly neutralDefault?: Direction;
  /**
   * Minimum RTL ratio required to resolve to `rtl` for genuinely mixed text
   * whose first natural-language character is LTR. Defaults to `0.5`.
   */
  readonly rtlThreshold?: number;
}

/** Options controlling how a string is wrapped for safe bidi rendering. */
export interface WrapOptions {
  /** Force a specific direction instead of using a first-strong isolate. */
  readonly direction?: Direction;
  /**
   * Strategy for isolating the text from surrounding content.
   * - `unicode`: wrap with Unicode isolate control characters (FSI/LRI/RLI…PDI).
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
