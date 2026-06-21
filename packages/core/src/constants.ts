/**
 * Unicode constants used across the engine.
 *
 * Keeping these centralised makes the security review surface small: every
 * control character the engine can emit is enumerated here.
 */

/** Unicode bidi isolate / embedding control characters. */
export const BIDI_CONTROLS = {
  /** First Strong Isolate. */
  FSI: '\u2068',
  /** Left-to-Right Isolate. */
  LRI: '\u2066',
  /** Right-to-Left Isolate. */
  RLI: '\u2067',
  /** Pop Directional Isolate. */
  PDI: '\u2069',
  /** Left-to-Right Mark. */
  LRM: '\u200E',
  /** Right-to-Left Mark. */
  RLM: '\u200F',
} as const;

/**
 * Bidi formatting/control characters that are commonly abused for spoofing
 * (e.g. the "Trojan Source" class of attacks). Used by the sanitizer.
 */
export const UNSAFE_BIDI_CONTROLS: readonly string[] = [
  '\u202A', // LRE
  '\u202B', // RLE
  '\u202C', // PDF
  '\u202D', // LRO
  '\u202E', // RLO
];

/**
 * Representative Unicode ranges per supported script. These are intentionally
 * coarse; precise classification is implemented in `detect.ts`.
 */
export const SCRIPT_RANGES: Readonly<Record<string, ReadonlyArray<readonly [number, number]>>> = {
  hebrew: [
    [0x0590, 0x05ff],
    [0xfb1d, 0xfb4f],
  ],
  arabic: [
    [0x0600, 0x06ff],
    [0x0750, 0x077f],
    [0x08a0, 0x08ff],
    [0xfb50, 0xfdff],
    [0xfe70, 0xfeff],
  ],
  syriac: [[0x0700, 0x074f]],
  thaana: [[0x0780, 0x07bf]],
};
