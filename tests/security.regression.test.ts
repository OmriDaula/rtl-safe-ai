import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import fg from 'fast-glob';

/**
 * Section 9: security regression. Complements `security.invariants.test.ts`
 * (which scans for forbidden runtime APIs) by guarding that the core stays
 * local-only and dependency-light.
 */
const here = dirname(fileURLToPath(import.meta.url));
const coreDir = join(here, '..', 'packages', 'core');
const coreSrc = join(coreDir, 'src');

/** Remove block and line comments so we only scan executable code. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

describe('security regression', () => {
  it('the core package declares no runtime dependencies', () => {
    const pkg = JSON.parse(readFileSync(join(coreDir, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
    };
    expect(pkg.dependencies ?? {}).toEqual({});
  });

  it('the core source imports no Node built-in modules (no I/O)', async () => {
    const files = await fg('**/*.ts', { cwd: coreSrc, absolute: true });
    expect(files.length).toBeGreaterThan(0);

    const offenders = files.filter((file) =>
      /from\s+['"]node:/.test(stripComments(readFileSync(file, 'utf8'))),
    );
    expect(offenders).toEqual([]);
  });

  it('the core source imports only relative modules (dependency-light)', async () => {
    const files = await fg('**/*.ts', { cwd: coreSrc, absolute: true });
    const offenders: string[] = [];

    for (const file of files) {
      const code = stripComments(readFileSync(file, 'utf8'));
      const importRe = /from\s+['"]([^'"]+)['"]/g;
      for (let m = importRe.exec(code); m !== null; m = importRe.exec(code)) {
        const spec = m[1];
        if (spec && !spec.startsWith('.')) offenders.push(`${spec} in ${file}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
