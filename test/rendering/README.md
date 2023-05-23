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

### Scenario 1 (Default properties value)

    Data:
      Columns:
        Product (Dimension), Inventory Amount (Measure), Sales Quantity (Measure), Sum([Sales Price]) (Measure), Sum([CostPrice]) (Measure)

### Scenario 2

    Data:
      Columns:
        Product (Dimension), Inventory Amount (Measure), Sales Quantity (Measure), Sum([Sales Price]) (Measure), Sum([CostPrice]) (Measure)
        Product:
          Field:
            Include null values:
              false
          Presentation:
            Background color expression:
              if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, '#ff0000', '#00ff00')
            Text color expression:
              if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, 'orange', 'purple')
            Text alignment:
              Custom
              Right
            Column width:
              Fit to content
        Inventory Amount:
          Presentation:
            Background color expression:
              if(Sum(StockOH\*CostPrice) < 200, '#ff0000', '#00ff00')
        Sales Quantity:
          Presentation:
            Text color expression:
              if(Sum([Sales Quantity]) < 400, '#ff0000', '#00ff00')
    Sorting:
      Product:
        Sorting:
          Custom
        Sort numerically:
          Descending
        Sort alphabetically:
          Descending
    Appearance:
      General:
        Show titles: false
      Presentation:
        Styling:
          Chart:
            Header:
              Font size: 22
              Font color: #70ba6e
          Content:
            Font size: 10
            Font color: #65d3da
            Row hover: On
        Totals:
          Custom
          Position: Bottom

### Scenario 3

    Data:
      Columns:
        Product (Dimension), Inventory Amount (Measure), Sales Quantity (Measure), Sum([Sales Price]) (Measure), Sum([CostPrice]) (Measure)
        Product:
          Presentation:
            Background color expression:
              if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, '#ff0000', '#00ff00')
            Text color expression:
              if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, 'orange', 'purple')
            Text alignment:
              Custom
              Center
            Column width:
              Pixels:
                200
        Inventory Amount:
          Presentation:
            Background color expression:
              if(Sum(StockOH\*CostPrice) < 200, '#ff0000', '#00ff00')
        Sales Quantity:
          Presentation:
            Text color expression:
              if(Sum([Sales Quantity]) < 400, '#ff0000', '#00ff00')
      Sorting: (change order)
        Inventory Amount
        Product
        …
    Appearance
      Presentation:
        Styling:
          Chart:
            Header:
              Font size: 10
              Font color: #70ba6e
            Content:
              Font size: 8
              Font color: #65d3da
            Row hover: On
              Row hover color: #a54343 (dark color)
      Totals:
        Custom
        Position: None

### Scenario 4

    Data:
      Columns (change orders):
        Inventory Amount (Measure), Product (Dimension), Sales Quantity (Measure), Sum([Sales Price]) (Measure), Sum([CostPrice]) (Measure)
      Inventory Amount:
        Presentation:
          Background color expression:
            if(Sum(StockOH\*CostPrice) < 200, '#ff0000', '#00ff00')
          Text alignment:
            Custom
            Left
          Column width:
            Percentage:
              50
      Product:
        Presentation:
          Background color expression:
            if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, '#ff0000', '#00ff00')
          Text color expression:
            if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, 'orange', 'purple')
      Sales Quantity:
        Presentation:
          Text color expression:
            if(Sum([Sales Quantity]) < 400, '#ff0000', '#00ff00')
    Appearance:
      Presentation:
        Styling:
          Chart:
            Header:
              Font size: 15
              Font color: #70ba6e
            Content:
              Font size: 12
              Font color: #65d3da
            Row hover: On
              Row hover color: #cbe989 (light color)
      Totals: Custom
        Position: Top
        Totals label: Totals label

### Scenario 5

    Data:
      Columns:
        Product (Dimension), Inventory Amount (Measure), Sales Quantity (Measure), Sum([Sales Price]) (Measure), Sum([CostPrice]) (Measure)
        Product:
          Presentation:
            Background color expression:
              if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, '#ff0000', '#00ff00')
            Text color expression:
              if(Sum([Sales Quantity]\*([Sales Price]- [CostPrice])) > 0, 'orange', 'purple')
            Column width:
              Pixels:
                120
        Inventory Amount:
          Presentation:
            Background color expression:
              if(Sum(StockOH\*CostPrice) < 200, '#ff0000', '#00ff00')
            Column width:
              Pixels:
                120
        Sales Quantity:
          Presentation:
            Text color expression:
              if(Sum([Sales Quantity]) < 400, '#ff0000', '#00ff00')
            Column width:
              Pixels:
                120
        Sum([Sales Price]):
          Presentation:
            Column width:
              Pixels:
                120
        Sum([CostPrice]):
          Presentation:
            Show column if:
              0
            Appearance:
              Presentation:
                Styling:
                  Chart:
                    Header:
                      Font size: 22
                      Font color: #578b60
                    Content:
                      Font size: 22
                      Font color: #a54343
                    Row hover: On
                      Row hover color: #709113
                      Row hover Font color: #65d3da
                Totals: Custom
                  Position: Top
                  Totals label:

### Scenario 6

Only for table pagination (less than 100 rows per page hides the pagination footer)

    Data:
      Columns:
        Region (Dimension), Budget (Measure), # of Customers (Measure)
    Appearance:
      Presentation:
        Styling:
          General:
            Title:
              font-size: 20px
              font-family: "Bradley Hand”
              color: rgb(139, 139, 139)
              font-weight: bold
              font-style: italic
              text-decoration: underline
            Subtitle:
              font-size: 15px
              font-family: "Arial Black"
              color: rgb(112, 186, 110)
              font-weight: bold
              font-style: italic;
              text-decoration: underline
            Footnote:
              font-size: 15px
              font-family: "Arial"
              color: rgb(112, 186, 110)
              font-weight: bold
              font-style: italic
              text-decoration: underline

### Scenario 7

Only for table virtualization (more than 250k rows trigger the pagination footer)

Set layout as Scenario 5 and update qHyperCube.qSize.qcy to be 1_000_000.
