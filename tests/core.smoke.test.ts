import { describe, expect, it } from 'vitest';
import {
  VERSION,
  detect,
  isRtl,
  wrapIsolated,
  stripUnsafeControls,
  toRenderHint,
  neutralizeInvisible,
  isPlainTextSafe,
} from '@rtl-safe-ai/core';

/**
 * Smoke tests for the scaffold. These assert the public contract / shape only —
 * detailed behavioural tests will be added alongside the real implementation.
 */
describe('@rtl-safe-ai/core public API', () => {
  it('exposes a version string', () => {
    expect(typeof VERSION).toBe('string');
  });

  it('detect() returns a well-formed result', () => {
    const result = detect('hello');
    expect(result).toMatchObject({
      direction: expect.any(String),
      script: expect.any(String),
      rtlRatio: expect.any(Number),
      isMixed: expect.any(Boolean),
      confidence: expect.any(Number),
    });
  });

  it('isRtl() returns a boolean', () => {
    expect(typeof isRtl('hello')).toBe('boolean');
  });

  it('string transforms return strings', () => {
    expect(typeof wrapIsolated('hello')).toBe('string');
    expect(typeof stripUnsafeControls('hello')).toBe('string');
    expect(typeof neutralizeInvisible('hello')).toBe('string');
  });

  it('toRenderHint() returns a render hint', () => {
    const hint = toRenderHint('rtl');
    expect(hint).toHaveProperty('direction');
    expect(hint).toHaveProperty('unicodeBidi');
    expect(hint).toHaveProperty('textAlign');
  });

  it('isPlainTextSafe() returns a boolean', () => {
    expect(typeof isPlainTextSafe('hello')).toBe('boolean');
  });
});
