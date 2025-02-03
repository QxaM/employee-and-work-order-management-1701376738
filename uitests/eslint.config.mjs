import globals from "globals";
import pluginJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 2024,
      sourceType: "module",
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...playwright.configs["flat/recommended"].rules,
      "@typescript-eslint/no-floating-promises": "error",
      "playwright/prefer-comparison-matcher": "warn",
      "playwright/prefer-equality-matcher": "warn",
      "playwright/prefer-hooks-on-top": "warn",
      "playwright/prefer-locator": "warn",
      "playwright/prefer-to-contain": "warn",
      "playwright/prefer-to-have-length": "warn",
      "playwright/prefer-to-have-count": "warn",
      "playwright/prefer-web-first-assertions": "warn",
    },
  },
];
