import { ConsoleMessage, Page } from '@playwright/test';

/* eslint-disable no-console */
const logLevels = [
  // 'info',
  // 'log',
  'warn',
  'error',
];

async function consoleEvent(msg: ConsoleMessage) {
  const type = msg.type();
  if (logLevels.indexOf(type) >= 0) {
    const resolvedArgs = await Promise.all(msg.args().map((arg) => arg.jsonValue()));
    console[type as 'warn' | 'error'](...resolvedArgs);
  }
}

function pageErrorEvent(msg: Error) {
  console.error(msg);
}

const event = {
  addListeners(page: Page) {
    page.on('console', consoleEvent);
    page.on('pageerror', pageErrorEvent);
  },
  removeListeners(page: Page) {
    page.removeListener('console', consoleEvent);
    page.removeListener('pageerror', pageErrorEvent);
  },
};

export default event;
