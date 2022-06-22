import fs from 'fs';
import path from 'path';
import serve from '@nebula.js/cli-serve';
import { test, expect } from '@playwright/test';

import events from './events';
import createNebulaRoutes from './routes';
import createPlaywright from './playwright';

const paths = { fixtures: path.join(__dirname, '../__fixtures__') };

const runRenderingTests = (theme: Object | Function, themeType: String, language: String) => {
  let nebulaServer;
  let playwright;
  let route;

  test.beforeAll(async () => {
    nebulaServer = await serve({
      // the entry is equal to path.resolve(__dirname, '../../dist/sn-table.js'),
      // so before run the testing, yarn build should run first to generate /dist
      entry: path.resolve(__dirname, '../../../'),
      type: 'sn-table',
      open: false,
      build: false,
      themes: [
        {
          id: themeType,
          theme,
        },
      ],
      fixturePath: 'test/rendering/__fixtures__',
    });
    route = createNebulaRoutes(nebulaServer.url);
  });

  test.beforeEach(({ page }) => events.addListeners(page));

  test.afterEach(({ page }) => events.removeListeners(page));

  test.afterAll(async () => {
    nebulaServer.close();
  });

  // Iterate testing fixture files
  fs.readdirSync(paths.fixtures).forEach((file) => {
    const name = file.replace('.fix.js', '');
    const fixturePath = `./${file}&theme=${themeType}&language=${language}`;

    // Create test case per testing fixture file
    test(name, async ({ page }) => {
      playwright = createPlaywright(page);
      // Render chart based on testing fixture file
      // in Nebula serve using Enigma mocker
      const renderUrl = await route.renderFixture(fixturePath);
      console.log({ renderUrl });
      // Open page in Nebula which renders fixture
      await playwright.open(renderUrl);
      if (name === 'scenario_9' || name === 'scenario_10') await page.hover('text=Tampere');
      if (name === 'scenario_11') await page.hover('text=Valley Solutions');
      if (name === 'scenario_12') {
        const element = page.locator('text=Zocalo');
        await element.scrollIntoViewIfNeeded();
      }
      // Puppeteer Capture screenshot
      const img = await playwright.screenshot();
      // Compare screenshot with baseline image
      expect(img).toMatchSnapshot(`${name}.png`);
    });
  });
};

export default runRenderingTests;
