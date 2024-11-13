/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@mapform/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};
