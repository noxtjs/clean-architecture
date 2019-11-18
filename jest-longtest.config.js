module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  testMatch: ['**/src/**/*.(test-harness|test).(ts|tsx|js|jsx)', '**/anti-corruption-test/**/*.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  // setupFiles: ['jest-localstorage-mock', 'jest-date-mock']
}
