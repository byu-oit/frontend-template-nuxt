module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['**/test/unit/**/*.spec.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1'
  },
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/layouts/**/*.vue',
    '<rootDir>/pages/**/*.vue',
    '<rootDir>/store/**/*.ts'
  ],
  setupFiles: ['<rootDir>/test/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setupAfterEnv.ts']
}
