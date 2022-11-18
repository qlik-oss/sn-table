import { test } from '@playwright/test';

import runIntegrationTests from './utils/run-integration-tests';
import senseHorizon from '../rendering/theme/sense-horizon';

// test.describe('sn table: rendering tests with a light theme and the italian', () => {
test.describe('sn table: integration tests for keyboard commands', () => {
  runIntegrationTests(senseHorizon('light'), 'light', 'en-EN');
});
