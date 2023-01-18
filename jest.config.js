module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  setupFilesAfterEnv: ['./jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/mashup-example'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@qlik-trial)/)'],
  coveragePathIgnorePatterns: ['src/__test__/generate-test-data.ts', 'src/__test__/test-with-providers.tsx']
};
