import { Page } from '@playwright/test';

export const focusedText = (page: Page) => page.locator('*:focus').innerText();

export const isSVG = async (page: Page) => {
  const index = (await page.locator('*:focus').innerHTML()).match(/svg/)?.index;
  if (index && index > 0) return true;
  return false;
};

export const isOption = async (page: Page) => {
  const index = (await page.locator('*:focus').innerHTML()).match(/option/)?.index;
  if (index && index > 0) return true;
  return false;
};
