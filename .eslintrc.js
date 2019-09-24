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
    '@typescript-eslint/no-useless-constructor': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-trailing-spaces': 'warn',
    'prettier/prettier': ['warn', { 'semi': false, 'singleQuote': true }],
    'vuetify/no-deprecated-classes': 'warn',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vuetify', '@typescript-eslint']
}
