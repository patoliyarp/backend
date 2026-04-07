import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
// import  from "eslint-config-prettier";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    // plugins: { js },
    // extends: ["js/recommended", "prettier"],
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
  prettier,
  eslint.configs.recommended,
  {
    ignores: [
      "dist/",
      "build/",
      "node_modules/",
      "eslint.config.mjs",
      "src/utils/Callback.ts",
    ],
  },
]);
