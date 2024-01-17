/* eslint-disable playwright/no-conditional-in-test */
import serve, { NebulaServer } from "@nebula.js/cli-serve";
import { expect, test } from "@playwright/test";
import fs from "fs";
import path from "path";

import createPlaywright from "./playwright";
import createNebulaRoutes from "./routes";

const paths = { fixtures: path.join(__dirname, "../__fixtures__") };
const port = 8000;

const runRenderingTests = (theme: object, themeType: string, language: string) => {
  let nebulaServer: NebulaServer;
  let playwright;
  let route: {
    renderFixture: (fixturePath: string) => string;
  };

  // eslint-disable-next-line no-empty-pattern
  test.beforeAll(async ({}, testInfo) => {
    nebulaServer = await serve({
      // the entry is equal to path.resolve(__dirname, '../../dist/sn-table.js'),
      // so before run the testing, yarn build should run first to generate /dist
      entry: path.resolve(__dirname, "../../../"),
      type: "sn-table",
      open: false,
      build: false,
      themes: [
        {
          id: themeType,
          theme,
        },
      ],
      fixturePath: "test/rendering/__fixtures__",
      port: port + testInfo.workerIndex,
    });

    route = createNebulaRoutes(nebulaServer.url);
  });

  test.afterAll(async () => {
    nebulaServer.close();
  });

  // Iterate testing fixture files
  fs.readdirSync(paths.fixtures).forEach((file) => {
    const name = file.replace(".fix.js", "");
    const fixturePath = `./${file}&theme=${themeType}&language=${language}`;

    // Create test case per testing fixture file
    // eslint-disable-next-line playwright/valid-title
    test(name, async ({ page }) => {
      playwright = createPlaywright(page);
      // Render chart based on testing fixture file
      // in Nebula serve using Enigma mocker
      const renderUrl = route.renderFixture(fixturePath);
      // eslint-disable-next-line no-console
      console.log({ renderUrl });
      // Open page in Nebula which renders fixture
      await playwright.open(renderUrl);

      if (name.includes("default")) {
        await page.hover("text=American Beef Bologna");
      } else if (name.includes("styled")) {
        await page.hover("text=Washington Strawberry Drink");
      } else if (name.includes("small_data")) {
        await page.hover("text=Africa");
      } else {
        await page.hover("text=Better Fancy Canned Sardines");
      }

      // Playwright captures screenshot
      const img = await playwright.screenshot();
      // Compare screenshot with baseline image
      expect(img).toMatchSnapshot(`${name}.png`);
    });
  });
};

export default runRenderingTests;
