/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop */
import { Locator, Page } from '@playwright/test';
import { Collection, Key } from '../types';

type KeyPress = {
  key: Key;
  times: number;
};

const selectors: Collection = {
  chart: '#chart-container',
  text: (text: string): string => `text=${text}`,
  focused: 'th[tabindex="0"], td[tabindex="0"]',
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

  async getInnerText(loc: Locator): Promise<string> {
    await loc.isVisible();
    return loc.innerText();
  }

  async getInnerTextAndReplace(loc: Locator, searchValue: string | RegExp, replaceValue: string): Promise<string> {
    let innerText: string = await this.getInnerText(loc);
    innerText = innerText.replace(searchValue, replaceValue);
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
}

export default SnTable;
export { selectors };
