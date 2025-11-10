const path = require("path");
const { defineConfig } = require("eslint/config");

// Import required plugins and configurations
const eslintJs = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  // Global ignores
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"]
  },

  // Base ESLint recommended config for all files
  eslintJs.configs.recommended,

  // Prettier config to avoid conflicts
  prettierConfig,

  // TypeScript-specific configuration
  {
    files: ["**/*.ts", "**/*.cts", "**/*.mts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: [path.resolve(__dirname, "tsconfig.json")],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "prettier": prettierPlugin,
    },
    rules: {
      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,

      // Prettier rules
      "prettier/prettier": "error",

      // Customize TypeScript rules
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],

      // Common rules
      "no-console": "warn",
      "curly": ["error", "multi-line"],
      "eqeqeq": ["error", "smart"],
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "sort-imports": ["warn", {
        "ignoreDeclarationSort": true
      }]
    },
  },

  // Test files can have different rules
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off"
    }
  }
]);