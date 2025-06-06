module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
  ignorePatterns: [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
  ],
};
