import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    extends: ['js/recommended'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { js },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  globalIgnores(['dist', 'dist-web']),
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  perfectionist.configs['recommended-natural'],
  pluginPrettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-interfaces': ['error'],
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'alphabetical',
        },
      ],
      'react/react-in-jsx-scope': 'off',
    },
  },
])
