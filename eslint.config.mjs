import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
  },
  formatters: false,
  markdown: false,
  ignores: [
    'docs/**',
    '.output/**',
    'dist/**',
    'build/**',
  ],
})
