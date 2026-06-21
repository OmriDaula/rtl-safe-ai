import { describe, expect, it } from 'vitest';
import * as core from '@rtl-safe-ai/core';
import {
  detect,
  resolveAuto,
  segmentText,
  toRenderHint,
  VERSION,
} from '@rtl-safe-ai/core';

/** Section 8: public API stability. */

const EXPECTED_EXPORTS = [
  // values
  'VERSION',
  'detect',
  'detectTextDirection',
  'isRtl',
  'isRTLCodePoint',
  'hasRTL',
  'firstStrongDirection',
  'rtlRatio',
  'stripLeadingLTRNoise',
  'segmentText',
  'detectLatexRanges',
  'detectTableDirection',
  'toRenderHint',
  'resolveAuto',
  'wrapIsolated',
  'stripUnsafeControls',
  'neutralizeInvisible',
  'isPlainTextSafe',
  // constants
  'BIDI_CONTROLS',
  'UNSAFE_BIDI_CONTROLS',
  'INVISIBLE_CONTROLS',
  'RTL_SCRIPT_RANGES',
] as const;

describe('public export surface', () => {
  it('exposes all documented named exports', () => {
    for (const name of EXPECTED_EXPORTS) {
      expect(core).toHaveProperty(name);
    }
  });

  it('exposes a semver-like VERSION string', () => {
    expect(typeof VERSION).toBe('string');
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('exposes stable constant shapes', () => {
    expect(core.UNSAFE_BIDI_CONTROLS).toHaveLength(5);
    expect(Array.isArray(core.INVISIBLE_CONTROLS)).toBe(true);
    expect(core.RTL_SCRIPT_RANGES).toHaveProperty('hebrew');
    expect(core.RTL_SCRIPT_RANGES).toHaveProperty('arabic');
    expect(core.BIDI_CONTROLS).toMatchObject({ FSI: expect.any(String), PDI: expect.any(String) });
  });
});

describe('DetectionResult shape', () => {
  it('returns a stable set of fields with valid ranges', () => {
    const result = detect('שלום world');
    expect(Object.keys(result).sort()).toEqual(
      ['confidence', 'direction', 'isMixed', 'rtlRatio', 'script'].sort(),
    );
    expect(['ltr', 'rtl', 'auto']).toContain(result.direction);
    expect(typeof result.script).toBe('string');
    expect(result.rtlRatio).toBeGreaterThanOrEqual(0);
    expect(result.rtlRatio).toBeLessThanOrEqual(1);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(typeof result.isMixed).toBe('boolean');
  });

  it('returns a well-formed result for empty input', () => {
    const result = detect('');
    expect(result.direction).toBe('ltr');
    expect(result.script).toBe('unknown');
    expect(result.rtlRatio).toBe(0);
    expect(result.isMixed).toBe(false);
    expect(result.confidence).toBe(0);
  });
});

describe('toRenderHint', () => {
  it('maps each direction to expected, safe CSS hints', () => {
    expect(toRenderHint('rtl')).toEqual({
      direction: 'rtl',
      unicodeBidi: 'isolate',
      textAlign: 'right',
    });
    expect(toRenderHint('ltr')).toEqual({
      direction: 'ltr',
      unicodeBidi: 'isolate',
      textAlign: 'left',
    });
    expect(toRenderHint('auto')).toEqual({
      direction: 'auto',
      unicodeBidi: 'plaintext',
      textAlign: 'start',
    });
  });
});

describe('resolveAuto', () => {
  it('returns concrete directions unchanged', () => {
    expect(resolveAuto('rtl', 'ltr')).toBe('rtl');
    expect(resolveAuto('ltr', 'rtl')).toBe('ltr');
  });

  it('resolves auto against the base direction', () => {
    expect(resolveAuto('auto', 'rtl')).toBe('rtl');
    expect(resolveAuto('auto', 'ltr')).toBe('ltr');
    expect(resolveAuto('auto', 'auto')).toBe('ltr');
  });
});

describe('segmentText stability', () => {
  it('returns contiguous segments that reconstruct the input', () => {
    const text = 'שלום $x$ `y` end';
    const segs = segmentText(text);

    let cursor = 0;
    for (const seg of segs) {
      expect(seg.start).toBe(cursor);
      expect(text.slice(seg.start, seg.end)).toBe(seg.text);
      expect(['text', 'math', 'code']).toContain(seg.kind);
      expect(['ltr', 'rtl', 'auto']).toContain(seg.direction);
      cursor = seg.end;
    }
    expect(cursor).toBe(text.length);
    expect(segs.map((s) => s.text).join('')).toBe(text);
  });

  it('returns an empty array for an empty string', () => {
    expect(segmentText('')).toEqual([]);
  });
});
