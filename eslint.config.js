// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      parserOptions: { project: ['./tsconfig.json'] },
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  { ignores: ['node_modules', 'dist', 'build', '.next', 'out', 'coverage'] }
];
