const path = require("path");

module.exports = {
  testEnvironment: "jest-environment-jsdom",
  testRegex: "src/.+\\.(test|spec)\\.[jt]sx?$",
  setupFilesAfterEnv: ["./jest/setup.ts"],
  modulePathIgnorePatterns: ["<rootDir>/mashup-example"],
  transformIgnorePatterns: [
    /* if config file is under '~/packages/lib-a/' */
    `${path.join(__dirname, "../..")}/node_modules/.pnpm/(?!(@qlik-trial\\+sprout|@qlik\\+nebula-table-utils)@)`,
    /* or using relative pattern to match the second 'node_modules/' in 'node_modules/.pnpm/@scope+pkg-b@x.x.x/node_modules/@scope/pkg-b/' */
    "node_modules/(?!.pnpm|@qlik-trial/sprout|@qlik/nebula-table-utils)",
  ],
  coveragePathIgnorePatterns: ["src/__test__/generate-test-data.ts", "src/__test__/test-with-providers.tsx"],
};
