# Rendering Test

## Overview

Nebula development serve uses [mocked Qlik core engine (Enigma mocker)](https://github.com/qlik-oss/nebula.js/blob/master/apis/enigma-mocker/README.md) to render the sn-table based on the [testing fixture files](https://github.com/qlik-oss/nebula.js/tree/master/commands/serve/docs).

Testing cases use [Playwright](https://playwright.dev/) to capture screenshots of those rendered charts and matches against baseline to ensure our charts look as intended.

Visual regression testing flow:

1. Start Nebula development serve and launch Playwright
2. Iterate testing fixture files
3. Create test case per testing fixture file
4. Render a chart based on testing fixture file in Nebula serve using Enigma mocker
5. Capture screenshot by Playwright
6. Compare screenshot with baseline image

> Note: To capture same screenshot on the same operating system both locally and on a CI server, we use the Playwright Docker image to run the tests in a preconfigured environment. More info can be found [here](https://playwright.dev/docs/docker).

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

scenario_1.fix.js:
one dimension

scenario_2.fix.js:
one dimension,
the total amount of rows is less then or equal to 10

scenario_3.fix.js:
one dimension,
one measure

scenario_4.fix.js:
one dimension,
one measure,
font size and color for header and body

scenario_5.fix.js:
one dimension,
one desc sorted measure,
Background and font coloring for a column

scenario_6.fix.js:
one center-aligned dimension,
one right-aligned measure,

scenario_7.fix.js:
one desc sorted dimension,
one measure

scenario_8.fix.js:
one desc sorted dimension,
one measure,
the displayed amount of rows is 10

scenario_9.fix.js:
one dimension,
one measure,
the hover font color and background color

scenario_10.fix.js:
one dimension,
one measure,
the hover font color and background color,
font size and color for header and body

scenario_11.fix.js:
one dimension,
one measure,
the hover font color and background color,
font size and color for header and body,
Background and font coloring for a column

scenario_12.fix.js:
one dimension,
one measure,
font size and color for header and body
scroll to the bottom of the table

scenario_13.fix.js:
one dimension,
one measure,
font size and color for header and body,
show totals at the bottom
