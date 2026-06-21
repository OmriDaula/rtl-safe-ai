import type { TextRange } from './types.js';

/**
 * Detect LaTeX / math ranges within a string.
 *
 * Recognises:
 * - display math `$$ … $$`
 * - LaTeX delimiters `\[ … \]` and `\( … \)`
 * - inline math `$ … $` (validated to avoid currency such as `$5.99`)
 *
 * Returns non-overlapping ranges sorted by start offset. The function is pure
 * and never executes the matched content.
 */
export function detectLatexRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];

  // 1. Display + delimiter forms first; these have unambiguous fences.
  const fenced = [
    /\$\$[\s\S]+?\$\$/g, // $$ … $$
    /\\\[[\s\S]+?\\\]/g, // \[ … \]
    /\\\([\s\S]+?\\\)/g, // \( … \)
  ];
  for (const re of fenced) {
    for (let m = re.exec(text); m !== null; m = re.exec(text)) {
      ranges.push({ start: m.index, end: m.index + m[0].length });
    }
  }

  // 2. Inline `$ … $`, skipping anything already covered by a fenced range.
  const inline = /\$([^$\n]+?)\$/g;
  for (let m = inline.exec(text); m !== null; m = inline.exec(text)) {
    const start = m.index;
    const end = start + m[0].length;
    if (overlapsAny(start, end, ranges)) continue;
    if (isValidInlineMath(m[1] ?? '')) ranges.push({ start, end });
  }

  return mergeRanges(ranges);
}

/**
 * An inline `$ … $` is treated as math only when its content does not look like
 * currency or prose. The decisive heuristic: real money (`$5`, `$ 10`) has a
 * digit or space immediately after the opening `$`.
 */
function isValidInlineMath(content: string): boolean {
  if (content.length === 0) return false;
  const first = content[0];
  if (first === undefined) return false;
  if (first === ' ' || (first >= '0' && first <= '9')) return false; // currency / spacing
  if (content.trimEnd() !== content) return false; // trailing space → not math
  return true;
}

function overlapsAny(start: number, end: number, ranges: readonly TextRange[]): boolean {
  return ranges.some((r) => start < r.end && end > r.start);
}

function mergeRanges(ranges: TextRange[]): TextRange[] {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const out: TextRange[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r.start <= last.end) {
      if (r.end > last.end) out[out.length - 1] = { start: last.start, end: r.end };
    } else {
      out.push(r);
    }
  }
  return out;
}
