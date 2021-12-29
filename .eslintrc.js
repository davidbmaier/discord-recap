module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-promise-executor-return': 'off',
    'no-use-before-define': 'off',
    'no-console': 'off',
    'max-len': ['error', { code: 120 }],
  },
};
