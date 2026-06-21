import { describe, expect, it } from 'vitest';
import { detectTableDirection } from '@rtl-safe-ai/core';

/** Section 5: Markdown table direction. */

const rtlHeaders = ['| שם | גיל | עיר |', '| --- | --- | --- |'].join('\n');
const ltrHeaders = ['| Name | Age | City |', '| --- | --- | --- |'].join('\n');

const rtlMajority = [
  '| שם | תיאור | Status |',
  '| --- | --- | --- |',
  '| פריט | ערך | done |',
].join('\n');

const ltrMajority = [
  '| Name | Type | תיאור |',
  '| --- | --- | --- |',
  '| item | value | פריט |',
].join('\n');

describe('table direction', () => {
  it('detects RTL markdown table headers as rtl', () => {
    const result = detectTableDirection(rtlHeaders);
    expect(result.direction).toBe('rtl');
    expect(result.rtlCells).toBe(3);
    expect(result.ltrCells).toBe(0);
  });

  it('detects LTR markdown table headers as ltr', () => {
    const result = detectTableDirection(ltrHeaders);
    expect(result.direction).toBe('ltr');
    expect(result.ltrCells).toBe(3);
    expect(result.rtlCells).toBe(0);
  });

  it('resolves rtl for an RTL-majority mixed table', () => {
    const result = detectTableDirection(rtlMajority);
    expect(result.direction).toBe('rtl');
    expect(result.rtlCells).toBeGreaterThan(result.ltrCells);
  });

  it('resolves ltr for an LTR-majority mixed table', () => {
    const result = detectTableDirection(ltrMajority);
    expect(result.direction).toBe('ltr');
    expect(result.ltrCells).toBeGreaterThan(result.rtlCells);
  });

  it('breaks ties using the first meaningful cell', () => {
    expect(detectTableDirection('| שם | Name |').direction).toBe('rtl');
    expect(detectTableDirection('| Name | שם |').direction).toBe('ltr');
  });

  it('ignores empty cells (counted as neutral)', () => {
    const result = detectTableDirection('| | שם |');
    expect(result.direction).toBe('rtl');
    expect(result.neutralCells).toBeGreaterThanOrEqual(1);
    expect(result.rtlCells).toBe(1);
  });

  it('treats numeric cells as neutral, not directional', () => {
    expect(detectTableDirection('| 123 | שם |').direction).toBe('rtl');
    expect(detectTableDirection('| 123 | Name |').direction).toBe('ltr');
    expect(detectTableDirection('| 100 | 200 |').neutralCells).toBe(2);
  });

  it('handles mixed Hebrew/English rows and reports counts', () => {
    const result = detectTableDirection(rtlMajority);
    expect(result.rtlCells + result.ltrCells + result.neutralCells).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('falls back to the neutral default for a table with no strong cells', () => {
    expect(detectTableDirection('| 1 | 2 |').direction).toBe('ltr');
    expect(detectTableDirection('| 1 | 2 |', { neutralDefault: 'rtl' }).direction).toBe('rtl');
  });
});
