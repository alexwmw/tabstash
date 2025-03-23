import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  {
    files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'tailwindcss/no-custom-classname': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginPrettierRecommended,
  js.configs.recommended,
]);
