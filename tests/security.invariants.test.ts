import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import fg from 'fast-glob';

/**
 * Guard tests that fail the build if the core engine ever introduces forbidden
 * capabilities (network, eval, DOM string-HTML sinks). These complement the
 * ESLint rules and act as a backstop in CI.
 */
const here = dirname(fileURLToPath(import.meta.url));
const coreSrc = join(here, '..', 'packages', 'core', 'src');

const FORBIDDEN: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: 'fetch', pattern: /\bfetch\s*\(/ },
  { name: 'XMLHttpRequest', pattern: /\bXMLHttpRequest\b/ },
  { name: 'WebSocket', pattern: /\bWebSocket\b/ },
  { name: 'eval', pattern: /\beval\s*\(/ },
  { name: 'new Function', pattern: /new\s+Function\s*\(/ },
  { name: 'innerHTML', pattern: /\.innerHTML\b/ },
  { name: 'outerHTML', pattern: /\.outerHTML\b/ },
  { name: 'insertAdjacentHTML', pattern: /\.insertAdjacentHTML\b/ },
];

/** Remove block and line comments so we only scan executable code. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

describe('core security invariants', () => {
  it('contains no forbidden APIs in source', async () => {
    const files = await fg('**/*.ts', { cwd: coreSrc, absolute: true });
    expect(files.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const file of files) {
      const code = stripComments(readFileSync(file, 'utf8'));
      for (const { name, pattern } of FORBIDDEN) {
        if (pattern.test(code)) violations.push(`${name} found in ${file}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
