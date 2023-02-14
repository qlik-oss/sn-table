module.exports = (page) => ({
  async open(url) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="sn-table"] .sn-table-cell-text', { visible: true });
  },
  async screenshot() {
    return page.screenshot();
  },
});
