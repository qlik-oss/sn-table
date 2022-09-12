import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import serve from '@nebula.js/cli-serve';
import AxeBuilder from '@axe-core/playwright';

import events from '../utils/events';
import createNebulaRoutes from '../utils/routes';
import createPlaywright from '../utils/playwright';

test.describe('sn table: perform a full page test for its accessibility', () => {
  let nebulaServer;
  let route;

  test.beforeAll(async () => {
    nebulaServer = await serve({
      // the entry is equal to path.resolve(__dirname, '../../dist/sn-table.js'),
      // so before run the testing, yarn build should run first to generate /dist
      entry: path.resolve(__dirname, '../../'),
      type: 'sn-table',
      open: false,
      build: false,
      themes: [
        {
          id: 'light',
          theme: 'light',
        },
      ],
      fixturePath: 'test/a11y',
    });
    route = createNebulaRoutes(nebulaServer.url);
  });

  test.beforeEach(({ page }) => events.addListeners(page));

  test.afterEach(({ page }) => events.removeListeners(page));

  test.afterAll(async () => {
    nebulaServer.close();
  });

  test('test a11y', async ({ page }) => {
    const fixturePath = `./scenario_1.fix.js&theme=light&language=en-US`;
    const playwright = createPlaywright(page);
    const renderUrl = await route.renderFixture(fixturePath);
    await playwright.open(renderUrl);
    const results = await new AxeBuilder({ page }).analyze();
    fs.writeFileSync('./test/a11y/sn-table-a11y-info.json', JSON.stringify(results));
  });
});
