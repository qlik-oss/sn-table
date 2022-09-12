import { test } from '@playwright/test';

import runRenderingTests from './run-rendering-tests';

const customTheme = {
  straightTable: {
    header: {
      fontSize: '20px',
      color: 'rgba(0,0,0,0.87)',
      fontFamily: 'sans-serif',
    },
    content: {
      fontSize: '16px',
      color: 'rgba(57, 49, 222, 0.87)',
      fontFamily: 'sans-serif',
      hover: {
        backgroundColor: 'rgba(121,222,49,0.7)',
        color: 'rgba(171,205,239,0.5)',
      },
    },
  },
  backgroundColor: 'rgba(200,200,200,0.3)',
};

test.describe('sn table: rendering tests with a custom theme and the english', () => {
  runRenderingTests(customTheme, 'test', 'en-US');
});
