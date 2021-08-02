module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:jest/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'vuetify'
  ],
  rules: {
    camelcase: 'off',
    'no-console': process.env.GITHUB_ACTIONS === true ? 'error' : 'off',
    'no-debugger': process.env.GITHUB_ACTIONS === true ? 'error' : 'off',
    'vue/valid-v-slot': ['error', { allowModifiers: true }] // Vuetify uses slot modifiers
  },
  ignorePatterns: [
    './**/.coverage/',
    './**/.nuxt/',
    './**/dist/',
    './**/node_modules/'
  ]
}
