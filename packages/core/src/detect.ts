import {
  ARABIC_DIGIT_RANGES,
  PERSIAN_MARKER_LETTERS,
  RTL_SCRIPT_RANGES,
  URDU_MARKER_LETTERS,
} from './constants.js';
import type {
  DetectOptions,
  DetectionResult,
  Direction,
  ScriptId,
  StrongDirection,
} from './types.js';

/** Matches any Unicode letter; used to recognise strong LTR characters. */
const LETTER = /\p{L}/u;

function inRanges(cp: number, ranges: ReadonlyArray<readonly [number, number]>): boolean {
  for (const [lo, hi] of ranges) {
    if (cp >= lo && cp <= hi) return true;
  }
  return false;
}

/** True if a code point is a strong RTL letter (excludes weak Arabic digits). */
export function isRTLCodePoint(cp: number): boolean {
  if (inRanges(cp, ARABIC_DIGIT_RANGES)) return false;
  for (const ranges of Object.values(RTL_SCRIPT_RANGES)) {
    if (inRanges(cp, ranges)) return true;
  }
  return false;
}

/** True if a code point is a strong LTR letter (a letter that is not RTL). */
function isStrongLTRCodePoint(cp: number): boolean {
  if (isRTLCodePoint(cp)) return false;
  return LETTER.test(String.fromCodePoint(cp));
}

/** Iterate Unicode code points with their UTF-16 offsets. */
function* codePoints(text: string): Generator<{ cp: number; index: number; size: number }> {
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i);
    if (cp === undefined) break;
    const size = cp > 0xffff ? 2 : 1;
    yield { cp, index: i, size };
    i += size;
  }
}

/** True if the text contains at least one strong RTL character. */
export function hasRTL(text: string): boolean {
  for (const { cp } of codePoints(text)) {
    if (isRTLCodePoint(cp)) return true;
  }
  return false;
}

/** Direction of the first strongly-directional character, or `neutral`. */
export function firstStrongDirection(text: string): StrongDirection {
  for (const { cp } of codePoints(text)) {
    if (isRTLCodePoint(cp)) return 'rtl';
    if (isStrongLTRCodePoint(cp)) return 'ltr';
  }
  return 'neutral';
}

/** Count strong LTR and RTL characters in the text. */
function countStrong(text: string): { ltr: number; rtl: number } {
  let ltr = 0;
  let rtl = 0;
  for (const { cp } of codePoints(text)) {
    if (isRTLCodePoint(cp)) rtl++;
    else if (isStrongLTRCodePoint(cp)) ltr++;
  }
  return { ltr, rtl };
}

/** Share of strong characters that are RTL (0 when there are none). */
export function rtlRatio(text: string): number {
  const { ltr, rtl } = countStrong(text);
  const total = ltr + rtl;
  return total === 0 ? 0 : rtl / total;
}

