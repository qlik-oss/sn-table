import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000/',
  },
  // Look for test files in the "test/rendering" directory, relative to this configuration file
  testDir: 'test/rendering',
  testMatch: /.*\.render\.ts/,
  outputDir: './test/rendering/artifacts/',
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: './test/rendering/test-report',
        open: process.env.CI ? 'never' : 'on-failure',
      },
    ],
  ],
  // Forbid test.only on CI
  forbidOnly: !!process.env.CI,
  // The maximum number of retry attempts per test, two retries on CI
  retries: process.env.CI ? 2 : 0,
  // Limit the number of workers
  workers: 1,
  // Multiple "projects" can run your tests in multiple browsers and configurations
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  expect: {
    toMatchSnapshot: { threshold: 0.1 },
  },
};
export default config;
