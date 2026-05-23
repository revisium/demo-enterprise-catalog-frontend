import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'build/**',
      'dist/**',
      'node_modules/**',
      '.react-router/**',
      'src/__generated__/**',
      'coverage/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      sonarjs,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      'react/prop-types': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      'sonarjs/no-duplicate-string': 'off',
    },
  },
  {
    files: ['**/*.config.{js,ts,mjs}', 'scripts/**/*.{js,mjs,ts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'sonarjs/no-duplicate-string': 'off',
    },
  },
  prettier,
);
