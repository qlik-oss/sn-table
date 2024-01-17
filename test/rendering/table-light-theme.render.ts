import { test } from "@playwright/test";

import senseHorizon from "./theme/sense-horizon";
import runRenderingTests from "./utils/run-rendering-tests";

test.describe("sn table: rendering tests with a light theme and the english", () => {
  runRenderingTests(senseHorizon(), "light", "en-US");
});
