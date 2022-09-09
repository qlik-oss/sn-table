module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  setupFilesAfterEnv: ['./jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/mashup-example'],
};
