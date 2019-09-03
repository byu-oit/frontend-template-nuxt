module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@nuxtjs',
    '@vue/standard',
    '@vue/typescript',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-trailing-spaces': 'error',
    'prettier/prettier': ['error', { 'semi': false, 'singleQuote': true }],
    'vuetify/no-deprecated-classes': 'error',
    // 'vuetify/grid-unknown-attributes': 'error',
    // 'vuetify/no-legacy-grid': 'error'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vuetify', '@typescript-eslint']
}
