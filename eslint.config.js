import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-config-prettier';
import componentDocumentation from './scripts/eslint/component-documentation.js';

export default tseslint.config(
  { ignores: ['dist/**', 'dist-standalone/**', 'coverage/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      jsdoc,
    },
    settings: { jsdoc: { mode: 'typescript', tagNamePreference: { returns: 'returns' } } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: { FunctionDeclaration: true },
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/check-tag-names': ['error', { definedTags: ['component'] }],
      'jsdoc/require-param': ['error', { checkDestructured: false }],
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-description': 'error',
    },
  },
  {
    files: [
      'src/components/**/*.tsx',
      'src/pages/**/*.tsx',
      'src/App.tsx',
      'src/context/*Provider.tsx',
    ],
    ignores: ['**/*.test.tsx'],
    plugins: { documentation: { rules: { 'require-component-tags': componentDocumentation } } },
    rules: {
      'documentation/require-component-tags': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    rules: { 'jsdoc/require-jsdoc': 'off', 'react-refresh/only-export-components': 'off' },
  },
  prettier,
);
