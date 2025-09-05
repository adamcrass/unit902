module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: ["react", "react-hooks"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    "no-console": "warn",
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
    "react/prop-types": "off", // Turn off if using TypeScript or don't want prop-types
    "no-undef": "error", // This should catch undefined variables like ButtonIcon
  },
  ignorePatterns: ["dist"],
};
