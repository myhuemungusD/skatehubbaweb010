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
  // TypeScript files in client/shared
  ...ts.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['client/**/*.{ts,tsx}', 'shared/**/*.{ts,tsx}']
  })),
  {
    files: ['client/**/*.{ts,tsx}', 'shared/**/*.{ts,tsx}'],
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
  // TypeScript files in server
  ...ts.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['server/**/*.{ts,tsx}']
  })),
  {
    files: ['server/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { 
        project: './tsconfig.server.json',
        tsconfigRootDir: import.meta.dirname
      },
      globals: { ...globals.node }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  // Config files in root - use standard recommended, not type-aware
  ...ts.configs.recommended.map(config => ({
    ...config,
    files: ['*.config.{ts,js,mjs}', 'drizzle.config.ts']
  })),
  {
    files: ['*.config.{ts,js,mjs}', 'drizzle.config.ts'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },
  { ignores: ['node_modules', 'dist', 'build', '.next', 'out', 'coverage'] }
];
