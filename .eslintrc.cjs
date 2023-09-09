/* eslint-env node */
module.exports = {
  extends: [
    'plugin:import/recommended',
    'eslint:recommended', 
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
     project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'quote-props': ["error", "as-needed"],
  },
  root: true,
};
