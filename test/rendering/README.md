# Rendering Test

## Overview

Nebula development serve uses [mocked Qlik core engine (Enigma mocker)](https://github.com/qlik-oss/nebula.js/blob/master/apis/enigma-mocker/README.md) to render the sn-table based on the [testing fixture files](https://github.com/qlik-oss/nebula.js/tree/master/commands/serve/docs).

Testing cases use [Playwright](https://playwright.dev/) to capture screenshots of those rendered charts and match them against each baseline to ensure our charts look as intended.

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

It will spin up a docker container with playwright and enable us to emulate our CI server for updating the reference screenshots. The `--update-snapshots` will generate new screenshots for you.

Make sure to commit these after you've **confirmed the screenshot changes**.

Sometimes tests might break, if you are certain no UI changes have been made just re-run the failed workflow.

    docker stop sn-table-playwright

may need to stop the container first.

## Add test cases

To get the necessary Layout and HyperCubeData for a fixture file, you can find the app used in the rendering case in [data/apps](../../data/apps).

- Add a new testing fixture file in [test/rendering/fixtures](./__fixtures__)
- Check the new test case in [run-rendering-tests] to make sure it work(./utils/run-rendering-tests.ts)
- Add a new baseline image following the steps [above](#updating-snapshots).
- add a new test case description [below](#test-cases-description).

## Test cases description

| Test        | Dimensions | Measures | Other                                                                                                                         |
| ----------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Scenario 1  | 1          | 0        |                                                                                                                               |
| Scenario 2  | 1          | 0        | The total amount of rows is less then or equal to 10                                                                          |
| Scenario 3  | 1          | 1        |                                                                                                                               |
| Scenario 4  | 1          | 1        | Font size and color for header and body                                                                                       |
| Scenario 5  | 1          | 1        | Desc sorted measure. Background and font coloring for a column                                                                |
| Scenario 6  | 1          | 1        | Center-aligned dimension and right-aligned measure                                                                            |
| Scenario 7  | 1          | 1        | Desc sorted dimension                                                                                                         |
| Scenario 8  | 1          | 1        | Desc sorted dimension. The displayed amount of rows is 10                                                                     |
| Scenario 9  | 1          | 1        | The hover font color and background color                                                                                     |
| Scenario 10 | 1          | 1        | The hover font color and background color. Font size and color for header and body                                            |
| Scenario 11 | 1          | 1        | The hover font color and background color. Font size and color for header and body. Background and font coloring for a column |
| Scenario 12 | 1          | 1        | Font size and color for header and body. Scroll to the bottom of the table                                                    |
| Scenario 13 | 1          | 1        | Font size and color for header and body. Show totals at the bottom                                                            |
| Scenario 14 | 1          | 0        | 1M rows of data                                                                                                               |
