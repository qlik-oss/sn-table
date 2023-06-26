import { test } from '@playwright/test';

import runRenderingTests from './utils/run-rendering-tests';
import senseHorizon from './theme/sense-horizon';

test.describe('sn table: rendering tests with a light theme and the english', () => {
  runRenderingTests(senseHorizon(), 'light', 'en-US');
});
