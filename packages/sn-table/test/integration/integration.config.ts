import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  use: {
    trace: "retain-on-failure",
  },
  testDir: "./",
  testMatch: /.*\.integration\.ts/,
  outputDir: "./artifacts/",
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: "./test-report",
        open: process.env.CI ? "never" : "on-failure",
      },
    ],
  ],
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  expect: {
    toMatchSnapshot: { threshold: 0.1 },
  },
};

export default config;
