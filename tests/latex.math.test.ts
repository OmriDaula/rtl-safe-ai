import { describe, expect, it } from 'vitest';
import { detectLatexRanges, segmentText } from '@rtl-safe-ai/core';

/** Section 4: LaTeX / math detection and isolation. */

function sliceRanges(text: string): string[] {
  return detectLatexRanges(text).map((r) => text.slice(r.start, r.end));
}

describe('latex / math detection', () => {
  it('detects inline math with $...$', () => {
    const text = 'Let $x + y$ be the sum';
    const ranges = detectLatexRanges(text);
    expect(ranges).toHaveLength(1);
    expect(text.slice(ranges[0]!.start, ranges[0]!.end)).toBe('$x + y$');
  });

  it('detects block math with $$...$$', () => {
    expect(sliceRanges('The identity $$a^2 + b^2 = c^2$$ holds')).toEqual(['$$a^2 + b^2 = c^2$$']);
  });

  it('detects \\( ... \\) delimiter math', () => {
    expect(sliceRanges('Inline \\(a - b\\) here')).toEqual(['\\(a - b\\)']);
  });

  it('detects \\[ ... \\] delimiter math', () => {
    expect(sliceRanges('Block \\[a + b\\] here')).toEqual(['\\[a + b\\]']);
  });

  it('detects math surrounded by Hebrew text', () => {
    const segs = segmentText('הנוסחה $E = mc^2$ מפורסמת מאוד');
    const math = segs.find((s) => s.kind === 'math');
    expect(math?.text).toBe('$E = mc^2$');
    expect(math?.direction).toBe('ltr');
    expect(segs.some((s) => s.kind === 'text' && s.direction === 'rtl')).toBe(true);
  });

  it('detects math surrounded by Arabic text', () => {
    const segs = segmentText('المعادلة $x^2$ مشهورة جدا');
    const math = segs.find((s) => s.kind === 'math');
    expect(math?.text).toBe('$x^2$');
    expect(math?.direction).toBe('ltr');
    expect(segs.some((s) => s.kind === 'text' && s.direction === 'rtl')).toBe(true);
  });

  it('does not treat single currency values like $5.99 as math', () => {
    expect(detectLatexRanges('It costs $5.99 today')).toHaveLength(0);
    expect(detectLatexRanges('Total: $100')).toHaveLength(0);
  });

  it('does not treat price ranges like $5 to $10 as math', () => {
    expect(detectLatexRanges('You owe $5 to $10 in total')).toHaveLength(0);
    expect(detectLatexRanges('Between $20 and $30 per item')).toHaveLength(0);
  });

  it('does not crash on malformed or unbalanced delimiters', () => {
    expect(() => detectLatexRanges('$x without close')).not.toThrow();
    expect(detectLatexRanges('$x without close')).toHaveLength(0);
    expect(detectLatexRanges('$$ unclosed block')).toHaveLength(0);
    expect(detectLatexRanges('\\[ unclosed delimiter')).toHaveLength(0);
    expect(detectLatexRanges('$$$$')).toHaveLength(0);
    expect(detectLatexRanges('')).toHaveLength(0);
  });

  it('returns math segments as isolated LTR segments', () => {
    const text = 'compute $a+b$ now';
    const segs = segmentText(text);
    const math = segs.filter((s) => s.kind === 'math');
    expect(math).toHaveLength(1);
    expect(math[0]!.direction).toBe('ltr');
  });
});
