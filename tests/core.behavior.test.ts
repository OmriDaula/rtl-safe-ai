import { describe, expect, it } from 'vitest';
import {
  BIDI_CONTROLS,
  detect,
  detectLatexRanges,
  detectTableDirection,
  detectTextDirection,
  firstStrongDirection,
  hasRTL,
  isPlainTextSafe,
  isRtl,
  isRTLCodePoint,
  neutralizeInvisible,
  resolveAuto,
  segmentText,
  stripLeadingLTRNoise,
  stripUnsafeControls,
  toRenderHint,
  wrapIsolated,
} from '@rtl-safe-ai/core';

const { FSI, RLI, PDI } = BIDI_CONTROLS;

describe('direction detection', () => {
  it('detects pure RTL scripts as rtl', () => {
    expect(detectTextDirection('שלום עולם')).toBe('rtl');
    expect(detectTextDirection('مرحبا بالعالم')).toBe('rtl');
    expect(detectTextDirection('پارسی را دوست دارم')).toBe('rtl');
  });

  it('detects pure LTR text as ltr', () => {
    expect(detectTextDirection('Hello world')).toBe('ltr');
  });

  it('treats URLs, paths, commands and code as ltr', () => {
    expect(detectTextDirection('https://example.com/path/page')).toBe('ltr');
    expect(detectTextDirection('/usr/local/bin/node')).toBe('ltr');
    expect(detectTextDirection('npm install react')).toBe('ltr');
    expect(detectTextDirection('const greeting = "hello world";')).toBe('ltr');
  });

  it('resolves to rtl when a technical prefix precedes an RTL sentence', () => {
    expect(detectTextDirection('config.json הקובץ הזה חשוב מאוד לפרויקט')).toBe('rtl');
    expect(detectTextDirection('https://example.com/x הקישור הזה מצוין ושימושי')).toBe('rtl');
  });

  it('keeps a mostly-English sentence with one RTL word as ltr', () => {
    expect(detectTextDirection('Please read the שלום message carefully')).toBe('ltr');
  });

  it('keeps a mostly-RTL sentence with one English word as rtl', () => {
    expect(detectTextDirection('הטקסט הזה משתמש ב API חיצוני כלשהו')).toBe('rtl');
  });

  it('isRtl matches detectTextDirection', () => {
    expect(isRtl('עברית')).toBe(true);
    expect(isRtl('english')).toBe(false);
  });
});

describe('low-level primitives', () => {
  it('isRTLCodePoint classifies scripts', () => {
    expect(isRTLCodePoint('א'.codePointAt(0)!)).toBe(true); // Hebrew
    expect(isRTLCodePoint('ا'.codePointAt(0)!)).toBe(true); // Arabic
    expect(isRTLCodePoint('𞤀'.codePointAt(0)!)).toBe(true); // Adlam
    expect(isRTLCodePoint('A'.codePointAt(0)!)).toBe(false);
    expect(isRTLCodePoint('٤'.codePointAt(0)!)).toBe(false); // Arabic-Indic digit is weak
  });

  it('hasRTL detects any strong RTL character', () => {
    expect(hasRTL('abc שלום')).toBe(true);
    expect(hasRTL('abc 123')).toBe(false);
  });

  it('firstStrongDirection skips neutrals', () => {
    expect(firstStrongDirection('123 !@# שלום')).toBe('rtl');
    expect(firstStrongDirection('  abc שלום')).toBe('ltr');
    expect(firstStrongDirection('123 !@#')).toBe('neutral');
  });

  it('stripLeadingLTRNoise drops technical prefixes only', () => {
    expect(stripLeadingLTRNoise('config.json שלום')).toBe('שלום');
    expect(stripLeadingLTRNoise('Hello world שלום')).toBe('Hello world שלום');
  });
});

describe('latex / math detection', () => {
  it('detects display and delimiter math', () => {
    const display = detectLatexRanges('The equation $$x^2 + y^2 = z^2$$ is famous');
    expect(display).toHaveLength(1);
    const slice = 'The equation $$x^2 + y^2 = z^2$$ is famous'.slice(
      display[0]!.start,
      display[0]!.end,
    );
    expect(slice.startsWith('$$')).toBe(true);
    expect(slice.endsWith('$$')).toBe(true);

    expect(detectLatexRanges('Use \\[ a + b \\] here')).toHaveLength(1);
    expect(detectLatexRanges('Inline \\( a - b \\) works')).toHaveLength(1);
  });

  it('detects valid inline math', () => {
    expect(detectLatexRanges('Let $x$ be a variable')).toHaveLength(1);
  });

  it('does not treat currency as math', () => {
    expect(detectLatexRanges('It costs $5.99 today')).toHaveLength(0);
    expect(detectLatexRanges('You owe $5 and they owe $10 total')).toHaveLength(0);
  });
});

