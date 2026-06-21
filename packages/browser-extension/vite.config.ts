import { resolve } from 'node:path';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { defineConfig } from 'vite';

const root = __dirname;
const outDir = resolve(root, 'dist');

/**
 * Copies static assets (manifest, popup HTML, icons) into the build output.
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

export default defineConfig({
  resolve: {
    alias: {
      '@rtl-safe-ai/core': resolve(root, '../core/src/index.ts'),
    },
  },
  build: {
    outDir,
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      // Each MV3 entry point must be a stable, top-level file in dist/.
      input: {
        background: resolve(root, 'src/background.ts'),
        content: resolve(root, 'src/content.ts'),
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
});
