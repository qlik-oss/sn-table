import { Page } from "@playwright/test";

const playwright = (page: Page) => ({
  async open(url: string) {
    // eslint-disable-next-line playwright/no-networkidle
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="sn-table"] .sn-table-cell-text');
  },
  async screenshot() {
    return page.screenshot();
  },
});

export default playwright;
