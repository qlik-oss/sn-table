module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  setupFilesAfterEnv: ['./jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/mashup-example', '<rootDir>/node_modules/@qlik-trial'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@qlik-trial)/)'],
};
