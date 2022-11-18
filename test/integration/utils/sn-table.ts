import { Locator, Page, test, expect } from '@playwright/test';

type Collection = { [key: string]: any };
type Key =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Enter'
  | 'Tab'
  | 'Space'
  | 'Control+Space'
  | 'Shift+Tab'
  | 'Meta+Shift+ArrowRight'
  | 'Meta+Shift+ArrowLeft'
  | 'Escape';
type Pagination = 'first' | 'previous' | 'next' | 'last';
type KeyPress = {
  key: Key;
  times: number;
};

const selectors: Collection = {
  chart: '#chart-container',
  header: {
    cells: 'div.cell[class*="active"] thead > tr > th',
    selected: (parent?: string): string => `${parent || 'div.cell[class*="active"]'} th[aria-pressed="true"]`,
  },
  cell: (row: number, column: number, parent?: string): string =>
    `${parent || 'div.cell[class*="active"]'} tbody > tr:nth-child(${row}) > th:nth-child(${column}), ${
      parent || 'div.cell[class*="active"]'
    }  tbody > tr:nth-child(${row}) > td:nth-child(${column})`,
  pagination: {
    rowsPerPage: '[data-testid="RowsPerPage-dropdown"]',
    buttons: '[data-testid="pagination-action-icon-button"]',
    range: 'div[data-testid="table-container"] + div >> div:has-text("of")',
    action: (page: Pagination): string => `[aria-label="Go to the ${page} page"]`,
    pageSelect: '#SelectPage-dropdown',
  },
  refresh: '[tid="selection-toolbar.refresh"]',
  text: (text: string): string => `text=${text}`,
  focused: 'th[tabindex="0"], td[tabindex="0"]',
  selected: '.selected',
};

const textToDelete: string = '\nPress space to sort on this column';

class SnTable {
  readonly page: Page;

  public selectors: Collection;

  constructor(page: Page) {
    this.page = page;
    this.selectors = selectors;
  }

  async getSelectedColumn(parent?: string): Promise<Collection> {
    const loc: Locator = this.page.locator(selectors.header.selected(parent));
    await loc.isVisible();
    const innerText: string = await this.getInnerTextAndReplace(loc, textToDelete, '');
    const sort: string = (await loc.getAttribute('aria-sort')) as string;
    return { innerText, sort };
  }

  async getTableHeaderValues(): Promise<string[]> {
    return this.getTextFromLocator('body', selectors.header.cells);
  }

  async getTextFromLocator(parent: Locator | string, child: Locator | string): Promise<string[]> {
    let parentLocator: Locator;
    let childLocator: Locator;

    if (typeof parent === 'string') parentLocator = this.page.locator(parent);
    else parentLocator = parent;
    if (typeof child === 'string') childLocator = parentLocator.locator(child);
    else childLocator = child;

    const workArray: string[] = [];
    const lenght: number = await childLocator.count();
    for (let i = 0; i < lenght; i++) {
      const element: Locator = childLocator.nth(i);
      const innerText: string = await this.getInnerTextAndReplace(element, textToDelete, '');
      workArray.push(innerText);
    }
    return workArray;
  }

  async getCellValuesFromTableBody(arr: number[][] = [[1, 1]], selector?: string): Promise<string[]> {
    const length: number = arr.length;
    const values: string[] = [];
    if (length === 1) {
      const loc: Locator = this.page.locator(selectors.cell(arr[0][0], arr[0][1], selector));
      const val: string = await this.getInnerText(loc);
      values.push(val);
    }
    if (length === 2) {
      const workArray: any[] = [];
      const [startX, startY] = arr[0];
      const [endX, endY] = arr[1];
      for (let i: number = startX; i <= endX; i++) {
        for (let j: number = startY; j <= endY; j++) {
          workArray.push([i, j]);
        }
      }
      for await (const iterator of workArray) {
        const loc: Locator = this.page.locator(selectors.cell(iterator[0], iterator[1], selector));
        const val: string = await this.getInnerText(loc);
        values.push(val);
      }
    }
    if (length > 2) {
      for await (const iterator of arr) {
        const val: string = await this.getInnerText(
          this.page.locator(selectors.cell(iterator[0], iterator[1], selector))
        );
        values.push(val);
      }
    }
    return values;
  }

  async getInnerText(loc: Locator): Promise<string> {
    await loc.isVisible();
    return loc.innerText();
  }

  async getInnerTextAndReplace(loc: Locator, searchValue: string | RegExp, replaceValue: string): Promise<string> {
    let innerText: string = await this.getInnerText(loc);
    innerText = innerText.replaceAll(searchValue, replaceValue);
    return innerText;
  }

  getCellByText(loc: Locator, text: string): Locator {
    return loc.locator(selectors.text(text));
  }

  async clickOnCellByText(loc: Locator, text: string): Promise<void> {
    const target: Locator = this.getCellByText(loc, text);
    const firstTarget: Locator = target.first();
    await firstTarget.click();
  }

  // pagination:
  async setRowsPerPage(loc: Locator, rows: number): Promise<void> {
    const select: Locator = loc.locator(selectors.pagination.rowsPerPage);
    await select.selectOption(String(rows));
  }

  async getRange(loc: Locator): Promise<string> {
    const element: Locator = loc.locator(selectors.pagination.range);
    return element.innerText();
  }

  async getPaginationButtonsStatuses(loc: Locator): Promise<string[]> {
    const arr: any[] = [];
    const elements: Locator = loc.locator(selectors.pagination.buttons);
    for (let i = 0; i < (await elements.count()); i++) {
      const element = elements.nth(i);
      arr.push((await element.getAttribute('aria-disabled')) as string);
    }
    return arr;
  }

  // keyboard:
  async getFocusedCellsText(loc: Locator): Promise<string> {
    const cell = loc.locator(selectors.focused);
    await cell.first().isVisible();
    return this.getInnerTextAndReplace(cell, textToDelete, '');
  }

  async getSelectedCellsText(loc: Locator): Promise<string[]> {
    return this.getTextFromLocator(loc, selectors.selected);
  }

  async getActualPage(loc: Locator): Promise<number> {
    const select = loc.locator(selectors.pagination.pageSelect);
    return parseInt(await select.inputValue(), 10) + 1;
  }

  async pressKeys(steps: KeyPress[]): Promise<void> {
    const step: Collection | undefined = steps.shift();
    for (let i = 0; i < step?.times; i++) {
      await this.page.keyboard.press(step?.key);
    }
    if (steps.length) await this.pressKeys(steps);
  }

  // test
  async pressKeysAndWaitThenCheckSelectedAndFocusedText(table: Locator, expectation: Collection): Promise<void> {
    for await (const step of expectation.steps) {
      await test.step('Do actions', async () => {
        await this.pressKeys(step.keys);
        await this.page.locator(step.waitFor.selector).waitFor(step.waitFor.options);
      });
      await test.step('Check expectations', async () => {
        await expect.poll(async () => this.getSelectedCellsText(table)).toMatchObject(step.selected);
        await expect.poll(async () => this.getFocusedCellsText(table)).toBe(step.focused);
      });
    }
  }
}

export default SnTable;
export { selectors };
