import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

// Named before exporting (rather than an inline array literal) to satisfy
// import/no-anonymous-default-export.
const eslintConfig = [
  ...nextConfig,
  prettierConfig,
  {
    ignores: [".next/", "node_modules/", "wordpress/"],
  },
];

export default eslintConfig;