const NOISE_PATTERNS: readonly RegExp[] = [
  /^(?:https?:\/\/|www\.)/i, // URLs
  /[/\\]/, // paths (contain a slash)
  /^@[\w.-]+\/[\w.-]+$/, // scoped package names
  /^[\w.-]+\.[a-z]{1,12}$/i, // filenames with an extension
  /^v?\d+(?:[.-]\d+)+/, // version numbers
  /^[+-]?\d[\d.,_]*$/, // plain numbers
  /^-{1,2}[a-z0-9]/i, // CLI flags
  /[_@]/, // identifiers with _ or @
  /[a-z][A-Z]/, // camelCase identifiers
  /[a-z]\d|\d[a-z]/i, // alphanumeric identifiers
  /[()[\]{}=;<>]/, // code punctuation
  /^[`'"]/, // quoted / backticked tokens
];

function containsRTLString(token: string): boolean {
  return hasRTL(token);
}

function isNoiseToken(token: string): boolean {
  return NOISE_PATTERNS.some((re) => re.test(token));
}

/** True for whitespace and neutral punctuation/symbols (not letters/digits). */
function isSkippable(cp: number): boolean {
  const ch = String.fromCodePoint(cp);
  if (/\s/u.test(ch)) return true;
  if (isRTLCodePoint(cp)) return false;
  return !/[\p{L}\p{N}]/u.test(ch);
}

/**
 * Drop a leading run of LTR "noise" — URLs, paths, filenames, version strings,
 * CLI flags and programming identifiers — so that {@link firstStrongDirection}
 * reflects the start of the natural-language sentence rather than an incidental
 * technical prefix.
 *
 * Plain alphabetic words (e.g. "the", "please") are NOT treated as noise: this
 * is what keeps an English sentence containing a single RTL word resolving to
 * LTR.
 */
export function stripLeadingLTRNoise(text: string): string {
  let i = 0;
  const n = text.length;

  while (i < n) {
    // Skip neutral separators (whitespace and non-letter punctuation).
    let j = i;
    while (j < n) {
      const cp = text.codePointAt(j);
      if (cp === undefined || !isSkippable(cp)) break;
      j += cp > 0xffff ? 2 : 1;
    }
    if (j >= n) return text.slice(j);

    // Read the next whitespace-delimited token.
    let k = j;
    while (k < n) {
      const ch = text[k];
      if (ch === undefined || /\s/.test(ch)) break;
      const cp = text.codePointAt(k);
      k += cp !== undefined && cp > 0xffff ? 2 : 1;
    }
    const token = text.slice(j, k);

    // An RTL or plain-language token marks the start of the real sentence.
    if (containsRTLString(token) || !isNoiseToken(token)) return text.slice(j);

    i = k; // token was noise — drop it and continue.
  }
  return text.slice(i);
}

/**
 * Resolve the base direction of a string.
 *
 * Strategy:
 * 1. No strong characters → `neutralDefault`.
 * 2. Only LTR or only RTL → that direction.
 * 3. Mixed → strip leading LTR noise; if the next strong character is RTL the
 *    sentence is RTL. Otherwise fall back to the RTL ratio vs `rtlThreshold`.
 */
export function detectTextDirection(text: string, options: DetectOptions = {}): Direction {
  const neutralDefault = options.neutralDefault ?? 'ltr';
  const threshold = options.rtlThreshold ?? 0.5;

  const { ltr, rtl } = countStrong(text);
  if (ltr + rtl === 0) return neutralDefault;
  if (rtl === 0) return 'ltr';
  if (ltr === 0) return 'rtl';

  if (firstStrongDirection(stripLeadingLTRNoise(text)) === 'rtl') return 'rtl';

  return rtl / (ltr + rtl) >= threshold ? 'rtl' : 'ltr';
}

/** Convenience predicate built on {@link detectTextDirection}. */
export function isRtl(text: string, options: DetectOptions = {}): boolean {
  return detectTextDirection(text, options) === 'rtl';
}

const SCRIPT_LABELS: Readonly<Record<string, ScriptId>> = {
  hebrew: 'hebrew',
  arabic: 'arabic',
  syriac: 'syriac',
  thaana: 'thaana',
  nko: 'nko',
  samaritan: 'samaritan',
  mandaic: 'mandaic',
  adlam: 'adlam',
  rohingya: 'rohingya',
};

/** Best-guess dominant script for a string. */
function detectScript(text: string): ScriptId {
  const counts = new Map<string, number>();
  let ltrLetters = 0;

  for (const { cp } of codePoints(text)) {
    if (inRanges(cp, ARABIC_DIGIT_RANGES)) continue;
    let matched = false;
    for (const [name, ranges] of Object.entries(RTL_SCRIPT_RANGES)) {
      if (inRanges(cp, ranges)) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
        matched = true;
        break;
      }
    }
    if (!matched && isStrongLTRCodePoint(cp)) ltrLetters++;
  }

  let topName = '';
  let topCount = 0;
  for (const [name, count] of counts) {
    if (count > topCount) {
      topName = name;
      topCount = count;
    }
  }

  if (topCount === 0) return ltrLetters > 0 ? 'latin' : 'unknown';

  // Refine Arabic into Persian/Urdu when marker letters are present.
  if (topName === 'arabic') {
    const persian = [...PERSIAN_MARKER_LETTERS].some((c) => text.includes(c));
    const urdu = [...URDU_MARKER_LETTERS].some((c) => text.includes(c));
    if (urdu) return 'urdu';
    if (persian) return 'persian';
  }

  return SCRIPT_LABELS[topName] ?? 'unknown';
}

/** Full analysis of a string: direction, script, ratio, mix and confidence. */
export function detect(text: string, options: DetectOptions = {}): DetectionResult {
  const { ltr, rtl } = countStrong(text);
  const total = ltr + rtl;
  const ratio = total === 0 ? 0 : rtl / total;
  const direction = detectTextDirection(text, options);
  const isMixed = ltr > 0 && rtl > 0;

  let confidence: number;
  if (total === 0) confidence = 0;
  else if (!isMixed) confidence = 1;
  else confidence = Math.min(1, 0.5 + Math.abs(ratio - 0.5));

  return {
    direction,
    script: detectScript(text),
    rtlRatio: ratio,
    isMixed,
    confidence,
  };
}
