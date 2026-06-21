import { describe, expect, it } from 'vitest';
import { detect, detectTextDirection, hasRTL, isRTLCodePoint } from '@rtl-safe-ai/core';

/** Section 6: Unicode and script coverage. */

const fromCps = (...cps: number[]): string => String.fromCodePoint(...cps);

describe('strong RTL code point classification', () => {
  it('classifies core RTL letters as RTL', () => {
    expect(isRTLCodePoint(0x05d0)).toBe(true); // Hebrew alef
    expect(isRTLCodePoint(0x0627)).toBe(true); // Arabic alef
    expect(isRTLCodePoint(0x0712)).toBe(true); // Syriac
    expect(isRTLCodePoint(0x0782)).toBe(true); // Thaana
    expect(isRTLCodePoint(0x07ca)).toBe(true); // NKo
    expect(isRTLCodePoint(0x0800)).toBe(true); // Samaritan
    expect(isRTLCodePoint(0x0840)).toBe(true); // Mandaic
    expect(isRTLCodePoint(0x1e900)).toBe(true); // Adlam (astral)
  });

  it('classifies Hebrew and Arabic presentation forms as RTL', () => {
    expect(isRTLCodePoint(0xfb21)).toBe(true); // Hebrew presentation form
    expect(isRTLCodePoint(0xfb52)).toBe(true); // Arabic Presentation Forms-A
    expect(isRTLCodePoint(0xfefb)).toBe(true); // Arabic Presentation Forms-B (lam-alef)
  });

  it('does not classify LTR letters, spaces, or symbols as RTL', () => {
    expect(isRTLCodePoint(0x0041)).toBe(false); // A
    expect(isRTLCodePoint(0x007a)).toBe(false); // z
    expect(isRTLCodePoint(0x0020)).toBe(false); // space
    expect(isRTLCodePoint(0x0024)).toBe(false); // $
  });

  it('does not classify Arabic-Indic / Persian digits as strong RTL', () => {
    expect(isRTLCodePoint(0x0660)).toBe(false); // Arabic-Indic 0
    expect(isRTLCodePoint(0x0669)).toBe(false); // Arabic-Indic 9
    expect(isRTLCodePoint(0x06f0)).toBe(false); // Persian 0
    expect(hasRTL(fromCps(0x0660, 0x0661, 0x0662))).toBe(false);
  });
});

describe('script samples resolve to rtl', () => {
  it('detects Syriac, Thaana, NKo and Adlam samples as rtl', () => {
    expect(detectTextDirection(fromCps(0x0712, 0x0713, 0x0714))).toBe('rtl'); // Syriac
    expect(detectTextDirection(fromCps(0x0780, 0x0781, 0x0782))).toBe('rtl'); // Thaana
    expect(detectTextDirection(fromCps(0x07ca, 0x07cb, 0x07cc))).toBe('rtl'); // NKo
    expect(detectTextDirection(fromCps(0x1e900, 0x1e901, 0x1e902))).toBe('rtl'); // Adlam
  });

  it('counts an astral RTL code point as a single strong character', () => {
    const result = detect(fromCps(0x1e900));
    expect(result.direction).toBe('rtl');
    expect(result.rtlRatio).toBe(1);
  });

  it('reports best-guess scripts', () => {
    expect(detect('שלום').script).toBe('hebrew');
    expect(detect('مرحبا').script).toBe('arabic');
    expect(detect('این فارسی است').script).toBe('persian');
    expect(detect('یہ اردو ہے').script).toBe('urdu');
    expect(detect('hello').script).toBe('latin');
    expect(detect(fromCps(0x0660, 0x0661)).script).toBe('unknown');
  });
});

describe('digits and combining marks do not break detection', () => {
  it('treats Arabic digits alone as neutral but Arabic letters + digits as rtl', () => {
    expect(detectTextDirection(fromCps(0x0660, 0x0661, 0x0662))).toBe('ltr'); // digits only
    expect(detect(fromCps(0x0660, 0x0661)).rtlRatio).toBe(0);
    expect(detectTextDirection('مرحبا ١٢٣')).toBe('rtl'); // letters dominate
  });

  it('handles Hebrew text with niqqud (combining marks) as rtl', () => {
    const withNiqqud = fromCps(0x05d0, 0x05b7, 0x05dc, 0x05b8); // אַלָ-style
    expect(detectTextDirection(withNiqqud)).toBe('rtl');
  });

  it('does not break on Latin text with combining diacritics', () => {
    expect(() => detectTextDirection('cafe\u0301 menu')).not.toThrow();
    expect(detectTextDirection('cafe\u0301 menu')).toBe('ltr');
  });

  it('does not break on combining-mark-only or empty input', () => {
    expect(() => detectTextDirection('\u0301\u0300')).not.toThrow();
    expect(detectTextDirection('\u0301\u0300')).toBe('ltr');
  });
});