describe('table direction', () => {
  const hebrewTable = ['| שם | גיל |', '| --- | --- |', '| דוד | 30 |', '| שרה | 25 |'].join('\n');
  const englishTable = ['| Name | Age |', '| --- | --- |', '| Dave | 30 |'].join('\n');

  it('returns rtl for an RTL-majority table', () => {
    expect(detectTableDirection(hebrewTable).direction).toBe('rtl');
  });

  it('returns ltr for an LTR-majority table', () => {
    expect(detectTableDirection(englishTable).direction).toBe('ltr');
  });

  it('breaks ties using the first meaningful cell', () => {
    expect(detectTableDirection('| שם | Name |').direction).toBe('rtl');
    expect(detectTableDirection('| Name | שם |').direction).toBe('ltr');
  });
});

describe('segmentation', () => {
  it('isolates math as an ltr segment', () => {
    const segs = segmentText('hello $x$ world');
    const math = segs.find((s) => s.kind === 'math');
    expect(math?.direction).toBe('ltr');
    expect(math?.text).toBe('$x$');
  });

  it('isolates code and keeps surrounding RTL text', () => {
    const segs = segmentText('שלום `code` עולם');
    expect(segs.some((s) => s.kind === 'code')).toBe(true);
    expect(segs.some((s) => s.kind === 'text' && s.direction === 'rtl')).toBe(true);
  });
});

describe('bidi safety transforms', () => {
  it('wrapIsolated wraps with FSI…PDI by default', () => {
    expect(wrapIsolated('x')).toBe(`${FSI}x${PDI}`);
    expect(wrapIsolated('x', { direction: 'rtl' })).toBe(`${RLI}x${PDI}`);
    expect(wrapIsolated('x', { isolation: 'none' })).toBe('x');
  });

  it('stripUnsafeControls removes overrides but keeps isolates', () => {
    expect(stripUnsafeControls('a\u202Eb')).toBe('ab');
    expect(stripUnsafeControls(`a${BIDI_CONTROLS.RLI}b`)).toBe(`a${BIDI_CONTROLS.RLI}b`);
  });

  it('neutralizeInvisible removes zero-width and tag chars but keeps ZWNJ', () => {
    expect(neutralizeInvisible('a\u200Bb')).toBe('ab');
    expect(neutralizeInvisible('a\u{E0041}b')).toBe('ab');
    expect(neutralizeInvisible('a\u200Cb')).toBe('a\u200Cb');
  });

  it('isPlainTextSafe flags unsafe content', () => {
    expect(isPlainTextSafe('hello')).toBe(true);
    expect(isPlainTextSafe('a\u202Eb')).toBe(false);
    expect(isPlainTextSafe('a\u200Bb')).toBe(false);
  });
});

describe('render hints', () => {
  it('maps directions to safe CSS hints', () => {
    expect(toRenderHint('rtl')).toEqual({
      direction: 'rtl',
      unicodeBidi: 'isolate',
      textAlign: 'right',
    });
    expect(toRenderHint('auto').unicodeBidi).toBe('plaintext');
  });

  it('resolveAuto resolves against a base', () => {
    expect(resolveAuto('rtl', 'ltr')).toBe('rtl');
    expect(resolveAuto('auto', 'rtl')).toBe('rtl');
    expect(resolveAuto('auto', 'auto')).toBe('ltr');
  });
});

describe('full detection result', () => {
  it('reports script, ratio and mix', () => {
    const heb = detect('שלום');
    expect(heb.direction).toBe('rtl');
    expect(heb.script).toBe('hebrew');
    expect(heb.rtlRatio).toBe(1);
    expect(heb.isMixed).toBe(false);

    expect(detect('hello').script).toBe('latin');
    expect(detect('مرحبا').script).toBe('arabic');
    expect(detect('abc שלום').isMixed).toBe(true);
  });
});
