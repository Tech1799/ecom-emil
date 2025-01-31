import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    // Spread ESLint's recommended config for basic rules
    ...js.configs.recommended,

    // Tell ESLint we're using the TS parser
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Target the latest ECMAScript version
        ecmaVersion: "latest",
        sourceType: "module",
        // Point to your TS config if you want type-aware linting
        // (useful for certain TypeScript rules)
        project: "./tsconfig.json",
      },
    },

    // Register the TypeScript ESLint plugin
    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    // Optionally spread the TS ESLint recommended config
    // ...tsPlugin.configs.recommended,

    rules: {
      // Example: Error on unused vars, but allow underscore-prefixed
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // Example: Force consistent type imports
      // "@typescript-eslint/consistent-type-imports": "warn",

      // Feel free to override or add any other rules:
      // "semi": ["error", "always"],
      // "no-console": "warn",
      // etc.
    },
  },
];
