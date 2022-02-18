export default (page) => ({
  async open(url) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.MuiTablePagination-selectLabel', { visible: true });
  },
  async screenshot() {
    return page.screenshot();
  },
});
