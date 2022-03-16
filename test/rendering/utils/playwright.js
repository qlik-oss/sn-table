module.exports = (page) => ({
  async open(url) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('.MuiTablePagination-selectLabel', { visible: true });
  },
  async screenshot() {
    return page.screenshot();
  },
});
