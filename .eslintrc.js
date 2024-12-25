module.exports = {
  env: {
    browser: true
  },
  extends: ["google", "prettier", "plugin:react-hooks/recommended"],
  parser: "babel-eslint",
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "warn", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies,
    "react/jsx-uses-react": "warning",
    "react/jsx-uses-vars": "warning"
  }
};
