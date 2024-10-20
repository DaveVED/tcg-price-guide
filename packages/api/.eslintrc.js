/** @type {import("eslint").Linter.Config} */
const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
    extends: [
      "@vercel/style-guide/eslint/node",
      "@vercel/style-guide/eslint/typescript",
    ].map(require.resolve),
    parserOptions: {
      project,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: true,
    },
    env: {
      node: true,
      es6: true,
    },
    plugins: ["only-warn"],
    settings: {
      "import/resolver": {
        typescript: {
          project,
        },
      },
    },
    overrides: [
      {
        files: ["**/__tests__/**/*"],
        env: {
          jest: true,
        },
      },
    ],
    ignorePatterns: [".*.js", "node_modules/", "dist/"],
    // add rules configurations here
    rules: {
      "import/no-default-export": "off",
    },
  };