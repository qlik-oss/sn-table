/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-loop-func */
import { test, expect, Page, Locator } from '@playwright/test';

import senseHorizon from '../rendering/theme/sense-horizon';
import NebulaFixture from './utils/nebula-fixture';

import SnTable from './page-object-model/sn-table';
import expectations from './expectations/keyboard.expectations';
import { focusedText, isOption, isSVG } from './keyboard-test-setup';
import { navigateWithArrowsMsg } from './utils/custom-error-messages';
import { Collection } from './types';

test.describe('Tests served by: fixture-file rendering by Nebula', () => {
  let page: Page;
  let table: Locator;
  let snTable: SnTable;
  let expectation: Collection;

  const environment = new NebulaFixture(senseHorizon('light'), 'light', 'en-EN');

  test.beforeAll(async ({ browser }, testInfo) => {
    await environment.setup(testInfo);
    page = await browser.newPage();
    snTable = new SnTable(page);
  });

  test.beforeEach(async () => {
    await environment.renderFixture('html-ascii-reference.fix.js');
    await page.goto(environment.getRenderUrl(), { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="sn-table"] .sn-table-cell-text');
  });

  test.afterAll(async ({ browser }) => {
    await environment.teardown();
    await page.close();
    await browser.close();
  });

  test('navigate cells using tab', async () => {
    await page.locator('body').press('Tab'); // Moving to a head cell button
    expect(await focusedText(page)).toBe(`Character
Ascending Press space to sort on this column`);

    await page.keyboard.press('Tab'); // Moving to a head menu button
    expect(await isSVG(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a head cell button
    expect(await focusedText(page)).toBe(`Entity Name
Ascending Press space to sort on this column`);

    await page.keyboard.press('Tab'); // Moving to a head menu button
    expect(await isSVG(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a head cell button
    expect(await focusedText(page)).toBe(`Description
Ascending Press space to sort on this column`);

    await page.keyboard.press('Tab'); // Moving to a head menu button
    expect(await isSVG(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a table cell
    expect(await focusedText(page)).toBe('­');

    await page.keyboard.press('Tab'); // Moving to a pagination control select option (rows per page)
    expect(await isOption(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a pagination control select option (select page)
    expect(await isOption(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a pagination action button (go to the first page)
    expect(await isSVG(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a pagination action button (go to the previous page)
    expect(await isSVG(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a pagination action button (go to the next page)
    expect(await isSVG(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to a pagination action button (go to the last page)
    expect(await isSVG(page)).toBeTruthy();

    await page.keyboard.press('Tab'); // Moving to an address bar
    await page.keyboard.press('Tab'); // Moving to a head cell button
    expect(await focusedText(page)).toBe('Character');
  });

  test('navigate cells using @arrows', async () => {
    table = page.locator(snTable.selectors.chart);
    await snTable.clickOnCellByText(table, expectations.before.clickOnCell);

    await test.step('Define expectations', async () => {
      expectation = expectations.navigateWithArrows;
    });
    for await (const step of expectation.steps) {
      await test.step(step.description, async () => {
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
