const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    ...[
      "@vercel/style-guide/eslint/typescript",
      "@vercel/style-guide/eslint/browser",
      "@vercel/style-guide/eslint/react",
      // turborepo custom eslint configuration configures the following rules:
      //  - https://github.com/vercel/turbo/blob/main/packages/eslint-plugin-turbo/docs/rules/no-undeclared-env-vars.md
      "eslint-config-turbo",
    ].map(require.resolve),
  ],
  plugins: ["only-warn"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)"] },
  ],
  rules: {
    "no-nested-ternary": "off",
    "import/no-default-export": "off",
    "@typescript-eslint/no-misused-promises": "off",
    // Doesn't work with absolute imports
    "import/no-extraneous-dependencies": "off",
    "no-console": "warn",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "import/no-named-as-default": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "prefer-named-capture-group": "off",
  },
};
