module.exports = {
  plugins: ['@babel/plugin-proposal-nullish-coalescing-operator', '@babel/plugin-proposal-optional-chaining'],
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              node: 10
            }
          }
        ]
      ]
    }
  }
}
