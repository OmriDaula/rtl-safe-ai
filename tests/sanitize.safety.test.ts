import { describe, expect, it } from 'vitest';
import {
  isPlainTextSafe,
  neutralizeInvisible,
  stripUnsafeControls,
} from '@rtl-safe-ai/core';

/** Section 7: sanitization and bidi safety. */

const LRE = '\u202A';
const RLE = '\u202B';
const PDF = '\u202C';
const LRO = '\u202D';
const RLO = '\u202E';
const LRI = '\u2066';
const PDI = '\u2069';
const ZWSP = '\u200B';
const ZWNJ = '\u200C';
const LRM = '\u200E';
const BOM = '\uFEFF';
const TAG = '\u{E0041}';

describe('stripUnsafeControls', () => {
  it('removes dangerous bidi override / embedding characters', () => {
    expect(stripUnsafeControls(`a${RLO}b`)).toBe('ab');
    expect(stripUnsafeControls(`${LRE}${RLE}${PDF}${LRO}${RLO}`)).toBe('');
    expect(stripUnsafeControls(`safe${RLO}/${LRO}gpj.exe`)).toBe('safe/gpj.exe');
  });

  it('preserves safe isolate characters', () => {
    expect(stripUnsafeControls(`a${LRI}b${PDI}c`)).toBe(`a${LRI}b${PDI}c`);
  });

  it('does not destroy normal Hebrew, Arabic, or English text', () => {
    expect(stripUnsafeControls('שלום עולם')).toBe('שלום עולם');
    expect(stripUnsafeControls('مرحبا بالعالم')).toBe('مرحبا بالعالم');
    expect(stripUnsafeControls('Hello world')).toBe('Hello world');
    expect(stripUnsafeControls(`a${ZWNJ}b`)).toBe(`a${ZWNJ}b`);
  });
});

describe('neutralizeInvisible', () => {
  it('removes zero-width and hidden control characters', () => {
    expect(neutralizeInvisible(`a${ZWSP}b`)).toBe('ab');
    expect(neutralizeInvisible(`a${BOM}b`)).toBe('ab');
    expect(neutralizeInvisible(`a${TAG}b`)).toBe('ab');
  });

  it('keeps legitimate joiners and directional marks', () => {
    expect(neutralizeInvisible(`a${ZWNJ}b`)).toBe(`a${ZWNJ}b`);
    expect(neutralizeInvisible(`a${LRM}b`)).toBe(`a${LRM}b`);
  });

  it('does not destroy normal Hebrew or Arabic text', () => {
    expect(neutralizeInvisible('שלום עולם')).toBe('שלום עולם');
    expect(neutralizeInvisible('مرحبا بالعالم')).toBe('مرحبا بالعالم');
    expect(neutralizeInvisible('Hello, world!')).toBe('Hello, world!');
  });
});

describe('isPlainTextSafe', () => {
  it('returns true for normal text in any script', () => {
    expect(isPlainTextSafe('hello world')).toBe(true);
    expect(isPlainTextSafe('שלום עולם')).toBe(true);
    expect(isPlainTextSafe('مرحبا بالعالم')).toBe(true);
    expect(isPlainTextSafe(`a${ZWNJ}b`)).toBe(true); // legitimate joiner
  });

  it('returns false for unsafe bidi overrides', () => {
    expect(isPlainTextSafe(`a${RLO}b`)).toBe(false);
    expect(isPlainTextSafe(`a${LRO}b`)).toBe(false);
    expect(isPlainTextSafe(`a${RLE}b`)).toBe(false);
  });

  it('returns false for hidden zero-width and tag characters', () => {
    expect(isPlainTextSafe(`a${ZWSP}b`)).toBe(false);
    expect(isPlainTextSafe(`a${BOM}b`)).toBe(false);
    expect(isPlainTextSafe(`a${TAG}b`)).toBe(false);
  });
});
