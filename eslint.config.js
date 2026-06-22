// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Shared rules that enforce the project's security principles directly in the
 * linter: no eval, no innerHTML, no network access, no dynamic code execution.
 */
const securityRules = {
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',
  'no-restricted-globals': [
    'error',
    { name: 'fetch', message: 'Network access is forbidden: rtl-safe-ai is local-only.' },
    { name: 'XMLHttpRequest', message: 'Network access is forbidden: rtl-safe-ai is local-only.' },
    { name: 'WebSocket', message: 'Network access is forbidden: rtl-safe-ai is local-only.' },
    { name: 'EventSource', message: 'Network access is forbidden: rtl-safe-ai is local-only.' },
  ],
  'no-restricted-properties': [
    'error',
    { property: 'innerHTML', message: 'Use textContent / safe DOM APIs instead of innerHTML.' },
    { property: 'outerHTML', message: 'Use safe DOM APIs instead of outerHTML.' },
    { property: 'insertAdjacentHTML', message: 'Use safe DOM APIs instead of insertAdjacentHTML.' },
    { property: 'sendBeacon', message: 'Network/telemetry calls are forbidden: rtl-safe-ai is local-only.' },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: "CallExpression[callee.object.name='document'][callee.property.name='write']",
      message: 'document.write is forbidden.',
    },
    {
      selector: "CallExpression[callee.name='sendBeacon']",
      message: 'Network/telemetry calls are forbidden.',
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/*.tsbuildinfo',
      '**/coverage/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      ...securityRules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.config.{js,ts}', '**/vite.config.ts', '**/vitest.config.ts'],
    rules: {
      'no-restricted-globals': 'off',
    },
  },
);
