import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    extends: ['js/recommended'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['*.d.ts', '**/*.types.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { js },
  },

  globalIgnores(['dist', 'dist-web']),
  tseslint.configs.recommended,
  perfectionist.configs['recommended-natural'],
  pluginPrettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'max-len': 'off',
      'no-unused-vars': 'off',
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-interfaces': ['error'],
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'alphabetical',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])
