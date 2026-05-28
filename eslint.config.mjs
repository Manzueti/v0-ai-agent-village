import nextConfig from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

export default [
  ...nextConfig,
  {
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
