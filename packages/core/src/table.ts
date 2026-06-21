import { detectTextDirection, firstStrongDirection } from './detect.js';
import type { DetectOptions, Direction, TableDirectionResult } from './types.js';

/** A separator row such as `| --- | :--: |`. */
const SEPARATOR_ROW = /^[\s|:-]+$/;

/** Split a Markdown table row into trimmed, non-empty edge-corrected cells. */
function splitRow(line: string): string[] {
  let row = line.trim();
  if (row.startsWith('|')) row = row.slice(1);
  if (row.endsWith('|')) row = row.slice(0, -1);
  return row.split('|').map((c) => c.trim());
}

/**
 * Resolve the base direction of a Markdown-style table.
 *
 * Every non-empty cell votes by its own detected direction; the majority wins.
 * Ties are broken by the first meaningful cell (header first, then body) that
 * has a strong direction.
 */
export function detectTableDirection(
  text: string,
  options: DetectOptions = {},
): TableDirectionResult {
  const rows = text
    .split(/\r?\n/)
    .filter((line) => line.includes('|') && !SEPARATOR_ROW.test(line))
    .map(splitRow);

  let rtlCells = 0;
  let ltrCells = 0;
  let neutralCells = 0;
  let tieBreak: Direction | null = null;

  for (const cells of rows) {
    for (const cell of cells) {
      if (cell.length === 0) {
        neutralCells++;
        continue;
      }
      const dir = detectTextDirection(cell, options);
      const strong = firstStrongDirection(cell);
      if (strong === 'neutral') {
        neutralCells++;
        continue;
      }
      if (dir === 'rtl') rtlCells++;
      else ltrCells++;
      if (tieBreak === null) tieBreak = dir;
    }
  }

  const total = rtlCells + ltrCells;
  let direction: Direction;
  if (total === 0) direction = options.neutralDefault ?? 'ltr';
  else if (rtlCells > ltrCells) direction = 'rtl';
  else if (ltrCells > rtlCells) direction = 'ltr';
  else direction = tieBreak ?? 'ltr';

  const confidence = total === 0 ? 0 : Math.abs(rtlCells - ltrCells) / total;

  return { direction, rtlCells, ltrCells, neutralCells, confidence };
}
