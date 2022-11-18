import fs from 'fs';
import path from 'path';
import serve from '@nebula.js/cli-serve';
import { test, expect } from '@playwright/test';

import events from '../../rendering/utils/events';
import createNebulaRoutes from '../../rendering/utils/routes';
import createPlaywright from '../../rendering/utils/playwright';

import SnTable from './sn-table';
import { expectations } from './expectations';
import { commandShiftArrowsMsg } from './custom-error-messages';

const paths = { fixtures: path.join(__dirname, '../__fixtures__') };

const runIntegrationTests = (theme: Object | Function, themeType: String, language: String) => {
  let nebulaServer;
  let playwright;
  let route;
  let table;
  let snTable: SnTable;

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
      snTable = new SnTable(page);
      // Render chart based on testing fixture file
      // in Nebula serve using Enigma mocker
      const renderUrl = await route.renderFixture(fixturePath);
      console.log({ renderUrl });
      // Open page in Nebula which renders fixture
      await playwright.open(renderUrl);

      const expectation = expectations[name];
      table = page.locator(snTable.selectors.chart);
      await snTable.setRowsPerPage(table, 10);
      await table.click();

      for await (const step of expectation.steps) {
        await test.step('Do actions', async () => {
          await snTable.pressKeys(step.keys);
        });
        await test.step('Check expectations', async () => {
          await expect
            .poll(
              async () => snTable.getActualPage(table),
              commandShiftArrowsMsg(step, expectation.cells, 'Actual page')
            )
            .toBe(step.page);
          expect(
            await snTable.getPaginationButtonsStatuses(table),
            commandShiftArrowsMsg(step, expectation.cells, 'Pagination buttons')
          ).toMatchObject(step.buttonsDisabled);
        });
      }
    });
  });
};

export default runIntegrationTests;
