module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  setupFilesAfterEnv: ['./jest.setup.spec.js'],
  modulePathIgnorePatterns: ['<rootDir>/mashup-example'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@qlik-trial|@qlik/nebula-table-utils|)/)'],
  coveragePathIgnorePatterns: ['src/__test__/generate-test-data.ts', 'src/__test__/test-with-providers.tsx'],
};
