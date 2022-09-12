import { test } from '@playwright/test';

import runRenderingTests from './run-rendering-tests';
import senseHorizon from './theme/sense-horizon';

test.describe('sn table: rendering tests with a dark theme and the swedish', () => {
  runRenderingTests(senseHorizon('dark'), 'dark', 'sv-SE');
});
