import { Page } from '@playwright/test';

const playwright = (page: Page) => ({
  open: async (url: string) => {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="sn-table"] .sn-table-cell-text');
  },
});

export default playwright;
