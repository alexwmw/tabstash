import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import js from '@eslint/js';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';

export default defineConfig([
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'tailwindcss/no-custom-classname': 'off',
      'react/jsx-uses-react': 'error', // Prevents false unused import warnings
      'react/jsx-uses-vars': 'error', // Ensures JSX variables are marked as used
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.webextensions,
        ...globals.jest,
      },
    },
  },
  pluginPrettierRecommended,
  js.configs.recommended,
]);
