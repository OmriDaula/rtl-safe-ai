import { resolve } from 'node:path';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { defineConfig } from 'vite';

const root = __dirname;
const outDir = resolve(root, 'dist');
const coreAlias = { '@rtl-safe-ai/core': resolve(root, '../core/src/index.ts') };

/**
 * Copies static assets (manifest, popup HTML/CSS, icons) into the build output.
 * Kept inline to avoid an extra dependency.
 */
function copyStaticAssets() {
  return {
    name: 'rtl-safe-ai:copy-static',
    closeBundle() {
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
      cpSync(resolve(root, 'manifest.json'), resolve(outDir, 'manifest.json'));
      cpSync(resolve(root, 'src/popup/popup.html'), resolve(outDir, 'popup.html'));
      cpSync(resolve(root, 'src/popup/popup.css'), resolve(outDir, 'popup.css'));
      if (existsSync(resolve(root, 'icons'))) {
        cpSync(resolve(root, 'icons'), resolve(outDir, 'icons'), { recursive: true });
      }
    },
  };
}

/**
 * Two build targets share one `dist/`:
 * - `--mode content`: the content script, bundled as a self-contained IIFE
 *   (MV3 content scripts are classic scripts and cannot use ES `import`).
 * - default: the service worker + popup, which are ES modules and may share
 *   chunks freely. This pass also copies the static assets and cleans `dist/`.
 */
export default defineConfig(({ mode }) => {
  if (mode === 'content') {
    return {
      resolve: { alias: coreAlias },
      build: {
        outDir,
        emptyOutDir: false,
        sourcemap: true,
        target: 'es2022',
        rollupOptions: {
          input: { content: resolve(root, 'src/content.ts') },
          output: {
            format: 'iife',
            name: 'rtlSafeAiContent',
            entryFileNames: 'content.js',
            inlineDynamicImports: true,
          },
        },
      },
    };
  }

  return {
    resolve: { alias: coreAlias },
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,
      target: 'es2022',
      rollupOptions: {
        input: {
          background: resolve(root, 'src/background.ts'),
          popup: resolve(root, 'src/popup/popup.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    plugins: [copyStaticAssets()],
  };
});
