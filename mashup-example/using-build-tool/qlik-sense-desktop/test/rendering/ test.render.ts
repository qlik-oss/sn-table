import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // baseURL is set in the config to http://localhost:3000/
  // This will navigate to http://localhost:3000/
  await page.goto('./', { waitUntil: 'networkidle' });
  await page.waitForSelector('.MuiTableBody-root', { state: 'attached' });
  const img = await page.screenshot();
  expect(img).toMatchSnapshot();
});
