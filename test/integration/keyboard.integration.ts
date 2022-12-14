import { test, expect } from '@playwright/test';

import senseHorizon from '../rendering/theme/sense-horizon';
import NebulaFixture from './utils/nebula-fixture';

import SnTable from './utils/sn-table';
import { expectations } from './utils/expectations';
import { navigateWithArrowsMsg } from './utils/custom-error-messages';

test.describe('Fixture rendering', () => {
  let page;
  let table;
  let snTable;
  let expectation;
  
  const environment = new NebulaFixture(senseHorizon('light'), 'light', 'en-EN');

  test.beforeAll(async ({ browser }) => {
    await environment.setup();
    page = await browser.newPage();
    snTable = new SnTable(page);
  });

  test.beforeEach(async () => {
    await environment.renderFixture('html-ascii-reference.fix.js')
    await page.goto(environment.getRenderUrl())
    table = page.locator(snTable.selectors.chart);
    await snTable.clickOnCellByText(table, expectations.before.clickOnCell);
  });

  test.afterAll(async () => {
    await environment.teardown();
    await page.close();
  });

  test('navigate cells using @arrows', async () => {
    await test.step('Define expectations', async () => {
      expectation = expectations.navigateWithArrows;
    });
    for await (const step of expectation.steps) {
      await test.step('Do actions', async () => {
        await snTable.pressKeys(step.keys);
      });
      await test.step('Check expectations', async () => {
        await expect
          .poll(async () => snTable.getFocusedCellsText(table), navigateWithArrowsMsg(step))
          .toBe(step.content);
      });
    }
  });
});
