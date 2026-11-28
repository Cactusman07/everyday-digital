import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

// ESLint reads .gitignore-style ignores only from this list. PHP (wpTheme/)
// is checked by `pnpm lint:php` instead.
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "wordpress/**",
      "wpTheme/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
      ".visual-check/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  prettierConfig,
);
