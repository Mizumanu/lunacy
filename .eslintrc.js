// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021:  true,
    node:    true,
  },
  extends: [
    "eslint:recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType:  "module",
  },
  plugins: [
    "unused-imports"
  ],
  rules: {
    // enforce ===
    eqeqeq: ["error", "always"],

    // drop unused imports altogether
    "unused-imports/no-unused-imports": "error",

    // warn (and auto-fix) unused vars, except those prefixed with _
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars:           "all",
        varsIgnorePattern: "^_",
        args:           "after-used",
        argsIgnorePattern: "^_"
      }
    ],

    // disable the core rule (we’re using the plugin’s version instead)
    "no-unused-vars": "off"
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env:   { jest: true },      // <- tells ESLint about jest globals
    },
  ],
};


