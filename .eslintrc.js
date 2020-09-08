module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/vue'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'warn',
    '@typescript-eslint/no-unused-vars': 'off', // "no-unused-vars" is currently broken (9/8/2020), but is covered by "noUnusedLocals" and "noUnusedParameters" in tsconfig.json
    'no-unused-vars': 'off',
    'no-trailing-spaces': 'warn',
    'prettier/prettier': ['warn', { semi: false, singleQuote: true }],
    'vuetify/no-deprecated-classes': 'warn'
  },
  plugins: ['vuetify', 'prettier']
}
