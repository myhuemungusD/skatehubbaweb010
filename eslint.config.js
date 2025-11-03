// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  ...ts.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx}']
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { 
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      },
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  { ignores: ['node_modules', 'dist', 'build', '.next', 'out', 'coverage'] }
];
