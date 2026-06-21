import { detectTextDirection } from './detect.js';
import { detectLatexRanges } from './latex.js';
import type { DetectOptions, Segment, SegmentKind, TextRange } from './types.js';

interface KindedRange extends TextRange {
  readonly kind: SegmentKind;
}

function overlapsAny(start: number, end: number, ranges: readonly TextRange[]): boolean {
  return ranges.some((r) => start < r.end && end > r.start);
}

/** Detect fenced (``` ```) and inline (`` ` ``) code ranges. */
function detectCodeRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];

  const fenced = /```[\s\S]*?```/g;
  for (let m = fenced.exec(text); m !== null; m = fenced.exec(text)) {
    ranges.push({ start: m.index, end: m.index + m[0].length });
  }

  const inline = /`[^`\n]+`/g;
  for (let m = inline.exec(text); m !== null; m = inline.exec(text)) {
    const start = m.index;
    const end = start + m[0].length;
    if (!overlapsAny(start, end, ranges)) ranges.push({ start, end });
  }

  return ranges;
}

/**
 * Split text into directional segments.
 *
 * Math (`$$…$$`, `$…$`, `\[…\]`, `\(…\)`) and code (`` `…` ``, ``` ```…``` ```)
 * are returned as isolated LTR segments; the remaining text runs are assigned a
 * direction via {@link detectTextDirection}. Code takes precedence over math
 * where they overlap.
 */
export function segmentText(text: string, options: DetectOptions = {}): Segment[] {
  const code: KindedRange[] = detectCodeRanges(text).map((r) => ({ ...r, kind: 'code' }));
  const math: KindedRange[] = detectLatexRanges(text)
    .filter((r) => !overlapsAny(r.start, r.end, code))
    .map((r) => ({ ...r, kind: 'math' }));

  const isolated = [...code, ...math].sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;

  const pushText = (start: number, end: number): void => {
    if (end <= start) return;
    const slice = text.slice(start, end);
    segments.push({
      kind: 'text',
      text: slice,
      direction: detectTextDirection(slice, options),
      start,
      end,
    });
  };

  for (const range of isolated) {
    pushText(cursor, range.start);
    segments.push({
      kind: range.kind,
      text: text.slice(range.start, range.end),
      direction: 'ltr',
      start: range.start,
      end: range.end,
    });
    cursor = range.end;
  }
  pushText(cursor, text.length);

  return segments;
}
