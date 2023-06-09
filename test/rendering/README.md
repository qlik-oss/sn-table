# Rendering Test

## Overview

Nebula development serve uses [mocked Qlik core engine (Enigma mocker)](https://github.com/qlik-oss/nebula.js/blob/master/apis/enigma-mocker/README.md) to render the sn-table based on the [testing fixture files](https://github.com/qlik-oss/nebula.js/tree/master/commands/serve/docs).

Testing cases use [Playwright](https://playwright.dev/) to capture screenshots of those rendered charts and match them against each baseline to ensure our charts look as intended.
Each fixture runs three times to cover three different browsers (chromium, firefox, safari)

Visual regression testing flow:

1. Start Nebula development serve and launch Playwright
2. Iterate testing fixture files
3. Create test case per testing fixture file
4. Render a chart based on testing fixture file in Nebula serve using Enigma mocker
5. Capture screenshot by Playwright
6. Compare the screenshot with a baseline image

> Note: To capture same screenshot on the same operating system both locally and on a CI server, we use the Playwright Docker image to run the tests in a pre-configured environment. More info can be found [here](https://playwright.dev/docs/docker).

## Updating snapshots

If you've updated the UI, you need to run the update screenshots script:

    # Install dependencies
    yarn --frozen-lockfile

    # Build nebula.js visualization
    yarn build

    chmod 777 ./test/rendering/scripts/run-rendering-tests.sh
    yarn test:local:update:screenshots

It will spin up a docker container with playwright and enable us to emulate our CI server for updating the reference screenshots.
The `--update-snapshots` will generate new screenshots for you.
This also works for creating the initial screenshot for a new test.

Make sure to commit these after you've **confirmed the screenshot changes**.

Sometimes tests might break, if you are certain no UI changes have been made just re-run the failed workflow.

    docker stop sn-table-playwright

may need to stop the container first.

## Add test cases

To keep the number of screenshots to a minimum without losing coverage, we test as many features as possible per scenario.
Adding a new scenario creates at least 6 new images (3 browsers \* 2 fixtures, one for each pagination mode (on/off)).
Therefor, start by trying to change the existing fixtures before adding a new one.

To get the necessary Layout and HyperCubeData for a fixture files, you can find the app used in the rendering case in [data/apps](../../data/apps).
Each chart on the "straight table rendering testing" sheet, maps to a fixture.

- Update an existing chart or add a new chart to the app. Note that there needs to be two charts with the same settings,
  except one has to be in pagination mode.
- Update or add a new testing fixture file in [test/rendering/fixtures](./__fixtures__)
- Check the test case in [run-rendering-tests](`./utils/run-rendering-tests.ts`) to make sure it works
- Update or add new baseline image(s) following the steps [above](#updating-snapshots).
- Update the [coverd features list](#covered-features-list) and [test cases description](#test-cases-description).

## Covered feature list

- Table virtualization (more than 250k rows trigger the pagination footer)
- Table pagination (less than 100 rows hide the pagination footer)
- Sorting
- Column order
- Column width (Auto, Fit to content, Pixels, Percentage)
- Hide column
- Background color, font color, and font size. Both for header and content
- Hovering background color and hovering font color
- Column background color and font color with expression
- Text alignment (Auto, Left, Center, Right)
- Totals (label name, whether to display the totals and their placement)
- Chart title, subtitle, and footnote

### Test cases description

| Test       | Tested features                                                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scenario 1 | Default values with chart title, subtitle and footer                                                                                                                             |
| Scenario 2 | Content and header styling (using palette colors), text alignment, column width (all four different types), column coloring, default hover coloring, totals placed at the bottom |
| Scenario 3 | Small data set, content and header styling (custom colors), hover background color, minimum column width, totals hidden                                                          |
| Scenario 4 | Big data set (hacked by setting qHyperCube.qSize.qcy to 1_000_000), reordered columns, hidden column, sorting, custom totals label,                                              |
