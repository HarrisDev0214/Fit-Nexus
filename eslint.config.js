// Core & Config
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

// Plugins
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import stylistic from '@stylistic/eslint-plugin';
import turbo from 'eslint-plugin-turbo';

export default defineConfig([
  // Base Configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  // Global Settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // Vue Parser
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module'
      }
    },
    rules: {
      'vue/max-attributes-per-line': 'off'
    }
  },

  // Stylistic and Basic Rules
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_'
      }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error'
    }
  },

  // Turbo
  {
    plugins: { turbo },
    rules: { 'turbo/no-undeclared-env-vars': 'warn' }
  },

  // Ignores
  {
    ignores: ['**/dist/**', '**/node_modules/**']
  }
]);
