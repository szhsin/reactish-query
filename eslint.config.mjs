// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactHooksAddons from 'eslint-plugin-react-hooks-addons';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooksAddons.configs.recommended,
  prettier,
  {
    files: ['**/*.?(c|m)js'],
    ...tseslint.configs.disableTypeChecked
  },
  {
    ignores: [
      '**/coverage/',
      '**/dist/',
      '**/types/',
      '**/build/',
      '**/static/',
      '**/.next/',
      '**/.docusaurus/',
      '**/*.d.ts'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.?(c|m)js', 'examples/*.?(c|m)js']
        },
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest
      }
    },
    plugins: {
      'react-hooks': reactHooks
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/prop-types': 0,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'error',
        {
          additionalHooks: 'useSelector'
        }
      ],
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true }
      ]
    }
  },
  {
    files: ['examples/**/*'],
    rules: {
      'no-console': 0
    }
  }
);
