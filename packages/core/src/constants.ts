/**
 * Unicode constants used across the engine.
 *
 * Keeping these centralised makes the security review surface small: every
 * control character the engine can emit, and every range it classifies, is
 * enumerated here.
 */

/** Unicode bidi isolate / mark control characters that the engine may emit. */
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
  /** Arabic Letter Mark. */
  ALM: '\u061C',
} as const;

/**
 * Bidi embedding/override controls commonly abused for spoofing (the
 * "Trojan Source" class of attacks). These have no legitimate use in plain
 * chat text and are removed by {@link stripUnsafeControls}.
 */
export const UNSAFE_BIDI_CONTROLS: readonly string[] = [
  '\u202A', // LRE — Left-to-Right Embedding
  '\u202B', // RLE — Right-to-Left Embedding
  '\u202C', // PDF — Pop Directional Formatting
  '\u202D', // LRO — Left-to-Right Override
  '\u202E', // RLO — Right-to-Left Override
];

/**
 * Invisible / zero-width characters that carry no legitimate meaning in chat
 * text and are frequently used to hide or spoof content. Removed by
 * {@link neutralizeInvisible}.
 *
 * Note: ZWNJ (U+200C) and ZWJ (U+200D) are intentionally NOT listed — they are
 * required for correct rendering of Persian, Arabic and several Indic scripts.
 * Directional marks (LRM/RLM/ALM) and isolates are likewise preserved.
 */
export const INVISIBLE_CONTROLS: readonly string[] = [
  '\u00AD', // Soft hyphen
  '\u180E', // Mongolian vowel separator
  '\u200B', // Zero-width space
  '\u2060', // Word joiner
  '\u2061', // Function application
  '\u2062', // Invisible times
  '\u2063', // Invisible separator
  '\u2064', // Invisible plus
  '\uFEFF', // Zero-width no-break space / BOM
];

/**
 * Strong RTL Unicode ranges grouped by script. Used both for membership tests
 * and for best-guess script identification.
 *
 * Weak Arabic-Indic digit subranges are excluded from membership in
 * `detect.ts` so they are treated as numbers, not strong letters.
 */
export const RTL_SCRIPT_RANGES: Readonly<
  Record<string, ReadonlyArray<readonly [number, number]>>
> = {
  hebrew: [
    [0x0590, 0x05ff], // Hebrew
    [0xfb1d, 0xfb4f], // Hebrew presentation forms
  ],
  arabic: [
    [0x0600, 0x06ff], // Arabic
    [0x0750, 0x077f], // Arabic Supplement
    [0x0870, 0x089f], // Arabic Extended-B
    [0x08a0, 0x08ff], // Arabic Extended-A
    [0xfb50, 0xfdff], // Arabic Presentation Forms-A
    [0xfe70, 0xfeff], // Arabic Presentation Forms-B
    [0x10ec0, 0x10eff], // Arabic Extended-C
    [0x1ee00, 0x1eeff], // Arabic Mathematical Alphabetic Symbols
  ],
  syriac: [
    [0x0700, 0x074f], // Syriac
    [0x0860, 0x086f], // Syriac Supplement
  ],
  thaana: [[0x0780, 0x07bf]],
  nko: [[0x07c0, 0x07ff]],
  samaritan: [[0x0800, 0x083f]],
  mandaic: [[0x0840, 0x085f]],
  adlam: [[0x1e900, 0x1e95f]],
  rohingya: [[0x10d00, 0x10d3f]], // Hanifi Rohingya
};

/**
 * Arabic-Indic and extended digit code points. These are weak (bidi class AN),
 * so they are excluded from "strong RTL" membership.
 */
export const ARABIC_DIGIT_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0660, 0x0669], // Arabic-Indic digits
  [0x066b, 0x066c], // Arabic decimal / thousands separators
  [0x06f0, 0x06f9], // Extended Arabic-Indic (Persian) digits
];

/**
 * Letters that distinguish Persian/Urdu from generic Arabic. Used only to
 * refine the reported script label, never the direction.
 */
export const PERSIAN_MARKER_LETTERS = 'پچژگکیۀهٔ';
export const URDU_MARKER_LETTERS = 'ٹڈڑںےہھ';
