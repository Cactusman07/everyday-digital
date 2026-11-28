import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
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
  // Rules of Hooks and effect dependencies
  reactHooks.configs.flat.recommended,
  // Accessibility checks on JSX (alt text, labels, roles, keyboard handlers…)
  jsxA11y.flatConfigs.recommended,
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
